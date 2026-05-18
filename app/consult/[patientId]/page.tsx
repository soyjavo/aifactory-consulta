import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import type { Patient } from "@/lib/types";
import { ConsultClient } from "./consult-client";

export const dynamic = "force-dynamic";

export default async function ConsultPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;

  const { data, error } = await getSupabase()
    .from("patients")
    .select("*")
    .eq("id", patientId)
    .maybeSingle();

  if (error) {
    console.error("[consult] fetch patient failed", error);
    notFound();
  }
  if (!data) notFound();

  return <ConsultClient patient={data as Patient} />;
}
