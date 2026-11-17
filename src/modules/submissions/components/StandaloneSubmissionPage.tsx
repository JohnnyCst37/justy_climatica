import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowLeft, Check, KeyRound, LogOut,
  MapPinPlus, School, Share2, Shield, Users,
} from 'lucide-react';
import type { AuthorizedEmailRole, CommunityNode } from '../../../shared/types/domain';
import { useCommunitiesList } from '../../../shared/hooks/useCommunitiesList';
import { useAuthSession } from '../../auth/hooks/useAuthSession';
import {
  ROLE_LABELS,
  canAccessSubmissionPortal,
  isStaffRole,
  parseTeacherClasses,
} from '../../auth/services/accessControlService';
import { StaffEmailManagerModal } from '../../auth/components/StaffEmailManagerModal';
import { RolePasscodesModal } from '../../auth/components/RolePasscodesModal';
import {
  endPresenceSession,
  heartbeatPresenceSession,
  mapAuthRoleToVisitorCategory,
  startPresenceSession,
} from '../../presence/services/presenceService';
import { useSchoolWorks } from '../hooks/useSchoolWorks';
import { SubmissionAuthCard } from './SubmissionAuthCard';
import { SubmitWorkForm } from './SubmitWorkForm';
import { SchoolWorksGallery } from './SchoolWorksGallery';
import { CreateCommunityModal } from './CreateCommunityModal';

export const StandaloneSubmissionPage: React.FC = () => {
  const { communities, addCommunity } = useCommunitiesList();
  const [selectedId, setSelectedId] = useState(communities[0]?.id || '');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [emailManagerOpen, setEmailManagerOpen] = useState(false);
  const [passcodesOpen, setPasscodesOpen] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const {
    user, authError, enterWithAuthorizedEmail, enterWithRolePasscode,
    enterWithGoogle, submitAccessRequest, refreshApprovalStatus, logout,
  } = useAuthSession();

  const hasAccess = canAccessSubmissionPortal(user);
  const isStaff = isStaffRole(user?.role);
  const teacherClasses = useMemo(
    () => parseTeacherClasses(user?.classCode),
    [user?.classCode]
  );

  const community = useMemo(
    () => communities.find((c) => c.id === selectedId) || communities[0],
    [communities, selectedId]
  );

  useEffect(() => {
    if (!hasAccess || !user) return;
    let sid = '';
    void startPresenceSession({
      name: user.nickname,
      category: mapAuthRoleToVisitorCategory(user.role),
      classGroup: user.classCode,
      area: 'portal_envio',
    }).then((id) => {
      sid = id;
    });
    const timer = window.setInterval(() => {
      if (sid) void heartbeatPresenceSession(sid);
    }, 20000);
    return () => {
      window.clearInterval(timer);
      if (sid) void endPresenceSession(sid);
    };
  }, [hasAccess, user?.uid, user?.nickname, user?.role, user?.classCode]);

  const { works, submitWork, approveWork, updateWork, deleteWork } = useSchoolWorks(
    community,
    hasAccess ? user : null
  );

  const handleCopyTeachersInvite = async () => {
    const portalUrl = `${window.location.origin}/enviar`;
    const msg = [
      '*Mostra Jornada da Justiça Climática (19/11) · EE CM João Ribeiro Vilela*',
      'Professores(as), o portal de envio de vídeos, fotos, slides e novos territórios já está no ar:',
      portalUrl,
      'Entre direto com a *Senha do Cargo* (informe seu Nome, Disciplina e a senha PROF que enviei por aqui — não precisa de Google)!',
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
          {hasAccess && user?.role === 'super_admin' && (
            <button
              type="button"
              onClick={() => setPasscodesOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center gap-1.5"
            >
              <KeyRound size={14} className="text-amber-300" />
              <span>Senhas (Profs, Coord, Diretor, DRE)</span>
            </button>
          )}
          {hasAccess && isStaff && (
            <>
              <a
                href="/acessos"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-extrabold flex items-center gap-1.5"
              >
                <Activity size={14} className="text-rose-600" />
                <span>Acessos ao Vivo</span>
              </a>
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
        <SubmissionAuthCard
          user={user}
          authError={authError}
          hasAccess={hasAccess}
          onEnterWithPasscode={enterWithRolePasscode}
          onEnterWithEmail={enterWithAuthorizedEmail}
          onEnterWithGoogle={enterWithGoogle}
          onSubmitAccessRequest={submitAccessRequest}
          onRefreshApproval={refreshApprovalStatus}
          onLogout={logout}
        />
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
              <SubmitWorkForm isLoggedIn={true} isStaffMode={isStaff} userClasses={teacherClasses} onRequestLogin={() => undefined} onSubmitWork={submitWork} />
            </section>
            <section className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
              <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase tracking-wider">Passo 3 · Galeria do Território</span>
              {community && (
                <SchoolWorksGallery
                  communityTitle={community.titulo}
                  works={works}
                  isProfessor={isStaff}
                  onApprove={approveWork}
                  onUpdate={updateWork}
                  onDelete={deleteWork}
                />
              )}
            </section>
          </div>
        </main>
      )}

      <CreateCommunityModal isOpen={createModalOpen} defaultOrientador={isStaff ? user?.nickname || '' : ''} userClasses={teacherClasses} onClose={() => setCreateModalOpen(false)} onCreateCommunity={addCommunity} onCreated={handleCommunityCreated} />
      {user?.email && isStaff && (
        <StaffEmailManagerModal isOpen={emailManagerOpen} actorEmail={user.email} actorRole={user.role} onClose={() => setEmailManagerOpen(false)} />
      )}
      {user?.role === 'super_admin' && (
        <RolePasscodesModal isOpen={passcodesOpen} onClose={() => setPasscodesOpen(false)} />
      )}
    </div>
  );
};
