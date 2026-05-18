import { NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/gemini";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      audio?: string;
      mimeType?: string;
      patientId?: string;
    };

    if (!body.audio || !body.mimeType || !body.patientId) {
      return NextResponse.json(
        { error: "audio, mimeType, and patientId are required" },
        { status: 400 },
      );
    }

    const supabase = getSupabase();
    const startedAt = new Date().toISOString();

    const { data: inserted, error: insertError } = await supabase
      .from("consultations")
      .insert({
        patient_id: body.patientId,
        started_at: startedAt,
        transcript: "",
        synced_to_companion: false,
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      console.error("[transcribe] consultation insert failed", insertError);
      return NextResponse.json(
        { error: insertError?.message ?? "failed to create consultation" },
        { status: 500 },
      );
    }

    const consultationId = inserted.id as string;
    const transcript = await transcribeAudio(body.audio, body.mimeType);
    const endedAt = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("consultations")
      .update({ transcript, ended_at: endedAt })
      .eq("id", consultationId);
    if (updateError) {
      console.error("[transcribe] consultation update failed", updateError);
    }

    return NextResponse.json({ consultationId, transcript });
  } catch (err) {
    const message = err instanceof Error ? err.message : "transcription failed";
    console.error("[transcribe]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
