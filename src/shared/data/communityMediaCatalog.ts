export interface CommunityMediaSlide {
  id: string;
  type: 'photo' | 'infographic' | 'video';
  title: string;
  subtitle: string;
  url: string;
  caption: string;
  points?: Array<{
    numero: number;
    xPercent: number;
    yPercent: number;
    tituloPT: string;
    nomeLatim?: string;
    detalhePT: string;
  }>;
}

export function getCommunityMediaSlides(communityId: string, customInfographicUrl?: string, customVideoUrl?: string): CommunityMediaSlide[] {
  switch (communityId) {
    case 'quilombo-mata-cavalo':
      return [
        {
          id: 'photo-mata-cavalo',
          type: 'photo',
          title: 'Quilombo Mata Cavalo',
          subtitle: 'Território Tradicional e Roças Quilombolas no Cerrado',
          url: '/assets/images/quilombo_mata_cavalo_mt_1794409157361.jpg',
          caption: '418 famílias quilombolas preservando nascentes e cultivando a terra em Nossa Senhora do Livramento.',
        },
        {
          id: 'info-mata-cavalo',
          type: 'infographic',
          title: 'Infográfico: Agroecologia e Restauração de Nascentes',
          subtitle: 'Prancha Científica dos Estudantes do 9º Ano',
          url: customInfographicUrl || '/assets/images/foto_quilombo_mata_cavalo_pt_1794410879621.jpg',
          caption: 'Proteção hídrica com palmeiras de buriti (Mauritia flexuosa) e manejo agroecológico.',
        },
        {
          id: 'video-mata-cavalo',
          type: 'video',
          title: 'Vozes da Terra: A Seca das Nascentes em Mata Cavalo',
          subtitle: 'Vídeo-reportagem produzida pela turma',
          url: customVideoUrl || '',
          caption: 'Depoimentos de agricultoras familiares sobre os 142 dias de estiagem na Baixada Cuiabana.',
        },
      ];

    case 'ribeirinhos-rio-cuiaba':
      return [
        {
          id: 'photo-ribeirinhos',
          type: 'photo',
          title: 'Ribeirinhos do Rio Cuiabá',
          subtitle: 'Barão de Melgaço e Baías Chacororé e Siá Mariana',
          url: '/assets/images/ribeirinhos_rio_cuiaba_mt_1794409161828.jpg',
          caption: 'A pesca artesanal sustentável em canoas tradicionais dependente do pulso de inundação.',
        },
        {
          id: 'info-ribeirinhos',
          type: 'infographic',
          title: 'Infográfico: Pulso de Inundação e Peixes Nativos',
          subtitle: 'Ictiofauna e Conexão das Baías Marginais',
          url: customInfographicUrl || '/assets/images/foto_ribeirinhos_cuiaba_pt_1794410880715.jpg',
          caption: 'Reprodução de pacu, pintado e dourado nas lagoas marginais durante a cheia pantaneira.',
        },
        {
          id: 'video-ribeirinhos',
          type: 'video',
          title: 'O Rio que Não Enche Mais: Alerta de Barão de Melgaço',
          subtitle: 'Vídeo da Equipe Estudantil',
          url: customVideoUrl || '',
          caption: 'A perda de 61% da lâmina d’água e o impacto direto nas famílias de pescadores.',
        },
      ];

    case 'indigenas-xavante-bororo':
      return [
        {
          id: 'photo-indigenas',
          type: 'photo',
          title: 'Brigadas Indígenas Comunitárias',
          subtitle: 'Povos Xavante, Bororo e Kuikuro em Mato Grosso',
          url: '/assets/images/brigadas_indigenas_xavante_mt_1794409162294.jpg',
          caption: 'Manejo Integrado do Fogo e proteção de mais de 98% de cobertura vegetal nas Terras Indígenas.',
        },
        {
          id: 'info-indigenas',
          type: 'infographic',
          title: 'Infográfico: Manejo Integrado do Fogo (MIF)',
          subtitle: 'Queima Prescrita Fria ao Amanhecer',
          url: customInfographicUrl || '/assets/images/foto_indigenas_mif_xavante_pt_1794410882483.jpg',
          caption: 'Como a queima controlada em mosaico reduz em 58% o risco de megaincêndios destrutivos.',
        },
        {
          id: 'video-indigenas',
          type: 'video',
          title: 'Guardiões do Clima: As Brigadas do Cerrado e Xingu',
          subtitle: 'Documentário Escolar 9º Ano',
          url: customVideoUrl || '',
          caption: 'Mapas de satélite do ISA comprovando como o fogo é contido na fronteira indígena.',
        },
      ];

    case 'arara-azul-cervo-pantanal':
      return [
        {
          id: 'photo-arara',
          type: 'photo',
          title: 'Fauna Especialista do Pantanal',
          subtitle: 'Poconé e Rodovia Transpantaneira',
          url: '/assets/images/biodiversidade_pantanal_cerrado_mt_1794409163176.jpg',
          caption: 'Arara-azul-grande (Anodorhynchus hyacinthinus) e Cervo-do-pantanal (Blastocerus dichotomus).',
        },
        {
          id: 'info-arara',
          type: 'infographic',
          title: 'Infográfico: Simbiose e Variabilidade Genética',
          subtitle: 'A Dependência Vital do Manduvi Centenário',
          url: customInfographicUrl || '/assets/images/foto_arara_cervo_pantanal_pt_1794410876100.jpg',
          caption: '90% dos ninhos dependem de ocos em Sterculia apetala; corredores ecológicos evitam a endogamia.',
        },
        {
          id: 'video-arara',
          type: 'video',
          title: 'Por que a Genética Salva Espécies da Extinção?',
          subtitle: 'Experimento e Análise da Turma',
          url: customVideoUrl || '',
          caption: 'Modelos de ninhos artificiais e conexão entre Unidades de Conservação de Proteção Integral.',
        },
      ];

    case 'pequizeiro-baru-cerrado':
      return [
        {
          id: 'photo-pequi',
          type: 'photo',
          title: 'A "Floresta Invertida" do Cerrado',
          subtitle: 'Chapada dos Guimarães e Planalto Central',
          url: '/assets/images/biodiversidade_pantanal_cerrado_mt_1794409163176.jpg',
          caption: 'Raízes profundas de até 18 metros que alimentam os aquíferos das nascentes de Mato Grosso.',
        },
        {
          id: 'info-pequi',
          type: 'infographic',
          title: 'Infográfico: Adaptação à Seca do Pequi e Baru',
          subtitle: 'Caryocar brasiliense e Dipteryx alata',
          url: customInfographicUrl || '/assets/images/foto_pequi_baru_cerrado_pt_1794410878200.jpg',
          caption: 'Até 70% da biomassa do Cerrado está subterrânea, atuando como a caixa d’água do Brasil.',
        },
        {
          id: 'video-pequi',
          type: 'video',
          title: 'Sementes Nativas e Soberania Alimentar em MT',
          subtitle: 'Pesquisa Nutricional da Equipe',
          url: customVideoUrl || '',
          caption: 'Baru com 29,5% de proteína e a conservação genética de árvores matrizes centenárias.',
        },
      ];

    case 'raizeiras-do-cerrado':
      return [
        {
          id: 'photo-raizeiras',
          type: 'photo',
          title: 'Ofício das Raizeiras do Cerrado',
          subtitle: 'Patrimônio Cultural Imaterial registrado pelo IPHAN-MT',
          url: '/assets/images/raizeiras_cerrado_iphan_mt_1794409164248.jpg',
          caption: 'Transmissão oral entre gerações sobre a medicina botânica e a salvaguarda do Cerrado.',
        },
        {
          id: 'info-raizeiras',
          type: 'infographic',
          title: 'Infográfico: Etnobotânica e Fisiologia Vegetal',
          subtitle: 'Barbatimão, Espinheira-santa e Bocaiúva',
          url: customInfographicUrl || '/assets/images/foto_raizeiras_cerrado_pt_1794410883548.jpg',
          caption: 'Técnica de colheita em lasca lateral que preserva o floema e mantém a árvore viva.',
        },
        {
          id: 'video-raizeiras',
          type: 'video',
          title: 'Farmácia Viva do Cerrado: Ciência e Tradição',
          subtitle: 'Documentário Estudantil',
          url: customVideoUrl || '',
          caption: 'A comprovação farmacológica dos taninos e flavonoides usados pelas mestras raizeiras.',
        },
      ];

    default:
      return [
        {
          id: `photo-${communityId}`,
          type: 'photo',
          title: 'Território em Mapeamento',
          subtitle: 'Comunidade Tradicional de Mato Grosso',
          url: customInfographicUrl || '/assets/images/biodiversidade_pantanal_cerrado_mt_1794409163176.jpg',
          caption: 'Mapeamento participativo de territórios vulneráveis a eventos climáticos extremos.',
        },
      ];
  }
}

