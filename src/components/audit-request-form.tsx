"use client";

import { useActionState, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { submitAuditRequest, type AuditFormState } from "@/app/contact/actions";

const initialState: AuditFormState = { status: "idle" };

const METHOD_PHRASE: Record<string, string> = {
  call: "with a call",
  text: "by text",
  email: "by email",
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-[#f0c14b]/70 focus:ring-2 focus:ring-[#f0c14b]/25 disabled:opacity-40";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-rose-300">{message}</p>;
}

export function AuditRequestForm() {
  const [state, formAction, pending] = useActionState(submitAuditRequest, initialState);
  const [contact, setContact] = useState("");
  const [noWebsite, setNoWebsite] = useState(false);
  const errors = state.fieldErrors ?? {};
  const values = state.values;

  if (state.status === "success") {
    return (
      <div className="py-6 text-center" role="status">
        <CheckCircle2 size={40} className="mx-auto text-[#f0c14b]" />
        <p className="mt-4 text-xl font-semibold text-white">
          Got it{state.firstName ? `, ${state.firstName}` : ""}!
        </p>
        <p className="mx-auto mt-2 max-w-sm text-white/65">
          We&apos;ll review your business and reach out within one business day
          {state.method ? ` ${METHOD_PHRASE[state.method] ?? ""}` : ""}.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-5 text-left">
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company URL
          <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* React resets the form after each submit, which unchecks radios and
          checkboxes in the DOM while our state still shows them selected.
          Submitting these from state keeps what they see and what we get in sync. */}
      <input type="hidden" name="contact" value={contact} />
      {noWebsite && <input type="hidden" name="no_website" value="on" />}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-white/80">
          Your name
          <input name="name" defaultValue={values?.name} type="text" autoComplete="name" required className={inputClass} placeholder="Jane Smith" />
          <FieldError message={errors.name} />
        </label>
        <label className="block text-sm font-medium text-white/80">
          Business name
          <input
            name="business"
            defaultValue={values?.business}
            type="text"
            autoComplete="organization"
            required
            className={inputClass}
            placeholder="Smith Plumbing"
          />
          <FieldError message={errors.business} />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80">
          Website <span className="font-normal text-white/45">(if you have one)</span>
          <input
            name="website"
            defaultValue={values?.website}
            type="text"
            inputMode="url"
            autoComplete="url"
            disabled={noWebsite}
            className={inputClass}
            placeholder="yourbusiness.com"
          />
        </label>
        <label className="mt-2 inline-flex items-center gap-2 text-sm text-white/65">
          <input
            type="checkbox"
            checked={noWebsite}
            onChange={(e) => setNoWebsite(e.target.checked)}
            className="h-4 w-4 accent-[#f0c14b]"
          />
          No website yet
        </label>
        <FieldError message={errors.website} />
      </div>

      <label className="block text-sm font-medium text-white/80">
        Phone number
        <input name="phone" defaultValue={values?.phone} type="tel" autoComplete="tel" required className={inputClass} placeholder="(407) 555 0123" />
        <FieldError message={errors.phone} />
      </label>

      <fieldset>
        <legend className="text-sm font-medium text-white/80">Best way to reach you</legend>
        <div className="mt-2 grid grid-cols-3 gap-3">
          {(["call", "text", "email"] as const).map((m) => (
            <label
              key={m}
              className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm capitalize transition ${
                contact === m
                  ? "border-[#f0c14b]/70 bg-[#f0c14b]/10 text-white"
                  : "border-white/15 bg-black/20 text-white/70 hover:border-white/30"
              }`}
            >
              <input
                type="radio"
                name="contact_choice"
                value={m}
                checked={contact === m}
                onChange={() => setContact(m)}
                className="sr-only"
              />
              {m}
            </label>
          ))}
        </div>
        <FieldError message={errors.contact} />
      </fieldset>

      {contact === "email" && (
        <label className="block text-sm font-medium text-white/80">
          Email
          <input name="email" defaultValue={values?.email} type="email" autoComplete="email" required className={inputClass} placeholder="jane@smithplumbing.com" />
          <FieldError message={errors.email} />
        </label>
      )}

      {state.status === "error" && state.message && (
        <p className="text-sm text-rose-300" aria-live="polite">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-solid w-full justify-center disabled:opacity-60">
        {pending ? "Sending..." : "Request my free audit"}
        {!pending && <ArrowRight size={18} />}
      </button>
    </form>
  );
}
