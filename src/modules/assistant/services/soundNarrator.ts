import type { AssistantReply, CommunityNode, JourneyKey } from '../../../shared/types/domain';

export function buildLocalCorpusAssistantReply(
  community: CommunityNode,
  journey: JourneyKey,
  question: string
): AssistantReply {
  const q = question.toLowerCase();
  const sp = community.especiesCientificas[0];
  let answer = '';

  if (q.includes('injust') || q.includes('sofr') || q.includes('causa') || q.includes('quem')) {
    answer = `Em ${community.titulo} (${community.municipio}), ${community.justicaClimaticaExplicacao.quemSofreImpacto} A raiz do problema está ligada a ${community.justicaClimaticaExplicacao.causaDoProblema} — por isso é injusto: ${community.justicaClimaticaExplicacao.porQueEInjusto}`;
  } else if (
    q.includes('especi') ||
    q.includes('água') ||
    q.includes('agua') ||
    q.includes('naturez') ||
    q.includes('bioma') ||
    q.includes('proteg')
  ) {
    answer = `No bioma ${community.bioma}, ${community.resumoCientifico.diagnosticoEcologico} Espécies como ${sp ? `${sp.nomePopular} (${sp.nomeCientificoLatim})` : 'a fauna e flora locais'} são protegidas junto à unidade ${community.unidadeConservacaoRelacionada.nome}.`;
  } else if (q.includes('escola') || q.includes('aluno') || q.includes('propost') || q.includes('ajud') || q.includes('fazer')) {
    const firstAction = community.acoesPropostas[0] || community.resumoCientifico.solucoesComunitarias;
    answer = `Os alunos da ${community.escola} (${community.serie}) destacam como solução comunitária: ${firstAction} Você pode apoiar divulgando os saberes de ${community.diarioDeBordo.autorVoz} e participando do Quiz!`;
  } else {
    answer = `Sobre ${community.titulo} (${community.municipio} · ${community.bioma}): ${community.resumoCientifico.solucoesComunitarias} Além disso, ${community.justicaClimaticaExplicacao.oQueEstaSendoFeito || community.resumoCientifico.conclusaoEstudantil}`;
  }

  return {
    respostaNatural: answer,
    resumoEmUmaFrase: `${community.titulo}: proteção territorial e justiça climática no ${community.bioma}.`,
    proximoPassoSugerido: 'Ouça esta explicação em voz alta ou explore os vídeos selecionados abaixo.',
    jornadaRecomendada: journey,
    perguntasGuiadas: [
      'Quem sofre primeiro os impactos climáticos aqui?',
      'Como nossa escola e os alunos propõem soluções?',
    ],
    fontesWeb: [],
  };
}

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

const MOBILE_UNLOCK_SILENT_WAV =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

const unlockedAudioElements = new WeakSet<HTMLAudioElement>();
const narrationUrlCache = new Map<string, string>();

export function getCachedNarrationUrl(text: string, voice = 'Aoede'): string | undefined {
  return narrationUrlCache.get(`${voice}:${text.trim().toLowerCase()}`);
}

export function setCachedNarrationUrl(text: string, url: string, voice = 'Aoede'): void {
  if (!url) return;
  if (narrationUrlCache.size >= 40) {
    const oldestKey = narrationUrlCache.keys().next().value;
    if (oldestKey) narrationUrlCache.delete(oldestKey);
  }
  narrationUrlCache.set(`${voice}:${text.trim().toLowerCase()}`, url);
}

export function unlockMobileAudioElement(audioEl: HTMLAudioElement): void {
  if (unlockedAudioElements.has(audioEl)) return;
  unlockedAudioElements.add(audioEl);
  try {
    audioEl.src = MOBILE_UNLOCK_SILENT_WAV;
    const playPromise = audioEl.play();
    if (playPromise && typeof playPromise.then === 'function') {
      void playPromise
        .then(() => {
          audioEl.pause();
          audioEl.currentTime = 0;
        })
        .catch(() => undefined);
    }
  } catch {
    // ignore mobile pre-unlock restrictions
  }
}

export function waitAudioReady(audioEl: HTMLAudioElement, timeoutMs = 8000): Promise<void> {
  if (audioEl.readyState >= 2) return Promise.resolve();
  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      audioEl.removeEventListener('canplay', done);
      audioEl.removeEventListener('loadeddata', done);
      window.clearTimeout(timer);
      resolve();
    };
    const timer = window.setTimeout(done, timeoutMs);
    audioEl.addEventListener('canplay', done, { once: true });
    audioEl.addEventListener('loadeddata', done, { once: true });
  });
}

export function stopAllAudio(audioEl: HTMLAudioElement | null): void {
  if (audioEl) {
    audioEl.onended = null;
    audioEl.onerror = null;
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
