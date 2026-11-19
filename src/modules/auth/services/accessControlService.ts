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
  cobertura: 'Cobertura da Galeria (Live)',
  lider: 'Aluno(a) Líder',
};

export const SCHOOL_CLASS_OPTIONS = [
  '6º Ano A',
  '6º Ano B',
  '6º Ano C',
  '6º Ano D',
  '7º Ano A',
  '7º Ano B',
  '7º Ano C',
  '7º Ano D',
  '8º Ano A',
  '8º Ano B',
  '8º Ano C',
  '8º Ano D',
  '9º Ano A',
  '9º Ano B',
  '9º Ano C',
  '9º Ano D',
];

export const SCHOOL_GRADE_GROUPS: Array<{ label: string; value: string }> = [
  { label: '+ 6º Ano (A-D)', value: '6º Ano A, 6º Ano B, 6º Ano C, 6º Ano D' },
  { label: '+ 7º Ano (A-D)', value: '7º Ano A, 7º Ano B, 7º Ano C, 7º Ano D' },
  { label: '+ 8º Ano (A-D)', value: '8º Ano A, 8º Ano B, 8º Ano C, 8º Ano D' },
  { label: '+ 9º Ano (A-D)', value: '9º Ano A, 9º Ano B, 9º Ano C, 9º Ano D' },
];

export function mergeClassSelection(current: string, addition: string): string {
  const existing = current
    .split(/[,;/]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const incoming = addition
    .split(/[,;/]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  return Array.from(new Set([...existing, ...incoming])).join(', ');
}

const DEFAULT_CLASS_PILLS = ['9º Ano A', '9º Ano B', '9º Ano C', '9º Ano D'];

const GENERIC_CLASS_MARKERS = new Set([
  'ADMIN-GERAL',
  'PROFESSOR(A)',
  'SUPER ADMIN',
  'COORDENADOR(A)',
  'DIRETOR(A)',
  'ALUNO(A) LÍDER',
  'DOCENTE',
  'NOVO-CADASTRO',
  '9ANO-MT',
]);

/** Extracts quick-select class pills from a teacher/student classGroup string. */
export function parseTeacherClasses(raw?: string): string[] {
  if (!raw) return DEFAULT_CLASS_PILLS;
  const parts = raw
    .split(/[,;/]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && !GENERIC_CLASS_MARKERS.has(item.toUpperCase()));
  return parts.length > 0 ? Array.from(new Set(parts)) : DEFAULT_CLASS_PILLS;
}

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
    name:
      email === 'fernandesjohnnys@gmail.com'
        ? 'Prof. Johnny Fernandes · Super Admin'
        : 'Super Admin · EE CM João Ribeiro Vilela',
    role: 'super_admin',
    classGroup: '9º Ano A, 9º Ano B, 9º Ano C, 9º Ano D',
    status: 'approved',
    addedByEmail: 'system-seed',
    createdAt: 1730000000000,
  }));
}

function getPreapprovedSeedStaffEntries(): AuthorizedEmailEntry[] {
  return [
    {
      email: 'kksbarros@gmail.com',
      name: 'Prof.ª KKS Barros',
      role: 'professor',
      classGroup: '9º Ano A, 9º Ano B, 9º Ano C, 9º Ano D',
      status: 'approved',
      addedByEmail: 'fernandesjohnnys@gmail.com',
      createdAt: 1730000001000,
    },
  ];
}

