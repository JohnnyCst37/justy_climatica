# 📚 SSOT_CATALOG — Centrais Canônicas (`justy_climatica`)

| Domínio | Central Canônica (Arquivo Único) | Responsabilidade |
|---|---|---|
| **Firebase Client SDK** | `src/shared/config/firebaseClient.ts` | Inicialização única de Auth, Firestore e Storage (`climate-justicy`) |
| **HTTP Client API** | `src/shared/services/apiClient.ts` | Envio único para `/api/*` com Firebase ID Token / sessão de turma |
| **Auth & LGPD** | `src/modules/auth/services/authService.ts` | Login pseudonimizado de turma + Google Auth + verificação docente |
| **Estado das 3 Jornadas** | `src/modules/journeys/services/journeyService.ts` | Leitura/escrita isolada em `users/{uid}/journeys/{communityId}` |
| **Trabalhos das Escolas** | `src/modules/submissions/services/worksService.ts` | Galeria *"Que escola está falando hoje?"* e moderação |
| **Motor IA Cliente** | `src/modules/assistant/services/assistantApi.ts` | Chamadas de guia passo-a-passo, busca web, TTS e token Live |
| **Voz Bidirecional** | `src/modules/assistant/services/liveVoiceClient.ts` | Sessão WebSocket `gemini-3.8-live` via ephemeral token |
| **Gateway Zero-Trust** | `api/_lib/firebaseJwtVerifier.ts` & `server/middleware/authMiddleware.ts` | Verificação RS256 X.509 Google + `requireAuth` + `rateLimitMiddleware` + bloqueio de `userKey` |
| **Diagnóstico & Chave IA** | `api/_lib/geminiKeyResolver.ts` | Sanitização de chave server-side e `/api/health` sem expor segredos |
| **FinOps & Anti-TOCTOU** | `api/_lib/quotaGuard.ts` (reexportado em `server/services/quotaGuard.ts`) | Reserva atômica (`acquire -> commit/release`) + disjuntor 429 |
| **Jaula de Ingestão** | `api/_lib/ingestionCage.ts` & `src/modules/submissions/utils/fileUploadGuard.ts` | Magic bytes (PNG/JPEG/WebP), bloqueio VBA/SVG e `<DOCUMENT_DATA_RAW>` |
| **Orquestrador Gemini** | `api/_lib/geminiGateway.ts` (reexportado em `server/services/geminiService.ts`) | `gemini-3.8-flash` + Zod, `gemini-3.8-live`, TTS cacheado (`x-goog-api-key`) |
