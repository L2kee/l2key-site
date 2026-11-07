"use client";

// Floating label fields: the label sits inside the box and floats up when
// the box is focused or filled (.float-field in globals.css). The placeholder
// must stay a single space, it is what :placeholder-shown keys off.
//
// Accessibility (2026-11-06): an error marks the field aria-invalid and is
// tied to it with aria-describedby, so a screen reader reads "Email, invalid
// entry, Please enter a valid email." After a failed send, the first broken
// field in the form takes focus, so nobody has to hunt for the problem.

import { useEffect, useId, useRef } from "react";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-black/30 px-4 pt-6 pb-2 text-white outline-none transition focus:border-[#5fd8e6]/70 focus:ring-2 focus:ring-[#5fd8e6]/25 aria-[invalid=true]:border-rose-300/70 disabled:opacity-40";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-rose-300">
      {message}
    </p>
  );
}

function Label({ label, hint }: { label: string; hint?: string }) {
  return (
    <span className="float-label">
      {label}
      {hint && <span className="font-normal opacity-70"> {hint}</span>}
    </span>
  );
}

type Extra = { label: string; hint?: string; error?: string };

/** Focus this field when it just got an error and is the first broken field in its form. */
function useFocusFirstInvalid(ref: React.RefObject<HTMLInputElement | HTMLSelectElement | null>, error?: string) {
  useEffect(() => {
    const el = ref.current;
    if (!error || !el?.form) return;
    if (el.form.querySelector('[aria-invalid="true"]') === el) el.focus();
  }, [ref, error]);
}

/** For forms with a choice group (radio pills or toggle buttons). After a
    failed send, focus the first broken control in page order, whether it's
    a field or the group. A group marks itself with data-invalid. This runs
    after the fields' own effects, so it has the final say. */
export function useFocusFirstError(formRef: React.RefObject<HTMLFormElement | null>, state: { status: string }) {
  useEffect(() => {
    if (state.status !== "error") return;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid] input, [data-invalid] button')?.focus();
  }, [formRef, state]);
}

function describedBy(own: string | undefined, errorId: string, error?: string) {
  return [own, error ? errorId : undefined].filter(Boolean).join(" ") || undefined;
}

export function FloatInput({ label, hint, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & Extra) {
  const errorId = useId();
  const ref = useRef<HTMLInputElement>(null);
  useFocusFirstInvalid(ref, error);
  return (
    // The error sits outside the label so it's read once, as the description,
    // not glued onto the field's name.
    <div>
      <label className="float-field">
        <input
          {...props}
          ref={ref}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(props["aria-describedby"], errorId, error)}
          className={fieldClass}
        />
        <Label label={label} hint={hint} />
      </label>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

// A select always shows a value (even "Pick one"), so its label stays floated.
export function FloatSelect({ label, hint, error, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & Extra) {
  const errorId = useId();
  const ref = useRef<HTMLSelectElement>(null);
  useFocusFirstInvalid(ref, error);
  return (
    <div>
      <label className="float-field">
        <select
          {...props}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(props["aria-describedby"], errorId, error)}
          className={fieldClass}
        >
          {children}
        </select>
        <Label label={label} hint={hint} />
      </label>
      <FieldError id={errorId} message={error} />
    </div>
  );
}
