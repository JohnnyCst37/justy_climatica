import type { EixoFiltro, EventoLinhaTempo, FonteConfiavel } from '../types/domain';

export const EIXOS_TEMATICOS: EixoFiltro[] = [
  {
    id: 'todos',
    rotulo: 'Todas as Comunidades',
    descricao: 'Exibir comunidades tradicionais e estudos em Mato Grosso',
  },
  {
    id: 'grupo2',
    rotulo: 'Justiça Climática',
    descricao: 'Quilombo Mata Cavalo, Ribeirinhos do Rio Cuiabá e Povos Indígenas',
  },
  {
    id: 'grupo1',
    rotulo: 'Ciência Clara & Biomas',
    descricao: 'Biodiversidade e genética do Pantanal e do Cerrado sem tecniquês',
  },
  {
    id: 'grupo3',
    rotulo: 'Saberes Ancestrais',
    descricao: 'Patrimônio Imaterial (IPHAN) e Raizeiras do Cerrado',
  },
  {
    id: 'descobertas',
    rotulo: 'Vozes Descobertas (Web)',
    descricao: 'Comunidades tradicionais anônimas localizadas pelo Assistente na web',
  },
];

export const LINHA_DO_TEMPO_CLIMATICA_MT: EventoLinhaTempo[] = [
  {
    ano: '2019–2020',
    titulo: 'Megaincêndios Históricos no Pantanal Norte',
    biomaAfetado: 'Pantanal & Cerrado',
    dadoCientifico: 'Mais de 3,9 milhões de hectares queimados (~26% do Pantanal), segundo MapBiomas Fogo.',
    impactoComunidade: 'Perda de árvores-ninho de arara-azul e fumaça intensa nas comunidades ribeirinhas.',
    fonte: 'MapBiomas',
    severidade: 'critica',
  },
  {
    ano: '2021',
    titulo: 'Rebaixamento dos Lençóis Freáticos na Baixada Cuiabana',
    biomaAfetado: 'Cerrado (N. Sra. do Livramento)',
    dadoCientifico: 'Queda de 34% nas chuvas de recarga; poços comunitários baixaram de 8 m para mais de 22 m.',
    impactoComunidade: 'Famílias do Quilombo Mata Cavalo perderam roças de mandioca e banana-da-terra.',
    fonte: 'Observatório do Pantanal',
    severidade: 'alta',
  },
  {
    ano: '2022–2023',
    titulo: 'Manejo Integrado do Fogo (MIF) nas Terras Indígenas',
    biomaAfetado: 'Cerrado & Transição Amazônica',
    dadoCientifico: 'Queima prescrita fria feita por brigadas Xavante, Bororo e Kuikuro reduziu incêndios graves em 58%.',
    impactoComunidade: 'Proteção de buritizais e barreira viva contra o fogo vindo do entorno.',
    fonte: 'ISA',
    severidade: 'acao',
  },
  {
    ano: '2023–2024',
    titulo: 'Estiagem Severa no Pulso de Inundação do Rio Cuiabá',
    biomaAfetado: 'Pantanal (Barão de Melgaço)',
    dadoCientifico: 'Redução de 61% na superfície de água sazonal no Pantanal (MapBiomas Água).',
    impactoComunidade: 'Isolamento das baías Chacororé e Siá Mariana e queda de 45% na pesca artesanal.',
    fonte: 'Observatório do Pantanal',
    severidade: 'critica',
  },
];

export const FONTES_CONFIAVEIS_PESQUISA: FonteConfiavel[] = [
  {
    nome: 'MapBiomas (Fogo & Água)',
    sigla: 'MapBiomas',
    foco: 'Mapas de satélite de queimadas, uso da terra e superfície de água.',
    comoUsarNoTrabalho: 'Comparar área queimada e perda d’água em Mato Grosso.',
    urlReferencia: 'https://brasil.mapbiomas.org',
    dadoDestaqueMT: 'Mostra onde o fogo para na fronteira das Terras Indígenas e UCs.',
  },
  {
    nome: 'Instituto Socioambiental',
    sigla: 'ISA',
    foco: 'Monitoramento de Terras Indígenas, Quilombos e Manejo Integrado do Fogo.',
    comoUsarNoTrabalho: 'Mostrar como comunidades tradicionais protegem 98% da cobertura vegetal.',
    urlReferencia: 'https://www.socioambiental.org',
    dadoDestaqueMT: 'Terras Indígenas em MT atuam como escudos climáticos regionais.',
  },
  {
    nome: 'Observatório do Pantanal',
    sigla: 'Observatório do Pantanal',
    foco: 'Boletins do pulso de inundação do Rio Cuiabá e pesca artesanal.',
    comoUsarNoTrabalho: 'Explicar a ligação entre nascentes do Cerrado e cheia do Pantanal.',
    urlReferencia: 'https://observatoriopantanal.org',
    dadoDestaqueMT: 'Sem nascentes vivas no planalto, não há cheia na planície.',
  },
];
