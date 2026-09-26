"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Records class audio (MediaRecorder) and, in parallel, live-transcribes the
// microphone with the browser's built-in speech recognition. Time is tracked
// as "class time": paused stretches are not counted, so every timestamp
// lines up with the saved recording.

export type AudioSource = "mic" | "tab";
export type RecorderStatus = "idle" | "starting" | "recording" | "paused";

type SpeechAlternative = { transcript: string };
type SpeechResult = { isFinal: boolean; 0: SpeechAlternative; length: number };
type SpeechEvent = { resultIndex: number; results: { length: number; [i: number]: SpeechResult } };
type SpeechErrorEvent = { error: string };
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SpeechEvent) => void) | null;
  onerror: ((e: SpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type SpeechCtor = new () => SpeechRecognitionLike;

function speechCtor(): SpeechCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: SpeechCtor; webkitSpeechRecognition?: SpeechCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function pickMimeType() {
  const options = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  return options.find((t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t));
}

export type RecordingResult = { blob: Blob | null; type: string; durationMs: number };

export function useRecorder(opts: {
  lang: string;
  onFinalText: (t: number, text: string) => void;
  onStopped: (result: RecordingResult) => void;
}) {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [speechNote, setSpeechNote] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  const optsRef = useRef(opts);
  useEffect(() => {
    optsRef.current = opts;
  });
  useEffect(() => setSpeechSupported(speechCtor() !== null), []);

  const levelRef = useRef<HTMLDivElement | null>(null);
  const streamsRef = useRef<MediaStream[]>([]);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeRef = useRef("audio/webm");
  const speechRef = useRef<SpeechRecognitionLike | null>(null);
  const wantSpeechRef = useRef(false);
  const segmentStartRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);
  const runningSinceRef = useRef<number | null>(null);

  const elapsed = useCallback(
    () => accumulatedRef.current + (runningSinceRef.current ? Date.now() - runningSinceRef.current : 0),
    [],
  );

  const startSpeech = useCallback(() => {
    const Ctor = speechCtor();
    if (!Ctor) return;
    wantSpeechRef.current = true;
    const rec = new Ctor();
    rec.lang = optsRef.current.lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let pending = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const text = r[0].transcript.trim();
        if (segmentStartRef.current === null && text) segmentStartRef.current = elapsed();
        if (r.isFinal) {
          if (text) optsRef.current.onFinalText(segmentStartRef.current ?? elapsed(), text);
          segmentStartRef.current = null;
        } else {
          pending += `${text} `;
        }
      }
      setInterim(pending.trim());
      setSpeechNote(null);
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        wantSpeechRef.current = false;
        setSpeechNote("Live transcript is blocked. Allow microphone access for this site to turn it on.");
      } else if (e.error === "network") {
        setSpeechNote("Live transcript lost its connection. Retrying, and the audio is still recording.");
      } else if (e.error === "language-not-supported") {
        wantSpeechRef.current = false;
        setSpeechNote("This browser can't transcribe that language. Try another language setting.");
      }
    };
    // Browsers end recognition after silences or ~1 minute; keep it going.
    rec.onend = () => {
      setInterim("");
      segmentStartRef.current = null;
      if (wantSpeechRef.current && speechRef.current === rec) {
        setTimeout(() => {
          if (wantSpeechRef.current && speechRef.current === rec) {
            try {
              rec.start();
            } catch {
              /* already started */
            }
          }
        }, 250);
      }
    };
    speechRef.current = rec;
    try {
      rec.start();
    } catch {
      /* ignore double start */
    }
  }, [elapsed]);

  const stopSpeech = useCallback(() => {
    wantSpeechRef.current = false;
    const rec = speechRef.current;
    speechRef.current = null;
    if (rec) {
      rec.onend = null;
      try {
        rec.stop();
      } catch {
        /* not running */
      }
    }
    setInterim("");
    segmentStartRef.current = null;
  }, []);

  const teardown = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamsRef.current.forEach((s) => s.getTracks().forEach((t) => t.stop()));
    streamsRef.current = [];
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    if (levelRef.current) levelRef.current.style.transform = "scaleX(0)";
  }, []);

  const finish = useCallback(() => {
    if (runningSinceRef.current) accumulatedRef.current += Date.now() - runningSinceRef.current;
    runningSinceRef.current = null;
    stopSpeech();
    teardown();
    const type = mimeRef.current;
    const blob = chunksRef.current.length ? new Blob(chunksRef.current, { type }) : null;
    recorderRef.current = null;
    setStatus("idle");
    optsRef.current.onStopped({ blob, type, durationMs: accumulatedRef.current });
  }, [stopSpeech, teardown]);

  const start = useCallback(
    async (source: AudioSource) => {
      setError(null);
      setSpeechNote(null);
      setStatus("starting");
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("This browser can't record audio.");
        const streams: MediaStream[] = [];
        streamsRef.current = streams;
        let tab: MediaStream | null = null;
        if (source === "tab") {
          if (!navigator.mediaDevices.getDisplayMedia) {
            throw new Error("This browser can't capture tab audio. Use the microphone option instead.");
          }
          tab = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
          streams.push(tab);
          if (tab.getAudioTracks().length === 0) {
            throw new Error(
              'No audio was shared. Pick the browser tab with your class and turn on "Share tab audio".',
            );
          }
        }
        const mic = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
        });
        streams.push(mic);

        const ctx = new AudioContext();
        ctxRef.current = ctx;
        const dest = ctx.createMediaStreamDestination();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        for (const s of tab ? [tab, mic] : [mic]) {
          const node = ctx.createMediaStreamSource(new MediaStream(s.getAudioTracks()));
          node.connect(dest);
          node.connect(analyser);
        }

        const data = new Uint8Array(analyser.fftSize);
        const tick = () => {
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (const v of data) sum += ((v - 128) / 128) ** 2;
          const level = Math.min(1, Math.sqrt(sum / data.length) * 4);
          if (levelRef.current) levelRef.current.style.transform = `scaleX(${level})`;
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();

        const mimeType = pickMimeType();
        const recorder = new MediaRecorder(dest.stream, mimeType ? { mimeType } : undefined);
        mimeRef.current = recorder.mimeType || mimeType || "audio/webm";
        chunksRef.current = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        recorder.onstop = finish;
        recorder.start(1000);
        recorderRef.current = recorder;

        // Ending the screen share from the browser bar ends the recording.
        tab?.getAudioTracks()[0].addEventListener("ended", () => {
          if (recorderRef.current?.state !== "inactive") recorderRef.current?.stop();
        });

        accumulatedRef.current = 0;
        runningSinceRef.current = Date.now();
        startSpeech();
        setStatus("recording");
      } catch (err) {
        teardown();
        setStatus("idle");
        const e = err as Error & { name?: string };
        if (e.name === "NotAllowedError") {
          setError("Permission was denied. Allow microphone (and screen share, for tab audio) and try again.");
        } else if (e.name === "NotFoundError") {
          setError("No microphone was found. Plug one in or check your system settings.");
        } else {
          setError(e.message || "Couldn't start recording.");
        }
      }
    },
    [finish, startSpeech, teardown],
  );

  const pause = useCallback(() => {
    const r = recorderRef.current;
    if (!r || r.state !== "recording") return;
    r.pause();
    if (runningSinceRef.current) accumulatedRef.current += Date.now() - runningSinceRef.current;
    runningSinceRef.current = null;
    stopSpeech();
    setStatus("paused");
  }, [stopSpeech]);

  const resume = useCallback(() => {
    const r = recorderRef.current;
    if (!r || r.state !== "paused") return;
    r.resume();
    runningSinceRef.current = Date.now();
    startSpeech();
    setStatus("recording");
  }, [startSpeech]);

  // Saving happens in onStopped, which also fires when the tab share ends.
  const stop = useCallback(() => {
    const r = recorderRef.current;
    if (r && r.state !== "inactive") r.stop();
  }, []);

  // Audio captured so far, for crash-safe autosaves while recording.
  const snapshot = useCallback(
    () => (chunksRef.current.length ? new Blob(chunksRef.current, { type: mimeRef.current }) : null),
    [],
  );

  useEffect(
    () => () => {
      stopSpeech();
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.onstop = null;
        recorderRef.current.stop();
      }
      teardown();
    },
    [stopSpeech, teardown],
  );

  return {
    status,
    interim,
    error,
    speechNote,
    speechSupported,
    levelRef,
    elapsed,
    start,
    pause,
    resume,
    stop,
    snapshot,
  };
}
