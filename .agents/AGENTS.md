# justy_climatica — Regras Multi-Agente (Progressive Disclosure)

1. **Ritual em 3 Passos:** Ler `docs/BRAIN/ACTIVE_ONE.md`, topo de `docs/MANAGEMENT/PROGRESS_LOG.md` e `docs/architecture/SSOT_CATALOG.md`.
2. **Tetos de Coesão:** UI `<= 380 SLOC`, Hooks `<= 250 SLOC`, Services `<= 420 SLOC`. Zero mistura `UI + DB` ou `UI + AI`.
3. **Zero-Trust IA & FinOps:** Nenhuma chave pública no client, usar header `x-goog-api-key`, reserva Anti-TOCTOU e disjuntor 429.
4. **Portões Antes de Concluir:** `npm run lint` + `npm run audit:platform` + atualizar `PROGRESS_LOG.md`.
