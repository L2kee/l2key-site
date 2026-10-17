import Anthropic from "@anthropic-ai/sdk";
import { CHAT_SYSTEM_PROMPT } from "@/lib/chat-prompt";
import { createLead, notify } from "@/lib/leads";

// Site chat (site-chat.tsx). The browser holds the conversation as plain
// text turns and posts all of it each time; this route checks it, asks
// Claude Haiku for Ava's next reply, and runs the one tool, save_lead, which
// writes an Agency OS lead and emails hello@ like the audit form does.
// Thinking is off and effort is low: short front desk replies don't need it,
// and it keeps the history plain text so the browser can hold it.

const MODEL = "claude-haiku-5-5";
const MAX_USER_TURNS = 20;
const MAX_USER_CHARS = 600;
const MAX_ASSISTANT_CHARS = 2000;
const MAX_TOOL_ROUNDS = 3;
const FALLBACK = "Sorry, I'm having trouble right now. Email hello@evogencyglobal.com or call (813) 897 1954 and Moe will take it from there.";

// Per instance limits. Vercel can run several instances, so these slow abuse
// rather than stop it. The hard backstop is the spend cap on the API key.
const WINDOW_MS = 10 * 60_000;
const MAX_REQUESTS_PER_WINDOW = 40;
const MAX_LEADS_PER_WINDOW = 3;
const hits = new Map<string, { requests: number[]; leads: number[] }>();

function limiter(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip) ?? { requests: [], leads: [] };
  entry.requests = entry.requests.filter((t) => now - t < WINDOW_MS);
  entry.leads = entry.leads.filter((t) => now - t < WINDOW_MS);
  hits.set(ip, entry);
  if (hits.size > 5000) hits.delete(hits.keys().next().value!);
  return entry;
}

const SAVE_LEAD_TOOL: Anthropic.Tool = {
  name: "save_lead",
  description:
    "Send a visitor's details to Moe so he can follow up. Call it once you have their name, business, what they want, and a phone number or email.",
  strict: true,
  input_schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      name: { type: "string", description: "The visitor's name." },
      business: { type: "string", description: "Their business name." },
      need: { type: "string", description: "What they want help with, in one or two sentences." },
      phone: { type: "string", description: "Phone number, or an empty string if not given." },
      email: { type: "string", description: "Email address, or an empty string if not given." },
      website: { type: "string", description: "Their current website, or an empty string if none." },
      best_time: { type: "string", description: "When they'd like Moe to call, or an empty string." },
    },
    required: ["name", "business", "need", "phone", "email", "website", "best_time"],
  },
};

type Turn = { role: "user" | "assistant"; content: string };
type LeadInput = Record<"name" | "business" | "need" | "phone" | "email" | "website" | "best_time", string>;

function parseTurns(body: unknown): Turn[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_USER_TURNS * 2) return null;
  const turns: Turn[] = [];
  for (const [i, m] of raw.entries()) {
    const role = (m as Turn)?.role;
    const content = (m as Turn)?.content;
    if (role !== (i % 2 === 0 ? "user" : "assistant") || typeof content !== "string") return null;
    const text = content.trim();
    const max = role === "user" ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS;
    if (!text || text.length > max) return null;
    turns.push({ role, content: text });
  }
  return turns[turns.length - 1].role === "user" ? turns : null;
}

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

async function saveLead(input: LeadInput, transcript: Turn[]): Promise<{ ok: boolean; message: string }> {
  const name = str(input.name, 100);
  const business = str(input.business, 150);
  const need = str(input.need, 600);
  const phone = str(input.phone, 40);
  const emailRaw = str(input.email, 200);
  const website = str(input.website, 300);
  const bestTime = str(input.best_time, 150);
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw) ? emailRaw : "";
  const phoneDigits = phone.replace(/\D/g, "").length;
  const phoneOk = phoneDigits >= 10 && phoneDigits <= 15;

  if (!name || !business || !need) return { ok: false, message: "Missing name, business, or what they want. Ask for it." };
  if (!phoneOk && !email) return { ok: false, message: "No valid phone number or email. Ask for one." };

  const chat = transcript.map((t) => `${t.role === "user" ? "Visitor" : "Ava"}: ${t.content}`).join("\n");
  const details = [
    `Name: ${name}`,
    `Business: ${business}`,
    `Wants: ${need}`,
    `Phone: ${phoneOk ? phone : "Not given"}`,
    `Email: ${email || "Not given"}`,
    `Website: ${website || "Not given"}`,
    `Best time to call: ${bestTime || "Not given"}`,
  ];

  const leadSaved = await createLead("site-chat", {
    business_name: business,
    contact_name: name,
    phone: phoneOk ? phone : null,
    email: email || null,
    website: website || null,
    source: "website_form",
    stage: "new",
    notes: `From the evogencyglobal.com site chat (Ava).\nWants: ${need}\nBest time to call: ${bestTime || "Not given"}`,
  });

  const emailSent = await notify(
    "site-chat",
    `New site chat lead: ${business}`,
    [
      `New lead from the website chat.`,
      ``,
      ...details,
      ``,
      leadSaved ? `Saved to Agency OS as a New Lead.` : `WARNING: this did NOT save to Agency OS. Add it by hand.`,
      ``,
      `Chat so far:`,
      chat,
    ].join("\n"),
    email || undefined,
  );

  return leadSaved || emailSent
    ? { ok: true, message: "Saved. Moe will reach out within one business day." }
    : { ok: false, message: "Saving failed. Give them hello@evogencyglobal.com and (813) 897 1954 instead." };
}

