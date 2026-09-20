import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Safety check regex for critical distress or immediate danger
const EMERGENCY_KEYWORDS = [
  /suicid/i,
  /kill\s+(myself|me)/i,
  /end\s+my\s+life/i,
  /want\s+to\s+die/i,
  /hurt\s+myself/i,
  /self[- ]harm/i,
  /hang\s+myself/i,
  /cut\s+myself/i,
  /overdose/i,
  /jump\s+off/i,
];

function checkCrisisContent(text: string): boolean {
  return EMERGENCY_KEYWORDS.some((regex) => regex.test(text));
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "MindCare AI",
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required." });
    }

    // AI Safety Gate
    if (checkCrisisContent(message)) {
      return res.json({
        isEmergency: true,
        reply:
          "Your safety and life are deeply valuable. MindCare AI cannot provide crisis intervention or emergency care. If you are experiencing thoughts of harming yourself or feeling in immediate danger, please reach out to trusted professionals or emergency services right now. You do not have to carry this alone.",
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Graceful offline fallback response if API key isn't provided yet
      return res.json({
        isEmergency: false,
        reply:
          "Thank you for sharing that with me. It sounds like you're navigating some meaningful feelings right now. While I'm currently running in standard offline mode, remember to take deep, gentle breaths, grant yourself space to pause, and consider taking a short break or writing a brief reflection in your journal. (Note: To enable live Gemini AI dialogue, verify GEMINI_API_KEY in your settings).",
      });
    }

    const systemInstruction = `
You are MindCare AI, a gentle, compassionate, and non-judgmental mental wellness assistant.
Your goal is to offer emotional validation, general self-care ideas, and mindful wellness guidance.

CRITICAL BOUNDARIES:
1. You are NOT a doctor, therapist, psychologist, psychiatrist, or medical professional.
2. NEVER provide a diagnosis, medical labels, or clinical classifications.
3. NEVER prescribe medication, treatments, or promise cures.
4. NEVER claim absolute certainty about the user's mental state.
5. If the user mentions thoughts of self-harm, suicide, or severe immediate danger, warmly urge them to seek immediate human medical or crisis support.
6. Provide gentle, accessible wellness suggestions (such as breathing techniques, progressive relaxation, journaling prompts, hydration, taking a gentle walk, or connecting with a friend).
7. Keep tone warm, grounded, conversational, and respectful. Ask gentle, open-ended follow-up questions when appropriate.
8. Always uphold the disclaimer: MindCare AI provides general wellness information and emotional support; it does not replace professional care.
`;

    // Construct formatted prompt with recent history for context
    let formattedContext = "";
    if (Array.isArray(history) && history.length > 0) {
      formattedContext = history
        .slice(-6)
        .map((h: { sender: string; text: string }) => `${h.sender === "user" ? "User" : "MindCare AI"}: ${h.text}`)
        .join("\n");
      formattedContext += "\n";
    }

    const fullPrompt = `${formattedContext}User: ${message}\nMindCare AI:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText =
      response.text ||
      "I'm listening and here with you. Take a slow, deep breath. Would you like to try a short breathing exercise or reflect together on what would bring you some ease right now?";

    return res.json({
      reply: replyText,
      text: replyText,
      isEmergency: false,
    });
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    const fallback =
      "I'm listening and here with you. Take a gentle, deep breath into your belly. Sometimes acknowledging how we feel is the most courageous step. Would you like to try our 4-4 breathing circle or take a quiet moment for yourself?";
    return res.json({
      reply: fallback,
      text: fallback,
      isEmergency: false,
    });
  }
});

// Single journal reflection summary endpoint
app.post("/api/summarize-journal", async (req, res) => {
  try {
    const { title, content } = req.body;
    const ai = getGeminiClient();

    if (!ai || !content) {
      return res.json({
        summary:
          "In this reflection, you expressed meaningful self-awareness and took a deliberate pause to process your feelings. Setting aside space to express yourself in writing is a constructive habit for mental clarity.",
      });
    }

    const prompt = `You are a supportive, non-clinical mental wellness companion for MindCare AI.
Summarize the following journal entry into 2-3 warm, compassionate sentences highlighting emotional self-awareness and resilience.
DO NOT diagnose any medical or psychological disorder. Do not prescribe anything.

Title: ${title || "Untitled"}
Reflection: ${content}

Summary:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return res.json({
      summary:
        response.text?.trim() ||
        "Your reflection reveals honest emotional awareness and self-compassion. Continuing to name your experiences in writing creates clarity and peace.",
    });
  } catch (err) {
    console.error("Journal summary error:", err);
    return res.json({
      summary:
        "Your reflection reveals honest emotional awareness and self-compassion. Taking time to process feelings through writing is a valuable wellness practice.",
    });
  }
});

// Journal batch summary endpoint
app.post("/api/journal/summary", async (req, res) => {
  try {
    const { entries } = req.body;
    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ error: "No entries provided for summarization." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        summary:
          "Based on your recent notes, you have been actively taking time to reflect and check in with your thoughts. Consistent journaling helps uncover patterns in your daily energy and emotional pace.",
        themes: ["Self-Reflection", "Daily Awareness", "Personal Growth"],
        reflectionPrompt: "What is one small kindness you can show yourself today?",
      });
    }

    const entriesSnippet = entries
      .slice(0, 10)
      .map(
        (e: { title: string; mood: string; content: string; date: string }) =>
          `Date: ${e.date || "Recent"}\nMood: ${e.mood}\nTitle: ${e.title}\nContent: ${e.content}\n---`
      )
      .join("\n");

    const prompt = `
Analyze the following private journal entries to provide a supportive, non-clinical wellness summary.
DO NOT diagnose any disorder or use medical jargon.
Identify 3-4 broad themes (e.g., "Work-Life Balance", "Need for Rest", "Gratitude", "Creativity").
Provide a compassionate 2-3 sentence overview of their emotional journey and suggest one gentle reflection question.

Entries:
${entriesSnippet}

Return JSON with structure:
{
  "summary": "2-3 supportive sentences summarizing patterns",
  "themes": ["Theme 1", "Theme 2", "Theme 3"],
  "reflectionPrompt": "A gentle self-reflection question"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let data;
    try {
      data = JSON.parse(response.text || "{}");
    } catch {
      data = {
        summary: "Your reflections show meaningful self-awareness across your daily experiences.",
        themes: ["Mindfulness", "Self-Care", "Reflection"],
        reflectionPrompt: "What brought you a moment of comfort today?",
      };
    }

    return res.json(data);
  } catch (error) {
    console.error("Journal summary error:", error);
    return res.status(500).json({
      error: "Unable to generate journal summary.",
    });
  }
});

// Setup Vite dev middleware or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MindCare AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
