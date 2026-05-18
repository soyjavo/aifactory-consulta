"use client";

import { Activity, Languages, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { PatientCard } from "@/components/patient-card";
import { useT } from "@/components/i18n-provider";
import type { Patient } from "@/lib/types";

export function HomeClient({ patients }: { patients: Patient[] }) {
  const { t } = useT();

  const features = [
    {
      title: t("feature_realtime_title"),
      description: t("feature_realtime_desc"),
      icon: <Activity className="h-5 w-5" />,
    },
    {
      title: t("feature_soap_title"),
      description: t("feature_soap_desc"),
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      title: t("feature_bilingual_title"),
      description: t("feature_bilingual_desc"),
      icon: <Languages className="h-5 w-5" />,
    },
  ];

  const countLabel =
    patients.length === 1
      ? t("patients_count_one")
      : t("patients_count_many", { count: patients.length });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 pt-16 pb-12 sm:pt-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-primary)]/25 bg-white/70 px-3 py-1 text-xs font-medium text-[var(--brand-primary)] backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)]" />
              {t("hero_kicker")}
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
              {t("hero_title_1")}
              <br />
              <span className="text-[var(--brand-primary)]">{t("hero_title_2")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-700">
              {t("hero_subtitle")}
            </p>
            <p className="mt-3 max-w-xl text-sm text-slate-500">{t("hero_blurb")}</p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {features.map((feature) => (
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
                {t("today_patients")}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{t("select_patient")}</p>
            </div>
            <span className="hidden text-xs uppercase tracking-[0.18em] text-slate-400 sm:block">
              {countLabel}
            </span>
          </div>

          {patients.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[color:var(--border)] bg-white/60 p-10 text-center text-sm text-slate-500">
              {t("no_patients")}
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {patients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-[color:var(--border)] bg-white/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>{t("footer_built")}</p>
          <p>
            <span className="text-slate-400">{t("footer_stack")}</span> Gemini · Supabase ·
            Patient Companion
          </p>
        </div>
      </footer>
    </div>
  );
}
