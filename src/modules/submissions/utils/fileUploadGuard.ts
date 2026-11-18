export type AllowedImageMime = 'image/png' | 'image/jpeg' | 'image/webp';

const ALLOWED_IMAGE_MIMES = new Set<AllowedImageMime>(['image/png', 'image/jpeg', 'image/webp']);
const ALLOWED_VIDEO_MIMES = new Set(['video/mp4', 'video/webm', 'video/quicktime']);
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

function matchesImageMagicBytes(bytes: Uint8Array, mime: AllowedImageMime): boolean {
  if (mime === 'image/png') {
    return bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  }
  if (mime === 'image/jpeg') {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (mime === 'image/webp') {
    return (
      bytes.length >= 12 &&
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    );
  }
  return false;
}

export async function validateAndReadImageDataUrl(
  file: File
): Promise<{ dataUrl: string; mime: AllowedImageMime }> {
  if (!ALLOWED_IMAGE_MIMES.has(file.type as AllowedImageMime)) {
    throw new Error('Envie imagens PNG, JPG ou WebP (ou exporte o slide do PowerPoint como imagem).');
  }
  const mime = file.type as AllowedImageMime;
  const headerBuffer = await file.slice(0, 12).arrayBuffer();
  if (!matchesImageMagicBytes(new Uint8Array(headerBuffer), mime)) {
    throw new Error('Arquivo rejeitado: assinatura binária não confere com PNG, JPG ou WebP.');
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Falha ao ler a imagem selecionada.'));
    reader.readAsDataURL(file);
  });
  return { dataUrl, mime };
}

export function validateClientVideoFile(file: File): string | null {
  if (!ALLOWED_VIDEO_MIMES.has(file.type)) {
    return 'Formato inválido. Envie um vídeo MP4, WebM ou MOV.';
  }
  if (file.size > MAX_VIDEO_BYTES) {
    return 'Vídeo acima de 50 MB. Reduza o tamanho ou use a opção "Colar Link".';
  }
  return null;
}
