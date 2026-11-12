import { getAdminDb, isAdminReady } from '../config/firebaseAdmin.js';

export interface QuotaAcquireResult {
  allowed: boolean;
  code: 'OK' | 'BOT_BURST_DETECTED' | 'USER_QUOTA_CAP' | 'POOL_CAP';
  reservationId?: string;
}

export interface AtomicQuotaEngine {
  acquire(uid: string, unitReserveBrl?: number): Promise<QuotaAcquireResult>;
  commit(uid: string, reservationId: string, actualCostBrl: number, unitReserveBrl?: number): Promise<void>;
  release(uid: string, reservationId: string, unitReserveBrl?: number): Promise<void>;
  snapshot(): { committedBrl: number; reservedInFlightBrl: number };
}

const DEFAULT_RESERVE_BRL = 0.025;
const DEFAULT_USER_CAP_BRL = 1.5;
const DEFAULT_GLOBAL_POOL_CAP_BRL = 25.0;

export function createInMemoryAtomicQuotaEngine(
  poolCapBrl = DEFAULT_GLOBAL_POOL_CAP_BRL,
  unitReserveBrl = DEFAULT_RESERVE_BRL,
  userCapBrl = DEFAULT_USER_CAP_BRL
): AtomicQuotaEngine {
  let committedBrl = 0;
  let reservedInFlightBrl = 0;
  const activeUidLocks = new Set<string>();
  const userSpent = new Map<string, number>();

  return {
    async acquire(uid: string, reserve = unitReserveBrl): Promise<QuotaAcquireResult> {
      if (activeUidLocks.has(uid)) {
        return { allowed: false, code: 'BOT_BURST_DETECTED' };
      }
      const spent = userSpent.get(uid) || 0;
      if (spent + reserve > userCapBrl + 1e-9) {
        return { allowed: false, code: 'USER_QUOTA_CAP' };
      }
      if (committedBrl + reservedInFlightBrl + reserve > poolCapBrl + 1e-9) {
        return { allowed: false, code: 'POOL_CAP' };
      }
      activeUidLocks.add(uid);
      reservedInFlightBrl = Number((reservedInFlightBrl + reserve).toFixed(6));
      return { allowed: true, code: 'OK', reservationId: `${uid}:${Date.now()}` };
    },
    async commit(uid: string, _resId: string, actualCostBrl: number, reserve = unitReserveBrl): Promise<void> {
      activeUidLocks.delete(uid);
      reservedInFlightBrl = Math.max(0, Number((reservedInFlightBrl - reserve).toFixed(6)));
      committedBrl = Number((committedBrl + actualCostBrl).toFixed(6));
      userSpent.set(uid, Number(((userSpent.get(uid) || 0) + actualCostBrl).toFixed(6)));
    },
    async release(uid: string, _resId: string, reserve = unitReserveBrl): Promise<void> {
      activeUidLocks.delete(uid);
      reservedInFlightBrl = Math.max(0, Number((reservedInFlightBrl - reserve).toFixed(6)));
    },
    snapshot: () => ({ committedBrl, reservedInFlightBrl }),
  };
}

const memoryEngine = createInMemoryAtomicQuotaEngine();

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function acquireQuotaSlot(uid: string, unitReserveBrl = DEFAULT_RESERVE_BRL): Promise<QuotaAcquireResult> {
  const db = getAdminDb();
  if (!isAdminReady() || !db) {
    return memoryEngine.acquire(uid, unitReserveBrl);
  }

  const day = todayKey();
  const userRef = db.collection('ai_quota_usage').doc(`${uid}_${day}`);
  const globalRef = db.collection('ai_quota_global').doc(day);
  const reservationId = `${uid}_${Date.now()}`;

  try {
    return await db.runTransaction(async (tx) => {
      const [userSnap, globalSnap] = await Promise.all([tx.get(userRef), tx.get(globalRef)]);
      const userData = userSnap.data() || { spentBrl: 0, inFlightCount: 0 };
      const globalData = globalSnap.data() || { committedBrl: 0, reservedInFlightBrl: 0 };

      if ((userData.inFlightCount || 0) >= 2) {
        return { allowed: false, code: 'BOT_BURST_DETECTED' };
      }
      if ((userData.spentBrl || 0) + unitReserveBrl > DEFAULT_USER_CAP_BRL) {
        return { allowed: false, code: 'USER_QUOTA_CAP' };
      }
      if ((globalData.committedBrl || 0) + (globalData.reservedInFlightBrl || 0) + unitReserveBrl > DEFAULT_GLOBAL_POOL_CAP_BRL) {
        return { allowed: false, code: 'POOL_CAP' };
      }

      tx.set(userRef, {
        spentBrl: userData.spentBrl || 0,
        inFlightCount: (userData.inFlightCount || 0) + 1,
        updatedAt: Date.now(),
      }, { merge: true });

      tx.set(globalRef, {
        committedBrl: globalData.committedBrl || 0,
        reservedInFlightBrl: Number(((globalData.reservedInFlightBrl || 0) + unitReserveBrl).toFixed(6)),
        updatedAt: Date.now(),
      }, { merge: true });

      return { allowed: true, code: 'OK', reservationId };
    });
  } catch {
    return memoryEngine.acquire(uid, unitReserveBrl);
  }
}

