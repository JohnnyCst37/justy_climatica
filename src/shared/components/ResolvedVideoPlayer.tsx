import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Play, VideoOff } from 'lucide-react';
import {
  isFirestoreChunkedVideoUrl,
  resolveFirestoreVideoBlobUrl,
} from '../../modules/submissions/services/firestoreVideoStorage';

interface ResolvedVideoPlayerProps {
  src: string;
  className?: string;
}

export const ResolvedVideoPlayer: React.FC<ResolvedVideoPlayerProps> = ({
  src,
  className = 'w-full h-full object-contain',
}) => {
  const isChunked = isFirestoreChunkedVideoUrl(src);
  const [resolvedSrc, setResolvedSrc] = useState<string>(isChunked ? '' : src);
  const [loading, setLoading] = useState<boolean>(isChunked);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let active = true;
    setPlaying(false);
    if (!isFirestoreChunkedVideoUrl(src)) {
      setResolvedSrc(src);
      setLoading(false);
      setErrorMsg(null);
      return undefined;
    }

    setLoading(true);
    setErrorMsg(null);
    resolveFirestoreVideoBlobUrl(src)
      .then((blobUrl) => {
        if (!active) return;
        setResolvedSrc(blobUrl);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setErrorMsg(err instanceof Error ? err.message : 'Não foi possível carregar o vídeo.');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [src]);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-200 gap-2 p-4">
        <Loader2 size={22} className="animate-spin text-emerald-400" />
        <span className="text-xs font-semibold">Carregando vídeo da turma...</span>
      </div>
    );
  }

  if (errorMsg || !resolvedSrc) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-rose-300 gap-2 p-4 text-center">
        <VideoOff size={22} />
        <span className="text-xs font-semibold max-w-md">{errorMsg || 'Vídeo indisponível.'}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        key={resolvedSrc}
        src={resolvedSrc}
        controls
        playsInline
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setErrorMsg(
            src.startsWith('blob:')
              ? 'Vídeo de teste antigo expirado. Exclua este item em /enviar e envie o arquivo MP4 novamente para gravar no banco.'
              : 'Não foi possível reproduzir este arquivo de vídeo.'
          );
        }}
        className={className}
      />
      {!playing && (
        <button
          type="button"
          onClick={() => void videoRef.current?.play().catch(() => undefined)}
          aria-label="Reproduzir vídeo"
          className="absolute top-0 inset-x-0 bottom-12 flex items-center justify-center bg-slate-950/20 hover:bg-slate-950/10 transition-colors cursor-pointer"
        >
          <span className="w-14 h-14 rounded-full bg-emerald-700/90 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl border border-white/25">
            <Play size={24} className="ml-0.5 fill-white" />
          </span>
        </button>
      )}
    </div>
  );
};
