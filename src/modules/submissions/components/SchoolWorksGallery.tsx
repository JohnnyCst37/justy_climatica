import React from 'react';
import { CheckCircle2, Clock, Presentation, School, Video, Image as ImageIcon } from 'lucide-react';
import type { SchoolWork } from '../../../shared/types/domain';

interface SchoolWorksGalleryProps {
  communityTitle: string;
  works: SchoolWork[];
  isProfessor: boolean;
  onApprove: (workId: string) => void;
}

function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (yt?.[1]) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
  const drive = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (drive?.[1]) return `https://drive.google.com/file/d/${drive[1]}/preview`;
  return url;
}

function getTypeLabel(type: SchoolWork['workType']): string {
  switch (type) {
    case 'slide_powerpoint':
      return 'Slide PowerPoint';
    case 'video':
      return 'Vídeo Estudantil';
    case 'infografico':
      return 'Infográfico';
    case 'foto_campo':
      return 'Foto de Campo';
  }
}

export const SchoolWorksGallery: React.FC<SchoolWorksGalleryProps> = ({
  communityTitle,
  works,
  isProfessor,
  onApprove,
}) => {
  return (
    <div className="space-y-3">
      <div className="bg-violet-50/70 border border-violet-200 rounded-xl p-3">
        <div className="text-xs font-bold text-violet-950 flex items-center gap-1.5">
          <School size={14} className="text-violet-700" />
          Que escola está falando hoje sobre {communityTitle}?
        </div>
        <p className="text-[11px] text-slate-600 mt-0.5">
          Apresentações em slides, vídeos, infográficos e fotos produzidos por estudantes em defesa deste território.
        </p>
      </div>

      <div className="space-y-2.5">
        {works.map((work) => {
          const embed = work.workType === 'video' ? getEmbedUrl(work.mediaUrl) : null;
          return (
            <div key={work.id} className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10.5px] font-bold text-violet-800 uppercase tracking-wide flex items-center gap-1">
                    {work.workType === 'slide_powerpoint' && <Presentation size={12} />}
                    {work.workType === 'video' && <Video size={12} />}
                    {(work.workType === 'infografico' || work.workType === 'foto_campo') && <ImageIcon size={12} />}
                    {work.schoolName} · {work.classGroup} · {getTypeLabel(work.workType)}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5">{work.title}</h4>
                </div>

                {work.status === 'pending' && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1 shrink-0">
                    <Clock size={10} /> Aguardando
                  </span>
                )}
              </div>

              {work.workType === 'video' && embed ? (
                <div className="rounded-lg overflow-hidden aspect-video bg-slate-900 border border-slate-200">
                  <iframe src={embed} title={work.title} className="w-full h-full border-0" allowFullScreen />
                </div>
              ) : work.mediaUrl ? (
                <img
                  src={work.mediaUrl}
                  alt={work.title}
                  className="w-full h-36 object-cover rounded-lg border border-slate-200"
                />
              ) : null}

              <p className="text-[11px] text-slate-600 leading-snug">{work.description}</p>

              {isProfessor && work.status === 'pending' && (
                <button
                  onClick={() => onApprove(work.id)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1"
                >
                  <CheckCircle2 size={12} /> Aprovar para Mostra
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
