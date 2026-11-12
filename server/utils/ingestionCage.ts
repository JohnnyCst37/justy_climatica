const ALLOWED_MEDIA_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'drive.google.com',
  'docs.google.com',
  'www.canva.com',
  'canva.com',
]);

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export interface MagicByteValidationResult {
  valid: boolean;
  detectedMime?: 'image/png' | 'image/jpeg' | 'image/webp';
  buffer?: Buffer;
  reason?: string;
}

export function validateImageMagicBytes(base64Input: string, declaredMime: string): MagicByteValidationResult {
  const cleanBase64 = base64Input.replace(/^data:[^;]+;base64,/, '').trim();
  const buffer = Buffer.from(cleanBase64, 'base64');

  if (buffer.length === 0 || buffer.length > MAX_UPLOAD_BYTES) {
    return { valid: false, reason: 'Arquivo vazio ou maior que o limite seguro de 5 MB.' };
  }

  // Bloqueio explícito de payloads textuais/XML/SVG/VBA disfarçados
  const headAscii = buffer.subarray(0, 64).toString('utf8').toLowerCase();
  if (headAscii.includes('<svg') || headAscii.includes('<!doctype') || headAscii.includes('<html') || headAscii.includes('<script')) {
    return { valid: false, reason: 'Formato XML/SVG/HTML bloqueado pela política de segurança.' };
  }
  if (buffer.includes(Buffer.from('vbaProject.bin'))) {
    return { valid: false, reason: 'Macros VBA detectadas e bloqueadas.' };
  }

  const isPng =
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47;

  const isJpeg =
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff;

  const isWebp =
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP';

  if (isPng && declaredMime === 'image/png') return { valid: true, detectedMime: 'image/png', buffer };
  if (isJpeg && declaredMime === 'image/jpeg') return { valid: true, detectedMime: 'image/jpeg', buffer };
  if (isWebp && declaredMime === 'image/webp') return { valid: true, detectedMime: 'image/webp', buffer };

  return {
    valid: false,
    reason: 'Assinatura binária (magic bytes) não confere com PNG, JPEG ou WebP válidos.',
  };
}

export function validateExternalMediaUrl(rawUrl: string): boolean {
  if (!rawUrl.trim()) return true;
  try {
    const parsed = new URL(rawUrl.trim());
    return parsed.protocol === 'https:' && ALLOWED_MEDIA_HOSTS.has(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function wrapUntrustedData(label: string, rawText: string): string {
  const sanitized = rawText
    .replaceAll('<DOCUMENT_DATA_RAW>', '')
    .replaceAll('</DOCUMENT_DATA_RAW>', '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ')
    .trim();
  return `<DOCUMENT_DATA_RAW label="${label}">\n${sanitized}\n</DOCUMENT_DATA_RAW>`;
}
