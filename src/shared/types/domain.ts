export type JourneyKey = 'justica' | 'ciencia' | 'saberes';

export type GrupoId = 'todos' | 'grupo2' | 'grupo1' | 'grupo3' | 'descobertas';

export type BiomaType = 'Pantanal' | 'Cerrado' | 'Amazônia-Cerrado';

export type UserRole = 'student' | 'visitor' | 'professor';

export interface UserProfile {
  uid: string;
  nickname: string;
  classCode: string;
  role: UserRole;
  isAnonymous: boolean;
  sessionToken: string;
}

export interface JourneyProgress {
  justica: number[];
  ciencia: number[];
  saberes: number[];
  lastActiveJourney: JourneyKey;
  lastStepIndex: number;
  updatedAt: number;
}

export interface HabilidadeBNCC {
  codigo: string;
  titulo: string;
  descricao: string;
}

export interface MetricaEstudantil {
  rotulo: string;
  valor: string;
  detalhe: string;
  icone: 'arvore' | 'agua' | 'comunidade' | 'alerta' | 'dna' | 'patrimonio' | 'fogo';
}

export interface EspecieCientifica {
  nomePopular: string;
  nomeCientificoLatim: string;
  familia: string;
  papelEcologico: string;
}

export interface PontoInfograficoPT {
  numero: number;
  xPercent: number;
  yPercent: number;
  tituloPT: string;
  nomeLatim?: string;
  detalhePT: string;
}

export interface CommunityNode {
  id: string;
  titulo: string;
  subtitulo: string;
  grupoId: 'grupo1' | 'grupo2' | 'grupo3' | 'descobertas';
  grupoNome: string;
  grupoCor: string;
  bioma: BiomaType;
  municipio: string;
  regiaoMT: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
  equipeAlunos: string[];
  orientador: string;
  escola: string;
  serie: string;
  especiesCientificas: EspecieCientifica[];
  pontosInfograficoPT: PontoInfograficoPT[];
  narracaoModoHistoria: string;
  justicaClimaticaExplicacao: {
    quemSofreImpacto: string;
    causaDoProblema: string;
    porQueEInjusto: string;
    oQueEstaSendoFeito?: string;
  };
  unidadeConservacaoRelacionada: {
    nome: string;
    categoriaSNUC: 'Proteção Integral' | 'Uso Sustentável / Território Tradicional';
    explicacaoEF09CI12: string;
  };
  focoTematico: string;
  conceitosChave: string[];
  habilidadesBNCC: HabilidadeBNCC[];
  fontesPesquisa: string[];
  infografico: {
    url: string;
    titulo: string;
    legenda: string;
    autor: string;
    formato: 'imagem' | 'canva' | 'drive';
  };
  videoEquipe: {
    url: string;
    titulo: string;
    duracao: string;
    descricao: string;
    roteiroResumo: string;
  };
  resumoCientifico: {
    introducao: string;
    diagnosticoEcologico: string;
    ameacasImpactos: string;
    solucoesComunitarias: string;
    conclusaoEstudantil: string;
  };
  diarioDeBordo: {
    dataRegistro: string;
    depoimentoOuVoz: string;
    autorVoz: string;
    cargoOuFuncao: string;
    observacoesCampo: string;
  };
  metricas: MetricaEstudantil[];
  acoesPropostas: string[];
  isWebDiscovered?: boolean;
  porquePrecisaDeVoz?: string;
  fontesWeb?: Array<{ titulo: string; url: string }>;
}

export interface SchoolWork {
  id: string;
  communityId: string;
  schoolName: string;
  classGroup: string;
  title: string;
  workType: 'slide_powerpoint' | 'video' | 'infografico' | 'foto_campo';
  mediaUrl: string;
  description: string;
  authorUid: string;
  authorLabel: string;
  status: 'pending' | 'approved';
  createdAt: number;
}

export interface AssistantReply {
  respostaNatural: string;
  resumoEmUmaFrase: string;
  proximoPassoSugerido: string;
  jornadaRecomendada: JourneyKey;
  perguntasGuiadas: string[];
  fontesWeb: Array<{ titulo: string; url: string }>;
}

export interface AssistantMessage {
  id: string;
  sender: 'guide' | 'user';
  text: string;
  nextStepHint?: string;
  suggestedJourney?: JourneyKey;
  prompts?: string[];
  sources?: Array<{ titulo: string; url: string }>;
}

export interface EixoFiltro {
  id: GrupoId;
  rotulo: string;
  descricao: string;
}

export interface EventoLinhaTempo {
  ano: string;
  titulo: string;
  biomaAfetado: string;
  dadoCientifico: string;
  impactoComunidade: string;
  fonte: 'MapBiomas' | 'ISA' | 'Observatório do Pantanal' | 'INPE / CEMADEN';
  severidade: 'critica' | 'alta' | 'moderada' | 'acao';
}

export interface FonteConfiavel {
  nome: string;
  sigla: string;
  foco: string;
  comoUsarNoTrabalho: string;
  urlReferencia: string;
  dadoDestaqueMT: string;
}
