import type { BiomePaletteKey, CommunityNode, ThemeSessionKey } from '../types/domain';

export interface BiomePaletteTheme {
  key: BiomePaletteKey;
  label: string;
  pageBg: string;
  headerBg: string;
  cardBg: string;
  cardBorder: string;
  accentBg: string;
  accentText: string;
  badgeBg: string;
  badgeText: string;
  highlightBg: string;
  highlightText: string;
  soundPreset: 'cerrado' | 'amazonia' | 'pantanal' | 'buritis';
}

export const BIOME_PALETTES: Record<BiomePaletteKey, BiomePaletteTheme> = {
  cerrado: {
    key: 'cerrado',
    label: 'Cerrado · Tons Pastéis de Areia e Sol',
    pageBg: 'bg-[#fbf7ef]',
    headerBg: 'bg-[#f5ebd9]',
    cardBg: 'bg-white/95',
    cardBorder: 'border-amber-200/80',
    accentBg: 'bg-amber-700 hover:bg-amber-600',
    accentText: 'text-amber-900',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    highlightBg: 'bg-[#fef3c7]',
    highlightText: 'text-amber-950',
    soundPreset: 'cerrado',
  },
  amazonia: {
    key: 'amazonia',
    label: 'Amazônia · Mata Fechada & Floresta Viva',
    pageBg: 'bg-[#edf5f0]',
    headerBg: 'bg-[#dcece3]',
    cardBg: 'bg-white/95',
    cardBorder: 'border-emerald-900/20',
    accentBg: 'bg-[#064e3b] hover:bg-[#065f46]',
    accentText: 'text-[#064e3b]',
    badgeBg: 'bg-emerald-900/10',
    badgeText: 'text-[#064e3b]',
    highlightBg: 'bg-[#d1fae5]',
    highlightText: 'text-emerald-950',
    soundPreset: 'amazonia',
  },
  pantanal: {
    key: 'pantanal',
    label: 'Pantanal · Planície Alagada & Águas',
    pageBg: 'bg-[#eef6fb]',
    headerBg: 'bg-[#dbeaf5]',
    cardBg: 'bg-white/95',
    cardBorder: 'border-sky-200/90',
    accentBg: 'bg-sky-800 hover:bg-sky-700',
    accentText: 'text-sky-900',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-900',
    highlightBg: 'bg-[#dbeafe]',
    highlightText: 'text-sky-950',
    soundPreset: 'pantanal',
  },
  buritis: {
    key: 'buritis',
    label: 'Veredas de Buritis · Olhos d’Água',
    pageBg: 'bg-[#f3f7ec]',
    headerBg: 'bg-[#e3edd4]',
    cardBg: 'bg-white/95',
    cardBorder: 'border-lime-800/20',
    accentBg: 'bg-lime-800 hover:bg-lime-700',
    accentText: 'text-lime-900',
    badgeBg: 'bg-lime-100',
    badgeText: 'text-lime-900',
    highlightBg: 'bg-[#ecfccb]',
    highlightText: 'text-lime-950',
    soundPreset: 'buritis',
  },
};

export function resolveBiomePalette(
  community: CommunityNode | null,
  themeKey: ThemeSessionKey
): BiomePaletteTheme {
  if (!community) return BIOME_PALETTES.cerrado;
  const text = `${community.id} ${community.titulo} ${community.bioma}`.toLowerCase();
  if (text.includes('pantanal') || text.includes('ribeirinho') || text.includes('cuiabá')) {
    return BIOME_PALETTES.pantanal;
  }
  if (text.includes('amazônia') || text.includes('xavante') || text.includes('indígena')) {
    return BIOME_PALETTES.amazonia;
  }
  if (themeKey === 'biodiversidade' || text.includes('buriti') || text.includes('raizeira')) {
    return BIOME_PALETTES.buritis;
  }
  return BIOME_PALETTES.cerrado;
}

