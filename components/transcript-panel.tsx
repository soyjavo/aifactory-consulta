import { ScrollArea } from "@/components/ui/scroll-area";

export type TranscriptSegment = {
  id: string;
  speaker: "doctor" | "patient" | "system";
  text: string;
  timestamp?: string;
};

export function TranscriptPanel({
  segments,
  placeholder = "La transcripción aparecerá aquí cuando inicies la consulta.",
}: {
  segments: TranscriptSegment[];
  placeholder?: string;
}) {
  if (segments.length === 0) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center rounded-xl border border-dashed border-[color:var(--border)] bg-white/60 p-6 text-center text-sm text-slate-500">
        {placeholder}
      </div>
    );
  }

  return (
    <ScrollArea className="h-full max-h-[60vh] rounded-xl border border-[color:var(--border)] bg-white/80 p-4">
      <ol className="space-y-3">
        {segments.map((segment) => (
          <li key={segment.id} className="text-sm leading-relaxed">
            <span
              className={
                segment.speaker === "doctor"
                  ? "mr-2 inline-block rounded-full bg-[var(--brand-primary)]/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--brand-primary)]"
                  : segment.speaker === "patient"
                    ? "mr-2 inline-block rounded-full bg-[var(--brand-accent)]/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[color:#92400E]"
                    : "mr-2 inline-block rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600"
              }
            >
              {segment.speaker === "doctor"
                ? "Dr."
                : segment.speaker === "patient"
                  ? "Paciente"
                  : "Sistema"}
            </span>
            <span className="text-slate-800">{segment.text}</span>
          </li>
        ))}
      </ol>
    </ScrollArea>
  );
}
