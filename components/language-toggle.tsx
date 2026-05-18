"use client";

import { useT } from "@/components/i18n-provider";
import { LANGS, type Lang } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, setLang } = useT();

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-white/80 p-0.5 text-xs font-semibold shadow-sm backdrop-blur"
    >
      {LANGS.map((code: Lang) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className={`min-w-[2.25rem] rounded-full px-2.5 py-1 uppercase tracking-wide transition ${
              active
                ? "bg-[var(--brand-primary)] text-white shadow"
                : "text-slate-500 hover:text-[var(--brand-primary)]"
            }`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
