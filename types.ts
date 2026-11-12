export type GrupoId = 'todos' | 'grupo2' | 'grupo1' | 'grupo3';

export type BiomaType = 'Pantanal' | 'Cerrado' | 'Amazônia-Cerrado';

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
  nomeCientificoLatim: string; // Ex: "Anodorhynchus hyacinthinus" (sempre em itálico conforme norma binomial)
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

export interface ItemMural {
  id: string;
  titulo: string;
  subtitulo: string;
  grupoId: 'grupo1' | 'grupo2' | 'grupo3';
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

  // Taxonomia Binomial em Latim (Norma Internacional ICZN / ICN)
  especiesCientificas: EspecieCientifica[];

  // Pontos Interativos do Infográfico 100% em Português-Brasil
  pontosInfograficoPT: PontoInfograficoPT[];

  // Roteiro de Narração para o Modo História (Sessão de Fotos com Áudio IA)
  narracaoModoHistoria: string;

  // Explicação rápida de Justiça Climática e UC (EF09CI12)
  justicaClimaticaExplicacao: {
    quemSofreImpacto: string;
    causaDoProblema: string;
    porQueEInjusto: string;
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

  // Abas de Mídia
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
}

export interface EixoFiltro {
  id: GrupoId;
  rotulo: string;
  descricao: string;
}
