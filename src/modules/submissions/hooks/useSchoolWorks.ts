import { useCallback, useEffect, useState } from 'react';
import type { CommunityNode, SchoolWork, UserProfile } from '../../../shared/types/domain';
import { isStaffRole } from '../../auth/services/accessControlService';
import {
  approveSchoolWork,
  fetchCommunityWorks,
  submitSchoolWork,
} from '../services/worksService';

export function useSchoolWorks(community: CommunityNode | null, user: UserProfile | null) {
  const [works, setWorks] = useState<SchoolWork[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!community) return;
    setLoading(true);
    try {
      const list = await fetchCommunityWorks(
        community,
        user?.uid,
        isStaffRole(user?.role)
      );
      setWorks(list);
    } finally {
      setLoading(false);
    }
  }, [community, user?.uid, user?.role]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const submitWork = useCallback(
    async (input: {
      schoolName: string;
      classGroup: string;
      title: string;
      workType: SchoolWork['workType'];
      description: string;
      videoUrl?: string;
      videoFile?: File;
      imageFileBase64?: string;
      imageMimeType?: 'image/png' | 'image/jpeg' | 'image/webp';
      onUploadProgress?: (pct: number) => void;
    }) => {
      if (!community || !user) return null;
      const created = await submitSchoolWork({
        ...input,
        communityId: community.id,
        authorUid: user.uid,
        authorLabel: user.nickname,
        sessionToken: user.sessionToken,
        autoApprove: isStaffRole(user.role),
      });
      setWorks((prev) => [created, ...prev]);
      return created;
    },
    [community, user]
  );

  const approveWork = useCallback(async (workId: string) => {
    await approveSchoolWork(workId);
    setWorks((prev) =>
      prev.map((w) => (w.id === workId ? { ...w, status: 'approved' } : w))
    );
  }, []);

  return { works, loading, reload, submitWork, approveWork };
}
