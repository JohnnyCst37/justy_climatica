# Skill de Segurança Zero Trust (justy_climatica)

1. Zero chaves `GEMINI_API_KEY` em `VITE_*` / `NEXT_PUBLIC_*` ou `userKey` do cliente.
2. Gateway autenticado + header `x-goog-api-key` + reserva atômica Anti-TOCTOU.
3. Ingestão segura: Magic Bytes binários + Anti-DDE CSV + jaula `<DOCUMENT_DATA_RAW>`.
4. Zero `serviceAccountKey.json` em disco (usar ADC: `gcloud auth print-access-token`).
