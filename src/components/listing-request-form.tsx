"use client";

import { useActionState, useId, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { FloatInput, useFocusFirstError } from "@/components/float-field";
import { DrawnCheck } from "@/components/drawn-check";
import { submitListingRequest, type ListingFormState } from "@/app/real-estate-listing-websites-orlando/start/actions";
import { LISTING_PLANS, getListingPlan, type ListingPlanId } from "@/lib/listing-plans";

const initialState: ListingFormState = { status: "idle" };

const METHOD_PHRASE: Record<string, string> = {
  call: "with a call",
  text: "by text",
  email: "by email",
};

const NEXT_STEP: Record<ListingPlanId, string> = {
  free: "to start on your complimentary page",
  signature: "to confirm the details and send your secure payment link",
  partner: "to confirm the details and send your secure payment link",
  brokerage: "with a quote for your team",
  unsure: "to help you pick the right fit",
};

function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-rose-300">
      {message}
    </p>
  );
}

export function ListingRequestForm({ initialPlan }: { initialPlan?: ListingPlanId }) {
  const [state, formAction, pending] = useActionState(submitListingRequest, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const planErrorId = useId();
  const contactErrorId = useId();
  useFocusFirstError(formRef, state);
  const [planId, setPlanId] = useState<ListingPlanId | "">(initialPlan ?? "");
  const [contact, setContact] = useState("");
  const errors = state.fieldErrors ?? {};
  const values = state.values;
  const plan = getListingPlan(planId);

  if (state.status === "success") {
    const done = getListingPlan(state.plan);
    return (
      <div className="py-6 text-center" role="status">
        <DrawnCheck size={44} />
        <p className="mt-4 text-xl font-semibold text-white">
          Got it{state.firstName ? `, ${state.firstName}` : ""}!
        </p>
        <p className="mx-auto mt-2 max-w-sm text-white/65">
          We&apos;ll reach out within one business day
          {state.method ? ` ${METHOD_PHRASE[state.method] ?? ""}` : ""}
          {done ? ` ${NEXT_STEP[done.id]}` : ""}.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-5 text-left">
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company URL
          <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Submitted from state, so React's post-submit reset can't desync the radios. */}
      <input type="hidden" name="plan" value={planId} />
      <input type="hidden" name="contact" value={contact} />

      <fieldset data-invalid={errors.plan ? true : undefined}>
        <legend className="text-sm font-medium text-white/80">What would you like?</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {LISTING_PLANS.map((p) => (
            <label
              key={p.id}
              className={`has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#5fd8e6] flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                planId === p.id
                  ? "border-[#5fd8e6]/70 bg-[#5fd8e6]/10 text-white"
                  : "border-white/15 bg-black/20 text-white/70 hover:border-white/30"
              } ${p.id === "unsure" ? "sm:col-span-2" : ""}`}
            >
              <input
                type="radio"
                name="plan_choice"
                aria-describedby={errors.plan ? planErrorId : undefined}
                value={p.id}
                checked={planId === p.id}
                onChange={() => setPlanId(p.id)}
                className="sr-only"
              />
              <span className="font-semibold">{p.label}</span>
              <span className="text-xs text-white/55">{p.price}</span>
            </label>
          ))}
        </div>
        <FieldError id={planErrorId} message={errors.plan} />
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <FloatInput label="Your name" name="name" defaultValue={values?.name} type="text" autoComplete="name" required error={errors.name} />
        <FloatInput
          label="Brokerage"
          name="brokerage"
          defaultValue={values?.brokerage}
          type="text"
          autoComplete="organization"
          required
          error={errors.brokerage}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FloatInput label="Phone number" name="phone" defaultValue={values?.phone} type="tel" autoComplete="tel" required error={errors.phone} />
        <FloatInput label="Email" name="email" defaultValue={values?.email} type="email" autoComplete="email" required error={errors.email} />
      </div>

      {plan?.address === "none" ? (
        <FloatInput
          label="How many agents on the team?"
          name="team"
          defaultValue={values?.team}
          type="text"
          inputMode="numeric"
          required
          error={errors.team}
        />
      ) : (
        <FloatInput
          label="Listing address"
          hint={plan?.address === "required" ? undefined : "(your next one, if you have it)"}
          name="address"
          defaultValue={values?.address}
          type="text"
          autoComplete="street-address"
          required={plan?.address === "required"}
          error={errors.address}
        />
      )}

      <fieldset data-invalid={errors.contact ? true : undefined}>
        <legend className="text-sm font-medium text-white/80">Best way to reach you</legend>
        <div className="mt-2 grid grid-cols-3 gap-3">
          {(["call", "text", "email"] as const).map((m) => (
            <label
              key={m}
              className={`has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#5fd8e6] cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm capitalize transition ${
                contact === m
                  ? "border-[#5fd8e6]/70 bg-[#5fd8e6]/10 text-white"
                  : "border-white/15 bg-black/20 text-white/70 hover:border-white/30"
              }`}
            >
              <input
                type="radio"
                name="contact_choice"
                aria-describedby={errors.contact ? contactErrorId : undefined}
                value={m}
                checked={contact === m}
                onChange={() => setContact(m)}
                className="sr-only"
              />
              {m}
            </label>
          ))}
        </div>
        <FieldError id={contactErrorId} message={errors.contact} />
      </fieldset>

      {state.status === "error" && state.message && (
        <p className="text-sm text-rose-300" role="alert">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-solid w-full justify-center disabled:opacity-60">
        {pending ? "Sending..." : plan?.submit ?? "Send my request"}
        {!pending && <ArrowRight size={18} />}
      </button>
      {plan?.paid && (
        <p className="text-center text-xs text-white/50">
          No payment today. We confirm the details with you first, then send a secure payment link.
        </p>
      )}
    </form>
  );
}
