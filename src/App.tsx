import React, { useMemo, useState } from 'react';
import { LogIn, LogOut, Map, PanelRight, Shield } from 'lucide-react';
import {
  CURATED_COMMUNITIES,
  EIXOS_TEMATICOS,
} from './shared/data/communityRepository';
import type { CommunityNode, GrupoId } from './shared/types/domain';
import { BioPatrimonioLogo } from './shared/components/Icons';
import { MapCanvas } from './modules/map/components/MapCanvas';
import { useAuthSession } from './modules/auth/hooks/useAuthSession';
import { LoginModal } from './modules/auth/components/LoginModal';
import { useJourneyProgress } from './modules/journeys/hooks/useJourneyProgress';
import { JourneyPanel } from './modules/journeys/components/JourneyPanel';
import { useSchoolWorks } from './modules/submissions/hooks/useSchoolWorks';
import { useGuideAssistant } from './modules/assistant/hooks/useGuideAssistant';
import { GuideAssistantDock } from './modules/assistant/components/GuideAssistantDock';

export const App: React.FC = () => {
  const [discoveredCommunities, setDiscoveredCommunities] = useState<CommunityNode[]>([]);
  const [activeEixo, setActiveEixo] = useState<GrupoId>('todos');
  const [selectedId, setSelectedId] = useState<string>(CURATED_COMMUNITIES[0]?.id || '');
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  const { user, authError, enterWithClassroom, enterWithGoogle, logout } = useAuthSession();

  const allCommunities = useMemo(
    () => [...CURATED_COMMUNITIES, ...discoveredCommunities],
    [discoveredCommunities]
  );

  const filteredCommunities = useMemo(() => {
    if (activeEixo === 'todos') return allCommunities;
    return allCommunities.filter((c) => c.grupoId === activeEixo);
  }, [allCommunities, activeEixo]);

  const activeCommunity = useMemo(
    () =>
      filteredCommunities.find((c) => c.id === selectedId) ||
      filteredCommunities[0] ||
      allCommunities[0] ||
      null,
    [filteredCommunities, selectedId, allCommunities]
  );

  const journey = useJourneyProgress(user?.uid, activeCommunity?.id);
  const schoolWorks = useSchoolWorks(activeCommunity, user);

  const handleDiscovered = (items: CommunityNode[]) => {
    setDiscoveredCommunities((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const unique = items.filter((i) => !existingIds.has(i.id));
      return [...prev, ...unique];
    });
    if (items[0]) {
      setActiveEixo('todos');
      setSelectedId(items[0].id);
      setMobilePanelOpen(true);
    }
  };

  const assistant = useGuideAssistant({
    community: activeCommunity,
    activeJourney: journey.activeJourney,
    stepIndex: journey.stepIndex,
    progress: journey.progress,
    user,
    onDiscoveredCommunities: handleDiscovered,
    onRequestLogin: () => setLoginOpen(true),
  });

  const handleSelectEixo = (eixoId: GrupoId) => {
    setActiveEixo(eixoId);
    const list = eixoId === 'todos' ? allCommunities : allCommunities.filter((c) => c.grupoId === eixoId);
    if (list[0]) setSelectedId(list[0].id);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#f8f7f3] text-slate-900 font-sans overflow-hidden">
      {/* Barra superior limpa (sem redundâncias) */}
      <header className="flex items-center justify-between gap-4 px-4 py-2 bg-[#fdfbf7] border-b border-slate-200 flex-none z-30">
        <div className="flex items-center gap-2 min-w-0">
          <BioPatrimonioLogo className="w-6 h-6 shrink-0" />
          <span className="text-sm font-extrabold tracking-tight text-slate-900 truncate">
            Vozes do Clima & BioPatrimônio MT
          </span>
        </div>

        <nav className="hidden xl:flex items-center gap-4 text-xs font-semibold text-slate-600">
          {EIXOS_TEMATICOS.map((eixo) => (
            <button
              key={eixo.id}
              onClick={() => handleSelectEixo(eixo.id)}
              className={`py-0.5 whitespace-nowrap transition-colors ${
                activeEixo === eixo.id
                  ? 'text-emerald-800 border-b-2 border-emerald-700 font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              {eixo.rotulo}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1 text-xs">
              <span className="font-bold text-emerald-900 flex items-center gap-1">
                {user.role === 'professor' && <Shield size={12} className="text-amber-600" />}
                {user.nickname} · {user.classCode}
              </span>
              <button onClick={() => void logout()} className="text-slate-500 hover:text-rose-700" title="Sair">
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setLoginOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <LogIn size={13} />
              <span>Entrar</span>
            </button>
          )}

          <button
            onClick={() => setMobilePanelOpen((prev) => !prev)}
            className="md:hidden px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center gap-1"
          >
            {mobilePanelOpen ? <Map size={13} /> : <PanelRight size={13} />}
            <span>{mobilePanelOpen ? 'Mapa' : 'Jornada'}</span>
          </button>
        </div>
      </header>

      {/* Área principal: Mapa protagonista à esquerda + Painel único gradativo à direita */}
      <div className="flex-1 flex flex-row overflow-hidden">
        <main className={`flex-1 h-full relative ${mobilePanelOpen ? 'hidden md:block' : 'block'}`}>
          <MapCanvas
            itens={filteredCommunities}
            itemSelecionadoId={activeCommunity?.id}
            onItemClick={(item) => {
              setSelectedId(item.id);
              setMobilePanelOpen(true);
            }}
            onStartGuideClick={() => {
              setMobilePanelOpen(true);
              if (!user) setLoginOpen(true);
            }}
          />
        </main>

        <aside
          className={`w-full md:w-[480px] lg:w-[540px] xl:w-[600px] h-full flex-none transition-all duration-300 ${
            mobilePanelOpen ? 'block' : 'hidden md:block'
          }`}
        >
          {activeCommunity && (
            <JourneyPanel
              community={activeCommunity}
              progress={journey.progress}
              activeJourney={journey.activeJourney}
              stepIndex={journey.stepIndex}
              works={schoolWorks.works}
              user={user}
              isPlayingAudio={assistant.isPlayingAudio}
              isAudioLoading={assistant.isAudioLoading}
              onToggleAudio={() => void assistant.toggleStoryAudio()}
              onSelectJourney={journey.selectJourney}
              onSelectStep={journey.goToStep}
              onCompleteAndAdvance={journey.completeAndAdvance}
              onRequestLogin={() => setLoginOpen(true)}
              onApproveWork={schoolWorks.approveWork}
              onSubmitWork={schoolWorks.submitWork}
              assistantSlot={
                <GuideAssistantDock
                  messages={assistant.messages}
                  loadingReply={assistant.loadingReply}
                  discoveringWeb={assistant.discoveringWeb}
                  voiceStatus={assistant.voiceStatus}
                  errorMsg={assistant.errorMsg}
                  onSendMessage={(txt) => void assistant.sendMessage(txt)}
                  onSpeakText={(txt) => void assistant.speakText(txt)}
                  onToggleLiveVoice={() => void assistant.toggleLiveVoice()}
                  onSearchWebCommunities={() => void assistant.searchAnonymousCommunities()}
                />
              }
            />
          )}
        </aside>
      </div>

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onClassroomLogin={enterWithClassroom}
        onGoogleLogin={enterWithGoogle}
        authError={authError}
      />
    </div>
  );
};

export default App;
