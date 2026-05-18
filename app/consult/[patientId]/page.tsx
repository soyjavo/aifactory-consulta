import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { TranscriptPanel } from "@/components/transcript-panel";
import { StructuredOutputPanel } from "@/components/structured-output-panel";
import { DEMO_PATIENTS } from "@/lib/types";

export default async function ConsultPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const patient = DEMO_PATIENTS.find((p) => p.id === patientId);
  if (!patient) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[var(--brand-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
              Consulta activa
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
              {patient.name}
            </h1>
            <p className="text-sm text-slate-500">
              {patient.age} años · {patient.primaryCondition}
            </p>
          </div>
          <Badge className="bg-[var(--brand-primary)] text-white">
            Coming next · Phase 2
          </Badge>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              Transcripción en vivo
            </h2>
            <TranscriptPanel
              segments={[]}
              placeholder="Coming next — la transcripción en tiempo real con Gemini Live se conectará en la Fase 2."
            />
          </section>
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              Datos estructurados
            </h2>
            <StructuredOutputPanel
              data={null}
              placeholder="Coming next — la extracción estructurada se activará en la Fase 2."
            />
          </section>
        </div>
      </main>
    </div>
  );
}