function toCleanFirestoreDoc(entry: AuthorizedEmailEntry): Record<string, string | number> {
  const docData: Record<string, string | number> = {
    email: entry.email,
    name: entry.name,
    role: entry.role,
    classGroup: entry.classGroup || (entry.role === 'cobertura' ? 'Cobertura Live' : '9º Ano A, 9º Ano B, 9º Ano C, 9º Ano D'),
    status: entry.status || 'approved',
    addedByEmail: entry.addedByEmail,
    createdAt: entry.createdAt,
  };
  return docData;
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

export function canAccessCoverageStudio(user: UserProfile | null): boolean {
  return (
    Boolean(user?.email) &&
    !user?.pendingApproval &&
    (user?.role === 'cobertura' || user?.role === 'super_admin')
  );
}

async function ensureFirebaseSession(): Promise<void> {
  const auth = getFirebaseAuthClient();
  if (auth && !auth.currentUser) {
    await signInAnonymously(auth).catch(() => undefined);
  }
}

export async function listAuthorizedEmails(): Promise<AuthorizedEmailEntry[]> {
  const seeds = [...getSeedSuperAdminEntries(), ...getPreapprovedSeedStaffEntries()];
  const local = loadLocalEntries();
  const db = getFirestoreClient();

  if (!db) {
    return mergeEntries([local, seeds]);
  }

  try {
    await ensureFirebaseSession();
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
      await ensureFirebaseSession();
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
  if (localMatch) return { ...localMatch, email: clean };
  const preapproved = getPreapprovedSeedStaffEntries().find((s) => s.email === clean);
  return preapproved || null;
}

export async function addAuthorizedEmail(
  input: { email: string; name: string; role: AuthorizedEmailRole; classGroup?: string },
  actorEmail: string
): Promise<AuthorizedEmailEntry> {
  const cleanEmail = normalizeEmail(input.email);
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error('Informe um e-mail válido.');
  }

  const resolvedClassGroup =
    input.classGroup?.trim() ||
    (input.role === 'cobertura' ? 'Cobertura Live' : '9º Ano A, 9º Ano B, 9º Ano C, 9º Ano D');

  const entry: AuthorizedEmailEntry = {
    email: cleanEmail,
    name: input.name.trim() || cleanEmail.split('@')[0],
    role: input.role,
    classGroup: resolvedClassGroup,
    status: 'approved',
    addedByEmail: normalizeEmail(actorEmail) || 'super_admin',
    createdAt: Date.now(),
  };

  upsertLocalEntry(entry);
  const db = getFirestoreClient();
  if (db) {
    await ensureFirebaseSession();
    await setDoc(doc(db, 'authorized_emails', cleanEmail), toCleanFirestoreDoc(entry)).catch(() => undefined);
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

  await ensureFirebaseSession();

  const resolvedRole = input.role === 'super_admin' ? 'professor' : input.role;
  const resolvedClassGroup =
    input.classGroup?.trim() ||
    (resolvedRole === 'cobertura' ? 'Cobertura Live' : '9º Ano A, 9º Ano B, 9º Ano C, 9º Ano D');

  const entry: AuthorizedEmailEntry = {
    email: cleanEmail,
    name: input.name.trim() || cleanEmail.split('@')[0],
    role: resolvedRole,
    classGroup: resolvedClassGroup,
    status: 'pending',
    addedByEmail: 'auto-cadastro',
    createdAt: Date.now(),
  };

  upsertLocalEntry(entry);
  const db = getFirestoreClient();
  if (db) {
    await setDoc(doc(db, 'authorized_emails', cleanEmail), toCleanFirestoreDoc(entry)).catch(() => undefined);
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
    classGroup: existing.classGroup?.trim() || (existing.role === 'cobertura' ? 'Cobertura Live' : '9º Ano A, 9º Ano B, 9º Ano C, 9º Ano D'),
    status: 'approved',
    addedByEmail: normalizeEmail(approverEmail) || 'super_admin',
  };

  upsertLocalEntry(updated);
  const db = getFirestoreClient();
  if (db) {
    await ensureFirebaseSession();
    await setDoc(doc(db, 'authorized_emails', cleanEmail), toCleanFirestoreDoc(updated)).catch(() => undefined);
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
    await ensureFirebaseSession();
    await deleteDoc(doc(db, 'authorized_emails', cleanEmail)).catch(() => undefined);
  }
}
