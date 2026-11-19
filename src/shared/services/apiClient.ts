import { getFirebaseAuthClient } from '../config/firebaseClient';

async function buildAuthHeaders(classroomSessionToken?: string): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const auth = getFirebaseAuthClient();
  if (auth?.currentUser) {
    const idToken = await auth.currentUser.getIdToken();
    headers.Authorization = `Bearer ${idToken}`;
  } else if (classroomSessionToken) {
    headers['x-classroom-session'] = classroomSessionToken;
  }

  return headers;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

export async function postApiJson<TRequest, TResponse>(
  path: string,
  payload: TRequest,
  classroomSessionToken?: string
): Promise<TResponse> {
  const headers = await buildAuthHeaders(classroomSessionToken);
  const body = JSON.stringify(payload);
  const isTts = path.includes('narrar-historia');
  const timeoutMs = isTts ? 28_000 : 20_000;
  const maxAttempts = isTts ? 3 : 2;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const response = await fetchWithTimeout(
        path,
        { method: 'POST', headers, body },
        timeoutMs
      );
      const data = (await response.json().catch(() => ({}))) as TResponse & { error?: string };
      if (!response.ok) {
        const retryable = response.status === 429 || response.status >= 500;
        if (retryable && attempt + 1 < maxAttempts) {
          await new Promise((r) => window.setTimeout(r, 1400 * (attempt + 1)));
          continue;
        }
        throw new Error(data.error || `Falha na requisição (${response.status}).`);
      }
      return data;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Erro de rede.');
      if (attempt + 1 < maxAttempts) {
        await new Promise((r) => window.setTimeout(r, 1400 * (attempt + 1)));
        continue;
      }
    }
  }

  throw lastError || new Error('Falha na comunicação com o servidor.');
}
