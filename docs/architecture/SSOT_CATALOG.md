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
| **Gateway Zero-Trust** | `server/middleware/authMiddleware.ts` | `requireAuth`, `rateLimitMiddleware`, bloqueio de `userKey` |
| **FinOps & Anti-TOCTOU** | `server/services/quotaGuard.ts` | Reserva atômica (`acquire -> commit/release`) + disjuntor 429 |
| **Jaula de Ingestão** | `server/utils/ingestionCage.ts` | Magic bytes (PNG/JPEG/WebP), allowlist de URLs e `<DOCUMENT_DATA_RAW>` |
| **Orquestrador Gemini** | `server/services/geminiService.ts` | `gemini-3.8-flash` + Zod, `googleSearch`, `gemini-3.8-live`, TTS cacheado |
