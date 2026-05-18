import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import type { SoapConsultation } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      consultationId?: string;
      structured_data?: SoapConsultation | null;
      edited?: boolean;
    };

    if (!body.consultationId) {
      return NextResponse.json(
        { error: "consultationId is required" },
        { status: 400 },
      );
    }

    const update: Record<string, unknown> = {};

    if (body.structured_data !== undefined && body.structured_data !== null) {
      update.structured_data = body.structured_data;
      update.language_detected = body.structured_data.language_detected ?? null;
    }
    if (typeof body.edited === "boolean") update.edited = body.edited;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ success: true, noop: true });
    }

    const { error } = await getSupabase()
      .from("consultations")
      .update(update)
      .eq("id", body.consultationId);

    if (error) {
      console.error("[draft] update failed", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "draft save failed";
    console.error("[draft]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
