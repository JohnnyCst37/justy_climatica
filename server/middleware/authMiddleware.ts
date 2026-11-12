import type { NextFunction, Request, Response } from 'express';
import { getAdminAuth, isAdminReady } from '../config/firebaseAdmin.js';

export interface AuthenticatedRequest extends Request {
  authUser?: {
    uid: string;
    role: 'student' | 'visitor' | 'professor';
    isAnonymous: boolean;
  };
}

interface RateBucket {
  count: number;
  resetAt: number;
}

const rateBuckets = new Map<string, RateBucket>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 30;

export function rejectClientSuppliedApiKeys(req: Request, res: Response, next: NextFunction): void {
  const body = (req.body || {}) as Record<string, unknown>;
  if ('userKey' in body || 'apiKey' in body || typeof req.query.key === 'string') {
    res.status(400).json({
      error: 'Chaves de API não podem ser enviadas pelo navegador. Operação bloqueada pelo Zero-Trust.',
    });
    return;
  }
  next();
}

export function rateLimitMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const key = req.authUser?.uid || req.ip || 'anonymous-ip';
  const now = Date.now();
  const current = rateBuckets.get(key);

  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    res.status(429).json({
      error: 'Muitas solicitações em sequência. Aguarde alguns segundos para continuar.',
      code: 'RATE_LIMIT_EXCEEDED',
    });
    return;
  }

  current.count += 1;
  next();
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const classroomToken = typeof req.headers['x-classroom-session'] === 'string'
    ? req.headers['x-classroom-session'].trim()
    : '';

  const adminAuth = getAdminAuth();
  if (bearer && adminAuth) {
    try {
      const decoded = await adminAuth.verifyIdToken(bearer);
      const email = (decoded.email || '').toLowerCase();
      const allowlist = (process.env.PROFESSOR_ALLOWLIST_EMAILS || '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      const isProf = decoded.role === 'professor' || (Boolean(email) && allowlist.includes(email));

      req.authUser = {
        uid: decoded.uid,
        role: isProf ? 'professor' : decoded.firebase?.sign_in_provider === 'anonymous' ? 'student' : 'visitor',
        isAnonymous: decoded.firebase?.sign_in_provider === 'anonymous',
      };
      next();
      return;
    } catch {
      res.status(401).json({ error: 'Sessão expirada ou token inválido. Faça login novamente.' });
      return;
    }
  }

  // Modo escola sem Firebase Admin SDK configurado no ambiente local: exige sessão explícita
  if (!isAdminReady() && classroomToken.length >= 6 && /^[a-zA-Z0-9_-]{6,64}$/.test(classroomToken)) {
    req.authUser = {
      uid: `classroom:${classroomToken}`,
      role: 'student',
      isAnonymous: true,
    };
    next();
    return;
  }

  res.status(401).json({
    error: 'Autenticação necessária para acionar o assistente. Entre com sua turma ou conta Google.',
  });
}