// Backstop for the site copy rules (no dashes, hyphens, or colons) when the
// model slips. Times, emails, and URLs keep their characters.
function clean(text: string) {
  return text
    .replace(/\s*[–—]\s*/g, ", ")
    .split(/(\s+)/)
    .map((tok) =>
      /[@/]/.test(tok) ? tok : tok.replace(/(?<=\p{L})-(?=\p{L})/gu, " ").replace(/(?<!\d):(?!\d)/g, ","),
    )
    .join("");
}

const reply = (text: string, status = 200, extra: Record<string, unknown> = {}) =>
  Response.json({ reply: text, ...extra }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const usage = limiter(ip);
  if (usage.requests.length >= MAX_REQUESTS_PER_WINDOW) {
    return reply("You're sending messages faster than I can keep up. Give it a few minutes, or email hello@evogencyglobal.com.", 429);
  }
  usage.requests.push(Date.now());

  let turns: Turn[] | null = null;
  try {
    turns = parseTurns(await request.json());
  } catch {}
  if (!turns) return reply("Sorry, I couldn't read that message. Try again with something shorter.", 400);
  if (turns.filter((t) => t.role === "user").length >= MAX_USER_TURNS) {
    return reply("We've covered a lot! To keep going, email hello@evogencyglobal.com or call (813) 897 1954 and Moe will pick it up from here.", 200, { done: true });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[site-chat] ANTHROPIC_API_KEY is not set");
    return reply(FALLBACK, 503);
  }
  const client = new Anthropic();

  const messages: Anthropic.MessageParam[] = turns.map((t) => ({ role: t.role, content: t.content }));
  let leadSaved = false;

  try {
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 1024,
        thinking: { type: "disabled" },
        output_config: { effort: "low" },
        system: [{ type: "text", text: CHAT_SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        tools: [SAVE_LEAD_TOOL],
        messages,
      });

      if (response.stop_reason === "refusal") {
        return reply("That's not something I can help with here. I'm just for questions about EVOGENCY. Anything I can tell you about our services?");
      }

      const toolUses = response.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
      if (response.stop_reason !== "tool_use" || toolUses.length === 0 || round === MAX_TOOL_ROUNDS) {
        const text = response.content
          .filter((b): b is Anthropic.TextBlock => b.type === "text")
          .map((b) => b.text)
          .join("\n")
          .trim();
        return reply(clean(text).slice(0, MAX_ASSISTANT_CHARS) || FALLBACK, 200, leadSaved ? { leadSaved } : {});
      }

      messages.push({ role: "assistant", content: response.content });
      const results: Anthropic.ToolResultBlockParam[] = [];
      for (const use of toolUses) {
        if (use.name !== "save_lead") {
          results.push({ type: "tool_result", tool_use_id: use.id, content: "Unknown tool.", is_error: true });
          continue;
        }
        if (usage.leads.length >= MAX_LEADS_PER_WINDOW) {
          results.push({ type: "tool_result", tool_use_id: use.id, content: "Already saved. Don't save again.", is_error: true });
          continue;
        }
        const result = await saveLead(use.input as LeadInput, turns);
        if (result.ok) {
          usage.leads.push(Date.now());
          leadSaved = true;
        }
        results.push({ type: "tool_result", tool_use_id: use.id, content: result.message, is_error: !result.ok });
      }
      messages.push({ role: "user", content: results });
    }
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) console.error("[site-chat] rate limited", err.message);
    else if (err instanceof Anthropic.APIError) console.error(`[site-chat] API error ${err.status}`, err.message);
    else console.error("[site-chat] failed", err);
  }
  return reply(FALLBACK, 502);
}
