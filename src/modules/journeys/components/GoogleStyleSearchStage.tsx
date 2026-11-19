import React, { useEffect, useState } from 'react';
import {
  Award,
  Images,
  Map as MapIcon,
  Mic,
  Search,
  Sparkles,
  Trees,
  Users,
  Volume2,
  Scale,
} from 'lucide-react';
import type {
  AssistantMessage,
  CommunityNode,
  SchoolWork,
  ThemeSessionKey,
} from '../../../shared/types/domain';
import { InstitutionalSynergyBar } from '../../../shared/components/InstitutionalSynergyBar';
import { resolveBiomePalette } from '../../../shared/utils/biomeThemePalettes';
import { buildAgeAdaptedOverview } from '../../../shared/utils/ageNarrativeAdapter';
import { getCommunityMediaSlides } from '../../../shared/data/communityMediaCatalog';
import { MapCanvas } from '../../map/components/MapCanvas';
import { HeroMediaBanner } from './HeroMediaBanner';
import { SessionVideosCard } from './SessionVideosCard';
import { GuideAskBox } from './GuideAskBox';
import { lyriaEngine } from '../../audio/services/lyriaSoundscapeEngine';

interface GoogleStyleSearchStageProps {
  communities: CommunityNode[];
  activeCommunity: CommunityNode;
  activeTheme: ThemeSessionKey;
  visitorAge?: number;
  works: SchoolWork[];
  messages: AssistantMessage[];
  loadingReply: boolean;
  isPlayingAudio: boolean;
  isAudioLoading: boolean;
  voiceStatus: 'idle' | 'connecting' | 'live' | 'speaking';
  onSelectCommunity: (id: string) => void;
  onSelectTheme: (theme: ThemeSessionKey) => void;
  onSpeakText: (text: string) => void;
  onToggleStoryAudio: (customText?: string) => void;
  onSendQuestion: (text: string) => void;
  onToggleLiveVoice: () => void;
  onOpenQuiz: () => void;
}

const THEME_BUTTONS: Array<{ key: ThemeSessionKey; label: string; icon: React.ReactNode }> = [
  { key: 'justica', label: 'Justiça Climática', icon: <Scale size={15} /> },
  { key: 'comunidades', label: 'Comunidades', icon: <Users size={15} /> },
  { key: 'biodiversidade', label: 'Biodiversidade', icon: <Trees size={15} /> },
];

const PRAISE_BEFORE_VIDEO =
  'Parabéns! Você está apoiando e dando voz a quem mais protege a natureza e quem mais precisa ser ouvido! Hoje você fez a diferença, continue assim!';

