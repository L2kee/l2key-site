// Class Notes: types, local storage (IndexedDB) and formatting helpers.
// Everything stays in the student's own browser; nothing is uploaded.

export type NoteKind = "note" | "important" | "question" | "todo";

export type TranscriptLine = { id: string; t: number; text: string };
export type Note = { id: string; t: number; text: string; kind: NoteKind };

export type StudyGuide = {
  overview: string;
  keyPoints: { point: string; time: string }[];
  terms: { term: string; definition: string }[];
  assignments: string[];
  practiceQuestions: { question: string; answer: string }[];
  createdAt: number;
};

export type Session = {
  id: string;
  title: string;
  course: string;
  createdAt: number;
  durationMs: number;
  transcript: TranscriptLine[];
  notes: Note[];
  audioType?: string;
  guide?: StudyGuide;
};

export const NOTE_KINDS: Record<NoteKind, { label: string; prefix: string }> = {
  note: { label: "Note", prefix: "" },
  important: { label: "Important", prefix: "IMPORTANT: " },
  question: { label: "Question", prefix: "QUESTION: " },
  todo: { label: "To-do", prefix: "TO-DO: " },
};

const DB_NAME = "class-notes";
const SESSIONS = "sessions";
const AUDIO = "audio";

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore(SESSIONS, { keyPath: "id" });
        req.result.createObjectStore(AUDIO);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => {
        dbPromise = null;
        reject(req.error);
      };
    });
  }
  return dbPromise;
}

async function run<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = fn(db.transaction(store, mode).objectStore(store));
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
  });
}

export async function listSessions(): Promise<Session[]> {
  const all = await run<Session[]>(SESSIONS, "readonly", (s) => s.getAll());
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export const saveSession = (session: Session) => run<void>(SESSIONS, "readwrite", (s) => s.put(session));
export const saveAudio = (id: string, blob: Blob) => run<void>(AUDIO, "readwrite", (s) => s.put(blob, id));
export const loadAudio = (id: string) => run<Blob | undefined>(AUDIO, "readonly", (s) => s.get(id));

export async function deleteSession(id: string) {
  await run<void>(SESSIONS, "readwrite", (s) => s.delete(id));
  await run<void>(AUDIO, "readwrite", (s) => s.delete(id));
}

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

export function formatClock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function formatDate(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function sessionToMarkdown(s: Session) {
  const lines = [
    `# ${s.title || "Untitled class"}`,
    "",
    [s.course, formatDate(s.createdAt), `Length ${formatClock(s.durationMs)}`].filter(Boolean).join(" · "),
    "",
  ];
  const g = s.guide;
  if (g) {
    lines.push("## Study guide", "", g.overview, "", "### Key points", "");
    for (const k of g.keyPoints) lines.push(`- ${k.time ? `[${k.time}] ` : ""}${k.point}`);
    if (g.terms.length) {
      lines.push("", "### Terms", "");
      for (const t of g.terms) lines.push(`- **${t.term}**: ${t.definition}`);
    }
    if (g.assignments.length) {
      lines.push("", "### Homework and deadlines", "");
      for (const a of g.assignments) lines.push(`- ${a}`);
    }
    if (g.practiceQuestions.length) {
      lines.push("", "### Practice questions", "");
      g.practiceQuestions.forEach((q, i) => lines.push(`${i + 1}. ${q.question}`, `   - Answer: ${q.answer}`));
    }
    lines.push("");
  }
  lines.push("## My notes", "");
  if (s.notes.length === 0) lines.push("_No notes taken._");
  for (const n of s.notes) lines.push(`- [${formatClock(n.t)}] ${NOTE_KINDS[n.kind].prefix}${n.text}`);
  lines.push("", "## Transcript", "");
  if (s.transcript.length === 0) lines.push("_No transcript captured._");
  for (const l of s.transcript) lines.push(`[${formatClock(l.t)}] ${l.text}`, "");
  return lines.join("\n");
}

/** "mm:ss" or "h:mm:ss" back to milliseconds; null if it isn't a time. */
export function parseClock(value: string): number | null {
  if (!/^\d+(:\d{1,2}){1,2}$/.test(value.trim())) return null;
  return value.trim().split(":").reduce((acc, part) => acc * 60 + Number(part), 0) * 1000;
}

export function fileSlug(s: Session) {
  const base = `${s.course} ${s.title}`.trim() || "class-notes";
  const date = new Date(s.createdAt).toISOString().slice(0, 10);
  return `${base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${date}`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function audioExtension(type?: string) {
  if (!type) return "webm";
  if (type.includes("mp4")) return "m4a";
  if (type.includes("ogg")) return "ogg";
  return "webm";
}
