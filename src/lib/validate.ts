// Field rules shared by the browser and the server (2026-11-25). The lead
// forms check a field when the visitor leaves it and clear the error the
// moment it is fixed (float-field.tsx), and the server actions run the same
// rules again before saving, so the two can never disagree. The server stays
// the authority, because anything in the browser can be bypassed.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MESSAGES = {
  email: "Please enter a valid email address.",
  phone: "Please enter a valid phone number.",
  website: "That website address doesn't look right.",
};

export function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

/** 10 to 15 digits, ignoring spaces, dashes, dots, brackets, and a leading +. */
export function isPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

/** A full https URL for what they typed ("joesplumbing.com" works), or null if it isn't one. */
export function normalizeWebsite(raw: string): string | null {
  if (!raw) {
    return null;
  }
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    return url.hostname.includes(".") ? url.toString().replace(/\/$/, "") : null;
  } catch {
    return null;
  }
}

/** The error message for a filled field of this kind, or undefined when it is fine. */
export function formatError(kind: "email" | "phone" | "website", value: string): string | undefined {
  if (kind === "email") {
    return isEmail(value) ? undefined : MESSAGES.email;
  }
  if (kind === "phone") {
    return isPhone(value) ? undefined : MESSAGES.phone;
  }
  return normalizeWebsite(value) ? undefined : MESSAGES.website;
}
