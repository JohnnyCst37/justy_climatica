import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Award, Clapperboard, Lock, Radio, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useCommunitiesList } from './shared/hooks/useCommunitiesList';
import type { AgeGroupKey, ThemeSessionKey, VisitorCategory } from './shared/types/domain';
import { BioPatrimonioLogo } from './shared/components/Icons';
import { resolveBiomePalette } from './shared/utils/biomeThemePalettes';
import { useAuthSession } from './modules/auth/hooks/useAuthSession';
import { useJourneyProgress } from './modules/journeys/hooks/useJourneyProgress';
import { useSchoolWorks } from './modules/submissions/hooks/useSchoolWorks';
import { useGuideAssistant } from './modules/assistant/hooks/useGuideAssistant';
import { lyriaEngine } from './modules/audio/services/lyriaSoundscapeEngine';
import { EventCoverScreen } from './modules/kiosk/components/EventCoverScreen';
import { KioskLockModal } from './modules/kiosk/components/KioskLockModal';
import { StandaloneSubmissionPage } from './modules/submissions/components/StandaloneSubmissionPage';
import { LiveAccessDashboardPage } from './modules/presence/components/LiveAccessDashboardPage';
import { PublicLiveGalleryPage } from './modules/gallery/components/PublicLiveGalleryPage';
import { LiveCoverageStudioPage } from './modules/gallery/components/LiveCoverageStudioPage';
import { CinemaRoomPage } from './modules/cinema/components/CinemaRoomPage';
import {
  endPresenceSession,
  heartbeatPresenceSession,
  startPresenceSession,
} from './modules/presence/services/presenceService';
import { GoogleStyleSearchStage } from './modules/journeys/components/GoogleStyleSearchStage';
import { ClimateQuizModal } from './modules/quiz/components/ClimateQuizModal';

type AppRoute = 'mostra' | 'enviar' | 'acessos' | 'galeria' | 'cobertura' | 'cinema';

function resolveAppRoute(): AppRoute {
  if (typeof window === 'undefined') return 'mostra';
  const path = window.location.pathname;
  const modo = new URLSearchParams(window.location.search).get('modo');
  if (path.startsWith('/enviar') || modo === 'enviar') return 'enviar';
  if (path.startsWith('/acessos') || modo === 'acessos') return 'acessos';
  if (path.startsWith('/galeria') || modo === 'galeria') return 'galeria';
  if (path.startsWith('/cobertura') || modo === 'cobertura') return 'cobertura';
  if (path.startsWith('/cinema') || modo === 'cinema') return 'cinema';
  return 'mostra';
}

