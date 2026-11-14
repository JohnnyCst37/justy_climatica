import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, Film, Video } from 'lucide-react';
import type { CommunityNode, SchoolWork } from '../../../shared/types/domain';
import {
  isDirectVideoFileUrl,
  toEmbedVideoUrl,
} from '../../../shared/utils/videoEmbedResolver';

interface SessionVideosCardProps {
  activeCommunity: CommunityNode;
  works: SchoolWork[];
  videoChoice: 'pending' | 'yes' | 'no';
  praiseText: string;
  onAcceptVideo: () => void;
  onOpenQuiz: () => void;
}

interface PlayableVideoItem {
  id: string;
  title: string;
  classGroup: string;
  description: string;
  mediaUrl: string;
}

export const SessionVideosCard: React.FC<SessionVideosCardProps> = ({
  activeCommunity,
  works,
  videoChoice,
  praiseText,
  onAcceptVideo,
  onOpenQuiz,
}) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const submittedVideos: PlayableVideoItem[] = works
    .filter((w) => w.workType === 'video' && Boolean(w.mediaUrl) && !w.id.startsWith('seed-'))
    .map((w) => ({
      id: w.id,
      title: w.title,
      classGroup: w.classGroup,
      description: w.description,
      mediaUrl: w.mediaUrl,
    }));

  const baseVideo: PlayableVideoItem[] = activeCommunity.videoEquipe.url
    ? [
        {
          id: `seed-${activeCommunity.id}`,
          title: activeCommunity.videoEquipe.titulo || `Vídeo · ${activeCommunity.titulo}`,
          classGroup: activeCommunity.serie,
          description: activeCommunity.videoEquipe.descricao,
          mediaUrl: activeCommunity.videoEquipe.url,
        },
      ]
    : [];

  const videoList = [...submittedVideos, ...baseVideo];

  useEffect(() => {
    setSelectedIdx(0);
  }, [activeCommunity.id, videoList.length]);

  const currentVideo = videoList[selectedIdx] || videoList[0];
  const currentUrl = currentVideo?.mediaUrl || '';
  const isDirectFile = isDirectVideoFileUrl(currentUrl);
  const embedUrl = toEmbedVideoUrl(currentUrl);

  return (
    <div className="rounded-3xl border border-emerald-800/20 bg-white p-5 sm:p-6 shadow-sm space-y-4">
      {videoChoice === 'pending' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
              <Video size={13} /> Passo Seguinte da Jornada
              {videoList.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px]">
                  {videoList.length} {videoList.length === 1 ? 'vídeo' : 'vídeos'}
                </span>
              )}
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Quer assistir a alguns dos vídeos que selecionamos para você nesta sessão?
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onAcceptVideo}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold"
            >
              Sim, assistir vídeo
            </button>
            <button
              type="button"
              onClick={onOpenQuiz}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold"
            >
              Não, ir ao Quiz
            </button>
          </div>
        </div>
      )}

      {videoChoice === 'yes' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 size={20} className="text-emerald-700 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-bold text-emerald-950 leading-relaxed">
              “{praiseText}”
            </p>
          </div>

          {videoList.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {videoList.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                    selectedIdx === idx
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                  }`}
                >
                  <Film size={12} />
                  <span>{item.classGroup}</span>
                  <span className="opacity-80 truncate max-w-[160px]">· {item.title}</span>
                </button>
              ))}
            </div>
          )}

          {currentVideo ? (
            <div className="space-y-2">
              <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200">
                {isDirectFile ? (
                  <video
                    key={currentUrl}
                    src={currentUrl}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <iframe
                    key={embedUrl || currentUrl}
                    src={embedUrl || currentUrl}
                    title={currentVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
              <div className="text-xs text-slate-600 px-1">
                <strong className="text-slate-900">
                  {currentVideo.classGroup} · {currentVideo.title}:
                </strong>{' '}
                {currentVideo.description}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              O vídeo principal desta comunidade está sendo exibido nos slides do banner acima. Quando terminar, participe do desafio abaixo!
            </p>
          )}

          <button
            type="button"
            onClick={onOpenQuiz}
            className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-extrabold flex items-center justify-center gap-2 shadow-sm"
          >
            <Award size={17} /> Finalizar com Desafio Quiz (5 Perguntas)
          </button>
        </div>
      )}
    </div>
  );
};

