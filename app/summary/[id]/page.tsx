import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, CircleDashed } from "lucide-react";
import { Header } from "@/components/header";
import { PatientContextBar } from "@/components/patient-context-bar";
import { PrintButton } from "@/components/print-button";
import { StructuredOutputPanel } from "@/components/structured-output-panel";
import { getSupabase } from "@/lib/supabase";
import type { ConsultationRow, Patient } from "@/lib/types";

export const dynamic = "force-dynamic";

type ConsultationWithPatient = ConsultationRow & {
  patients: Patient | null;
};

function formatTimestamp(value: string | null): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
}

function durationLabel(start: string, end: string | null): string {
  if (!end) return "En curso";
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "—";
  const seconds = Math.round(ms / 1000);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

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

  const consultation = data as ConsultationWithPatient;
  const patient = consultation.patients;
  const structured = consultation.structured_data;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 print:py-2">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[var(--brand-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
          <SyncBadge
            synced={consultation.synced_to_companion}
            syncedAt={consultation.synced_at}
          />
        </div>

        <header className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
            Resumen de consulta
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            {patient?.name ?? "Paciente"}
          </h1>
          <p className="text-sm text-slate-500">
            {formatTimestamp(consultation.started_at)} ·{" "}
            {durationLabel(consultation.started_at, consultation.ended_at)} ·{" "}
            Idioma: {consultation.language_detected ?? "—"}
          </p>
        </header>

        <div className="mt-6 space-y-6">
          {patient && <PatientContextBar patient={patient} />}

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Transcripción
            </h2>
            <div className="rounded-2xl border border-[color:var(--border)] bg-white/85 p-5">
              {consultation.transcript ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                  {consultation.transcript}
                </p>
              ) : (
                <p className="text-sm text-slate-500">Sin transcripción registrada.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Datos estructurados
            </h2>
            <StructuredOutputPanel
              data={structured}
              placeholder="Esta consulta no tiene datos estructurados extraídos."
            />
          </section>
        </div>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 print:hidden">
          <span>ID de consulta: <code className="font-mono">{consultation.id}</code></span>
          <PrintButton />
        </footer>
      </main>
    </div>
  );
}

function SyncBadge({
  synced,
  syncedAt,
}: {
  synced: boolean;
  syncedAt: string | null;
}) {
  if (synced) {
    return (
      <a
        href="https://patient-companion.butterbase.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        Sincronizada con Patient Companion
        {syncedAt && (
          <span className="font-normal text-emerald-700">· {formatTimestamp(syncedAt)}</span>
        )}
      </a>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
      <CircleDashed className="h-3.5 w-3.5" />
      Pendiente de sincronización
    </span>
  );
}