export const GoogleStyleSearchStage: React.FC<GoogleStyleSearchStageProps> = ({
  communities,
  activeCommunity,
  activeTheme,
  visitorAge,
  works,
  messages,
  loadingReply,
  isPlayingAudio,
  isAudioLoading,
  voiceStatus,
  onSelectCommunity,
  onSelectTheme,
  onSpeakText,
  onToggleStoryAudio,
  onSendQuestion,
  onToggleLiveVoice,
  onOpenQuiz,
}) => {
  const [stageMode, setStageMode] = useState<'map' | 'slides'>('map');
  const [videoChoice, setVideoChoice] = useState<'pending' | 'yes' | 'no'>('pending');

  const palette = resolveBiomePalette(activeCommunity, activeTheme);
  const overview = buildAgeAdaptedOverview(activeCommunity, activeTheme, visitorAge);

  // Sincroniza paleta sonora do Lyria ao trocar comunidade ou tema
  useEffect(() => {
    lyriaEngine.setThemeAmbience(palette.soundPreset);
  }, [palette.soundPreset]);

  // Reinicia convite de vídeo ao trocar de comunidade
  useEffect(() => {
    setVideoChoice('pending');
  }, [activeCommunity.id]);

  const handleChooseTheme = (theme: ThemeSessionKey) => {
    onSelectTheme(theme);
    setStageMode('slides');
    setVideoChoice('pending');
    lyriaEngine.playTransitionChime();
    if (theme === 'justica') {
      lyriaEngine.setThemeAmbience('drama');
    } else {
      lyriaEngine.setThemeAmbience(palette.soundPreset);
    }
  };

  const handleChoosePinOrCard = (community: CommunityNode) => {
    onSelectCommunity(community.id);
    setStageMode('slides');
    setVideoChoice('pending');
    lyriaEngine.playTransitionChime();
  };

  const handleAcceptVideo = () => {
    setVideoChoice('yes');
    lyriaEngine.setThemeAmbience('buritis');
  };

  return (
    <div className={`min-h-full transition-colors duration-500 ${palette.pageBg} pb-12`}>
      {/* Topo Estilo Barra de Busca Google + 3 Botões Temáticos */}
      <div className={`border-b ${palette.cardBorder} ${palette.headerBg} px-3 sm:px-8 py-3 sm:py-4 transition-colors duration-500`}>
        <div className="max-w-6xl mx-auto space-y-2.5 sm:space-y-3">
          <div className="flex flex-col md:flex-row md:items-center gap-2 sm:gap-3">
            <div className="flex-1 bg-white rounded-2xl sm:rounded-full border border-slate-300/90 shadow-xs px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2.5 sm:gap-3 min-w-0">
              <Search size={16} className="text-slate-400 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 sm:truncate flex-1">
                {overview.searchQueryTitle}
              </span>
              <button
                type="button"
                onClick={onToggleLiveVoice}
                aria-label="Conversar por voz ao vivo com o Guia"
                className={`p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full transition-colors shrink-0 ${voiceStatus === 'live' ? 'bg-rose-600 text-white animate-pulse' : 'text-emerald-800 hover:bg-slate-100'
                  }`}
                title="Conversar por voz ao vivo com o Guia"
              >
                <Mic size={16} />
              </button>
            </div>

            <span className={`hidden sm:inline-block px-3 py-1.5 rounded-full text-[11px] font-bold self-start md:self-auto ${palette.badgeBg} ${palette.badgeText}`}>
              {palette.label}
            </span>
          </div>

          {/* 3 Botões Temáticos Principais */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0 sm:flex-wrap">
              {THEME_BUTTONS.map((btn) => {
                const active = activeTheme === btn.key;
                return (
                  <button
                    key={btn.key}
                    onClick={() => handleChooseTheme(btn.key)}
                    className={`px-3 sm:px-4 py-2 min-h-[38px] rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-1.5 sm:gap-2 transition-all shadow-2xs shrink-0 ${active
                        ? `${palette.accentBg} text-white scale-[1.02]`
                        : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300/80'
                      }`}
                  >
                    {btn.icon}
                    <span>{btn.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="w-full sm:w-auto sm:ml-auto grid grid-cols-2 sm:inline-flex items-center gap-1.5 bg-white/80 p-1 rounded-full border border-slate-200">
              <button
                onClick={() => setStageMode('map')}
                className={`px-3 py-1.5 sm:py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${stageMode === 'map' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <MapIcon size={13} /> Mapa de MT
              </button>
              <button
                onClick={() => setStageMode('slides')}
                className={`px-3 py-1.5 sm:py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${stageMode === 'slides' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <Images size={13} /> Slides Visuais
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Corpo Principal em 2 Colunas (Inspirado no Google AI Overview) */}
      <div className="max-w-6xl mx-auto px-3 sm:px-8 pt-4 sm:pt-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Coluna Esquerda (~65%): Mapa/Slides Sincronizados + Síntese IA Grifada + Vídeo & Quiz */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-5 min-w-0">
          {/* Bloco Visual Protagonista: Mapa com Pinos OU Carrossel de Slides */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-sm">
            {stageMode === 'map' ? (
              <div className="h-[300px] sm:h-[400px] w-full relative">
                <MapCanvas
                  itens={communities}
                  itemSelecionadoId={activeCommunity.id}
                  onItemClick={handleChoosePinOrCard}
                  onStartGuideClick={() => setStageMode('slides')}
                />
              </div>
            ) : (
              <HeroMediaBanner
                community={activeCommunity}
                works={works}
                isPlayingAudio={isPlayingAudio}
                isAudioLoading={isAudioLoading}
                onToggleAudio={() => onToggleStoryAudio(overview.spokenScript)}
              />
            )}
          </div>

          {/* Visão Geral Criada por IA (Adaptada à Idade + Frase Grifada) */}
          <div className={`rounded-2xl sm:rounded-3xl border ${palette.cardBorder} ${palette.cardBg} p-4 sm:p-6 shadow-xs space-y-3.5 sm:space-y-4`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={`text-xs font-extrabold flex items-center gap-1.5 ${palette.accentText}`}>
                <Sparkles size={15} /> Visão geral adaptada para {visitorAge || 14} anos
              </span>
              <button
                onClick={() => onToggleStoryAudio(overview.spokenScript)}
                className="px-3 py-1.5 min-h-[36px] rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <Volume2 size={13} /> {isPlayingAudio ? 'Pausar Voz' : 'Ouvir Explicação'}
              </button>
            </div>

            <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
              <mark className={`px-1.5 py-0.5 rounded-md font-bold ${palette.highlightBg} ${palette.highlightText}`}>
                {overview.highlightedSentence}
              </mark>{' '}
              {overview.bodyParagraph}
            </p>

            <ul className="space-y-2 pt-1">
              {overview.bullets.map((b, i) => (
                <li key={i} className="text-xs sm:text-sm text-slate-700 leading-relaxed flex gap-2">
                  <span className="font-black text-emerald-700">•</span>
                  <span>
                    <strong className="text-slate-900">{b.label}:</strong> {b.detail}
                  </span>
                </li>
              ))}
            </ul>

            <GuideAskBox
              messages={messages}
              loadingReply={loadingReply}
              onSendQuestion={onSendQuestion}
              onSpeakText={onSpeakText}
            />
          </div>

          {/* Convite do Agente para Vídeos Selecionados + Mensagem de Reconhecimento + Quiz */}
          <SessionVideosCard
            activeCommunity={activeCommunity}
            works={works}
            videoChoice={videoChoice}
            praiseText={PRAISE_BEFORE_VIDEO}
            onAcceptVideo={handleAcceptVideo}
            onOpenQuiz={onOpenQuiz}
          />
        </div>

        {/* Coluna Lateral Direita (~35% — Estilo Cards de Fontes do Google AI Overview) */}
        <aside className="lg:col-span-4 space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 px-1">
            Outras Jornadas & Territórios de MT
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3">
            {communities.map((item) => {
              const selected = item.id === activeCommunity.id;
              const thumb = getCommunityMediaSlides(item.id, item.infografico.url, item.videoEquipe.url)[0]?.url;

              return (
                <button
                  key={item.id}
                  onClick={() => handleChoosePinOrCard(item)}
                  className={`w-full text-left rounded-2xl p-3 border transition-all flex items-start gap-3 ${selected
                      ? 'bg-white border-emerald-700 ring-2 ring-emerald-700/20 shadow-sm'
                      : 'bg-white/90 hover:bg-white border-slate-200/90'
                    }`}
                >
                  {thumb && (
                    <img
                      src={thumb}
                      alt={item.titulo}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                  )}
                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-800 block truncate">
                      {item.bioma} · {item.municipio}
                    </span>
                    <h5 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight line-clamp-1">
                      {item.titulo}
                    </h5>
                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                      {item.subtitulo}
                    </p>
                  </div>
                </button>
              );
            })}

            <button
              onClick={onOpenQuiz}
              className="w-full sm:col-span-2 lg:col-span-1 p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-800 text-white text-left flex items-center justify-between gap-3 shadow-sm hover:opacity-95 transition-opacity"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">
                  Desafio Interativo
                </span>
                <span className="text-sm font-extrabold">Quiz: 5 de 100 Curiosidades</span>
              </div>
              <Award size={22} className="text-amber-300 shrink-0" />
            </button>
          </div>
        </aside>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-8 pt-6">
        <InstitutionalSynergyBar variant="light" />
      </div>
    </div>
  );
};

