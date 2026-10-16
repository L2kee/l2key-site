"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { FloatInput } from "@/components/float-field";
import { DrawnCheck } from "@/components/drawn-check";
import { isFunnelPath } from "@/lib/funnel-paths";
import { submitMockupRequest, type MockupFormState } from "@/app/contact/actions";

// Free homepage mockup offer. A small notice springs up from the bottom after
// 8 seconds or a third of the page scrolled, once per visit. Closing it hides
// it for 7 days, sending the form hides it for 90. The button opens the
// request form in a <dialog> (a bottom sheet on phones, .mockup-* in
// globals.css). Never on the contact page or the funnel pages, where it would
// compete with the form that is already there.

const SEEN_KEY = "evo-mockup-seen";
const HIDE_KEY = "evo-mockup-hide-until";
const DAY = 86_400_000;

const METHODS = [
  ["call", "Call"],
  ["text", "Text"],
  ["email", "Email"],
  ["whatsapp", "WhatsApp"],
] as const;

const METHOD_PHRASE: Record<string, string> = {
  call: "with a call",
  text: "by text",
  email: "by email",
  whatsapp: "on WhatsApp",
};

function hideFor(days: number) {
  try {
    localStorage.setItem(HIDE_KEY, String(Date.now() + days * DAY));
  } catch {}
}

function isHidden() {
  try {
    if (sessionStorage.getItem(SEEN_KEY)) return true;
    return Number(localStorage.getItem(HIDE_KEY) ?? 0) > Date.now();
  } catch {
    return false;
  }
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-rose-300">{message}</p>;
}

function MockupForm() {
  const [state, formAction, pending] = useActionState(submitMockupRequest, { status: "idle" } as MockupFormState);
  const [contact, setContact] = useState("");
  const [noWebsite, setNoWebsite] = useState(false);
  const errors = state.fieldErrors ?? {};
  const values = state.values;

  useEffect(() => {
    if (state.status === "success") hideFor(90);
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div className="py-6 text-center" role="status">
        <DrawnCheck size={44} />
        <p className="mt-4 text-xl font-semibold text-white">
          Got it{state.firstName ? `, ${state.firstName}` : ""}!
        </p>
        <p className="mx-auto mt-2 max-w-sm text-white/65">
          We&apos;ll start on your mockup and reach out within one business day{contact ? ` ${METHOD_PHRASE[contact]}` : ""}.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-4 text-left">
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company URL
          <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="contact" value={contact} />
      {noWebsite && <input type="hidden" name="no_website" value="on" />}

      <FloatInput label="Your name" name="name" defaultValue={values?.name} type="text" autoComplete="name" required error={errors.name} />

      <div>
        <FloatInput
          label="Company website"
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

      <div className="grid gap-4 sm:grid-cols-2">
        <FloatInput label="Email" name="email" defaultValue={values?.email} type="email" autoComplete="email" required error={errors.email} />
        <FloatInput label="Phone number" name="phone" defaultValue={values?.phone} type="tel" autoComplete="tel" required error={errors.phone} />
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-white/80">Best way to reach you</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {METHODS.map(([m, label]) => (
            <label
              key={m}
              className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm transition ${
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
              {label}
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
        {pending ? "Sending..." : "Send me my free mockup"}
        {!pending && <ArrowRight size={18} />}
      </button>
    </form>
  );
}

export function MockupNotice() {
  const pathname = usePathname();
  const blocked = pathname === "/contact" || isFunnelPath(pathname);
  const [shown, setShown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (blocked || mounted || isHidden()) return;
    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      setMounted(true);
      // Mount first, then flip the class a frame later so the spring plays.
      requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      cleanup();
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (max > 0 && scrollY / max > 0.33) show();
    };
    const timer = setTimeout(show, 8000);
    addEventListener("scroll", onScroll, { passive: true });
    function cleanup() {
      clearTimeout(timer);
      removeEventListener("scroll", onScroll);
    }
    return cleanup;
  }, [blocked, mounted]);

  // Leaving for the contact page or a funnel tucks it away.
  useEffect(() => {
    if (blocked) setShown(false);
  }, [blocked]);

  if (!mounted) return null;

  const dismiss = () => {
    hideFor(7);
    setShown(false);
  };
  const open = () => {
    setShown(false);
    dialogRef.current?.showModal();
  };

  return (
    <>
      <aside
        aria-label="Free homepage mockup"
        aria-hidden={!shown}
        inert={!shown}
        className={`mockup-notice glass-strong fixed inset-x-3 bottom-3 z-40 rounded-2xl p-4 sm:p-5 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[22rem] ${shown ? "is-shown" : ""}`}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Not now"
          className="absolute top-3 right-3 rounded-full p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <X size={16} />
        </button>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5fd8e6]">Free homepage mockup</p>
        <p className="mt-1.5 pr-6 text-base font-semibold leading-snug text-white sm:mt-2 sm:text-lg">
          Want to see your new website before you spend a dime?
        </p>
        <p className="mt-1.5 hidden text-sm text-white/65 sm:block">We&apos;ll design your homepage for free. No catch, no pressure.</p>
        <button type="button" onClick={open} className="btn-solid mt-3 w-full justify-center !py-2.5 sm:mt-4 sm:!py-3">
          Get my free mockup <ArrowRight size={16} />
        </button>
      </aside>

      <dialog
        ref={dialogRef}
        aria-labelledby="mockup-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="mockup-dialog glass-strong"
      >
        <div className="relative max-h-[inherit] overflow-y-auto p-6 sm:p-8">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
            className="absolute top-4 right-4 rounded-full p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5fd8e6]">Free, no obligation</p>
          <h2 id="mockup-title" className="mt-2 pr-8 text-2xl font-bold text-white">
            Your free homepage mockup
          </h2>
          <p className="mt-2 mb-6 text-sm text-white/65">
            Tell us where to send it and we&apos;ll show you what your site could look like.
          </p>
          <MockupForm />
        </div>
      </dialog>
    </>
  );
}
