"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { FloatInput, FloatSelect } from "@/components/float-field";
import { joinWaitlist, type WaitlistState } from "@/app/crm/actions";
import { CURRENT_TOOLS, TRADES } from "@/lib/trades";

const initialState: WaitlistState = { status: "idle" };

/** Founding 10 signup on /crm. Same shape as the review kit opt in, plus what they use today. */
export function CrmWaitlistForm() {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);
  const errors = state.fieldErrors ?? {};
  const values = state.values;

  return (
    <form action={formAction} noValidate className="space-y-4 text-left">
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company URL
          <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FloatInput label="First name" name="firstName" defaultValue={values?.firstName} autoComplete="given-name" required error={errors.firstName} />
        <FloatInput label="Email" name="email" type="email" defaultValue={values?.email} autoComplete="email" required error={errors.email} />
      </div>
      <FloatInput label="Business name" name="business" defaultValue={values?.business} autoComplete="organization" required error={errors.business} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FloatSelect label="Your trade" name="trade" defaultValue={values?.trade ?? ""} required error={errors.trade}>
          <option value="" disabled>
            Pick one
          </option>
          {TRADES.map((t) => (
            <option key={t} value={t} className="bg-[#111111]">
              {t}
            </option>
          ))}
        </FloatSelect>
        <FloatSelect label="What you use today" name="tool" defaultValue={values?.tool ?? ""} required error={errors.tool}>
          <option value="" disabled>
            Pick one
          </option>
          {CURRENT_TOOLS.map((t) => (
            <option key={t} value={t} className="bg-[#111111]">
              {t}
            </option>
          ))}
        </FloatSelect>
      </div>

      {state.status === "error" && state.message && (
        <p className="text-sm text-rose-300" role="alert">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-solid w-full justify-center text-lg disabled:opacity-60">
        {pending ? "Saving your spot..." : "Save My Founding Spot"}
        {!pending && <ArrowRight size={18} aria-hidden="true" />}
      </button>
      <p className="text-center text-xs text-white/60">Free to join. No card, no contract. We never sell your email.</p>
    </form>
  );
}
