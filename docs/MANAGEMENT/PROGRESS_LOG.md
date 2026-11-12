# 📜 PROGRESS_LOG — Diário de Engenharia (justy_climatica)

## [12/11/2026] Hero Media Banner Protagonista, Áudio Fluido HD e Layout Espaçoso (Regra 60-30-10)
- **Eliminação dos Cards Empilhados e Letras Miúdas:** Substituídos os dois cards apertados com bordas amarelas/cinzas por um `HeroMediaBanner` cinematográfico (proporção 16:10), que integra carrossel de fotografias em alta resolução das comunidades tradicionais, pranchas infográficas estudantis com zoom e janelas para vídeos curtos/documentários escolares.
- **Ampliação Espacial do Painel:** A barra lateral direita foi alargada de 430px para `md:w-[480px] lg:w-[540px] xl:w-[600px]`, proporcionando amplo respiro e conformidade com o design system `royal-design-expert` (60% fundo neutro calmo `#fdfbf7`, 30% tipografia ardósia profunda `#0f172a`, 10% acentos táteis esmeralda e âmbar).
- **Áudio Fluido HD Desbloqueado para Visitantes:** Desacoplada a narração de voz da obrigatoriedade de login em `useGuideAssistant.ts`. Agora qualquer visitante ou aluno de escola pública ouve a voz humana/documental do Gemini HD (`Aoede` / `Kore`) com visualização de ondas sonoras animadas diretamente na barra do banner.
- **Arquitetura de Áudio Explicada:** Documentada a diferença estrutural entre o assistente Gemini do Android (Speech-to-Speech bidirecional via WebSockets PCM 16kHz/24kHz sem camada textual intermediária) e a web, integrando o cliente `LiveVoiceSession` para tokens efêmeros e o fallback com prosódia calibrada em PT-BR.
- **Auditoria Sentinel v2.0:** Extraído serviço `soundNarrator.ts`, mantendo `useGuideAssistant.ts` rigorosamente abaixo de 250 SLOC (247 SLOC). 100% de aprovação na Catraca Zero Trust e teste de concorrência com 62 usuários simultâneos.

## [12/11/2026] Refatoração Modular, Firebase `climate-justicy`, Vercel & Motor Gemini Híbrido
- **Reestruturação Modular:** Monólitos da raiz (`App.tsx`, `FichaCuradoria.tsx`, `PainelJusticaClimatica.tsx`, `MapCanvas.tsx`, `dadosMural.ts`) migrados para `src/modules/{auth,map,journeys,assistant,submissions}` e `src/shared/*`.
- **Experiência Gradativa (3 Jornadas Isoladas):** Criado painel único à direita com `1. Justiça Climática`, `2. Ciência Clara` e `3. Saberes & Escolas` (1 passo por vez, progresso salvo por usuário).
- **Motor Gemini Híbrido Zero-Trust:** Gateway Express + Vercel Serverless (`api/index.ts`) com `requireAuth`, `quotaGuard` Anti-TOCTOU, validação `zod`, busca web (`googleSearch`) para comunidades sem voz, TTS com cache e tokens efêmeros para `gemini-3.8-live`.
- **Firebase `climate-justicy` + Vercel:** Criado app Web no projeto `climate-justicy`, configuradas regras Zero-Trust/LGPD (`firestore.rules`, `firestore.indexes.json`, `storage.rules`) e `vercel.json`.

## [12/11/2026] Inicialização Sentinel v2.0
- Instalada arquitetura documental, catraca `.sentinel-baseline.json` e Scorecard IA (52/100).
