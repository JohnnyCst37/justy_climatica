# ADR-0001: Monólito Modular, Tetos de Coesão & Governança Zero-Trust de IA

- **Status:** Aceito (12/11/2026)
- **Contexto:** Prevenir erosão arquitetural em sessões multi-agentes, mistura UI+DB/IA e vazamento de custo FinOps.
- **Decisão:**
  1. Adotar **Regra da Catraca** (`.sentinel-baseline.json`) + tetos máximos por papel (`<=380 SLOC` UI, `<=420 SLOC` Services).
  2. Proibir camadas mistas `UI + AI` (`M2`) e módulos com `>= 3` responsabilidades (`M3`).
  3. Submeter todo endpoint de IA aos 7 Pilares do `AI_ARCHITECTURE_SCORECARD.md`.
