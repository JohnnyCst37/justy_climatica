import type { CommunityNode } from '../types/domain';

export const COMMUNITIES_PART_3: CommunityNode[] = [
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
      url: '/assets/images/foto_pequi_baru_cerrado_pt_1794410878200.jpg',
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
      url: '/assets/images/foto_raizeiras_cerrado_pt_1794410883548.jpg',
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
