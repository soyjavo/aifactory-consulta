import Link from "next/link";
import { Stethoscope } from "lucide-react";

export function Header() {
  return (
    <header className="w-full border-b border-[color:var(--border)]/60 bg-[color:var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white shadow-sm">
            <Stethoscope className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              AIFactory Consulta
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
              by AIFactory Health
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <a
            href="https://patient-companion.butterbase.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--brand-primary)]"
          >
            Patient Companion ↗
          </a>
          <a
            href="https://github.com/soyjavo/aifactory-consulta"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--brand-primary)]"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
