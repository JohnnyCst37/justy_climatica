import { useCallback, useEffect, useState } from 'react';
import type { CommunityNode } from '../types/domain';
import {
  COMMUNITIES_UPDATED_EVENT,
  createCustomCommunity,
  getSyncCommunities,
  loadAllCommunities,
  type CreateCommunityInput,
} from '../services/customCommunitiesService';

export function useCommunitiesList() {
  const [communities, setCommunities] = useState<CommunityNode[]>(getSyncCommunities);

  const refreshCommunities = useCallback(async () => {
    const merged = await loadAllCommunities();
    setCommunities(merged);
  }, []);

  useEffect(() => {
    void refreshCommunities();
    const handler = () => {
      void refreshCommunities();
    };
    window.addEventListener(COMMUNITIES_UPDATED_EVENT, handler);
    return () => window.removeEventListener(COMMUNITIES_UPDATED_EVENT, handler);
  }, [refreshCommunities]);

  const addCommunity = useCallback(
    async (input: CreateCommunityInput) => {
      const created = await createCustomCommunity(input);
      await refreshCommunities();
      return created;
    },
    [refreshCommunities]
  );

  return { communities, refreshCommunities, addCommunity };
}

