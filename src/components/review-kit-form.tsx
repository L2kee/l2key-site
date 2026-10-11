"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { FloatInput, FloatSelect } from "@/components/float-field";
import { submitOptIn, type OptInState } from "@/app/free-review-kit/actions";
import { TRADES } from "@/lib/trades";

const initialState: OptInState = { status: "idle" };

export function ReviewKitForm() {
  const [state, formAction, pending] = useActionState(submitOptIn, initialState);
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
        <FloatInput label="First name" name="firstName" defaultValue={values?.firstName} autoComplete="given-name" error={errors.firstName} />
        <FloatInput label="Email" name="email" type="email" defaultValue={values?.email} autoComplete="email" error={errors.email} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FloatInput label="Business name" name="business" defaultValue={values?.business} autoComplete="organization" error={errors.business} />
        <FloatSelect label="Your trade" name="trade" defaultValue={values?.trade ?? ""} error={errors.trade}>
            <option value="" disabled>
              Pick one
            </option>
            {TRADES.map((t) => (
              <option key={t} value={t} className="bg-[#111111]">
                {t}
              </option>
            ))}
        </FloatSelect>
      </div>

      {state.status === "error" && state.message && (
        <p className="text-sm text-rose-300" aria-live="polite">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-solid w-full justify-center text-lg disabled:opacity-60">
        {pending ? "Sending..." : "Send Me the Free Kit"}
        {!pending && <ArrowRight size={18} />}
      </button>
      <p className="text-center text-xs text-white/45">Free. Instant. We never sell your email.</p>
    </form>
  );
}
