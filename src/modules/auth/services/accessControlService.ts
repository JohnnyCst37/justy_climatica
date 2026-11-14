import { signInAnonymously } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import {
  getFirebaseAuthClient,
  getFirestoreClient,
} from '../../../shared/config/firebaseClient';
import type {
  AuthorizedEmailEntry,
  AuthorizedEmailRole,
  UserProfile,
  UserRole,
} from '../../../shared/types/domain';

const LOCAL_AUTHORIZED_EMAILS_KEY = 'justy_authorized_emails_v1';

export const ROLE_LABELS: Record<AuthorizedEmailRole, string> = {
  super_admin: 'Super Admin',
  diretor: 'Diretor(a)',
  coordenador: 'Coordenador(a)',
  professor: 'Professor(a)',
  lider: 'Aluno(a) Líder',
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getSeedSuperAdminEntries(): AuthorizedEmailEntry[] {
  const envRaw = String(import.meta.env.VITE_SUPER_ADMIN_EMAILS || '');
  const extra = envRaw
    .split(',')
    .map(normalizeEmail)
    .filter((e) => e.includes('@'));
  const seeds = Array.from(new Set(['fernandesjohnnys@gmail.com', ...extra]));

  return seeds.map((email) => ({
    email,
    name: 'Super Admin · EE CM João Ribeiro Vilela',
    role: 'super_admin',
    classGroup: 'ADMIN-GERAL',
    status: 'approved',
    addedByEmail: 'system-seed',
    createdAt: 1730000000000,
  }));
}

function loadLocalEntries(): AuthorizedEmailEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_AUTHORIZED_EMAILS_KEY);
    return raw ? (JSON.parse(raw) as AuthorizedEmailEntry[]) : [];
  } catch {
    return [];
  }
}

function saveLocalEntries(entries: AuthorizedEmailEntry[]): void {
  try {
    localStorage.setItem(LOCAL_AUTHORIZED_EMAILS_KEY, JSON.stringify(entries));
  } catch {
    // ignore storage quota errors
  }
}

function upsertLocalEntry(entry: AuthorizedEmailEntry): void {
  const clean = normalizeEmail(entry.email);
  const next = [entry, ...loadLocalEntries().filter((i) => normalizeEmail(i.email) !== clean)];
  saveLocalEntries(next);
}

function mergeEntries(groups: AuthorizedEmailEntry[][]): AuthorizedEmailEntry[] {
  const map = new Map<string, AuthorizedEmailEntry>();
  for (const group of groups) {
    for (const item of group) {
      const clean = normalizeEmail(item.email);
      if (clean) {
        map.set(clean, { ...item, email: clean });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
}

export function isStaffRole(role?: UserRole): boolean {
  return (
    role === 'super_admin' ||
    role === 'diretor' ||
    role === 'coordenador' ||
    role === 'professor'
  );
}

export function canAccessSubmissionPortal(user: UserProfile | null): boolean {
  return (
    Boolean(user?.email) &&
    !user?.pendingApproval &&
    (isStaffRole(user?.role) || user?.role === 'lider')
  );
}

export async function listAuthorizedEmails(): Promise<AuthorizedEmailEntry[]> {
  const seeds = getSeedSuperAdminEntries();
  const local = loadLocalEntries();
  const db = getFirestoreClient();

  if (!db) {
    return mergeEntries([local, seeds]);
  }

  try {
    const snap = await getDocs(collection(db, 'authorized_emails'));
    const remote = snap.docs.map((d) => d.data() as AuthorizedEmailEntry);
    return mergeEntries([local, remote, seeds]);
  } catch {
    return mergeEntries([local, seeds]);
  }
}

export async function findAuthorizedEmail(email: string): Promise<AuthorizedEmailEntry | null> {
  const clean = normalizeEmail(email);
  if (!clean || !clean.includes('@')) return null;

  const seedMatch = getSeedSuperAdminEntries().find((s) => s.email === clean);
  if (seedMatch) return seedMatch;

  const db = getFirestoreClient();
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'authorized_emails', clean));
      if (snap.exists()) {
        const remote = { ...(snap.data() as AuthorizedEmailEntry), email: clean };
        upsertLocalEntry(remote);
        return remote;
      }
    } catch {
      // fall back to local cache
    }
  }

  const localMatch = loadLocalEntries().find((l) => normalizeEmail(l.email) === clean);
  return localMatch ? { ...localMatch, email: clean } : null;
}

