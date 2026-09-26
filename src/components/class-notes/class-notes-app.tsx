"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Copy,
  Download,
  FileText,
  Mic,
  MonitorSpeaker,
  Pause,
  Play,
  Search,
  Square,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import {
  audioExtension,
  deleteSession,
  downloadBlob,
  fileSlug,
  formatClock,
  formatDate,
  listSessions,
  loadAudio,
  newId,
  saveAudio,
  saveSession,
  sessionToMarkdown,
  type Note,
  type NoteKind,
  type Session,
} from "@/lib/class-notes";
import { useRecorder, type AudioSource } from "./use-recorder";
import { NoteComposer, NotesList, TranscriptPane, inputClass } from "./panes";
import { StudyGuide } from "./study-guide";

const LANGUAGES = [
  ["en-US", "English (US)"],
  ["en-GB", "English (UK)"],
  ["es-ES", "Spanish"],
  ["fr-FR", "French"],
  ["de-DE", "German"],
  ["ar-EG", "Arabic"],
  ["pt-BR", "Portuguese (BR)"],
  ["hi-IN", "Hindi"],
  ["zh-CN", "Chinese (Mandarin)"],
] as const;

const PREFS_KEY = "class-notes:prefs";

type View = { kind: "record" } | { kind: "library" } | { kind: "session"; id: string };

function Panel({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="glass-strong rounded-3xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold tracking-wide text-white/70 uppercase">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

function LiveClock({ elapsed, running }: { elapsed: () => number; running: boolean }) {
  const [, force] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => force((n) => n + 1), 500);
    return () => clearInterval(id);
  }, [running]);
  return <span className="font-mono text-3xl font-semibold text-white tabular-nums">{formatClock(elapsed())}</span>;
}

