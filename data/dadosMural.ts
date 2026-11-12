/**
 * ======================================================================================
 * VOZES DO CLIMA & BIOPATRIMÔNIO MT — MOSTRA CIENTÍFICA 9º ANO
 * EE João Ribeiro Vilela • Disciplina de Ciências • Prof. Johnny Martins Fernandes
 * ======================================================================================
 */

import { ItemMural, EixoFiltro, EventoLinhaTempo, FonteConfiavel } from '../types';

export const EIXOS_TEMATICOS: EixoFiltro[] = [
  {
    id: 'todos',
    rotulo: 'Todos (6 Estudos)',
    descricao: 'Exibir todos os 6 estudos de campo de Mato Grosso'
  },
  {
    id: 'grupo2',
    rotulo: 'Comunidades & Justiça Climática',
    descricao: 'Exibir apenas Quilombo Mata Cavalo, Ribeirinhos do Rio Cuiabá e Povos Indígenas'
  },
  {
    id: 'grupo1',
    rotulo: 'Biodiversidade & Genética',
    descricao: 'Exibir apenas Arara-azul/Cervo-do-pantanal e Pequizeiro/Baru'
  },
  {
    id: 'grupo3',
    rotulo: 'Patrimônio Imaterial (IPHAN)',
    descricao: 'Exibir apenas Raizeiras do Cerrado: Barbatimão, Espinheira-santa e Bocaiúva'
  }
];

export const LINHA_DO_TEMPO_CLIMATICA_MT: EventoLinhaTempo[] = [
  {
    ano: '2019–2020',
    titulo: 'Megaincêndios Históricos no Pantanal Norte (Poconé e Barão de Melgaço)',
    biomaAfetado: 'Pantanal & Transição Cerrado',
    dadoCientifico: 'Mais de 3,9 milhões de hectares atingidos pelo fogo (~26% do bioma Pantanal), segundo dados do MapBiomas Fogo.',
    impactoComunidade: 'Perda de mais de 70% das árvores adultas de manduvi (Sterculia apetala) em áreas críticas e fumaça severa nas comunidades ribeirinhas.',
    fonte: 'MapBiomas',
    severidade: 'critica'
  },
  {
    ano: '2021',
    titulo: 'Crise Hídrica e Rebaixamento de Lençóis Freáticos na Baixada Cuiabana',
    biomaAfetado: 'Cerrado (Nossa Senhora do Livramento)',
    dadoCientifico: 'Redução de 34% nas chuvas de recarga da Bacia do Alto Paraguai; poços comunitários caíram de 8m para mais de 22m.',
    impactoComunidade: 'Famílias do Quilombo Mata Cavalo perderam roças de mandioca (Manihot esculenta) e banana-da-terra (Musa paradisiaca).',
    fonte: 'Observatório do Pantanal',
    severidade: 'alta'
  },
  {
    ano: '2022–2023',
    titulo: 'Manejo Integrado do Fogo (MIF) nas Terras Indígenas de Mato Grosso',
    biomaAfetado: 'Cerrado & Transição Amazônica (Xingu / Sangradouro)',
    dadoCientifico: 'Áreas manejadas com queima prescrita fria por brigadas Xavante, Bororo e Kuikuro tiveram queda de 58% em incêndios severos.',
    impactoComunidade: 'Proteção de buritizais (Mauritia flexuosa) e barreira ecológica contra megaincêndios vindos do entorno.',
    fonte: 'ISA',
    severidade: 'acao'
  },
  {
    ano: '2023–2024',
    titulo: 'Estiagem Severa e Quebra do Pulso de Inundação no Rio Cuiabá',
    biomaAfetado: 'Pantanal (Barão de Melgaço — Baías Chacororé e Siá Mariana)',
    dadoCientifico: 'O MapBiomas Água registrou redução de 61% da superfície sazonal de água no Pantanal frente à média histórica.',
    impactoComunidade: 'Isolamento das baías marginais e queda de 45% na pesca artesanal de pacu (Piaractus mesopotamicus) e pintado (Pseudoplatystoma corruscans).',
    fonte: 'Observatório do Pantanal',
    severidade: 'critica'
  },
  {
    ano: '2024–2025',
    titulo: 'Mostra Científica 9º Ano: Salvaguarda Bioclimática em Mato Grosso',
    biomaAfetado: 'Cerrado & Pantanal (EE João Ribeiro Vilela)',
    dadoCientifico: 'Integração entre dados de satélite (MapBiomas/ISA) e saberes tradicionais de quilombolas, indígenas, ribeirinhos e raizeiras.',
    impactoComunidade: 'Mapeamento participativo e divulgação científica pelos alunos sob orientação do Prof. Johnny Martins Fernandes.',
    fonte: 'ISA',
    severidade: 'acao'
  }
];

export const FONTES_CONFIAVEIS_PESQUISA: FonteConfiavel[] = [
  {
    nome: 'MapBiomas (Coleção Fogo & Água)',
    sigla: 'MapBiomas',
    foco: 'Mapeamento anual por satélite de cicatrizes de queimadas, uso da terra e superfície de água no Cerrado e Pantanal.',
    comoUsarNoTrabalho: 'Consultar os gráficos de área queimada em Mato Grosso (1985–2024) e a redução da lâmina d’água na Bacia do Alto Paraguai.',
    urlReferencia: 'https://brasil.mapbiomas.org',
    dadoDestaqueMT: 'Permite comprovar visualmente como o fogo para na fronteira das Terras Indígenas e Unidades de Conservação.'
  },
  {
    nome: 'Instituto Socioambiental — Terras Indígenas e Quilombos',
    sigla: 'ISA',
    foco: 'Monitoramento territorial dos povos Xavante, Bororo e Kuikuro, comunidades quilombolas e Manejo Integrado do Fogo.',
    comoUsarNoTrabalho: 'Pesquisar como as Terras Indígenas e Unidades de Conservação funcionam como escudos climáticos em Mato Grosso.',
    urlReferencia: 'https://www.socioambiental.org',
    dadoDestaqueMT: 'Mais de 98% da cobertura vegetal interna das Terras Indígenas demarcadas em MT permanece preservada.'
  },
  {
    nome: 'Observatório do Pantanal',
    sigla: 'Observatório do Pantanal',
    foco: 'Boletins científicos sobre o pulso de inundação do Rio Cuiabá e Rio Paraguai e impactos socioeconômicos nos ribeirinhos.',
    comoUsarNoTrabalho: 'Analisar a conexão entre as nascentes no Cerrado (planalto) e a cheia nas baías pantaneiras (planície).',
    urlReferencia: 'https://observatoriopantanal.org',
    dadoDestaqueMT: 'O Cerrado mato-grossense é a caixa d’água que abastece o Pantanal: sem nascentes protegidas no planalto, não há cheia na planície.'
  }
];

