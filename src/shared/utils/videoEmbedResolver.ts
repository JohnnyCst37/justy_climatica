/**
 * Converts standard YouTube or Google Drive links into embeddable iframe URLs
 * and detects direct downloadable video files (MP4, WebM, MOV, Firebase Storage).
 */
export function toEmbedVideoUrl(rawUrl: string): string | null {
  const url = rawUrl.trim();
  if (!url) return null;

  const yt = url.match(
    /(?:youtu\.be\/|(?:m\.|www\.)?youtube\.com\/(?:embed\/|shorts\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i
  );
  if (yt?.[1]) {
    return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
  }

  const drive = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (drive?.[1]) {
    return `https://drive.google.com/file/d/${drive[1]}/preview`;
  }

  return null;
}

export function isDirectVideoFileUrl(rawUrl: string): boolean {
  if (!rawUrl) return false;
  return (
    rawUrl.startsWith('firestore-video://') ||
    rawUrl.startsWith('blob:') ||
    rawUrl.startsWith('data:video/') ||
    /\.(mp4|webm|mov)(\?.*)?$/i.test(rawUrl) ||
    rawUrl.includes('firebasestorage.googleapis.com')
  );
}

