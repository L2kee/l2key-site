import { createHash, timingSafeEqual } from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { StudyGuide } from "@/lib/class-notes";

// Turns a class transcript plus the student's own notes into a study guide.
// Needs ANTHROPIC_API_KEY and CLASS_NOTES_ACCESS_CODE; the access code keeps
// strangers on this public site from spending the API credit.

export const maxDuration = 300;

// A multi-hour lecture is well under this; anything bigger is refused rather
// than silently cut short.
const MAX_INPUT_CHARS = 600_000;

const SYSTEM = `You turn a recorded class into a study guide for the student who attended it.

You receive the lecture's speech-to-text transcript, where each line starts with its [mm:ss] class time, and the notes the student typed during class. Speech recognition makes mistakes: fix obvious mishearings of technical terms from context, and never invent content that isn't supported by the transcript or notes. The student's notes show what they thought mattered, so make sure those topics are covered.

Write for a student reviewing before an exam: plain, specific, and complete. Each key point's time must be the [mm:ss] of the transcript line where that idea is discussed, so the student can jump to it; use an empty string when it only comes from the notes. List homework, readings, and deadlines only if the instructor actually mentioned them. Write practice questions that test understanding, not trivia, each with a short answer.

If the transcript is too short or garbled to say much, keep the guide brief and say so in the overview rather than padding it.`;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["overview", "keyPoints", "terms", "assignments", "practiceQuestions"],
  properties: {
    overview: { type: "string", description: "3-5 sentence summary of what the class covered." },
    keyPoints: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["point", "time"],
        properties: { point: { type: "string" }, time: { type: "string" } },
      },
    },
    terms: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["term", "definition"],
        properties: { term: { type: "string" }, definition: { type: "string" } },
      },
    },
    assignments: { type: "array", items: { type: "string" } },
    practiceQuestions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["question", "answer"],
        properties: { question: { type: "string" }, answer: { type: "string" } },
      },
    },
  },
};

type Line = { t: number; text: string };
type Body = { title?: string; course?: string; transcript?: Line[]; notes?: (Line & { kind?: string })[] };

const clock = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

function codeMatches(given: string, expected: string) {
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

const fail = (status: number, error: string) => NextResponse.json({ error }, { status });

export async function POST(request: Request) {
  const expected = process.env.CLASS_NOTES_ACCESS_CODE;
  if (!expected || !process.env.ANTHROPIC_API_KEY) {
    return fail(503, "AI summaries aren't set up on this site yet.");
  }
  if (!codeMatches(request.headers.get("x-access-code") ?? "", expected)) {
    return fail(401, "That access code isn't right.");
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return fail(400, "Invalid request.");
  }
  const transcript = Array.isArray(body.transcript) ? body.transcript : [];
  const notes = Array.isArray(body.notes) ? body.notes : [];
  if (transcript.length === 0 && notes.length === 0) {
    return fail(400, "This class has no transcript or notes to summarize.");
  }

  const input = [
    `Class: ${body.title || "Untitled"}${body.course ? ` (${body.course})` : ""}`,
    "",
    "<transcript>",
    ...transcript.map((l) => `[${clock(l.t)}] ${l.text}`),
    "</transcript>",
    "",
    "<student_notes>",
    ...notes.map((n) => `[${clock(n.t)}]${n.kind && n.kind !== "note" ? ` (${n.kind})` : ""} ${n.text}`),
    "</student_notes>",
  ].join("\n");
  if (input.length > MAX_INPUT_CHARS) {
    return fail(413, "This class is too long to summarize in one go.");
  }

  const client = new Anthropic();
  try {
    const message = await client.beta.messages
      .stream({
        model: "claude-opus-5",
        max_tokens: 16000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        system: SYSTEM,
        messages: [{ role: "user", content: input }],
        output_config: { format: { type: "json_schema", schema: SCHEMA } },
      })
      .finalMessage();

    if (message.stop_reason === "refusal") {
      return fail(422, "The AI declined to summarize this class.");
    }
    if (message.stop_reason === "max_tokens") {
      return fail(502, "The summary came out too long. Try again.");
    }
    const text = message.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") return fail(502, "The AI returned an empty summary. Try again.");
    const guide = JSON.parse(text.text) as Omit<StudyGuide, "createdAt">;
    return NextResponse.json({ guide: { ...guide, createdAt: Date.now() } satisfies StudyGuide });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return fail(429, "The AI is busy right now. Try again in a minute.");
    if (error instanceof Anthropic.AuthenticationError) return fail(503, "The site's AI key is invalid.");
    if (error instanceof Anthropic.APIError) {
      console.error("Class notes summary failed", error.status, error.message);
      return fail(502, "The AI service had a problem. Try again.");
    }
    console.error("Class notes summary failed", error);
    return fail(500, "Something went wrong making the summary.");
  }
}