export const DADOS_INICIAIS_MURAL: ItemMural[] = [
  // ------------------------------------------------------------------------------------
  // 1. QUILOMBO MATA CAVALO (NOSSA SENHORA DO LIVRAMENTO) - GRUPO 2
  // ------------------------------------------------------------------------------------
  {
    id: 'quilombo-mata-cavalo',
    titulo: 'Quilombo Mata Cavalo',
    subtitulo: 'Justiça Climática e impacto das secas severas na agricultura familiar quilombola',
    grupoId: 'grupo2',
    grupoNome: 'Grupo 2: Comunidades & Justiça Climática',
    grupoCor: '#d97706',
    bioma: 'Cerrado',
    municipio: 'Nossa Senhora do Livramento',
    regiaoMT: 'Baixada Cuiabana (50 km ao sul de Cuiabá)',
    coordenadas: {
      lat: -15.77,
      lng: -56.34
    },
    equipeAlunos: [
      'Aléxia Mariana de Arruda',
      'Davi Lucca Figueiredo',
      'Emilly Vitória Pinheiro',
      'João Pedro de Almeida'
    ],
    orientador: 'Prof. Johnny Martins Fernandes',
    escola: 'EE João Ribeiro Vilela',
    serie: '9º Ano — Ciências',
    especiesCientificas: [
      {
        nomePopular: 'Mandioca',
        nomeCientificoLatim: 'Manihot esculenta',
        familia: 'Euphorbiaceae',
        papelEcologico: 'Base alimentar da agricultura familiar quilombola resistente a solos ácidos do Cerrado.'
      },
      {
        nomePopular: 'Banana-da-terra',
        nomeCientificoLatim: 'Musa paradisiaca',
        familia: 'Musaceae',
        papelEcologico: 'Cultivo tradicional da Baixada Cuiabana altamente sensível à queda da umidade do solo.'
      },
      {
        nomePopular: 'Buriti',
        nomeCientificoLatim: 'Mauritia flexuosa',
        familia: 'Arecaceae',
        papelEcologico: 'Palmeira indicadora de veredas e nascentes, essencial para restaurar olhos d’água.'
      },
      {
        nomePopular: 'Ipê-amarelo-do-cerrado',
        nomeCientificoLatim: 'Handroanthus albus',
        familia: 'Bignoniaceae',
        papelEcologico: 'Árvore nativa utilizada no sombreamento e recuperação de matas ciliares degradadas.'
      }
    ],
    pontosInfograficoPT: [
      {
        numero: 1,
        xPercent: 18,
        yPercent: 42,
        tituloPT: 'Roça Tradicional de Banana-da-terra',
        nomeLatim: 'Musa paradisiaca',
        detalhePT: 'Cultivo familiar afetado pelos 142 dias de estiagem severa em Nossa Senhora do Livramento.'
      },
      {
        numero: 2,
        xPercent: 28,
        yPercent: 74,
        tituloPT: 'Cultivo de Mandioca e Solo Coberto',
        nomeLatim: 'Manihot esculenta',
        detalhePT: 'Uso de cobertura vegetal (palhada) para reter umidade no solo durante ondas de calor.'
      },
      {
        numero: 3,
        xPercent: 68,
        yPercent: 26,
        tituloPT: 'Vereda de Buritis na Nascente',
        nomeLatim: 'Mauritia flexuosa',
        detalhePT: 'As raízes do buriti formam uma malha esponjosa que protege e mantém o olho d’água ativo.'
      },
      {
        numero: 4,
        xPercent: 76,
        yPercent: 68,
        tituloPT: 'Olho d’Água Recuperado (Córrego Mutuca)',
        detalhePT: 'A restauração da mata ciliar devolve a infiltração da chuva para o lençol freático.'
      }
    ],
    narracaoModoHistoria: 'Capítulo 1: Quilombo Mata Cavalo, em Nossa Senhora do Livramento, Mato Grosso. Neste território histórico da Baixada Cuiabana vivem 418 famílias quilombolas que preservam o Cerrado e cultivam mandioca, Manihot esculenta, e banana-da-terra, Musa paradisiaca. Aqui compreendemos na prática o que é Justiça Climática: embora a comunidade preserve suas matas e quase não emita gases do efeito estufa, ela sofre primeiro quando o desmatamento ao redor e as secas severas rebaixam o lençol freático em mais de 14 metros. Para proteger a água, as famílias promovem o plantio de palmeiras de buriti, Mauritia flexuosa, restaurando as nascentes do Córrego Mutuca.',
    justicaClimaticaExplicacao: {
      quemSofreImpacto: '418 famílias quilombolas que vivem da roça tradicional de banana-da-terra (Musa paradisiaca) e mandioca (Manihot esculenta).',
      causaDoProblema: 'Desmatamento do entorno e secas severas que secaram córregos e rebaixaram o lençol freático em 14 metros.',
      porQueEInjusto: 'A comunidade tradicional preserva suas matas e quase não emite gases de efeito estufa, mas é a primeira a ficar sem água nos poços rasos.'
    },
    unidadeConservacaoRelacionada: {
      nome: 'Território Quilombola Mata Cavalo & Reserva de Uso Sustentável',
      categoriaSNUC: 'Uso Sustentável / Território Tradicional',
      explicacaoEF09CI12: 'Concilia a presença humana tradicional e a agricultura familiar agroecológica com a conservação das nascentes do Cerrado (BNCC EF09CI12).'
    },
    focoTematico: 'Impacto das secas extremas na agricultura familiar local e por que grupos vulneráveis sofrem primeiro com a crise hídrica (Justiça Climática).',
    conceitosChave: [
      'Justiça Climática',
      'Agricultura Familiar Tradicional',
      'Recarga de Aquífero',
      'Segurança Hídrica e Alimentar'
    ],
    habilidadesBNCC: [
      {
        codigo: 'EF09CI12',
        titulo: 'Unidades de Conservação e Populações Tradicionais',
        descricao: 'Justificar a importância das unidades de conservação e territórios tradicionais para a preservação da biodiversidade e do patrimônio nacional, considerando as populações humanas vinculadas a essas áreas.'
      },
      {
        codigo: 'EF09CI13',
        titulo: 'Iniciativas de Justiça Climática e Sustentabilidade',
        descricao: 'Propor iniciativas individuais e coletivas para a solução de problemas ambientais da comunidade com base na análise de ações de consumo consciente e sustentabilidade.'
      }
    ],
    fontesPesquisa: [
      'MapBiomas Água — Série histórica de redução de superfície hídrica na Baixada Cuiabana',
      'Instituto Socioambiental (ISA) — Monitoramento de Territórios Quilombolas em MT',
      'Observatório do Pantanal — Impacto das secas nas comunidades rurais da Bacia do Alto Paraguai'
    ],
    infografico: {
      url: '/src/assets/images/foto_quilombo_mata_cavalo_pt_1794410879621.jpg',
      titulo: 'Infográfico em Português: Agroecologia e Restauração de Nascentes no Quilombo Mata Cavalo',
      legenda: 'Prancha didática em Português (Brasil) destacando o cultivo tradicional de Manihot esculenta e Musa paradisiaca e a proteção hídrica com Mauritia flexuosa.',
      autor: 'Equipe Grupo 2 • 9º Ano (Dados MapBiomas & ISA)',
      formato: 'imagem'
    },
    videoEquipe: {
      url: '',
      titulo: 'Documentário Estudantil: A Voz da Terra e a Seca das Nascentes em Mata Cavalo',
      duracao: '5 min 12 seg',
      descricao: 'Relato sobre o cultivo tradicional da banana-da-terra e mandioca em Nossa Senhora do Livramento e como a escassez de chuvas afeta as famílias quilombolas.',
      roteiroResumo: '1. O que é Justiça Climática explicada em 1 minuto. 2. Linha do tempo das secas de 2020 a 2024 em Livramento. 3. Soluções: sistemas agroflorestais com buritis.'
    },
    resumoCientifico: {
      introducao: 'O Território Quilombola de Mata Cavalo, em Nossa Senhora do Livramento/MT, reúne seis comunidades históricas. Este estudo investiga como as secas prolongadas afetam diretamente a soberania alimentar das famílias que cultivam mandioca (Manihot esculenta) e banana-da-terra (Musa paradisiaca).',
      diagnosticoEcologico: 'Dados do MapBiomas mostram que a perda de vegetação nativa do Cerrado ao redor do território reduziu a infiltração da água da chuva no solo. Sem o efeito esponja das árvores nativas, a água escoa superficialmente na chuva e falta nos meses de maio a outubro.',
      ameacasImpactos: 'Córregos perenes passaram a secar; o nível estático dos poços caiu de 8 metros para mais de 22 metros; perda de roças por estresse hídrico e calor acima de 41°C.',
      solucoesComunitarias: 'Recuperação participativa de nascentes com plantio de buriti (Mauritia flexuosa) e ipê-amarelo (Handroanthus albus), além de cobertura morta do solo nos sistemas agroflorestais.',
      conclusaoEstudantil: 'A Justiça Climática fica evidente em Mata Cavalo: quem preserva a terra há mais de 150 anos sofre primeiro com o aquecimento provocado pelo desmatamento em larga escala.'
    },
    diarioDeBordo: {
      dataRegistro: 'Outubro / Novembro — Roteiro de Campo',
      depoimentoOuVoz: '"A água que corria clara na grota secou. Para manter a horta de couve, a banana e o mandiocal vivos na seca braba, precisamos proteger cada olho d’água que ainda respira no nosso território."',
      autorVoz: 'Dona Maria de Lourdes',
      cargoOuFuncao: 'Agricultora familiar e liderança comunitária em Mata Cavalo',
      observacoesCampo: 'Equipe analisou dados pluviométricos do CEMADEN/MapBiomas comprovando aumento de 45 dias consecutivos sem chuva na Baixada Cuiabana.'
    },
    metricas: [
      {
        rotulo: 'Famílias no Território',
        valor: '418',
        detalhe: 'Distribuídas em 6 comunidades quilombolas',
        icone: 'comunidade'
      },
      {
        rotulo: 'Queda do Lençol Freático',
        valor: '-14 m',
        detalhe: 'Rebaixamento médio nos poços na última década',
        icone: 'agua'
      },
      {
        rotulo: 'Dias sem Chuva (Seca)',
        valor: '142 dias',
        detalhe: 'Estiagem crítica registrada na Baixada Cuiabana',
        icone: 'alerta'
      }
    ],
    acoesPropostas: [
      'Construir linha do tempo escolar cruzando os anos de seca (MapBiomas) com a queda na colheita local',
      'Propor sistema de captação de água de chuva em telhados escolares e comunitários (cisternas)',
      'Apoiar o plantio de mudas de buriti (Mauritia flexuosa) nas bordas das nascentes do Córrego Mutuca'
    ]
  },

  // ------------------------------------------------------------------------------------
  // 2. RIBEIRINHOS DO RIO CUIABÁ / BARÃO DE MELGAÇO - GRUPO 2
  // ------------------------------------------------------------------------------------
  {
    id: 'ribeirinhos-rio-cuiaba',
    titulo: 'Ribeirinhos do Rio Cuiabá (Barão de Melgaço)',
    subtitulo: 'Mudanças no ciclo das águas (pulso de inundação) e impacto na pesca artesanal',
    grupoId: 'grupo2',
    grupoNome: 'Grupo 2: Comunidades & Justiça Climática',
    grupoCor: '#d97706',
    bioma: 'Pantanal',
    municipio: 'Barão de Melgaço',
    regiaoMT: 'Pantanal Norte — Rio Cuiabá e Baías Chacororé / Siá Mariana',
    coordenadas: {
      lat: -16.19,
      lng: -55.97
    },
    equipeAlunos: [
      'Arthur Henrique Rondon',
      'Camila dos Anjos Silva',
      'Enzo Gabriel de Moraes',
      'Nicolly Beatriz Santana'
    ],
    orientador: 'Prof. Johnny Martins Fernandes',
    escola: 'EE João Ribeiro Vilela',
    serie: '9º Ano — Ciências',
    especiesCientificas: [
      {
        nomePopular: 'Pacu',
        nomeCientificoLatim: 'Piaractus mesopotamicus',
        familia: 'Serrasalmidae',
        papelEcologico: 'Peixe migrador frugívoro que dispersa sementes de árvores da mata ciliar durante a cheia.'
      },
      {
        nomePopular: 'Pintado / Surubim',
        nomeCientificoLatim: 'Pseudoplatystoma corruscans',
        familia: 'Pimelodidae',
        papelEcologico: 'Predador de topo da bacia do Rio Cuiabá que depende da piracema e das lagoas marginais.'
      },
      {
        nomePopular: 'Dourado',
        nomeCientificoLatim: 'Salminus brasiliensis',
        familia: 'Bryconidae',
        papelEcologico: 'Espécie bioindicadora de águas correntes bem oxigenadas na Bacia do Alto Paraguai.'
      },
      {
        nomePopular: 'Aguapé / Camalote',
        nomeCientificoLatim: 'Eichhornia crassipes',
        familia: 'Pontederiaceae',
        papelEcologico: 'Planta aquática flutuante que serve de berçário natural para alevinos nas baías pantaneiras.'
      }
    ],
    pontosInfograficoPT: [
      {
        numero: 1,
        xPercent: 72,
        yPercent: 36,
        tituloPT: 'Pesca Artesanal Ribeirinha em Canoa',
        detalhePT: 'Modo de vida tradicional sustentável em Barão de Melgaço, dependente do pulso de inundação.'
      },
      {
        numero: 2,
        xPercent: 26,
        yPercent: 30,
        tituloPT: 'Bancos de Areia e Assoreamento na Seca',
        detalhePT: 'Redução de 61% na superfície alagada (MapBiomas Água) isola as baías Chacororé e Siá Mariana.'
      },
      {
        numero: 3,
        xPercent: 30,
        yPercent: 72,
        tituloPT: 'Cardume de Pacu nas Raízes Alagadas',
        nomeLatim: 'Piaractus mesopotamicus',
        detalhePT: 'Peixe fundamental na alimentação ribeirinha e na dispersão de sementes da várzea.'
      },
      {
        numero: 4,
        xPercent: 62,
        yPercent: 70,
        tituloPT: 'Pintado e Dourado no Canal Fluvial',
        nomeLatim: 'Pseudoplatystoma corruscans / Salminus brasiliensis',
        detalhePT: 'Espécies migradoras da piracema cuja reprodução cai drasticamente quando o rio não enche.'
      }
    ],
    narracaoModoHistoria: 'Capítulo 2: Ribeirinhos do Rio Cuiabá, em Barão de Melgaço, no coração do Pantanal mato-grossense. A vida no Pantanal depende do pulso de inundação: o ciclo anual de cheia e vazante que conecta o Rio Cuiabá às grandes baías de Chacororé e Siá Mariana. É nessa água alagada que peixes nativos como o pacu, Piaractus mesopotamicus, o pintado, Pseudoplatystoma corruscans, e o dourado, Salminus brasiliensis, encontram abrigo para reprodução. Segundo o Observatório do Pantanal e o MapBiomas Água, a perda de mais de 60 por cento da área alagada nas secas recentes reduziu em 45 por cento a pesca artesanal, penalizando as famílias ribeirinhas que sempre protegeram o rio.',
    justicaClimaticaExplicacao: {
      quemSofreImpacto: 'Comunidades ribeirinhas e pescadores artesanais do Rio Cuiabá e das baías de Chacororé e Siá Mariana.',
      causaDoProblema: 'Assoreamento das cabeceiras no planalto e secas extremas que impedem a conexão entre o rio e as lagoas marginais.',
      porQueEInjusto: 'O pescador artesanal retira apenas o necessário respeitando a piracema, mas perde sua renda e alimento quando o rio seca por impactos gerados longe dali.'
    },
    unidadeConservacaoRelacionada: {
      nome: 'RPPN SESC Pantanal & Estação Ecológica de Taiamã',
      categoriaSNUC: 'Proteção Integral',
      explicacaoEF09CI12: 'Áreas de Proteção Integral funcionam como berçários intocados de reprodução de peixes (Piaractus mesopotamicus e Pseudoplatystoma corruscans), repovoando o rio onde os ribeirinhos pescam (EF09CI12).'
    },
    focoTematico: 'Alteração do pulso de inundação do Pantanal mato-grossense e suas consequências ecológicas e sociais para a pesca artesanal.',
    conceitosChave: [
      'Pulso de Inundação (Cheia e Vazante)',
      'Ictiofauna e Piracema',
      'Lagoas Marginais (Baías)',
      'Justiça Climática Hídrica'
    ],
    habilidadesBNCC: [
      {
        codigo: 'EF09CI12',
        titulo: 'Berçários Ecológicos e Unidades de Conservação',
        descricao: 'Compreender como Unidades de Conservação protegem as cabeceiras e áreas úmidas essenciais para a reprodução da fauna aquática e sustento ribeirinho.'
      },
      {
        codigo: 'EF07CI08.1MT',
        titulo: 'Dinâmica Hídrica do Pantanal Mato-grossense',
        descricao: 'Analisar o papel do ciclo das águas na manutenção das cadeias alimentares do Pantanal e os impactos das secas severas.'
      }
    ],
    fontesPesquisa: [
      'Observatório do Pantanal — Boletins sobre o Pulso de Inundação e Baías de Barão de Melgaço',
      'MapBiomas Água — Perda de superfície de água no Pantanal (1985–2024)',
      'EMBRAPA Pantanal — Estudos sobre reprodução de peixes migradores (Piracema)'
    ],
    infografico: {
      url: '/src/assets/images/foto_ribeirinhos_cuiaba_pt_1794410880715.jpg',
      titulo: 'Infográfico em Português: Pulso de Inundação e Ictiofauna no Rio Cuiabá',
      legenda: 'Prancha científica em Português (Brasil) ilustrando a pesca artesanal ribeirinha e as espécies nativas Piaractus mesopotamicus, Pseudoplatystoma corruscans e Salminus brasiliensis.',
      autor: 'Equipe Grupo 2 • 9º Ano (Dados Observatório do Pantanal)',
      formato: 'imagem'
    },
    videoEquipe: {
      url: '',
      titulo: 'Vídeo-Reportagem: O Rio que Não Enche Mais — Vozes de Barão de Melgaço',
      duracao: '4 min 45 seg',
      descricao: 'Explicação didática dos alunos sobre o fenômeno do pulso de inundação e o impacto dos bancos de areia na navegação das canoas tradicionais.',
      roteiroResumo: '1. Maquete comparando época de cheia e época de seca. 2. Dados do MapBiomas Água sobre as baías de Chacororé e Siá Mariana. 3. Importância das UCs nas cabeceiras do Rio Cuiabá.'
    },
    resumoCientifico: {
      introducao: 'O Pantanal é regido pelo "pulso de inundação": o ciclo anual de cheia, vazante, seca e enchente. Em Barão de Melgaço/MT, centenas de famílias ribeirinhas dependem da conexão entre o Rio Cuiabá e as baías de Chacororé e Siá Mariana para a renovação dos cardumes.',
      diagnosticoEcologico: 'Segundo o Observatório do Pantanal e o MapBiomas Água, o Pantanal perdeu mais de 60% de sua superfície alagada nos anos de seca severa recente. Sem a subida das águas, peixes migradores como o pacu (Piaractus mesopotamicus) e o pintado (Pseudoplatystoma corruscans) não conseguem entrar nas baías para desovar.',
      ameacasImpactos: 'Queda de 45% na captura artesanal; formação de extensos bancos de areia por assoreamento; mortandade de peixes por baixa oxigenação da água quente em poças isoladas.',
      solucoesComunitarias: 'Restauração florestal das matas ciliares nas cabeceiras do Rio Cuiabá, respeito ao defeso da piracema e fortalecimento do turismo ecológico de base comunitária.',
      conclusaoEstudantil: 'Entendemos que proteger o Pantanal exige proteger as nascentes no Cerrado. Quando o ciclo das águas falha, os ribeirinhos sofrem imediatamente a perda de sua soberania alimentar.'
    },
    diarioDeBordo: {
      dataRegistro: 'Outubro / Novembro — Roteiro de Campo',
      depoimentoOuVoz: '"Antes a cheia ligava o rio com a baía e o peixe fartava na várzea. Nos últimos anos a água mal sobe no barranco, a canoa encalha na areia e o cardume não encontra caminho para criar."',
      autorVoz: 'Seu Manoel Messias (Tio Nel)',
      cargoOuFuncao: 'Pescador artesanal tradicional de Barão de Melgaço',
      observacoesCampo: 'Análise dos gráficos hidrológicos da régua do Rio Cuiabá mostra cotas abaixo do nível de extravasamento lateral por 4 anos seguidos.'
    },
    metricas: [
      {
        rotulo: 'Redução de Área Alagada',
        valor: '-61%',
        detalhe: 'Anomalia hídrica no Pantanal (MapBiomas Água)',
        icone: 'agua'
      },
      {
        rotulo: 'Queda na Pesca Artesanal',
        valor: '-45%',
        detalhe: 'Impacto direto na renda das famílias ribeirinhas',
        icone: 'alerta'
      },
      {
        rotulo: 'Baías Monitoradas',
        valor: '2 grandes',
        detalhe: 'Complexo Chacororé e Siá Mariana em MT',
        icone: 'comunidade'
      }
    ],
    acoesPropostas: [
      'Divulgar infográfico comparativo sobre o Pulso de Inundação na Mostra Científica da escola',
      'Mapear a relação entre o desmatamento nas cabeceiras do Rio Cuiabá e o assoreamento em Barão de Melgaço',
      'Promover campanha de valorização do peixe nativo respeitando os meses da Piracema'
    ]
  },

  // ------------------------------------------------------------------------------------
  // 3. POVOS INDÍGENAS XAVANTE, BORORO E KUIKURO - GRUPO 2
  // ------------------------------------------------------------------------------------
  {
    id: 'indigenas-xavante-bororo',
    titulo: 'Povos Indígenas (Xavante, Bororo e Kuikuro)',
    subtitulo: 'Brigadas comunitárias de incêndio, Manejo Integrado do Fogo (MIF) e preservação territorial',
    grupoId: 'grupo2',
    grupoNome: 'Grupo 2: Comunidades & Justiça Climática',
    grupoCor: '#d97706',
    bioma: 'Amazônia-Cerrado',
    municipio: 'Barra do Garças / General Carneiro / Gaúcha do Norte',
    regiaoMT: 'Leste de MT (Sangradouro/Meruri) e Território Indígena do Xingu',
    coordenadas: {
      lat: -14.85,
      lng: -53.40
    },
    equipeAlunos: [
      'David Kaluã Bororo',
      'Iara Luíza de Souza',
      'Pedro Lucas Vasconcelos',
      'Rafaela Cristina Prado'
    ],
    orientador: 'Prof. Johnny Martins Fernandes',
    escola: 'EE João Ribeiro Vilela',
    serie: '9º Ano — Ciências',
    especiesCientificas: [
      {
        nomePopular: 'Buriti',
        nomeCientificoLatim: 'Mauritia flexuosa',
        familia: 'Arecaceae',
        papelEcologico: 'Árvore sagrada para as corridas de tora Xavante e proteção das veredas hídricas.'
      },
      {
        nomePopular: 'Pequizeiro',
        nomeCientificoLatim: 'Caryocar brasiliense',
        familia: 'Caryocaraceae',
        papelEcologico: 'Árvore frutífera central na alimentação e cultura dos povos do Xingu e do Cerrado.'
      },
      {
        nomePopular: 'Capim-flecha',
        nomeCientificoLatim: 'Tristachya leiostachya',
        familia: 'Poaceae',
        papelEcologico: 'Gramínea nativa do Cerrado manejada com queima prescrita fria para evitar acúmulo de biomassa inflamável.'
      },
      {
        nomePopular: 'Tamanduá-bandeira',
        nomeCientificoLatim: 'Myrmecophaga tridactyla',
        familia: 'Myrmecophagidae',
        papelEcologico: 'Mamífero vulnerável a incêndios rápidos de fim de seca, protegido pelo manejo em mosaico.'
      }
    ],
    pontosInfograficoPT: [
      {
        numero: 1,
        xPercent: 25,
        yPercent: 52,
        tituloPT: 'Aceiro Preventivo no Início da Estação Seca',
        nomeLatim: 'Tristachya leiostachya',
        detalhePT: 'Faixa limpa de capim seco que impede a passagem de megaincêndios vindos de fora da Terra Indígena.'
      },
      {
        numero: 2,
        xPercent: 56,
        yPercent: 64,
        tituloPT: 'Brigada Indígena aplicando Queima Fria (MIF)',
        detalhePT: 'Queima controlada ao amanhecer, com baixa temperatura, que preserva árvores e animais.'
      },
      {
        numero: 3,
        xPercent: 78,
        yPercent: 28,
        tituloPT: 'Floresta e Cerrado Denso Protegidos (98,2%)',
        nomeLatim: 'Caryocar brasiliense / Mauritia flexuosa',
        detalhePT: 'As Terras Indígenas funcionam como verdadeiros escudos verdes que mantêm as chuvas em MT.'
      }
    ],
    narracaoModoHistoria: 'Capítulo 3: Povos Indígenas Xavante, Bororo e Kuikuro em Mato Grosso. Os mapas de satélite do Instituto Socioambiental e do MapBiomas revelam um fato impressionante: mais de 98 por cento da vegetação dentro das Terras Indígenas permanece preservada. Para proteger a mata de pequizeiros, Caryocar brasiliense, e buritis, Mauritia flexuosa, contra os megaincêndios que vêm de fora nos meses de seca extrema, as brigadas comunitárias indígenas aplicam o Manejo Integrado do Fogo. Ao realizar queimas prescritas frias no começo da estação seca, reduzem o capim-flecha inflamável, Tristachya leiostachya, diminuindo em 58 por cento os incêndios destrutivos.',
    justicaClimaticaExplicacao: {
      quemSofreImpacto: 'Aldeias dos povos Xavante (Cerrado Leste), Bororo (Vale do São Lourenço/Meruri) e Kuikuro (Alto Xingu).',
      causaDoProblema: 'Grandes incêndios florestais originados fora das reservas invadem as Terras Indígenas em meses de seca extrema.',
      porQueEInjusto: 'As Terras Indígenas são as áreas mais preservadas de Mato Grosso (98,2% de floresta em pé), mas sofrem com a fumaça e o calor vindos do entorno.'
    },
    unidadeConservacaoRelacionada: {
      nome: 'Terras Indígenas Sangradouro, Meruri e Parque Indígena do Xingu',
      categoriaSNUC: 'Uso Sustentável / Território Tradicional',
      explicacaoEF09CI12: 'Terras Indígenas atuam junto às Unidades de Conservação como verdadeiros escudos climáticos que mantêm a chuva e protegem a biodiversidade (EF09CI12).'
    },
    focoTematico: 'Gestão de brigadas comunitárias indígenas de incêndio, ciência tradicional do Manejo Integrado do Fogo (MIF) e barreira contra o desmatamento.',
    conceitosChave: [
      'Manejo Integrado do Fogo (MIF)',
      'Queima Prescrita Fria vs. Megaincêndio',
      'Brigadas Comunitárias Indígenas',
      'Terras Indígenas como Escudos Climáticos'
    ],
    habilidadesBNCC: [
      {
        codigo: 'EF09CI12',
        titulo: 'Áreas Protegidas e Saberes Tradicionais na Conservação',
        descricao: 'Justificar o papel essencial das Terras Indígenas e Unidades de Conservação na contenção do desmatamento e das queimadas em Mato Grosso.'
      },
      {
        codigo: 'EF07CI08.1MT',
        titulo: 'Ecologia do Fogo no Cerrado',
        descricao: 'Diferenciar o regime de fogo controlado em mosaico (baixa temperatura) dos incêndios florestais severos de fim de estação seca.'
      }
    ],
    fontesPesquisa: [
      'Instituto Socioambiental (ISA) — Brigadas Indígenas do Xingu e Manejo do Fogo em MT',
      'MapBiomas Fogo — Monitoramento de cicatrizes de incêndios dentro e fora de Terras Indígenas',
      'Prevfogo / IBAMA — Programa de Brigadas Federais Indígenas em Mato Grosso'
    ],
    infografico: {
      url: '/src/assets/images/foto_indigenas_mif_xavante_pt_1794410882483.jpg',
      titulo: 'Infográfico em Português: Manejo Integrado do Fogo (MIF) pelas Brigadas Indígenas',
      legenda: 'Ilustração científica em Português (Brasil) demonstrando a queima prescrita fria ao amanhecer para proteção de Caryocar brasiliense e Mauritia flexuosa.',
      autor: 'Equipe Grupo 2 • 9º Ano (Dados ISA & MapBiomas Fogo)',
      formato: 'imagem'
    },
    videoEquipe: {
      url: '',
      titulo: 'Mini-Doc: Guardiões do Clima — As Brigadas Xavante, Bororo e Kuikuro em MT',
      duracao: '4 min 20 seg',
      descricao: 'Apresentação de mapas de satélite do ISA e MapBiomas mostrando como as Terras Indígenas formam ilhas verdes que protegem o regime de chuvas de Mato Grosso.',
      roteiroResumo: '1. O contraste visto do espaço: oásis verdes em MT. 2. Como funciona a queima fria preventiva em mosaico. 3. O trabalho dos brigadistas voluntários indígenas.'
    },
    resumoCientifico: {
      introducao: 'Os povos indígenas de Mato Grosso — como os Xavante e Bororo no Cerrado e os Kuikuro no Alto Xingu — detêm conhecimentos milenares sobre o manejo da paisagem. Suas terras preservam mais de 98% da vegetação original.',
      diagnosticoEcologico: 'No Cerrado, o acúmulo excessivo de capim-flecha seco (Tristachya leiostachya) até agosto e setembro transforma qualquer faísca em megaincêndios de copa. O Manejo Integrado do Fogo (MIF) aplica queimas frias controladas em maio e junho, criando um mosaico que interrompe a linha do fogo.',
      ameacasImpactos: 'Nos anos de seca extrema (2020 e 2024), incêndios iniciados fora das reservas invadiram territórios indígenas, ameaçando pequis (Caryocar brasiliense), buritizais (Mauritia flexuosa) e a saúde respiratória das aldeias.',
      solucoesComunitarias: 'Atuação das Brigadas Comunitárias Indígenas (em parceria com ISA e Prevfogo/IBAMA), combinando aceiros preventivos, monitoramento por satélite e saber ancestral.',
      conclusaoEstudantil: 'Os dados do MapBiomas e do ISA provam que não existe conservação do clima em Mato Grosso sem a proteção e valorização dos povos indígenas e de suas brigadas comunitárias.'
    },
    diarioDeBordo: {
      dataRegistro: 'Novembro — Estudo Cartográfico ISA / MapBiomas',
      depoimentoOuVoz: '"O nosso fogo tradicional é feito cedo da manhã, devagar, limpando o capim sem matar a árvore nem o bicho. Quando vem o fogo grande de fora no mês de setembro, ele bate no nosso aceiro e perde a força."',
      autorVoz: 'Liderança Brigadista Xavante / Xingu',
      cargoOuFuncao: 'Relato documentado nos cadernos de Manejo Integrado do Fogo (ISA)',
      observacoesCampo: 'Alunos compararam imagens de satélite de 2020 a 2024 constatando a diferença nítida de vegetação preservada dentro das Terras Indígenas.'
    },
    metricas: [
      {
        rotulo: 'Queda em Megaincêndios',
        valor: '-58%',
        detalhe: 'Em áreas com Manejo Integrado do Fogo (MIF)',
        icone: 'fogo'
      },
      {
        rotulo: 'Vegetação Preservada em TIs',
        valor: '98,2%',
        detalhe: 'Índice de conservação interna (Dados ISA)',
        icone: 'arvore'
      },
      {
        rotulo: 'Povos Estudados em MT',
        valor: '3 etnias',
        detalhe: 'Xavante, Bororo (Cerrado) e Kuikuro (Xingu)',
        icone: 'comunidade'
      }
    ],
    acoesPropostas: [
      'Exibir no mural escolar o mapa comparativo de satélite das Terras Indígenas de Mato Grosso',
      'Explicar aos visitantes da Mostra Científica a diferença entre queima prescrita fria e incêndio criminoso',
      'Divulgar os relatórios do Instituto Socioambiental (ISA) e MapBiomas Fogo nas aulas de Ciências'
    ]
  },

  // ------------------------------------------------------------------------------------
  // 4. ARARA-AZUL-GRANDE & CERVO-DO-PANTANAL - GRUPO 1
  // ------------------------------------------------------------------------------------
  {
    id: 'arara-azul-cervo-pantanal',
    titulo: 'Arara-azul-grande & Cervo-do-pantanal',
    subtitulo: 'Variabilidade genética, fragmentação de habitat e corredores ecológicos no Pantanal',
    grupoId: 'grupo1',
    grupoNome: 'Grupo 1: Biodiversidade & Genética',
    grupoCor: '#059669',
    bioma: 'Pantanal',
    municipio: 'Poconé',
    regiaoMT: 'Pantanal Norte (Rodovia Transpantaneira)',
    coordenadas: {
      lat: -16.45,
      lng: -56.48
    },
    equipeAlunos: [
      'Beatriz Nogueira da Silva',
      'Gabriel Santos de Arruda',
      'Isabela Cristine Moura',
      'Lucas Gabriel P. Ferreira'
    ],
    orientador: 'Prof. Johnny Martins Fernandes',
    escola: 'EE João Ribeiro Vilela',
    serie: '9º Ano — Ciências',
    especiesCientificas: [
      {
        nomePopular: 'Arara-azul-grande',
        nomeCientificoLatim: 'Anodorhynchus hyacinthinus',
        familia: 'Psittacidae',
        papelEcologico: 'Maior psitacídeo do mundo, especialista em sementes de palmeiras e dependente do manduvi para nidificar.'
      },
      {
        nomePopular: 'Cervo-do-pantanal',
        nomeCientificoLatim: 'Blastocerus dichotomus',
        familia: 'Cervidae',
        papelEcologico: 'Maior cervídeo sul-americano, adaptado a áreas alagadas com cascos interdigitais elásticos.'
      },
      {
        nomePopular: 'Manduvi',
        nomeCientificoLatim: 'Sterculia apetala',
        familia: 'Malvaceae',
        papelEcologico: 'Árvore-ninho onde a arara-azul faz 90% de seus ninhos naturais no Pantanal.'
      },
      {
        nomePopular: 'Palmeira Acuri',
        nomeCientificoLatim: 'Attalea phalerata',
        familia: 'Arecaceae',
        papelEcologico: 'Produz os frutos de endocarpo duro que constituem a base alimentar da arara-azul.'
      }
    ],
    pontosInfograficoPT: [
      {
        numero: 1,
        xPercent: 24,
        yPercent: 34,
        tituloPT: 'Casal de Arara-azul-grande no Ninho',
        nomeLatim: 'Anodorhynchus hyacinthinus',
        detalhePT: 'Ave especialista cujo fluxo gênico depende de corredores florestais preservados.'
      },
      {
        numero: 2,
        xPercent: 20,
        yPercent: 64,
        tituloPT: 'Cavidade Natural no Tronco de Manduvi',
        nomeLatim: 'Sterculia apetala',
        detalhePT: 'Apenas manduvis com mais de 60 anos formam ocos grandes o suficiente para o ninho.'
      },
      {
        numero: 3,
        xPercent: 68,
        yPercent: 56,
        tituloPT: 'Cervo-do-pantanal em Várzea Úmida',
        nomeLatim: 'Blastocerus dichotomus',
        detalhePT: 'Sofre efeito de gargalo genético (endogamia) quando incêndios isolam os refúgios úmidos.'
      },
      {
        numero: 4,
        xPercent: 84,
        yPercent: 28,
        tituloPT: 'Palmeiras Nativas (Acuri e Carandá)',
        nomeLatim: 'Attalea phalerata / Copernicia alba',
        detalhePT: 'Fontes essenciais de alimento e abrigo para a fauna pantaneira.'
      }
    ],
    narracaoModoHistoria: 'Capítulo 4: Biodiversidade e Genética no Pantanal de Poconé, Mato Grosso. Aqui observamos duas espécies bandeiras da nossa fauna: a arara-azul-grande, Anodorhynchus hyacinthinus, e o cervo-do-pantanal, Blastocerus dichotomus. Cerca de 90 por cento dos ninhos naturais da arara-azul são feitos em ocos de árvores centenárias de manduvi, Sterculia apetala, enquanto sua alimentação depende dos cocos da palmeira acuri, Attalea phalerata. Quando incêndios severos fragmentam o Pantanal em ilhas isoladas, diminui a troca de genes entre as populações, reduzindo a variabilidade genética. Por isso, Unidades de Conservação conectadas por corredores ecológicos são vitais para evitar a extinção.',
    justicaClimaticaExplicacao: {
      quemSofreImpacto: 'Fauna nativa especialista do Pantanal (Anodorhynchus hyacinthinus e Blastocerus dichotomus) e comunidades pantaneiras.',
      causaDoProblema: 'Incêndios severos destruíram árvores-ninho (Sterculia apetala) e fragmentaram os refúgios úmidos da fauna.',
      porQueEInjusto: 'A perda de biodiversidade empobrece o patrimônio natural de Mato Grosso e compromete a resiliência genética das espécies.'
    },
    unidadeConservacaoRelacionada: {
      nome: 'Parque Estadual Encontro das Águas & Parque Nacional do Pantanal',
      categoriaSNUC: 'Proteção Integral',
      explicacaoEF09CI12: 'Unidades de Proteção Integral conectadas por corredores ecológicos garantem o fluxo gênico entre populações isoladas, evitando a extinção local (EF09CI12).'
    },
    focoTematico: 'Variabilidade genética, efeito de gargalo populacional (bottleneck) e importância de corredores ecológicos pós-incêndios no Pantanal.',
    conceitosChave: [
      'Variabilidade Genética',
      'Fragmentação de Habitat',
      'Fluxo Gênico e Endogamia',
      'Corredores Ecológicos'
    ],
    habilidadesBNCC: [
      {
        codigo: 'EF09CI12',
        titulo: 'Unidades de Conservação e Corredores Ecológicos',
        descricao: 'Justificar a importância das Unidades de Conservação de Proteção Integral para manter populações viáveis e conectadas geneticamente.'
      },
      {
        codigo: 'EF07CI08.1MT',
        titulo: 'Interações Ecológicas no Pantanal (Arara e Manduvi)',
        descricao: 'Analisar a relação ecológica especialista entre a arara-azul-grande (Anodorhynchus hyacinthinus) e a árvore manduvi (Sterculia apetala).'
      }
    ],
    fontesPesquisa: [
      'Instituto Arara Azul & Observatório do Pantanal — Monitoramento de ninhos pós-incêndios',
      'MapBiomas Fogo — Mapeamento de áreas queimadas no Parque Estadual Encontro das Águas',
      'ICMBio / Livro Vermelho da Fauna Brasileira — Conservação de Blastocerus dichotomus'
    ],
    infografico: {
      url: '/src/assets/images/foto_arara_cervo_pantanal_pt_1794410876100.jpg',
      titulo: 'Infográfico em Português: Simbiose e Variabilidade Genética no Pantanal',
      legenda: 'Prancha científica em Português (Brasil) com nomenclatura binomial em latim: Anodorhynchus hyacinthinus, Sterculia apetala e Blastocerus dichotomus.',
      autor: 'Equipe Grupo 1 • 9º Ano',
      formato: 'imagem'
    },
    videoEquipe: {
      url: '',
      titulo: 'Vídeo Científico: Por que a Variabilidade Genética Salva Espécies da Extinção?',
      duracao: '3 min 45 seg',
      descricao: 'Alunos explicam como o isolamento de populações de Blastocerus dichotomus e Anodorhynchus hyacinthinus reduz a diversidade genética e como corredores ecológicos resolvem isso.',
      roteiroResumo: '1. O que é variabilidade genética. 2. O impacto do fogo no manduvi (Sterculia apetala). 3. Ninhos artificiais e Unidades de Conservação.'
    },
    resumoCientifico: {
      introducao: 'A arara-azul-grande (Anodorhynchus hyacinthinus) e o cervo-do-pantanal (Blastocerus dichotomus) são espécies símbolos do Pantanal mato-grossense. Após os incêndios de 2020 e 2024, a fragmentação de seus habitats tornou-se uma ameaça genética urgente.',
      diagnosticoEcologico: 'Cerca de 90% dos ninhos naturais da arara-azul no Pantanal são feitos em ocos de manduvi (Sterculia apetala) com mais de 60 anos. Quando o fogo destrói essas árvores e isola capões de mata, pequenos grupos de animais ficam ilhados, reduzindo o fluxo gênico.',
      ameacasImpactos: 'Diminuição da variabilidade genética por cruzamentos consanguíneos (endogamia); perda de locais de reprodução e alimentação (frutos de Attalea phalerata e Acrocomia aculeata).',
      solucoesComunitarias: 'Instalação de caixas-ninho artificiais para araras-azuis, restauração de corredores ecológicos ligando Unidades de Conservação e proteção de refúgios hídricos.',
      conclusaoEstudantil: 'Proteger uma espécie exige preservar sua diversidade genética e sua teia ecológica inteira por meio de Unidades de Conservação conectadas.'
    },
    diarioDeBordo: {
      dataRegistro: 'Outubro / Novembro — Estudo de Genética e Ecologia',
      depoimentoOuVoz: '"Sem o manduvi maduro em pé e sem a palmeira acuri dando fruto, a arara-azul perde a casa e o alimento. A genética ensina que populações isoladas enfraquecem se não houver corredor de mata ligando os rios."',
      autorVoz: 'Síntese da Equipe de Biologia & Ciências',
      cargoOuFuncao: 'Estudo baseado nos relatórios do Instituto Arara Azul e Observatório do Pantanal',
      observacoesCampo: 'Simulação em sala de aula demonstrou como populações com alta variabilidade genética resistem melhor a mudanças ambientais.'
    },
    metricas: [
      {
        rotulo: 'Dependência do Manduvi',
        valor: '~90%',
        detalhe: 'Dos ninhos naturais em Sterculia apetala',
        icone: 'arvore'
      },
      {
        rotulo: 'População Monitorada',
        valor: '~6.500',
        detalhe: 'Indivíduos de Anodorhynchus hyacinthinus',
        icone: 'dna'
      },
      {
        rotulo: 'Status de Conservação',
        valor: 'Vulnerável',
        detalhe: 'Exige corredores ecológicos entre UCs (EF09CI12)',
        icone: 'alerta'
      }
    ],
    acoesPropostas: [
      'Demonstrar na Mostra Científica um modelo didático de caixa-ninho artificial para Anodorhynchus hyacinthinus',
      'Explicar com painel interativo o conceito de fluxo gênico e corredor ecológico no Pantanal',
      'Mapear as principais Unidades de Conservação de Proteção Integral de Mato Grosso'
    ]
  },

  // ------------------------------------------------------------------------------------
  // 5. PEQUIZEIRO & BARU / CUMBARU - GRUPO 1
  // ------------------------------------------------------------------------------------
  {
    id: 'pequizeiro-baru-cerrado',
    titulo: 'Pequizeiro & Baru/Cumbaru no Cerrado',
    subtitulo: 'Resistência climática, raízes profundas ("floresta invertida") e conservação genética',
    grupoId: 'grupo1',
    grupoNome: 'Grupo 1: Biodiversidade & Genética',
    grupoCor: '#059669',
    bioma: 'Cerrado',
    municipio: 'Chapada dos Guimarães',
    regiaoMT: 'Planalto Central — Parque Nacional da Chapada dos Guimarães',
    coordenadas: {
      lat: -15.46,
      lng: -55.75
    },
    equipeAlunos: [
      'Kauã Vinícius de Oliveira',
      'Lara Fernanda Cardoso',
      'Matheus Felipe Antunes',
      'Vitória Gabrielly Ramos'
    ],
    orientador: 'Prof. Johnny Martins Fernandes',
    escola: 'EE João Ribeiro Vilela',
    serie: '9º Ano — Ciências',
    especiesCientificas: [
      {
        nomePopular: 'Pequizeiro',
        nomeCientificoLatim: 'Caryocar brasiliense',
        familia: 'Caryocaraceae',
        papelEcologico: 'Árvore símbolo do Cerrado com casca suberosa resistente ao fogo e frutos ricos em lipídios e carotenoides.'
      },
      {
        nomePopular: 'Baru / Cumbaru',
        nomeCientificoLatim: 'Dipteryx alata',
        familia: 'Fabaceae',
        papelEcologico: 'Leguminosa arbórea fixadora de nitrogênio cuja amêndoa contém quase 30% de proteína de alto valor biológico.'
      },
      {
        nomePopular: 'Morcego-beija-flor (Polinizador)',
        nomeCientificoLatim: 'Glossophaga soricina',
        familia: 'Phyllostomidae',
        papelEcologico: 'Polinizador noturno essencial para a fecundação cruzada e variabilidade genética do pequizeiro.'
      }
    ],
    pontosInfograficoPT: [
      {
        numero: 1,
        xPercent: 30,
        yPercent: 26,
        tituloPT: 'Copa e Frutos do Pequizeiro',
        nomeLatim: 'Caryocar brasiliense',
        detalhePT: 'Fruto nativo de alto valor nutricional e cultural, protegido por legislação estadual.'
      },
      {
        numero: 2,
        xPercent: 68,
        yPercent: 24,
        tituloPT: 'Baruzeiro / Cumbaru com Vagens',
        nomeLatim: 'Dipteryx alata',
        detalhePT: 'Semente resistente à seca com 29,5% de proteína, gerando renda extrativista sustentável.'
      },
      {
        numero: 3,
        xPercent: 34,
        yPercent: 70,
        tituloPT: 'Sistema Radicular Profundo ("Floresta Invertida")',
        detalhePT: 'Cerca de 70% da biomassa do Cerrado está sob o solo, com raízes que descem até 18 metros.'
      },
      {
        numero: 4,
        xPercent: 64,
        yPercent: 86,
        tituloPT: 'Recarga do Aquífero Subterrâneo',
        detalhePT: 'As raízes funcionam como canais que infiltram a água da chuva para abastecer as nascentes de MT.'
      }
    ],
    narracaoModoHistoria: 'Capítulo 5: Pequizeiro e Baru no Cerrado da Chapada dos Guimarães, Mato Grosso. O Cerrado é conhecido pela ciência como uma floresta invertida, pois até 70 por cento da sua biomassa está abaixo da terra. Nesta prancha em corte, vemos como o pequizeiro, Caryocar brasiliense, e o baru ou cumbaru, Dipteryx alata, lançam raízes profundas de até 18 metros que conduzem a água da chuva para os aquíferos subterrâneos. Preservar a variabilidade genética dessas árvores matrizes e de seus polinizadores, como o morcego Glossophaga soricina, garante tanto a água que abastece o Pantanal quanto a segurança alimentar das comunidades extrativistas.',
    justicaClimaticaExplicacao: {
      quemSofreImpacto: 'Coletores extrativistas familiares, comunidades do Cerrado e a recarga hídrica das bacias que abastecem Cuiabá e o Pantanal.',
      causaDoProblema: 'Desmatamento de matrizes nativas de Caryocar brasiliense e Dipteryx alata e perda de polinizadores.',
      porQueEInjusto: 'A derrubada de árvores nativas centenárias destrói a fonte de renda sustentável de famílias extrativistas e reduz a infiltração de água no solo.'
    },
    unidadeConservacaoRelacionada: {
      nome: 'Parque Nacional da Chapada dos Guimarães & APA da Chapada',
      categoriaSNUC: 'Proteção Integral',
      explicacaoEF09CI12: 'Combina o Parque Nacional (Proteção Integral de nascentes e bancos genéticos nativos) com a APA no entorno (Uso Sustentável extrativista).'
    },
    focoTematico: 'Adaptações evolutivas do Pequizeiro (Caryocar brasiliense) e Baru/Cumbaru (Dipteryx alata) à seca e conservação de bancos genéticos no Cerrado.',
    conceitosChave: [
      'Floresta Invertida (Raízes Profundas)',
      'Banco de Sementes Nativas',
      'Agrobiodiversidade do Cerrado',
      'Segurança Alimentar Regional'
    ],
    habilidadesBNCC: [
      {
        codigo: 'EF07CI08.1MT',
        titulo: 'Adaptações Morfofisiológicas do Cerrado',
        descricao: 'Compreender como cascas suberosas e raízes pivotantes profundas permitem a sobrevivência de Caryocar brasiliense e Dipteryx alata à estiagem.'
      },
      {
        codigo: 'EF09CI13',
        titulo: 'Bioeconomia e Uso Sustentável da Sociobiodiversidade',
        descricao: 'Propor ações de valorização das árvores nativas do Cerrado em pé como alternativa econômica e ecológica para Mato Grosso.'
      }
    ],
    fontesPesquisa: [
      'MapBiomas Cerrado — Evolução do uso do solo no Planalto Mato-grossense',
      'EMBRAPA Agrossilvipastoril (MT) — Conservação genética de Dipteryx alata e Caryocar brasiliense',
      'ICMBio — Plano de Manejo do Parque Nacional da Chapada dos Guimarães'
    ],
    infografico: {
      url: '/src/assets/images/foto_pequi_baru_cerrado_pt_1794410878200.jpg',
      titulo: 'Infográfico em Português: A "Floresta Invertida" do Cerrado — Pequi e Baru',
      legenda: 'Corte esquemático do solo em Português (Brasil) destacando Caryocar brasiliense e Dipteryx alata e a recarga do lençol freático.',
      autor: 'Equipe Grupo 1 • 9º Ano',
      formato: 'imagem'
    },
    videoEquipe: {
      url: '',
      titulo: 'Experimento Escolar: Sementes do Cerrado e o Papel da "Floresta Invertida"',
      duracao: '4 min 10 seg',
      descricao: 'Apresentação das propriedades nutricionais da castanha de Dipteryx alata e do fruto de Caryocar brasiliense, demonstrando por que o Cerrado em pé protege as águas de MT.',
      roteiroResumo: '1. Por que o Cerrado é chamado de floresta invertida. 2. O valor nutricional do baru (29,5% de proteína). 3. Conservação genética das árvores matrizes.'
    },
    resumoCientifico: {
      introducao: 'O Pequizeiro (Caryocar brasiliense) e o Baru ou Cumbaru (Dipteryx alata) são árvores fundamentais da identidade cultural, ecológica e alimentar de Mato Grosso. Suas adaptações genéticas milenares garantem tanto a sobrevivência na seca quanto a recarga dos aquíferos.',
      diagnosticoEcologico: 'Conhecido pela ciência como "floresta invertida", até 70% da biomassa do Cerrado está abaixo do solo. Suas raízes profundas funcionam como canais naturais que conduzem a água da chuva para os lençóis subterrâneos.',
      ameacasImpactos: 'O corte isolado de árvores adultas e a perda de polinizadores noturnos (como o morcego Glossophaga soricina) reduzem a fecundação cruzada e a variabilidade genética das sementes.',
      solucoesComunitarias: 'Proteção legal de Caryocar brasiliense, criação de bancos comunitários de sementes crioulas e incentivo às cooperativas extrativistas de Dipteryx alata.',
      conclusaoEstudantil: 'Preservar a genética do pequi e do baru é garantir água nas nascentes da Chapada dos Guimarães e alimento saudável na mesa dos mato-grossenses.'
    },
    diarioDeBordo: {
      dataRegistro: 'Novembro — Laboratório de Ciências (9º Ano)',
      depoimentoOuVoz: '"O cumbaru aguenta meses de sol forte sem secar porque sua raiz busca água lá no fundo da terra. Derrubar um baruzeiro adulto é desligar uma bomba d’água natural do Cerrado."',
      autorVoz: 'Relato de Extrativistas da Chapada dos Guimarães',
      cargoOuFuncao: 'Pesquisa documental da Equipe do Grupo 1',
      observacoesCampo: 'Alunos analisaram amostras de frutos e amêndoas de Dipteryx alata, destacando seu alto teor proteico (29,5%).'
    },
    metricas: [
      {
        rotulo: 'Profundidade Radicular',
        valor: 'Até 18 m',
        detalhe: 'Raízes profundas que recarregam aquíferos',
        icone: 'arvore'
      },
      {
        rotulo: 'Proteína na Amêndoa (Baru)',
        valor: '29,5%',
        detalhe: 'Semente de Dipteryx alata pesquisada',
        icone: 'dna'
      },
      {
        rotulo: 'Biomassa Subterrânea',
        valor: '~70%',
        detalhe: 'Conceito científico de "Floresta Invertida"',
        icone: 'agua'
      }
    ],
    acoesPropostas: [
      'Montar mostruário botânico com etiquetas científicas em latim (Dipteryx alata, Caryocar brasiliense)',
      'Apresentar painel do perfil de solo mostrando as raízes profundas do Cerrado',
      'Distribuir guia escolar sobre receitas regionais e valorização dos produtos extrativistas de MT'
    ]
  },

  // ------------------------------------------------------------------------------------
  // 6. RAIZEIRAS DO CERRADO: BARBATIMÃO, ESPINHEIRA-SANTA E BOCAIÚVA - GRUPO 3
  // ------------------------------------------------------------------------------------
  {
    id: 'raizeiras-do-cerrado',
    titulo: 'Raizeiras do Cerrado: Barbatimão, Espinheira-santa e Bocaiúva',
    subtitulo: 'Patrimônio Imaterial IPHAN-MT, etnobotânica e manejo sustentável da flora medicinal',
    grupoId: 'grupo3',
    grupoNome: 'Grupo 3: Patrimônio Imaterial (IPHAN)',
    grupoCor: '#7c3aed',
    bioma: 'Cerrado',
    municipio: 'Cuiabá / Poconé / Chapada',
    regiaoMT: 'Baixada Cuiabana e Entorno Metropolitano',
    coordenadas: {
      lat: -15.60,
      lng: -56.10
    },
    equipeAlunos: [
      'Ana Luíza Peixoto',
      'Felipe Augusto de Rezende',
      'Maria Eduarda Toledo',
      'Yasmin Vitória Gonçalves'
    ],
    orientador: 'Prof. Johnny Martins Fernandes',
    escola: 'EE João Ribeiro Vilela',
    serie: '9º Ano — Ciências',
    especiesCientificas: [
      {
        nomePopular: 'Barbatimão',
        nomeCientificoLatim: 'Stryphnodendron adstringens',
        familia: 'Fabaceae',
        papelEcologico: 'Árvore do Cerrado cuja entrecasca contém até 30% de taninos com potente ação cicatrizante e anti-inflamatória.'
      },
      {
        nomePopular: 'Espinheira-santa',
        nomeCientificoLatim: 'Maytenus ilicifolia',
        familia: 'Celastraceae',
        papelEcologico: 'Planta medicinal rica em flavonoides e triterpenos que protegem a mucosa gástrica contra úlceras e gastrite.'
      },
      {
        nomePopular: 'Bocaiúva / Macaúba',
        nomeCientificoLatim: 'Acrocomia aculeata',
        familia: 'Arecaceae',
        papelEcologico: 'Palmeira nativa de frutos ricos em betacaroteno (pró-vitamina A), fibras e óleos nutritivos e medicinais.'
      }
    ],
    pontosInfograficoPT: [
      {
        numero: 1,
        xPercent: 20,
        yPercent: 78,
        tituloPT: 'Cascas de Barbatimão Colhidas Sustentavelmente',
        nomeLatim: 'Stryphnodendron adstringens',
        detalhePT: 'Rica em taninos cicatrizantes; retira-se apenas uma lasca lateral para preservar o floema da árvore.'
      },
      {
        numero: 2,
        xPercent: 36,
        yPercent: 86,
        tituloPT: 'Folhas de Espinheira-santa',
        nomeLatim: 'Maytenus ilicifolia',
        detalhePT: 'Princípios ativos comprovados na proteção estomacal e digestiva.'
      },
      {
        numero: 3,
        xPercent: 48,
        yPercent: 52,
        tituloPT: 'Transmissão Oral entre Gerações (IPHAN-MT)',
        detalhePT: 'Mestra raizeira ensinando o preparo no pilão e a ética do manejo sustentável do Cerrado.'
      },
      {
        numero: 4,
        xPercent: 84,
        yPercent: 84,
        tituloPT: 'Frutos Dourados da Bocaiúva e Tinturas',
        nomeLatim: 'Acrocomia aculeata',
        detalhePT: 'Fonte tradicional de vitaminas, farinha nutritiva e óleo medicinal da Baixada Cuiabana.'
      }
    ],
    narracaoModoHistoria: 'Capítulo 6: Raizeiras do Cerrado, Patrimônio Cultural Imaterial registrado pelo IPHAN em Mato Grosso. A sabedoria das mulheres raizeiras une cultura ancestral e ciência botânica no uso de três espécies fundamentais: o barbatimão, Stryphnodendron adstringens, rico em taninos cicatrizantes; a espinheira-santa, Maytenus ilicifolia, protetora gástrica; e a bocaiúva, Acrocomia aculeata, fonte de vitaminas e óleos naturais. As raizeiras ensinam uma regra de ouro da fisiologia vegetal: ao colher a casca do barbatimão, retira-se apenas uma lasca lateral, sem anelar o tronco, garantindo que a seiva continue circulando pelo floema e mantendo a árvore viva.',
    justicaClimaticaExplicacao: {
      quemSofreImpacto: 'Mulheres raizeiras e benzedeiras tradicionais de Mato Grosso e famílias que dependem da medicina natural acessível.',
      causaDoProblema: 'Queimadas recorrentes e supressão de áreas nativas de coleta de Stryphnodendron adstringens e Acrocomia aculeata.',
      porQueEInjusto: 'As raizeiras guardam um patrimônio científico e cultural reconhecido pelo IPHAN, mas perdem seus campos de coleta para o desmatamento.'
    },
    unidadeConservacaoRelacionada: {
      nome: 'Reservas Extrativistas e Quintais Etnobotânicos Comunitários',
      categoriaSNUC: 'Uso Sustentável / Território Tradicional',
      explicacaoEF09CI12: 'Garante o acesso sustentável das detentoras de saberes tradicionais às plantas nativas sem esgotar a espécie (EF09CI12 e EF09CI13).'
    },
    focoTematico: 'Patrimônio Cultural Imaterial (IPHAN-MT), princípios ativos comprovados pela ciência e técnicas tradicionais de colheita sem matar a árvore.',
    conceitosChave: [
      'Patrimônio Imaterial (IPHAN-MT)',
      'Etnobotânica e Princípios Ativos',
      'Manejo Sustentável de Cascas (Floema)',
      'Farmácia Viva do Cerrado'
    ],
    habilidadesBNCC: [
      {
        codigo: 'EF07CI08.1MT',
        titulo: 'Fisiologia Vegetal e Plantas Medicinais de MT',
        descricao: 'Compreender por que retirar apenas uma lasca lateral da casca de Stryphnodendron adstringens preserva os vasos condutores (floema) e evita a morte da árvore.'
      },
      {
        codigo: 'EF09CI13',
        titulo: 'Salvaguarda do Patrimônio Biocultural',
        descricao: 'Valorizar os saberes tradicionais das raizeiras mato-grossenses aliando conhecimento popular e comprovação farmacológica.'
      }
    ],
    fontesPesquisa: [
      'IPHAN Mato Grosso — Dossiê de Salvaguarda do Ofício das Raizeiras do Cerrado',
      'Herbário Central da UFMT — Estudos fitoquímicos de Stryphnodendron adstringens e Acrocomia aculeata',
      'Articulação Pacari (Rede de Raizeiras do Cerrado) — Práticas de manejo sustentável'
    ],
    infografico: {
      url: '/src/assets/images/foto_raizeiras_cerrado_pt_1794410883548.jpg',
      titulo: 'Infográfico em Português: Saberes das Raizeiras — Etnobotânica e Nomenclatura Científica',
      legenda: 'Prancha etnobotânica em Português (Brasil) apresentando Stryphnodendron adstringens (Barbatimão), Maytenus ilicifolia (Espinheira-santa) e Acrocomia aculeata (Bocaiúva).',
      autor: 'Equipe Grupo 3 • 9º Ano (Referência IPHAN-MT)',
      formato: 'imagem'
    },
    videoEquipe: {
      url: '',
      titulo: 'Documentário: Farmácia Viva do Cerrado — Ciência e Tradição das Raizeiras',
      duracao: '5 min 30 seg',
      descricao: 'A relação entre o saber ancestral das raizeiras da Baixada Cuiabana e a ciência botânica ensinada no 9º Ano.',
      roteiroResumo: '1. O reconhecimento do IPHAN-MT. 2. Os compostos químicos naturais (taninos e flavonoides). 3. Como colher a casca de Stryphnodendron adstringens sem interromper a seiva.'
    },
    resumoCientifico: {
      introducao: 'O ofício das Raizeiras do Cerrado é um patrimônio cultural imaterial em Mato Grosso. Por meio da observação empírica passada entre gerações, essas especialistas dominam o uso terapêutico de espécies como o Barbatimão (Stryphnodendron adstringens), a Espinheira-santa (Maytenus ilicifolia) e a Bocaiúva (Acrocomia aculeata).',
      diagnosticoEcologico: 'A ciência farmacológica confirma os saberes tradicionais: a casca de Stryphnodendron adstringens possui até 30% de taninos com potente ação cicatrizante; Maytenus ilicifolia protege a mucosa gástrica; e a polpa de Acrocomia aculeata é riquíssima em betacaroteno e óleos anti-inflamatórios.',
      ameacasImpactos: 'A expansão urbana desordenada, queimadas e o extrativismo predatório comercial (que retira a casca em anel completo ao redor do tronco, interrompendo o transporte de seiva elaborada pelo floema) colocam em risco as populações naturais.',
      solucoesComunitarias: 'Aplicação da regra tradicional das raizeiras: retirar apenas lascas longitudinais de um lado do tronco, cobrindo com barro úmido para regeneração, além da criação de canteiros de Farmácia Viva nas escolas.',
      conclusaoEstudantil: 'A sabedoria das raizeiras é verdadeira ciência aplicada à conservação: elas curam as pessoas enquanto ensinam a manter a floresta do Cerrado viva.'
    },
    diarioDeBordo: {
      dataRegistro: 'Novembro — Pesquisa Etnobotânica & Química Natural',
      depoimentoOuVoz: '"A raizeira de verdade nunca tira a casca dando a volta inteira no tronco, porque sabe que a seiva precisa passar para a árvore continuar viva. Quem respeita a planta tem remédio para sempre."',
      autorVoz: 'Sabedoria Tradicional das Raizeiras da Baixada Cuiabana',
      cargoOuFuncao: 'Registrada nos cadernos de salvaguarda do IPHAN-MT',
      observacoesCampo: 'Equipe relacionou a técnica tradicional das raizeiras ao conteúdo de vasos condutores (xilema e floema) estudado em Ciências.'
    },
    metricas: [
      {
        rotulo: 'Reconhecimento Cultural',
        valor: 'IPHAN-MT',
        detalhe: 'Salvaguarda do Ofício das Raizeiras',
        icone: 'patrimonio'
      },
      {
        rotulo: 'Teor de Taninos (Barbatimão)',
        valor: '20 a 30%',
        detalhe: 'Em Stryphnodendron adstringens',
        icone: 'dna'
      },
      {
        rotulo: 'Espécies Foco Catalogadas',
        valor: '3 táxons',
        detalhe: 'Nomenclatura binomial ICZN / ICN',
        icone: 'arvore'
      }
    ],
    acoesPropostas: [
      'Criar um canteiro demonstrativo "Farmácia Viva do Cerrado" na EE João Ribeiro Vilela',
      'Produzir catálogo ilustrado com nome popular, nome científico em latim (em itálico) e princípio ativo',
      'Demonstrar em aula prática por que o anelamento do tronco (Malpighi) mata a árvore'
    ]
  }
];

const STORAGE_KEY = 'vozes_clima_biopatrimonio_mt_projetos_v3';

export function getMuralProjetos(): ItemMural[] {
  if (typeof window === 'undefined') return DADOS_INICIAIS_MURAL;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Erro ao carregar dados salvos do mural, usando padrão inicial:', err);
  }
  return DADOS_INICIAIS_MURAL;
}

export function saveMuralProjetos(projetos: ItemMural[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projetos));
  } catch (err) {
    console.error('Erro ao salvar dados do mural no localStorage:', err);
  }
}

export function resetMuralProjetos(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Erro ao resetar dados do mural:', err);
  }
}
