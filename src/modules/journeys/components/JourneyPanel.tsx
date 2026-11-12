import React from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import type {
  CommunityNode,
  JourneyKey,
  JourneyProgress,
  SchoolWork,
  UserProfile,
} from '../../../shared/types/domain';
import { HeroMediaBanner } from './HeroMediaBanner';
import { JourneyStepJustica } from './JourneyStepJustica';
import { JourneyStepCiencia } from './JourneyStepCiencia';
import { JourneyStepSaberes } from './JourneyStepSaberes';

interface JourneyPanelProps {
  community: CommunityNode;
  progress: JourneyProgress;
  activeJourney: JourneyKey;
  stepIndex: number;
  works: SchoolWork[];
  user: UserProfile | null;
  isPlayingAudio: boolean;
  isAudioLoading: boolean;
  onToggleAudio: () => void;
  onSelectJourney: (journey: JourneyKey) => void;
  onSelectStep: (step: number) => void;
  onCompleteAndAdvance: () => void;
  onRequestLogin: () => void;
  onApproveWork: (workId: string) => void;
  onSubmitWork: (input: {
    schoolName: string;
    classGroup: string;
    title: string;
    workType: SchoolWork['workType'];
    description: string;
    videoUrl?: string;
    imageFileBase64?: string;
    imageMimeType?: 'image/png' | 'image/jpeg' | 'image/webp';
  }) => Promise<unknown>;
  assistantSlot: React.ReactNode;
}

const JOURNEY_TABS: Array<{ key: JourneyKey; label: string }> = [
  { key: 'justica', label: '1. Justiça Climática' },
  { key: 'ciencia', label: '2. Ciência Clara' },
  { key: 'saberes', label: '3. Saberes & Escolas' },
];

export const JourneyPanel: React.FC<JourneyPanelProps> = ({
  community,
  progress,
  activeJourney,
  stepIndex,
  works,
  user,
  isPlayingAudio,
  isAudioLoading,
  onToggleAudio,
  onSelectJourney,
  onSelectStep,
  onCompleteAndAdvance,
  onRequestLogin,
  onApproveWork,
  onSubmitWork,
  assistantSlot,
}) => {
  const stepDone = progress[activeJourney].includes(stepIndex);

  return (
    <div className="h-full flex flex-col bg-[#fdfbf7] border-l border-slate-200 overflow-hidden">
      {/* Cabeçalho limpo da comunidade selecionada */}
      <div className="px-4 py-3 bg-[#f5f2e8] border-b border-slate-200 space-y-2 flex-none">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
            {community.bioma} · {community.municipio}
          </span>
          {community.isWebDiscovered && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 flex items-center gap-1">
              <Globe size={10} /> Descoberta na Web
            </span>
          )}
        </div>

        <h2 className="text-base font-extrabold text-slate-900 leading-snug">
          {community.titulo}
        </h2>

        {/* Seletor das 3 jornadas estritamente isoladas */}
        <div className="grid grid-cols-3 gap-1 bg-slate-200/75 p-1 rounded-xl">
          {JOURNEY_TABS.map((tab) => {
            const active = activeJourney === tab.key;
            const doneCount = progress[tab.key].length;
            return (
              <button
                key={tab.key}
                onClick={() => onSelectJourney(tab.key)}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors truncate ${active
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                {tab.label} {doneCount > 0 ? `(${doneCount}/3)` : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Área de conteúdo gradativo: Mídia Hero + 1 passo por vez */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5">
        {/* Banner Informativo Hero: Carrossel de Fotos, Infográficos e Vídeos com Áudio Fluido */}
        <HeroMediaBanner
          community={community}
          isPlayingAudio={isPlayingAudio}
          isAudioLoading={isAudioLoading}
          onToggleAudio={onToggleAudio}
        />

        {/* Indicador de Passo */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span className="font-semibold text-slate-700">
            Passo {stepIndex + 1} de 3
          </span>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((idx) => {
              const completed = progress[activeJourney].includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => onSelectStep(idx)}
                  className={`w-6 h-1.5 rounded-full transition-colors ${stepIndex === idx
                      ? 'bg-emerald-700'
                      : completed
                        ? 'bg-emerald-300'
                        : 'bg-slate-300'
                    }`}
                  title={`Ir para passo ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>

        {activeJourney === 'justica' && (
          <JourneyStepJustica community={community} stepIndex={stepIndex} />
        )}
        {activeJourney === 'ciencia' && (
          <JourneyStepCiencia community={community} stepIndex={stepIndex} />
        )}
        {activeJourney === 'saberes' && (
          <JourneyStepSaberes
            community={community}
            stepIndex={stepIndex}
            works={works}
            user={user}
            onRequestLogin={onRequestLogin}
            onApproveWork={onApproveWork}
            onSubmitWork={onSubmitWork}
          />
        )}

        {/* Navegação gradativa do passo */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
          <button
            onClick={() => onSelectStep(stepIndex - 1)}
            disabled={stepIndex === 0}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 flex items-center gap-1"
          >
            <ChevronLeft size={13} /> Anterior
          </button>

          <button
            onClick={onCompleteAndAdvance}
            className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
          >
            {stepDone && stepIndex === 2 ? (
              <>
                <CheckCircle2 size={13} /> Jornada Concluída
              </>
            ) : (
              <>
                <span>{stepIndex < 2 ? 'Compreendi · Próximo passo' : 'Concluir esta jornada'}</span>
                {stepIndex < 2 && <ChevronRight size={13} />}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Motor do Assistente-Guia acoplado no rodapé (sem poluir a tela) */}
      <div className="flex-none border-t border-slate-200 bg-white">
        {assistantSlot}
      </div>
    </div>
  );
};
