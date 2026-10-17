// Agency OS lead insert and the hello@ alert email, for server code that
// isn't a form action (the site chat). Same tables, owner, and sender as the
// audit form in app/contact/actions.ts.

const AGENCY_OS_SUPABASE_URL = "https://vpoceoyfprpzapwrunuf.supabase.co";
// Agency OS admin account that owns inbound leads.
export const LEAD_OWNER_ID = "876aa5bf-e511-4903-a90c-0bc28dd7cfaf";
const NOTIFY_TO = "hello@evogencyglobal.com";
const NOTIFY_FROM = "EVOGENCY Website <audit@mail.evogencyglobal.com>";

export async function createLead(tag: string, lead: Record<string, unknown>): Promise<boolean> {
  const key = process.env.AGENCY_OS_SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    console.error(`[${tag}] AGENCY_OS_SUPABASE_SERVICE_ROLE_KEY is not set`);
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
      body: JSON.stringify({ user_id: LEAD_OWNER_ID, ...lead }),
      cache: "no-store",
    });
    if (!res.ok) console.error(`[${tag}] lead insert failed`, res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error(`[${tag}] lead insert threw`, err);
    return false;
  }
}

export async function notify(tag: string, subject: string, text: string, replyTo?: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error(`[${tag}] RESEND_API_KEY is not set`);
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
    if (!res.ok) console.error(`[${tag}] notify failed`, res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error(`[${tag}] notify threw`, err);
    return false;
  }
}
