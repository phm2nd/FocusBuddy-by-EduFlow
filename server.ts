import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// AI Flashcard Generation
app.post("/api/ai/flashcards", async (req, res) => {
  try {
    const { topic, count = 5 } = req.body;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} educational flashcards about "${topic}". Respond in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING },
              back: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["front", "back", "category"]
          }
        }
      }
    });

    res.json(JSON.parse(response.text || "[]"));
  } catch (error) {
    console.error("Flashcard generation error:", error);
    res.status(500).json({ error: "Failed to generate flashcards" });
  }
});

// AI Tutor Chat
app.post("/api/ai/tutor", async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Convert client messages to Gemini format
    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: "You are a friendly and helpful AI tutor named StudyMate. Explain things simply and clearly. Avoid overly complex language or old-fashioned formal tones. Your goal is to be a supportive companion for students."
      }
    });

    res.json({ content: response.text });
  } catch (error) {
    console.error("Tutor error:", error);
    res.status(500).json({ error: "Failed to connect to AI Tutor" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
