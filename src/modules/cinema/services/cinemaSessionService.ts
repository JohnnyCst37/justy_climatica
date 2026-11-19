import { signInAnonymously } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  getFirebaseAuthClient,
  getFirestoreClient,
} from '../../../shared/config/firebaseClient';
import type {
  CinemaPlaylistVideo,
  CinemaSessionRecord,
  CommunityNode,
  QuizQuestion,
  SchoolWork,
  ThemeSessionKey,
} from '../../../shared/types/domain';
import { drawFiveQuestions } from '../../quiz/services/quizSelector';

const LOCAL_CINEMA_SESSIONS_KEY = 'justy_cinema_sessions_v1';
const LOCAL_WORKS_KEY = 'justy_school_works_v1';

export const CINEMA_THEME_LABELS: Record<ThemeSessionKey, string> = {
  justica: 'Justiça Climática (Sala 10)',
  comunidades: 'Comunidades & Saberes Tradicionais',
  biodiversidade: 'Biodiversidade & Ciência Clara',
};

function loadLocalSessions(): CinemaSessionRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_CINEMA_SESSIONS_KEY);
    return raw ? (JSON.parse(raw) as CinemaSessionRecord[]) : [];
  } catch {
    return [];
  }
}

function saveLocalSessions(items: CinemaSessionRecord[]): void {
  try {
    localStorage.setItem(LOCAL_CINEMA_SESSIONS_KEY, JSON.stringify(items.slice(0, 40)));
  } catch {
    // ignore quota errors
  }
}

function buildDefaultSeedSession(communities: CommunityNode[]): CinemaSessionRecord {
  const withVideo = communities.filter((c) => Boolean(c.videoEquipe?.url)).slice(0, 2);
  const videos: CinemaPlaylistVideo[] = withVideo.map((c) => ({
    id: `seed-${c.id}`,
    title: c.videoEquipe.titulo || c.titulo,
    mediaUrl: c.videoEquipe.url,
    communityTitle: c.titulo,
    classGroup: c.serie,
    description: c.videoEquipe.descricao,
  }));

  return {
    id: 'seed-sessao-sala10',
    title: 'Estreia · Vozes do Clima na Sala 10',
    theme: 'justica',
    communityId: withVideo[0]?.id || 'sala10',
    communityTitle: withVideo[0]?.titulo || 'Justiça Climática MT',
    hostsLabel: 'Equipe Sala 10 · 2ª Mostra Cultural',
    createdByName: 'Prof. Johnny Fernandes',
    videos,
    quizQuestions: drawFiveQuestions('justica'),
    status: 'aguardando',
    activeVideoIndex: 0,
    createdAt: 1731900000000,
  };
}

function mergeSessions(
  local: CinemaSessionRecord[],
  remote: CinemaSessionRecord[],
  communities: CommunityNode[]
): CinemaSessionRecord[] {
  const map = new Map<string, CinemaSessionRecord>();
  for (const s of [...local, ...remote]) {
    const prev = map.get(s.id);
    if (!prev || s.createdAt >= prev.createdAt) {
      map.set(s.id, s);
    }
  }
  const merged = Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
  return merged.length > 0 ? merged : [buildDefaultSeedSession(communities)];
}

async function ensureCinemaAuth(): Promise<void> {
  const auth = getFirebaseAuthClient();
  if (auth && !auth.currentUser) {
    await signInAnonymously(auth).catch(() => undefined);
  }
}

export function subscribeCinemaSessions(
  communities: CommunityNode[],
  onUpdate: (sessions: CinemaSessionRecord[]) => void
): () => void {
  onUpdate(mergeSessions(loadLocalSessions(), [], communities));
  const db = getFirestoreClient();
  if (!db) return () => undefined;

  let active = true;
  let unsub = () => undefined;

  void ensureCinemaAuth().then(() => {
    if (!active) return;
    unsub = onSnapshot(
      collection(db, 'cinema_sessions'),
      (snap) => {
        const remote = snap.docs.map(
          (d) => ({ id: d.id, ...(d.data() as Omit<CinemaSessionRecord, 'id'>) })
        );
        const merged = mergeSessions(loadLocalSessions(), remote, communities);
        saveLocalSessions(remote);
        onUpdate(merged);
      },
      () => {
        onUpdate(mergeSessions(loadLocalSessions(), [], communities));
      }
    );
  });

  return () => {
    active = false;
    unsub();
  };
}

export async function fetchAllAvailableCinemaVideos(
  communities: CommunityNode[]
): Promise<CinemaPlaylistVideo[]> {
  const byUrl = new Map<string, CinemaPlaylistVideo>();
  const addItem = (item: CinemaPlaylistVideo) => {
    if (!item.mediaUrl || item.mediaUrl.startsWith('blob:')) return;
    if (!byUrl.has(item.mediaUrl)) {
      byUrl.set(item.mediaUrl, item);
    }
  };

  try {
    const raw = localStorage.getItem(LOCAL_WORKS_KEY);
    const localWorks = raw ? (JSON.parse(raw) as SchoolWork[]) : [];
    for (const w of localWorks) {
      if (w.workType === 'video' && w.status !== 'deleted') {
        const comm = communities.find((c) => c.id === w.communityId);
        addItem({
          id: w.id,
          title: w.title,
          mediaUrl: w.mediaUrl,
          communityTitle: comm?.titulo || 'Território da Mostra',
          classGroup: w.classGroup,
          description: w.description,
        });
      }
    }
  } catch {
    // ignore parse issues
  }

  const db = getFirestoreClient();
  if (db) {
    try {
      await ensureCinemaAuth();
      const q = query(collection(db, 'school_works'), where('workType', '==', 'video'));
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        const w = d.data() as Omit<SchoolWork, 'id'>;
        if (w.status !== 'deleted') {
          const comm = communities.find((c) => c.id === w.communityId);
          addItem({
            id: d.id,
            title: w.title,
            mediaUrl: w.mediaUrl,
            communityTitle: comm?.titulo || 'Território da Mostra',
            classGroup: w.classGroup,
            description: w.description,
          });
        }
      }
    } catch {
      // fall back to community seeds below
    }
  }

  for (const comm of communities) {
    if (comm.videoEquipe?.url) {
      addItem({
        id: `seed-${comm.id}`,
        title: comm.videoEquipe.titulo || comm.titulo,
        mediaUrl: comm.videoEquipe.url,
        communityTitle: comm.titulo,
        classGroup: comm.serie,
        description: comm.videoEquipe.descricao,
      });
    }
  }

  return Array.from(byUrl.values());
}

