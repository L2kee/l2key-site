"use client";

// Floating label fields: the label sits inside the box and floats up when
// the box is focused or filled (.float-field in globals.css). The placeholder
// must stay a single space, it is what :placeholder-shown keys off.
//
// Accessibility (2026-11-06): an error marks the field aria-invalid and is
// tied to it with aria-describedby, so a screen reader reads "Email, invalid
// entry, Please enter a valid email." After a failed send, the first broken
// field in the form takes focus, so nobody has to hunt for the problem.
//
// Live checks (2026-11-25): errors used to appear only after a send and
// stayed on screen while the visitor fixed the field. Now a filled field is
// checked when the visitor leaves it, and a field that shows an error is
// rechecked on every keystroke, so the error clears the moment it's fixed.
// An empty field never complains until they press send, so tabbing through
// the form doesn't nag. The rules live in lib/validate.ts, shared with the
// server actions, which still run them again and have the final say.

import { useEffect, useId, useRef, useState } from "react";
import { formatError } from "@/lib/validate";

type Kind = "email" | "phone" | "website";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-black/30 px-4 pt-6 pb-2 text-white outline-none transition focus:border-olive/70 focus:ring-2 focus:ring-olive/25 aria-[invalid=true]:border-rose-300/70 disabled:opacity-40";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error mt-1.5 text-sm text-rose-300">
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

// An error appearing pushes everything below it down. If it appears while
// the mouse or finger is still pressed, the button under it moves and the
// click misses. Testing caught this on 2026-11-25, the send button swallowed
// the click right after leaving a bad phone number. So the check made on
// leaving waits until the click is over. A click on a send button drops it,
// because the send checks every field and shows its own errors.
let pressing = false;
if (typeof window !== "undefined") {
  addEventListener("pointerdown", () => (pressing = true), true);
  addEventListener("pointerup", () => (pressing = false), true);
  addEventListener("pointercancel", () => (pressing = false), true);
}

function afterClick(apply: () => void) {
  let done = false;
  const armTimer = () => setTimeout(finish, 100);
  function finish(event?: Event) {
    if (done) {
      return;
    }
    done = true;
    removeEventListener("click", finish, true);
    removeEventListener("pointerup", armTimer, true);
    if (event?.target instanceof Element && event.target.closest('[type="submit"]')) {
      return;
    }
    setTimeout(apply, 0);
  }
  addEventListener("click", finish, true);
  if (pressing) {
    addEventListener("pointerup", armTimer, { capture: true, once: true });
  } else {
    armTimer();
  }
}

/** The error a field shows: the last send's answer until the visitor edits
    the field, then their own live check. */
function useLiveError(
  ref: React.RefObject<HTMLInputElement | HTMLSelectElement | null>,
  sentError: string | undefined,
  required: boolean,
  kind: Kind | undefined,
) {
  // null hands the field back to the last send's error. A string, even an
  // empty one, is the live check's answer since the visitor edited it.
  const [live, setLive] = useState<string | null>(null);

  // A new send starts over, so its errors show even if this field had been
  // cleared live. A native listener runs before React's own submit handling.
  useEffect(() => {
    const form = ref.current?.form;
    if (!form) return;
    const reset = () => setLive(null);
    form.addEventListener("submit", reset);
    return () => form.removeEventListener("submit", reset);
  }, [ref]);

  const shown = live ?? sentError ?? "";

  function check(value: string, leaving: boolean) {
    if (leaving) {
      afterClick(() => run(value, true));
    } else {
      run(value, false);
    }
  }

  function run(value: string, leaving: boolean) {
    const trimmed = value.trim();
    if (!trimmed) {
      // A required field keeps its error until it's filled. An optional one
      // is fine empty.
      if (!required) setLive("");
      return;
    }
    // Don't flag a half typed value, only one they've left or one already flagged.
    if (leaving || shown) setLive((kind && formatError(kind, trimmed)) || "");
  }

  return { shown: shown || undefined, check, run };
}

function describedBy(own: string | undefined, errorId: string, error?: string) {
  return [own, error ? errorId : undefined].filter(Boolean).join(" ") || undefined;
}

/** `check` picks the live rule. Email and tel inputs get theirs from `type`;
    pass check="website" for a website field. */
export function FloatInput({
  label,
  hint,
  error,
  check,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & Extra & { check?: Kind }) {
  const errorId = useId();
  const ref = useRef<HTMLInputElement>(null);
  useFocusFirstInvalid(ref, error);
  const kind = check ?? (props.type === "email" ? "email" : props.type === "tel" ? "phone" : undefined);
  const live = useLiveError(ref, error, Boolean(props.required), kind);
  // A disabled field (the website box once "No website yet" is ticked) has nothing to fix.
  const shown = props.disabled ? undefined : live.shown;
  return (
    // The error sits outside the label so it's read once, as the description,
    // not glued onto the field's name.
    <div>
      <label className="float-field">
        <input
          {...props}
          ref={ref}
          placeholder=" "
          onChange={(event) => {
            props.onChange?.(event);
            live.check(event.target.value, false);
          }}
          onBlur={(event) => {
            props.onBlur?.(event);
            live.check(event.target.value, true);
          }}
          aria-invalid={shown ? true : undefined}
          aria-describedby={describedBy(props["aria-describedby"], errorId, shown)}
          className={fieldClass}
        />
        <Label label={label} hint={hint} />
      </label>
      <FieldError id={errorId} message={shown} />
    </div>
  );
}

// A select always shows a value (even "Pick one"), so its label stays floated.
export function FloatSelect({ label, hint, error, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & Extra) {
  const errorId = useId();
  const ref = useRef<HTMLSelectElement>(null);
  useFocusFirstInvalid(ref, error);
  const live = useLiveError(ref, error, Boolean(props.required), undefined);
  return (
    <div>
      <label className="float-field">
        <select
          {...props}
          ref={ref}
          onChange={(event) => {
            props.onChange?.(event);
            live.run(event.target.value, true);
          }}
          aria-invalid={live.shown ? true : undefined}
          aria-describedby={describedBy(props["aria-describedby"], errorId, live.shown)}
          className={fieldClass}
        >
          {children}
        </select>
        <Label label={label} hint={hint} />
      </label>
      <FieldError id={errorId} message={live.shown} />
    </div>
  );
}
