"use client";

import { useActionState, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CalendarClock } from "lucide-react";
import { FloatInput } from "@/components/float-field";
import { DrawnCheck } from "@/components/drawn-check";
import { submitStartRequest, type StartFormState } from "@/app/start/actions";
import { getStartPath } from "@/lib/start-paths";

const initialState: StartFormState = { status: "idle" };
const BOOKING_URL = "https://calendly.com/mohamed-eltoukhy011/30min";

const METHOD_PHRASE: Record<string, string> = {
  call: "with a call",
  text: "by text",
  email: "by email",
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-rose-300">{message}</p>;
}

// One question per screen (.start-step in globals.css slides each one in).
// Single choice steps advance on tap, multi choice ones wait for Continue.
// Every answer rides along as hidden inputs on the last step, so the whole
// thing is one server action submit. Takes the slug, not the path object,
// because the path carries an icon component that can't cross to the client.
export function StartWizard({ slug }: { slug: string }) {
  const path = getStartPath(slug)!;
  const total = path.questions.length + 1;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [contact, setContact] = useState("");
  const [fields, setFields] = useState({ name: "", business: "", phone: "", email: "", details: "" });
  const [state, formAction, pending] = useActionState(submitStartRequest, initialState);
  const errors = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div className="start-step py-4 text-center" role="status">
        <DrawnCheck size={48} />
        <p className="mt-4 text-2xl font-semibold text-white">
          You&apos;re all set{state.firstName ? `, ${state.firstName}` : ""}.
        </p>
        <p className="mx-auto mt-2 max-w-sm text-white/65">
          We&apos;ll reach out within one business day
          {state.method ? ` ${METHOD_PHRASE[state.method] ?? ""}` : ""}. Want to skip the wait? Grab a time that works for you.
        </p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-solid mt-7 !px-7 !py-3.5"
        >
          <CalendarClock size={18} /> Pick a time now
        </a>
      </div>
    );
  }

  const isContact = step === path.questions.length;
  const question = path.questions[step];
  const picked = question ? answers[question.id] ?? [] : [];

  const choose = (option: string) => {
    if (!question) return;
    if (question.multi) {
      setAnswers((a) => {
        const cur = a[question.id] ?? [];
        return { ...a, [question.id]: cur.includes(option) ? cur.filter((o) => o !== option) : [...cur, option] };
      });
      return;
    }
    setAnswers((a) => ({ ...a, [question.id]: [option] }));
    // A beat so the tap registers visually before the next question slides in.
    window.setTimeout(() => setStep((s) => s + 1), 180);
  };

  const set = (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium text-white/50">
        <span>
          Step {step + 1} of {total}
        </span>
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-white/60 transition hover:text-white"
          >
            <ArrowLeft size={14} /> Back
          </button>
        )}
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#5fd8e6] to-[#1f9fb3] transition-[width] duration-500"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>

      {question && (
        <div key={question.id} className="start-step mt-7">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">{question.q}</h2>
          {question.multi && <p className="mt-1 text-sm text-white/50">Pick all that apply.</p>}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {question.options.map((o) => {
              const on = picked.includes(o);
              return (
                <button
                  key={o}
                  type="button"
                  aria-pressed={on}
                  onClick={() => choose(o)}
                  className={`start-choice flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-[15px] transition ${
                    on
                      ? "border-[#5fd8e6]/70 bg-[#5fd8e6]/12 text-white"
                      : "border-white/15 bg-black/25 text-white/80 hover:border-white/35 hover:text-white"
                  }`}
                >
                  {o}
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                      on ? "border-[#5fd8e6] bg-[#5fd8e6] text-[#041016]" : "border-white/25"
                    }`}
                  >
                    {on && <Check size={13} strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
          {question.multi && (
            <button
              type="button"
              disabled={picked.length === 0}
              onClick={() => setStep((s) => s + 1)}
              className="btn-solid mt-6 w-full justify-center disabled:opacity-40"
            >
              Continue <ArrowRight size={18} />
            </button>
          )}
        </div>
      )}

      {isContact && (
        <form key="contact" action={formAction} noValidate className="start-step mt-7 space-y-5 text-left">
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Last step. Where do we send your plan?</h2>
            <p className="mt-1 text-sm text-white/50">No spam, no pushy sales calls. One person, one straight answer.</p>
          </div>

          {/* Honeypot: hidden from people, tempting to bots. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Company URL
              <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <input type="hidden" name="path" value={path.slug} />
          <input type="hidden" name="contact" value={contact} />
          {Object.entries(answers).flatMap(([id, vals]) =>
            vals.map((v) => <input key={`${id}-${v}`} type="hidden" name={`q_${id}`} value={v} />),
          )}

          <div className={`grid gap-5 ${path.personal ? "" : "sm:grid-cols-2"}`}>
            <FloatInput label="Your name" name="name" value={fields.name} onChange={set("name")} autoComplete="name" required error={errors.name} />
            {!path.personal && (
              <FloatInput
                label="Business name"
                name="business"
                value={fields.business}
                onChange={set("business")}
                autoComplete="organization"
                required
                error={errors.business}
              />
            )}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <FloatInput label="Phone number" name="phone" type="tel" value={fields.phone} onChange={set("phone")} autoComplete="tel" required error={errors.phone} />
            <FloatInput
              label="Email"
              hint={contact !== "email" ? "(optional)" : undefined}
              name="email"
              type="email"
              value={fields.email}
              onChange={set("email")}
              autoComplete="email"
              required={contact === "email"}
              error={errors.email}
            />
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-white/80">Best way to reach you</legend>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {(["call", "text", "email"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={contact === m}
                  onClick={() => setContact(m)}
                  className={`rounded-xl border px-3 py-2.5 text-center text-sm capitalize transition ${
                    contact === m
                      ? "border-[#5fd8e6]/70 bg-[#5fd8e6]/10 text-white"
                      : "border-white/15 bg-black/20 text-white/70 hover:border-white/30"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <FieldError message={errors.contact} />
          </fieldset>

          <label className="block">
            <span className="text-sm font-medium text-white/80">
              Anything else we should know? <span className="font-normal text-white/45">(optional)</span>
            </span>
            <textarea
              name="details"
              rows={3}
              value={fields.details}
              onChange={set("details")}
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#5fd8e6]/70 focus:ring-2 focus:ring-[#5fd8e6]/25"
            />
          </label>

          {state.status === "error" && state.message && (
            <p className="text-sm text-rose-300" aria-live="polite">
              {state.message}
            </p>
          )}

          <button type="submit" disabled={pending} className="btn-solid w-full justify-center !py-3.5 disabled:opacity-60">
            {pending ? "Sending..." : "Send it over"}
            {!pending && <ArrowRight size={18} />}
          </button>
        </form>
      )}
    </div>
  );
}
