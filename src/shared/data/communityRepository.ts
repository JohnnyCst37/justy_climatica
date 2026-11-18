import { COMMUNITIES_PART_1 } from './communitiesPart1';
import { COMMUNITIES_PART_2 } from './communitiesPart2';
import { COMMUNITIES_PART_3 } from './communitiesPart3';
import type { CommunityNode } from '../types/domain';

export {
  EIXOS_TEMATICOS,
  LINHA_DO_TEMPO_CLIMATICA_MT,
  FONTES_CONFIAVEIS_PESQUISA,
} from './climateMetadata';

export const CURATED_COMMUNITIES: CommunityNode[] = [
  ...COMMUNITIES_PART_1,
  ...COMMUNITIES_PART_2,
  ...COMMUNITIES_PART_3,
];
