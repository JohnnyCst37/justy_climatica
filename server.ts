/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Cache em memória no servidor para evitar chamadas repetidas de TTS para o mesmo slide
const ttsAudioCache = new Map<string, { audioUrl: string }>();

async function startServer() {
  const app = express();
  app.set("trust proxy", 2);
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY || process.env.API_KEY),
    });
  });

  // Endpoint Server-Side de Narração em Áudio (Modo História) usando Gemini TTS
  app.post("/api/narrar-historia", async (req, res): Promise<any> => {
    try {
      const { texto, slideId, voz = "Kore" } = req.body || {};
      if (!texto || typeof texto !== "string") {
        return res.status(400).json({ error: "Texto para narração é obrigatório." });
      }

      const cacheKey = `${slideId || ""}:${voz}:${texto.slice(0, 120)}`;
      if (ttsAudioCache.has(cacheKey)) {
        return res.json(ttsAudioCache.get(cacheKey));
      }

      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: "Chave GEMINI_API_KEY não configurada em Settings > Secrets.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash-lite-tts",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: texto,
                speechMetadata: {
                  style: "Narrador de documentário científico e educativo em Português do Brasil, tom acolhedor, claro e didático",
                },
              } as any,
            ],
          },
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voz },
            },
          },
        },
      });

      const part = response.candidates?.[0]?.content?.parts?.[0];
      const base64Audio = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType || "audio/wav";

      if (base64Audio) {
        const payload = {
          audioUrl: `data:${mimeType};base64,${base64Audio}`,
        };
        ttsAudioCache.set(cacheKey, payload);
        return res.json(payload);
      }

      return res.status(500).json({ error: "Não foi possível gerar o áudio da narração." });
    } catch (error: any) {
      console.error("[Backend] Erro na geração de áudio TTS:", error);
      return res.status(500).json({
        error: error.message || "Falha ao sintetizar narração por voz.",
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(["/server.cjs", "/server.cjs.map"], (_req: any, res: any) => res.status(404).end());
    app.use(express.static(distPath));
    app.use((_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Backend] Server running on http://localhost:${PORT}`);
  });
}

startServer();
