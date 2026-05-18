import {
  Calendar,
  ClipboardCheck,
  FileText,
  Pill,
  Stethoscope,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { StructuredConsultation } from "@/lib/types";

export function StructuredOutputPanel({
  data,
  placeholder,
  isLoading,
}: {
  data: StructuredConsultation | null;
  placeholder: string;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-[color:var(--border)] bg-white/70 p-6">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-[var(--brand-accent)]" />
          Extrayendo datos estructurados…
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-[color:var(--border)] bg-white/60 p-6 text-center text-sm text-slate-500">
        {placeholder}
      </div>
    );
  }

  const languageLabel =
    data.language_detected === "es"
      ? "Español"
      : data.language_detected === "en"
        ? "Inglés"
        : "Bilingüe";

  return (
    <div className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-white/85 p-5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Datos extraídos
        </p>
        <Badge className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/15">
          {languageLabel}
        </Badge>
      </div>

      <Section icon={<Stethoscope className="h-4 w-4" />} title="Motivo de consulta">
        <p className="text-sm leading-relaxed text-slate-800">
          {data.chief_complaint || "—"}
        </p>
      </Section>

      <Section icon={<FileText className="h-4 w-4" />} title="Diagnóstico">
        <p className="text-sm leading-relaxed text-slate-800">{data.diagnosis || "—"}</p>
      </Section>

      <Section icon={<ClipboardCheck className="h-4 w-4" />} title="Plan de tratamiento">
        <p className="text-sm leading-relaxed text-slate-800">
          {data.treatment_plan || "—"}
        </p>
      </Section>

      <Section icon={<Pill className="h-4 w-4" />} title="Medicamentos">
        {data.medications.length === 0 ? (
          <p className="text-sm text-slate-500">Ninguno indicado</p>
        ) : (
          <ul className="space-y-2 text-sm text-slate-800">
            {data.medications.map((med, idx) => (
              <li
                key={idx}
                className="rounded-lg border border-[color:var(--border)] bg-white/70 px-3 py-2"
              >
                <span className="font-medium text-slate-900">{med.name}</span>
                {[med.dose, med.frequency, med.duration].some(Boolean) && (
                  <span className="block text-xs text-slate-500">
                    {[med.dose, med.frequency, med.duration]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section icon={<Calendar className="h-4 w-4" />} title="Seguimiento">
        {data.follow_up_items.length === 0 ? (
          <p className="text-sm text-slate-500">Sin acciones de seguimiento</p>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
            {data.follow_up_items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        <span className="text-[var(--brand-primary)]">{icon}</span>
        {title}
      </h3>
      <div>{children}</div>
    </section>
  );
}
