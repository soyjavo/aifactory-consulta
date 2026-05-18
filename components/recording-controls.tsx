"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Mic, Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

export type RecordingState =
  | "idle"
  | "requestingMic"
  | "recording"
  | "processing"
  | "ready"
  | "syncing"
  | "synced";

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function RecordingControls({
  state,
  elapsed,
  hasResult,
  onStart,
  onStop,
  onSync,
  errorMessage,
}: {
  state: RecordingState;
  elapsed: number;
  hasResult: boolean;
  onStart: () => void;
  onStop: () => void;
  onSync: () => void;
  errorMessage?: string | null;
}) {
  const recording = state === "recording";
  const processing = state === "processing" || state === "requestingMic";
  const synced = state === "synced";
  const syncing = state === "syncing";

  if (synced) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 backdrop-blur">
        <div className="flex items-center gap-2 text-emerald-800">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm font-semibold">Consulta sincronizada con Patient Companion</span>
        </div>
        <a
          href="https://patient-companion.butterbase.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-primary)] hover:underline"
        >
          Abrir Patient Companion ↗
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[color:var(--border)] bg-white/85 p-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <span
          className={`relative inline-flex h-3 w-3 rounded-full ${
            recording ? "bg-rose-500" : processing ? "bg-amber-500" : "bg-slate-300"
          }`}
        >
          {recording && (
            <span className="absolute inset-0 -m-1 animate-ping rounded-full bg-rose-400/60" />
          )}
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            {state === "idle" && !hasResult && "Listo para grabar"}
            {state === "requestingMic" && "Solicitando micrófono…"}
            {state === "recording" && "Grabando consulta"}
            {state === "processing" && "Procesando con Gemini"}
            {state === "ready" && "Listo para sincronizar"}
            {state === "syncing" && "Sincronizando…"}
          </p>
          <p className="font-mono text-2xl font-semibold tabular-nums text-slate-900">
            {formatTimer(elapsed)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {errorMessage && (
          <p className="max-w-xs text-xs text-rose-700">{errorMessage}</p>
        )}

        {state === "idle" && !hasResult && (
          <Button
            size="lg"
            onClick={onStart}
            className="bg-[var(--brand-primary)] text-white shadow-sm hover:bg-[#0b5d57]"
          >
            <Mic className="mr-2 h-4 w-4" />
            Iniciar Consulta
          </Button>
        )}

        {state === "requestingMic" && (
          <Button size="lg" disabled className="bg-slate-300 text-white">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Esperando permiso…
          </Button>
        )}

        {state === "recording" && (
          <Button
            size="lg"
            onClick={onStop}
            className="bg-rose-600 text-white shadow-sm hover:bg-rose-700"
          >
            <Square className="mr-2 h-4 w-4" />
            Detener
          </Button>
        )}

        {state === "processing" && (
          <Button size="lg" disabled className="bg-slate-300 text-white">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Procesando…
          </Button>
        )}

        {state === "ready" && hasResult && (
          <Button
            size="lg"
            onClick={onSync}
            className="bg-[var(--brand-accent)] text-slate-900 shadow-sm hover:bg-[#d68707]"
          >
            <Send className="mr-2 h-4 w-4" />
            Sync to Patient Companion
          </Button>
        )}

        {syncing && (
          <Button size="lg" disabled className="bg-slate-300 text-white">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sincronizando…
          </Button>
        )}
      </div>
    </div>
  );
}

export function useRecordingTimer(state: RecordingState) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (state === "recording") {
      startRef.current = Date.now();
      setElapsed(0);
      const id = setInterval(() => {
        if (startRef.current !== null) {
          setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
        }
      }, 250);
      return () => clearInterval(id);
    }
    if (state === "idle") {
      startRef.current = null;
      setElapsed(0);
    }
  }, [state]);

  return elapsed;
}
