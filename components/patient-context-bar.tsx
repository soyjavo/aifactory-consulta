import { AlertTriangle, FileHeart, User } from "lucide-react";
import type { Patient } from "@/lib/types";

export function PatientContextBar({ patient }: { patient: Patient }) {
  const sexLabel =
    patient.sex === "F" ? "Femenino" : patient.sex === "M" ? "Masculino" : "Otro";

  return (
    <section className="rounded-2xl border border-[color:var(--border)] bg-white/85 p-5 backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
            <User className="h-6 w-6" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
              Paciente
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              {patient.name}
            </h1>
            <p className="text-sm text-slate-500">
              {patient.age} años · {sexLabel} · {patient.language?.toUpperCase() ?? "ES"}
            </p>
          </div>
        </div>
        {patient.allergies && patient.allergies.toLowerCase() !== "ninguna conocida" && (
          <div className="flex max-w-sm items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <span className="font-semibold uppercase tracking-wide">Alergias:</span>{" "}
              {patient.allergies}
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-lg bg-[var(--brand-cream)]/60 px-3 py-2 text-sm text-slate-700">
        <FileHeart className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-primary)]" />
        <span>
          <span className="font-semibold text-slate-900">Antecedentes:</span>{" "}
          {patient.medical_history ?? "Sin antecedentes registrados."}
        </span>
      </div>
    </section>
  );
}
