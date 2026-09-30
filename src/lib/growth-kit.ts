// Home Service Growth Kit funnel: free 5 Star Review Kit opt in, then the $27
// kit sold through Stripe Checkout. Server only. Opt ins and buyers become
// leads in Agency OS, and every email goes out through Resend.

// The Stripe Product (same id in sandbox and live) whose default Price is charged.
// Its tax code and tax behavior live in Stripe, so price changes need no deploy.
export const KIT_STRIPE_PRODUCT = "growth_kit";
export const KIT_PRODUCT_KEY = "growth-kit";
export const LEAD_MAGNET_PATH = "/downloads/5-star-review-kit.pdf";
export const BOOKING_URL = "https://calendly.com/mohamed-eltoukhy011/30min";

// Paid files live outside public/ and are only served to a verified paid session.
export const KIT_FILES = {
  pdf: { file: "The Home Service Growth Kit.pdf", type: "application/pdf" },
  docx: {
    file: "The Home Service Growth Kit (editable).docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
} as const;
export type KitFile = keyof typeof KIT_FILES;

const AGENCY_OS_SUPABASE_URL = "https://vpoceoyfprpzapwrunuf.supabase.co";
// Agency OS admin account that owns inbound leads.
const LEAD_OWNER_ID = "876aa5bf-e511-4903-a90c-0bc28dd7cfaf";
const NOTIFY_TO = "hello@evogencyglobal.com";
const FROM_SITE = "EVOGENCY Website <kit@mail.evogencyglobal.com>";
const FROM_MOE = "Moe at EVOGENCY <moe@mail.evogencyglobal.com>";

function supabaseHeaders(key: string) {
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

export async function createLead(lead: Record<string, unknown>): Promise<boolean> {
  const key = process.env.AGENCY_OS_SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    console.error("[growth-kit] AGENCY_OS_SUPABASE_SERVICE_ROLE_KEY is not set");
    return false;
  }
  try {
    const res = await fetch(`${AGENCY_OS_SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: { ...supabaseHeaders(key), Prefer: "return=minimal" },
      body: JSON.stringify({ user_id: LEAD_OWNER_ID, stage: "new", ...lead }),
      cache: "no-store",
    });
    if (!res.ok) console.error("[growth-kit] lead insert failed", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("[growth-kit] lead insert threw", err);
    return false;
  }
}

// Stripe retries webhooks, so a purchase is only recorded once per checkout session.
export async function leadExistsForNote(marker: string): Promise<boolean> {
  const key = process.env.AGENCY_OS_SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return false;
  try {
    const res = await fetch(
      `${AGENCY_OS_SUPABASE_URL}/rest/v1/leads?select=id&limit=1&notes=ilike.*${encodeURIComponent(marker)}*`,
      { headers: supabaseHeaders(key), cache: "no-store" },
    );
    if (!res.ok) return false;
    return ((await res.json()) as unknown[]).length > 0;
  } catch {
    return false;
  }
}

async function sendEmail(email: {
  from: string;
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[growth-kit] RESEND_API_KEY is not set");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: email.from,
        to: [email.to],
        subject: email.subject,
        text: email.text,
        ...(email.replyTo ? { reply_to: email.replyTo } : {}),
      }),
      cache: "no-store",
    });
    if (!res.ok) console.error("[growth-kit] email failed", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("[growth-kit] email threw", err);
    return false;
  }
}

export const notifyMoe = (subject: string, text: string, replyTo?: string) =>
  sendEmail({ from: FROM_SITE, to: NOTIFY_TO, subject, text, replyTo });

export const emailFromMoe = (to: string, subject: string, text: string) =>
  sendEmail({ from: FROM_MOE, to, subject, text, replyTo: NOTIFY_TO });

export function leadMagnetEmail(firstName: string, origin: string) {
  return [
    `Hi ${firstName},`,
    ``,
    `Here's your 5 Star Review Kit:`,
    `${origin}${LEAD_MAGNET_PATH}`,
    ``,
    `Start with the "Text, friendly" message. Save it as a quick reply on your phone today and send it after your next job. That one habit will do more for your Google profile than anything else in the kit.`,
    ``,
    `One more thing. Reviews get you found, but when a new customer calls and nobody picks up, they call the next company on Google. The full Home Service Growth Kit fixes that too: missed call text backs, quote follow ups, and ad templates for your trade. It's $27 with a 30 day money back guarantee:`,
    `${origin}/growth-kit`,
    ``,
    `Talk soon,`,
    `Moe`,
    `EVOGENCY | (813) 897 1954`,
  ].join("\n");
}

export function buyerEmail(firstName: string, origin: string, sessionId: string) {
  const link = (file: KitFile) => `${origin}/api/kit/download?session_id=${sessionId}&file=${file}`;
  return [
    `Hi ${firstName || "there"},`,
    ``,
    `Thanks for grabbing the Home Service Growth Kit. Here are your downloads:`,
    ``,
    `PDF: ${link("pdf")}`,
    `Editable Word copy (for copying scripts): ${link("docx")}`,
    ``,
    `Start with the 30 minute setup on the Welcome page. Load the review texts, turn on missed call text back, and post one Google Business Profile update today.`,
    ``,
    `Your free strategy call is included. We'll look at your Google profile and website and tell you the top three things costing you jobs:`,
    BOOKING_URL,
    ``,
    `And remember the guarantee: if the kit doesn't pay for itself within 30 days, just reply to this email for a full refund.`,
    ``,
    `Talk soon,`,
    `Moe`,
    `EVOGENCY | (813) 897 1954`,
  ].join("\n");
}
