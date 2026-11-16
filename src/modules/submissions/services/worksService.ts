import { signInAnonymously } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  getFirebaseAuthClient,
  getFirestoreClient,
} from '../../../shared/config/firebaseClient';
import { postApiJson } from '../../../shared/services/apiClient';
import type { CommunityNode, SchoolWork } from '../../../shared/types/domain';
import {
  deleteFirestoreVideoChunks,
  uploadVideoToFirestoreChunks,
} from './firestoreVideoStorage';

async function ensureWorksAuth(): Promise<void> {
  const auth = getFirebaseAuthClient();
  if (auth && !auth.currentUser) {
    await signInAnonymously(auth).catch(() => undefined);
  }
}

function compressImageDataUrl(dataUrl: string, maxWidth = 1280): Promise<string> {
  if (typeof document === 'undefined' || !dataUrl.startsWith('data:image/')) {
    return Promise.resolve(dataUrl);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = img.width > maxWidth ? maxWidth / img.width : 1;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL('image/jpeg', 0.8);
      resolve(compressed.length < dataUrl.length ? compressed : dataUrl);
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

const LOCAL_WORKS_KEY = 'justy_school_works_v1';
const LOCAL_DELETED_WORKS_KEY = 'justy_deleted_work_ids_v1';

function loadLocalWorks(): SchoolWork[] {
  try {
    const raw = localStorage.getItem(LOCAL_WORKS_KEY);
    return raw ? (JSON.parse(raw) as SchoolWork[]) : [];
  } catch {
    return [];
  }
}

function saveLocalWorks(works: SchoolWork[]): void {
  try {
    localStorage.setItem(LOCAL_WORKS_KEY, JSON.stringify(works));
  } catch {
    // ignore storage errors
  }
}

function loadDeletedWorkIds(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_DELETED_WORKS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function markWorkIdDeleted(id: string): void {
  try {
    const next = Array.from(new Set([id, ...loadDeletedWorkIds()]));
    localStorage.setItem(LOCAL_DELETED_WORKS_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
}

export function buildSeedWorkForCommunity(community: CommunityNode): SchoolWork {
  return {
    id: `seed-${community.id}`,
    communityId: community.id,
    schoolName: community.escola,
    classGroup: community.serie,
    title: community.videoEquipe.titulo || community.infografico.titulo,
    workType: community.videoEquipe.url ? 'video' : 'infografico',
    mediaUrl: community.videoEquipe.url || community.infografico.url,
    description: `${community.equipeAlunos.join(', ')} — ${community.videoEquipe.descricao || community.infografico.legenda}`,
    authorUid: 'seed',
    authorLabel: community.orientador,
    status: 'approved',
    createdAt: 1730000000000,
  };
}

export async function fetchCommunityWorks(
  community: CommunityNode,
  currentUid?: string,
  isProfessor = false
): Promise<SchoolWork[]> {
  const seed = buildSeedWorkForCommunity(community);
  const deletedIds = new Set(loadDeletedWorkIds());
  const localAll = loadLocalWorks();
  const localMatches = localAll.filter((w) => w.communityId === community.id);
  const localSeed = localMatches.find((l) => l.id === seed.id);
  const db = getFirestoreClient();

  if (!db) {
    const base = localMatches
      .filter((w) => w.id !== seed.id && w.status !== 'deleted' && !deletedIds.has(w.id))
      .sort((a, b) => b.createdAt - a.createdAt);
    return deletedIds.has(seed.id) ? base : [...base, localSeed || seed];
  }

  try {
    await ensureWorksAuth();
    const q = query(collection(db, 'school_works'), where('communityId', '==', community.id));
    const snap = await getDocs(q);
    const allRemote = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<SchoolWork, 'id'>),
    }));

    for (const item of allRemote) {
      if (item.status === 'deleted') {
        deletedIds.add(item.id);
        markWorkIdDeleted(item.id);
      }
    }

    const remoteSeed = allRemote.find((w) => w.id === seed.id && w.status !== 'deleted');
    const remote = allRemote.filter(
      (w) =>
        w.id !== seed.id &&
        w.status !== 'deleted' &&
        !deletedIds.has(w.id) &&
        (w.status === 'approved' || isProfessor || (currentUid && w.authorUid === currentUid))
    );

    const unsynced = localMatches.filter(
      (l) =>
        l.id.startsWith('local-') &&
        !deletedIds.has(l.id) &&
        l.status !== 'deleted' &&
        !remote.some((r) => r.createdAt === l.createdAt && r.title === l.title)
    );
    if (unsynced.length > 0) {
      const syncedIds = new Map<string, string>();
      await Promise.all(
        unsynced.map(async (item) => {
          const { id: oldId, ...payload } = item;
          const added = await addDoc(collection(db, 'school_works'), payload).catch(() => null);
          if (added) {
            syncedIds.set(oldId, added.id);
            remote.push({ id: added.id, ...payload });
          }
        })
      );
      if (syncedIds.size > 0) {
        saveLocalWorks(
          localAll.map((w) => (syncedIds.has(w.id) ? { ...w, id: syncedIds.get(w.id)! } : w))
        );
      }
    }

    const remainingLocal = localMatches.filter(
      (l) =>
        l.id !== seed.id &&
        l.status !== 'deleted' &&
        !deletedIds.has(l.id) &&
        !remote.some((r) => r.id === l.id || (r.createdAt === l.createdAt && r.title === l.title))
    );
    const mergedUploads = [...remote, ...remainingLocal].sort((a, b) => b.createdAt - a.createdAt);
    const effectiveSeed = deletedIds.has(seed.id) ? null : remoteSeed || localSeed || seed;
    return effectiveSeed ? [...mergedUploads, effectiveSeed] : mergedUploads;
  } catch {
    const base = localMatches
      .filter((w) => w.id !== seed.id && w.status !== 'deleted' && !deletedIds.has(w.id))
      .sort((a, b) => b.createdAt - a.createdAt);
    return deletedIds.has(seed.id) ? base : [...base, localSeed || seed];
  }
}

const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const ALLOWED_VIDEO_MIMES = new Set(['video/mp4', 'video/webm', 'video/quicktime']);

async function uploadVideoDirect(
  file: File,
  communityId: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  if (!ALLOWED_VIDEO_MIMES.has(file.type)) {
    throw new Error('Formato de vídeo não suportado. Envie MP4, WebM ou MOV.');
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error('O vídeo deve ter no máximo 50 MB para o evento (ou use um link do YouTube).');
  }

  return uploadVideoToFirestoreChunks(file, communityId, onProgress);
}

export async function submitSchoolWork(params: {
  communityId: string;
  schoolName: string;
  classGroup: string;
  title: string;
  workType: SchoolWork['workType'];
  description: string;
  videoUrl?: string;
  videoFile?: File;
  imageFileBase64?: string;
  imageMimeType?: 'image/png' | 'image/jpeg' | 'image/webp';
  authorUid: string;
  authorLabel: string;
  sessionToken?: string;
  autoApprove?: boolean;
  onUploadProgress?: (pct: number) => void;
}): Promise<SchoolWork> {
  await ensureWorksAuth();
  let mediaUrl = (params.videoUrl || '').trim();

  if (params.workType === 'video' && params.videoFile) {
    mediaUrl = await uploadVideoDirect(
      params.videoFile,
      params.communityId,
      params.onUploadProgress
    );
  } else if (params.workType !== 'video' && params.imageFileBase64 && params.imageMimeType) {
    try {
      const uploaded = await postApiJson<
        {
          communityId: string;
          schoolName: string;
          classGroup: string;
          title: string;
          workType: 'slide_powerpoint' | 'infografico' | 'foto_campo';
          mimeType: 'image/png' | 'image/jpeg' | 'image/webp';
          base64Data: string;
        },
        { url: string }
      >(
        '/api/upload-work',
        {
          communityId: params.communityId,
          schoolName: params.schoolName,
          classGroup: params.classGroup,
          title: params.title,
          workType: params.workType,
          mimeType: params.imageMimeType,
          base64Data: params.imageFileBase64,
        },
        params.sessionToken
      );
      mediaUrl = uploaded.url.startsWith('data:image/')
        ? await compressImageDataUrl(uploaded.url)
        : uploaded.url;
    } catch {
      mediaUrl = await compressImageDataUrl(params.imageFileBase64);
    }
  }

  const newWork: Omit<SchoolWork, 'id'> = {
    communityId: params.communityId,
    schoolName: params.schoolName,
    classGroup: params.classGroup,
    title: params.title,
    workType: params.workType,
    mediaUrl,
    description: params.description,
    authorUid: params.authorUid,
    authorLabel: params.authorLabel,
    status: params.autoApprove ? 'approved' : 'pending',
    createdAt: Date.now(),
  };

  let saved: SchoolWork = { id: `local-${Date.now()}`, ...newWork };
  const db = getFirestoreClient();
  if (db) {
    try {
      const ref = await addDoc(collection(db, 'school_works'), newWork);
      saved = { id: ref.id, ...newWork };
    } catch {
      // keep local-* id so fetchCommunityWorks syncs later
    }
  }

  saveLocalWorks([saved, ...loadLocalWorks()]);
  return saved;
}

export async function approveSchoolWork(workId: string): Promise<void> {
  await ensureWorksAuth();
  const db = getFirestoreClient();
  if (db && !workId.startsWith('local-')) {
    await updateDoc(doc(db, 'school_works', workId), { status: 'approved' });
  }
  const updatedLocal = loadLocalWorks().map((w) =>
    w.id === workId ? { ...w, status: 'approved' as const } : w
  );
  saveLocalWorks(updatedLocal);
}

export async function updateSchoolWork(
  workId: string,
  updates: Partial<Pick<SchoolWork, 'title' | 'classGroup' | 'workType' | 'mediaUrl' | 'description'>>,
  baseWork?: SchoolWork
): Promise<SchoolWork> {
  await ensureWorksAuth();
  const existingLocal = loadLocalWorks().find((w) => w.id === workId);
  const current = baseWork || existingLocal;
  if (!current) {
    throw new Error('Publicação não encontrada para edição.');
  }

  const updated: SchoolWork = {
    ...current,
    title: updates.title?.trim() || current.title,
    classGroup: updates.classGroup?.trim() || current.classGroup,
    workType: updates.workType || current.workType,
    mediaUrl: updates.mediaUrl !== undefined ? updates.mediaUrl.trim() : current.mediaUrl,
    description: updates.description?.trim() || current.description,
    status: 'approved',
  };

  const db = getFirestoreClient();
  if (db && !workId.startsWith('local-')) {
    await setDoc(doc(db, 'school_works', workId), updated, { merge: true }).catch(() => undefined);
  }

  const nextLocal = [updated, ...loadLocalWorks().filter((w) => w.id !== workId)];
  saveLocalWorks(nextLocal);
  return updated;
}

export async function deleteSchoolWork(work: SchoolWork): Promise<void> {
  await ensureWorksAuth();
  markWorkIdDeleted(work.id);
  saveLocalWorks(loadLocalWorks().filter((w) => w.id !== work.id));

  if (work.mediaUrl?.startsWith('firestore-video://')) {
    await deleteFirestoreVideoChunks(work.mediaUrl).catch(() => undefined);
  }

  const db = getFirestoreClient();
  if (!db) return;

  if (work.id.startsWith('seed-')) {
    await setDoc(
      doc(db, 'school_works', work.id),
      {
        communityId: work.communityId,
        schoolName: work.schoolName,
        classGroup: work.classGroup,
        title: work.title,
        workType: work.workType,
        mediaUrl: '',
        description: work.description,
        authorUid: work.authorUid,
        authorLabel: work.authorLabel,
        status: 'deleted',
        createdAt: work.createdAt,
      },
      { merge: true }
    ).catch(() => undefined);
  } else if (!work.id.startsWith('local-')) {
    await deleteDoc(doc(db, 'school_works', work.id)).catch(() => undefined);
  }
}
