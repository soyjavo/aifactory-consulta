import { GoogleGenerativeAI } from "@google/generative-ai";
import type { StructuredConsultation } from "./types";

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (client) return client;

  const key = process.env.GOOGLE_GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      "GOOGLE_GEMINI_API_KEY missing. Set it in .env.local before calling Gemini.",
    );
  }

  client = new GoogleGenerativeAI(key);
  return client;
}

export function getExtractionModel() {
  return getClient().getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });
}

export async function extractStructuredConsultation(
  transcript: string,
): Promise<StructuredConsultation> {
  const model = getExtractionModel();

  const prompt = [
    "You are a bilingual (Spanish/English) clinical scribe.",
    "Extract structured data from the doctor-patient consultation transcript below.",
    "Return JSON matching this TypeScript type exactly:",
    "{ chiefComplaint: string|null, diagnosis: string|null, treatmentPlan: string[], medications: { name: string, dose: string|null, frequency: string|null, duration: string|null }[], followUp: string[] }",
    "Preserve the language the doctor used. Do not fabricate fields not present in the transcript — return null or empty arrays instead.",
    "",
    "TRANSCRIPT:",
    transcript,
  ].join("\n");

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text) as StructuredConsultation;
}
