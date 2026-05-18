import { getSupabase } from "@/lib/supabase";
import type { Patient } from "@/lib/types";
import { HomeClient } from "./home-client";

export const dynamic = "force-dynamic";

async function loadPatients(): Promise<Patient[]> {
  const { data, error } = await getSupabase()
    .from("patients")
    .select("*")
    .order("name", { ascending: true });
  if (error) {
    console.error("loadPatients error", error);
    return [];
  }
  return (data ?? []) as Patient[];
}

export default async function Home() {
  const patients = await loadPatients();
  return <HomeClient patients={patients} />;
}
