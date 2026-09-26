"use client";

import { useEffect, useRef, useState } from "react";
import { CircleHelp, ListTodo, Plus, Quote, Star, StickyNote, Trash2 } from "lucide-react";
import { NOTE_KINDS, formatClock, type Note, type NoteKind, type TranscriptLine } from "@/lib/class-notes";

export const inputClass =
  "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-2.5 text-white placeholder:text-white/35 outline-none transition focus:border-[#f0c14b]/70 focus:ring-2 focus:ring-[#f0c14b]/25 disabled:opacity-40";

export const KIND_STYLE: Record<NoteKind, { icon: typeof StickyNote; chip: string }> = {
  note: { icon: StickyNote, chip: "border-white/15 text-white/75" },
  important: { icon: Star, chip: "border-[#f0c14b]/50 text-[#f0c14b]" },
  question: { icon: CircleHelp, chip: "border-sky-400/50 text-sky-300" },
  todo: { icon: ListTodo, chip: "border-emerald-400/50 text-emerald-300" },
};

function TimeButton({ t, onSeek }: { t: number; onSeek?: (t: number) => void }) {
  const label = formatClock(t);
  if (!onSeek) return <span className="font-mono text-xs text-white/40 tabular-nums">{label}</span>;
  return (
    <button
      type="button"
      onClick={() => onSeek(t)}
      title="Play from here"
      className="font-mono text-xs text-[#f0c14b]/80 tabular-nums underline-offset-2 hover:text-[#f0c14b] hover:underline"
    >
      {label}
    </button>
  );
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-[#f0c14b]/30 px-0.5 text-white">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

export function TranscriptPane({
  lines,
  interim,
  live,
  onSeek,
  activeT,
  query = "",
  emptyText,
}: {
  lines: TranscriptLine[];
  interim?: string;
  live?: boolean;
  onSeek?: (t: number) => void;
  activeT?: number;
  query?: string;
  emptyText: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [stick, setStick] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (live && stick && el) el.scrollTop = el.scrollHeight;
  }, [lines.length, interim, live, stick]);

  const shown = query ? lines.filter((l) => l.text.toLowerCase().includes(query.toLowerCase())) : lines;
  const activeId = activeT === undefined ? null : [...lines].reverse().find((l) => l.t <= activeT)?.id;

  return (
    <div
      ref={scrollRef}
      onScroll={(e) => {
        const el = e.currentTarget;
        setStick(el.scrollHeight - el.scrollTop - el.clientHeight < 60);
      }}
      className="h-[26rem] overflow-y-auto pr-2 lg:h-[34rem]"
    >
      {shown.length === 0 && !interim ? (
        <p className="py-16 text-center text-sm text-white/40">{query ? "No lines match your search." : emptyText}</p>
      ) : (
        <ol className="space-y-3">
          {shown.map((l) => (
            <li
              key={l.id}
              className={`grid grid-cols-[3.75rem_1fr] gap-3 rounded-lg px-2 py-1 transition ${
                l.id === activeId ? "bg-[#f0c14b]/10" : ""
              }`}
            >
              <div className="pt-0.5">
                <TimeButton t={l.t} onSeek={onSeek} />
              </div>
              <p className="leading-relaxed text-white/85">{highlight(l.text, query)}</p>
            </li>
          ))}
          {interim ? (
            <li className="grid grid-cols-[3.75rem_1fr] gap-3 px-2 py-1">
              <span className="pt-1">
                <span className="block h-2 w-2 animate-pulse rounded-full bg-[#f0c14b]" />
              </span>
              <p className="leading-relaxed text-white/45 italic">{interim}</p>
            </li>
          ) : null}
        </ol>
      )}
    </div>
  );
}

export function NoteComposer({
  onAdd,
  placeholder = "Type a note… it's stamped with the class time (Enter to save)",
  onQuoteLast,
  canQuote,
}: {
  onAdd: (text: string, kind: NoteKind) => void;
  placeholder?: string;
  onQuoteLast?: () => void;
  canQuote?: boolean;
}) {
  const [text, setText] = useState("");
  const [kind, setKind] = useState<NoteKind>("note");

  const submit = () => {
    const value = text.trim();
    if (!value) return;
    onAdd(value, kind);
    setText("");
    setKind("note");
  };

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Note type">
        {(Object.keys(NOTE_KINDS) as NoteKind[]).map((k) => {
          const Icon = KIND_STYLE[k].icon;
          const on = kind === k;
          return (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setKind(k)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${
                on ? `${KIND_STYLE[k].chip} bg-white/[0.06]` : "border-white/10 text-white/45 hover:text-white/75"
              }`}
            >
              <Icon size={13} /> {NOTE_KINDS[k].label}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={2}
          placeholder={placeholder}
          className={`${inputClass} resize-none`}
        />
        <button
          type="button"
          onClick={submit}
          disabled={!text.trim()}
          aria-label="Add note"
          className="btn-solid shrink-0 self-stretch !px-4 disabled:opacity-40"
        >
          <Plus size={18} />
        </button>
      </div>
      {onQuoteLast ? (
        <button
          type="button"
          onClick={onQuoteLast}
          disabled={!canQuote}
          className="inline-flex items-center gap-1.5 text-xs text-white/55 transition hover:text-[#f0c14b] disabled:opacity-40 disabled:hover:text-white/55"
        >
          <Quote size={13} /> Save the instructor&apos;s last sentence as an important note
        </button>
      ) : null}
    </div>
  );
}

export function NotesList({
  notes,
  onDelete,
  onSeek,
  emptyText,
}: {
  notes: Note[];
  onDelete: (id: string) => void;
  onSeek?: (t: number) => void;
  emptyText: string;
}) {
  if (notes.length === 0) return <p className="py-10 text-center text-sm text-white/40">{emptyText}</p>;
  const sorted = [...notes].sort((a, b) => a.t - b.t);
  return (
    <ul className="space-y-2">
      {sorted.map((n) => {
        const Icon = KIND_STYLE[n.kind].icon;
        return (
          <li key={n.id} className="group flex gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
            <Icon size={16} className={`mt-0.5 shrink-0 ${KIND_STYLE[n.kind].chip.split(" ")[1]}`} />
            <div className="min-w-0 flex-1">
              <TimeButton t={n.t} onSeek={onSeek} />
              <p className="mt-0.5 break-words whitespace-pre-wrap text-white/90">{n.text}</p>
            </div>
            <button
              type="button"
              onClick={() => onDelete(n.id)}
              aria-label="Delete note"
              className="shrink-0 self-start rounded-md p-1 text-white/30 transition hover:bg-white/5 hover:text-rose-300 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
            >
              <Trash2 size={15} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
