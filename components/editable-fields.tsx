"use client";

import {
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Pencil, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/components/i18n-provider";

const FOCUS_RING =
  "rounded-md outline-none ring-2 ring-[var(--brand-primary)]/40 ring-offset-1 ring-offset-white";

function notifyCommit(t: ReturnType<typeof useT>["t"]) {
  toast(t("field_updated"), { duration: 1800 });
}

function EditedBadge() {
  const { t } = useT();
  return (
    <span className="ml-2 inline-flex items-center rounded-full bg-[var(--brand-primary)]/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-primary)]">
      ✓ {t("edited")}
    </span>
  );
}

function PencilHint() {
  return (
    <Pencil className="ml-1.5 inline-block h-3 w-3 align-baseline text-slate-400 opacity-0 transition group-hover:opacity-100" />
  );
}

export function EditableLine({
  value,
  original,
  onChange,
  placeholder,
  readOnly,
  className = "",
  multiline = false,
}: {
  value: string | null;
  original?: string | null;
  onChange: (next: string | null) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  multiline?: boolean;
}) {
  const { t } = useT();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!editing) setDraft(value ?? "");
  }, [value, editing]);

  const commit = () => {
    const trimmed = draft.trim();
    const next = trimmed.length === 0 ? null : trimmed;
    setEditing(false);
    if ((value ?? null) !== next) {
      onChange(next);
      notifyCommit(t);
    }
  };

  const cancel = () => {
    setDraft(value ?? "");
    setEditing(false);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    } else if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
    } else if (e.key === "Enter" && multiline && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      (e.target as HTMLTextAreaElement).blur();
    }
  };

  const display = value && value.trim().length > 0 ? value : null;
  const showPlaceholder = !display;
  const isEdited =
    original !== undefined && (value ?? null) !== (original ?? null);

  if (readOnly) {
    if (showPlaceholder) return null;
    return <span className={className}>{display}</span>;
  }

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={ref as React.RefObject<HTMLTextAreaElement>}
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={onKey}
          rows={Math.min(6, Math.max(2, draft.split("\n").length))}
          className={`w-full resize-y rounded-md border border-[var(--brand-primary)]/30 bg-white px-2 py-1 text-sm text-slate-900 ${FOCUS_RING}`}
        />
      );
    }
    return (
      <input
        ref={ref as React.RefObject<HTMLInputElement>}
        autoFocus
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKey}
        className={`w-full rounded-md border border-[var(--brand-primary)]/30 bg-white px-2 py-1 text-sm text-slate-900 ${FOCUS_RING} ${className}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={`group inline-flex w-full items-baseline rounded-md px-1.5 py-0.5 text-left transition hover:bg-[var(--brand-primary)]/5 ${className}`}
    >
      <span className={showPlaceholder ? "text-slate-400 italic" : "text-slate-800"}>
        {display ?? placeholder ?? t("placeholder_empty")}
      </span>
      <PencilHint />
      {isEdited && <EditedBadge />}
    </button>
  );
}

export function EditableNumber({
  value,
  original,
  onChange,
  unit,
  readOnly,
}: {
  value: number | null;
  original?: number | null;
  onChange: (next: number | null) => void;
  unit?: string;
  readOnly?: boolean;
}) {
  const { t } = useT();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value === null ? "" : String(value));

  useEffect(() => {
    if (!editing) setDraft(value === null ? "" : String(value));
  }, [value, editing]);

  const commit = () => {
    const trimmed = draft.trim();
    let next: number | null = null;
    if (trimmed.length > 0) {
      const parsed = Number(trimmed);
      next = Number.isFinite(parsed) ? parsed : null;
    }
    setEditing(false);
    if ((value ?? null) !== next) {
      onChange(next);
      notifyCommit(t);
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setDraft(value === null ? "" : String(value));
      setEditing(false);
    } else if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const isEdited = original !== undefined && (value ?? null) !== (original ?? null);
  const display = value === null ? null : `${value}${unit ?? ""}`;

  if (readOnly) {
    if (display === null) return null;
    return (
      <span className="font-mono tabular-nums text-slate-900">{display}</span>
    );
  }

  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        inputMode="decimal"
        step="any"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKey}
        className={`w-full rounded-md border border-[var(--brand-primary)]/30 bg-white px-1.5 py-1 text-base font-mono font-semibold tabular-nums text-slate-900 ${FOCUS_RING}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="group inline-flex w-full items-baseline justify-start gap-1 rounded-md px-1 py-0.5 text-left transition hover:bg-[var(--brand-primary)]/5"
    >
      <span
        className={
          display === null
            ? "font-mono text-base text-slate-400 italic"
            : "font-mono text-base font-semibold tabular-nums text-slate-900"
        }
      >
        {display ?? "—"}
      </span>
      <PencilHint />
      {isEdited && <EditedBadge />}
    </button>
  );
}

export function RemoveButton({ onClick }: { onClick: () => void }) {
  const { t } = useT();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t("remove")}
      className="rounded-full p-1 text-slate-400 transition hover:bg-rose-100 hover:text-rose-600"
    >
      <X className="h-3.5 w-3.5" />
    </button>
  );
}

export function AddButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label?: string;
}) {
  const { t } = useT();
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full border border-dashed border-[var(--brand-primary)]/40 px-2.5 py-1 text-xs font-semibold text-[var(--brand-primary)] transition hover:bg-[var(--brand-primary)]/5"
    >
      <Plus className="h-3 w-3" />
      {label ?? t("add")}
    </button>
  );
}
