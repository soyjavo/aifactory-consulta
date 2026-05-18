"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--border)] bg-white/70 px-3 py-1.5 text-slate-700 hover:bg-white"
    >
      <Printer className="h-3.5 w-3.5" />
      Imprimir / Exportar PDF
    </button>
  );
}
