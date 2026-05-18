import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      patientId?: string;
      language?: "es" | "en" | "mixed";
    };

    if (!body.patientId) {
      return NextResponse.json(
        { error: "patientId is required" },
        { status: 400 },
      );
    }

    // Phase 2: persist via Supabase. For phase 1 we return a synthetic record.
    return NextResponse.json({
      id: crypto.randomUUID(),
      patientId: body.patientId,
      doctorId: null,
      startedAt: new Date().toISOString(),
      endedAt: null,
      language: body.language ?? "es",
      transcript: "",
      structured: null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "session create failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
