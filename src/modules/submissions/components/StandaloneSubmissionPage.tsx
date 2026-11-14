import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, Check, CheckCircle2, Clock, KeyRound, LogOut, MailCheck,
  MapPinPlus, School, Share2, Shield, ShieldAlert, UserPlus, Users,
} from 'lucide-react';
import type { AuthorizedEmailRole, CommunityNode } from '../../../shared/types/domain';
import { useCommunitiesList } from '../../../shared/hooks/useCommunitiesList';
import { useAuthSession } from '../../auth/hooks/useAuthSession';
import {
  ROLE_LABELS,
  canAccessSubmissionPortal,
  isStaffRole,
} from '../../auth/services/accessControlService';
import { StaffEmailManagerModal } from '../../auth/components/StaffEmailManagerModal';
import { useSchoolWorks } from '../hooks/useSchoolWorks';
import { SubmitWorkForm } from './SubmitWorkForm';
import { SchoolWorksGallery } from './SchoolWorksGallery';
import { CreateCommunityModal } from './CreateCommunityModal';

export const StandaloneSubmissionPage: React.FC = () => {
  const { communities, addCommunity } = useCommunitiesList();
  const [selectedId, setSelectedId] = useState(communities[0]?.id || '');
  const [emailInput, setEmailInput] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<AuthorizedEmailRole>('professor');
  const [regClassGroup, setRegClassGroup] = useState('');
  const [submittingAuth, setSubmittingAuth] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [emailManagerOpen, setEmailManagerOpen] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const {
    user, authError, enterWithAuthorizedEmail, enterWithGoogle,
    submitAccessRequest, refreshApprovalStatus, logout,
  } = useAuthSession();

  const hasAccess = canAccessSubmissionPortal(user);
  const isStaff = isStaffRole(user?.role);

  useEffect(() => {
    if (user?.email && !hasAccess && !user.pendingApproval) {
      setRegName(user.nickname || '');
      setRegEmail(user.email);
      setAuthMode('register');
    }
  }, [user?.email, user?.nickname, user?.pendingApproval, hasAccess]);

  const community = useMemo(
    () => communities.find((c) => c.id === selectedId) || communities[0],
    [communities, selectedId]
  );

  const { works, submitWork, approveWork } = useSchoolWorks(community, hasAccess ? user : null);

  const handleAuthorizedLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubmittingAuth(true);
    try {
      await enterWithAuthorizedEmail(emailInput);
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAuth(true);
    try {
      await submitAccessRequest({
        name: regName, email: regEmail, role: regRole, classGroup: regClassGroup,
      });
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleCopyTeachersInvite = async () => {
    const portalUrl = `${window.location.origin}/enviar`;
    const msg = [
      '*Mostra Jornada da Justiça Climática (19/11) · EE CM João Ribeiro Vilela*',
      'Professores(as), o portal de envio de vídeos, fotos, slides e novos territórios já está no ar:',
      portalUrl,
      'Clique em *"Entrar ou Cadastrar-se com Google"*, selecione *"Professor(a)"* e peça aprovação — eu libero seu acesso em 1 clique por aqui!',
    ].join('\n');
    await navigator.clipboard?.writeText(msg).catch(() => undefined);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 3200);
  };

  const handleCommunityCreated = (created: CommunityNode) => setSelectedId(created.id);
  const roleBadge = user && user.role in ROLE_LABELS ? ROLE_LABELS[user.role as AuthorizedEmailRole] : user?.role || '';

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-slate-900">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between gap-3 sticky top-0 z-20 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <a href="/" className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 shrink-0" title="Voltar para a Mostra">
            <ArrowLeft size={16} />
          </a>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-800 flex items-center gap-1">
              <School size={12} /> Área Restrita · Professores, Coordenação & Alunos Líderes
            </span>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
              Envio de Vídeos, Fotos & Territórios · EE CM João Ribeiro Vilela
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {hasAccess && isStaff && (
            <>
              <button
                type="button"
                onClick={() => void handleCopyTeachersInvite()}
                className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 text-xs font-extrabold flex items-center gap-1.5"
              >
                {copiedInvite ? <Check size={14} className="text-emerald-700" /> : <Share2 size={14} />}
                <span>{copiedInvite ? 'Texto copiado para o WhatsApp!' : 'Copiar Link p/ Grupo dos Profs'}</span>
              </button>
              <button
                type="button"
                onClick={() => setEmailManagerOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-extrabold flex items-center gap-1.5"
              >
                <Users size={14} />
                <span>Aprovar & Gerenciar E-mails</span>
              </button>
            </>
          )}
          {user && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 text-xs">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                {isStaff && <Shield size={13} className="text-amber-600" />}
                <span>{user.nickname}</span>
                {hasAccess && <span className="px-1.5 py-0.5 rounded bg-emerald-800 text-white text-[10px]">{roleBadge}</span>}
              </span>
              <button onClick={() => void logout()} className="text-slate-500 hover:text-rose-700" title="Sair">
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </header>

      {!hasAccess ? (
        <main className="max-w-lg mx-auto p-4 sm:p-8 mt-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            {user?.pendingApproval ? (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <Clock size={24} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Cadastro recebido! Aguardando aprovação</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    <strong>{user.nickname}</strong> ({user.email}) · Perfil: <strong>{roleBadge}</strong>
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Assim que o Super Admin ou a Coordenação clicar em <strong>Aprovar</strong>, toque no botão abaixo para entrar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void refreshApprovalStatus()}
                  className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-bold flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} /> Já fui aprovado — Entrar Agora
                </button>
                <button type="button" onClick={() => void logout()} className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                  Trocar de conta ou e-mail
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 text-emerald-900">
                  <div className="p-3 rounded-2xl bg-emerald-100"><ShieldAlert size={22} /></div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">Acesso da Equipe Escolar & Alunos Líderes</h2>
                    <p className="text-xs text-slate-600">Entre com Google ou solicite seu cadastro em segundos para aprovação do Super Admin.</p>
                  </div>
                </div>

                {user && !user.email && (
                  <div className="text-xs text-amber-950 bg-amber-50 border border-amber-200 rounded-2xl p-3">
                    Você está conectado como visitante (<strong>{user.nickname}</strong>). Use sua conta Google ou e-mail para enviar trabalhos.
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => void enterWithGoogle()}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-extrabold flex items-center justify-center gap-2 shadow-xs"
                >
                  <KeyRound size={16} /> Entrar ou Cadastrar-se com Google
                </button>

                <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`py-1.5 rounded-lg text-xs font-bold ${authMode === 'login' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                  >
                    Já tenho aprovação
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className={`py-1.5 rounded-lg text-xs font-bold ${authMode === 'register' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'}`}
                  >
                    Cadastre-se (1º acesso)
                  </button>
                </div>

                {authMode === 'register' ? (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <input value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Seu nome completo" required className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl" />
                    <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="Seu e-mail Google / escolar" required className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <select value={regRole} onChange={(e) => setRegRole(e.target.value as AuthorizedEmailRole)} className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-bold">
                        <option value="professor">Professor(a)</option>
                        <option value="coordenador">Coordenador(a)</option>
                        <option value="diretor">Diretor(a)</option>
                        <option value="lider">Aluno(a) Líder de Grupo</option>
                      </select>
                      <input value={regClassGroup} onChange={(e) => setRegClassGroup(e.target.value)} placeholder="Turma / Área (opcional)" className="px-3 py-2 text-xs border border-slate-300 rounded-xl" />
                    </div>
                    <button type="submit" disabled={submittingAuth} className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-extrabold flex items-center justify-center gap-2">
                      <UserPlus size={15} /> {submittingAuth ? 'Enviando...' : 'Concluir Cadastro e Solicitar Aprovação'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleAuthorizedLogin} className="space-y-2.5">
                    <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="Seu e-mail já aprovado" required className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl" />
                    <button type="submit" disabled={submittingAuth} className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center gap-2">
                      <MailCheck size={15} /> {submittingAuth ? 'Verificando...' : 'Entrar com E-mail Aprovado'}
                    </button>
                  </form>
                )}
              </>
            )}

            {authError && (
              <div className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">{authError}</div>
            )}
          </div>
        </main>
      ) : (
        <main className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6">
          <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase tracking-wider mb-1">Passo 1 · Território</span>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900">Selecione ou Cadastre o Território / Comunidade da Pesquisa</h2>
                <p className="text-xs text-slate-500 mt-0.5">Os vídeos, fotos e slides enviados abaixo entram automaticamente no Mapa de MT e no Carrossel desta comunidade.</p>
              </div>
              {community && (
                <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold self-start sm:self-center shrink-0">
                  {community.bioma} · {community.municipio}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4 items-center">
              <div className="md:col-span-8">
                <select value={community?.id || selectedId} onChange={(e) => setSelectedId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-[#fdfbf7] text-sm font-bold text-slate-900">
                  {communities.map((c) => (<option key={c.id} value={c.id}>{c.titulo} ({c.bioma} · {c.municipio})</option>))}
                </select>
              </div>
              <div className="md:col-span-4">
                <button type="button" onClick={() => setCreateModalOpen(true)} className="w-full px-4 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 whitespace-nowrap shadow-xs">
                  <MapPinPlus size={16} /> <span>+ Criar Novo Território / Comunidade</span>
                </button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <section className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
              <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase tracking-wider">Passo 2 · Publicar Trabalho</span>
              <SubmitWorkForm isLoggedIn={true} isStaffMode={isStaff} onRequestLogin={() => undefined} onSubmitWork={submitWork} />
            </section>
            <section className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
              <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase tracking-wider">Passo 3 · Galeria do Território</span>
              {community && <SchoolWorksGallery communityTitle={community.titulo} works={works} isProfessor={isStaff} onApprove={approveWork} />}
            </section>
          </div>
        </main>
      )}

      <CreateCommunityModal isOpen={createModalOpen} defaultOrientador={isStaff ? user?.nickname || '' : ''} onClose={() => setCreateModalOpen(false)} onCreateCommunity={addCommunity} onCreated={handleCommunityCreated} />
      {user?.email && isStaff && (
        <StaffEmailManagerModal isOpen={emailManagerOpen} actorEmail={user.email} actorRole={user.role} onClose={() => setEmailManagerOpen(false)} />
      )}
    </div>
  );
};
