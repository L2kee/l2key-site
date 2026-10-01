"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { submitOptIn, type OptInState } from "@/app/free-review-kit/actions";
import { TRADES } from "@/lib/trades";

const initialState: OptInState = { status: "idle" };

const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-[#f0c14b]/70 focus:ring-2 focus:ring-[#f0c14b]/25";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-rose-300">{message}</p>;
}

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
        <label className="block text-sm font-medium text-white/80">
          First name
          <input name="firstName" defaultValue={values?.firstName} autoComplete="given-name" className={inputClass} placeholder="Jane" />
          <FieldError message={errors.firstName} />
        </label>
        <label className="block text-sm font-medium text-white/80">
          Email
          <input name="email" type="email" defaultValue={values?.email} autoComplete="email" className={inputClass} placeholder="jane@smithplumbing.com" />
          <FieldError message={errors.email} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-white/80">
          Business name
          <input name="business" defaultValue={values?.business} autoComplete="organization" className={inputClass} placeholder="Smith Plumbing" />
          <FieldError message={errors.business} />
        </label>
        <label className="block text-sm font-medium text-white/80">
          Your trade
          <select name="trade" defaultValue={values?.trade ?? ""} className={inputClass}>
            <option value="" disabled>
              Pick one
            </option>
            {TRADES.map((t) => (
              <option key={t} value={t} className="bg-[#111111]">
                {t}
              </option>
            ))}
          </select>
          <FieldError message={errors.trade} />
        </label>
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
