import { postApiJson } from '../../../shared/services/apiClient';
import type {
  AssistantReply,
  CommunityNode,
  JourneyKey,
  JourneyProgress,
} from '../../../shared/types/domain';

interface DiscoveredCommunityRaw {
  id: string;
  titulo: string;
  subtitulo: string;
  municipio: string;
  bioma: 'Cerrado' | 'Pantanal' | 'Amazônia-Cerrado';
  lat: number;
  lng: number;
  injusticaClimatica: string;
  cienciaClara: string;
  saberesLocais: string;
  porquePrecisaDeVoz: string;
  fontes: Array<{ titulo: string; url: string }>;
}

export async function askGuideAssistant(params: {
  community: CommunityNode;
  activeJourney: JourneyKey;
  stepIndex: number;
  progress: JourneyProgress;
  userMessage: string;
  useWebSearch: boolean;
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
      useWebSearch: params.useWebSearch,
    },
    params.sessionToken
  );
}

export async function discoverCommunitiesFromWeb(params: {
  query: string;
  biome?: 'Cerrado' | 'Pantanal' | 'Amazônia-Cerrado' | 'Todos';
  sessionToken?: string;
}): Promise<CommunityNode[]> {
  const result = await postApiJson<
    { query: string; biome: 'Cerrado' | 'Pantanal' | 'Amazônia-Cerrado' | 'Todos' },
    { comunidades: DiscoveredCommunityRaw[] }
  >(
    '/api/assistant/discover',
    { query: params.query, biome: params.biome || 'Todos' },
    params.sessionToken
  );

  return result.comunidades.map((c) => ({
    id: `web-${c.id}`,
    titulo: c.titulo,
    subtitulo: c.subtitulo,
    grupoId: 'descobertas',
    grupoNome: 'Vozes Descobertas na Web',
    grupoCor: '#e11d48',
    bioma: c.bioma,
    municipio: c.municipio,
    regiaoMT: 'Comunidade localizada via busca na web',
    coordenadas: { lat: c.lat, lng: c.lng },
    equipeAlunos: ['Aguardando equipe escolar adotar este território'],
    orientador: 'Curadoria Aberta',
    escola: 'Rede de Escolas de Mato Grosso',
    serie: '9º Ano',
    especiesCientificas: [],
    pontosInfograficoPT: [],
    narracaoModoHistoria: `${c.titulo}. ${c.injusticaClimatica} ${c.cienciaClara}`,
    justicaClimaticaExplicacao: {
      quemSofreImpacto: c.titulo,
      causaDoProblema: c.injusticaClimatica,
      porQueEInjusto: c.porquePrecisaDeVoz,
    },
    unidadeConservacaoRelacionada: {
      nome: 'Território em Mapeamento Participativo',
      categoriaSNUC: 'Uso Sustentável / Território Tradicional',
      explicacaoEF09CI12: c.porquePrecisaDeVoz,
    },
    focoTematico: c.subtitulo,
    conceitosChave: ['Justiça Climática', 'Comunidades Invisibilizadas'],
    habilidadesBNCC: [],
    fontesPesquisa: c.fontes.map((f) => `${f.titulo} (${f.url})`),
    infografico: { url: '', titulo: c.titulo, legenda: c.cienciaClara, autor: 'Busca Web Gemini', formato: 'imagem' },
    videoEquipe: { url: '', titulo: 'Adote esta comunidade na sua escola', duracao: '-', descricao: c.porquePrecisaDeVoz, roteiroResumo: '' },
    resumoCientifico: {
      introducao: c.saberesLocais,
      diagnosticoEcologico: c.cienciaClara,
      ameacasImpactos: c.injusticaClimatica,
      solucoesComunitarias: c.porquePrecisaDeVoz,
      conclusaoEstudantil: c.porquePrecisaDeVoz,
    },
    diarioDeBordo: {
      dataRegistro: 'Registro Web Verificado',
      depoimentoOuVoz: c.saberesLocais,
      autorVoz: c.titulo,
      cargoOuFuncao: 'Comunidade tradicional mapeada',
      observacoesCampo: c.porquePrecisaDeVoz,
    },
    metricas: [],
    acoesPropostas: [],
    isWebDiscovered: true,
    porquePrecisaDeVoz: c.porquePrecisaDeVoz,
    fontesWeb: c.fontes,
  }));
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
