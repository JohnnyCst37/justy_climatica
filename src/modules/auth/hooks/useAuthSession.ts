import { useCallback, useEffect, useState } from 'react';
import type { AuthorizedEmailRole, UserProfile } from '../../../shared/types/domain';
import { ROLE_LABELS, findAuthorizedEmail } from '../services/accessControlService';
import {
  loginWithAuthorizedEmail,
  loginWithClassroomCode,
  loginWithGoogleAccount,
  loginWithRolePasscode,
  logoutSession,
  registerAndRequestApproval,
  saveLocalUserProfile,
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

  const enterWithAuthorizedEmail = useCallback(async (email: string) => {
    setAuthError(null);
    try {
      const profile = await loginWithAuthorizedEmail(email);
      setUser(profile);
      return profile;
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'E-mail não autorizado.'
      );
      return null;
    }
  }, []);

  const enterWithRolePasscode = useCallback(
    async (input: { name: string; disciplineOrClasses: string; passcode: string }) => {
      setAuthError(null);
      try {
        const profile = await loginWithRolePasscode(input);
        setUser(profile);
        return profile;
      } catch (err) {
        setAuthError(
          err instanceof Error ? err.message : 'Senha de cargo inválida.'
        );
        return null;
      }
    },
    []
  );

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

  const submitAccessRequest = useCallback(
    async (input: {
      email: string;
      name: string;
      role: AuthorizedEmailRole;
      classGroup?: string;
    }) => {
      setAuthError(null);
      try {
        const profile = await registerAndRequestApproval(input);
        setUser(profile);
        return profile;
      } catch (err) {
        setAuthError(
          err instanceof Error ? err.message : 'Não foi possível enviar o cadastro.'
        );
        return null;
      }
    },
    []
  );

  const refreshApprovalStatus = useCallback(async () => {
    if (!user?.email) return null;
    setAuthError(null);
    const entry = await findAuthorizedEmail(user.email);
    if (!entry) return null;

    const updated: UserProfile = {
      ...user,
      nickname: entry.name,
      role: entry.role,
      classCode: entry.classGroup || ROLE_LABELS[entry.role].toUpperCase(),
      pendingApproval: entry.status === 'pending',
    };
    saveLocalUserProfile(updated);
    setUser(updated);
    if (updated.pendingApproval) {
      setAuthError('Ainda aguardando a aprovação do Super Admin. Tente novamente em instantes.');
    }
    return updated;
  }, [user]);

  const logout = useCallback(async () => {
    await logoutSession();
    setUser(null);
  }, []);

  return {
    user,
    loading,
    authError,
    enterWithClassroom,
    enterWithAuthorizedEmail,
    enterWithRolePasscode,
    enterWithGoogle,
    submitAccessRequest,
    refreshApprovalStatus,
    logout,
  };
}
