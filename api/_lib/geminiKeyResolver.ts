export interface KeyDiagnosticMeta {
  present: boolean;
  length: number;
  prefix: string | null;
}

export interface ServerHealthReport {
  status: 'ok';
  geminiConfigured: boolean;
  firebaseAdminReady: boolean;
  authMode: 'rs256-x509-zero-trust' | 'firebase-admin-sdk';
  env: {
    GEMINI_API_KEY: KeyDiagnosticMeta;
    GOOGLE_API_KEY: KeyDiagnosticMeta;
    API_KEY: KeyDiagnosticMeta;
    resolvedKey: KeyDiagnosticMeta;
  };
  node: string;
}

/**
 * Sanitiza chaves coladas em painéis de nuvem (remove prefixo "Bearer ", aspas e espaços).
 * Padrão Zero-Trust importado do SAD School Project.
 */
export function sanitizeServerApiKey(raw = ''): string {
  return raw.replace(/^Bearer\s+/i, '').replace(/^["']|["']$/g, '').trim();
}

export function resolveServerGeminiKey(): string {
  const candidates = [
    process.env.GEMINI_API_KEY || '',
    process.env.API_KEY || '',
    process.env.GOOGLE_API_KEY || '',
  ];
  for (const raw of candidates) {
    const clean = sanitizeServerApiKey(raw);
    if (clean) return clean;
  }
  throw new Error('GEMINI_API_KEY_MISSING');
}

export function inspectKeyMeta(raw = ''): KeyDiagnosticMeta {
  const clean = sanitizeServerApiKey(raw);
  return {
    present: clean.length > 0,
    length: clean.length,
    prefix: clean.length > 0 ? clean.slice(0, 5) : null,
  };
}

export function buildServerHealthReport(firebaseAdminReady: boolean): ServerHealthReport {
  const geminiRaw = process.env.GEMINI_API_KEY || '';
  const googleRaw = process.env.GOOGLE_API_KEY || '';
  const apiRaw = process.env.API_KEY || '';
  const resolvedRaw = sanitizeServerApiKey(geminiRaw) || sanitizeServerApiKey(apiRaw) || sanitizeServerApiKey(googleRaw);

  return {
    status: 'ok',
    geminiConfigured: resolvedRaw.length > 0,
    firebaseAdminReady,
    authMode: firebaseAdminReady ? 'firebase-admin-sdk' : 'rs256-x509-zero-trust',
    env: {
      GEMINI_API_KEY: inspectKeyMeta(geminiRaw),
      GOOGLE_API_KEY: inspectKeyMeta(googleRaw),
      API_KEY: inspectKeyMeta(apiRaw),
      resolvedKey: inspectKeyMeta(resolvedRaw),
    },
    node: process.version,
  };
}
