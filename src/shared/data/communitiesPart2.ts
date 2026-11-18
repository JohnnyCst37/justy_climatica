import type { CommunityNode } from '../types/domain';

export const COMMUNITIES_PART_2: CommunityNode[] = [
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
      url: '/assets/images/foto_indigenas_mif_xavante_pt_1794410882483.jpg',
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
      url: '/assets/images/foto_arara_cervo_pantanal_pt_1794410876100.jpg',
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
  }
];
