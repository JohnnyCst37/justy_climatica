import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  getFirebaseAuthClient,
  getFirestoreClient,
} from '../../../shared/config/firebaseClient';
import type { UserProfile, UserRole } from '../../../shared/types/domain';

const LOCAL_PROFILE_KEY = 'justy_climatica_user_profile_v1';

function buildSessionToken(uid: string): string {
  const clean = uid.replace(/[^a-zA-Z0-9_-]/g, '');
  return clean.length >= 6 ? clean.slice(0, 48) : `turma_${clean || '9ano'}`;
}

export function loadLocalUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(LOCAL_PROFILE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function saveLocalUserProfile(profile: UserProfile | null): void {
  try {
    if (!profile) {
      localStorage.removeItem(LOCAL_PROFILE_KEY);
      return;
    }
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore storage errors
  }
}

async function resolveRole(uid: string, fallback: UserRole): Promise<UserRole> {
  const db = getFirestoreClient();
  if (!db) return fallback;
  try {
    const profDoc = await getDoc(doc(db, 'professors', uid));
    if (profDoc.exists()) return 'professor';
  } catch {
    // keep fallback
  }
  return fallback;
}

export async function loginWithClassroomCode(nickname: string, classCode: string): Promise<UserProfile> {
  const cleanNick = nickname.trim().slice(0, 32) || 'Estudante';
  const cleanClass = classCode.trim().toUpperCase().slice(0, 20) || '9ANO-MT';
  const auth = getFirebaseAuthClient();
  const db = getFirestoreClient();

  if (auth) {
    try {
      const cred = await signInAnonymously(auth);
      const profile: UserProfile = {
        uid: cred.user.uid,
        nickname: cleanNick,
        classCode: cleanClass,
        role: 'student',
        isAnonymous: true,
        sessionToken: buildSessionToken(cred.user.uid),
      };
      if (db) {
        await setDoc(
          doc(db, 'users', cred.user.uid),
          { nickname: cleanNick, classCode: cleanClass, role: 'student', updatedAt: Date.now() },
          { merge: true }
        ).catch(() => undefined);
      }
      saveLocalUserProfile(profile);
      return profile;
    } catch {
      // Fall back to local classroom session if Anonymous Auth is not enabled yet in console
    }
  }

  const localUid = `local_${cleanClass}_${cleanNick.toLowerCase().replace(/[^a-z0-9]/g, '') || 'aluno'}`;
  const profile: UserProfile = {
    uid: localUid,
    nickname: cleanNick,
    classCode: cleanClass,
    role: 'student',
    isAnonymous: true,
    sessionToken: buildSessionToken(localUid),
  };
  saveLocalUserProfile(profile);
  return profile;
}

export async function loginWithGoogleAccount(): Promise<UserProfile> {
  const auth = getFirebaseAuthClient();
  if (!auth) {
    throw new Error('Firebase Auth não configurado neste ambiente.');
  }

  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  const role = await resolveRole(cred.user.uid, 'visitor');
  const nickname = cred.user.displayName?.split(' ')[0] || 'Visitante';

  const profile: UserProfile = {
    uid: cred.user.uid,
    nickname,
    classCode: role === 'professor' ? 'DOCENTE' : 'VISITANTE',
    role,
    isAnonymous: false,
    sessionToken: buildSessionToken(cred.user.uid),
  };

  const db = getFirestoreClient();
  if (db) {
    await setDoc(
      doc(db, 'users', cred.user.uid),
      { nickname, classCode: profile.classCode, role, updatedAt: Date.now() },
      { merge: true }
    ).catch(() => undefined);
  }
  saveLocalUserProfile(profile);
  return profile;
}

export async function logoutSession(): Promise<void> {
  saveLocalUserProfile(null);
  const auth = getFirebaseAuthClient();
  if (auth?.currentUser) {
    await signOut(auth).catch(() => undefined);
  }
}

export function subscribeAuthChanges(onProfile: (profile: UserProfile | null) => void): () => void {
  const auth = getFirebaseAuthClient();
  if (!auth) {
    onProfile(loadLocalUserProfile());
    return () => undefined;
  }

  return onAuthStateChanged(auth, async (fbUser: User | null) => {
    if (!fbUser) {
      onProfile(loadLocalUserProfile());
      return;
    }
    const local = loadLocalUserProfile();
    const role = await resolveRole(fbUser.uid, fbUser.isAnonymous ? 'student' : 'visitor');
    const profile: UserProfile = {
      uid: fbUser.uid,
      nickname: local?.nickname || fbUser.displayName?.split(' ')[0] || 'Estudante',
      classCode: local?.classCode || (role === 'professor' ? 'DOCENTE' : '9ANO-MT'),
      role,
      isAnonymous: fbUser.isAnonymous,
      sessionToken: buildSessionToken(fbUser.uid),
    };
    saveLocalUserProfile(profile);
    onProfile(profile);
  });
}
