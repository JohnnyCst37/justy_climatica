import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Download,
  RefreshCw,
  Square,
  UploadCloud,
  Video,
} from 'lucide-react';
import {
  buildOfficialDownloadFilename,
  triggerBrowserDownload,
} from '../utils/mediaWatermarkEngine';
import { useLiveCameraRecorder } from '../hooks/useLiveCameraRecorder';

interface LiveCameraRecorderCardProps {
  onPublishPhoto: (input: {
    fileOrBlob: Blob;
    title: string;
    caption: string;
    classOrGuest: string;
  }) => Promise<unknown>;
  onPublishVideo: (input: {
    videoFile: File;
    title: string;
    caption: string;
    classOrGuest: string;
    durationSec?: number;
    onProgress?: (pct: number) => void;
  }) => Promise<unknown>;
}

const DURATION_OPTIONS = [
  { label: '1 min (Clipe Live)', sec: 60 },
  { label: '5 min (Apresentação)', sec: 300 },
  { label: '15 min (Entrevista)', sec: 900 },
  { label: '60 min (Completa)', sec: 3600 },
];

const MAX_CLOUD_VIDEO_BYTES = 25 * 1024 * 1024;

function formatTimer(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const LiveCameraRecorderCard: React.FC<LiveCameraRecorderCardProps> = ({
  onPublishPhoto,
  onPublishVideo,
}) => {
  const [meta, setMeta] = useState({
    title: '',
    classOrGuest: '',
    caption: '',
    maxDurationSec: 3600,
    facingMode: 'environment' as 'environment' | 'user',
    autoDownload: true,
  });
  const [status, setStatus] = useState({ uploadPct: 0, busy: false, feedback: '' });

  const handleRecordedBlob = async (blob: Blob, durationSec: number) => {
    const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
    const fileName = buildOfficialDownloadFilename({ title: meta.title || 'cobertura-live' }, ext);

    if (meta.autoDownload || blob.size > MAX_CLOUD_VIDEO_BYTES) {
      const dlUrl = URL.createObjectURL(blob);
      triggerBrowserDownload(dlUrl, fileName);
      window.setTimeout(() => URL.revokeObjectURL(dlUrl), 10_000);
    }

    if (blob.size > MAX_CLOUD_VIDEO_BYTES) {
      setStatus({
        busy: false,
        uploadPct: 0,
        feedback: `Gravação longa (${(blob.size / (1024 * 1024)).toFixed(1)} MB) salva no dispositivo com Logo, Escola e Data/Hora!`,
      });
      return;
    }

    setStatus({ busy: true, uploadPct: 5, feedback: 'Enviando vídeo ao vivo...' });
    try {
      const file = new File([blob], fileName, { type: blob.type || 'video/webm' });
      await onPublishVideo({
        videoFile: file,
        title: meta.title || 'Vídeo Ao Vivo da Mostra',
        caption: meta.caption || 'Apresentação / Entrevista ao vivo · EE CM João Ribeiro Vilela',
        classOrGuest: meta.classOrGuest || 'Cobertura Live',
        durationSec,
        onProgress: (pct) => setStatus((s) => ({ ...s, uploadPct: pct })),
      });
      setStatus({ busy: false, uploadPct: 0, feedback: 'Vídeo com carimbo do evento publicado na Galeria Ao Vivo!' });
    } catch (err) {
      setStatus({
        busy: false,
        uploadPct: 0,
        feedback: err instanceof Error ? err.message : 'Erro ao publicar vídeo.',
      });
    }
  };

  const cam = useLiveCameraRecorder(
    {
      title: meta.title,
      classOrGuest: meta.classOrGuest,
      maxDurationSec: meta.maxDurationSec,
      facingMode: meta.facingMode,
    },
    handleRecordedBlob
  );

  const handleCapturePhoto = async () => {
    setStatus({ busy: true, uploadPct: 0, feedback: '' });
    try {
      const blob = await cam.capturePhotoBlob();
      if (!blob) throw new Error('Falha ao capturar foto da câmera.');
      await onPublishPhoto({
        fileOrBlob: blob,
        title: meta.title || 'Registro Ao Vivo da Mostra',
        caption: meta.caption || 'Cobertura em tempo real · EE CM João Ribeiro Vilela',
        classOrGuest: meta.classOrGuest || 'Mostra 19/11',
      });
      if (meta.autoDownload) {
        const url = URL.createObjectURL(blob);
        triggerBrowserDownload(url, buildOfficialDownloadFilename({ title: meta.title || 'foto-mostra' }, 'jpg'));
        window.setTimeout(() => URL.revokeObjectURL(url), 5000);
      }
      setStatus({ busy: false, uploadPct: 0, feedback: 'Foto com Logo, Escola e Data/Hora publicada na Galeria Ao Vivo!' });
    } catch (err) {
      setStatus({
        busy: false,
        uploadPct: 0,
        feedback: err instanceof Error ? err.message : 'Erro ao publicar foto.',
      });
    }
  };

  const handleNativeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, kind: 'photo' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus({ busy: true, uploadPct: 0, feedback: '' });
    try {
      if (kind === 'photo') {
        await onPublishPhoto({
          fileOrBlob: file,
          title: meta.title || 'Registro Fotográfico da Mostra',
          caption: meta.caption || 'Cobertura oficial · EE CM João Ribeiro Vilela',
          classOrGuest: meta.classOrGuest || 'Mostra 19/11',
        });
        setStatus({ busy: false, uploadPct: 0, feedback: 'Foto publicada com Logo, Escola e Data/Hora!' });
      } else {
        await onPublishVideo({
          videoFile: file,
          title: meta.title || file.name.replace(/\.[^.]+$/, ''),
          caption: meta.caption || 'Vídeo enviado para a Cobertura Ao Vivo',
          classOrGuest: meta.classOrGuest || 'Mostra 19/11',
          onProgress: (pct) => setStatus((s) => ({ ...s, uploadPct: pct })),
        });
        setStatus({ busy: false, uploadPct: 0, feedback: 'Vídeo publicado na Galeria Ao Vivo!' });
      }
    } catch (err) {
      setStatus({
        busy: false,
        uploadPct: 0,
        feedback: err instanceof Error ? err.message : 'Erro no envio do arquivo.',
      });
    }
  };

  const messageToShow = status.feedback || cam.cameraError;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Video size={17} className="text-rose-600" />
          Estúdio de Cobertura Ao Vivo (Foto & Vídeo até 60 min)
        </h2>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900">
          Carimbo automático: Logo + Escola + Data/Hora
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <input
          type="text"
          value={meta.title}
          onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
          placeholder="Título (ex: Entrevista 9º B — Mata Cavalo)"
          className="px-3 py-2.5 min-h-[42px] rounded-xl border border-slate-300 text-sm sm:text-xs font-semibold"
        />
        <input
          type="text"
          value={meta.classOrGuest}
          onChange={(e) => setMeta((m) => ({ ...m, classOrGuest: e.target.value }))}
          placeholder="Entrevistado / Turma (ex: Prof.ª Ana · 9º A)"
          className="px-3 py-2.5 min-h-[42px] rounded-xl border border-slate-300 text-sm sm:text-xs"
        />
      </div>

      <input
        type="text"
        value={meta.caption}
        onChange={(e) => setMeta((m) => ({ ...m, caption: e.target.value }))}
        placeholder="Legenda curta do momento ao vivo (opcional)..."
        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm sm:text-xs"
      />

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700">Duração máxima do vídeo:</span>
          <select
            value={meta.maxDurationSec}
            onChange={(e) => setMeta((m) => ({ ...m, maxDurationSec: Number(e.target.value) }))}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-800"
          >
            {DURATION_OPTIONS.map((opt) => (
              <option key={opt.sec} value={opt.sec}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={meta.autoDownload}
            onChange={(e) => setMeta((m) => ({ ...m, autoDownload: e.target.checked }))}
            className="rounded border-slate-300 text-emerald-700"
          />
          <Download size={13} className="text-emerald-700" />
          <span>Baixar p/ PC/Celular com marca d’água</span>
        </label>
      </div>

      <video ref={cam.videoRef} playsInline muted className="hidden" />
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 flex items-center justify-center">
        <canvas ref={cam.canvasRef} className={cam.cameraOn ? 'w-full h-full object-contain' : 'hidden'} />
        {!cam.cameraOn && (
          <div className="text-center p-6 space-y-3 text-slate-300">
            <Camera size={36} className="mx-auto text-emerald-400" />
            <p className="text-xs sm:text-sm font-semibold max-w-md">
              Ligue a câmera para visualizar e gravar fotos ou vídeos (1 a 60 min) já com a <strong>Logo do Evento, Escola e Data/Hora</strong> ao vivo.
            </p>
            <button
              type="button"
              onClick={() => void cam.startCamera()}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs sm:text-sm font-extrabold inline-flex items-center gap-2"
            >
              <Camera size={16} /> Ligar Câmera Ao Vivo
            </button>
          </div>
        )}
        {cam.recording && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-mono font-extrabold flex items-center gap-2 shadow-md">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>GRAVANDO {formatTimer(cam.elapsedSec)} / {formatTimer(meta.maxDurationSec)}</span>
          </div>
        )}
      </div>

      {cam.cameraOn && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            disabled={status.busy}
            onClick={() => void handleCapturePhoto()}
            className="px-3 py-2.5 min-h-[44px] rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5"
          >
            <Camera size={15} /> Tirar Foto & Publicar
          </button>
          {!cam.recording ? (
            <button
              type="button"
              disabled={status.busy}
              onClick={cam.startRecording}
              className="px-3 py-2.5 min-h-[44px] rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5"
            >
              <Video size={15} /> Gravar Vídeo (até {Math.round(meta.maxDurationSec / 60)} min)
            </button>
          ) : (
            <button
              type="button"
              onClick={cam.stopRecording}
              className="px-3 py-2.5 min-h-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-extrabold flex items-center justify-center gap-1.5"
            >
              <Square size={14} /> Parar, Baixar & Publicar
            </button>
          )}
          <button
            type="button"
            disabled={cam.recording}
            onClick={() => {
              const next = meta.facingMode === 'environment' ? 'user' : 'environment';
              setMeta((m) => ({ ...m, facingMode: next }));
              void cam.startCamera(next);
            }}
            className="px-3 py-2.5 min-h-[44px] rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <RefreshCw size={14} /> Inverter Câmera
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:border-emerald-600 cursor-pointer text-xs font-bold text-slate-700">
          <UploadCloud size={15} className="text-emerald-700" />
          <span>Enviar Foto do Celular/PC</span>
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => void handleNativeFileUpload(e, 'photo')} />
        </label>
        <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:border-emerald-600 cursor-pointer text-xs font-bold text-slate-700">
          <UploadCloud size={15} className="text-rose-600" />
          <span>Enviar Vídeo Gravado (MP4/WebM)</span>
          <input type="file" accept="video/*" capture="environment" className="hidden" onChange={(e) => void handleNativeFileUpload(e, 'video')} />
        </label>
      </div>

      {status.uploadPct > 0 && status.uploadPct < 100 && (
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div className="bg-emerald-700 h-2 transition-all" style={{ width: `${status.uploadPct}%` }} />
        </div>
      )}

      {messageToShow && (
        <div className="text-xs font-semibold text-emerald-950 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2">
          <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
          <span>{messageToShow}</span>
        </div>
      )}
    </div>
  );
};
