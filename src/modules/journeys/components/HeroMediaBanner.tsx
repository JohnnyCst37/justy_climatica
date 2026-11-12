import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Volume2,
  VolumeX,
  Video,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';
import type { CommunityNode } from '../../../shared/types/domain';
import {
  getCommunityMediaSlides,
  type CommunityMediaSlide,
} from '../../../shared/data/communityMediaCatalog';

interface HeroMediaBannerProps {
  community: CommunityNode;
  isPlayingAudio: boolean;
  isAudioLoading: boolean;
  onToggleAudio: () => void;
}

export const HeroMediaBanner: React.FC<HeroMediaBannerProps> = ({
  community,
  isPlayingAudio,
  isAudioLoading,
  onToggleAudio,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const slides = getCommunityMediaSlides(
    community.id,
    community.infografico.url,
    community.videoEquipe.url
  );

  const activeSlide: CommunityMediaSlide = slides[currentSlideIndex] || slides[0];

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  const isVideo = activeSlide.type === 'video' && Boolean(activeSlide.url);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/80 shadow-md transition-all">
      {/* Janela de Mídia (16:10 / Altura Nobre) */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[360px] bg-slate-950 flex items-center justify-center overflow-hidden">
        {isVideo ? (
          <iframe
            src={activeSlide.url}
            title={activeSlide.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : activeSlide.url ? (
          <img
            src={activeSlide.url}
            alt={activeSlide.title}
            className="w-full h-full object-cover transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-300">
            <ImageIcon size={36} className="text-emerald-400 mb-2 opacity-80" />
            <p className="text-xs font-semibold">{activeSlide.title}</p>
          </div>
        )}

        {/* Gradiente Escuro de Vidro Editorial na base da mídia */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

        {/* Selo Territorial e Tipo de Mídia no topo */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/15 text-[10.5px] font-bold text-white tracking-wide uppercase">
            {community.bioma} · {community.municipio}
          </span>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {activeSlide.type === 'photo' && (
              <button
                onClick={() => setFullscreenImage(activeSlide.url)}
                className="w-7 h-7 rounded-lg bg-slate-900/75 hover:bg-slate-900 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors"
                title="Ampliar foto"
              >
                <Maximize2 size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Setas de navegação do carrossel */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all z-10"
              title="Slide anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all z-10"
              title="Próximo slide"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Legenda Editorial na base da imagem */}
        <div className="absolute bottom-3 inset-x-3 z-10 text-white space-y-1 pointer-events-none">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-emerald-300 tracking-wide uppercase flex items-center gap-1">
              {activeSlide.type === 'photo' ? (
                <ImageIcon size={12} />
              ) : activeSlide.type === 'video' ? (
                <Video size={12} />
              ) : (
                <Sparkles size={12} />
              )}
              {activeSlide.subtitle}
            </span>

            {/* Pílulas indicadoras de slide */}
            {slides.length > 1 && (
              <div className="flex items-center gap-1">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all pointer-events-auto ${
                      currentSlideIndex === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug drop-shadow-sm line-clamp-1">
            {activeSlide.title}
          </h3>
          <p className="text-[11.5px] text-slate-200/90 leading-tight line-clamp-2">
            {activeSlide.caption}
          </p>
        </div>
      </div>

      {/* Barra de Áudio Fluido do Guia Gemini (Abaixo da Janela Visual) */}
      <div className="bg-[#f5f2e8] px-3.5 py-2.5 flex items-center justify-between gap-3 border-t border-slate-200/90">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onToggleAudio}
            disabled={isAudioLoading}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
              isPlayingAudio
                ? 'bg-amber-600 text-white ring-2 ring-amber-300'
                : 'bg-emerald-800 hover:bg-emerald-700 text-white'
            }`}
          >
            {isAudioLoading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Carregando voz...</span>
              </>
            ) : isPlayingAudio ? (
              <>
                <VolumeX size={13} />
                <span>Pausar Guia</span>
              </>
            ) : (
              <>
                <Volume2 size={13} />
                <span>Ouvir História com o Guia</span>
              </>
            )}
          </button>

          {/* Ondas Sonoras Vivas quando a IA estiver falando */}
          {isPlayingAudio && (
            <div className="flex items-center gap-0.5 h-4 px-2 bg-emerald-50 rounded-full border border-emerald-200/80">
              <span className="w-1 bg-emerald-700 rounded-full animate-pulse h-3" />
              <span className="w-1 bg-emerald-700 rounded-full animate-pulse h-4" />
              <span className="w-1 bg-emerald-700 rounded-full animate-pulse h-2" />
              <span className="w-1 bg-emerald-700 rounded-full animate-pulse h-4" />
            </div>
          )}
        </div>

        <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
          Voz Fluida Gemini
        </span>
      </div>

      {/* Modal de Foto Ampliada em Tela Cheia */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-4xl w-full p-2 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white"
            >
              <X size={18} />
            </button>
            <img
              src={fullscreenImage}
              alt="Foto ampliada do território"
              className="w-full max-h-[82vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

