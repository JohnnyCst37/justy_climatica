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
import type {
  AuthorizedEmailRole,
  UserProfile,
  UserRole,
} from '../../../shared/types/domain';
import {
  ROLE_LABELS,
  findAuthorizedEmail,
  requestAccessRegistration,
} from './accessControlService';

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

export async function loginWithAuthorizedEmail(email: string): Promise<UserProfile> {
  const cleanEmail = email.trim().toLowerCase();
  const auth = getFirebaseAuthClient();
  if (auth && !auth.currentUser) {
    await signInAnonymously(auth).catch(() => undefined);
  }

  const entry = await findAuthorizedEmail(cleanEmail);
  if (!entry) {
    throw new Error(
      'Este e-mail ainda não foi cadastrado. Clique em "Cadastre-se" ou "Entrar / Cadastrar com Google" para solicitar acesso.'
    );
  }

  const uid = auth?.currentUser?.uid || `auth_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;
  const profile: UserProfile = {
    uid,
    nickname: entry.name,
    email: entry.email,
    classCode: entry.classGroup || ROLE_LABELS[entry.role].toUpperCase(),
    role: entry.role,
    isAnonymous: false,
    pendingApproval: entry.status === 'pending',
    sessionToken: buildSessionToken(uid),
  };

  saveLocalUserProfile(profile);
  return profile;
}

export async function registerAndRequestApproval(input: {
  email: string;
  name: string;
  role: AuthorizedEmailRole;
  classGroup?: string;
}): Promise<UserProfile> {
  const entry = await requestAccessRegistration(input);
  const auth = getFirebaseAuthClient();
  const uid = auth?.currentUser?.uid || `auth_${entry.email.replace(/[^a-z0-9]/g, '_')}`;

  const profile: UserProfile = {
    uid,
    nickname: entry.name,
    email: entry.email,
    classCode: entry.classGroup || ROLE_LABELS[entry.role].toUpperCase(),
    role: entry.role,
    isAnonymous: false,
    pendingApproval: entry.status === 'pending',
    sessionToken: buildSessionToken(uid),
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
  let cred;
  try {
    cred = await signInWithPopup(auth, provider);
  } catch (err) {
    const code = (err as { code?: string })?.code || '';
    if (
      code === 'auth/unauthorized-domain' ||
      code === 'auth/popup-blocked' ||
      code === 'auth/operation-not-allowed'
    ) {
      const host = typeof window !== 'undefined' ? window.location.hostname : 'este domínio';
      throw new Error(
        `O popup Google não está habilitado para o domínio (${host}). Digite seu e-mail no campo abaixo para entrar imediatamente ou cadastre-se na aba ao lado.`
      );
    }
    throw err;
  }
  const cleanEmail = (cred.user.email || '').trim().toLowerCase();
  const authorized = cleanEmail ? await findAuthorizedEmail(cleanEmail) : null;
  const role: UserRole = authorized ? authorized.role : 'visitor';
  const nickname = authorized?.name || cred.user.displayName || 'Docente';

  const profile: UserProfile = {
    uid: cred.user.uid,
    nickname,
    email: authorized?.email || cleanEmail || undefined,
    classCode:
      authorized?.classGroup ||
      (authorized ? ROLE_LABELS[authorized.role].toUpperCase() : 'NOVO-CADASTRO'),
    role,
    isAnonymous: false,
    pendingApproval: authorized ? authorized.status === 'pending' : false,
    sessionToken: buildSessionToken(cred.user.uid),
  };

  const db = getFirestoreClient();
  if (db) {
    await setDoc(
      doc(db, 'users', cred.user.uid),
      { nickname, email: profile.email || '', classCode: profile.classCode, role, updatedAt: Date.now() },
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
    const local = loadLocalUserProfile();
    if (!fbUser) {
      onProfile(local);
      return;
    }
    const cleanEmail = (fbUser.email || local?.email || '').trim().toLowerCase();
    const authorized = cleanEmail ? await findAuthorizedEmail(cleanEmail) : null;
    const role = authorized ? authorized.role : await resolveRole(fbUser.uid, fbUser.isAnonymous ? 'student' : 'visitor');
    const profile: UserProfile = {
      uid: fbUser.uid,
      nickname: authorized?.name || local?.nickname || fbUser.displayName?.split(' ')[0] || 'Estudante',
      email: authorized?.email || cleanEmail || undefined,
      classCode:
        authorized?.classGroup ||
        (authorized
          ? ROLE_LABELS[authorized.role].toUpperCase()
          : local?.classCode || (role === 'professor' ? 'DOCENTE' : '9ANO-MT')),
      role,
      isAnonymous: authorized ? false : fbUser.isAnonymous,
      pendingApproval: authorized ? authorized.status === 'pending' : false,
      sessionToken: buildSessionToken(fbUser.uid),
    };
    saveLocalUserProfile(profile);
    onProfile(profile);
  });
}
