"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CircleDashed,
  FileSignature,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/header";
import { useT } from "@/components/i18n-provider";
import { PatientContextBar } from "@/components/patient-context-bar";
import { PrintButton } from "@/components/print-button";
import { StructuredOutputPanel } from "@/components/structured-output-panel";
import type { ConsultationRow, Patient } from "@/lib/types";

type ConsultationWithPatient = ConsultationRow & {
  patients: Patient | null;
};

function formatTimestamp(value: string | null, locale: string): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
}

function durationLabel(start: string, end: string | null, inProgress: string): string {
  if (!end) return inProgress;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "—";
  const seconds = Math.round(ms / 1000);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export function SummaryClient({
  consultation,
}: {
  consultation: ConsultationWithPatient;
}) {
  const { lang, t } = useT();
  const locale = lang === "es" ? "es-MX" : "en-US";
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
            {t("back_home")}
          </Link>
          <SyncBadge
            synced={consultation.synced_to_companion}
            syncedAt={consultation.synced_at}
            locale={locale}
            syncedLabel={t("synced_to_companion")}
            pendingLabel={t("pending_sync")}
          />
        </div>

        <header className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
            {t("consultation_summary")}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              {patient?.name ?? "—"}
            </h1>
            <NoteStatusBadge
              signed={consultation.signed}
              edited={consultation.edited}
              signedLabel={t("signed")}
              draftLabel={t("draft")}
              reviewedLabel={t("reviewed_by_doctor")}
              aiLabel={t("ai_extraction_not_reviewed")}
            />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {formatTimestamp(consultation.started_at, locale)} ·{" "}
            {t("duration")}:{" "}
            {durationLabel(
              consultation.started_at,
              consultation.ended_at,
              t("in_progress"),
            )}{" "}
            · {t("language")}: {(consultation.language_detected ?? "—").toUpperCase()}
          </p>
        </header>

        <div className="mt-6 space-y-6">
          {patient && <PatientContextBar patient={patient} />}

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              {t("transcript")}
            </h2>
            <div className="rounded-2xl border border-[color:var(--border)] bg-white/85 p-5">
              {consultation.transcript ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                  {consultation.transcript}
                </p>
              ) : (
                <p className="text-sm text-slate-500">{t("no_transcript")}</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              {t("structured_output")}
            </h2>
            <StructuredOutputPanel data={structured} />
          </section>
        </div>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 print:hidden">
          <span>
            {t("consultation_id")}:{" "}
            <code className="font-mono">{consultation.id}</code>
          </span>
          <PrintButton />
        </footer>
      </main>
    </div>
  );
}

function NoteStatusBadge({
  signed,
  edited,
  signedLabel,
  draftLabel,
  reviewedLabel,
  aiLabel,
}: {
  signed: boolean;
  edited: boolean;
  signedLabel: string;
  draftLabel: string;
  reviewedLabel: string;
  aiLabel: string;
}) {
  if (signed) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
        <FileSignature className="h-3.5 w-3.5" />
        <span className="font-bold uppercase tracking-[0.14em]">{signedLabel}</span>
        <span className="text-emerald-700">·</span>
        {edited ? (
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            {reviewedLabel}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            {aiLabel}
          </span>
        )}
      </span>
    );
  }
  // Not signed
  if (edited) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
        <FileText className="h-3.5 w-3.5" />
        <span className="font-bold uppercase tracking-[0.14em]">{draftLabel}</span>
        <span className="text-amber-700">·</span>
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" />
          {reviewedLabel}
        </span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
      <Sparkles className="h-3.5 w-3.5" />
      {aiLabel}
    </span>
  );
}

function SyncBadge({
  synced,
  syncedAt,
  locale,
  syncedLabel,
  pendingLabel,
}: {
  synced: boolean;
  syncedAt: string | null;
  locale: string;
  syncedLabel: string;
  pendingLabel: string;
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
        {syncedLabel}
        {syncedAt && (
          <span className="font-normal text-emerald-700">
            · {formatTimestamp(syncedAt, locale)}
          </span>
        )}
      </a>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
      <CircleDashed className="h-3.5 w-3.5" />
      {pendingLabel}
    </span>
  );
}
