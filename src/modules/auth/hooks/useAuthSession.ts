import { useCallback, useEffect, useState } from 'react';
import type { UserProfile } from '../../../shared/types/domain';
import {
  loginWithClassroomCode,
  loginWithGoogleAccount,
  logoutSession,
  subscribeAuthChanges,
} from '../services/authService';

export function useAuthSession() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeAuthChanges((profile) => {
      setUser(profile);
      setLoading(false);
    });
    return unsub;
  }, []);

  const enterWithClassroom = useCallback(async (nickname: string, classCode: string) => {
    setAuthError(null);
    const profile = await loginWithClassroomCode(nickname, classCode);
    setUser(profile);
    return profile;
  }, []);

  const enterWithGoogle = useCallback(async () => {
    setAuthError(null);
    try {
      const profile = await loginWithGoogleAccount();
      setUser(profile);
      return profile;
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Não foi possível entrar com Google.');
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutSession();
    setUser(null);
  }, []);

  return { user, loading, authError, enterWithClassroom, enterWithGoogle, logout };
}
