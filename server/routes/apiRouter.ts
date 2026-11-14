import { Router, type Response } from 'express';
import { getAdminStorage, isAdminReady } from '../config/firebaseAdmin.js';
import {
  type AuthenticatedRequest,
  rateLimitMiddleware,
  rejectClientSuppliedApiKeys,
  requireAuth,
} from '../middleware/authMiddleware.js';
import {
  assistantStepRequestSchema,
  liveTokenRequestSchema,
  ttsRequestSchema,
  uploadWorkRequestSchema,
} from '../schemas/aiSchemas.js';
import {
  createEphemeralLiveToken,
  generateGuidedAssistantReply,
  synthesizeNarration,
} from '../services/geminiService.js';
import {
  acquireQuotaSlot,
  commitQuotaUsage,
  releaseQuotaReservation,
  sanitizeAiErrorMessage,
} from '../services/quotaGuard.js';
import { validateImageMagicBytes } from '../utils/ingestionCage.js';

export const apiRouter = Router();

apiRouter.use(rejectClientSuppliedApiKeys);

apiRouter.get('/health', (_req, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY || process.env.API_KEY),
    firebaseAdminReady: isAdminReady(),
  });
});

apiRouter.post(
  '/assistant/step',
  requireAuth,
  rateLimitMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = assistantStepRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Dados da jornada inválidos.', details: parsed.error.flatten() });
      return;
    }

    const uid = req.authUser?.uid || 'anon';
    const quota = await acquireQuotaSlot(uid, 0.02);
    if (!quota.allowed || !quota.reservationId) {
      res.status(429).json({
        error: 'Limite de uso simultâneo ou cota diária atingida. Tente novamente em instantes.',
        code: quota.code,
      });
      return;
    }

    try {
      const reply = await generateGuidedAssistantReply(parsed.data);
      await commitQuotaUsage(uid, quota.reservationId, 0.012, 0.02);
      res.json(reply);
    } catch (error) {
      await releaseQuotaReservation(uid, quota.reservationId, 0.02);
      const safe = sanitizeAiErrorMessage(error);
      res.status(safe.status).json({ error: safe.message });
    }
  }
);

apiRouter.post(
  '/live-token',
  requireAuth,
  rateLimitMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = liveTokenRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Parâmetros inválidos para sessão de voz.' });
      return;
    }

    const uid = req.authUser?.uid || 'anon';
    const quota = await acquireQuotaSlot(uid, 0.04);
    if (!quota.allowed || !quota.reservationId) {
      res.status(429).json({
        error: 'Muitas sessões de voz abertas no momento. Use o chat por texto ou aguarde.',
        code: quota.code,
      });
      return;
    }

    try {
      const tokenPayload = await createEphemeralLiveToken(parsed.data);
      await commitQuotaUsage(uid, quota.reservationId, 0.03, 0.04);
      res.json(tokenPayload);
    } catch (error) {
      await releaseQuotaReservation(uid, quota.reservationId, 0.04);
      const safe = sanitizeAiErrorMessage(error);
      res.status(safe.status).json({ error: safe.message });
    }
  }
);

apiRouter.post(
  '/narrar-historia',
  rateLimitMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = ttsRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Texto inválido para narração.' });
      return;
    }

    const uid = `${req.authUser?.uid || req.ip || 'public-visitor'}:${parsed.data.slideId}`;
    const quota = await acquireQuotaSlot(uid, 0.015);
    if (!quota.allowed || !quota.reservationId) {
      res.status(429).json({
        error: 'Cota temporária de narração atingida. Aguarde alguns segundos.',
        code: quota.code,
      });
      return;
    }

    try {
      const payload = await synthesizeNarration(parsed.data);
      await commitQuotaUsage(uid, quota.reservationId, 0.01, 0.015);
      res.json(payload);
    } catch (error) {
      await releaseQuotaReservation(uid, quota.reservationId, 0.015);
      const safe = sanitizeAiErrorMessage(error);
      res.status(safe.status).json({ error: safe.message });
    }
  }
);

apiRouter.post(
  '/upload-work',
  requireAuth,
  rateLimitMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = uploadWorkRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Dados do trabalho inválidos.', details: parsed.error.flatten() });
      return;
    }

    const validation = validateImageMagicBytes(parsed.data.base64Data, parsed.data.mimeType);
    if (!validation.valid || !validation.buffer || !validation.detectedMime) {
      res.status(400).json({ error: validation.reason || 'Arquivo rejeitado pela validação de segurança.' });
      return;
    }

    const uid = req.authUser?.uid || 'anon';
    const storage = getAdminStorage();

    if (isAdminReady() && storage) {
      const ext = validation.detectedMime.split('/')[1] || 'png';
      const safePath = `school_works/${uid}/${Date.now()}_${parsed.data.communityId}.${ext}`;
      const bucket = storage.bucket();
      const file = bucket.file(safePath);
      await file.save(validation.buffer, {
        metadata: { contentType: validation.detectedMime },
      });
      await file.makePublic().catch(() => undefined);
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${safePath}`;
      res.json({ url: publicUrl, storagePath: safePath });
      return;
    }

    res.json({
      url: `data:${validation.detectedMime};base64,${validation.buffer.toString('base64')}`,
      storagePath: 'local-inline',
    });
  }
);
