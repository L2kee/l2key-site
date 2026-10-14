"use client";

import { useActionState, useState } from "react";
import { ArrowRight } from "lucide-react";
import { FloatInput } from "@/components/float-field";
import { DrawnCheck } from "@/components/drawn-check";
import { submitAuditRequest, type AuditFormState } from "@/app/contact/actions";

const initialState: AuditFormState = { status: "idle" };

const METHOD_PHRASE: Record<string, string> = {
  call: "with a call",
  text: "by text",
  email: "by email",
};

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
        <DrawnCheck size={44} />
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
        <FloatInput label="Your name" name="name" defaultValue={values?.name} type="text" autoComplete="name" required error={errors.name} />
        <FloatInput
          label="Business name"
          name="business"
          defaultValue={values?.business}
          type="text"
          autoComplete="organization"
          required
          error={errors.business}
        />
      </div>

      <div>
        <FloatInput
          label="Website"
          hint="(if you have one)"
          name="website"
          defaultValue={values?.website}
          type="text"
          inputMode="url"
          autoComplete="url"
          disabled={noWebsite}
        />
        <label className="mt-2 inline-flex items-center gap-2 text-sm text-white/65">
          <input
            type="checkbox"
            checked={noWebsite}
            onChange={(e) => setNoWebsite(e.target.checked)}
            className="h-4 w-4 accent-[#5fd8e6]"
          />
          No website yet
        </label>
        <FieldError message={errors.website} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FloatInput label="Phone number" name="phone" defaultValue={values?.phone} type="tel" autoComplete="tel" required error={errors.phone} />
        <FloatInput
          label="Email"
          hint={contact !== "email" ? "(if you have one)" : undefined}
          name="email"
          defaultValue={values?.email}
          type="email"
          autoComplete="email"
          required={contact === "email"}
          error={errors.email}
        />
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-white/80">Best way to reach you</legend>
        <div className="mt-2 grid grid-cols-3 gap-3">
          {(["call", "text", "email"] as const).map((m) => (
            <label
              key={m}
              className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm capitalize transition ${
                contact === m
                  ? "border-[#5fd8e6]/70 bg-[#5fd8e6]/10 text-white"
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
