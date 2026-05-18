"use client";

import {
  Activity,
  ClipboardCheck,
  Stethoscope,
  User as UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/components/i18n-provider";
import type {
  Receta,
  SoapConsultation,
  VitalSigns,
} from "@/lib/types";
import type { TranslationKey } from "@/lib/i18n";

type Accent = "teal" | "amber";

const ACCENT_BORDER: Record<Accent, string> = {
  teal: "border-l-[var(--brand-primary)]",
  amber: "border-l-[var(--brand-accent)]",
};

const ACCENT_BG: Record<Accent, string> = {
  teal: "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]",
  amber: "bg-[var(--brand-accent)]/15 text-[color:#92400E]",
};

function hasText(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasItems<T>(arr: T[] | null | undefined): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

function vitalsList(v: VitalSigns | null | undefined, t: (k: TranslationKey) => string) {
  if (!v) return [];
  const items: { label: string; value: string }[] = [];
  if (hasText(v.ta)) items.push({ label: t("vital_bp"), value: `${v.ta} mmHg` });
  if (typeof v.fc === "number") items.push({ label: t("vital_hr"), value: `${v.fc} ${t("unit_bpm")}` });
  if (typeof v.fr === "number") items.push({ label: t("vital_rr"), value: `${v.fr} ${t("unit_rpm")}` });
  if (typeof v.temp === "number") items.push({ label: t("vital_temp"), value: `${v.temp}${t("unit_celsius")}` });
  if (typeof v.sato2 === "number") items.push({ label: t("vital_sat"), value: `${v.sato2}${t("unit_percent")}` });
  if (typeof v.peso === "number") items.push({ label: t("vital_weight"), value: `${v.peso} ${t("unit_kg")}` });
  if (typeof v.talla === "number") items.push({ label: t("vital_height"), value: `${v.talla} ${t("unit_cm")}` });
  if (typeof v.imc === "number") items.push({ label: t("vital_bmi"), value: v.imc.toFixed(1) });
  return items;
}

export function StructuredOutputPanel({
  data,
  placeholder,
  isLoading,
}: {
  data: SoapConsultation | null;
  placeholder?: string;
  isLoading?: boolean;
}) {
  const { t } = useT();

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-[color:var(--border)] bg-white/70 p-6">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-[var(--brand-accent)]" />
          {t("extracting")}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-[color:var(--border)] bg-white/60 p-6 text-center text-sm text-slate-500">
        {placeholder ?? t("structured_placeholder")}
      </div>
    );
  }

  const subj = data.subjetivo ?? { motivo_consulta: null, sintomas: [], sintomas_adicionales: null };
  const obj = data.objetivo ?? { signos_vitales: null as unknown as VitalSigns, exploracion_fisica: null };
  const ana = data.analisis ?? { diagnostico: null, cie10: [] };
  const pla = data.plan ?? {
    tratamiento_general: null,
    recetas: [],
    estudios_solicitados: [],
    referencias: [],
    seguimiento: null,
    proximos_pasos: null,
    notas_adicionales: null,
  };

  const vitals = vitalsList(obj.signos_vitales, t);

  return (
    <div className="space-y-4">
      <SoapSection
        letter="S"
        accent="teal"
        icon={<UserIcon className="h-4 w-4" />}
        title={t("soap_subjective")}
      >
        {hasText(subj.motivo_consulta) && (
          <Field label={t("reason_for_visit")}>
            <p className="text-sm leading-relaxed text-slate-800">{subj.motivo_consulta}</p>
          </Field>
        )}
        {hasItems(subj.sintomas) && (
          <Field label={t("symptoms")}>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
              {subj.sintomas.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </Field>
        )}
        {hasText(subj.sintomas_adicionales) && (
          <Field label={t("additional_symptoms")}>
            <p className="text-sm leading-relaxed text-slate-800">{subj.sintomas_adicionales}</p>
          </Field>
        )}
      </SoapSection>

      <SoapSection
        letter="O"
        accent="amber"
        icon={<Activity className="h-4 w-4" />}
        title={t("soap_objective")}
      >
        {vitals.length > 0 && (
          <Field label={t("vital_signs")}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {vitals.map((v) => (
                <div
                  key={v.label}
                  className="rounded-lg border border-[color:var(--border)] bg-white/80 px-3 py-2"
                >
                  <p className="font-mono text-base font-semibold tabular-nums text-slate-900">
                    {v.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    {v.label}
                  </p>
                </div>
              ))}
            </div>
          </Field>
        )}
        {hasText(obj.exploracion_fisica) && (
          <Field label={t("physical_exam")}>
            <p className="text-sm leading-relaxed text-slate-800">{obj.exploracion_fisica}</p>
          </Field>
        )}
      </SoapSection>

      <SoapSection
        letter="A"
        accent="teal"
        icon={<Stethoscope className="h-4 w-4" />}
        title={t("soap_assessment")}
      >
        {hasText(ana.diagnostico) && (
          <Field label={t("diagnosis")}>
            <p className="text-base font-semibold leading-snug text-slate-900">
              {ana.diagnostico}
            </p>
          </Field>
        )}
        {hasItems(ana.cie10) && (
          <Field label={t("icd10")}>
            <div className="flex flex-wrap gap-1.5">
              {ana.cie10.map((code, idx) => (
                <Badge
                  key={idx}
                  className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/15"
                >
                  {code}
                </Badge>
              ))}
            </div>
          </Field>
        )}
      </SoapSection>

      <SoapSection
        letter="P"
        accent="amber"
        icon={<ClipboardCheck className="h-4 w-4" />}
        title={t("soap_plan")}
      >
        {hasText(pla.tratamiento_general) && (
          <Field label={t("treatment")}>
            <p className="text-sm leading-relaxed text-slate-800">{pla.tratamiento_general}</p>
          </Field>
        )}
        {hasItems(pla.recetas) && (
          <Field label={t("prescriptions")}>
            <ul className="space-y-2">
              {pla.recetas.map((r, idx) => (
                <PrescriptionCard key={idx} receta={r} />
              ))}
            </ul>
          </Field>
        )}
        {hasItems(pla.estudios_solicitados) && (
          <Field label={t("studies_ordered")}>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
              {pla.estudios_solicitados.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </Field>
        )}
        {hasItems(pla.referencias) && (
          <Field label={t("referrals")}>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
              {pla.referencias.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </Field>
        )}
        {hasText(pla.seguimiento) && (
          <Field label={t("follow_up")}>
            <p className="text-sm leading-relaxed text-slate-800">{pla.seguimiento}</p>
          </Field>
        )}
        {hasText(pla.proximos_pasos) && (
          <Field label={t("next_steps")}>
            <p className="text-sm leading-relaxed text-slate-800">{pla.proximos_pasos}</p>
          </Field>
        )}
        {hasText(pla.notas_adicionales) && (
          <Field label={t("additional_notes")}>
            <p className="text-sm leading-relaxed text-slate-800">{pla.notas_adicionales}</p>
          </Field>
        )}
      </SoapSection>
    </div>
  );
}

function SoapSection({
  letter,
  accent,
  icon,
  title,
  children,
}: {
  letter: string;
  accent: Accent;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const filtered = filterEmpty(children);
  if (filtered.length === 0) return null;

  return (
    <section
      className={`rounded-2xl border border-[color:var(--border)] border-l-4 ${ACCENT_BORDER[accent]} bg-white/85 p-5 backdrop-blur`}
    >
      <header className="mb-3 flex items-center gap-2.5">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm font-semibold ${ACCENT_BG[accent]}`}
        >
          {letter}
        </span>
        <h3 className="flex items-center gap-1.5 text-base font-semibold text-slate-900">
          <span className="text-slate-500">{icon}</span>
          {title}
        </h3>
      </header>
      <div className="space-y-3">{filtered}</div>
    </section>
  );
}

function filterEmpty(children: React.ReactNode): React.ReactNode[] {
  const arr = Array.isArray(children) ? children : [children];
  return arr.filter((c) => c !== null && c !== undefined && c !== false);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      {children}
    </div>
  );
}

function PrescriptionCard({ receta }: { receta: Receta }) {
  const meta = [receta.dosis, receta.frecuencia, receta.duracion].filter(Boolean);
  return (
    <li className="rounded-lg border border-[color:var(--border)] bg-white/70 px-3 py-2">
      <p className="text-sm font-semibold text-slate-900">{receta.medicamento}</p>
      {meta.length > 0 && (
        <p className="mt-0.5 text-xs text-slate-500">{meta.join(" · ")}</p>
      )}
    </li>
  );
}
