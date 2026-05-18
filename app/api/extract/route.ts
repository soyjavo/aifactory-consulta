import { NextResponse } from "next/server";
import { extractStructuredConsultation } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { transcript?: string };
    const transcript = body.transcript?.trim();

    if (!transcript) {
      return NextResponse.json(
        { error: "transcript is required" },
        { status: 400 },
      );
    }

    const structured = await extractStructuredConsultation(transcript);
    return NextResponse.json({ structured });
  } catch (err) {
    const message = err instanceof Error ? err.message : "extraction failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
