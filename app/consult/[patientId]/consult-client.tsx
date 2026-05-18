"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { useT } from "@/components/i18n-provider";
import { PatientContextBar } from "@/components/patient-context-bar";
import { TranscriptPanel } from "@/components/transcript-panel";
import { StructuredOutputPanel } from "@/components/structured-output-panel";
import {
  RecordingControls,
  type RecordingState,
  useRecordingTimer,
} from "@/components/recording-controls";
import type { Patient, SoapConsultation } from "@/lib/types";

async function blobToBase64(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export function ConsultClient({ patient }: { patient: Patient }) {
  const { t } = useT();
  const [state, setState] = useState<RecordingState>("idle");
  const [transcript, setTranscript] = useState("");
  const [structured, setStructured] = useState<SoapConsultation | null>(null);
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const elapsed = useRecordingTimer(state);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => () => cleanupStream(), [cleanupStream]);

  const processRecording = useCallback(
    async (blob: Blob) => {
      setState("processing");
      try {
        const audioBase64 = await blobToBase64(blob);
        const mimeType = blob.type || "audio/webm";

        const transcribeRes = await fetch("/api/transcribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audio: audioBase64,
            mimeType,
            patientId: patient.id,
          }),
        });
        const transcribeData = await transcribeRes.json();
        if (!transcribeRes.ok) {
          throw new Error(transcribeData.error ?? "Transcription failed");
        }
        setTranscript(transcribeData.transcript);
        setConsultationId(transcribeData.consultationId);

        const extractRes = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcript: transcribeData.transcript,
            consultationId: transcribeData.consultationId,
          }),
        });
        const extractData = await extractRes.json();
        if (!extractRes.ok) {
          toast.error(t("extraction_failed"));
          setErrorMessage(extractData.error ?? "Extraction failed");
          setState("ready");
          return;
        }
        setStructured(extractData.structured);
        setState("ready");
        toast.success(t("consultation_processed"));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error";
        setErrorMessage(message);
        toast.error(message);
        setState("idle");
      }
    },
    [patient.id, t],
  );

  const onStart = useCallback(async () => {
    setErrorMessage(null);
    setTranscript("");
    setStructured(null);
    setConsultationId(null);
    setState("requestingMic");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        cleanupStream();
        void processRecording(blob);
      };

      recorderRef.current = recorder;
      recorder.start();
      setState("recording");
    } catch (err) {
      cleanupStream();
      const message =
        err instanceof Error ? err.message : "Microphone unavailable";
      setErrorMessage(`${t("mic_denied_title")}: ${message}`);
      toast.error(t("mic_denied_title"));
      setState("idle");
    }
  }, [cleanupStream, processRecording, t]);

  const onStop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    } else {
      cleanupStream();
      setState("idle");
    }
  }, [cleanupStream]);

  const onSync = useCallback(async () => {
    if (!consultationId) return;
    setState("syncing");
    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consultationId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Sync failed");
      setState("synced");
      toast.success(t("synced_toast"));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sync failed";
      setErrorMessage(message);
      toast.error(message);
      setState("ready");
    }
  }, [consultationId, t]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[var(--brand-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back_home")}
        </Link>

        <div className="mt-6 space-y-6">
          <PatientContextBar patient={patient} />

          <div className="grid gap-6 lg:grid-cols-5">
            <section className="lg:col-span-3">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                {t("transcript")}
              </h2>
              <TranscriptPanel
                transcript={transcript}
                isLoading={state === "processing" && !transcript}
              />
            </section>
            <section className="lg:col-span-2">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                {t("structured_output")}
              </h2>
              <StructuredOutputPanel
                data={structured}
                isLoading={state === "processing" && !!transcript && !structured}
              />
            </section>
          </div>

          <RecordingControls
            state={state}
            elapsed={elapsed}
            hasResult={!!transcript && !!structured}
            onStart={onStart}
            onStop={onStop}
            onSync={onSync}
            errorMessage={errorMessage}
          />
        </div>
      </main>
    </div>
  );
}
