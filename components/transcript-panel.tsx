"use client";

import { useT } from "@/components/i18n-provider";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TranscriptPanel({
  transcript,
  placeholder,
  isLoading,
}: {
  transcript: string;
  placeholder?: string;
  isLoading?: boolean;
}) {
  const { t } = useT();

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-[color:var(--border)] bg-white/70 p-6">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-[var(--brand-primary)]" />
          {t("transcribing")}
        </div>
      </div>
    );
  }

  if (!transcript) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-[color:var(--border)] bg-white/60 p-6 text-center text-sm text-slate-500">
        {placeholder ?? t("waiting_for_recording")}
      </div>
    );
  }

  return (
    <ScrollArea className="h-full max-h-[60vh] rounded-2xl border border-[color:var(--border)] bg-white/85 p-5">
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
        {transcript}
      </p>
    </ScrollArea>
  );
}
