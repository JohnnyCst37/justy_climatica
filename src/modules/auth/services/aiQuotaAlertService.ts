import { signInAnonymously } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import {
  getFirebaseAuthClient,
  getFirestoreClient,
} from '../../../shared/config/firebaseClient';

export type QuotaIncidentSeverity = 'healthy' | 'rate_limited' | 'quota_exhausted' | 'key_error';

export interface AiQuotaAlertRecord {
  status: QuotaIncidentSeverity;
  incidentCount: number;
  lastPath?: string;
  lastHttpStatus?: number;
  lastMessage?: string;
  keyPrefix?: string | null;
  poolSpentBrl?: number;
  poolLimitBrl?: number;
  geminiConfigured?: boolean;
  updatedAt: number;
}

const LOCAL_QUOTA_ALERT_KEY = 'justy_ai_quota_alert_v1';

async function ensureAlertAuth(): Promise<void> {
  const auth = getFirebaseAuthClient();
  if (auth && !auth.currentUser) {
    await signInAnonymously(auth).catch(() => undefined);
  }
}

function loadLocalAlert(): AiQuotaAlertRecord | null {
  try {
    const raw = localStorage.getItem(LOCAL_QUOTA_ALERT_KEY);
    return raw ? (JSON.parse(raw) as AiQuotaAlertRecord) : null;
  } catch {
    return null;
  }
}

function saveLocalAlert(record: AiQuotaAlertRecord): void {
  try {
    localStorage.setItem(LOCAL_QUOTA_ALERT_KEY, JSON.stringify(record));
  } catch {
    // ignore storage errors
  }
}

export async function reportClientAiQuotaIncident(input: {
  path: string;
  status: number;
  message: string;
}): Promise<void> {
  if (input.status !== 429 && input.status !== 503) return;
  const prev = loadLocalAlert();
  const nextCount = (prev?.incidentCount || 0) + 1;
  const lower = input.message.toLowerCase();
  let severity: QuotaIncidentSeverity = 'rate_limited';

  if (input.status === 503 || lower.includes('indispon') || lower.includes('chave') || lower.includes('api_key')) {
    severity = 'key_error';
  } else if (nextCount >= 3 || lower.includes('cota') || lower.includes('esgot') || lower.includes('daily')) {
    severity = 'quota_exhausted';
  }

  const record: AiQuotaAlertRecord = {
    status: severity,
    incidentCount: nextCount,
    lastPath: input.path,
    lastHttpStatus: input.status,
    lastMessage: input.message.slice(0, 180),
    updatedAt: Date.now(),
  };

  saveLocalAlert(record);
  const db = getFirestoreClient();
  if (db) {
    await ensureAlertAuth();
    await setDoc(doc(db, 'system_alerts', 'ai_quota_status'), record, { merge: true }).catch(() => undefined);
  }
}

export async function clearAiQuotaAlert(): Promise<void> {
  const record: AiQuotaAlertRecord = {
    status: 'healthy',
    incidentCount: 0,
    lastMessage: 'Alerta redefinido pelo Super Admin.',
    updatedAt: Date.now(),
  };
  saveLocalAlert(record);
  const db = getFirestoreClient();
  if (db) {
    await ensureAlertAuth();
    await setDoc(doc(db, 'system_alerts', 'ai_quota_status'), record, { merge: true }).catch(() => undefined);
  }
}

export async function probeGeminiKeyLive(classroomSessionToken?: string): Promise<AiQuotaAlertRecord> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const auth = getFirebaseAuthClient();
  if (auth?.currentUser) {
    headers.Authorization = `Bearer ${await auth.currentUser.getIdToken()}`;
  } else if (classroomSessionToken) {
    headers['x-classroom-session'] = classroomSessionToken;
  }

  let healthData: {
    geminiConfigured?: boolean;
    env?: { resolvedKey?: { prefix?: string | null } };
    quotaTelemetry?: {
      status?: QuotaIncidentSeverity;
      poolSpentBrl?: number;
      poolLimitBrl?: number;
      lastErrorMessage?: string | null;
    };
  } = {};

  try {
    const hRes = await fetch('/api/health');
    if (hRes.ok) healthData = (await hRes.json()) as typeof healthData;
  } catch {
    // ignore health error and proceed to probe
  }

  const res = await fetch('/api/admin/test-gemini-key', {
    method: 'POST',
    headers,
    body: '{}',
  });
  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
    modelUsed?: string;
    latencyMs?: number;
    health?: typeof healthData;
    quotaTelemetry?: typeof healthData.quotaTelemetry;
  };

  const mergedHealth = data.health || healthData;
  const telemetry = data.quotaTelemetry || mergedHealth.quotaTelemetry;
  const status: QuotaIncidentSeverity = data.ok
    ? 'healthy'
    : res.status === 503 || !mergedHealth.geminiConfigured
    ? 'key_error'
    : 'quota_exhausted';

  const record: AiQuotaAlertRecord = {
    status,
    incidentCount: data.ok ? 0 : (loadLocalAlert()?.incidentCount || 0) + 1,
    lastPath: '/api/admin/test-gemini-key',
    lastHttpStatus: res.status,
    lastMessage: data.ok
      ? `Chave ativa (${data.modelUsed || 'gemini-3.8-flash'} · ${data.latencyMs || 0} ms)`
      : data.error || 'Falha ao testar cota da chave Gemini.',
    keyPrefix: mergedHealth.env?.resolvedKey?.prefix || null,
    poolSpentBrl: telemetry?.poolSpentBrl ?? 0,
    poolLimitBrl: telemetry?.poolLimitBrl ?? 25,
    geminiConfigured: Boolean(mergedHealth.geminiConfigured),
    updatedAt: Date.now(),
  };

  saveLocalAlert(record);
  const db = getFirestoreClient();
  if (db) {
    await ensureAlertAuth();
    await setDoc(doc(db, 'system_alerts', 'ai_quota_status'), record, { merge: true }).catch(() => undefined);
  }
  return record;
}

export function subscribeAiQuotaAlerts(
  onUpdate: (alert: AiQuotaAlertRecord | null) => void
): () => void {
  onUpdate(loadLocalAlert());
  const db = getFirestoreClient();
  if (!db) return () => undefined;

  let active = true;
  let unsub: (() => void) | undefined;

  void ensureAlertAuth().then(() => {
    if (!active) return;
    unsub = onSnapshot(
      doc(db, 'system_alerts', 'ai_quota_status'),
      (snap) => {
        if (!snap.exists()) return;
        const remote = snap.data() as AiQuotaAlertRecord;
        saveLocalAlert(remote);
        onUpdate(remote);
      },
      () => onUpdate(loadLocalAlert())
    );
  });

  return () => {
    active = false;
    unsub?.();
  };
}
