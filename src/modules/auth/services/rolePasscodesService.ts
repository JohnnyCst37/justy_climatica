import type { AuthorizedEmailRole, VisitorCategory } from '../../../shared/types/domain';

export interface RolePasscodeGroup {
  roleKey: 'diretor' | 'coordenador' | 'professor' | 'dre' | 'cobertura';
  label: string;
  description: string;
  codes: string[];
}

export const MASTER_ADMIN_PASSCODE = 'ADMIN-JOHNNY-2026';

export const ROLE_PASSCODES: Record<'diretor' | 'coordenador' | 'professor' | 'dre' | 'cobertura', string[]> = {
  diretor: ['DIR-VILELA-2026'],
  coordenador: ['COORD-01-JRV', 'COORD-02-JRV', 'COORD-03-JRV'],
  dre: ['DRE-MT-2026', 'DRE-SEDUC-19'],
  cobertura: ['LIVE-01-JRV', 'LIVE-02-JRV'],
  professor: [
    'PROF-01-JRV',
    'PROF-02-JRV',
    'PROF-03-JRV',
    'PROF-04-JRV',
    'PROF-05-JRV',
    'PROF-06-JRV',
    'PROF-07-JRV',
    'PROF-08-JRV',
    'PROF-09-JRV',
    'PROF-10-JRV',
    'PROF-11-JRV',
    'PROF-12-JRV',
  ],
};

export const ROLE_PASSCODE_GROUPS: RolePasscodeGroup[] = [
  {
    roleKey: 'diretor',
    label: 'Diretor(a) (1 senha)',
    description: 'Uso exclusivo da Direção da EE CM João Ribeiro Vilela',
    codes: ROLE_PASSCODES.diretor,
  },
  {
    roleKey: 'coordenador',
    label: 'Coordenadores(as) (3 senhas)',
    description: 'Para a Coordenação Pedagógica acompanhar e publicar na Mostra',
    codes: ROLE_PASSCODES.coordenador,
  },
  {
    roleKey: 'dre',
    label: 'Representantes da DRE (2 senhas)',
    description: 'Para identificação oficial dos técnicos e visitantes da DRE na Jornada',
    codes: ROLE_PASSCODES.dre,
  },
  {
    roleKey: 'cobertura',
    label: 'Equipe de Cobertura / Galeria Live (2 senhas)',
    description: 'Libera gravação de vídeos ao vivo, fotos com carimbo do evento e cobertura em /cobertura',
    codes: ROLE_PASSCODES.cobertura,
  },
  {
    roleKey: 'professor',
    label: 'Professores(as) (12 senhas)',
    description: 'Compartilhe 1 código por docente para liberar acesso e painel /enviar',
    codes: ROLE_PASSCODES.professor,
  },
];

function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}

export function requiresRolePasscode(category: VisitorCategory): boolean {
  return (
    category === 'professor' ||
    category === 'coordenador' ||
    category === 'diretor' ||
    category === 'dre'
  );
}

export function validateRolePasscode(category: VisitorCategory, inputCode: string): boolean {
  if (!requiresRolePasscode(category)) return true;
  const clean = normalizeCode(inputCode);
  if (!clean) return false;
  if (clean === MASTER_ADMIN_PASSCODE) return true;
  const allowed = ROLE_PASSCODES[category];
  return allowed.includes(clean);
}

export function resolveStaffRoleByPasscode(inputCode: string): AuthorizedEmailRole | null {
  const clean = normalizeCode(inputCode);
  if (!clean) return null;
  if (clean === MASTER_ADMIN_PASSCODE) return 'super_admin';
  if (ROLE_PASSCODES.diretor.includes(clean)) return 'diretor';
  if (ROLE_PASSCODES.coordenador.includes(clean)) return 'coordenador';
  if (ROLE_PASSCODES.cobertura.includes(clean)) return 'cobertura';
  if (ROLE_PASSCODES.professor.includes(clean)) return 'professor';
  return null;
}
