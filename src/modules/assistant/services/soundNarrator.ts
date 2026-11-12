import type { CommunityNode, JourneyKey } from '../../../shared/types/domain';

export function buildContextualGreeting(
  community: CommunityNode,
  journey: JourneyKey,
  stepIndex: number
): string {
  if (journey === 'justica') {
    return stepIndex === 0
      ? `Em ${community.municipio}, vamos entender primeiro por que a crise climática atinge ${community.titulo} antes de todo mundo.`
      : `Você já avançou no contexto de Justiça Climática. Quer perguntar o que está sendo feito ou seguir para Ciência Clara?`;
  }
  if (journey === 'ciencia') {
    return `Aqui explicamos sem tecniquês como o modo de vida em ${community.titulo} protege espécies e água no ${community.bioma}.`;
  }
  return `Nesta trilha você ouve os saberes do território e vê quais escolas já estão defendendo ${community.titulo}.`;
}

export function stopAllAudio(audioEl: HTMLAudioElement | null): void {
  if (audioEl) {
    audioEl.pause();
    audioEl.currentTime = 0;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function playBrowserSpeech(
  text: string,
  onEnd: () => void,
  onError: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError();
    return;
  }

  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'pt-BR';
  utter.rate = 0.95;
  utter.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const ptVoice = voices.find(
    (v) =>
      v.lang.includes('pt-BR') &&
      (v.name.includes('Google') ||
        v.name.includes('Luciana') ||
        v.name.includes('Natural') ||
        v.name.includes('Heloisa'))
  );
  if (ptVoice) utter.voice = ptVoice;

  utter.onend = () => onEnd();
  utter.onerror = () => onError();
  window.speechSynthesis.speak(utter);
}
