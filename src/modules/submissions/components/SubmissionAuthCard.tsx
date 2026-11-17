import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  KeyRound,
  MailCheck,
  ShieldAlert,
  UserPlus,
} from 'lucide-react';
import type { AuthorizedEmailRole, UserProfile } from '../../../shared/types/domain';
import {
  ROLE_LABELS,
  SCHOOL_CLASS_OPTIONS,
  SCHOOL_GRADE_GROUPS,
  mergeClassSelection,
} from '../../auth/services/accessControlService';

interface SubmissionAuthCardProps {
  user: UserProfile | null;
  authError: string | null;
  hasAccess: boolean;
  onEnterWithPasscode: (input: {
    name: string;
    disciplineOrClasses: string;
    passcode: string;
  }) => Promise<unknown>;
  onEnterWithEmail: (email: string) => Promise<unknown>;
  onEnterWithGoogle: () => Promise<unknown>;
  onSubmitAccessRequest: (input: {
    email: string;
    name: string;
    role: AuthorizedEmailRole;
    classGroup?: string;
  }) => Promise<unknown>;
  onRefreshApproval: () => Promise<unknown>;
  onLogout: () => Promise<void>;
}

export const SubmissionAuthCard: React.FC<SubmissionAuthCardProps> = ({
  user,
  authError,
  hasAccess,
  onEnterWithPasscode,
  onEnterWithEmail,
  onEnterWithGoogle,
  onSubmitAccessRequest,
  onRefreshApproval,
  onLogout,
}) => {
  const [authMode, setAuthMode] = useState<'passcode' | 'login' | 'register'>('passcode');
  const [staffName, setStaffName] = useState('');
  const [staffDiscipline, setStaffDiscipline] = useState('');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<AuthorizedEmailRole>('professor');
  const [regClassGroup, setRegClassGroup] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.email && !hasAccess && !user.pendingApproval && !user.email.endsWith('@codigo.escola')) {
      setRegName(user.nickname || '');
      setRegEmail(user.email);
      setAuthMode('register');
    }
  }, [user?.email, user?.nickname, user?.pendingApproval, hasAccess]);

  const roleBadge =
    user && user.role in ROLE_LABELS
      ? ROLE_LABELS[user.role as AuthorizedEmailRole]
      : user?.role || '';

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcodeInput.trim()) return;
    setSubmitting(true);
    try {
      await onEnterWithPasscode({
        name: staffName,
        disciplineOrClasses: staffDiscipline,
        passcode: passcodeInput,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAuthorizedLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubmitting(true);
    try {
      await onEnterWithEmail(emailInput);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmitAccessRequest({
        name: regName,
        email: regEmail,
        role: regRole,
        classGroup: regClassGroup,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-lg mx-auto p-4 sm:p-8 mt-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        {user?.pendingApproval ? (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Clock size={24} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Cadastro recebido! Aguardando aprovação
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                <strong>{user.nickname}</strong> ({user.email}) · Perfil: <strong>{roleBadge}</strong>
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Assim que o Super Admin ou a Coordenação clicar em <strong>Aprovar</strong>, toque no botão abaixo para entrar.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void onRefreshApproval()}
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-bold flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} /> Já fui aprovado — Entrar Agora
            </button>
            <button
              type="button"
              onClick={() => void onLogout()}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Trocar de conta ou e-mail
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 text-emerald-900">
              <div className="p-3 rounded-2xl bg-emerald-100">
                <ShieldAlert size={22} />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Acesso da Equipe Escolar & Alunos Líderes
                </h2>
                <p className="text-xs text-slate-600">
                  Use a senha do seu cargo (sem Google), entre com e-mail aprovado ou cadastre-se.
                </p>
              </div>
            </div>

            {user && !user.email && (
              <div className="text-xs text-amber-950 bg-amber-50 border border-amber-200 rounded-2xl p-3">
                Você está conectado como visitante (<strong>{user.nickname}</strong>). Use sua senha de cargo ou conta autorizada para enviar trabalhos.
              </div>
            )}

            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setAuthMode('passcode')}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-bold ${
                  authMode === 'passcode' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Senha do Cargo
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-bold ${
                  authMode === 'login' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                E-mail Aprovado
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-bold ${
                  authMode === 'register' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                1º Acesso
              </button>
            </div>

            {authMode === 'passcode' && (
              <form onSubmit={handlePasscodeSubmit} className="space-y-3">
                <input
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="Seu nome (ex: Prof.ª Ana Paula)"
                  required
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                />
                <input
                  value={staffDiscipline}
                  onChange={(e) => setStaffDiscipline(e.target.value)}
                  placeholder="Disciplina ou Turmas (ex: Ciências · 6º ao 9º)"
                  required
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                />
                <input
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Senha do perfil (ex: PROF-01-JRV)"
                  required
                  className="w-full px-3.5 py-2 text-xs border border-emerald-400 bg-emerald-50/30 rounded-xl font-mono"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-extrabold flex items-center justify-center gap-2"
                >
                  <KeyRound size={15} />
                  {submitting ? 'Validando senha...' : 'Entrar com Senha de Cargo'}
                </button>
              </form>
            )}

            {authMode === 'login' && (
              <form onSubmit={handleAuthorizedLogin} className="space-y-2.5">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Seu e-mail já aprovado"
                  required
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  <MailCheck size={15} /> {submitting ? 'Verificando...' : 'Entrar com E-mail Aprovado'}
                </button>
                <p className="text-[11px] text-slate-500 text-center">
                  Super Admin (fernandesjohnnys@gmail.com) e e-mails aprovados entram direto aqui.
                </p>
              </form>
            )}

            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <input
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="Seu e-mail Google / escolar"
                  required
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as AuthorizedEmailRole)}
                    className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-bold"
                  >
                    <option value="professor">Professor(a)</option>
                    <option value="coordenador">Coordenador(a)</option>
                    <option value="diretor">Diretor(a)</option>
                    <option value="lider">Aluno(a) Líder de Grupo</option>
                  </select>
                  <input
                    list="register-turmas"
                    value={regClassGroup}
                    onChange={(e) => setRegClassGroup(e.target.value)}
                    placeholder={
                      regRole === 'lider'
                        ? 'Sua Turma (ex: 6º Ano A .. 9º Ano D)'
                        : 'Turmas (opcional, 6º ao 9º)'
                    }
                    className="px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <datalist id="register-turmas">
                  {SCHOOL_CLASS_OPTIONS.map((turma) => (
                    <option key={turma} value={turma} />
                  ))}
                </datalist>
                {regRole !== 'lider' && (
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-500 mr-1">
                      Atalhos (6º ao 9º):
                    </span>
                    {SCHOOL_GRADE_GROUPS.map((grp) => (
                      <button
                        key={grp.label}
                        type="button"
                        onClick={() =>
                          setRegClassGroup((prev) => mergeClassSelection(prev, grp.value))
                        }
                        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 text-[10px] font-bold transition"
                      >
                        {grp.label}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-extrabold flex items-center justify-center gap-2"
                >
                  <UserPlus size={15} />{' '}
                  {submitting ? 'Enviando...' : 'Concluir Cadastro e Solicitar Aprovação'}
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => void onEnterWithGoogle()}
              className="w-full py-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-2"
            >
              <KeyRound size={14} /> Ou entrar com Conta Google
            </button>
          </>
        )}

        {authError && (
          <div className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">
            {authError}
          </div>
        )}
      </div>
    </main>
  );
};
