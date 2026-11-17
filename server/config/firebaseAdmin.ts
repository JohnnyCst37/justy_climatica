import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import type { ServiceAccount } from 'firebase-admin/app';
import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';
import type { Storage } from 'firebase-admin/storage';

type FirebaseAdminAppModule = typeof import('firebase-admin/app');
type FirebaseAdminAuthModule = typeof import('firebase-admin/auth');
type FirebaseAdminFirestoreModule = typeof import('firebase-admin/firestore');
type FirebaseAdminStorageModule = typeof import('firebase-admin/storage');

let initialized = false;
let adminAvailable = false;
let cachedAuthMod: FirebaseAdminAuthModule | null = null;
let cachedFirestoreMod: FirebaseAdminFirestoreModule | null = null;
let cachedStorageMod: FirebaseAdminStorageModule | null = null;

function requireAdminPkg<T>(pkgName: string): T {
  const req = createRequire(resolve(process.cwd(), 'package.json'));
  return req(pkgName) as T;
}

function initFirebaseAdmin(): void {
  if (initialized) return;
  initialized = true;

  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const hasServiceJson = Boolean(rawJson && rawJson.trim().startsWith('{'));
  const hasAppCreds = Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS);

  if (!hasServiceJson && !hasAppCreds) {
    adminAvailable = false;
    return;
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || 'climate-justicy';

  try {
    const appMod = requireAdminPkg<FirebaseAdminAppModule>('firebase-admin/app');
    if (appMod.getApps().length === 0) {
      if (hasServiceJson && rawJson) {
        const parsed = JSON.parse(rawJson) as ServiceAccount;
        appMod.initializeApp({
          credential: appMod.cert(parsed),
          projectId,
          storageBucket: `${projectId}.firebasestorage.app`,
        });
      } else {
        appMod.initializeApp({
          credential: appMod.applicationDefault(),
          projectId,
          storageBucket: `${projectId}.firebasestorage.app`,
        });
      }
    }

    cachedAuthMod = requireAdminPkg<FirebaseAdminAuthModule>('firebase-admin/auth');
    cachedFirestoreMod = requireAdminPkg<FirebaseAdminFirestoreModule>('firebase-admin/firestore');
    cachedStorageMod = requireAdminPkg<FirebaseAdminStorageModule>('firebase-admin/storage');
    adminAvailable = true;
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
  return adminAvailable && cachedAuthMod ? cachedAuthMod.getAuth() : null;
}

export function getAdminDb(): Firestore | null {
  initFirebaseAdmin();
  return adminAvailable && cachedFirestoreMod ? cachedFirestoreMod.getFirestore() : null;
}

export function getAdminStorage(): Storage | null {
  initFirebaseAdmin();
  return adminAvailable && cachedStorageMod ? cachedStorageMod.getStorage() : null;
}
