import { signInAnonymously } from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import {
  getFirebaseAuthClient,
  getFirestoreClient,
} from '../../../shared/config/firebaseClient';
import type {
  PresenceSessionRecord,
  UserRole,
  VisitorCategory,
} from '../../../shared/types/domain';

const LOCAL_PRESENCE_KEY = 'justy_presence_sessions_v1';

export const VISITOR_CATEGORY_LABELS: Record<VisitorCategory, string> = {
  estudante: 'Estudante',
  professor: 'Professor(a)',
  coordenador: 'Coordenador(a)',
  diretor: 'Diretor(a)',
  dre: 'Representante da DRE',
  outro: 'Outro / Visitante',
};

export function mapAuthRoleToVisitorCategory(role?: UserRole): VisitorCategory {
  if (role === 'coordenador') return 'coordenador';
  if (role === 'diretor') return 'diretor';
  if (role === 'professor' || role === 'super_admin') return 'professor';
  if (role === 'lider' || role === 'student') return 'estudante';
  return 'outro';
}

export function defaultGroupForCategory(category: VisitorCategory): string {
  switch (category) {
    case 'professor':
      return 'Docente';
    case 'coordenador':
      return 'Coordenação';
    case 'diretor':
      return 'Direção Escolar';
    case 'dre':
      return 'DRE / Seduc-MT';
    case 'outro':
      return 'Comunidade / Visitante';
    case 'estudante':
      return '9º Ano A';
  }
}

async function ensurePresenceAuth(): Promise<void> {
  const auth = getFirebaseAuthClient();
  if (auth && !auth.currentUser) {
    await signInAnonymously(auth).catch(() => undefined);
  }
}

function loadLocalPresence(): PresenceSessionRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_PRESENCE_KEY);
    return raw ? (JSON.parse(raw) as PresenceSessionRecord[]) : [];
  } catch {
    return [];
  }
}

function saveLocalPresence(items: PresenceSessionRecord[]): void {
  try {
    localStorage.setItem(LOCAL_PRESENCE_KEY, JSON.stringify(items.slice(0, 200)));
  } catch {
    // ignore storage errors
  }
}

function upsertLocalSession(record: PresenceSessionRecord): void {
  const next = [record, ...loadLocalPresence().filter((s) => s.id !== record.id)];
  saveLocalPresence(next);
}

function mergeSessions(lists: PresenceSessionRecord[][]): PresenceSessionRecord[] {
  const map = new Map<string, PresenceSessionRecord>();
  for (const list of lists) {
    for (const item of list) {
      const existing = map.get(item.id);
      if (!existing || item.lastSeenAt >= existing.lastSeenAt) {
        map.set(item.id, item);
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.lastSeenAt - a.lastSeenAt);
}

export async function startPresenceSession(input: {
  name: string;
  category: VisitorCategory;
  classGroup: string;
  age?: number;
  area: PresenceSessionRecord['area'];
  activeCommunityTitle?: string;
  activeTheme?: string;
}): Promise<string> {
  const now = Date.now();
  const id = `ses_${now}_${Math.random().toString(36).slice(2, 7)}`;
  const record: PresenceSessionRecord = {
    id,
    name: input.name.trim() || 'Visitante',
    category: input.category,
    classGroup: input.classGroup.trim() || defaultGroupForCategory(input.category),
    ...(typeof input.age === 'number' ? { age: input.age } : {}),
    startedAt: now,
    lastSeenAt: now,
    activeCommunityTitle: input.activeCommunityTitle || '',
    activeTheme: input.activeTheme || '',
    area: input.area,
    isOnline: true,
  };

  upsertLocalSession(record);
  const db = getFirestoreClient();
  if (db) {
    await ensurePresenceAuth();
    await setDoc(doc(db, 'presence_sessions', id), record, { merge: true }).catch(() => undefined);
  }
  return id;
}

export async function heartbeatPresenceSession(
  sessionId: string,
  updates?: { activeCommunityTitle?: string; activeTheme?: string }
): Promise<void> {
  if (!sessionId) return;
  const now = Date.now();
  const existing = loadLocalPresence().find((s) => s.id === sessionId);
  if (existing) {
    upsertLocalSession({
      ...existing,
      lastSeenAt: now,
      isOnline: true,
      ...(updates?.activeCommunityTitle !== undefined
        ? { activeCommunityTitle: updates.activeCommunityTitle }
        : {}),
      ...(updates?.activeTheme !== undefined ? { activeTheme: updates.activeTheme } : {}),
    });
  }

  const db = getFirestoreClient();
  if (db) {
    await ensurePresenceAuth();
    await setDoc(
      doc(db, 'presence_sessions', sessionId),
      {
        lastSeenAt: now,
        isOnline: true,
        ...(updates?.activeCommunityTitle !== undefined
          ? { activeCommunityTitle: updates.activeCommunityTitle }
          : {}),
        ...(updates?.activeTheme !== undefined ? { activeTheme: updates.activeTheme } : {}),
      },
      { merge: true }
    ).catch(() => undefined);
  }
}

export async function endPresenceSession(sessionId: string): Promise<void> {
  if (!sessionId) return;
  const now = Date.now();
  const existing = loadLocalPresence().find((s) => s.id === sessionId);
  if (existing) {
    upsertLocalSession({ ...existing, isOnline: false, endedAt: now, lastSeenAt: now });
  }

  const db = getFirestoreClient();
  if (db) {
    await ensurePresenceAuth();
    await setDoc(
      doc(db, 'presence_sessions', sessionId),
      { isOnline: false, endedAt: now, lastSeenAt: now },
      { merge: true }
    ).catch(() => undefined);
  }
}

export function isSessionActiveOnline(
  session: Pick<PresenceSessionRecord, 'isOnline' | 'lastSeenAt'>,
  now = Date.now()
): boolean {
  return Boolean(session.isOnline) && now - session.lastSeenAt < 75_000;
}

export function formatLoggedDuration(
  startedAt: number,
  lastSeenAt: number,
  endedAt?: number,
  isOnline?: boolean,
  now = Date.now()
): string {
  const active = Boolean(isOnline) && now - lastSeenAt < 75_000;
  const end = active ? Math.max(startedAt, now) : Math.max(startedAt, endedAt || lastSeenAt);
  const totalSec = Math.max(0, Math.floor((end - startedAt) / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}h ${pad(m)}m ${pad(s)}s` : `${pad(m)}m ${pad(s)}s`;
}

export function subscribePresenceSessions(
  onUpdate: (sessions: PresenceSessionRecord[]) => void
): () => void {
  onUpdate(mergeSessions([loadLocalPresence()]));
  const db = getFirestoreClient();
  if (!db) return () => undefined;

  let active = true;
  let unsubscribe = () => undefined;

  void ensurePresenceAuth().then(() => {
    if (!active) return;
    unsubscribe = onSnapshot(
      collection(db, 'presence_sessions'),
      (snap) => {
        const remote = snap.docs.map(
          (d) => ({ id: d.id, ...(d.data() as Omit<PresenceSessionRecord, 'id'>) })
        );
        onUpdate(mergeSessions([loadLocalPresence(), remote]));
      },
      () => {
        onUpdate(mergeSessions([loadLocalPresence()]));
      }
    );
  });

  return () => {
    active = false;
    unsubscribe();
  };
}
