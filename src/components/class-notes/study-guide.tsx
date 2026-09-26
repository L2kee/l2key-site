"use client";

import { useEffect, useState } from "react";
import { BookMarked, ClipboardList, KeyRound, Lightbulb, RefreshCw, Sparkles, TriangleAlert } from "lucide-react";
import { parseClock, type Session, type StudyGuide as Guide } from "@/lib/class-notes";
import { inputClass } from "./panes";

const CODE_KEY = "class-notes:access-code";

function readCode() {
  try {
    return localStorage.getItem(CODE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function StudyGuide({
  session,
  onGuide,
  onSeek,
}: {
  session: Session;
  onGuide: (guide: Guide) => void;
  onSeek?: (t: number) => void;
}) {
  const [code, setCode] = useState("");
  const [askCode, setAskCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setCode(readCode()), []);

  const empty = session.transcript.length === 0 && session.notes.length === 0;

  const generate = async (accessCode = code) => {
    if (!accessCode) {
      setAskCode(true);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/class-notes/summarize", {
        method: "POST",
        headers: { "content-type": "application/json", "x-access-code": accessCode },
        body: JSON.stringify({
          title: session.title,
          course: session.course,
          transcript: session.transcript.map(({ t, text }) => ({ t, text })),
          notes: session.notes.map(({ t, text, kind }) => ({ t, text, kind })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        try {
          localStorage.removeItem(CODE_KEY);
        } catch {
          /* ignore */
        }
        setCode("");
        setAskCode(true);
        throw new Error(data.error ?? "That access code isn't right.");
      }
      if (!res.ok || !data.guide) throw new Error(data.error ?? "Couldn't make the study guide. Try again.");
      try {
        localStorage.setItem(CODE_KEY, accessCode);
      } catch {
        /* ignore */
      }
      setAskCode(false);
      onGuide(data.guide);
    } catch (err) {
      setError((err as Error).message || "Couldn't reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const g = session.guide;

  return (
    <section className="glass-strong rounded-3xl p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white/70 uppercase">
          <Sparkles size={15} className="text-[#f0c14b]" /> AI study guide
        </h2>
        {g && !loading ? (
          <button
            type="button"
            onClick={() => generate()}
            className="inline-flex items-center gap-1.5 text-xs text-white/50 transition hover:text-[#f0c14b]"
          >
            <RefreshCw size={13} /> Regenerate
          </button>
        ) : null}
      </div>

      {askCode ? (
        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (code.trim()) generate(code.trim());
          }}
        >
          <label className="relative flex-1">
            <KeyRound size={15} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-white/40" />
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Access code"
              autoFocus
              aria-label="Access code"
              className={`${inputClass} pl-10`}
            />
          </label>
          <button type="submit" disabled={!code.trim() || loading} className="btn-solid justify-center disabled:opacity-40">
            Unlock
          </button>
        </form>
      ) : null}

      {error ? (
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" /> {error}
        </p>
      ) : null}

      {loading ? (
        <div className="mt-5 space-y-3" role="status">
          <p className="text-sm text-white/60">Reading the whole class and writing your study guide. This usually takes under a minute…</p>
          {[80, 95, 65].map((w) => (
            <div key={w} className="h-3 animate-pulse rounded-full bg-white/10" style={{ width: `${w}%` }} />
          ))}
        </div>
      ) : g ? (
        <GuideBody guide={g} onSeek={onSeek} />
      ) : !askCode ? (
        <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/55">
            {empty
              ? "Nothing to summarize yet. Add a few notes first."
              : "Get a summary, key points linked to the recording, terms, homework, and practice questions."}
          </p>
          <button type="button" onClick={() => generate()} disabled={empty} className="btn-solid shrink-0 disabled:opacity-40">
            <Sparkles size={15} /> Make study guide
          </button>
        </div>
      ) : null}
    </section>
  );
}

function Heading({ icon: Icon, children }: { icon: typeof Lightbulb; children: React.ReactNode }) {
  return (
    <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-white">
      <Icon size={15} className="text-[#f0c14b]" /> {children}
    </h3>
  );
}

function GuideBody({ guide, onSeek }: { guide: Guide; onSeek?: (t: number) => void }) {
  return (
    <div className="mt-5 space-y-7">
      <p className="leading-relaxed text-white/85">{guide.overview}</p>

      {guide.keyPoints.length ? (
        <div>
          <Heading icon={Lightbulb}>Key points</Heading>
          <ul className="space-y-2">
            {guide.keyPoints.map((k, i) => {
              const t = parseClock(k.time);
              return (
                <li key={i} className="grid grid-cols-[3.75rem_1fr] gap-3">
                  {t !== null && onSeek ? (
                    <button
                      type="button"
                      onClick={() => onSeek(t)}
                      title="Play from here"
                      className="self-start pt-0.5 text-left font-mono text-xs text-[#f0c14b]/80 tabular-nums hover:text-[#f0c14b] hover:underline"
                    >
                      {k.time}
                    </button>
                  ) : (
                    <span className="pt-0.5 font-mono text-xs text-white/35 tabular-nums">{k.time || "notes"}</span>
                  )}
                  <span className="leading-relaxed text-white/85">{k.point}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-7 lg:grid-cols-2">
        {guide.terms.length ? (
          <div>
            <Heading icon={BookMarked}>Terms to know</Heading>
            <dl className="space-y-2.5">
              {guide.terms.map((t, i) => (
                <div key={i}>
                  <dt className="font-medium text-white">{t.term}</dt>
                  <dd className="text-sm leading-relaxed text-white/65">{t.definition}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
        <div>
          <Heading icon={ClipboardList}>Homework &amp; deadlines</Heading>
          {guide.assignments.length ? (
            <ul className="list-disc space-y-1.5 pl-5 text-white/85 marker:text-[#f0c14b]">
              {guide.assignments.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-white/45">None mentioned in this class.</p>
          )}
        </div>
      </div>

      {guide.practiceQuestions.length ? (
        <div>
          <Heading icon={Sparkles}>Practice questions</Heading>
          <ol className="space-y-2">
            {guide.practiceQuestions.map((q, i) => (
              <li key={i}>
                <details className="group rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                  <summary className="cursor-pointer list-none text-white/90 marker:hidden">
                    <span className="mr-2 text-[#f0c14b]">{i + 1}.</span>
                    {q.question}
                    <span className="ml-2 text-xs text-white/40 group-open:hidden">Show answer</span>
                  </summary>
                  <p className="mt-2 border-t border-white/10 pt-2 text-sm leading-relaxed text-white/70">{q.answer}</p>
                </details>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
