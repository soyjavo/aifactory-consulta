import { GoogleGenAI } from "@google/genai";
import type { SoapConsultation } from "./types";

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

const SOAP_PROMPT = `You are a professional medical scribe analyzing a specialty clinic consultation transcript. This is a bidirectional conversation between a patient and a doctor. Extract information in standard SOAP medical format.

Return ONLY valid JSON matching this exact schema:

{
  subjetivo: {
    motivo_consulta: string,
    sintomas: string[],
    sintomas_adicionales: string | null
  },
  objetivo: {
    signos_vitales: {
      ta: string | null,
      fc: number | null,
      fr: number | null,
      temp: number | null,
      sato2: number | null,
      peso: number | null,
      talla: number | null,
      imc: number | null
    },
    exploracion_fisica: string | null
  },
  analisis: {
    diagnostico: string,
    cie10: string[]
  },
  plan: {
    tratamiento_general: string | null,
    recetas: [{medicamento, dosis, frecuencia, duracion}],
    estudios_solicitados: string[],
    referencias: string[],
    seguimiento: string | null,
    proximos_pasos: string | null,
    notas_adicionales: string | null
  },
  language_detected: 'es' | 'en' | 'mixed'
}

Rules:
- If a field is not mentioned in the transcript, use null for strings, [] for arrays, null for numbers. DO NOT invent data.
- For prescriptions, parse carefully: 'one drop every 4 hours for 7 days' → {medicamento: 'eye drops', dosis: 'one drop', frecuencia: 'every 4 hours', duracion: '7 days'}
- Calculate BMI if weight and height are mentioned: peso / (talla_m)²
- Preserve the language of the conversation in all string values — if doctor speaks English, output values in English; if Spanish, output in Spanish
- ICD-10 codes only if explicitly stated

Transcript:
`;

export async function extractStructured(
  transcript: string,
): Promise<SoapConsultation> {
  const client = getClient();

  const response = await client.models.generateContent({
    model: MODEL,
    contents: SOAP_PROMPT + transcript,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text;
  if (!text) throw new Error("Gemini returned empty extraction.");
  return JSON.parse(text) as SoapConsultation;
}
