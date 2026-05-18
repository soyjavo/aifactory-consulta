import { Activity, Languages, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { PatientCard } from "@/components/patient-card";
import { DEMO_PATIENTS } from "@/lib/types";

const FEATURES = [
  {
    title: "Transcripción en tiempo real",
    description:
      "Captura voz en español o inglés durante la consulta con Gemini Live API. Sin escribir notas después.",
    icon: <Activity className="h-5 w-5" />,
  },
  {
    title: "Datos estructurados",
    description:
      "Motivo, diagnóstico, plan, medicamentos y seguimiento — extraídos en JSON listo para tu EHR.",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: "Bilingüe nativo",
    description:
      "Diseñado para clínicas de especialidad en México y prácticas hispanohablantes en EE. UU.",
    icon: <Languages className="h-5 w-5" />,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 pt-16 pb-12 sm:pt-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-primary)]/25 bg-white/70 px-3 py-1 text-xs font-medium text-[var(--brand-primary)] backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)]" />
              TechEx 2026 · Hackathon submission
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
              Doctor Co-pilot
              <br />
              <span className="text-[var(--brand-primary)]">para consultas de especialidad.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-700">
              Transcribe, estructura y sincroniza consultas en tiempo real.
            </p>
            <p className="mt-3 max-w-xl text-sm text-slate-500">
              Built solo in under 6 hours for TechEx 2026 — bilingual transcription with
              Gemini Live, structured medical extraction, and live sync to AIFactory
              Health&apos;s Patient Companion.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-5 backdrop-blur"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                  {feature.icon}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Pacientes de hoy
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Selecciona un paciente para iniciar la consulta en vivo.
              </p>
            </div>
            <span className="hidden text-xs uppercase tracking-[0.18em] text-slate-400 sm:block">
              3 pacientes agendados
            </span>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {DEMO_PATIENTS.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[color:var(--border)] bg-white/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>Built at TechEx 2026 · MIT License · AIFactory Health</p>
          <p>
            <span className="text-slate-400">Sponsor stack:</span> Gemini Live API ·
            Supabase · Patient Companion
          </p>
        </div>
      </footer>
    </div>
  );
}
