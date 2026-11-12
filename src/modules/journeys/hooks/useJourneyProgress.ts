import { useCallback, useEffect, useState } from 'react';
import type { JourneyKey, JourneyProgress } from '../../../shared/types/domain';
import {
  createEmptyProgress,
  loadCommunityJourneyProgress,
  saveCommunityJourneyProgress,
} from '../services/journeyService';

export function useJourneyProgress(uid: string | undefined, communityId: string | undefined) {
  const effectiveUid = uid || 'guest';
  const [progress, setProgress] = useState<JourneyProgress>(createEmptyProgress);
  const [activeJourney, setActiveJourneyState] = useState<JourneyKey>('justica');
  const [stepIndex, setStepIndexState] = useState<number>(0);

  useEffect(() => {
    if (!communityId) return;
    let active = true;
    loadCommunityJourneyProgress(effectiveUid, communityId).then((loaded) => {
      if (!active) return;
      setProgress(loaded);
      setActiveJourneyState(loaded.lastActiveJourney || 'justica');
      setStepIndexState(loaded.lastStepIndex || 0);
    });
    return () => {
      active = false;
    };
  }, [effectiveUid, communityId]);

  const persist = useCallback(
    (next: JourneyProgress) => {
      setProgress(next);
      if (communityId) {
        void saveCommunityJourneyProgress(effectiveUid, communityId, next);
      }
    },
    [effectiveUid, communityId]
  );

  const selectJourney = useCallback(
    (journey: JourneyKey) => {
      setActiveJourneyState(journey);
      setStepIndexState(0);
      persist({ ...progress, lastActiveJourney: journey, lastStepIndex: 0 });
    },
    [progress, persist]
  );

  const goToStep = useCallback(
    (nextStep: number) => {
      const clamped = Math.max(0, Math.min(2, nextStep));
      setStepIndexState(clamped);
      persist({ ...progress, lastActiveJourney: activeJourney, lastStepIndex: clamped });
    },
    [progress, activeJourney, persist]
  );

  const completeAndAdvance = useCallback(() => {
    const doneSet = new Set<number>(progress[activeJourney]);
    doneSet.add(stepIndex);
    const nextStep = stepIndex < 2 ? stepIndex + 1 : stepIndex;
    const nextProgress: JourneyProgress = {
      ...progress,
      [activeJourney]: Array.from(doneSet).sort((a: number, b: number) => a - b),
      lastActiveJourney: activeJourney,
      lastStepIndex: nextStep,
    };
    setStepIndexState(nextStep);
    persist(nextProgress);
  }, [progress, activeJourney, stepIndex, persist]);

  return {
    progress,
    activeJourney,
    stepIndex,
    selectJourney,
    goToStep,
    completeAndAdvance,
  };
}
