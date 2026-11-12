import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
  type ServiceAccount,
} from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';

let initialized = false;
let adminAvailable = false;

function initFirebaseAdmin(): void {
  if (initialized) return;
  initialized = true;

  if (getApps().length > 0) {
    adminAvailable = true;
    return;
  }

  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const projectId =
    process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || 'climate-justicy';

  try {
    if (rawJson && rawJson.trim().startsWith('{')) {
      const parsed = JSON.parse(rawJson) as ServiceAccount;
      initializeApp({
        credential: cert(parsed),
        projectId,
        storageBucket: `${projectId}.firebasestorage.app`,
      });
      adminAvailable = true;
      return;
    }

    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      initializeApp({
        credential: applicationDefault(),
        projectId,
        storageBucket: `${projectId}.firebasestorage.app`,
      });
      adminAvailable = true;
    }
  } catch (err) {
    console.warn(
      '[FirebaseAdmin] Credencial de serviço indisponível:',
      err instanceof Error ? err.message : 'erro'
    );
    adminAvailable = false;
  }
}

export function isAdminReady(): boolean {
  initFirebaseAdmin();
  return adminAvailable;
}

export function getAdminAuth(): Auth | null {
  initFirebaseAdmin();
  return adminAvailable ? getAuth() : null;
}

export function getAdminDb(): Firestore | null {
  initFirebaseAdmin();
  return adminAvailable ? getFirestore() : null;
}

export function getAdminStorage(): Storage | null {
  initFirebaseAdmin();
  return adminAvailable ? getStorage() : null;
}
