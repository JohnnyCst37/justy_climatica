import { signInAnonymously } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import {
  getFirebaseAuthClient,
  getFirestoreClient,
} from '../../../shared/config/firebaseClient';
import type { LiveCoverageItem } from '../../../shared/types/domain';
import { uploadVideoToFirestoreChunks } from '../../submissions/services/firestoreVideoStorage';
import {
  formatEventTimestamp,
  stampPhotoFileWithWatermark,
} from '../utils/mediaWatermarkEngine';

const LOCAL_COVERAGE_KEY = 'justy_live_coverage_v1';

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

function mergeCoverageLists(groups: LiveCoverageItem[][]): LiveCoverageItem[] {
  const map = new Map<string, LiveCoverageItem>();
  for (const list of groups) {
    for (const item of list) {
      if (item?.id && item.mediaUrl && !item.mediaUrl.startsWith('blob:')) {
        map.set(item.id, item);
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
}

export function subscribeLiveCoverage(
  onUpdate: (items: LiveCoverageItem[]) => void
): () => void {
  onUpdate(loadLocalCoverage());
  const db = getFirestoreClient();
  if (!db) return () => undefined;

  let unsub: (() => void) | undefined;
  let cancelled = false;

  void ensureCoverageAuth().then(() => {
    if (cancelled) return;
    unsub = onSnapshot(
      collection(db, 'event_coverage'),
      (snap) => {
        const remote = snap.docs.map((d) => d.data() as LiveCoverageItem);
        const merged = mergeCoverageLists([remote, loadLocalCoverage()]);
        saveLocalCoverage(merged);
        onUpdate(merged);
      },
      () => onUpdate(loadLocalCoverage())
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

export async function deleteLiveCoverageItem(itemId: string): Promise<void> {
  saveLocalCoverage(loadLocalCoverage().filter((i) => i.id !== itemId));
  const db = getFirestoreClient();
  if (db) {
    await ensureCoverageAuth();
    await deleteDoc(doc(db, 'event_coverage', itemId)).catch(() => undefined);
  }
}
