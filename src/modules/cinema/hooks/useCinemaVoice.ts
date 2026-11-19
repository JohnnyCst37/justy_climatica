import { useCallback, useEffect, useRef, useState } from 'react';
import { requestNarrationAudio } from '../../assistant/services/assistantApi';
import {
  getCachedNarrationUrl,
  playBrowserSpeech,
  stopAllAudio,
  unlockMobileAudioElement,
  waitAudioReady,
} from '../../assistant/services/soundNarrator';

export function useCinemaVoice(sessionToken?: string) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seqRef = useRef(0);
  const prewarmRunRef = useRef(0);

  const stopCinemaVoice = useCallback(() => {
    seqRef.current += 1;
    stopAllAudio(audioRef.current);
    setIsSpeaking(false);
    setIsLoadingVoice(false);
  }, []);

  useEffect(() => {
    return () => {
      prewarmRunRef.current += 1;
      stopCinemaVoice();
    };
  }, [stopCinemaVoice]);

  const prewarmCinemaQuestions = useCallback(
    (texts: string[]) => {
      const runId = ++prewarmRunRef.current;
      void (async () => {
        for (let i = 0; i < texts.length; i += 1) {
          if (runId !== prewarmRunRef.current) return;
          const t = texts[i]?.trim();
          if (!t || getCachedNarrationUrl(t, 'Aoede')) continue;
          try {
            await requestNarrationAudio({
              texto: t,
              slideId: `prewarm-${i}`,
              voz: 'Aoede',
              sessionToken,
            });
          } catch {
            // prewarm silently skips transient errors
          }
          await new Promise((r) => window.setTimeout(r, 2500));
        }
      })();
    },
    [sessionToken]
  );

  const speakCinema = useCallback(
    async (text: string, slideId: string, onComplete?: () => void) => {
      const seq = ++seqRef.current;
      stopAllAudio(audioRef.current);
      setIsSpeaking(true);

      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.preload = 'auto';
        unlockMobileAudioElement(audioRef.current);
      }

      const finish = () => {
        if (seq !== seqRef.current) return;
        setIsSpeaking(false);
        setIsLoadingVoice(false);
        onComplete?.();
      };

      const runFallback = () => {
        if (seq !== seqRef.current) return;
        setIsLoadingVoice(false);
        playBrowserSpeech(text, finish, finish);
      };

      try {
        const cached = getCachedNarrationUrl(text, 'Aoede');
        if (!cached) setIsLoadingVoice(true);
        const url =
          cached ||
          (await requestNarrationAudio({
            texto: text,
            slideId,
            voz: 'Aoede',
            sessionToken,
          }));

        if (seq !== seqRef.current) return;
        const audio = audioRef.current;
        if (!url || !audio) {
          runFallback();
          return;
        }

        stopAllAudio(audio);
        audio.src = url;
        audio.onended = finish;
        audio.onerror = runFallback;
        audio.load();
        await waitAudioReady(audio, 8000);
        if (seq !== seqRef.current) return;
        setIsLoadingVoice(false);
        await audio.play();
      } catch {
        runFallback();
      }
    },
    [sessionToken]
  );

  return { speakCinema, stopCinemaVoice, prewarmCinemaQuestions, isSpeaking, isLoadingVoice };
}
