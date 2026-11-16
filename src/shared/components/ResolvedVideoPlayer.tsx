import React, { useEffect, useState } from 'react';
import { Loader2, VideoOff } from 'lucide-react';
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

  useEffect(() => {
    let active = true;
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
        <span className="text-xs font-semibold">{errorMsg || 'Vídeo indisponível.'}</span>
      </div>
    );
  }

  return (
    <video
      key={resolvedSrc}
      src={resolvedSrc}
      controls
      playsInline
      preload="metadata"
      className={className}
    />
  );
};
