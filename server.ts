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

  // API Route for AI Categorization
  app.post("/api/ai/categorize", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: "Text is required" });

      // @ts-ignore
      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      // @ts-ignore
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Tugas: Ekstrak nominal dan tentukan kategori pengeluaran dari teks berikut dalam bahasa Indonesia.
        Teks: "${text}"
        Kategori yang tersedia: Makanan, Transportasi, Hiburan, Belanja, Tagihan, Tabungan, Lainnya.
        Format respons: JSON murni tanpa markdown, contoh: {"amount": 25000, "category": "Makanan", "description": "Makan siang di warteg"}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const jsonStr = response.text().replace(/```json|```/g, "").trim();
      res.json(JSON.parse(jsonStr));
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Failed to categorize with AI" });
    }
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
