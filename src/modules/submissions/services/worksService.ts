import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getFirestoreClient } from '../../../shared/config/firebaseClient';
import { postApiJson } from '../../../shared/services/apiClient';
import type { CommunityNode, SchoolWork } from '../../../shared/types/domain';

const LOCAL_WORKS_KEY = 'justy_school_works_v1';

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
  const localMatches = loadLocalWorks().filter((w) => w.communityId === community.id);
  const db = getFirestoreClient();

  if (!db) {
    return [seed, ...localMatches];
  }

  try {
    const q = query(
      collection(db, 'school_works'),
      where('communityId', '==', community.id),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    const remote = snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as Omit<SchoolWork, 'id'>) }))
      .filter((w) => w.status === 'approved' || isProfessor || (currentUid && w.authorUid === currentUid));
    return [seed, ...remote, ...localMatches.filter((l) => !remote.some((r) => r.id === l.id))];
  } catch {
    return [seed, ...localMatches];
  }
}

export async function submitSchoolWork(params: {
  communityId: string;
  schoolName: string;
  classGroup: string;
  title: string;
  workType: SchoolWork['workType'];
  description: string;
  videoUrl?: string;
  imageFileBase64?: string;
  imageMimeType?: 'image/png' | 'image/jpeg' | 'image/webp';
  authorUid: string;
  authorLabel: string;
  sessionToken?: string;
  autoApprove?: boolean;
}): Promise<SchoolWork> {
  let mediaUrl = (params.videoUrl || '').trim();

  if (params.workType !== 'video' && params.imageFileBase64 && params.imageMimeType) {
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
    mediaUrl = uploaded.url;
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

  const db = getFirestoreClient();
  if (db && !params.authorUid.startsWith('local_')) {
    try {
      const ref = await addDoc(collection(db, 'school_works'), newWork);
      return { id: ref.id, ...newWork };
    } catch {
      // fall through to local save
    }
  }

  const localItem: SchoolWork = { id: `local-${Date.now()}`, ...newWork };
  saveLocalWorks([localItem, ...loadLocalWorks()]);
  return localItem;
}

export async function approveSchoolWork(workId: string): Promise<void> {
  const db = getFirestoreClient();
  if (db && !workId.startsWith('local-')) {
    await updateDoc(doc(db, 'school_works', workId), { status: 'approved' });
  }
  const updatedLocal = loadLocalWorks().map((w) =>
    w.id === workId ? { ...w, status: 'approved' as const } : w
  );
  saveLocalWorks(updatedLocal);
}
