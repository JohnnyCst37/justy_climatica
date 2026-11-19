import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Clapperboard, PlusCircle, Radio, Trash2, Users } from 'lucide-react';
import type { CinemaSessionRecord } from '../../../shared/types/domain';
import { BioPatrimonioLogo } from '../../../shared/components/Icons';
import { InstitutionalSynergyBar } from '../../../shared/components/InstitutionalSynergyBar';
import { useCommunitiesList } from '../../../shared/hooks/useCommunitiesList';
import { useAuthSession } from '../../auth/hooks/useAuthSession';
import { canManageCinemaSessions, isStaffRole } from '../../auth/services/accessControlService';
import {
  endPresenceSession,
  heartbeatPresenceSession,
  mapAuthRoleToVisitorCategory,
  startPresenceSession,
} from '../../presence/services/presenceService';
import {
  deleteCinemaSession,
  subscribeCinemaSessions,
  updateCinemaSessionState,
} from '../services/cinemaSessionService';
import { useCinemaVoice } from '../hooks/useCinemaVoice';
import { CinemaMonitorAuthModal } from './CinemaMonitorAuthModal';
import { CreateCinemaSessionModal } from './CreateCinemaSessionModal';
import { CinemaStagePlayer } from './CinemaStagePlayer';

export const CinemaRoomPage: React.FC = () => {
  const { communities } = useCommunitiesList();
  const {
    user,
    authError,
    enterWithGoogle,
    enterWithAuthorizedEmail,
    enterWithRolePasscode,
  } = useAuthSession();
  const [sessions, setSessions] = useState<CinemaSessionRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [createOpen, setCreateOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const {
    speakCinema,
    stopCinemaVoice,
    prewarmCinemaQuestions,
    isSpeaking,
    isLoadingVoice,
  } = useCinemaVoice(user?.sessionToken);

  const canManage = canManageCinemaSessions(user);
  const isStaff = isStaffRole(user?.role);

  useEffect(() => subscribeCinemaSessions(communities, setSessions), [communities]);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === selectedId) || sessions[0] || null,
    [sessions, selectedId]
  );

  useEffect(() => {
    let sid = '';
    void startPresenceSession({
      name: user?.nickname || 'Plateia Sala de Cinema',
      category: user ? mapAuthRoleToVisitorCategory(user.role) : 'outro',
      classGroup: user?.classCode || 'Sala de Cinema',
      area: 'sala_cinema',
      activeCommunityTitle: activeSession?.title || 'Sala de Cinema',
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
  }, [user?.uid, user?.nickname, user?.role, user?.classCode, activeSession?.title]);

  const handleClickCreate = () => {
    if (canManage) {
      setCreateOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#061812] text-white">
      <header className="bg-[#09241b]/95 backdrop-blur-md border-b border-emerald-500/20 px-3 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-2.5 sticky top-0 z-20">
        <div className="flex items-center gap-2.5 min-w-0">
          <a
            href="/"
            className="p-2 rounded-xl border border-white/15 hover:bg-white/10 text-white shrink-0"
            title="Voltar à Mostra"
          >
            <ArrowLeft size={16} />
          </a>
          <BioPatrimonioLogo className="w-8 h-8" />
          <div className="min-w-0">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
              <Clapperboard size={12} /> 2ª Mostra Cultural · Sala de Cinema
            </span>
            <h1 className="text-xs sm:text-base font-extrabold text-white truncate">
              Sessões Coletivas + Quiz da IA · EE CM João Ribeiro Vilela
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="/galeria"
            className="px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-extrabold flex items-center gap-1.5"
          >
            <Radio size={13} /> Galeria Live
          </a>
          <button
            type="button"
            onClick={handleClickCreate}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md"
          >
            <PlusCircle size={14} /> Criar Sessão
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-3.5 sm:p-8 space-y-6">
        <section className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
              <Users size={14} /> Sessões Programadas ({sessions.length})
            </h2>
            <span className="text-[11px] text-slate-300">
              {canManage ? `Monitor(a): ${user?.nickname}` : 'Assista junto com a turma'}
            </span>
          </div>

          <div className="flex items-stretch gap-2.5 overflow-x-auto pb-1">
            {sessions.map((s) => {
              const active = activeSession?.id === s.id;
              return (
                <div
                  key={s.id}
                  className={`min-w-[230px] max-w-[280px] rounded-2xl p-3 border transition flex flex-col justify-between gap-2 shrink-0 ${
                    active
                      ? 'bg-emerald-900/70 border-amber-400 shadow-lg'
                      : 'bg-white/5 border-white/10 hover:border-emerald-400/50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      stopCinemaVoice();
                      setSelectedId(s.id);
                    }}
                    className="text-left space-y-1"
                  >
                    <div className="text-[10px] font-bold uppercase text-amber-300 truncate">
                      {s.videos.length} {s.videos.length === 1 ? 'vídeo' : 'vídeos'} · {s.hostsLabel}
                    </div>
                    <div className="text-xs font-extrabold text-white line-clamp-2">{s.title}</div>
                  </button>
                  {(isStaff || (canManage && s.createdByEmail === user?.email)) &&
                    !s.id.startsWith('seed-') && (
                      <button
                        type="button"
                        onClick={() => void deleteCinemaSession(s.id)}
                        className="self-end text-[10.5px] text-rose-300 hover:text-rose-200 flex items-center gap-1"
                      >
                        <Trash2 size={11} /> Excluir
                      </button>
                    )}
                </div>
              );
            })}
          </div>
        </section>

        {activeSession && (
          <CinemaStagePlayer
            session={activeSession}
            isSpeaking={isSpeaking}
            isLoadingVoice={isLoadingVoice}
            onSpeak={speakCinema}
            onStopVoice={stopCinemaVoice}
            onPrewarmQuestions={prewarmCinemaQuestions}
            onUpdateState={(patch) => updateCinemaSessionState(activeSession.id, patch)}
          />
        )}

        <InstitutionalSynergyBar variant="dark" />
      </main>

      <CreateCinemaSessionModal
        isOpen={createOpen}
        communities={communities}
        creatorName={user?.nickname || 'Dupla Sala de Cinema'}
        creatorEmail={user?.email}
        onClose={() => setCreateOpen(false)}
        onCreated={(created) => {
          stopCinemaVoice();
          setSelectedId(created.id);
        }}
      />

      <CinemaMonitorAuthModal
        isOpen={authModalOpen}
        authError={authError}
        onClose={() => setAuthModalOpen(false)}
        onEnterWithGoogle={async () => {
          const prof = await enterWithGoogle();
          if (prof && canManageCinemaSessions(prof)) setCreateOpen(true);
          return prof;
        }}
        onEnterWithEmail={async (email) => {
          const prof = await enterWithAuthorizedEmail(email);
          if (prof && canManageCinemaSessions(prof)) setCreateOpen(true);
          return prof;
        }}
        onEnterWithPasscode={async (input) => {
          const prof = await enterWithRolePasscode(input);
          if (prof && canManageCinemaSessions(prof)) setCreateOpen(true);
          return prof;
        }}
      />
    </div>
  );
};
