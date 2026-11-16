import { signInAnonymously } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { getFirebaseAuthClient, getFirestoreClient } from '../../../shared/config/firebaseClient';

const CHUNK_SIZE_BYTES = 512 * 1024;
const PARALLEL_BATCH_SIZE = 6;
const memoryBlobUrlCache = new Map<string, string>();
const inFlightResolutions = new Map<string, Promise<string>>();

async function ensureChunkAuth(): Promise<void> {
  const auth = getFirebaseAuthClient();
  if (auth && !auth.currentUser) {
    await signInAnonymously(auth).catch(() => undefined);
  }
}

function uint8ToBase64(bytes: Uint8Array): string {
  const sliceSize = 0x8000;
  const parts: string[] = [];
  for (let i = 0; i < bytes.length; i += sliceSize) {
    const sub = bytes.subarray(i, i + sliceSize);
    parts.push(String.fromCharCode(...sub));
  }
  return btoa(parts.join(''));
}

function base64ToUint8(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function parseChunkedVideoUri(mediaUrl: string): { videoId: string; mimeType: string } | null {
  if (!mediaUrl.startsWith('firestore-video://')) return null;
  const raw = mediaUrl.slice('firestore-video://'.length);
  const [videoId, queryStr = ''] = raw.split('?');
  if (!videoId) return null;
  const params = new URLSearchParams(queryStr);
  return {
    videoId,
    mimeType: params.get('mime') || 'video/mp4',
  };
}

export function isFirestoreChunkedVideoUrl(url: string): boolean {
  return url.startsWith('firestore-video://');
}

export async function uploadVideoToFirestoreChunks(
  file: File,
  communityId: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const db = getFirestoreClient();
  if (!db) {
    onProgress?.(100);
    return URL.createObjectURL(file);
  }

  await ensureChunkAuth();
  onProgress?.(5);

  const buffer = await file.arrayBuffer();
  const totalBytes = buffer.byteLength;
  const totalChunks = Math.max(1, Math.ceil(totalBytes / CHUNK_SIZE_BYTES));
  const safeCommunity = communityId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 24) || 'mt';
  const videoId = `vid_${safeCommunity}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const mimeType = file.type || 'video/mp4';

  for (let start = 0; start < totalChunks; start += PARALLEL_BATCH_SIZE) {
    const end = Math.min(start + PARALLEL_BATCH_SIZE, totalChunks);
    const batchWrites: Array<Promise<void>> = [];

    for (let idx = start; idx < end; idx += 1) {
      const byteStart = idx * CHUNK_SIZE_BYTES;
      const byteEnd = Math.min(byteStart + CHUNK_SIZE_BYTES, totalBytes);
      const chunkBytes = new Uint8Array(buffer.slice(byteStart, byteEnd));
      const data = uint8ToBase64(chunkBytes);
      const chunkId = `${videoId}_${idx}`;

      batchWrites.push(
        setDoc(doc(db, 'school_work_chunks', chunkId), {
          videoId,
          index: idx,
          totalChunks,
          mimeType,
          data,
          createdAt: Date.now(),
        })
      );
    }

    await Promise.all(batchWrites);
    const pct = Math.min(99, Math.max(8, Math.round((end / totalChunks) * 100)));
    onProgress?.(pct);
  }

  const mediaUri = `firestore-video://${videoId}?mime=${encodeURIComponent(mimeType)}&chunks=${totalChunks}`;
  const blobUrl = URL.createObjectURL(new Blob([buffer], { type: mimeType }));
  memoryBlobUrlCache.set(mediaUri, blobUrl);
  onProgress?.(100);
  return mediaUri;
}

export async function resolveFirestoreVideoBlobUrl(mediaUrl: string): Promise<string> {
  const cached = memoryBlobUrlCache.get(mediaUrl);
  if (cached) return cached;

  const existingPromise = inFlightResolutions.get(mediaUrl);
  if (existingPromise) return existingPromise;

  const parsed = parseChunkedVideoUri(mediaUrl);
  if (!parsed) return mediaUrl;

  const task = (async () => {
    const db = getFirestoreClient();
    if (!db) throw new Error('Banco de dados indisponível para carregar o vídeo.');

    await ensureChunkAuth();
    const q = query(collection(db, 'school_work_chunks'), where('videoId', '==', parsed.videoId));
    const snap = await getDocs(q);
    if (snap.empty) {
      throw new Error('Os blocos deste vídeo não foram encontrados.');
    }

    const sorted = snap.docs
      .map((d) => d.data() as { index: number; mimeType?: string; data: string })
      .sort((a, b) => a.index - b.index);

    const mimeType = sorted[0]?.mimeType || parsed.mimeType;
    const arrays = sorted.map((chunk) => base64ToUint8(chunk.data));
    const blobParts = arrays.map((arr) => arr.slice().buffer);
    const blob = new Blob(blobParts, { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    memoryBlobUrlCache.set(mediaUrl, blobUrl);
    return blobUrl;
  })();

  inFlightResolutions.set(mediaUrl, task);
  try {
    return await task;
  } finally {
    inFlightResolutions.delete(mediaUrl);
  }
}

export async function deleteFirestoreVideoChunks(mediaUrl?: string): Promise<void> {
  if (!mediaUrl) return;
  const cached = memoryBlobUrlCache.get(mediaUrl);
  if (cached) {
    URL.revokeObjectURL(cached);
    memoryBlobUrlCache.delete(mediaUrl);
  }

  const parsed = parseChunkedVideoUri(mediaUrl);
  const db = getFirestoreClient();
  if (!parsed || !db) return;

  await ensureChunkAuth();
  const q = query(collection(db, 'school_work_chunks'), where('videoId', '==', parsed.videoId));
  const snap = await getDocs(q);
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref).catch(() => undefined)));
}