export async function addAuthorizedEmail(
  input: { email: string; name: string; role: AuthorizedEmailRole; classGroup?: string },
  actorEmail: string
): Promise<AuthorizedEmailEntry> {
  const cleanEmail = normalizeEmail(input.email);
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error('Informe um e-mail válido.');
  }

  const entry: AuthorizedEmailEntry = {
    email: cleanEmail,
    name: input.name.trim() || cleanEmail.split('@')[0],
    role: input.role,
    classGroup: input.classGroup?.trim() || undefined,
    status: 'approved',
    addedByEmail: normalizeEmail(actorEmail) || 'super_admin',
    createdAt: Date.now(),
  };

  upsertLocalEntry(entry);
  const db = getFirestoreClient();
  if (db) {
    await setDoc(doc(db, 'authorized_emails', cleanEmail), entry).catch(() => undefined);
  }
  return entry;
}

export async function requestAccessRegistration(input: {
  email: string;
  name: string;
  role: AuthorizedEmailRole;
  classGroup?: string;
}): Promise<AuthorizedEmailEntry> {
  const cleanEmail = normalizeEmail(input.email);
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error('Informe um e-mail válido para solicitar acesso.');
  }

  const existing = await findAuthorizedEmail(cleanEmail);
  if (existing && (existing.role === 'super_admin' || existing.status !== 'pending')) {
    return existing;
  }

  const auth = getFirebaseAuthClient();
  if (auth && !auth.currentUser) {
    await signInAnonymously(auth).catch(() => undefined);
  }

  const entry: AuthorizedEmailEntry = {
    email: cleanEmail,
    name: input.name.trim() || cleanEmail.split('@')[0],
    role: input.role === 'super_admin' ? 'professor' : input.role,
    classGroup: input.classGroup?.trim() || undefined,
    status: 'pending',
    addedByEmail: 'auto-cadastro',
    createdAt: Date.now(),
  };

  upsertLocalEntry(entry);
  const db = getFirestoreClient();
  if (db) {
    await setDoc(doc(db, 'authorized_emails', cleanEmail), entry).catch(() => undefined);
  }
  return entry;
}

export async function approveAuthorizedEmail(email: string, approverEmail: string): Promise<void> {
  const cleanEmail = normalizeEmail(email);
  const existing = await findAuthorizedEmail(cleanEmail);
  if (!existing) {
    throw new Error('Solicitação não encontrada.');
  }

  const updated: AuthorizedEmailEntry = {
    ...existing,
    status: 'approved',
    addedByEmail: normalizeEmail(approverEmail) || 'super_admin',
  };

  upsertLocalEntry(updated);
  const db = getFirestoreClient();
  if (db) {
    await setDoc(doc(db, 'authorized_emails', cleanEmail), updated).catch(() => undefined);
  }
}

export async function removeAuthorizedEmail(email: string): Promise<void> {
  const cleanEmail = normalizeEmail(email);
  if (getSeedSuperAdminEntries().some((s) => s.email === cleanEmail)) {
    throw new Error('O Super Admin principal não pode ser removido.');
  }

  saveLocalEntries(loadLocalEntries().filter((i) => normalizeEmail(i.email) !== cleanEmail));
  const db = getFirestoreClient();
  if (db) {
    await deleteDoc(doc(db, 'authorized_emails', cleanEmail)).catch(() => undefined);
  }
}
