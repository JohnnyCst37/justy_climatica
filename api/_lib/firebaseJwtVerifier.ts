import crypto from 'node:crypto';

const GOOGLE_CERTS_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

export interface VerifiedFirebaseJwtUser {
  uid: string;
  email?: string;
  signInProvider?: string;
  isAnonymous: boolean;
}

let cachedCerts: Record<string, string> | null = null;
let cachedCertsExpiresAt = 0;

async function getGooglePublicCerts(): Promise<Record<string, string>> {
  const now = Date.now();
  if (cachedCerts && now < cachedCertsExpiresAt) {
    return cachedCerts;
  }
  const res = await fetch(GOOGLE_CERTS_URL);
  if (!res.ok) {
    throw new Error(`Falha ao obter certificados X.509 do Google: HTTP ${res.status}`);
  }
  const certs = (await res.json()) as Record<string, string>;
  cachedCerts = certs;
  cachedCertsExpiresAt = now + 55 * 60 * 1000;
  return certs;
}

function decodeBase64UrlJson<T>(segment: string): T {
  const json = Buffer.from(segment, 'base64url').toString('utf8');
  return JSON.parse(json) as T;
}

/**
 * Verificação criptográfica Zero-Trust (RS256 via X.509 públicos do Google).
 * Funciona na Vercel sem exigir serviceAccountKey.json ou FIREBASE_SERVICE_ACCOUNT_JSON.
 */
export async function verifyFirebaseIdTokenRS256(
  authHeader?: string
): Promise<VerifiedFirebaseJwtUser | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice('Bearer '.length).trim();
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    const header = decodeBase64UrlJson<{ alg?: string; kid?: string }>(parts[0]);
    const payload = decodeBase64UrlJson<{
      iss?: string;
      aud?: string;
      sub?: string;
      exp?: number;
      email?: string;
      firebase?: { sign_in_provider?: string };
    }>(parts[1]);

    if (header.alg !== 'RS256' || !header.kid) return null;
    if (!payload.sub || !payload.exp || !payload.iss) return null;

    const projectId = (
      process.env.FIREBASE_PROJECT_ID ||
      process.env.VITE_FIREBASE_PROJECT_ID ||
      'climate-justicy'
    ).trim();

    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.exp < nowSec - 30) return null;
    if (payload.aud !== projectId) return null;
    if (payload.iss !== `https://securetoken.google.com/${projectId}`) return null;

    const certs = await getGooglePublicCerts();
    const certPem = certs[header.kid];
    if (!certPem) return null;

    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(`${parts[0]}.${parts[1]}`);
    verifier.end();

    const signatureValid = verifier.verify(certPem, Buffer.from(parts[2], 'base64url'));
    if (!signatureValid) return null;

    const provider = payload.firebase?.sign_in_provider;
    return {
      uid: payload.sub,
      email: payload.email,
      signInProvider: provider,
      isAnonymous: provider === 'anonymous',
    };
  } catch {
    return null;
  }
}
