import {
  isFirestoreChunkedVideoUrl,
  resolveFirestoreVideoBlobUrl,
} from '../../submissions/services/firestoreVideoStorage';

export interface EventWatermarkMeta {
  title: string;
  classOrGuest?: string;
  dateLabel?: string;
  timeLabel?: string;
  timestamp?: number;
}

export function formatEventTimestamp(ts = Date.now()): {
  dateLabel: string;
  timeLabel: string;
  fileSafeStamp: string;
} {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  const hours = pad(d.getHours());
  const mins = pad(d.getMinutes());
  const secs = pad(d.getSeconds());
  return {
    dateLabel: `${day}/${month}/${year}`,
    timeLabel: `${hours}:${mins}:${secs}`,
    fileSafeStamp: `${year}-${month}-${day}_${hours}h${mins}m${secs}s`,
  };
}

function slugifyFileName(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 42) || 'cobertura-ao-vivo'
  );
}

/**
 * Desenha a Logo oficial do Evento, Nome da Escola, Data/Ano/Hora e legenda no Canvas.
 * Utilizado tanto em fotos quanto em quadros de vídeo gravados em tempo real.
 */
export function drawOfficialEventWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  meta: EventWatermarkMeta
): void {
  const stamp = formatEventTimestamp(meta.timestamp || Date.now());
  const dateStr = meta.dateLabel || stamp.dateLabel;
  const timeStr = meta.timeLabel || stamp.timeLabel;
  const barHeight = Math.max(66, Math.round(height * 0.135));
  const yStart = height - barHeight;

  const grad = ctx.createLinearGradient(0, yStart - 20, 0, height);
  grad.addColorStop(0, 'rgba(6, 24, 18, 0.0)');
  grad.addColorStop(0.28, 'rgba(6, 24, 18, 0.84)');
  grad.addColorStop(1, 'rgba(6, 24, 18, 0.96)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, yStart - 20, width, barHeight + 20);

  const padX = Math.max(14, Math.round(width * 0.022));
  const badgeSize = Math.max(36, Math.round(barHeight * 0.56));
  const badgeX = padX;
  const badgeY = yStart + Math.round((barHeight - badgeSize) / 2);

  // Escudo vetorial oficial do evento (Vozes do Clima MT)
  ctx.save();
  ctx.fillStyle = '#065f46';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = Math.max(2, Math.round(badgeSize * 0.06));
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, Math.round(badgeSize * 0.24));
  ctx.fill();
  ctx.stroke();

  const cx = badgeX + badgeSize / 2;
  const cy = badgeY + badgeSize / 2;
  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.ellipse(cx, cy - badgeSize * 0.04, badgeSize * 0.22, badgeSize * 0.3, -0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fef3c7';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(cx - badgeSize * 0.12, cy + badgeSize * 0.2);
  ctx.lineTo(cx + badgeSize * 0.12, cy - badgeSize * 0.2);
  ctx.stroke();
  ctx.restore();

  const textX = badgeX + badgeSize + Math.round(padX * 0.8);
  const titleSize = Math.max(12, Math.round(barHeight * 0.22));
  const subSize = Math.max(10, Math.round(barHeight * 0.165));

  ctx.textBaseline = 'top';
  ctx.fillStyle = '#fcd34d';
  ctx.font = `800 ${subSize}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(
    `EE CM JOÃO RIBEIRO VILELA · JORNADA DA JUSTIÇA CLIMÁTICA MT`,
    textX,
    badgeY + 1
  );

  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${titleSize}px "Plus Jakarta Sans", sans-serif`;
  const cleanTitle = (meta.title || 'Cobertura Ao Vivo').slice(0, 54);
  ctx.fillText(cleanTitle, textX, badgeY + subSize + 5);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = `600 ${Math.max(9.5, subSize - 1)}px "DM Sans", sans-serif`;
  const subLine = [meta.classOrGuest, `${dateStr} · ${timeStr}`].filter(Boolean).join('  •  ');
  ctx.fillText(subLine, textX, badgeY + subSize + titleSize + 9);

  // Selo superior direito com Data, Ano e Hora ao vivo
  const chipFont = Math.max(10, Math.round(width * 0.015));
  ctx.font = `700 ${chipFont}px "IBM Plex Mono", monospace`;
  const chipText = `AO VIVO · ${dateStr} ${timeStr}`;
  const chipW = ctx.measureText(chipText).width + 20;
  const chipH = chipFont + 12;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
  ctx.beginPath();
  ctx.roundRect(width - chipW - padX, padX, chipW, chipH, 8);
  ctx.fill();
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(width - chipW - padX + 10, padX + chipH / 2, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillText(chipText, width - chipW - padX + 17, padX + 5);
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Falha ao carregar imagem para marca d’água.'));
    img.src = src;
  });
}

