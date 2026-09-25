"use server";

// Free audit request form. Each submission becomes a "New Lead" in Agency OS
// (a separate Supabase project, written with its service role key) and sends
// an instant notification to hello@evogencyglobal.com through Resend. Either
// path succeeding counts as received; only a double failure shows an error.

const AGENCY_OS_SUPABASE_URL = "https://vpoceoyfprpzapwrunuf.supabase.co";
// Agency OS admin account that owns inbound leads.
const LEAD_OWNER_ID = "876aa5bf-e511-4903-a90c-0bc28dd7cfaf";
const NOTIFY_TO = "hello@evogencyglobal.com";
const NOTIFY_FROM = "EVOGENCY Website <audit@mail.evogencyglobal.com>";

const CONTACT_METHODS = { call: "Call", text: "Text", email: "Email" } as const;
type ContactMethod = keyof typeof CONTACT_METHODS;

export type AuditFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "business" | "website" | "phone" | "email" | "contact", string>>;
  firstName?: string;
  method?: string;
  // Echoed back on errors so React's post-submit form reset doesn't wipe what they typed.
  values?: Record<"name" | "business" | "website" | "phone" | "email", string>;
};

const field = (data: FormData, key: string, max = 200) =>
  String(data.get(key) ?? "").trim().slice(0, max);

function normalizeWebsite(raw: string): string | null {
  if (!raw) return null;
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    return url.hostname.includes(".") ? url.toString().replace(/\/$/, "") : null;
  } catch {
    return null;
  }
}

async function createLead(lead: Record<string, unknown>): Promise<boolean> {
  const key = process.env.AGENCY_OS_SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    console.error("[audit-form] AGENCY_OS_SUPABASE_SERVICE_ROLE_KEY is not set");
    return false;
  }
  try {
    const res = await fetch(`${AGENCY_OS_SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(lead),
      cache: "no-store",
    });
    if (!res.ok) console.error("[audit-form] lead insert failed", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("[audit-form] lead insert threw", err);
    return false;
  }
}

async function notify(subject: string, text: string, replyTo?: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[audit-form] RESEND_API_KEY is not set");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_TO],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      cache: "no-store",
    });
    if (!res.ok) console.error("[audit-form] notify failed", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("[audit-form] notify threw", err);
    return false;
  }
}

export async function submitAuditRequest(
  _prev: AuditFormState,
  data: FormData,
): Promise<AuditFormState> {
  const name = field(data, "name", 100);
  const business = field(data, "business", 150);
  const websiteRaw = field(data, "website", 300);
  const noWebsite = data.get("no_website") === "on";
  const phone = field(data, "phone", 40);
  const email = field(data, "email", 200);
  const contact = field(data, "contact", 10) as ContactMethod;

  // Honeypot: real visitors never see this field, bots fill it. Pretend it worked.
  if (field(data, "company_url")) return { status: "success", firstName: "", method: "" };

  const fieldErrors: AuditFormState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "Please enter your name.";
  if (!business) fieldErrors.business = "Please enter your business name.";
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 10 || phoneDigits.length > 15) fieldErrors.phone = "Please enter a valid phone number.";
  if (!(contact in CONTACT_METHODS)) fieldErrors.contact = "Pick the best way to reach you.";
  // Email is optional, but required when it's their preferred contact, and a
  // typo is flagged either way rather than silently dropped.
  if (contact === "email" && !email) {
    fieldErrors.email = "Please enter your email so we can reach you there.";
  } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }
  const website = noWebsite ? null : normalizeWebsite(websiteRaw);
  if (!noWebsite && websiteRaw && !website) fieldErrors.website = "That website address doesn't look right.";

  const values = { name, business, website: websiteRaw, phone, email };
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors, values };
  }

  const method = CONTACT_METHODS[contact];
  const hasWebsite = noWebsite ? false : website ? true : null;
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;

  const leadSaved = await createLead({
    user_id: LEAD_OWNER_ID,
    business_name: business,
    contact_name: name,
    phone,
    email: validEmail,
    website,
    has_website: hasWebsite,
    source: "website_form",
    stage: "new",
    notes: `Free audit request from evogencyglobal.com/contact.\nBest way to reach: ${method}.`,
  });

  const emailSent = await notify(
    `New audit request: ${business}`,
    [
      `New free audit request from the website.`,
      ``,
      `Name: ${name}`,
      `Business: ${business}`,
      `Website: ${noWebsite ? "No website yet" : website ?? "Not given"}`,
      `Phone: ${phone}`,
      `Email: ${validEmail ?? "Not given"}`,
      `Best way to reach: ${method}`,
      ``,
      leadSaved ? `Saved to Agency OS as a New Lead.` : `WARNING: this did NOT save to Agency OS. Add it by hand.`,
    ].join("\n"),
    validEmail ?? undefined,
  );

  if (!leadSaved && !emailSent) {
    return {
      status: "error",
      message: "Something went wrong on our end. Call or text (813) 897-1954 and we'll take it from there.",
      values,
    };
  }

  return { status: "success", firstName: name.split(/\s+/)[0], method: method.toLowerCase() };
}
