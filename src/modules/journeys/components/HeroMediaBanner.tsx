import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Film,
  Maximize2,
  Volume2,
  VolumeX,
  Video,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';
import type { CommunityNode, SchoolWork } from '../../../shared/types/domain';
import {
  getCommunityMediaSlides,
  type CommunityMediaSlide,
} from '../../../shared/data/communityMediaCatalog';
import { ResolvedVideoPlayer } from '../../../shared/components/ResolvedVideoPlayer';
import {
  isDirectVideoFileUrl,
  toEmbedVideoUrl,
} from '../../../shared/utils/videoEmbedResolver';

interface HeroMediaBannerProps {
  community: CommunityNode;
  works?: SchoolWork[];
  isPlayingAudio: boolean;
  isAudioLoading: boolean;
  onToggleAudio: () => void;
}

export const HeroMediaBanner: React.FC<HeroMediaBannerProps> = ({
  community,
  works = [],
  isPlayingAudio,
  isAudioLoading,
  onToggleAudio,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const allBaseSlides = getCommunityMediaSlides(
    community.id,
    community.infografico.url,
    community.videoEquipe.url
  );

  const studentSlides: CommunityMediaSlide[] = works
    .filter((w) => Boolean(w.mediaUrl))
    .map((w) => ({
      id: `work-${w.id}`,
      type: w.workType === 'video' ? 'video' : w.workType === 'infografico' ? 'infographic' : 'photo',
      title: w.title,
      subtitle: `${w.schoolName} · ${w.classGroup}`,
      url: w.mediaUrl,
      caption: w.description,
    }));

  const baseSlides = allBaseSlides.filter(
    (b) => b.type === 'photo' && !studentSlides.some((s) => s.url === b.url)
  );

  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [community.id, studentSlides.length]);

  const slides = [...studentSlides, ...baseSlides];
  const activeSlide: CommunityMediaSlide = slides[currentSlideIndex] || slides[0];

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  const activeUrl = activeSlide?.url || '';
  const isDirectVideo =
    Boolean(activeUrl) &&
    (activeSlide?.type === 'video'
      ? isDirectVideoFileUrl(activeUrl)
      : /\.(mp4|webm|mov)(\?.*)?$/i.test(activeUrl) || activeUrl.startsWith('data:video/'));
  const embedVideoUrl = Boolean(activeUrl) && !isDirectVideo ? toEmbedVideoUrl(activeUrl) || '' : '';
  const isImage =
    Boolean(activeUrl) &&
    !isDirectVideo &&
    !embedVideoUrl &&
    (activeUrl.startsWith('data:image/') ||
      activeUrl.startsWith('/images/') ||
      /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(activeUrl) ||
      activeUrl.includes('unsplash.com') ||
      activeUrl.includes('firebasestorage.googleapis.com'));
  const isExternalWorkLink =
    Boolean(activeUrl) && /^https?:\/\//i.test(activeUrl) && !isDirectVideo && !embedVideoUrl && !isImage;

  const isVideoOrEmbed = isDirectVideo || Boolean(embedVideoUrl);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/80 shadow-md transition-all">
      {/* Janela de Mídia (16:10 / Altura Nobre) */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[360px] bg-slate-950 flex items-center justify-center overflow-hidden">
        {isDirectVideo ? (
          <ResolvedVideoPlayer
            key={activeUrl}
            src={activeUrl}
            className="w-full h-full object-contain bg-black"
          />
        ) : embedVideoUrl ? (
          <iframe
            key={embedVideoUrl}
            src={embedVideoUrl}
            title={activeSlide.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : isExternalWorkLink ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-white space-y-3 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 w-full h-full">
            <Sparkles size={32} className="text-amber-300" />
            <div className="max-w-md space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                {activeSlide.subtitle}
              </p>
              <p className="text-sm font-extrabold">{activeSlide.title}</p>
            </div>
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold inline-flex items-center gap-2 shadow-sm"
            >
              <ExternalLink size={15} /> Abrir Apresentação / Trabalho Externo em Nova Guia
            </a>
          </div>
        ) : isImage ? (
          <img
            src={activeUrl}
            alt={activeSlide.title}
            className="w-full h-full object-cover transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-300">
            <ImageIcon size={36} className="text-emerald-400 mb-2 opacity-80" />
            <p className="text-xs font-semibold">{activeSlide?.title}</p>
          </div>
        )}

        {!isVideoOrEmbed && (
          <>
            {/* Gradiente Escuro de Vidro Editorial na base da foto/infográfico */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

            {/* Selo Territorial e Botão Ampliar no topo */}
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

            {/* Setas de navegação do carrossel (apenas sobre imagens) */}
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
                  {activeSlide.type === 'photo' ? <ImageIcon size={12} /> : <Sparkles size={12} />}
                  {activeSlide.subtitle}
                </span>

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
          </>
        )}
      </div>

      {/* Faixa Limpa Abaixo do Vídeo (sem obstruir controles de Play/Pause/Volume) */}
      {isVideoOrEmbed && activeSlide && (
        <div className="bg-slate-900 text-white px-3.5 py-2.5 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-1.5 truncate">
              <Video size={12} />
              <span>{activeSlide.subtitle} · {community.bioma}</span>
            </span>
            <h3 className="text-xs sm:text-sm font-extrabold text-white truncate">
              {activeSlide.title}
            </h3>
            {activeSlide.caption && (
              <p className="text-[11px] text-slate-300 line-clamp-1">{activeSlide.caption}</p>
            )}
          </div>
          {slides.length > 1 && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={prevSlide}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
                title="Mídia anterior"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
                title="Próxima mídia"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Faixa de Seleção Rápida (Vídeos, Slides & Imagens dos Alunos + Sessão) */}
      {slides.length > 0 && (
        <div className="bg-white border-t border-slate-200/80 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 shrink-0 mr-1">
            Mídias ({slides.length}):
          </span>
          {slides.map((s, idx) => {
            const active = idx === currentSlideIndex;
            const isStudentWork = s.id.startsWith('work-');
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlideIndex(idx)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shrink-0 border transition ${
                  active
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                    : isStudentWork
                    ? 'bg-amber-50 text-amber-950 border-amber-200 hover:bg-amber-100'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                }`}
              >
                {s.type === 'video' ? (
                  <Film size={12} />
                ) : s.type === 'photo' ? (
                  <ImageIcon size={12} />
                ) : (
                  <Sparkles size={12} />
                )}
                <span className="truncate max-w-[180px]">{s.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Barra de Áudio Fluido do Guia Gemini (Abaixo da Janela Visual) */}
      <div className="bg-[#f5f2e8] px-3 sm:px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 sm:gap-3 border-t border-slate-200/90">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <button
            onClick={onToggleAudio}
            disabled={isAudioLoading}
            className={`px-3 py-2 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
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

