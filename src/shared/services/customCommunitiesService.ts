import { signInAnonymously } from 'firebase/auth';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { getFirebaseAuthClient, getFirestoreClient } from '../config/firebaseClient';
import { CURATED_COMMUNITIES } from '../data/communityRepository';
import type { BiomaType, CommunityNode } from '../types/domain';

async function ensureCommunitiesAuth(): Promise<void> {
  const auth = getFirebaseAuthClient();
  if (auth && !auth.currentUser) {
    await signInAnonymously(auth).catch(() => undefined);
  }
}

const LOCAL_COMMUNITIES_KEY = 'justy_custom_communities_v1';
export const COMMUNITIES_UPDATED_EVENT = 'justy-communities-updated';

export const MT_MUNICIPALITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'Cuiabá': { lat: -15.6014, lng: -56.0979 },
  'Várzea Grande': { lat: -15.6458, lng: -56.1322 },
  'Nossa Senhora do Livramento': { lat: -15.7745, lng: -56.3455 },
  'Poconé': { lat: -16.2583, lng: -56.625 },
  'Cáceres': { lat: -16.0714, lng: -57.6811 },
  'Santo Antônio de Leverger': { lat: -15.8658, lng: -56.0764 },
  'Chapada dos Guimarães': { lat: -15.4608, lng: -55.7497 },
  'Barra do Garças': { lat: -15.89, lng: -52.2567 },
  'Rondonópolis': { lat: -16.4708, lng: -54.6356 },
  'Sinop': { lat: -11.8604, lng: -55.5091 },
  'Alta Floresta': { lat: -9.8756, lng: -56.0861 },
  'Tangará da Serra': { lat: -14.6229, lng: -57.4933 },
  'Vila Bela da Santíssima Trindade': { lat: -15.0078, lng: -59.9508 },
  'São Félix do Araguaia': { lat: -11.615, lng: -50.6706 },
};

export interface CreateCommunityInput {
  titulo: string;
  municipio: string;
  regiaoMT: string;
  bioma: BiomaType;
  grupoId: 'grupo1' | 'grupo2' | 'grupo3';
  equipeAlunos: string;
  orientador: string;
  serie: string;
  quemSofreImpacto: string;
  causaDoProblema: string;
  solucoesComunitarias: string;
}

const GRUPO_META: Record<'grupo1' | 'grupo2' | 'grupo3', { nome: string; cor: string }> = {
  grupo1: { nome: 'Povos Indígenas & Floresta', cor: '#065f46' },
  grupo2: { nome: 'Quilombos & Cerrado', cor: '#b45309' },
  grupo3: { nome: 'Pantanal & Águas', cor: '#0369a1' },
};

function resolveCoordinates(municipio: string): { lat: number; lng: number } {
  const normalized = municipio.trim().toLowerCase();
  const exact = Object.entries(MT_MUNICIPALITY_COORDS).find(
    ([name]) => name.toLowerCase() === normalized
  );
  if (exact) {
    const jitter = ((Math.random() - 0.5) * 0.08);
    return { lat: Number((exact[1].lat + jitter).toFixed(4)), lng: Number((exact[1].lng + jitter).toFixed(4)) };
  }
  const offsetLat = (Math.random() - 0.5) * 1.4;
  const offsetLng = (Math.random() - 0.5) * 1.4;
  return {
    lat: Number((-15.6 + offsetLat).toFixed(4)),
    lng: Number((-56.1 + offsetLng).toFixed(4)),
  };
}

function loadLocalCustomCommunities(): CommunityNode[] {
  try {
    const raw = localStorage.getItem(LOCAL_COMMUNITIES_KEY);
    return raw ? (JSON.parse(raw) as CommunityNode[]) : [];
  } catch {
    return [];
  }
}

function saveLocalCustomCommunities(items: CommunityNode[]): void {
  try {
    localStorage.setItem(LOCAL_COMMUNITIES_KEY, JSON.stringify(items));
  } catch {
    // ignore quota errors
  }
}

function mergeCommunities(customList: CommunityNode[]): CommunityNode[] {
  const map = new Map<string, CommunityNode>();
  for (const c of CURATED_COMMUNITIES) map.set(c.id, c);
  for (const c of customList) map.set(c.id, c);
  return Array.from(map.values());
}

export function getSyncCommunities(): CommunityNode[] {
  return mergeCommunities(loadLocalCustomCommunities());
}

export async function loadAllCommunities(): Promise<CommunityNode[]> {
  const local = loadLocalCustomCommunities();
  const db = getFirestoreClient();
  if (!db) return mergeCommunities(local);

  try {
    await ensureCommunitiesAuth();
    const snap = await getDocs(collection(db, 'communities'));
    const remote = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<CommunityNode, 'id'>),
    }));

    const unsynced = local.filter((l) => !remote.some((r) => r.id === l.id));
    if (unsynced.length > 0) {
      await Promise.all(
        unsynced.map((node) =>
          setDoc(doc(db, 'communities', node.id), { ...node, status: 'published' }).catch(
            () => undefined
          )
        )
      );
    }

    return mergeCommunities([...remote, ...unsynced]);
  } catch {
    return mergeCommunities(local);
  }
}

