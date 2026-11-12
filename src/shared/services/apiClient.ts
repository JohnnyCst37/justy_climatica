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

export async function postApiJson<TRequest, TResponse>(
  path: string,
  payload: TRequest,
  classroomSessionToken?: string
): Promise<TResponse> {
  const headers = await buildAuthHeaders(classroomSessionToken);
  const response = await fetch(path, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as TResponse & { error?: string };
  if (!response.ok) {
    throw new Error(data.error || `Falha na requisição (${response.status}).`);
  }

  return data;
}
