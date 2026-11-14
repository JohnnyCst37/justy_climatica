import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'climate-justicy',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export function isFirebaseClientConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
}

let cachedApp: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseClientConfigured()) return null;
  if (cachedApp) return cachedApp;
  try {
    cachedApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return cachedApp;
  } catch {
    return null;
  }
}

export function getFirebaseAuthClient(): Auth | null {
  try {
    const app = getFirebaseApp();
    return app ? getAuth(app) : null;
  } catch {
    return null;
  }
}

export function getFirestoreClient(): Firestore | null {
  try {
    const app = getFirebaseApp();
    return app ? getFirestore(app) : null;
  } catch {
    return null;
  }
}

export function getStorageClient(): FirebaseStorage | null {
  try {
    const app = getFirebaseApp();
    return app ? getStorage(app) : null;
  } catch {
    return null;
  }
}
