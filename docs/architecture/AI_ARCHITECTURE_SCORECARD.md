# 🧠 Scorecard Arquitetural de IA, Coesão & Escalabilidade (justy_climatica)

> **Gerado por:** JF Architecture Sentinel v2.0 (Determinístico · Custo R$ 0,00 de Tokens)  
> **Data:** 12/11/2026, 18:47:26  
> **Stack Detectada:** Vite (^6.2.0) · React (^19.2.4) · Express (^4.21.2) · Firebase (^12.6.0) · @google/genai (^3.1.0)

---

## 1. Pontuação Geral da AI Engine: **29 / 100**

| Pilar Avaliado | Pontuação | Status |
|---|---:|:---:|
| **P1. Gateway Zero-Trust & Auth** | 4 / 20 | 🟡 PARCIAL |
| **P2. FinOps & Disjuntor 429** | 0 / 15 | 🔴 AUSENTE |
| **P3. Reserva Atômica Anti-TOCTOU** | 0 / 15 | 🔴 AUSENTE |
| **P4. Governança de Modelos & Parâmetros** | 15 / 15 | 🟢 OK |
| **P5. Saída Estruturada JSON / Zod** | 0 / 10 | 🔴 AUSENTE |
| **P6. Jaula de Ingestão & Prompt Injection** | 0 / 15 | 🔴 AUSENTE |
| **P7. Integridade de Tools (Zero TODO/Mocks)** | 10 / 10 | 🟢 OK |

### Achados Específicos de Arquitetura de IA:
- ✅ Nenhuma violação crítica de gateway, chaves ou tools detectada.


### Proposta de Evolução Arquitetural (Alinhamento Nível 4):
- **Gateway Zero-Trust (P1):** Remover `userKey` do body e `?key=` da URL; implementar Middleware Express (`requireAuth + rateLimit`) antes de `/api/*`.
- **Disjuntor FinOps & 429 (P2):** Adicionar `quotaGuard` por tenant/usuário com teto global e `sanitizeAiErrorMessage` para nunca vazar JSON bruto.
- **Anti-TOCTOU Atômico (P3):** Substituir `check-then-act` por reserva preventiva em voo (`runTransaction` / Redis) com estorno (`release`) em falhas.
- **Saída Estruturada JSON (P5):** Adotar `responseMimeType: "application/json"` com validação runtime `zod` em vez de regexes manuais.
- **Jaula de Ingestão (P6):** Validar Magic Bytes binários (`%PDF`, `PK\x03\x04`) e encapsular texto extraído em `<DOCUMENT_DATA_RAW>`.

---

## 2. Saúde Modular, Monólitos & Coesão SRP (37 arquivos analisados)

- **Acima de 250 SLOC:** 3 | **Acima de 400 SLOC:** 2
- **Mistura `M1 (JSX+DB)`:** 0 | **Mistura `M2 (JSX+AI)`:** 0 | **God Mixing `M3 (>=3 camadas)`:** 1
- **Acúmulo de Hooks (`>= 8`):** 2
- **Duplicação SSOT (`M5`):** Nenhuma detectada
- **Status da Catraca (Ratchet):** 🔴 4 novo(s) bloqueio(s), 0 regressão(ões)

| Arquivo | Papel | SLOC | Hooks (State/Effect) | Misturas |
|---|---|---:|:---:|:---|
| `src/shared/data/communitiesPart1.ts` | SERVICE_API | **507** (teto: 420) | 0 (0S/0E) | — |
| `src/shared/data/communitiesPart2.ts` | SERVICE_API | **504** (teto: 420) | 0 (0S/0E) | — |
| `src/modules/map/components/MapCanvas.tsx` | UI_COMPONENT | **282** (teto: 380) | 12 (2S/3E) | M4 |
| `src/modules/assistant/hooks/useGuideAssistant.ts` | HOOK | **233** (teto: 250) | 10 (3S/1E) | — |
| `src/modules/submissions/components/SubmitWorkForm.tsx` | UI_COMPONENT | **115** (teto: 380) | 6 (6S/0E) | M3 |

---

## 3. Escalabilidade & Multi-Tenancy

- **Firestore Rules:** Presente | **Regras Abertas (`if true`):** 0 | **Índices Compostos:** 3
- ✅ Nenhum gargalo óbvio de regra aberta ou query ampla detectado.
