import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

const COMPANION_URL = "https://patient-companion.butterbase.dev";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { consultationId?: string };
    if (!body.consultationId) {
      return NextResponse.json(
        { error: "consultationId is required" },
        { status: 400 },
      );
    }

    const { error } = await getSupabase()
      .from("consultations")
      .update({
        synced_to_companion: true,
        synced_at: new Date().toISOString(),
      })
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
