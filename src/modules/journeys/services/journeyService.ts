import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirestoreClient } from '../../../shared/config/firebaseClient';
import type { JourneyKey, JourneyProgress } from '../../../shared/types/domain';

const LOCAL_PREFIX = 'justy_journey_v1';

export function createEmptyProgress(): JourneyProgress {
  return {
    justica: [],
    ciencia: [],
    saberes: [],
    lastActiveJourney: 'justica',
    lastStepIndex: 0,
    updatedAt: Date.now(),
  };
}

function localKey(uid: string, communityId: string): string {
  return `${LOCAL_PREFIX}:${uid}:${communityId}`;
}

export async function loadCommunityJourneyProgress(
  uid: string,
  communityId: string
): Promise<JourneyProgress> {
  try {
    const raw = localStorage.getItem(localKey(uid, communityId));
    if (raw) {
      return JSON.parse(raw) as JourneyProgress;
    }
  } catch {
    // ignore local parse errors
  }

  const db = getFirestoreClient();
  if (db && !uid.startsWith('local_')) {
    try {
      const snap = await getDoc(doc(db, 'users', uid, 'journeys', communityId));
      if (snap.exists()) {
        const data = snap.data() as JourneyProgress;
        localStorage.setItem(localKey(uid, communityId), JSON.stringify(data));
        return data;
      }
    } catch {
      // ignore offline errors
    }
  }

  return createEmptyProgress();
}

export async function saveCommunityJourneyProgress(
  uid: string,
  communityId: string,
  progress: JourneyProgress
): Promise<void> {
  const updated: JourneyProgress = { ...progress, updatedAt: Date.now() };
  try {
    localStorage.setItem(localKey(uid, communityId), JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }

  const db = getFirestoreClient();
  if (db && !uid.startsWith('local_')) {
    await setDoc(doc(db, 'users', uid, 'journeys', communityId), updated, { merge: true }).catch(
      () => undefined
    );
  }
}

export function getJourneyLabel(key: JourneyKey): string {
  switch (key) {
    case 'justica':
      return '1. Justiça Climática';
    case 'ciencia':
      return '2. Ciência Clara';
    case 'saberes':
      return '3. Saberes & Escolas';
  }
}
