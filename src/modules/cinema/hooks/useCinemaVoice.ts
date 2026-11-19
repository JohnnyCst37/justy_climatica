import { useCallback, useEffect, useRef, useState } from 'react';
import { requestNarrationAudio } from '../../assistant/services/assistantApi';
import {
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

  const stopCinemaVoice = useCallback(() => {
    seqRef.current += 1;
    stopAllAudio(audioRef.current);
    setIsSpeaking(false);
    setIsLoadingVoice(false);
  }, []);

  useEffect(() => () => stopCinemaVoice(), [stopCinemaVoice]);

  const speakCinema = useCallback(
    async (text: string, slideId: string, onComplete?: () => void) => {
      const seq = ++seqRef.current;
      stopAllAudio(audioRef.current);
      setIsLoadingVoice(true);
      setIsSpeaking(true);

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.preload = 'auto';
      unlockMobileAudioElement(audioRef.current);

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
        const url = await requestNarrationAudio({
          texto: text,
          slideId,
          voz: 'Aoede',
          sessionToken,
        });

        if (seq !== seqRef.current) return;
        const audio = audioRef.current;
        if (!url || !audio) {
          runFallback();
          return;
        }

        audio.src = url;
        audio.onended = finish;
        audio.onerror = runFallback;
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

  return { speakCinema, stopCinemaVoice, isSpeaking, isLoadingVoice };
}
