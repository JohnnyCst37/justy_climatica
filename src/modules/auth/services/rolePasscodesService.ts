import { signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  getFirebaseAuthClient,
  getFirestoreClient,
} from '../../../shared/config/firebaseClient';
import type { AuthorizedEmailRole, VisitorCategory } from '../../../shared/types/domain';

export interface NominalCodeItem {
  code: string;
  ownerLabel: string;
  role: AuthorizedEmailRole | 'dre';
}

export interface RolePasscodeGroup {
  roleKey: string;
  label: string;
  description: string;
  codes: string[];
  items: NominalCodeItem[];
}

export const MASTER_ADMIN_PASSCODE = 'admin-johnny-2026';
const EXTRA_PROF_CODES_KEY = 'justy_extra_professor_passcodes_v1';

const RAW_GROUPS: Array<{
  roleKey: string;
  label: string;
  description: string;
  items: NominalCodeItem[];
}> = [
  {
    roleKey: 'direcao',
    label: 'Direção & Secretaria (EE CM João Ribeiro Vilela)',
    description: 'Senhas nominais exclusivas da Diretora Samantha e Secretária Denise',
    items: [
      { code: 'samanthajrv26', ownerLabel: 'Diretora Samantha', role: 'diretor' },
      { code: 'denisejrv26', ownerLabel: 'Secretária Denise', role: 'coordenador' },
      { code: 'dir-vilela-2026', ownerLabel: 'Direção (Reserva)', role: 'diretor' },
      { code: 'coord-01-jrv', ownerLabel: 'Coordenação 01', role: 'coordenador' },
      { code: 'coord-02-jrv', ownerLabel: 'Coordenação 02', role: 'coordenador' },
    ],
  },
  {
    roleKey: 'sala10',
    label: '#2 Justiça Climática · Sala 10 (Nossa Sala)',
    description: 'Senhas nominais dos docentes da Sala 10 — 2jc + nome + 10',
    items: [
      { code: '2jcjohnny10', ownerLabel: 'Johnny Fernandes (Super Admin)', role: 'super_admin' },
      { code: '2jckamila10', ownerLabel: 'Prof.ª Kamila', role: 'professor' },
      { code: '2jcodineia10', ownerLabel: 'Prof.ª Odinéia', role: 'professor' },
      { code: '2jccarla10', ownerLabel: 'Prof.ª Carla', role: 'professor' },
      { code: '2jcluciana10', ownerLabel: 'Prof.ª Luciana', role: 'professor' },
      { code: '2jcgelizane10', ownerLabel: 'Prof.ª Gelizane', role: 'professor' },
      { code: '2jcandreia10', ownerLabel: 'Prof.ª Andreia', role: 'professor' },
    ],
  },
  {
    roleKey: 'sala11',
    label: '#1 Mulheres que fazem a diferença em MT · Sala 11',
    description: 'Docente responsável no cartaz da 2ª Mostra Cultural',
    items: [{ code: '1mmedna11', ownerLabel: 'Prof.ª Edna Barbosa', role: 'professor' }],
  },
  {
    roleKey: 'sala06',
    label: '#3 Nossa voz, nossa força · Sala 06',
    description: 'Docentes do Trabalho #3 no cartaz oficial',
    items: [
      { code: '3nvcamila06', ownerLabel: 'Prof.ª Camila Stula', role: 'professor' },
      { code: '3nvelizane06', ownerLabel: 'Prof.ª Elizane', role: 'professor' },
      { code: '3nvbruna06', ownerLabel: 'Prof.ª Bruna', role: 'professor' },
      { code: '3nvregiane06', ownerLabel: 'Prof.ª Regiane', role: 'professor' },
      { code: '3nvveronica06', ownerLabel: 'Prof.ª Veronica', role: 'professor' },
    ],
  },
  {
    roleKey: 'sala08',
    label: '#4 Bullying e Saúde mental · Sala 08',
    description: 'Docentes do Trabalho #4 no cartaz oficial',
    items: [
      { code: '4bsmarlene08', ownerLabel: 'Prof.ª Marlene', role: 'professor' },
      { code: '4bsodineia08', ownerLabel: 'Prof.ª Odinéia', role: 'professor' },
      { code: '4bsjosiane08', ownerLabel: 'Prof.ª Josiane', role: 'professor' },
      { code: '4bsanapaula08', ownerLabel: 'Prof.ª Ana Paula', role: 'professor' },
      { code: '4bsjany08', ownerLabel: 'Prof.ª Jany', role: 'professor' },
      { code: '4bsraquel08', ownerLabel: 'Prof.ª Raquel', role: 'professor' },
      { code: '4bscarin08', ownerLabel: 'Prof.ª Carin', role: 'professor' },
      { code: '4bsmarciele08', ownerLabel: 'Prof.ª Marciele', role: 'professor' },
      { code: '4bslucilene08', ownerLabel: 'Prof.ª Lucilene', role: 'professor' },
    ],
  },
  {
    roleKey: 'sala09',
    label: '#5 Violência contra mulher · Sala 09',
    description: 'Docentes do Trabalho #5 no cartaz oficial',
    items: [
      { code: '5vmlorena09', ownerLabel: 'Prof.ª Lorena', role: 'professor' },
      { code: '5vmmonica09', ownerLabel: 'Prof.ª Mônica', role: 'professor' },
      { code: '5vmjosiane09', ownerLabel: 'Prof.ª Josiane', role: 'professor' },
      { code: '5vmvaldineire09', ownerLabel: 'Prof.ª Valdineire', role: 'professor' },
      { code: '5vmedson09', ownerLabel: 'Prof. Edson', role: 'professor' },
    ],
  },
  {
    roleKey: 'sala07',
    label: '#6 Amazônia em Nós – Sistema Prisional · Sala 07',
    description: 'Docentes do Trabalho #6 no cartaz oficial',
    items: [
      { code: '6anhayume07', ownerLabel: 'Prof.ª Hayume', role: 'professor' },
      { code: '6ankessia07', ownerLabel: 'Prof.ª Késsia', role: 'professor' },
      { code: '6ansamyra07', ownerLabel: 'Prof.ª Samyra', role: 'professor' },
      { code: '6anvander07', ownerLabel: 'Prof. Vander', role: 'professor' },
      { code: '6anraquel07', ownerLabel: 'Prof.ª Raquel', role: 'professor' },
      { code: '6anadenilza07', ownerLabel: 'Prof.ª Adenilza', role: 'professor' },
      { code: '6andandara07', ownerLabel: 'Prof.ª Dandara', role: 'professor' },
    ],
  },
  {
    roleKey: 'oficina',
    label: 'Oficina de Takedown',
    description: 'Responsável pela oficina no cartaz oficial',
    items: [{ code: 'takedownthiago26', ownerLabel: 'Prof. Thiago', role: 'professor' }],
  },
  {
    roleKey: 'cobertura',
    label: 'Repórter / Cobertura Live (/cobertura)',
    description: 'Libera câmera ao vivo e fotos com carimbo para /galeria',
    items: [
      { code: 'reporterjrv01', ownerLabel: 'Repórter 01', role: 'cobertura' },
      { code: 'reporterjrv02', ownerLabel: 'Repórter 02', role: 'cobertura' },
      { code: 'live-01-jrv', ownerLabel: 'Live Backup 01', role: 'cobertura' },
      { code: 'live-02-jrv', ownerLabel: 'Live Backup 02', role: 'cobertura' },
    ],
  },
  {
    roleKey: 'cinema',
    label: 'Monitores Sala de Cinema (/cinema)',
    description: 'Para os 2 alunos criarem sessões coletivas de vídeo + quiz com IA',
    items: [
      { code: 'cinealuno01', ownerLabel: 'Aluno(a) Monitor 01', role: 'cinema' },
      { code: 'cinealuno02', ownerLabel: 'Aluno(a) Monitor 02', role: 'cinema' },
      { code: 'cine-10-jrv', ownerLabel: 'Monitoria Cinema', role: 'cinema' },
    ],
  },
  {
    roleKey: 'dre',
    label: 'Representantes da DRE / Gestão Educacional',
    description: 'Identificação opcional caso gestor prefira usar código',
    items: [
      { code: 'dremt26', ownerLabel: 'Gestão DRE-MT', role: 'dre' },
      { code: 'dre-mt-2026', ownerLabel: 'Técnico(a) DRE', role: 'dre' },
    ],
  },
];

