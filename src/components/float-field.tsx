// Floating label fields: the label sits inside the box and floats up when
// the box is focused or filled (.float-field in globals.css). The placeholder
// must stay a single space, it is what :placeholder-shown keys off.

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-black/30 px-4 pt-6 pb-2 text-white outline-none transition focus:border-[#f0c14b]/70 focus:ring-2 focus:ring-[#f0c14b]/25 disabled:opacity-40";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-rose-300">{message}</p>;
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

export function FloatInput({ label, hint, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & Extra) {
  return (
    <label className="float-field">
      <input {...props} placeholder=" " className={fieldClass} />
      <Label label={label} hint={hint} />
      <FieldError message={error} />
    </label>
  );
}

// A select always shows a value (even "Pick one"), so its label stays floated.
export function FloatSelect({ label, hint, error, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & Extra) {
  return (
    <label className="float-field">
      <select {...props} className={fieldClass}>
        {children}
      </select>
      <Label label={label} hint={hint} />
      <FieldError message={error} />
    </label>
  );
}
