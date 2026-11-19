import { useEffect, useRef, useState } from 'react';
import {
  drawOfficialEventWatermark,
  ensureOfficialLogoLoaded,
  formatEventTimestamp,
} from '../utils/mediaWatermarkEngine';

export interface CameraMetaConfig {
  title: string;
  classOrGuest: string;
  maxDurationSec: number;
  facingMode: 'environment' | 'user';
}

export function useLiveCameraRecorder(
  meta: CameraMetaConfig,
  onVideoRecorded: (blob: Blob, durationSec: number) => Promise<void>
) {
  const [cameraOn, setCameraOn] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const rafRef = useRef<number>(0);
  const timerRef = useRef<number>(0);
  const metaRef = useRef(meta);
  metaRef.current = meta;
  const finishCbRef = useRef(onVideoRecorded);
  finishCbRef.current = onVideoRecorded;

  const stopCameraTracks = () => {
    window.cancelAnimationFrame(rafRef.current);
    window.clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
    setRecording(false);
  };

  useEffect(() => () => stopCameraTracks(), []);

  const renderCanvasLoop = () => {
    const vid = videoRef.current;
    const canvas = canvasRef.current;
    if (!vid || !canvas || !streamRef.current) return;

    const ctx = canvas.getContext('2d');
    if (ctx && vid.readyState >= 2) {
      if (canvas.width !== 1280 || canvas.height !== 720) {
        canvas.width = 1280;
        canvas.height = 720;
      }
      const vw = vid.videoWidth || 1280;
      const vh = vid.videoHeight || 720;
      const scale = Math.max(canvas.width / vw, canvas.height / vh);
      const dw = vw * scale;
      const dh = vh * scale;
      ctx.drawImage(vid, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);

      const stamp = formatEventTimestamp(Date.now());
      drawOfficialEventWatermark(ctx, canvas.width, canvas.height, {
        title: metaRef.current.title || 'Cobertura Ao Vivo da Mostra',
        classOrGuest: metaRef.current.classOrGuest || 'EE CM João Ribeiro Vilela',
        dateLabel: stamp.dateLabel,
        timeLabel: stamp.timeLabel,
      });
    }
    rafRef.current = window.requestAnimationFrame(renderCanvasLoop);
  };

  const startCamera = async (nextFacing = meta.facingMode) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Câmera ao vivo não suportada neste navegador. Use os botões de arquivo/câmera nativa abaixo.');
      return;
    }
    stopCameraTracks();
    setCameraError(null);
    void ensureOfficialLogoLoaded();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: nextFacing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
      setCameraOn(true);
      rafRef.current = window.requestAnimationFrame(renderCanvasLoop);
    } catch (err) {
      setCameraError(
        err instanceof Error ? err.message : 'Permita o acesso à câmera e ao microfone para transmitir.'
      );
    }
  };

  const stopRecording = () => {
    window.clearInterval(timerRef.current);
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    setRecording(false);
  };

  const startRecording = () => {
    const canvas = canvasRef.current;
    const camStream = streamRef.current;
    if (!canvas || !camStream) return;

    const canvasStream = canvas.captureStream(24);
    const combined = new MediaStream([...canvasStream.getVideoTracks(), ...camStream.getAudioTracks()]);
    const mimeType = ['video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'].find(
      (m) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)
    );
    const recorder = new MediaRecorder(
      combined,
      mimeType ? { mimeType, videoBitsPerSecond: 900_000 } : { videoBitsPerSecond: 900_000 }
    );
    chunksRef.current = [];
    const startedAt = Date.now();
    recorder.ondataavailable = (ev) => {
      if (ev.data.size > 0) chunksRef.current.push(ev.data);
    };
    recorder.onstop = () => {
      const elapsed = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
      const blob = new Blob(chunksRef.current, { type: mimeType || 'video/webm' });
      void finishCbRef.current(blob, elapsed);
    };

    recorderRef.current = recorder;
    recorder.start(1000);
    setRecording(true);
    setElapsedSec(0);
    setCameraError(null);

    timerRef.current = window.setInterval(() => {
      const sec = Math.floor((Date.now() - startedAt) / 1000);
      setElapsedSec(sec);
      if (sec >= metaRef.current.maxDurationSec) {
        stopRecording();
      }
    }, 500);
  };

  const capturePhotoBlob = (): Promise<Blob | null> => {
    const vid = videoRef.current;
    if (vid && vid.readyState >= 2 && vid.videoWidth > 0 && vid.videoHeight > 0) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = vid.videoWidth;
      tempCanvas.height = vid.videoHeight;
      const tCtx = tempCanvas.getContext('2d');
      if (tCtx) {
        tCtx.drawImage(vid, 0, 0, tempCanvas.width, tempCanvas.height);
        return new Promise<Blob | null>((res) => tempCanvas.toBlob(res, 'image/jpeg', 0.92));
      }
    }
    const canvas = canvasRef.current;
    if (!canvas) return Promise.resolve(null);
    return new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.9));
  };

  return {
    videoRef,
    canvasRef,
    cameraOn,
    recording,
    elapsedSec,
    cameraError,
    startCamera,
    startRecording,
    stopRecording,
    capturePhotoBlob,
  };
}
