import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Patient } from "@/lib/types";

export function PatientCard({ patient }: { patient: Patient }) {
  const sexLabel = patient.sex === "F" ? "Femenino" : patient.sex === "M" ? "Masculino" : "Otro";

  return (
    <Card className="group relative overflow-hidden border-[color:var(--border)] bg-white/85 shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_36px_-24px_rgba(15,118,110,0.35)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(15,23,42,0.05),0_24px_48px_-28px_rgba(15,118,110,0.45)]">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-accent)] to-[var(--brand-primary)] opacity-80"
      />
      <CardHeader className="pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
              <User className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="text-lg text-slate-900">
                {patient.name}
              </CardTitle>
              <p className="text-xs text-slate-500">
                {patient.age} años · {sexLabel}
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-[var(--brand-accent)]/15 text-[color:#92400E] hover:bg-[var(--brand-accent)]/20"
          >
            Activo
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
            Condición principal
          </p>
          <p className="mt-1 text-base font-medium text-slate-800">
            {patient.primaryCondition}
          </p>
        </div>
        <Link
          href={`/consult/${patient.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-primary)] transition group-hover:gap-2.5"
        >
          Iniciar consulta
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
