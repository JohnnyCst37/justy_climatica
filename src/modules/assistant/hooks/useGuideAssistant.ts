import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  AssistantMessage,
  CommunityNode,
  JourneyKey,
  JourneyProgress,
  UserProfile,
} from '../../../shared/types/domain';
import {
  askGuideAssistant,
  discoverCommunitiesFromWeb,
  requestEphemeralLiveToken,
  requestNarrationAudio,
} from '../services/assistantApi';
import { LiveVoiceSession } from '../services/liveVoiceClient';
import {
  buildContextualGreeting,
  playBrowserSpeech,
  stopAllAudio,
} from '../services/soundNarrator';

export function useGuideAssistant(params: {
  community: CommunityNode | null;
  activeJourney: JourneyKey;
  stepIndex: number;
  progress: JourneyProgress;
  user: UserProfile | null;
  onDiscoveredCommunities: (items: CommunityNode[]) => void;
  onRequestLogin: () => void;
}) {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [loadingReply, setLoadingReply] = useState(false);
  const [discoveringWeb, setDiscoveringWeb] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'connecting' | 'live' | 'speaking'>('idle');
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const liveRef = useRef<LiveVoiceSession | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!params.community) return;
    setMessages([
      {
        id: `intro-${params.community.id}-${params.activeJourney}-${params.stepIndex}`,
        sender: 'guide',
        text: buildContextualGreeting(params.community, params.activeJourney, params.stepIndex),
        prompts: [
          'Explique este passo de um jeito bem simples',
          'Buscar comunidades anônimas parecidas na web',
        ],
      },
    ]);
  }, [params.community?.id, params.activeJourney, params.stepIndex]);

  const sendMessage = useCallback(
    async (text: string, useWebSearch = false) => {
      if (!params.community || !text.trim()) return;
      if (!params.user) {
        params.onRequestLogin();
        return;
      }

      setErrorMsg(null);
      const userMsg: AssistantMessage = { id: `u-${Date.now()}`, sender: 'user', text: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setLoadingReply(true);

      try {
        const reply = await askGuideAssistant({
          community: params.community,
          activeJourney: params.activeJourney,
          stepIndex: params.stepIndex,
          progress: params.progress,
          userMessage: text.trim(),
          useWebSearch,
          sessionToken: params.user.sessionToken,
        });
        setMessages((prev) => [
          ...prev,
          {
            id: `g-${Date.now()}`,
            sender: 'guide',
            text: reply.respostaNatural,
            nextStepHint: reply.proximoPassoSugerido,
            suggestedJourney: reply.jornadaRecomendada,
            prompts: reply.perguntasGuiadas,
            sources: reply.fontesWeb,
          },
        ]);
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Guia indisponível no momento.');
      } finally {
        setLoadingReply(false);
      }
    },
    [params]
  );

  const stopAudio = useCallback(() => {
    stopAllAudio(audioRef.current);
    setVoiceStatus('idle');
    setIsAudioLoading(false);
  }, []);

  const speakText = useCallback(
    async (text: string) => {
      setErrorMsg(null);
      setIsAudioLoading(true);
      setVoiceStatus('speaking');
      stopAllAudio(audioRef.current);

      try {
        const url = await requestNarrationAudio({
          texto: text,
          slideId: `${params.community?.id || 'guide'}-${params.activeJourney}-${params.stepIndex}`,
          voz: 'Aoede',
          sessionToken: params.user?.sessionToken,
        });

        setIsAudioLoading(false);
        if (!audioRef.current) audioRef.current = new Audio();
        audioRef.current.src = url;
        audioRef.current.onended = () => {
          setVoiceStatus('idle');
          setIsAudioLoading(false);
        };
        audioRef.current.onerror = () => {
          setVoiceStatus('idle');
          setIsAudioLoading(false);
        };
        await audioRef.current.play();
        return;
      } catch {
        setIsAudioLoading(false);
        setErrorMsg(
          'Usando voz local do navegador. Para ouvir a voz HD do Gemini, configure GEMINI_API_KEY no .env e rode via "npm run dev".'
        );
      }

      playBrowserSpeech(
        text,
        () => setVoiceStatus('idle'),
        () => setVoiceStatus('idle')
      );
    },
    [params.user, params.community?.id, params.activeJourney, params.stepIndex]
  );

  const toggleStoryAudio = useCallback(
    async (customText?: string) => {
      if (voiceStatus === 'speaking' || isAudioLoading) {
        stopAudio();
        return;
      }

      const narrative =
        customText ||
        params.community?.narracaoModoHistoria ||
        `Em ${params.community?.municipio || 'Mato Grosso'}, compreendemos o que é Justiça Climática através da história de ${params.community?.titulo || 'nossas comunidades'}.`;

      await speakText(narrative);
    },
    [voiceStatus, isAudioLoading, stopAudio, speakText, params.community]
  );

  const toggleLiveVoice = useCallback(async () => {
    if (voiceStatus === 'live' || voiceStatus === 'connecting') {
      liveRef.current?.stop();
      liveRef.current = null;
      setVoiceStatus('idle');
      return;
    }
    if (!params.community) return;
    if (!params.user) {
      params.onRequestLogin();
      return;
    }

    setErrorMsg(null);
    setVoiceStatus('connecting');
    try {
      const { token, model } = await requestEphemeralLiveToken({
        communityTitle: params.community.titulo,
        activeJourney: params.activeJourney,
        currentStepIndex: params.stepIndex,
        sessionToken: params.user.sessionToken,
      });
      const session = new LiveVoiceSession();
      liveRef.current = session;
      await session.start({
        ephemeralToken: token,
        model,
        onClose: () => setVoiceStatus('idle'),
        onError: (msg) => {
          setErrorMsg(msg);
          setVoiceStatus('idle');
        },
      });
      setVoiceStatus('live');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Voz ao vivo indisponível agora.');
      setVoiceStatus('idle');
    }
  }, [voiceStatus, params]);

  const searchAnonymousCommunities = useCallback(async () => {
    if (!params.user) {
      params.onRequestLogin();
      return;
    }
    setErrorMsg(null);
    setDiscoveringWeb(true);
    try {
      const found = await discoverCommunitiesFromWeb({
        query: 'comunidades tradicionais afetadas por secas ou queimadas sem visibilidade Mato Grosso',
        biome: params.community?.bioma || 'Todos',
        sessionToken: params.user.sessionToken,
      });
      params.onDiscoveredCommunities(found);
      setMessages((prev) => [
        ...prev,
        {
          id: `web-${Date.now()}`,
          sender: 'guide',
          text: `Encontrei ${found.length} comunidades na web que precisam de vozes e coloquei no mapa com o marcador rosa "W".`,
        },
      ]);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Falha na busca web.');
    } finally {
      setDiscoveringWeb(false);
    }
  }, [params]);

  return {
    messages,
    loadingReply,
    discoveringWeb,
    voiceStatus,
    isPlayingAudio: voiceStatus === 'speaking' || voiceStatus === 'live',
    isAudioLoading,
    errorMsg,
    sendMessage,
    speakText,
    toggleStoryAudio,
    stopAudio,
    toggleLiveVoice,
    searchAnonymousCommunities,
  };
}
