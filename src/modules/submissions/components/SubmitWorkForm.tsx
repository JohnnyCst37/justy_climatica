import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import type { SchoolWork } from '../../../shared/types/domain';

interface SubmitWorkFormProps {
  isLoggedIn: boolean;
  onRequestLogin: () => void;
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
}

export const SubmitWorkForm: React.FC<SubmitWorkFormProps> = ({
  isLoggedIn,
  onRequestLogin,
  onSubmitWork,
}) => {
  const [schoolName, setSchoolName] = useState('EE João Ribeiro Vilela');
  const [classGroup, setClassGroup] = useState('9º Ano');
  const [title, setTitle] = useState('');
  const [workType, setWorkType] = useState<SchoolWork['workType']>('slide_powerpoint');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageBase64, setImageBase64] = useState<string>('');
  const [imageMime, setImageMime] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-2">
        <p className="text-xs font-semibold text-amber-950">
          Entre com o código da sua turma para publicar slides, infográficos ou vídeos da sua escola.
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setFeedback('Envie imagens PNG, JPG ou WebP (exporte os slides do PowerPoint como imagem).');
      return;
    }
    setImageMime(file.type as 'image/png' | 'image/jpeg' | 'image/webp');
    const reader = new FileReader();
    reader.onload = () => setImageBase64(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFeedback(null);
    try {
      await onSubmitWork({
        schoolName,
        classGroup,
        title,
        workType,
        description,
        videoUrl: workType === 'video' ? videoUrl : undefined,
        imageFileBase64: workType !== 'video' ? imageBase64 : undefined,
        imageMimeType: workType !== 'video' ? imageMime : undefined,
      });
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setImageBase64('');
      setFeedback('Trabalho enviado com segurança! Assim que o professor aprovar, ele aparecerá para toda a mostra.');
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
        Enviar trabalho da escola em defesa desta comunidade
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="Nome da escola" required className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg" />
        <input value={classGroup} onChange={(e) => setClassGroup(e.target.value)} placeholder="Turma (ex: 9º B)" required className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg" />
      </div>

      <select value={workType} onChange={(e) => setWorkType(e.target.value as SchoolWork['workType'])} className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white">
        <option value="slide_powerpoint">Imagem de Slide (PowerPoint / Canva)</option>
        <option value="infografico">Infográfico Científico</option>
        <option value="foto_campo">Foto de Apresentação / Campo</option>
        <option value="video">Vídeo (YouTube ou Google Drive)</option>
      </select>

      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título do trabalho da equipe" required className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg" />

      {workType === 'video' ? (
        <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/... ou https://drive.google.com/..." required className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg" />
      ) : (
        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} required className="w-full text-[11px] text-slate-600" />
      )}

      <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Resumo curto do que a turma pesquisou..." required className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg" />

      <button type="submit" disabled={sending} className="w-full py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold">
        {sending ? 'Validando e enviando...' : 'Enviar Trabalho para Curadoria'}
      </button>

      {feedback && <p className="text-[11px] text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg p-2">{feedback}</p>}
    </form>
  );
};
