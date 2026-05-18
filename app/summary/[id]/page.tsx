import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";

export default async function SummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[var(--brand-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
        <div className="mt-10 rounded-2xl border border-[color:var(--border)] bg-white/80 p-10 text-center shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
            Resumen de consulta
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Coming next
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            La vista de resumen estructurado se activará en la Fase 2 cuando la
            consulta <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{id}</code> haya finalizado y los datos se hayan sincronizado con Patient Companion.
          </p>
        </div>
      </main>
    </div>
  );
}