export async function stampPhotoFileWithWatermark(
  fileOrBlob: Blob,
  meta: EventWatermarkMeta
): Promise<string> {
  const objectUrl = URL.createObjectURL(fileOrBlob);
  try {
    const img = await loadImageElement(objectUrl);
    const maxW = 1280;
    const scale = img.width > maxW ? maxW / img.width : 1;
    const width = Math.max(640, Math.round(img.width * scale));
    const height = Math.max(360, Math.round(img.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas indisponível neste dispositivo.');

    ctx.drawImage(img, 0, 0, width, height);
    drawOfficialEventWatermark(ctx, width, height, meta);

    let result = canvas.toDataURL('image/jpeg', 0.84);
    if (result.length > 760_000) {
      result = canvas.toDataURL('image/jpeg', 0.68);
    }
    return result;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function triggerBrowserDownload(url: string, fileName: string): void {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function buildOfficialDownloadFilename(
  meta: EventWatermarkMeta,
  ext: string
): string {
  const stamp = formatEventTimestamp(meta.timestamp || Date.now());
  const dateSafe = (meta.dateLabel || stamp.dateLabel).replace(/\//g, '-');
  const timeSafe = (meta.timeLabel || stamp.timeLabel).replace(/:/g, 'h').slice(0, 8);
  const slug = slugifyFileName(meta.title);
  return `EE-CM-Joao-Ribeiro-Vilela_Jornada-Clima_${dateSafe}_${timeSafe}_${slug}.${ext}`;
}

export async function downloadWatermarkedPhoto(
  imageUrl: string,
  meta: EventWatermarkMeta
): Promise<void> {
  const fileName = buildOfficialDownloadFilename(meta, 'jpg');
  try {
    const img = await loadImageElement(imageUrl);
    const canvas = document.createElement('canvas');
    canvas.width = img.width || 1280;
    canvas.height = img.height || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      triggerBrowserDownload(imageUrl, fileName);
      return;
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    drawOfficialEventWatermark(ctx, canvas.width, canvas.height, meta);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    triggerBrowserDownload(dataUrl, fileName);
  } catch {
    triggerBrowserDownload(imageUrl, fileName);
  }
}

export async function downloadCoverageVideo(
  videoUrl: string,
  meta: EventWatermarkMeta
): Promise<void> {
  const resolvedUrl = isFirestoreChunkedVideoUrl(videoUrl)
    ? await resolveFirestoreVideoBlobUrl(videoUrl)
    : videoUrl;
  const isMp4 = resolvedUrl.includes('mp4') || videoUrl.includes('mp4');
  const fileName = buildOfficialDownloadFilename(meta, isMp4 ? 'mp4' : 'webm');

  if (resolvedUrl.startsWith('blob:') || resolvedUrl.startsWith('data:')) {
    triggerBrowserDownload(resolvedUrl, fileName);
    return;
  }

  try {
    const res = await fetch(resolvedUrl);
    const blob = await res.blob();
    const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
    const blobUrl = URL.createObjectURL(blob);
    triggerBrowserDownload(blobUrl, buildOfficialDownloadFilename(meta, ext));
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 8000);
  } catch {
    triggerBrowserDownload(resolvedUrl, fileName);
  }
}
