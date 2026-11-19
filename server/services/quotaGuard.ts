export {
  type QuotaAcquireResult,
  type AtomicQuotaEngine,
  type AiQuotaHealthStatus,
  type AiQuotaTelemetry,
  createInMemoryAtomicQuotaEngine,
  acquireQuotaSlot,
  commitQuotaUsage,
  releaseQuotaReservation,
  recordAiCallSuccess,
  recordAiCallFailure,
  getAiQuotaTelemetry,
  sanitizeAiErrorMessage,
} from '../../api/_lib/quotaGuard.js';
