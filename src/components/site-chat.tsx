"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp, MessageCircle, X } from "lucide-react";
import { isFunnelPath } from "@/lib/funnel-paths";
import { CHAT_GREETING } from "@/lib/chat-greeting";

// Ava, the site chat. A round button bottom right opens a panel (a bottom
// sheet on phones, .site-chat-* in globals.css). Replies come from
// /api/chat, which keeps Ava on EVOGENCY topics and saves leads to Agency OS.
// The conversation lives in sessionStorage, so it survives page changes
// within a visit and starts fresh next time. Off the funnel pages, which
// keep exactly two exits.

type Turn = { role: "user" | "assistant"; content: string };

const STORE_KEY = "evo-chat";
const MAX_CHARS = 600;
const STARTERS = ["What does the AI Front Desk do?", "How much does it cost?", "I want a free homepage mockup"];

function load(): Turn[] {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE_KEY) ?? "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function save(turns: Turn[]) {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(turns));
  } catch {}
}

export function SiteChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => setTurns(load()), []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, pending, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  if (isFunnelPath(pathname)) return null;

  async function send(text: string) {
    const content = text.trim().slice(0, MAX_CHARS);
    if (!content || pending || done) return;
    const next: Turn[] = [...turns, { role: "user", content }];
    setTurns(next);
    save(next);
    setDraft("");
    setPending(true);
    let answer = "Sorry, I'm having trouble right now. Email hello@evogencyglobal.com or call (813) 897 1954.";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (typeof data.reply === "string" && data.reply) answer = data.reply;
      if (data.done) setDone(true);
    } catch {}
    const withReply: Turn[] = [...next, { role: "assistant", content: answer }];
    setTurns(withReply);
    setPending(false);
    save(withReply);
  }

  const showStarters = turns.length === 0 && !pending;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Chat with Ava, our AI assistant"}
        aria-expanded={open}
        aria-controls="site-chat-panel"
        className={`site-chat-launcher btn-solid !p-0 fixed right-4 bottom-4 z-50 h-14 w-14 justify-center sm:right-5 sm:bottom-5 ${open ? "is-open" : ""}`}
      >
        {open ? <X size={22} /> : <MessageCircle size={24} />}
      </button>

      <section
        id="site-chat-panel"
        role="dialog"
        aria-label="Chat with Ava"
        aria-hidden={!open}
        inert={!open}
        className={`site-chat-panel glass-strong fixed z-50 flex flex-col overflow-hidden ${open ? "is-open" : ""}`}
      >
        <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5fd8e6]/15 text-sm font-bold text-[#5fd8e6]">
            A
            <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-[#08090b] bg-emerald-400" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">Ava</p>
            <p className="text-xs text-white/55">EVOGENCY&apos;s AI assistant</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="rounded-full p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </header>

        <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
          <p className="site-chat-bubble is-ava">{CHAT_GREETING}</p>
          {turns.map((t, i) => (
            <p key={i} className={`site-chat-bubble ${t.role === "user" ? "is-user" : "is-ava"}`}>
              {t.content}
            </p>
          ))}
          {pending && (
            <p className="site-chat-bubble is-ava site-chat-typing" aria-label="Ava is typing">
              <span />
              <span />
              <span />
            </p>
          )}
          {showStarters && (
            <div className="flex flex-wrap gap-2 pt-1">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-[#5fd8e6]/35 bg-[#5fd8e6]/5 px-3 py-1.5 text-left text-xs text-white/85 transition hover:border-[#5fd8e6]/70 hover:bg-[#5fd8e6]/10"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
          className="flex items-end gap-2 border-t border-white/10 p-3"
        >
          <label htmlFor="site-chat-input" className="sr-only">
            Message Ava
          </label>
          <textarea
            id="site-chat-input"
            ref={inputRef}
            rows={1}
            value={draft}
            maxLength={MAX_CHARS}
            disabled={done}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(draft);
              }
            }}
            placeholder={done ? "Email hello@evogencyglobal.com to keep going" : "Ask about EVOGENCY..."}
            className="max-h-28 min-h-10 flex-1 resize-none rounded-xl border border-white/15 bg-black/30 px-3 py-2.5 text-[16px] text-white placeholder:text-white/40 focus:border-[#5fd8e6]/60 focus:outline-none sm:text-sm"
          />
          <button
            type="submit"
            disabled={pending || done || !draft.trim()}
            aria-label="Send"
            className="btn-solid !p-0 h-10 w-10 shrink-0 justify-center disabled:opacity-40"
          >
            <ArrowUp size={18} />
          </button>
        </form>
        <p className="px-4 pb-2.5 text-[11px] text-white/40">AI assistant. Answers can be imperfect, and Moe follows up personally.</p>
      </section>
    </>
  );
}