export async function createCinemaSession(input: {
  title: string;
  theme: ThemeSessionKey;
  communityId: string;
  communityTitle: string;
  hostsLabel: string;
  createdByName: string;
  createdByEmail?: string;
  videos: CinemaPlaylistVideo[];
}): Promise<CinemaSessionRecord> {
  if (input.videos.length === 0) {
    throw new Error('Selecione ou adicione pelo menos 1 vídeo para criar a sessão.');
  }

  const payload: Omit<CinemaSessionRecord, 'id'> = {
    title: input.title.trim(),
    theme: input.theme,
    communityId: input.communityId,
    communityTitle: input.communityTitle,
    hostsLabel: input.hostsLabel.trim() || input.createdByName,
    createdByName: input.createdByName,
    ...(input.createdByEmail ? { createdByEmail: input.createdByEmail } : {}),
    videos: input.videos,
    quizQuestions: drawFiveQuestions(input.theme),
    status: 'aguardando',
    activeVideoIndex: 0,
    createdAt: Date.now(),
  };

  const db = getFirestoreClient();
  if (db) {
    await ensureCinemaAuth();
    try {
      const ref = await addDoc(collection(db, 'cinema_sessions'), payload);
      const created: CinemaSessionRecord = { id: ref.id, ...payload };
      saveLocalSessions([created, ...loadLocalSessions().filter((s) => s.id !== created.id)]);
      return created;
    } catch {
      // fall through to local save
    }
  }

  const localCreated: CinemaSessionRecord = {
    id: `local-cine-${Date.now()}`,
    ...payload,
  };
  saveLocalSessions([localCreated, ...loadLocalSessions()]);
  return localCreated;
}

export async function updateCinemaSessionState(
  sessionId: string,
  patch: Partial<Pick<CinemaSessionRecord, 'status' | 'activeVideoIndex' | 'quizQuestions'>>
): Promise<void> {
  saveLocalSessions(
    loadLocalSessions().map((s) => (s.id === sessionId ? { ...s, ...patch } : s))
  );

  if (sessionId.startsWith('seed-') || sessionId.startsWith('local-')) return;
  const db = getFirestoreClient();
  if (!db) return;

  await ensureCinemaAuth();
  await updateDoc(doc(db, 'cinema_sessions', sessionId), patch).catch(() => undefined);
}

export async function deleteCinemaSession(sessionId: string): Promise<void> {
  saveLocalSessions(loadLocalSessions().filter((s) => s.id !== sessionId));
  if (sessionId.startsWith('seed-') || sessionId.startsWith('local-')) return;
  const db = getFirestoreClient();
  if (!db) return;
  await ensureCinemaAuth();
  await deleteDoc(doc(db, 'cinema_sessions', sessionId)).catch(() => undefined);
}

export function buildCinemaOpeningSpeech(session: CinemaSessionRecord): string {
  const themeText = CINEMA_THEME_LABELS[session.theme] || 'Justiça Climática';
  const firstVideo = session.videos[0]?.title || session.title;
  const moreCount = session.videos.length - 1;
  const playlistIntro =
    moreCount > 0
      ? `${firstVideo}, seguido por mais ${moreCount} ${moreCount === 1 ? 'vídeo selecionado' : 'vídeos selecionados'}`
      : firstVideo;

  return `Sejam bem-vindos à Sala de Cinema da Segunda Mostra Cultural na Escola Estadual Cívico-Militar João Ribeiro Vilela! Nesta sessão especial sobre ${themeText}, conduzida por ${session.hostsLabel}, vamos assistir: ${playlistIntro}. Ao final da exibição, participem do nosso desafio de cinco perguntas aqui na tela!`;
}

export function buildCinemaQuizQuestionSpeech(
  q: QuizQuestion,
  index: number,
  total: number
): string {
  return `Pergunta ${index + 1} de ${total}: ${q.question} Letra A: ${q.options[0]}. Letra B: ${q.options[1]}. Letra C: ${q.options[2]}. Letra D: ${q.options[3]}.`;
}

export function buildCinemaQuizAnswerSpeech(q: QuizQuestion, wasCorrect: boolean): string {
  const letters = ['A', 'B', 'C', 'D'];
  const prefix = wasCorrect
    ? 'Muito bem, plateia! Resposta correta.'
    : `Atenção: a resposta correta é a letra ${letters[q.correctIndex]}.`;
  return `${prefix} ${q.curiosity}`;
}