export async function createCustomCommunity(input: CreateCommunityInput): Promise<CommunityNode> {
  const cleanTitle = input.titulo.trim();
  if (!cleanTitle) {
    throw new Error('Informe o nome do território ou comunidade.');
  }

  const slug = cleanTitle
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const id = `custom-${slug || 'territorio'}-${Date.now().toString(36)}`;
  const meta = GRUPO_META[input.grupoId];
  const alunos = input.equipeAlunos
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const node: CommunityNode = {
    id,
    titulo: cleanTitle,
    subtitulo: `${input.bioma} · ${input.municipio.trim()} (${input.regiaoMT.trim() || 'Mato Grosso'})`,
    grupoId: input.grupoId,
    grupoNome: meta.nome,
    grupoCor: meta.cor,
    bioma: input.bioma,
    municipio: input.municipio.trim() || 'Cuiabá',
    regiaoMT: input.regiaoMT.trim() || 'Mato Grosso',
    coordenadas: resolveCoordinates(input.municipio),
    equipeAlunos: alunos.length > 0 ? alunos : ['Equipe EE CM João Ribeiro Vilela'],
    orientador: input.orientador.trim() || 'Docente EE CM João Ribeiro Vilela',
    escola: 'EE CM João Ribeiro Vilela',
    serie: input.serie.trim() || '9º Ano',
    especiesCientificas: [
      {
        nomePopular: input.bioma === 'Pantanal' ? 'Tuiuiú / Águas Pantaneiras' : 'Buriti / Peixe-boi ou Fauna Local',
        nomeCientificoLatim: input.bioma === 'Pantanal' ? 'Jabiru mycteria' : 'Mauritia flexuosa',
        familia: input.bioma === 'Pantanal' ? 'Ciconiidae' : 'Arecaceae',
        papelEcologico: `Bioindicador da saúde ambiental em ${input.municipio.trim()} (${input.bioma}).`,
      },
    ],
    pontosInfograficoPT: [],
    narracaoModoHistoria: `Em ${input.municipio.trim()}, a comunidade ${cleanTitle} mostra na prática por que a Justiça Climática protege quem cuida do ${input.bioma}. ${input.quemSofreImpacto.trim()} Hoje, jovens e moradores respondem com ações concretas: ${input.solucoesComunitarias.trim()}.`,
    justicaClimaticaExplicacao: {
      quemSofreImpacto: input.quemSofreImpacto.trim(),
      causaDoProblema: input.causaDoProblema.trim(),
      porQueEInjusto: `Quem preserva a biodiversidade do ${input.bioma} em ${input.municipio.trim()} sente os extremos do clima primeiro, mesmo contribuindo menos para o aquecimento global.`,
      oQueEstaSendoFeito: input.solucoesComunitarias.trim(),
    },
    unidadeConservacaoRelacionada: {
      nome: `Território Protegido e Nascentes de ${input.municipio.trim()}`,
      categoriaSNUC: 'Uso Sustentável / Território Tradicional',
      explicacaoEF09CI12: 'Áreas de proteção comunitária garantem recarga hídrica, corredores ecológicos e soberania alimentar.',
    },
    focoTematico: `Território estudado pela turma ${input.serie.trim() || '9º Ano'} na Mostra EE CM João Ribeiro Vilela`,
    conceitosChave: ['Justiça Climática', input.bioma, 'Saberes Locais', 'Biodiversidade'],
    habilidadesBNCC: [
      {
        codigo: 'EF09CI12',
        titulo: 'Conservação da Biodiversidade e Unidades de Conservação',
        descricao: 'Relacionar a preservação de territórios locais à proteção de espécies e águas em Mato Grosso.',
      },
    ],
    fontesPesquisa: ['Pesquisa Estudantil · EE CM João Ribeiro Vilela', 'MapBiomas / INPE'],
    infografico: {
      url: '',
      titulo: `Painel da Comunidade ${cleanTitle}`,
      legenda: input.solucoesComunitarias.trim(),
      autor: alunos.join(', ') || 'Estudantes EE CM João Ribeiro Vilela',
      formato: 'imagem',
    },
    videoEquipe: {
      url: '',
      titulo: `Vozes de ${cleanTitle}`,
      duracao: '1-3 min',
      descricao: input.solucoesComunitarias.trim(),
      roteiroResumo: input.quemSofreImpacto.trim(),
    },
    resumoCientifico: {
      introducao: `${cleanTitle} fica em ${input.municipio.trim()} (${input.bioma}) e integra a Mostra Científica da EE CM João Ribeiro Vilela.`,
      diagnosticoEcologico: input.causaDoProblema.trim(),
      ameacasImpactos: input.quemSofreImpacto.trim(),
      solucoesComunitarias: input.solucoesComunitarias.trim(),
      conclusaoEstudantil: 'Valorizar as comunidades locais é essencial para enfrentar a crise climática com justiça.',
    },
    diarioDeBordo: {
      dataRegistro: new Date().toLocaleDateString('pt-BR'),
      depoimentoOuVoz: input.solucoesComunitarias.trim(),
      autorVoz: alunos.join(', ') || 'Estudantes Pesquisadores',
      cargoOuFuncao: `Equipe ${input.serie.trim() || '9º Ano'} · ${input.orientador.trim() || 'Docente'}`,
      observacoesCampo: `Registrado no território ${cleanTitle} (${input.municipio.trim()}).`,
    },
    metricas: [
      { rotulo: 'Bioma', valor: input.bioma, detalhe: input.municipio.trim(), icone: 'arvore' },
      { rotulo: 'Turma', valor: input.serie.trim() || '9º Ano', detalhe: 'EE CM João Ribeiro Vilela', icone: 'comunidade' },
    ],
    acoesPropostas: [input.solucoesComunitarias.trim()],
  };

  const nextLocal = [node, ...loadLocalCustomCommunities()];
  saveLocalCustomCommunities(nextLocal);

  const db = getFirestoreClient();
  if (db) {
    await ensureCommunitiesAuth();
    await setDoc(doc(db, 'communities', id), { ...node, status: 'published' }).catch(() => undefined);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(COMMUNITIES_UPDATED_EVENT));
  }
  return node;
}

