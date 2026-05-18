import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import type { ConsultationRow, Patient } from "@/lib/types";
import { SummaryClient } from "./summary-client";

export const dynamic = "force-dynamic";

type ConsultationWithPatient = ConsultationRow & {
  patients: Patient | null;
};

export default async function SummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await getSupabase()
    .from("consultations")
    .select("*, patients(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[summary] fetch failed", error);
    notFound();
  }
  if (!data) notFound();

  return <SummaryClient consultation={data as ConsultationWithPatient} />;
}