export const App: React.FC = () => {
  const { communities: allCommunities } = useCommunitiesList();
  const [route, setRoute] = useState<AppRoute>(resolveAppRoute);
  const [selectedId, setSelectedId] = useState<string>(allCommunities[0]?.id || '');
  const [visitorSession, setVisitorSession] = useState<{
    age: number;
    ageGroup: AgeGroupKey;
    category: VisitorCategory;
    classGroup: string;
  } | null>(null);
  const presenceSessionIdRef = useRef<string>('');
  const [activeTheme, setActiveTheme] = useState<ThemeSessionKey>('justica');
  const [kioskActive, setKioskActive] = useState(false);
  const [unlockedByProfessor, setUnlockedByProfessor] = useState(false);
  const [adminPromptOpen, setAdminPromptOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [lyriaMuted, setLyriaMuted] = useState(true);

  const { user, authError, enterWithClassroom, enterWithGoogle, logout } = useAuthSession();

  useEffect(() => {
    lyriaEngine.setMuted(lyriaMuted);
  }, [lyriaMuted]);

  useEffect(() => {
    const onPopState = () => setRoute(resolveAppRoute());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const activeCommunity = useMemo(
    () => allCommunities.find((c) => c.id === selectedId) || allCommunities[0],
    [allCommunities, selectedId]
  );

  const effectiveUser = useMemo(
    () =>
      user && visitorSession
        ? { ...user, age: visitorSession.age, ageGroup: visitorSession.ageGroup }
        : user,
    [user, visitorSession]
  );

  const journey = useJourneyProgress(effectiveUser?.uid, activeCommunity?.id);
  const schoolWorks = useSchoolWorks(activeCommunity, effectiveUser);

  const assistant = useGuideAssistant({
    community: activeCommunity,
    activeJourney: journey.activeJourney,
    stepIndex: journey.stepIndex,
    progress: journey.progress,
    user: effectiveUser,
    onRequestLogin: () => setVisitorSession(null),
  });

  const biomePalette = useMemo(
    () => resolveBiomePalette(activeCommunity, activeTheme),
    [activeCommunity, activeTheme]
  );

  const handleSelectTheme = useCallback(
    (theme: ThemeSessionKey) => {
      setActiveTheme(theme);
      const mapped = theme === 'justica' ? 'justica' : theme === 'comunidades' ? 'saberes' : 'ciencia';
      journey.selectJourney(mapped);
    },
    [journey]
  );

  const handleStartVisitor = useCallback(
    async (input: {
      nickname: string;
      age: number;
      ageGroup: AgeGroupKey;
      category: VisitorCategory;
      classGroup: string;
    }) => {
      await enterWithClassroom(input.nickname, input.classGroup || 'MOSTRA-2026');
      setVisitorSession({
        age: input.age,
        ageGroup: input.ageGroup,
        category: input.category,
        classGroup: input.classGroup,
      });
      setKioskActive(true);
      setUnlockedByProfessor(false);
      setActiveTheme('justica');
      setQuizOpen(false);
      const sid = await startPresenceSession({
        name: input.nickname,
        category: input.category,
        classGroup: input.classGroup,
        age: input.age,
        area: 'mostra',
        activeCommunityTitle: activeCommunity?.titulo,
        activeTheme: 'justica',
      });
      presenceSessionIdRef.current = sid;
    },
    [enterWithClassroom, activeCommunity?.titulo]
  );

  const handleStartVisitorWithGoogle = useCallback(
    async (input: {
      age: number;
      ageGroup: AgeGroupKey;
      category: VisitorCategory;
      classGroup: string;
    }) => {
      const profile = await enterWithGoogle();
      if (!profile) return false;
      setVisitorSession(input);
      setKioskActive(true);
      setUnlockedByProfessor(false);
      setActiveTheme('justica');
      setQuizOpen(false);
      const sid = await startPresenceSession({
        name: profile.nickname,
        category: input.category,
        classGroup: input.classGroup,
        age: input.age,
        area: 'mostra',
        activeCommunityTitle: activeCommunity?.titulo,
        activeTheme: 'justica',
      });
      presenceSessionIdRef.current = sid;
      return true;
    },
    [enterWithGoogle, activeCommunity?.titulo]
  );

  useEffect(() => {
    if (!visitorSession || !presenceSessionIdRef.current) return;
    void heartbeatPresenceSession(presenceSessionIdRef.current, {
      activeCommunityTitle: activeCommunity?.titulo,
      activeTheme,
    });
    const timer = window.setInterval(() => {
      if (presenceSessionIdRef.current) {
        void heartbeatPresenceSession(presenceSessionIdRef.current, {
          activeCommunityTitle: activeCommunity?.titulo,
          activeTheme,
        });
      }
    }, 20000);
    return () => window.clearInterval(timer);
  }, [visitorSession, activeCommunity?.titulo, activeTheme]);

  useEffect(() => {
    const onUnload = () => {
      if (presenceSessionIdRef.current) {
        void endPresenceSession(presenceSessionIdRef.current);
      }
    };
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, []);

  const handleFinishVisitorCycle = useCallback(() => {
    assistant.stopAudio();
    lyriaEngine.setVoiceDucking(false);
    if (presenceSessionIdRef.current) {
      void endPresenceSession(presenceSessionIdRef.current);
      presenceSessionIdRef.current = '';
    }
    setQuizOpen(false);
    setVisitorSession(null);
    setKioskActive(false);
    void logout();
  }, [assistant, logout]);

  const handleToggleLyriaMute = useCallback(() => {
    const next = !lyriaMuted;
    if (!next) {
      lyriaEngine.initOnLogin();
    }
    setLyriaMuted(next);
    lyriaEngine.setMuted(next);
  }, [lyriaMuted]);

  if (route === 'cinema') {
    return <CinemaRoomPage />;
  }

  if (route === 'cobertura') {
    return <LiveCoverageStudioPage />;
  }

  if (route === 'galeria') {
    return <PublicLiveGalleryPage />;
  }

  if (route === 'acessos') {
    return <LiveAccessDashboardPage />;
  }

  if (route === 'enviar') {
    return <StandaloneSubmissionPage />;
  }

  if (!visitorSession || !user) {
    return (
      <EventCoverScreen
        onStartVisitor={handleStartVisitor}
        onStartWithGoogle={handleStartVisitorWithGoogle}
        authError={authError}
        onSpeakWelcome={(txt) => void assistant.speakText(txt)}
        isSpeakingWelcome={assistant.isPlayingAudio || assistant.isAudioLoading}
      />
    );
  }

  return (
    <div className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-500 ${biomePalette.pageBg}`}>
      <header
        className={`sticky top-0 z-30 border-b border-slate-200/80 backdrop-blur-md px-3 sm:px-6 py-2 sm:py-2.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-3 ${biomePalette.headerBg}`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <BioPatrimonioLogo className="w-7 h-7 shrink-0" />
          <div className="min-w-0">
            <span className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-900 block truncate">
              Jornada da Justiça Climática · EE CM João Ribeiro Vilela
            </span>
            <span className={`inline-block text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${biomePalette.badgeBg} ${biomePalette.badgeText}`}>
              {biomePalette.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-wrap justify-end">
          <button
            type="button"
            onClick={handleToggleLyriaMute}
            aria-label={lyriaMuted ? 'Ativar trilha sonora Lyria' : 'Silenciar trilha sonora Lyria'}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] rounded-xl bg-white/80 hover:bg-white border border-slate-200 text-xs font-semibold text-slate-700"
            title={lyriaMuted ? 'Ativar trilha sonora Lyria' : 'Silenciar trilha sonora Lyria'}
          >
            {lyriaMuted ? <VolumeX size={15} className="text-rose-600" /> : <Volume2 size={15} className="text-emerald-700" />}
            <span className="hidden sm:inline">{lyriaMuted ? 'Som mudo' : 'Trilha Lyria'}</span>
          </button>

          <a
            href="/cinema"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[36px] rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 text-xs font-extrabold shadow-2xs"
            title="Abrir Sala de Cinema (Sessões e Quiz)"
          >
            <Clapperboard size={14} className="text-amber-700" />
            <span>Cinema</span>
          </a>

          <a
            href="/galeria"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[36px] rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 text-xs font-extrabold shadow-2xs"
            title="Acompanhar Cobertura ao Vivo (Live)"
          >
            <Radio size={14} className="text-rose-600 animate-pulse" />
            <span>Galeria<span className="hidden sm:inline"> Live</span></span>
          </a>

          <button
            type="button"
            onClick={() => setQuizOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[36px] rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-xs"
          >
            <Award size={14} />
            <span>Quiz<span className="hidden sm:inline"> (5/100)</span></span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/85 border border-slate-200 text-xs font-bold text-slate-800">
            <span>{effectiveUser?.nickname}</span>
            <span className="text-slate-400">·</span>
            <span>{visitorSession.age} anos</span>
          </div>

          <button
            type="button"
            onClick={handleFinishVisitorCycle}
            aria-label="Encerrar visita atual e preparar para próximo visitante"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] rounded-xl bg-white/80 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-xs font-semibold text-slate-700 hover:text-rose-700"
            title="Encerrar visita atual e preparar para próximo visitante"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Próximo Visitante</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminPromptOpen(true)}
            aria-label="Controle do Professor"
            className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl bg-slate-900/10 hover:bg-slate-900/20 text-slate-700"
            title="Controle do Professor (Quiosque)"
          >
            <Lock size={14} />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full">
        {activeCommunity && (
          <GoogleStyleSearchStage
            communities={allCommunities}
            activeCommunity={activeCommunity}
            activeTheme={activeTheme}
            visitorAge={visitorSession.age}
            works={schoolWorks.works}
            messages={assistant.messages}
            loadingReply={assistant.loadingReply}
            isPlayingAudio={assistant.isPlayingAudio}
            isAudioLoading={assistant.isAudioLoading}
            voiceStatus={assistant.voiceStatus}
            onSelectCommunity={setSelectedId}
            onSelectTheme={handleSelectTheme}
            onSpeakText={(txt) => void assistant.speakText(txt)}
            onToggleStoryAudio={(txt) => void assistant.toggleStoryAudio(txt)}
            onSendQuestion={(txt) => void assistant.sendMessage(txt)}
            onToggleLiveVoice={() => void assistant.toggleLiveVoice()}
            onOpenQuiz={() => setQuizOpen(true)}
          />
        )}
      </main>

      <ClimateQuizModal
        isOpen={quizOpen}
        visitorName={effectiveUser?.nickname || 'Visitante'}
        activeTheme={activeTheme}
        onClose={() => setQuizOpen(false)}
        onFinishVisitorCycle={handleFinishVisitorCycle}
        onSpeakText={(txt) => void assistant.speakText(txt)}
      />

      <KioskLockModal
        kioskActive={kioskActive}
        unlockedByProfessor={unlockedByProfessor}
        openAdminPrompt={adminPromptOpen}
        onCloseAdminPrompt={() => setAdminPromptOpen(false)}
        onUnlockKiosk={() => {
          setUnlockedByProfessor(true);
          setAdminPromptOpen(false);
        }}
        onOpenSubmitRoute={() => {
          window.history.pushState({}, '', '/enviar');
          setAdminPromptOpen(false);
          setRoute('enviar');
        }}
      />
    </div>
  );
};

export default App;
