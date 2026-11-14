import { z } from 'zod';

export const journeyIdSchema = z.enum(['justica', 'ciencia', 'saberes']);

export const assistantStepRequestSchema = z.object({
  communityId: z.string().min(1).max(120),
  communityTitle: z.string().min(1).max(200),
  communityBiome: z.string().min(1).max(80),
  communityLocation: z.string().min(1).max(160),
  activeJourney: journeyIdSchema,
  currentStepIndex: z.number().int().min(0).max(10),
  completedJourneys: z.object({
    justica: z.array(z.number().int()).max(10),
    ciencia: z.array(z.number().int()).max(10),
    saberes: z.array(z.number().int()).max(10),
  }),
  userMessage: z.string().min(1).max(800),
  visitorAge: z.number().int().min(5).max(110).optional(),
  useWebSearch: z.boolean().optional().default(false),
});

export const assistantStructuredResponseSchema = z.object({
  respostaNatural: z.string().min(1),
  resumoEmUmaFrase: z.string().min(1),
  proximoPassoSugerido: z.string().min(1),
  jornadaRecomendada: journeyIdSchema,
  perguntasGuiadas: z.array(z.string().min(1)).min(1).max(3),
  fontesWeb: z.array(
    z.object({
      titulo: z.string(),
      url: z.string().url(),
    })
  ).optional().default([]),
});

export const ttsRequestSchema = z.object({
  texto: z.string().min(2).max(2500),
  slideId: z.string().max(120).optional().default('guide'),
  voz: z.enum(['Aoede', 'Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr']).optional().default('Aoede'),
});

export const liveTokenRequestSchema = z.object({
  communityTitle: z.string().min(1).max(200),
  activeJourney: journeyIdSchema,
  currentStepIndex: z.number().int().min(0).max(10),
});

export const uploadWorkRequestSchema = z.object({
  communityId: z.string().min(1).max(120),
  schoolName: z.string().min(2).max(160),
  classGroup: z.string().min(1).max(80),
  title: z.string().min(3).max(160),
  workType: z.enum(['slide_powerpoint', 'infografico', 'foto_campo']),
  mimeType: z.enum(['image/png', 'image/jpeg', 'image/webp']),
  base64Data: z.string().min(20).max(7_000_000),
});
