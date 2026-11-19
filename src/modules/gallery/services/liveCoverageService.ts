import { signInAnonymously } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import {
  getFirebaseAuthClient,
  getFirestoreClient,
} from '../../../shared/config/firebaseClient';
import type { LiveCoverageItem } from '../../../shared/types/domain';
import {
  deleteFirestoreVideoChunks,
  uploadVideoToFirestoreChunks,
} from '../../submissions/services/firestoreVideoStorage';
import {
  formatEventTimestamp,
  stampPhotoFileWithWatermark,
} from '../utils/mediaWatermarkEngine';

const LOCAL_COVERAGE_KEY = 'justy_live_coverage_v1';
const LOCAL_DELETED_COVERAGE_KEY = 'justy_deleted_coverage_ids_v1';

async function ensureCoverageAuth(): Promise<void> {
  const auth = getFirebaseAuthClient();
  if (auth && !auth.currentUser) {
    await signInAnonymously(auth).catch(() => undefined);
  }
}

function loadLocalCoverage(): LiveCoverageItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_COVERAGE_KEY);
    return raw ? (JSON.parse(raw) as LiveCoverageItem[]) : [];
  } catch {
    return [];
  }
}

function saveLocalCoverage(items: LiveCoverageItem[]): void {
  try {
    localStorage.setItem(LOCAL_COVERAGE_KEY, JSON.stringify(items.slice(0, 24)));
  } catch {
    // ignore storage quota limit on local cache
  }
}

function loadDeletedCoverageIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LOCAL_DELETED_COVERAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function markCoverageDeleted(id: string): void {
  try {
    const next = Array.from(new Set([id, ...Array.from(loadDeletedCoverageIds())])).slice(0, 100);
    localStorage.setItem(LOCAL_DELETED_COVERAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
}

function mergeCoverageLists(
  groups: LiveCoverageItem[][],
  deletedIds = loadDeletedCoverageIds()
): LiveCoverageItem[] {
  const map = new Map<string, LiveCoverageItem>();
  for (const list of groups) {
    for (const item of list) {
      if (
        item?.id &&
        !deletedIds.has(item.id) &&
        item.mediaUrl &&
        !item.mediaUrl.startsWith('blob:')
      ) {
        map.set(item.id, item);
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
}

async function syncPendingLocalToFirestore(remote: LiveCoverageItem[]): Promise<LiveCoverageItem[]> {
  const db = getFirestoreClient();
  if (!db) return remote;
  const deleted = loadDeletedCoverageIds();
  const remoteIds = new Set(remote.map((r) => r.id));
  const pending = loadLocalCoverage().filter(
    (l) => !deleted.has(l.id) && !remoteIds.has(l.id) && l.mediaUrl && !l.mediaUrl.startsWith('blob:')
  );
  if (pending.length === 0) return remote;

  const synced: LiveCoverageItem[] = [...remote];
  await Promise.all(
    pending.map(async (item) => {
      const saved = await setDoc(doc(db, 'event_coverage', item.id), {
        ...item,
        schoolName: 'EE CM João Ribeiro Vilela',
      })
        .then(() => true)
        .catch(() => false);
      if (saved) synced.push(item);
    })
  );
  return synced;
}

export async function fetchLiveCoverageNow(): Promise<LiveCoverageItem[]> {
  const deleted = loadDeletedCoverageIds();
  const local = loadLocalCoverage().filter((i) => !deleted.has(i.id));
  const db = getFirestoreClient();
  if (!db) return mergeCoverageLists([local], deleted);

  try {
    await ensureCoverageAuth();
    const snap = await getDocs(collection(db, 'event_coverage'));
    const remoteRaw = snap.docs.map((d) => ({
      ...(d.data() as LiveCoverageItem),
      id: d.id,
    }));
    const syncedRemote = await syncPendingLocalToFirestore(remoteRaw);
    const merged = mergeCoverageLists([syncedRemote, local], deleted);
    saveLocalCoverage(merged);
    return merged;
  } catch {
    return mergeCoverageLists([local], deleted);
  }
}

export function subscribeLiveCoverage(
  onUpdate: (items: LiveCoverageItem[]) => void
): () => void {
  const deleted = loadDeletedCoverageIds();
  onUpdate(mergeCoverageLists([loadLocalCoverage()], deleted));

  const db = getFirestoreClient();
  if (!db) return () => undefined;

  let unsub: (() => void) | undefined;
  let cancelled = false;

  void fetchLiveCoverageNow().then((initial) => {
    if (!cancelled) onUpdate(initial);
  });

  void ensureCoverageAuth().then(() => {
    if (cancelled) return;
    unsub = onSnapshot(
      collection(db, 'event_coverage'),
      (snap) => {
        const curDeleted = loadDeletedCoverageIds();
        const remote = snap.docs.map((d) => ({
          ...(d.data() as LiveCoverageItem),
          id: d.id,
        }));
        const merged = mergeCoverageLists([remote, loadLocalCoverage()], curDeleted);
        saveLocalCoverage(merged);
        onUpdate(merged);
      },
      () => onUpdate(mergeCoverageLists([loadLocalCoverage()], loadDeletedCoverageIds()))
    );
  });

  return () => {
    cancelled = true;
    unsub?.();
  };
}

export async function publishLiveCoveragePhoto(input: {
  fileOrBlob: Blob;
  title: string;
  caption: string;
  classOrGuest: string;
  reporterName: string;
  reporterEmail: string;
}): Promise<LiveCoverageItem> {
  const now = Date.now();
  const stamp = formatEventTimestamp(now);
  const stampedDataUrl = await stampPhotoFileWithWatermark(input.fileOrBlob, {
    title: input.title,
    classOrGuest: input.classOrGuest,
    dateLabel: stamp.dateLabel,
    timeLabel: stamp.timeLabel,
    timestamp: now,
  });

  const id = `cov_img_${now}_${Math.random().toString(36).slice(2, 6)}`;
  const item: LiveCoverageItem = {
    id,
    title: input.title.trim() || 'Registro Fotográfico da Mostra',
    caption: input.caption.trim() || 'Cobertura em tempo real da EE CM João Ribeiro Vilela',
    mediaType: 'photo',
    mediaUrl: stampedDataUrl,
    classOrGuest: input.classOrGuest.trim() || 'Mostra Científica',
    reporterName: input.reporterName.trim() || 'Equipe de Cobertura',
    reporterEmail: input.reporterEmail.trim().toLowerCase(),
    eventDateLabel: stamp.dateLabel,
    eventTimeLabel: stamp.timeLabel,
    createdAt: now,
  };

  saveLocalCoverage(mergeCoverageLists([[item], loadLocalCoverage()]));
  const db = getFirestoreClient();
  if (db) {
    await ensureCoverageAuth();
    await setDoc(doc(db, 'event_coverage', id), {
      ...item,
      schoolName: 'EE CM João Ribeiro Vilela',
    });
  }
  return item;
}

export async function publishLiveCoverageVideo(input: {
  videoFile: File;
  title: string;
  caption: string;
  classOrGuest: string;
  durationSec?: number;
  reporterName: string;
  reporterEmail: string;
  onProgress?: (pct: number) => void;
}): Promise<LiveCoverageItem> {
  const now = Date.now();
  const stamp = formatEventTimestamp(now);
  const mediaUri = await uploadVideoToFirestoreChunks(
    input.videoFile,
    'live_coverage',
    input.onProgress
  );

  const id = `cov_vid_${now}_${Math.random().toString(36).slice(2, 6)}`;
  const item: LiveCoverageItem = {
    id,
    title: input.title.trim() || 'Gravação Ao Vivo da Mostra',
    caption: input.caption.trim() || 'Apresentação / Entrevista registrada ao vivo na EE CM João Ribeiro Vilela',
    mediaType: 'video',
    mediaUrl: mediaUri,
    durationSec: input.durationSec || 0,
    classOrGuest: input.classOrGuest.trim() || 'Mostra Científica',
    reporterName: input.reporterName.trim() || 'Equipe de Cobertura',
    reporterEmail: input.reporterEmail.trim().toLowerCase(),
    eventDateLabel: stamp.dateLabel,
    eventTimeLabel: stamp.timeLabel,
    createdAt: now,
  };

  if (!mediaUri.startsWith('blob:')) {
    saveLocalCoverage(mergeCoverageLists([[item], loadLocalCoverage()]));
  }
  const db = getFirestoreClient();
  if (db) {
    await ensureCoverageAuth();
    await setDoc(doc(db, 'event_coverage', id), {
      ...item,
      schoolName: 'EE CM João Ribeiro Vilela',
    });
  }
  return item;
}

export async function deleteLiveCoverageItem(itemId: string, mediaUrl?: string): Promise<void> {
  markCoverageDeleted(itemId);
  saveLocalCoverage(loadLocalCoverage().filter((i) => i.id !== itemId));
  if (mediaUrl) {
    await deleteFirestoreVideoChunks(mediaUrl).catch(() => undefined);
  }
  const db = getFirestoreClient();
  if (db) {
    await ensureCoverageAuth();
    await deleteDoc(doc(db, 'event_coverage', itemId)).catch(() => undefined);
  }
}