export async function commitQuotaUsage(
  uid: string,
  reservationId: string,
  actualCostBrl: number,
  unitReserveBrl = DEFAULT_RESERVE_BRL
): Promise<void> {
  const db = getAdminDb();
  if (!isAdminReady() || !db) {
    await memoryEngine.commit(uid, reservationId, actualCostBrl, unitReserveBrl);
    return;
  }

  const day = todayKey();
  const userRef = db.collection('ai_quota_usage').doc(`${uid}_${day}`);
  const globalRef = db.collection('ai_quota_global').doc(day);

  await db.runTransaction(async (tx) => {
    const [userSnap, globalSnap] = await Promise.all([tx.get(userRef), tx.get(globalRef)]);
    const userData = userSnap.data() || { spentBrl: 0, inFlightCount: 0 };
    const globalData = globalSnap.data() || { committedBrl: 0, reservedInFlightBrl: 0 };

    tx.set(userRef, {
      spentBrl: Number(((userData.spentBrl || 0) + actualCostBrl).toFixed(6)),
      inFlightCount: Math.max(0, (userData.inFlightCount || 0) - 1),
      updatedAt: Date.now(),
    }, { merge: true });

    tx.set(globalRef, {
      committedBrl: Number(((globalData.committedBrl || 0) + actualCostBrl).toFixed(6)),
      reservedInFlightBrl: Math.max(0, Number(((globalData.reservedInFlightBrl || 0) - unitReserveBrl).toFixed(6))),
      updatedAt: Date.now(),
    }, { merge: true });
  }).catch(() => undefined);
}

export async function releaseQuotaReservation(
  uid: string,
  reservationId: string,
  unitReserveBrl = DEFAULT_RESERVE_BRL
): Promise<void> {
  const db = getAdminDb();
  if (!isAdminReady() || !db) {
    await memoryEngine.release(uid, reservationId, unitReserveBrl);
    return;
  }

  const day = todayKey();
  const userRef = db.collection('ai_quota_usage').doc(`${uid}_${day}`);
  const globalRef = db.collection('ai_quota_global').doc(day);

  await db.runTransaction(async (tx) => {
    const [userSnap, globalSnap] = await Promise.all([tx.get(userRef), tx.get(globalRef)]);
    const userData = userSnap.data() || { inFlightCount: 0 };
    const globalData = globalSnap.data() || { reservedInFlightBrl: 0 };

    tx.set(userRef, {
      inFlightCount: Math.max(0, (userData.inFlightCount || 0) - 1),
      updatedAt: Date.now(),
    }, { merge: true });

    tx.set(globalRef, {
      reservedInFlightBrl: Math.max(0, Number(((globalData.reservedInFlightBrl || 0) - unitReserveBrl).toFixed(6))),
      updatedAt: Date.now(),
    }, { merge: true });
  }).catch(() => undefined);
}

export function sanitizeAiErrorMessage(error: unknown): { status: number; message: string } {
  const raw = error instanceof Error ? error.message : String(error || '');
  const lower = raw.toLowerCase();

  if (lower.includes('429') || lower.includes('resource_exhausted') || lower.includes('quota')) {
    return {
      status: 429,
      message: 'O guia de IA atingiu o limite momentâneo de chamadas. Aguarde 15 segundos e tente novamente.',
    };
  }
  if (lower.includes('api_key') || lower.includes('permission_denied') || lower.includes('unauthenticated')) {
    return {
      status: 503,
      message: 'Serviço de IA temporariamente indisponível para esta escola. Verifique a configuração no servidor.',
    };
  }
  return {
    status: 500,
    message: 'Não foi possível concluir a resposta do guia agora. Tente reformular sua pergunta em instantes.',
  };
}
