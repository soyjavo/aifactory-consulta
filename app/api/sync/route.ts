import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import type { SoapConsultation } from "@/lib/types";

export const runtime = "nodejs";

const COMPANION_URL = "https://patient-companion.butterbase.dev";

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

    const update: Record<string, unknown> = {
      synced_to_companion: true,
      synced_at: new Date().toISOString(),
    };

    if (typeof body.edited === "boolean") update.edited = body.edited;
    if (body.structured_data !== undefined && body.structured_data !== null) {
      update.structured_data = body.structured_data;
      update.language_detected = body.structured_data.language_detected ?? null;
    }

    const { error } = await getSupabase()
      .from("consultations")
      .update(update)
      .eq("id", body.consultationId);

    if (error) {
      console.error("[sync] update failed", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, companionUrl: COMPANION_URL });
  } catch (err) {
    const message = err instanceof Error ? err.message : "sync failed";
    console.error("[sync]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
