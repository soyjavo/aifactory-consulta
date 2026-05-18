import { Pill, Stethoscope, ClipboardList, CalendarClock } from "lucide-react";
import type { StructuredConsultation } from "@/lib/types";

const EMPTY_STATE = "—";

export function StructuredOutputPanel({
  data,
  placeholder = "Los datos estructurados aparecerán aquí en cuanto la consulta avance.",
}: {
  data: StructuredConsultation | null;
  placeholder?: string;
}) {
  if (!data) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center rounded-xl border border-dashed border-[color:var(--border)] bg-white/60 p-6 text-center text-sm text-slate-500">
        {placeholder}
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-[color:var(--border)] bg-white/80 p-5">
      <Section icon={<Stethoscope className="h-4 w-4" />} title="Motivo de consulta">
        <p className="text-sm text-slate-800">
          {data.chiefComplaint?.trim() || EMPTY_STATE}
        </p>
      </Section>

      <Section icon={<ClipboardList className="h-4 w-4" />} title="Diagnóstico">
        <p className="text-sm text-slate-800">
          {data.diagnosis?.trim() || EMPTY_STATE}
        </p>
      </Section>

      <Section icon={<ClipboardList className="h-4 w-4" />} title="Plan de tratamiento">
        {data.treatmentPlan.length === 0 ? (
          <p className="text-sm text-slate-500">{EMPTY_STATE}</p>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
            {data.treatmentPlan.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
      </Section>

      <Section icon={<Pill className="h-4 w-4" />} title="Medicamentos">
        {data.medications.length === 0 ? (
          <p className="text-sm text-slate-500">{EMPTY_STATE}</p>
        ) : (
          <ul className="space-y-2 text-sm text-slate-800">
            {data.medications.map((med, idx) => (
              <li key={idx} className="rounded-lg border border-[color:var(--border)] bg-white/70 px-3 py-2">
                <span className="font-medium">{med.name}</span>
                <span className="text-slate-500">
                  {[med.dose, med.frequency, med.duration].filter(Boolean).join(" · ") || ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section icon={<CalendarClock className="h-4 w-4" />} title="Seguimiento">
        {data.followUp.length === 0 ? (
          <p className="text-sm text-slate-500">{EMPTY_STATE}</p>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
            {data.followUp.map((item, idx) => (
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
      <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        <span className="text-[var(--brand-primary)]">{icon}</span>
        {title}
      </h3>
      <div>{children}</div>
    </section>
  );
}
