"use client";

import {
  Activity,
  ClipboardCheck,
  Stethoscope,
  User as UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/components/i18n-provider";
import {
  AddButton,
  EditableLine,
  EditableNumber,
  RemoveButton,
} from "@/components/editable-fields";
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

const EMPTY_VITALS: VitalSigns = {
  ta: null,
  fc: null,
  fr: null,
  temp: null,
  sato2: null,
  peso: null,
  talla: null,
  imc: null,
};

const EMPTY_RECETA: Receta = {
  medicamento: "",
  dosis: null,
  frecuencia: null,
  duracion: null,
};

function emptySoap(): SoapConsultation {
  return {
    subjetivo: { motivo_consulta: null, sintomas: [], sintomas_adicionales: null },
    objetivo: { signos_vitales: { ...EMPTY_VITALS }, exploracion_fisica: null },
    analisis: { diagnostico: null, cie10: [] },
    plan: {
      tratamiento_general: null,
      recetas: [],
      estudios_solicitados: [],
      referencias: [],
      seguimiento: null,
      proximos_pasos: null,
      notas_adicionales: null,
    },
    language_detected: "en",
  };
}

type VitalKey = keyof VitalSigns;

const NUMERIC_VITAL_KEYS: VitalKey[] = ["fc", "fr", "temp", "sato2", "peso", "talla", "imc"];
const VITAL_ORDER: VitalKey[] = ["ta", ...NUMERIC_VITAL_KEYS];

const VITAL_LABEL_KEY: Record<VitalKey, TranslationKey> = {
  ta: "vital_bp",
  fc: "vital_hr",
  fr: "vital_rr",
  temp: "vital_temp",
  sato2: "vital_sat",
  peso: "vital_weight",
  talla: "vital_height",
  imc: "vital_bmi",
};

function vitalUnit(key: VitalKey, t: (k: TranslationKey) => string): string {
  switch (key) {
    case "ta":
      return " mmHg";
    case "fc":
      return ` ${t("unit_bpm")}`;
    case "fr":
      return ` ${t("unit_rpm")}`;
    case "temp":
      return t("unit_celsius");
    case "sato2":
      return t("unit_percent");
    case "peso":
      return ` ${t("unit_kg")}`;
    case "talla":
      return ` ${t("unit_cm")}`;
    case "imc":
      return "";
  }
}

export function StructuredOutputPanel({
  data,
  original,
  onChange,
  placeholder,
  isLoading,
}: {
  data: SoapConsultation | null;
  original?: SoapConsultation | null;
  onChange?: (next: SoapConsultation) => void;
  placeholder?: string;
  isLoading?: boolean;
}) {
  const { t } = useT();
  const readOnly = !onChange;

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

  // Merge with empty defaults so editable mode always has full structure.
  const safe: SoapConsultation = {
    ...emptySoap(),
    ...data,
    subjetivo: { ...emptySoap().subjetivo, ...(data.subjetivo ?? {}) },
    objetivo: {
      ...emptySoap().objetivo,
      ...(data.objetivo ?? {}),
      signos_vitales: { ...EMPTY_VITALS, ...(data.objetivo?.signos_vitales ?? {}) },
    },
    analisis: { ...emptySoap().analisis, ...(data.analisis ?? {}) },
    plan: { ...emptySoap().plan, ...(data.plan ?? {}) },
  };

  const orig = original ?? null;

  // ─── update helpers ───
  function patch(updater: (draft: SoapConsultation) => void) {
    if (!onChange) return;
    const draft: SoapConsultation = JSON.parse(JSON.stringify(safe));
    updater(draft);
    onChange(draft);
  }

  const setSubj = <K extends keyof SoapConsultation["subjetivo"]>(
    key: K,
    value: SoapConsultation["subjetivo"][K],
  ) =>
    patch((d) => {
      d.subjetivo[key] = value;
    });

  const setObj = <K extends keyof SoapConsultation["objetivo"]>(
    key: K,
    value: SoapConsultation["objetivo"][K],
  ) =>
    patch((d) => {
      d.objetivo[key] = value;
    });

  const setAna = <K extends keyof SoapConsultation["analisis"]>(
    key: K,
    value: SoapConsultation["analisis"][K],
  ) =>
    patch((d) => {
      d.analisis[key] = value;
    });

  const setPlan = <K extends keyof SoapConsultation["plan"]>(
    key: K,
    value: SoapConsultation["plan"][K],
  ) =>
    patch((d) => {
      d.plan[key] = value;
    });

  const updateVital = (key: VitalKey, value: VitalSigns[typeof key]) =>
    patch((d) => {
      (d.objetivo.signos_vitales as VitalSigns)[key] = value as never;
    });

  // ─── read-only short-circuits for hide-when-empty ───
  const showSubjSection =
    !readOnly ||
    hasText(safe.subjetivo.motivo_consulta) ||
    hasItems(safe.subjetivo.sintomas) ||
    hasText(safe.subjetivo.sintomas_adicionales);

  const hasAnyVital =
    typeof safe.objetivo.signos_vitales.ta === "string"
      ? safe.objetivo.signos_vitales.ta.length > 0
      : false ||
        NUMERIC_VITAL_KEYS.some(
          (k) => typeof safe.objetivo.signos_vitales[k] === "number",
        );

  const showObjSection =
    !readOnly || hasAnyVital || hasText(safe.objetivo.exploracion_fisica);

  const showAnaSection =
    !readOnly || hasText(safe.analisis.diagnostico) || hasItems(safe.analisis.cie10);

  const showPlanSection =
    !readOnly ||
    hasText(safe.plan.tratamiento_general) ||
    hasItems(safe.plan.recetas) ||
    hasItems(safe.plan.estudios_solicitados) ||
    hasItems(safe.plan.referencias) ||
    hasText(safe.plan.seguimiento) ||
    hasText(safe.plan.proximos_pasos) ||
    hasText(safe.plan.notas_adicionales);

  return (
    <div className="space-y-4">
      {showSubjSection && (
        <SoapSection
          letter="S"
          accent="teal"
          icon={<UserIcon className="h-4 w-4" />}
          title={t("soap_subjective")}
        >
          <FieldRow
            label={t("reason_for_visit")}
            visible={!readOnly || hasText(safe.subjetivo.motivo_consulta)}
          >
            <EditableLine
              value={safe.subjetivo.motivo_consulta}
              original={orig?.subjetivo?.motivo_consulta}
              onChange={(v) => setSubj("motivo_consulta", v)}
              readOnly={readOnly}
              multiline
            />
          </FieldRow>

          <FieldRow
            label={t("symptoms")}
            visible={!readOnly || hasItems(safe.subjetivo.sintomas)}
          >
            <EditableStringList
              value={safe.subjetivo.sintomas}
              original={orig?.subjetivo?.sintomas}
              onChange={(v) => setSubj("sintomas", v)}
              readOnly={readOnly}
            />
          </FieldRow>

          <FieldRow
            label={t("additional_symptoms")}
            visible={!readOnly || hasText(safe.subjetivo.sintomas_adicionales)}
          >
            <EditableLine
              value={safe.subjetivo.sintomas_adicionales}
              original={orig?.subjetivo?.sintomas_adicionales}
              onChange={(v) => setSubj("sintomas_adicionales", v)}
              readOnly={readOnly}
              multiline
            />
          </FieldRow>
        </SoapSection>
      )}

      {showObjSection && (
        <SoapSection
          letter="O"
          accent="amber"
          icon={<Activity className="h-4 w-4" />}
          title={t("soap_objective")}
        >
          <FieldRow label={t("vital_signs")} visible={!readOnly || hasAnyVital}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {VITAL_ORDER.map((vkey) => {
                const value = safe.objetivo.signos_vitales[vkey];
                const originalVal = orig?.objetivo?.signos_vitales?.[vkey] ?? null;
                if (readOnly) {
                  if (value === null || value === "" || value === undefined) return null;
                }
                return (
                  <div
                    key={vkey}
                    className="rounded-lg border border-[color:var(--border)] bg-white/80 px-2 py-2"
                  >
                    {vkey === "ta" ? (
                      <EditableLine
                        value={(value as string | null) ?? null}
                        original={(originalVal as string | null) ?? null}
                        onChange={(v) => updateVital("ta", v)}
                        readOnly={readOnly}
                        placeholder="120/80"
                        className="font-mono text-base font-semibold tabular-nums text-slate-900"
                      />
                    ) : (
                      <EditableNumber
                        value={(value as number | null) ?? null}
                        original={(originalVal as number | null) ?? null}
                        onChange={(v) => updateVital(vkey, v)}
                        unit={vitalUnit(vkey, t)}
                        readOnly={readOnly}
                      />
                    )}
                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                      {t(VITAL_LABEL_KEY[vkey])}
                    </p>
                  </div>
                );
              })}
            </div>
          </FieldRow>

          <FieldRow
            label={t("physical_exam")}
            visible={!readOnly || hasText(safe.objetivo.exploracion_fisica)}
          >
            <EditableLine
              value={safe.objetivo.exploracion_fisica}
              original={orig?.objetivo?.exploracion_fisica}
              onChange={(v) => setObj("exploracion_fisica", v)}
              readOnly={readOnly}
              multiline
            />
          </FieldRow>
        </SoapSection>
      )}

      {showAnaSection && (
        <SoapSection
          letter="A"
          accent="teal"
          icon={<Stethoscope className="h-4 w-4" />}
          title={t("soap_assessment")}
        >
          <FieldRow
            label={t("diagnosis")}
            visible={!readOnly || hasText(safe.analisis.diagnostico)}
          >
            <EditableLine
              value={safe.analisis.diagnostico}
              original={orig?.analisis?.diagnostico}
              onChange={(v) => setAna("diagnostico", v)}
              readOnly={readOnly}
              multiline
              className="!text-base !font-semibold !text-slate-900"
            />
          </FieldRow>

          <FieldRow
            label={t("icd10")}
            visible={!readOnly || hasItems(safe.analisis.cie10)}
          >
            <EditableBadgeList
              value={safe.analisis.cie10}
              original={orig?.analisis?.cie10}
              onChange={(v) => setAna("cie10", v)}
              readOnly={readOnly}
              placeholder="e.g. E11.65"
            />
          </FieldRow>
        </SoapSection>
      )}

      {showPlanSection && (
        <SoapSection
          letter="P"
          accent="amber"
          icon={<ClipboardCheck className="h-4 w-4" />}
          title={t("soap_plan")}
        >
          <FieldRow
            label={t("treatment")}
            visible={!readOnly || hasText(safe.plan.tratamiento_general)}
          >
            <EditableLine
              value={safe.plan.tratamiento_general}
              original={orig?.plan?.tratamiento_general}
              onChange={(v) => setPlan("tratamiento_general", v)}
              readOnly={readOnly}
              multiline
            />
          </FieldRow>

          <FieldRow
            label={t("prescriptions")}
            visible={!readOnly || hasItems(safe.plan.recetas)}
          >
            <EditablePrescriptions
              value={safe.plan.recetas}
              original={orig?.plan?.recetas}
              onChange={(v) => setPlan("recetas", v)}
              readOnly={readOnly}
            />
          </FieldRow>

          <FieldRow
            label={t("studies_ordered")}
            visible={!readOnly || hasItems(safe.plan.estudios_solicitados)}
          >
            <EditableStringList
              value={safe.plan.estudios_solicitados}
              original={orig?.plan?.estudios_solicitados}
              onChange={(v) => setPlan("estudios_solicitados", v)}
              readOnly={readOnly}
            />
          </FieldRow>

          <FieldRow
            label={t("referrals")}
            visible={!readOnly || hasItems(safe.plan.referencias)}
          >
            <EditableStringList
              value={safe.plan.referencias}
              original={orig?.plan?.referencias}
              onChange={(v) => setPlan("referencias", v)}
              readOnly={readOnly}
            />
          </FieldRow>

          <FieldRow
            label={t("follow_up")}
            visible={!readOnly || hasText(safe.plan.seguimiento)}
          >
            <EditableLine
              value={safe.plan.seguimiento}
              original={orig?.plan?.seguimiento}
              onChange={(v) => setPlan("seguimiento", v)}
              readOnly={readOnly}
              multiline
            />
          </FieldRow>

          <FieldRow
            label={t("next_steps")}
            visible={!readOnly || hasText(safe.plan.proximos_pasos)}
          >
            <EditableLine
              value={safe.plan.proximos_pasos}
              original={orig?.plan?.proximos_pasos}
              onChange={(v) => setPlan("proximos_pasos", v)}
              readOnly={readOnly}
              multiline
            />
          </FieldRow>

          <FieldRow
            label={t("additional_notes")}
            visible={!readOnly || hasText(safe.plan.notas_adicionales)}
          >
            <EditableLine
              value={safe.plan.notas_adicionales}
              original={orig?.plan?.notas_adicionales}
              onChange={(v) => setPlan("notas_adicionales", v)}
              readOnly={readOnly}
              multiline
            />
          </FieldRow>
        </SoapSection>
      )}
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
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function FieldRow({
  label,
  visible,
  children,
}: {
  label: string;
  visible: boolean;
  children: React.ReactNode;
}) {
  if (!visible) return null;
  return (
    <div>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      {children}
    </div>
  );
}

function EditableStringList({
  value,
  original,
  onChange,
  readOnly,
}: {
  value: string[];
  original?: string[];
  onChange: (next: string[]) => void;
  readOnly?: boolean;
}) {
  const list = value ?? [];

  if (readOnly) {
    if (list.length === 0) return null;
    return (
      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
        {list.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-1.5">
      {list.length > 0 && (
        <ul className="space-y-1">
          {list.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <div className="flex-1">
                <EditableLine
                  value={item ?? ""}
                  original={original?.[idx] ?? null}
                  onChange={(next) => {
                    const updated = [...list];
                    if (next === null) {
                      updated.splice(idx, 1);
                    } else {
                      updated[idx] = next;
                    }
                    onChange(updated);
                  }}
                />
              </div>
              <RemoveButton
                onClick={() => {
                  const updated = [...list];
                  updated.splice(idx, 1);
                  onChange(updated);
                }}
              />
            </li>
          ))}
        </ul>
      )}
      <AddButton onClick={() => onChange([...list, ""])} />
    </div>
  );
}

function EditableBadgeList({
  value,
  original,
  onChange,
  readOnly,
  placeholder,
}: {
  value: string[];
  original?: string[];
  onChange: (next: string[]) => void;
  readOnly?: boolean;
  placeholder?: string;
}) {
  const list = value ?? [];

  if (readOnly) {
    if (list.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1.5">
        {list.map((code, idx) => (
          <Badge
            key={idx}
            className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/15"
          >
            {code}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {list.map((code, idx) => (
        <div
          key={idx}
          className="inline-flex items-center gap-1 rounded-md border border-[var(--brand-primary)]/20 bg-[var(--brand-primary)]/5 px-1.5 py-0.5"
        >
          <div className="min-w-[3.5rem]">
            <EditableLine
              value={code ?? ""}
              original={original?.[idx] ?? null}
              placeholder={placeholder}
              onChange={(next) => {
                const updated = [...list];
                if (next === null) updated.splice(idx, 1);
                else updated[idx] = next;
                onChange(updated);
              }}
            />
          </div>
          <RemoveButton
            onClick={() => {
              const updated = [...list];
              updated.splice(idx, 1);
              onChange(updated);
            }}
          />
        </div>
      ))}
      <AddButton onClick={() => onChange([...list, ""])} label={placeholder ?? "ICD-10"} />
    </div>
  );
}

function EditablePrescriptions({
  value,
  original,
  onChange,
  readOnly,
}: {
  value: Receta[];
  original?: Receta[];
  onChange: (next: Receta[]) => void;
  readOnly?: boolean;
}) {
  const { t } = useT();
  const list = value ?? [];

  if (readOnly) {
    if (list.length === 0) return null;
    return (
      <ul className="space-y-2">
        {list.map((r, idx) => {
          const meta = [r.dosis, r.frecuencia, r.duracion].filter(Boolean);
          return (
            <li
              key={idx}
              className="rounded-lg border border-[color:var(--border)] bg-white/70 px-3 py-2"
            >
              <p className="text-sm font-semibold text-slate-900">{r.medicamento}</p>
              {meta.length > 0 && (
                <p className="mt-0.5 text-xs text-slate-500">{meta.join(" · ")}</p>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  const update = (idx: number, patch: Partial<Receta>) => {
    const updated = list.map((r, i) => (i === idx ? { ...r, ...patch } : r));
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      {list.map((r, idx) => (
        <div
          key={idx}
          className="space-y-1.5 rounded-lg border border-[color:var(--border)] bg-white/70 p-3"
        >
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <EditableLine
                value={r.medicamento ?? ""}
                original={original?.[idx]?.medicamento ?? null}
                onChange={(v) => update(idx, { medicamento: v ?? "" })}
                placeholder="Medicamento"
                className="!text-sm !font-semibold !text-slate-900"
              />
            </div>
            <RemoveButton
              onClick={() => onChange(list.filter((_, i) => i !== idx))}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <PrescField label="Dosis">
              <EditableLine
                value={r.dosis}
                original={original?.[idx]?.dosis ?? null}
                onChange={(v) => update(idx, { dosis: v })}
                placeholder="—"
                className="!text-xs"
              />
            </PrescField>
            <PrescField label="Frecuencia">
              <EditableLine
                value={r.frecuencia}
                original={original?.[idx]?.frecuencia ?? null}
                onChange={(v) => update(idx, { frecuencia: v })}
                placeholder="—"
                className="!text-xs"
              />
            </PrescField>
            <PrescField label="Duración">
              <EditableLine
                value={r.duracion}
                original={original?.[idx]?.duracion ?? null}
                onChange={(v) => update(idx, { duracion: v })}
                placeholder="—"
                className="!text-xs"
              />
            </PrescField>
          </div>
        </div>
      ))}
      <AddButton
        onClick={() => onChange([...list, { ...EMPTY_RECETA }])}
        label={t("add_prescription")}
      />
    </div>
  );
}

function PrescField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.16em] text-slate-400">{label}</p>
      {children}
    </div>
  );
}
