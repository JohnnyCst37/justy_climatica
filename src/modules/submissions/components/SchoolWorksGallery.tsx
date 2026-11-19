import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Image as ImageIcon,
  Maximize2,
  Pencil,
  Presentation,
  School,
  Trash2,
  Video,
  X,
} from 'lucide-react';
import type { SchoolWork } from '../../../shared/types/domain';
import { SCHOOL_CLASS_OPTIONS } from '../../auth/services/accessControlService';
import { ResolvedVideoPlayer } from '../../../shared/components/ResolvedVideoPlayer';
import {
  isDirectVideoFileUrl,
  toEmbedVideoUrl,
} from '../../../shared/utils/videoEmbedResolver';

interface SchoolWorksGalleryProps {
  communityTitle: string;
  works: SchoolWork[];
  isProfessor: boolean;
  onApprove: (workId: string) => void;
  onUpdate?: (
    work: SchoolWork,
    updates: Partial<Pick<SchoolWork, 'title' | 'classGroup' | 'workType' | 'mediaUrl' | 'description'>>
  ) => Promise<unknown>;
  onDelete?: (work: SchoolWork) => Promise<void>;
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

function isLikelyImageUrl(url: string): boolean {
  if (!url) return false;
  return (
    url.startsWith('data:image/') ||
    /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(url) ||
    url.includes('unsplash.com') ||
    url.startsWith('/images/') ||
    url.startsWith('/assets/images/')
  );
}

export const SchoolWorksGallery: React.FC<SchoolWorksGalleryProps> = ({
  communityTitle,
  works,
  isProfessor,
  onApprove,
  onUpdate,
  onDelete,
}) => {
  const [filter, setFilter] = useState<'all' | 'photos' | 'videos'>('all');
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editClassGroup, setEditClassGroup] = useState('');
  const [editWorkType, setEditWorkType] = useState<SchoolWork['workType']>('video');
  const [editMediaUrl, setEditMediaUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const startEdit = (work: SchoolWork) => {
    setEditingId(work.id);
    setEditTitle(work.title);
    setEditClassGroup(work.classGroup);
    setEditWorkType(work.workType);
    setEditMediaUrl(work.mediaUrl);
    setEditDescription(work.description);
  };

  const handleSaveEdit = async (e: React.FormEvent, work: SchoolWork) => {
    e.preventDefault();
    if (!onUpdate) return;
    setSavingEdit(true);
    try {
      await onUpdate(work, {
        title: editTitle,
        classGroup: editClassGroup,
        workType: editWorkType,
        mediaUrl: editMediaUrl,
        description: editDescription,
      });
      setEditingId(null);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (work: SchoolWork) => {
    if (!onDelete) return;
    setDeletingId(work.id);
    try {
      await onDelete(work);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = works.filter((w) => {
    if (filter === 'videos') return w.workType === 'video';
    if (filter === 'photos') return w.workType !== 'video';
    return true;
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <School size={14} className="text-emerald-700" />
          <span>Galeria de Fotos & Vídeos · {communityTitle}</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10.5px] font-semibold">
          {(
            [
              { key: 'all', label: 'Todos' },
              { key: 'photos', label: 'Fotos & Slides' },
              { key: 'videos', label: 'Vídeos' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-2 py-1 rounded-md transition-colors ${
                filter === tab.key ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-xs text-slate-500 py-4 text-center bg-slate-50 rounded-xl border border-slate-200">
          Nenhum item nesta categoria ainda. Use o próximo passo para enviar o primeiro!
        </p>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((work) => {
            const embed = toEmbedVideoUrl(work.mediaUrl);
            const directVideo = work.workType === 'video' && isDirectVideoFileUrl(work.mediaUrl);
            const isImage = !directVideo && !embed && isLikelyImageUrl(work.mediaUrl);
            const isExternalLink = /^https?:\/\//i.test(work.mediaUrl);

            return (
              <div key={work.id} className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10.5px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1 flex-wrap">
                      {work.workType === 'slide_powerpoint' && <Presentation size={12} />}
                      {work.workType === 'video' && <Video size={12} />}
                      {(work.workType === 'infografico' || work.workType === 'foto_campo') && (
                        <ImageIcon size={12} />
                      )}
                      {work.schoolName} · {work.classGroup} · {getTypeLabel(work.workType)}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-0.5">{work.title}</h4>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                    {work.id.startsWith('seed-') && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        Padrão da Jornada
                      </span>
                    )}
                    {work.status === 'pending' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Clock size={10} /> Aguardando
                      </span>
                    )}
                    {isProfessor && onUpdate && (
                      <button
                        type="button"
                        onClick={() => (editingId === work.id ? setEditingId(null) : startEdit(work))}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 text-[11px] font-bold flex items-center gap-1"
                        title="Editar publicação (inclusive padrão)"
                      >
                        <Pencil size={12} /> <span>Editar</span>
                      </button>
                    )}
                    {isProfessor && onDelete && (
                      <button
                        type="button"
                        disabled={deletingId === work.id}
                        onClick={() => void handleDelete(work)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 disabled:opacity-40 text-[11px] font-extrabold flex items-center gap-1"
                        title="Excluir publicação (inclusive padrão)"
                      >
                        <Trash2 size={12} /> <span>{deletingId === work.id ? '...' : 'Excluir'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {editingId === work.id ? (
                  <form onSubmit={(e) => void handleSaveEdit(e, work)} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-2">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Título da publicação"
                      required
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-semibold"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={editClassGroup}
                        onChange={(e) => setEditClassGroup(e.target.value)}
                        className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-semibold"
                      >
                        {!SCHOOL_CLASS_OPTIONS.includes(editClassGroup) && editClassGroup && (
                          <option value={editClassGroup}>{editClassGroup}</option>
                        )}
                        {SCHOOL_CLASS_OPTIONS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <select
                        value={editWorkType}
                        onChange={(e) => setEditWorkType(e.target.value as SchoolWork['workType'])}
                        className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-semibold"
                      >
                        <option value="video">Vídeo</option>
                        <option value="foto_campo">Foto de Campo</option>
                        <option value="slide_powerpoint">Slide / Canva</option>
                        <option value="infografico">Infográfico</option>
                      </select>
                    </div>
                    <input
                      value={editMediaUrl}
                      onChange={(e) => setEditMediaUrl(e.target.value)}
                      placeholder="Link do YouTube, Canva, Drive ou URI da mídia"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={2}
                      required
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 text-[11px] font-bold text-slate-600 bg-white"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={savingEdit}
                        className="px-3 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1"
                      >
                        <Check size={12} /> {savingEdit ? 'Salvando...' : 'Salvar'}
                      </button>
                    </div>
                  </form>
                ) : directVideo ? (
                  <div className="rounded-lg overflow-hidden aspect-video bg-slate-950 border border-slate-200">
                    <ResolvedVideoPlayer
                      src={work.mediaUrl}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : embed ? (
                  <div className="rounded-lg overflow-hidden aspect-video bg-slate-900 border border-slate-200">
                    <iframe
                      src={embed}
                      title={work.title}
                      className="w-full h-full border-0"
                      allowFullScreen
                    />
                  </div>
                ) : isImage ? (
                  <div className="relative group">
                    <img
                      src={work.mediaUrl}
                      alt={work.title}
                      className="w-full h-40 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      onClick={() => setZoomImage(work.mediaUrl)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/75 text-white opacity-90 hover:opacity-100"
                      title="Ampliar imagem"
                    >
                      <Maximize2 size={12} />
                    </button>
                  </div>
                ) : work.mediaUrl ? (
                  <a
                    href={work.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold"
                  >
                    <ExternalLink size={14} /> Abrir Link / Apresentação Externa
                  </a>
                ) : null}

                <p className="text-[11px] text-slate-600 leading-snug">{work.description}</p>

                {isExternalLink && (isImage || Boolean(embed)) && (
                  <a
                    href={work.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:underline"
                  >
                    <ExternalLink size={11} /> Abrir link original
                  </a>
                )}

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
      )}

      {zoomImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-slate-900/80 text-white"
            >
              <X size={18} />
            </button>
            <img
              src={zoomImage}
              alt="Imagem ampliada"
              className="w-full max-h-[85vh] object-contain rounded-xl bg-white p-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};
