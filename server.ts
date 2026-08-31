import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for AI Batik Heritage Description generator
  app.post("/api/gemini/generate-description", async (req, res) => {
    try {
      const { motifName, technique, region, keywords } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ 
          error: "GEMINI_API_KEY environment variable is not configured." 
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are a master curator of Indonesian Batik Heritage at Batik Nusantara.
Write a culturally deep, poetic, and authentic heritage description for a batik piece.
Details provided:
- Motif Name: ${motifName || "Batik Tulis Piece"}
- Craft Technique: ${technique || "Tulis"}
- Region/Origin: ${region || "Java"}
- Keywords/Notes: ${keywords || "Traditional natural wax-resist technique"}

Return raw JSON only without markdown syntax block:
{
  "heritageDescription": "A 2-3 sentence philosophical description highlighting technique, symbolism, and cultural narrative.",
  "suggestedPrice": "Estimated price range in IDR, e.g. Rp 2,500,000 - Rp 4,000,000",
  "keyTags": ["tag1", "tag2", "tag3"]
}`,
      });

      const text = response.text || "";
      res.json({ result: text });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      res.status(500).json({ error: err.message || "Failed to generate AI response." });
    }
  });

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Batik Nusantara" });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Batik Nusantara server running on http://localhost:${PORT}`);
  });
}

startServer();