const LEGACY_PROF_CODES = Array.from(
  { length: 12 },
  (_, i) => `prof-${String(i + 1).padStart(2, '0')}-jrv`
);

export const ROLE_PASSCODE_GROUPS: RolePasscodeGroup[] = RAW_GROUPS.map((g) => ({
  ...g,
  codes: g.items.map((item) => item.code),
}));

const NOMINAL_INDEX = new Map<string, NominalCodeItem>();
for (const group of RAW_GROUPS) {
  for (const item of group.items) {
    NOMINAL_INDEX.set(item.code.toLowerCase(), item);
  }
}

export function normalizePasscode(code: string): string {
  return code.trim().toLowerCase();
}

export function loadExtraProfessorPasscodes(): string[] {
  try {
    const raw = localStorage.getItem(EXTRA_PROF_CODES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string' && item.length > 0)
      : [];
  } catch {
    return [];
  }
}

function saveExtraProfessorPasscodes(codes: string[]): void {
  try {
    localStorage.setItem(EXTRA_PROF_CODES_KEY, JSON.stringify(codes));
  } catch {
    // ignore storage quota errors
  }
}

async function ensureBatchAuth(): Promise<void> {
  const auth = getFirebaseAuthClient();
  if (auth && !auth.currentUser) {
    await signInAnonymously(auth).catch(() => undefined);
  }
}

export async function syncExtraProfessorPasscodesFromFirestore(): Promise<string[]> {
  const local = loadExtraProfessorPasscodes();
  const db = getFirestoreClient();
  if (!db) return local;
  try {
    await ensureBatchAuth();
    const snap = await getDoc(doc(db, 'role_passcode_batches', 'professor_batches'));
    if (!snap.exists()) return local;
    const remote = (snap.data()?.codes as string[] | undefined) || [];
    const merged = Array.from(new Set([...local, ...remote.map(normalizePasscode)]));
    saveExtraProfessorPasscodes(merged);
    return merged;
  } catch {
    return local;
  }
}

export async function generateNextProfessorPasscodeBatch(actorEmail: string): Promise<string[]> {
  const current = await syncExtraProfessorPasscodesFromFirestore();
  const startNumber = 101 + current.length;
  const newBatch = Array.from({ length: 10 }, (_, idx) => `profjrv${startNumber + idx}`);
  const merged = Array.from(new Set([...current, ...newBatch]));
  saveExtraProfessorPasscodes(merged);

  const db = getFirestoreClient();
  if (db) {
    await ensureBatchAuth();
    await setDoc(
      doc(db, 'role_passcode_batches', 'professor_batches'),
      {
        codes: merged,
        updatedBy: actorEmail || 'super_admin',
        updatedAt: Date.now(),
      },
      { merge: true }
    ).catch(() => undefined);
  }
  return merged;
}

export function resolveNominalOwnerByPasscode(inputCode: string): string | null {
  const clean = normalizePasscode(inputCode);
  const match = NOMINAL_INDEX.get(clean);
  if (match) return match.ownerLabel;
  if (loadExtraProfessorPasscodes().includes(clean)) return 'Docente (Lote Extra)';
  return null;
}

export function requiresRolePasscode(category: VisitorCategory): boolean {
  void category;
  return false;
}

export function validateRolePasscode(category: VisitorCategory, inputCode: string): boolean {
  const clean = normalizePasscode(inputCode);
  if (!clean) return false;
  if (clean === MASTER_ADMIN_PASSCODE || clean === '2jcjohnny10') return true;
  if (category === 'estudante' || category === 'outro') return true;
  const match = NOMINAL_INDEX.get(clean);
  if (match) {
    if (category === 'dre') return match.role === 'dre';
    if (category === 'diretor') return match.role === 'diretor';
    if (category === 'coordenador') return match.role === 'coordenador';
    return match.role === 'professor' || match.role === 'super_admin';
  }
  return LEGACY_PROF_CODES.includes(clean) || loadExtraProfessorPasscodes().includes(clean);
}

export function resolveStaffRoleByPasscode(inputCode: string): AuthorizedEmailRole | null {
  const clean = normalizePasscode(inputCode);
  if (!clean) return null;
  if (clean === MASTER_ADMIN_PASSCODE || clean === '2jcjohnny10') return 'super_admin';

  const match = NOMINAL_INDEX.get(clean);
  if (match && match.role !== 'dre') {
    return match.role;
  }
  if (LEGACY_PROF_CODES.includes(clean) || loadExtraProfessorPasscodes().includes(clean)) {
    return 'professor';
  }
  return null;
}
