import { NextResponse } from "next/server";
import { extractStructured } from "@/lib/gemini";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      consultationId?: string;
      transcript?: string;
    };
    const transcript = body.transcript?.trim();
    const consultationId = body.consultationId;

    if (!transcript) {
      return NextResponse.json(
        { error: "transcript is required" },
        { status: 400 },
      );
    }

    const structured = await extractStructured(transcript);

    if (consultationId) {
      const { error } = await getSupabase()
        .from("consultations")
        .update({
          structured_data: structured,
          language_detected: structured.language_detected,
        })
        .eq("id", consultationId);
      if (error) console.error("[extract] supabase update failed", error);
    }

    return NextResponse.json({ structured });
  } catch (err) {
    const message = err instanceof Error ? err.message : "extraction failed";
    console.error("[extract]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
