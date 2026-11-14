import type { AgeGroupKey, CommunityNode, ThemeSessionKey } from '../types/domain';

export interface AgeAdaptedOverview {
  searchQueryTitle: string;
  highlightedSentence: string;
  bodyParagraph: string;
  bullets: Array<{ label: string; detail: string }>;
  spokenScript: string;
}

export function resolveAgeGroup(age?: number): AgeGroupKey {
  if (!age || age <= 12) return '10-12';
  if (age <= 15) return '13-15';
  if (age <= 18) return '16-18';
  return '19+';
}

export function buildAgeAdaptedOverview(
  community: CommunityNode,
  themeKey: ThemeSessionKey,
  age?: number
): AgeAdaptedOverview {
  const group = resolveAgeGroup(age);
  const place = `${community.municipio} (${community.bioma})`;

  if (themeKey === 'justica') {
    const query = `O que é justiça climática em ${community.titulo} e por que esse tema está sendo levantado?`;
    if (group === '10-12') {
      const hl = 'Justiça climática significa perceber que o calor e a falta de chuva não machucam todo mundo igual.';
      const body = `Em ${place}, as famílias de ${community.titulo} cuidam das árvores e da água com muito carinho. Mesmo sem sujar o planeta, são elas que sentem a seca chegando mais rápido no poço e na plantação.`;
      return {
        searchQueryTitle: query,
        highlightedSentence: hl,
        bodyParagraph: body,
        bullets: [
          { label: 'Quem cuida mais', detail: `${community.titulo} protege as nascentes e a mata em pé.` },
          { label: 'O que está acontecendo', detail: community.justicaClimaticaExplicacao.causaDoProblema },
          { label: 'Por que precisamos ouvir', detail: 'Dar voz a quem mora lá ajuda toda a nossa cidade a ter água limpa.' },
        ],
        spokenScript: `${hl} ${body} Hoje você está conhecendo essa história na EE CM João Ribeiro Vilela.`,
      };
    }

    if (group === '13-15' || group === '16-18') {
      const hl = 'A justiça climática mostra que comunidades que mais preservam o meio ambiente costumam sofrer primeiro os impactos da crise do clima.';
      const body = `Em ${place}, ${community.titulo} mantém práticas sustentáveis de baixo impacto. Porém, as secas severas e a pressão externa rebaixam os rios e o lençol freático — ${community.justicaClimaticaExplicacao.porQueEInjusto}`;
      return {
        searchQueryTitle: query,
        highlightedSentence: hl,
        bodyParagraph: body,
        bullets: [
          { label: 'Desigualdade nos impactos', detail: community.justicaClimaticaExplicacao.quemSofreImpacto },
          { label: 'Causa no território', detail: community.justicaClimaticaExplicacao.causaDoProblema },
          { label: 'Unidade de Conservação', detail: `${community.unidadeConservacaoRelacionada.nome} (${community.unidadeConservacaoRelacionada.categoriaSNUC}).` },
        ],
        spokenScript: `${hl} Em ${community.municipio}, ${community.justicaClimaticaExplicacao.porQueEInjusto}`,
      };
    }

    const hl = 'A justiça climática é um conceito ético, social e científico que liga direitos humanos à proteção dos territórios vulneráveis.';
    const body = `No contexto de Mato Grosso (${place}), ${community.titulo} exemplifica a assimetria climática: emissões históricas baixíssimas e alta conservação contrastam com a perda acelerada de segurança hídrica e produtiva.`;
    return {
      searchQueryTitle: query,
      highlightedSentence: hl,
      bodyParagraph: body,
      bullets: [
        { label: 'Vulnerabilidade Hídrica', detail: community.justicaClimaticaExplicacao.causaDoProblema },
        { label: 'Assimetria Socioambiental', detail: community.justicaClimaticaExplicacao.porQueEInjusto },
        { label: 'Território & Legislação', detail: community.unidadeConservacaoRelacionada.explicacaoEF09CI12 },
      ],
      spokenScript: `${hl} Em ${community.titulo}, ${community.justicaClimaticaExplicacao.porQueEInjusto}`,
    };
  }

  if (themeKey === 'comunidades') {
    const query = `Como as comunidades de ${community.titulo} resistem e protegem a água no ${community.bioma}?`;
    const hl = `${community.titulo} guarda saberes ancestrais essenciais para manter o ${community.bioma} vivo e resiliente.`;
    const body = group === '10-12'
      ? `As famílias moram em ${place} e conhecem cada planta e olho d'água como grandes guardiões da natureza.`
      : `${community.diarioDeBordo.depoimentoOuVoz} (${community.diarioDeBordo.autorVoz}).`;
    return {
      searchQueryTitle: query,
      highlightedSentence: hl,
      bodyParagraph: body,
      bullets: [
        { label: 'Voz do Território', detail: `${community.diarioDeBordo.autorVoz} — ${community.diarioDeBordo.cargoOuFuncao}.` },
        { label: 'Solução Local', detail: community.resumoCientifico.solucoesComunitarias },
        { label: 'Olhar da Escola', detail: `Pesquisa registrada por estudantes da ${community.escola}.` },
      ],
      spokenScript: `${hl} ${community.diarioDeBordo.depoimentoOuVoz}`,
    };
  }

  const query = `Quais espécies e segredos da biodiversidade ajudam ${community.titulo} a enfrentar as ondas de calor?`;
  const firstSpecies = community.especiesCientificas[0];
  const hl = firstSpecies
    ? `Espécies nativas como ${firstSpecies.nomePopular} (${firstSpecies.nomeCientificoLatim}) funcionam como termômetros naturais e guardiãs da umidade do solo.`
    : `A biodiversidade local de ${community.titulo} sustenta as nascentes e a alimentação no ${community.bioma}.`;
  const body = group === '10-12'
    ? `Quando protegemos árvores, palmeiras de buriti e animais do ${community.bioma}, o solo segura a água da chuva como uma esponja gigante!`
    : `${community.resumoCientifico.diagnosticoEcologico} ${community.resumoCientifico.ameacasImpactos}`;

  return {
    searchQueryTitle: query,
    highlightedSentence: hl,
    bodyParagraph: body,
    bullets: community.especiesCientificas.slice(0, 3).map((sp) => ({
      label: `${sp.nomePopular} (${sp.nomeCientificoLatim})`,
      detail: sp.papelEcologico,
    })),
    spokenScript: `${hl} ${body}`,
  };
}

