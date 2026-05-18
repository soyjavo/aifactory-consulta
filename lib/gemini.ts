import { GoogleGenAI } from "@google/genai";
import type { StructuredConsultation } from "./types";

const MODEL = "gemini-2.5-flash";

let cached: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (cached) return cached;
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GOOGLE_GEMINI_API_KEY missing. Set it in .env.local before calling Gemini.",
    );
  }
  cached = new GoogleGenAI({ apiKey });
  return cached;
}

export async function transcribeAudio(
  audioBase64: string,
  mimeType: string,
): Promise<string> {
  const client = getClient();

  const response = await client.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: "Transcribe this medical consultation audio accurately. Preserve any code-switching between Spanish and English. Output ONLY the transcription text, no metadata, no formatting marks.",
          },
          {
            inlineData: {
              data: audioBase64,
              mimeType,
            },
          },
        ],
      },
    ],
  });

  const text = response.text;
  if (!text) throw new Error("Gemini returned an empty transcription.");
  return text.trim();
}

export async function extractStructured(
  transcript: string,
): Promise<StructuredConsultation> {
  const client = getClient();

  const prompt = [
    "You are a medical scribe extracting structured data from a specialty clinic consultation transcript. Return ONLY valid JSON matching this schema:",
    "{",
    "  chief_complaint: string (1-2 sentences),",
    "  diagnosis: string (or 'Pendiente' if unclear),",
    "  treatment_plan: string (or 'No especificado' if none),",
    "  medications: [{ name, dose, frequency, duration }],",
    "  follow_up_items: string[],",
    "  language_detected: 'es' | 'en' | 'mixed'",
    "}",
    "If a field is not mentioned in the transcript, use reasonable defaults: empty array for lists, 'No especificado' for strings.",
    "Transcript:",
    transcript,
  ].join("\n");

  const response = await client.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text;
  if (!text) throw new Error("Gemini returned empty extraction.");
  return JSON.parse(text) as StructuredConsultation;
}
