# GEMINI.md — Vozes do Clima & BioPatrimônio MT (`justy_climatica`)

## 1. Ritual em 3 Passos (Obrigatório)
1. Leia `docs/BRAIN/ACTIVE_ONE.md`
2. Leia o topo de `docs/MANAGEMENT/PROGRESS_LOG.md`
3. Consulte `docs/architecture/SSOT_CATALOG.md` e `docs/architecture/AI_ARCHITECTURE_SCORECARD.md`

## 2. Stack & Hospedagem
- **Frontend:** React 19, TypeScript (Strict, zero `any`), Tailwind CSS, Vite 6, D3 + TopoJSON, Lucide React
- **Deploy Web & API Serverless:** Vercel (`vercel.json` + `api/index.ts`)
- **Dados, Auth & Storage:** Firebase (`climate-justicy` — Auth, Firestore, Storage)
- **IA:** `@google/genai` (`gemini-3.8-live` via ephemeral token, `gemini-3.8-flash` + Google Search + Zod, `gemini-3.8-flash-lite-tts`)

## 3. Regras Invioláveis
- **3 Jornadas Isoladas:** `1. Justiça Climática`, `2. Ciência Clara`, `3. Saberes & Escolas` — nunca misturar blocos entre jornadas.
- **LGPD Escolar (MT):** Estudantes entram com Código da Turma + Apelido (Auth pseudonimizado); zero coleta obrigatória de PII de menores.
- **Zero-Trust & Sentinel:** UI `<= 380 SLOC`, Hooks `<= 250 SLOC`, Services `<= 420 SLOC`; zero `UI + DB` (`M1`) ou `UI + AI` (`M2`); zero chaves no client.
- **Portões de Entrega:** `npm run lint` + `npm run test:load` + `npm run build` + `node C:/Projetos/jf-architecture-sentinel/bin/repo-doctor.mjs "C:\Projetos\justy_climatica" --strict`.