export function ClassNotesApp() {
  const [view, setView] = useState<View>({ kind: "record" });
  const [sessions, setSessions] = useState<Session[]>([]);
  const [storageError, setStorageError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setSessions(await listSessions());
    } catch {
      setStorageError("Your browser is blocking local storage, so classes can't be saved (private mode?).");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const sessionsRef = useRef(sessions);
  useEffect(() => {
    sessionsRef.current = sessions;
  });

  // Patches apply to the latest copy, so a slow AI summary can't undo edits
  // made while it was running.
  const patchSession = useCallback(async (id: string, patch: Partial<Session>) => {
    const base = sessionsRef.current.find((s) => s.id === id);
    if (!base) return;
    const next = { ...base, ...patch };
    sessionsRef.current = sessionsRef.current.map((s) => (s.id === id ? next : s));
    setSessions(sessionsRef.current);
    await saveSession(next);
  }, []);

  const current = view.kind === "session" ? sessions.find((s) => s.id === view.id) : undefined;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-28 pb-20 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-[#f0c14b] uppercase">Class Notes</p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Record, transcribe, and take notes</h1>
        </div>
        <nav className="glass flex rounded-full p-1 text-sm" aria-label="Class Notes sections">
          {(
            [
              ["record", "Record", Mic],
              ["library", `Library${sessions.length ? ` (${sessions.length})` : ""}`, BookOpen],
            ] as const
          ).map(([kind, label, Icon]) => {
            const on = view.kind === kind || (kind === "library" && view.kind === "session");
            return (
              <button
                key={kind}
                type="button"
                onClick={() => setView({ kind })}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 transition ${
                  on ? "bg-[#f0c14b] font-semibold text-black" : "text-white/70 hover:text-white"
                }`}
              >
                <Icon size={15} /> {label}
              </button>
            );
          })}
        </nav>
      </header>

      {storageError ? (
        <p className="mt-6 flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          <TriangleAlert size={16} /> {storageError}
        </p>
      ) : null}

      <div className="mt-8">
        {/* The recorder stays mounted so switching tabs never stops a class. */}
        <div hidden={view.kind !== "record"}>
          <Recorder
            onSaved={async (id) => {
              await refresh();
              setView({ kind: "session", id });
            }}
            onAutosave={refresh}
          />
        </div>
        {view.kind === "library" ? (
          <Library sessions={sessions} onOpen={(id) => setView({ kind: "session", id })} />
        ) : null}
        {view.kind === "session" && current ? (
          <SessionView
            key={current.id}
            session={current}
            onBack={() => setView({ kind: "library" })}
            onPatch={(patch) => patchSession(current.id, patch)}
            onDelete={async () => {
              await deleteSession(current.id);
              await refresh();
              setView({ kind: "library" });
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

function Recorder({ onSaved, onAutosave }: { onSaved: (id: string) => void; onAutosave: () => void }) {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [lang, setLang] = useState("en-US");
  const [source, setSource] = useState<AudioSource>("mic");
  const [canCaptureTab, setCanCaptureTab] = useState(false);
  const [draft, setDraft] = useState<Session | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCanCaptureTab(!!navigator.mediaDevices?.getDisplayMedia && !/iPhone|iPad|Android/i.test(navigator.userAgent));
    try {
      const prefs = JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}");
      if (prefs.lang) setLang(prefs.lang);
      if (prefs.source) setSource(prefs.source);
      if (prefs.course) setCourse(prefs.course);
    } catch {
      /* no saved prefs */
    }
  }, []);

  const draftRef = useRef(draft);
  useEffect(() => {
    draftRef.current = draft;
  });

  const rec = useRecorder({
    lang,
    onFinalText: (t, text) =>
      setDraft((d) => (d ? { ...d, transcript: [...d.transcript, { id: newId(), t, text }] } : d)),
    onStopped: async (result) => {
      const d = draftRef.current;
      if (!d) return;
      setSaving(true);
      const final: Session = { ...d, durationMs: result.durationMs, audioType: result.blob ? result.type : undefined };
      try {
        if (result.blob) await saveAudio(d.id, result.blob);
        await saveSession(final);
      } catch {
        /* storage failure is surfaced by the library refresh */
      }
      setDraft(null);
      setTitle("");
      setSaving(false);
      onSaved(d.id);
    },
  });
  const active = rec.status === "recording" || rec.status === "paused";

  // Crash-safe autosave: the transcript and notes every few seconds, audio every 20s.
  const { elapsed, snapshot } = rec;
  useEffect(() => {
    if (!active) return;
    const text = setInterval(() => {
      const d = draftRef.current;
      if (d) saveSession({ ...d, durationMs: elapsed() }).then(onAutosave, () => {});
    }, 5000);
    const audio = setInterval(() => {
      const d = draftRef.current;
      const blob = snapshot();
      if (d && blob) saveAudio(d.id, blob).catch(() => {});
    }, 20000);
    return () => {
      clearInterval(text);
      clearInterval(audio);
    };
  }, [active, elapsed, snapshot, onAutosave]);

  useEffect(() => {
    if (!active) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [active]);

  const start = async () => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ lang, source, course }));
    } catch {
      /* ignore */
    }
    setDraft({
      id: newId(),
      title: title.trim() || `Class on ${new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })}`,
      course: course.trim(),
      createdAt: Date.now(),
      durationMs: 0,
      transcript: [],
      notes: [],
    });
    await rec.start(source);
  };

  const addNote = (text: string, kind: NoteKind) =>
    setDraft((d) => (d ? { ...d, notes: [...d.notes, { id: newId(), t: rec.elapsed(), text, kind }] } : d));

  const lastLine = draft?.transcript.at(-1);

  if (!active && rec.status !== "starting") {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Panel title="New class">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-white/70">
              Class or lecture title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Week 4: Cell respiration"
                className={`${inputClass} mt-1.5`}
              />
            </label>
            <label className="block text-sm text-white/70">
              Course
              <input
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="BIO 101"
                className={`${inputClass} mt-1.5`}
              />
            </label>
            <label className="block text-sm text-white/70">
              Instructor&apos;s language
              <select value={lang} onChange={(e) => setLang(e.target.value)} className={`${inputClass} mt-1.5`}>
                {LANGUAGES.map(([code, label]) => (
                  <option key={code} value={code} className="bg-neutral-900">
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <fieldset className="mt-6">
            <legend className="text-sm text-white/70">What should it record?</legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["mic", Mic, "Microphone", "Picks up your class from your speakers and your own voice. Works everywhere."],
                  [
                    "tab",
                    MonitorSpeaker,
                    "Class tab + microphone",
                    "Records the Zoom, Meet, or Teams browser tab directly, even with headphones on.",
                  ],
                ] as const
              ).map(([value, Icon, label, hint]) => {
                const disabled = value === "tab" && !canCaptureTab;
                const on = source === value && !disabled;
                return (
                  <button
                    key={value}
                    type="button"
                    disabled={disabled}
                    onClick={() => setSource(value)}
                    aria-pressed={on}
                    className={`rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      on ? "border-[#f0c14b]/70 bg-[#f0c14b]/10" : "border-white/10 bg-black/20 hover:border-white/25"
                    }`}
                  >
                    <span className="flex items-center gap-2 font-medium text-white">
                      <Icon size={17} className={on ? "text-[#f0c14b]" : "text-white/60"} /> {label}
                    </span>
                    <span className="mt-1.5 block text-xs leading-relaxed text-white/55">
                      {disabled ? "Needs a desktop Chrome or Edge browser." : hint}
                    </span>
                  </button>
                );
              })}
            </div>
            {source === "tab" && canCaptureTab ? (
              <p className="mt-3 text-xs leading-relaxed text-white/50">
                When asked, choose the <strong className="text-white/75">browser tab</strong> with your class and turn on{" "}
                <strong className="text-white/75">Share tab audio</strong>. The live transcript listens through your
                microphone, so play the class on speakers if you want it transcribed as it happens.
              </p>
            ) : null}
          </fieldset>

          {rec.error ? (
            <p className="mt-5 flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              <TriangleAlert size={16} className="mt-0.5 shrink-0" /> {rec.error}
            </p>
          ) : null}

          <button type="button" onClick={start} disabled={saving} className="btn-solid mt-6 w-full justify-center sm:w-auto">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600" /> {saving ? "Saving…" : "Start recording"}
          </button>
        </Panel>

        <aside className="glass rounded-3xl p-5 text-sm leading-relaxed text-white/60 sm:p-6">
          <h2 className="font-semibold text-white">How it works</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-4">
            <li>Start recording when class begins.</li>
            <li>The transcript fills in by itself while the instructor talks.</li>
            <li>Type your own notes any time. Each one is stamped with the class time.</li>
            <li>Stop, then replay any moment by clicking a timestamp, or export everything.</li>
          </ol>
          {!rec.speechSupported ? (
            <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-amber-200">
              This browser can record audio but not transcribe live. Use Chrome, Edge, or Safari for the transcript.
            </p>
          ) : null}
          <p className="mt-4 text-xs text-white/45">
            Recordings and notes stay on this device only. Check your school&apos;s rules and get permission before
            recording a class.
          </p>
        </aside>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="glass-strong flex flex-wrap items-center gap-x-6 gap-y-4 rounded-3xl p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span
            className={`h-3 w-3 rounded-full ${
              rec.status === "recording" ? "animate-pulse bg-rose-500" : "bg-white/30"
            }`}
            aria-hidden
          />
          <LiveClock elapsed={rec.elapsed} running={rec.status === "recording"} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-white">{draft?.title}</p>
          <p className="truncate text-sm text-white/50">
            {rec.status === "paused" ? "Paused" : rec.status === "starting" ? "Starting…" : "Recording"}
            {draft?.course ? ` · ${draft.course}` : ""}
          </p>
          <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10" aria-hidden>
            <div
              ref={rec.levelRef}
              className="h-full origin-left bg-[#f0c14b] transition-transform duration-75"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
        <div className="flex gap-2">
          {rec.status === "paused" ? (
            <button type="button" onClick={rec.resume} className="btn-glass">
              <Play size={16} /> Resume
            </button>
          ) : (
            <button type="button" onClick={rec.pause} disabled={rec.status !== "recording"} className="btn-glass">
              <Pause size={16} /> Pause
            </button>
          )}
          <button type="button" onClick={rec.stop} disabled={saving || rec.status === "starting"} className="btn-solid">
            <Square size={14} /> {saving ? "Saving…" : "Stop & save"}
          </button>
        </div>
      </section>

      {rec.speechNote ? (
        <p className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <TriangleAlert size={16} className="shrink-0" /> {rec.speechNote}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Panel
          title="Live transcript"
          right={<span className="text-xs text-white/40">{draft?.transcript.length ?? 0} lines</span>}
        >
          <TranscriptPane
            lines={draft?.transcript ?? []}
            interim={rec.interim}
            live
            emptyText={
              !rec.speechSupported
                ? "Live transcript isn't available in this browser. Audio is still recording."
                : rec.status === "paused"
                  ? "Paused. Resume to keep transcribing."
                  : "Listening… the transcript will appear as the instructor speaks."
            }
          />
        </Panel>
        <Panel title="My notes" right={<span className="text-xs text-white/40">{draft?.notes.length ?? 0}</span>}>
          <NoteComposer
            onAdd={addNote}
            canQuote={!!lastLine}
            onQuoteLast={() => lastLine && addNote(lastLine.text, "important")}
          />
          <div className="mt-5 max-h-[24rem] overflow-y-auto pr-1">
            <NotesList
              notes={draft?.notes ?? []}
              onDelete={(id) => setDraft((d) => (d ? { ...d, notes: d.notes.filter((n) => n.id !== id) } : d))}
              emptyText="Your notes will show up here, stamped with the class time."
            />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Library({ sessions, onOpen }: { sessions: Session[]; onOpen: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q) ||
        s.notes.some((n) => n.text.toLowerCase().includes(q)) ||
        s.transcript.some((l) => l.text.toLowerCase().includes(q)),
    );
  }, [sessions, query]);

  if (sessions.length === 0) {
    return (
      <div className="glass-strong rounded-3xl px-6 py-16 text-center">
        <BookOpen size={32} className="mx-auto text-[#f0c14b]" />
        <p className="mt-4 font-medium text-white">No classes yet</p>
        <p className="mt-1 text-sm text-white/55">Record your first class and it will be saved here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="relative block max-w-md">
        <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-white/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search titles, notes, and transcripts"
          className={`${inputClass} pl-10`}
        />
      </label>
      {shown.length === 0 ? <p className="py-10 text-center text-sm text-white/45">No classes match.</p> : null}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onOpen(s.id)}
              className="glass-strong h-full w-full rounded-2xl p-5 text-left transition hover:border-[#f0c14b]/40"
            >
              {s.course ? (
                <span className="text-xs font-semibold tracking-wide text-[#f0c14b] uppercase">{s.course}</span>
              ) : null}
              <p className="mt-1 line-clamp-2 font-semibold text-white">{s.title}</p>
              <p className="mt-2 text-xs text-white/50">
                {formatDate(s.createdAt)} · {formatClock(s.durationMs)}
              </p>
              <p className="mt-3 text-xs text-white/45">
                {s.notes.length} notes · {s.transcript.length} transcript lines
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SessionView({
  session,
  onBack,
  onPatch,
  onDelete,
}: {
  session: Session;
  onBack: () => void;
  onPatch: (patch: Partial<Session>) => void;
  onDelete: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [now, setNow] = useState(0);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let url: string | null = null;
    loadAudio(session.id)
      .then((blob) => {
        if (!blob) return;
        url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
      })
      .catch(() => {});
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [session.id]);

  const seek = (t: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = t / 1000;
    a.play().catch(() => {});
  };

  const update = onPatch;
  const addNote = (text: string, kind: NoteKind) => {
    const note: Note = { id: newId(), t: now, text, kind };
    update({ notes: [...session.notes, note] });
  };

  const exportMarkdown = () =>
    downloadBlob(new Blob([sessionToMarkdown(session)], { type: "text/markdown" }), `${fileSlug(session)}.md`);

  const copyNotes = async () => {
    try {
      await navigator.clipboard.writeText(sessionToMarkdown(session));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="space-y-6">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
        <ArrowLeft size={16} /> All classes
      </button>

      <section className="glass-strong rounded-3xl p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
          <input
            value={session.title}
            onChange={(e) => update({ title: e.target.value })}
            aria-label="Class title"
            className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-xl font-bold text-white outline-none hover:border-white/10 focus:border-[#f0c14b]/60"
          />
          <input
            value={session.course}
            onChange={(e) => update({ course: e.target.value })}
            placeholder="Add course"
            aria-label="Course"
            className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-[#f0c14b] outline-none placeholder:text-white/30 hover:border-white/10 focus:border-[#f0c14b]/60"
          />
        </div>
        <p className="mt-1 px-2 text-sm text-white/50">
          {formatDate(session.createdAt)} · {formatClock(session.durationMs)}
        </p>

        {audioUrl ? (
          <audio
            ref={audioRef}
            src={audioUrl}
            controls
            onLoadedMetadata={(e) => {
              // Browser-recorded WebM has no duration header, which breaks the
              // scrubber and seeking. Jumping far past the end makes the
              // browser scan the file and learn its real length.
              const a = e.currentTarget;
              if (a.duration === Infinity) {
                a.currentTime = 1e101;
                a.addEventListener("durationchange", () => (a.currentTime = 0), { once: true });
              }
            }}
            onTimeUpdate={(e) => setNow(e.currentTarget.currentTime * 1000)}
            className="mt-5 w-full"
          />
        ) : (
          <p className="mt-5 text-sm text-white/45">No audio was saved for this class.</p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={exportMarkdown} className="btn-glass text-sm">
            <FileText size={15} /> Export notes
          </button>
          <button type="button" onClick={copyNotes} className="btn-glass text-sm">
            <Copy size={15} /> {copied ? "Copied!" : "Copy all"}
          </button>
          {audioBlob ? (
            <button
              type="button"
              onClick={() => downloadBlob(audioBlob, `${fileSlug(session)}.${audioExtension(session.audioType)}`)}
              className="btn-glass text-sm"
            >
              <Download size={15} /> Download audio
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              if (confirm("Delete this class, its recording, and all its notes? This can't be undone.")) onDelete();
            }}
            className="ml-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-rose-300/80 transition hover:bg-rose-500/10 hover:text-rose-200"
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </section>

      <StudyGuide session={session} onGuide={(guide) => update({ guide })} onSeek={audioUrl ? seek : undefined} />

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Panel
          title="Transcript"
          right={
            <label className="relative w-44">
              <Search size={14} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-white/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-full rounded-full border border-white/10 bg-black/30 py-1.5 pr-3 pl-8 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#f0c14b]/60"
              />
            </label>
          }
        >
          <TranscriptPane
            lines={session.transcript}
            onSeek={audioUrl ? seek : undefined}
            activeT={audioUrl ? now : undefined}
            query={query.trim()}
            emptyText="No transcript was captured for this class."
          />
        </Panel>
        <Panel title="My notes" right={<span className="text-xs text-white/40">{session.notes.length}</span>}>
          <NoteComposer onAdd={addNote} placeholder={`Add a note at ${formatClock(now)}… (Enter to save)`} />
          <div className="mt-5 max-h-[26rem] overflow-y-auto pr-1">
            <NotesList
              notes={session.notes}
              onSeek={audioUrl ? seek : undefined}
              onDelete={(id) => update({ notes: session.notes.filter((n) => n.id !== id) })}
              emptyText="No notes yet. Play the recording and add notes as you review."
            />
          </div>
        </Panel>
      </div>
    </div>
  );
}
