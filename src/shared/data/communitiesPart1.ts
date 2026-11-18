import type { CommunityNode } from '../types/domain';

export const COMMUNITIES_PART_1: CommunityNode[] = [
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
      url: '/assets/images/foto_quilombo_mata_cavalo_pt_1794410879621.jpg',
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
      url: '/assets/images/foto_ribeirinhos_cuiaba_pt_1794410880715.jpg',
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
  }
];
