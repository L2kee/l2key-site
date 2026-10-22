"use server";

// Guided funnel form (/start/<slug>). Same lead and alert path as the audit
// form: a New Lead in Agency OS plus the hello@ alert, with every answer in
// the notes so the first call starts where the form left off. Either path
// succeeding counts as received; only a double failure shows an error.

import { createLead, notify } from "@/lib/leads";
import { getStartPath } from "@/lib/start-paths";

const CONTACT_METHODS = { call: "Call", text: "Text", email: "Email" } as const;
type ContactMethod = keyof typeof CONTACT_METHODS;

export type StartFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "business" | "phone" | "email" | "contact", string>>;
  firstName?: string;
  method?: string;
};

const field = (data: FormData, key: string, max = 200) =>
  String(data.get(key) ?? "").trim().slice(0, max);

export async function submitStartRequest(
  _prev: StartFormState,
  data: FormData,
): Promise<StartFormState> {
  // Honeypot: real visitors never see this field, bots fill it. Pretend it worked.
  if (field(data, "company_url")) return { status: "success", firstName: "", method: "" };

  const path = getStartPath(field(data, "path", 40));
  if (!path) return { status: "error", message: "Something went wrong. Please refresh the page and try again." };

  const name = field(data, "name", 100);
  const business = field(data, "business", 150);
  const phone = field(data, "phone", 40);
  const email = field(data, "email", 200);
  const contact = field(data, "contact", 10) as ContactMethod;
  const details = field(data, "details", 1500);

  const fieldErrors: StartFormState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "Please enter your name.";
  if (!path.personal && !business) fieldErrors.business = "Please enter your business name.";
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 10 || phoneDigits.length > 15) fieldErrors.phone = "Please enter a valid phone number.";
  if (!(contact in CONTACT_METHODS)) fieldErrors.contact = "Pick the best way to reach you.";
  if (contact === "email" && !email) {
    fieldErrors.email = "Please enter your email so we can reach you there.";
  } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors };
  }

  // Only answers to this path's own questions, only from its own options.
  const answers = path.questions.map((q) => {
    const picked = data
      .getAll(`q_${q.id}`)
      .map(String)
      .filter((v) => q.options.includes(v));
    return `${q.q} ${picked.length ? picked.join(", ") : "(skipped)"}`;
  });

  const method = CONTACT_METHODS[contact];
  const validEmail = email || null;
  const label = business || name;

  const leadSaved = await createLead("start-form", {
    business_name: label,
    contact_name: name,
    phone,
    email: validEmail,
    source: "website_form",
    stage: "new",
    notes: [
      `Guided funnel request from evogencyglobal.com/start/${path.slug} (${path.tile}).`,
      `Best way to reach: ${method}.`,
      ``,
      ...answers,
      ...(details ? [``, `In their words: ${details}`] : []),
    ].join("\n"),
  });

  const emailSent = await notify(
    "start-form",
    `New ${path.tile} request: ${label}`,
    [
      `New ${path.tile} request from the guided funnel.`,
      ``,
      `Name: ${name}`,
      ...(path.personal ? [] : [`Business: ${business}`]),
      `Phone: ${phone}`,
      `Email: ${validEmail ?? "Not given"}`,
      `Best way to reach: ${method}`,
      ``,
      ...answers,
      ...(details ? [``, `In their words: ${details}`] : []),
      ``,
      leadSaved ? `Saved to Agency OS as a New Lead.` : `WARNING: this did NOT save to Agency OS. Add it by hand.`,
    ].join("\n"),
    validEmail ?? undefined,
  );

  if (!leadSaved && !emailSent) {
    return {
      status: "error",
      message: "Something went wrong on our end. Call or text (813) 897-1954 and we'll take it from there.",
    };
  }

  return { status: "success", firstName: name.split(/\s+/)[0], method: method.toLowerCase() };
}
