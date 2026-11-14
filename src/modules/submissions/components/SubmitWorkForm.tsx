import React, { useState } from 'react';
import { Film, Image as ImageIcon, Link2, UploadCloud } from 'lucide-react';
import type { SchoolWork } from '../../../shared/types/domain';
import { SCHOOL_CLASS_OPTIONS } from '../../auth/services/accessControlService';
import { toEmbedVideoUrl } from '../../../shared/utils/videoEmbedResolver';

interface SubmitWorkFormProps {
  isLoggedIn: boolean;
  isStaffMode?: boolean;
  userClasses?: string[];
  onRequestLogin: () => void;
  onSubmitWork: (input: {
    schoolName: string;
    classGroup: string;
    title: string;
    workType: SchoolWork['workType'];
    description: string;
    videoUrl?: string;
    videoFile?: File;
    imageFileBase64?: string;
    imageMimeType?: 'image/png' | 'image/jpeg' | 'image/webp';
    onUploadProgress?: (pct: number) => void;
  }) => Promise<unknown>;
}

export const SubmitWorkForm: React.FC<SubmitWorkFormProps> = ({
  isLoggedIn,
  isStaffMode = false,
  userClasses,
  onRequestLogin,
  onSubmitWork,
}) => {
  const quickClasses =
    userClasses && userClasses.length > 0
      ? userClasses
      : ['9º Ano A', '9º Ano B', '9º Ano C', '9º Ano D'];
  const [schoolName, setSchoolName] = useState('EE CM João Ribeiro Vilela');
  const [classGroup, setClassGroup] = useState(quickClasses[0] || '9º Ano A');
  const [studentTeam, setStudentTeam] = useState('');
  const [title, setTitle] = useState('');
  const [workType, setWorkType] = useState<SchoolWork['workType']>('video');
  const [videoSourceMode, setVideoSourceMode] = useState<'file' | 'link'>('file');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const embedPreview = videoSourceMode === 'link' ? toEmbedVideoUrl(videoUrl) : null;
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [imageMime, setImageMime] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-center space-y-2">
        <p className="text-xs font-semibold text-amber-950">
          Entre com o código da sua turma para publicar fotos, slides, infográficos ou vídeos na galeria.
        </p>
        <button
          onClick={onRequestLogin}
          className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold"
        >
          Entrar para Enviar Trabalho
        </button>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setFeedback('Envie imagens PNG, JPG ou WebP (ou exporte o slide do PowerPoint como imagem).');
      return;
    }
    setFeedback(null);
    setImageMime(file.type as 'image/png' | 'image/jpeg' | 'image/webp');
    const reader = new FileReader();
    reader.onload = () => setImageBase64(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type)) {
      setFeedback('Formato inválido. Envie um vídeo MP4, WebM ou MOV.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setFeedback('Vídeo acima de 50 MB. Reduza o tamanho ou use a opção "Colar Link".');
      return;
    }
    setFeedback(null);
    setVideoFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setUploadProgress(0);
    setFeedback(null);
    try {
      const cleanTeam = studentTeam.trim();
      const fullDescription = cleanTeam ? `Equipe: ${cleanTeam} — ${description}` : description;
      await onSubmitWork({
        schoolName,
        classGroup,
        title,
        workType,
        description: fullDescription,
        videoUrl: workType === 'video' && videoSourceMode === 'link' ? videoUrl : undefined,
        videoFile: workType === 'video' && videoSourceMode === 'file' && videoFile ? videoFile : undefined,
        imageFileBase64: workType !== 'video' ? imageBase64 : undefined,
        imageMimeType: workType !== 'video' ? imageMime : undefined,
        onUploadProgress: setUploadProgress,
      });
      setTitle('');
      setStudentTeam('');
      setDescription('');
      setVideoUrl('');
      setVideoFile(null);
      setImageBase64('');
      setUploadProgress(0);
      setFeedback(
        isStaffMode
          ? 'Publicado imediatamente na galeria em nome dos alunos!'
          : 'Enviado com sucesso! Já está salvo na galeria (sujeito à aprovação do professor).'
      );
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erro ao enviar trabalho.');
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5">
      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
        <UploadCloud size={14} className="text-emerald-700" />
        Enviar foto ou vídeo da turma para a Galeria
      </div>

      {isStaffMode && (
        <div className="text-[11px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5">
          Modo Professor/Coordenação: publicação imediata na galeria em nome dos alunos
        </div>
      )}

      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mr-1">
            Turma:
          </span>
          {quickClasses.map((turma) => (
            <button
              key={turma}
              type="button"
              onClick={() => setClassGroup(turma)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition ${
                classGroup === turma
                  ? 'bg-emerald-800 text-white border-emerald-800'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
              }`}
            >
              {turma}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="Nome da escola" required className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg" />
          <input
            list="submit-work-turmas"
            value={classGroup}
            onChange={(e) => setClassGroup(e.target.value)}
            placeholder="Turma deste trabalho (ex: 9º Ano A)"
            required
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg font-semibold"
          />
        </div>
        <datalist id="submit-work-turmas">
          {SCHOOL_CLASS_OPTIONS.map((turma) => (
            <option key={turma} value={turma} />
          ))}
        </datalist>
      </div>

      <input
        value={studentTeam}
        onChange={(e) => setStudentTeam(e.target.value)}
        placeholder="Equipe / Alunos Autores (ex: Ana, Lucas e Pedro)"
        required
        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
      />

      <select value={workType} onChange={(e) => setWorkType(e.target.value as SchoolWork['workType'])} className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-semibold">
        <option value="video">Vídeo Selecionado / Documentário (Link YouTube ou MP4 Baixado)</option>
        <option value="foto_campo">Foto de Apresentação / Campo</option>
        <option value="slide_powerpoint">Imagem de Slide (PowerPoint / Canva)</option>
        <option value="infografico">Infográfico Científico</option>
      </select>

      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título do vídeo ou trabalho da equipe" required className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg" />

      {workType === 'video' ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setVideoSourceMode('file')}
              className={`py-1 px-2 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 ${
                videoSourceMode === 'file' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <Film size={12} /> 🎬 Vídeo Baixado (MP4)
            </button>
            <button
              type="button"
              onClick={() => setVideoSourceMode('link')}
              className={`py-1 px-2 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 ${
                videoSourceMode === 'link' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <Link2 size={12} /> 🔗 Link do YouTube / Drive
            </button>
          </div>

          {videoSourceMode === 'file' ? (
            <label className="block border border-dashed border-slate-300 rounded-lg p-2.5 text-center cursor-pointer hover:border-emerald-600 bg-slate-50/70">
              <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleVideoChange} required className="hidden" />
              <span className="text-[11px] font-semibold text-slate-700 block">
                {videoFile ? `🎬 ${videoFile.name} (${(videoFile.size / (1024 * 1024)).toFixed(1)} MB)` : 'Selecionar vídeo MP4 / WebM (até 50 MB)'}
              </span>
            </label>
          ) : (
            <div className="space-y-2">
              <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=... ou https://youtu.be/..." required className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg" />
              {embedPreview && (
                <iframe
                  src={embedPreview}
                  title="Pré-visualização do vídeo selecionado"
                  className="w-full h-36 rounded-lg border border-slate-200 bg-slate-950"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <label className="flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-lg p-2.5 cursor-pointer hover:border-emerald-600 bg-slate-50/70">
            <ImageIcon size={14} className="text-emerald-700" />
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} required className="hidden" />
            <span className="text-[11px] font-semibold text-slate-700">
              {imageBase64 ? 'Imagem selecionada (clique para trocar)' : 'Selecionar imagem PNG, JPG ou WebP'}
            </span>
          </label>
          {imageBase64 && (
            <img src={imageBase64} alt="Pré-visualização" className="w-full h-28 object-cover rounded-lg border border-slate-200" />
          )}
        </div>
      )}

      {sending && uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div className="bg-emerald-700 h-1.5 transition-all" style={{ width: `${uploadProgress}%` }} />
        </div>
      )}

      <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Resumo curto do que a turma pesquisou..." required className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg" />

      <button type="submit" disabled={sending} className="w-full py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold">
        {sending ? 'Enviando para a Galeria...' : 'Publicar na Galeria do Evento'}
      </button>

      {feedback && <p className="text-[11px] text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg p-2">{feedback}</p>}
    </form>
  );
};
