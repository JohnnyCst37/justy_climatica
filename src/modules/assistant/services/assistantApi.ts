import { postApiJson } from '../../../shared/services/apiClient';
import type {
  AssistantReply,
  CommunityNode,
  JourneyKey,
  JourneyProgress,
} from '../../../shared/types/domain';

export async function askGuideAssistant(params: {
  community: CommunityNode;
  activeJourney: JourneyKey;
  stepIndex: number;
  progress: JourneyProgress;
  userMessage: string;
  visitorAge?: number;
  sessionToken?: string;
}): Promise<AssistantReply> {
  return postApiJson<
    {
      communityId: string;
      communityTitle: string;
      communityBiome: string;
      communityLocation: string;
      activeJourney: JourneyKey;
      currentStepIndex: number;
      completedJourneys: { justica: number[]; ciencia: number[]; saberes: number[] };
      userMessage: string;
      visitorAge?: number;
      useWebSearch: boolean;
    },
    AssistantReply
  >(
    '/api/assistant/step',
    {
      communityId: params.community.id,
      communityTitle: params.community.titulo,
      communityBiome: params.community.bioma,
      communityLocation: `${params.community.municipio} (${params.community.regiaoMT})`,
      activeJourney: params.activeJourney,
      currentStepIndex: params.stepIndex,
      completedJourneys: {
        justica: params.progress.justica,
        ciencia: params.progress.ciencia,
        saberes: params.progress.saberes,
      },
      userMessage: params.userMessage,
      visitorAge: params.visitorAge,
      useWebSearch: false,
    },
    params.sessionToken
  );
}

export async function requestNarrationAudio(params: {
  texto: string;
  slideId: string;
  voz?: 'Aoede' | 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
  sessionToken?: string;
}): Promise<string> {
  const res = await postApiJson<
    { texto: string; slideId: string; voz: 'Aoede' | 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr' },
    { audioUrl: string }
  >(
    '/api/narrar-historia',
    { texto: params.texto, slideId: params.slideId, voz: params.voz || 'Aoede' },
    params.sessionToken
  );
  return res.audioUrl;
}

export async function requestEphemeralLiveToken(params: {
  communityTitle: string;
  activeJourney: JourneyKey;
  currentStepIndex: number;
  sessionToken?: string;
}): Promise<{ token: string; model: string }> {
  return postApiJson<
    { communityTitle: string; activeJourney: JourneyKey; currentStepIndex: number },
    { token: string; model: string }
  >(
    '/api/live-token',
    {
      communityTitle: params.communityTitle,
      activeJourney: params.activeJourney,
      currentStepIndex: params.currentStepIndex,
    },
    params.sessionToken
  );
}
