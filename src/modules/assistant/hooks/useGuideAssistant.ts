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
  requestEphemeralLiveToken,
  requestNarrationAudio,
} from '../services/assistantApi';
import { LiveVoiceSession } from '../services/liveVoiceClient';
import {
  buildContextualGreeting,
  playBrowserSpeech,
  stopAllAudio,
  unlockMobileAudioElement,
  waitAudioReady,
} from '../services/soundNarrator';
import { lyriaEngine } from '../../audio/services/lyriaSoundscapeEngine';

export function useGuideAssistant(params: {
  community: CommunityNode | null;
  activeJourney: JourneyKey;
  stepIndex: number;
  progress: JourneyProgress;
  user: UserProfile | null;
  onRequestLogin: () => void;
}) {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [loadingReply, setLoadingReply] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'connecting' | 'live' | 'speaking'>('idle');
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const liveRef = useRef<LiveVoiceSession | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechSeqRef = useRef(0);

  useEffect(() => {
    lyriaEngine.setVoiceDucking(voiceStatus === 'speaking' || voiceStatus === 'live');
  }, [voiceStatus]);

  useEffect(() => {
    if (!params.community) return;
    setMessages([
      {
        id: `intro-${params.community.id}-${params.activeJourney}-${params.stepIndex}`,
        sender: 'guide',
        text: buildContextualGreeting(params.community, params.activeJourney, params.stepIndex),
        prompts: [
          'Explique este passo de um jeito bem simples',
          'Como nossa escola pode ajudar essa comunidade?',
        ],
      },
    ]);
  }, [params.community?.id, params.activeJourney, params.stepIndex]);

  const sendMessage = useCallback(
    async (text: string) => {
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
          visitorAge: params.user.age,
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
    speechSeqRef.current += 1;
    stopAllAudio(audioRef.current);
    setVoiceStatus('idle');
    setIsAudioLoading(false);
  }, []);

  const startBrowserFallback = useCallback((text: string, seq: number) => {
    playBrowserSpeech(
      text,
      () => {
        if (seq !== speechSeqRef.current) return;
        setVoiceStatus('idle');
        setIsAudioLoading(false);
      },
      () => {
        if (seq !== speechSeqRef.current) return;
        setVoiceStatus('idle');
        setIsAudioLoading(false);
        setErrorMsg('Aguarde um instante para a narração HD do Guia.');
      }
    );
  }, []);

  const speakText = useCallback(
    async (text: string) => {
      const seq = ++speechSeqRef.current;
      setErrorMsg(null);
      setIsAudioLoading(true);
      setVoiceStatus('speaking');
      stopAllAudio(audioRef.current);

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.preload = 'auto';
      unlockMobileAudioElement(audioRef.current);

      try {
        const url = await requestNarrationAudio({
          texto: text,
          slideId: `${params.community?.id || 'guide'}-${params.activeJourney}-${params.stepIndex}-${text.length}`,
          voz: 'Aoede',
          sessionToken: params.user?.sessionToken,
        });

        if (seq !== speechSeqRef.current) return;

        stopAllAudio(audioRef.current);
        const player = audioRef.current || new Audio();
        audioRef.current = player;
        player.src = url;
        player.onended = () => {
          if (seq !== speechSeqRef.current) return;
          setVoiceStatus('idle');
          setIsAudioLoading(false);
        };
        player.onerror = () => {
          if (seq !== speechSeqRef.current) return;
          setIsAudioLoading(false);
          startBrowserFallback(text, seq);
        };
        player.load();
        await waitAudioReady(player, 8000);
        if (seq !== speechSeqRef.current) return;

        setIsAudioLoading(false);
        await player.play();
      } catch {
        if (seq !== speechSeqRef.current) return;
        setIsAudioLoading(false);
        startBrowserFallback(text, seq);
      }
    },
    [params.user, params.community?.id, params.activeJourney, params.stepIndex, startBrowserFallback]
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

  return {
    messages,
    loadingReply,
    voiceStatus,
    isPlayingAudio: voiceStatus === 'speaking' || voiceStatus === 'live',
    isAudioLoading,
    errorMsg,
    sendMessage,
    speakText,
    toggleStoryAudio,
    stopAudio,
    toggleLiveVoice,
  };
}
