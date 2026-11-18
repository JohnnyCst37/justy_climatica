export {
  type QuotaAcquireResult,
  type AtomicQuotaEngine,
  createInMemoryAtomicQuotaEngine,
  acquireQuotaSlot,
  commitQuotaUsage,
  releaseQuotaReservation,
  sanitizeAiErrorMessage,
} from '../../api/_lib/quotaGuard.js';
