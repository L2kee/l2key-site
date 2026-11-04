// Listing Suite payments. Moe sends agents a Stripe Payment Link after they
// say yes (routine1/outreach.md). Stripe stamps every checkout from a Payment
// Link with that link's id, so the shared Stripe webhook recognizes these
// sales by id and records them here. Server only.
import { emailFromMoe, leadExistsForNote, notifyMoe } from "@/lib/growth-kit";
import { createLead, LEAD_OWNER_ID } from "@/lib/leads";
import type { CheckoutSession } from "@/lib/stripe";

const AGENCY_OS_SUPABASE_URL = "https://vpoceoyfprpzapwrunuf.supabase.co";
const TAG = "listing-payment";

type ListingPaymentPlan = { label: string; hours: number; recurring: boolean };

// Live Payment Link ids (Stripe Dashboard). Current links, created 2026-11-03
// for the price cut ($199 one time, $399 a month), come first. The 2026-11-02
// links ($297, $497) stay mapped so a checkout from an old link already sent
// to an agent still gets recorded.
export const LISTING_PAYMENT_LINKS: Record<string, ListingPaymentPlan> = {
  plink_1UXvHSLvQ4CJbtuWk4cYjiS1: { label: "Signature Listing", hours: 48, recurring: false },
  plink_1UXvLcLvQ4CJbtuW4Vmm8uZt: { label: "Listing Partner", hours: 24, recurring: true },
  plink_1UXPuDLvQ4CJbtuWYVOPGfrF: { label: "Signature Listing", hours: 48, recurring: false },
  plink_1UXPtrLvQ4CJbtuWhOqTs7wm: { label: "Listing Partner", hours: 24, recurring: true },
};

export type PaymentLinkSession = CheckoutSession & { payment_link?: string | null };

export function listingPlanForSession(session: PaymentLinkSession): ListingPaymentPlan | undefined {
  return session.payment_link ? LISTING_PAYMENT_LINKS[session.payment_link] : undefined;
}

function supabaseHeaders(key: string) {
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

// The agent usually filled the intake form or took a call first, so their lead
// already exists. Find it by email so the payment lands on the same card.
async function findLeadByEmail(email: string): Promise<{ id: string; notes: string | null } | null> {
  const key = process.env.AGENCY_OS_SUPABASE_SERVICE_ROLE_KEY;
  if (!key || !email) return null;
  try {
    const res = await fetch(
      `${AGENCY_OS_SUPABASE_URL}/rest/v1/leads?select=id,notes&user_id=eq.${LEAD_OWNER_ID}&email=ilike.${encodeURIComponent(email)}&order=created_at.desc&limit=1`,
      { headers: supabaseHeaders(key), cache: "no-store" },
    );
    if (!res.ok) {
      console.error(`[${TAG}] lead lookup failed`, res.status, await res.text());
      return null;
    }
    const rows = (await res.json()) as { id: string; notes: string | null }[];
    return rows[0] ?? null;
  } catch (err) {
    console.error(`[${TAG}] lead lookup threw`, err);
    return null;
  }
}

async function appendLeadNote(id: string, existing: string | null, note: string): Promise<boolean> {
  const key = process.env.AGENCY_OS_SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return false;
  try {
    const res = await fetch(`${AGENCY_OS_SUPABASE_URL}/rest/v1/leads?id=eq.${id}`, {
      method: "PATCH",
      headers: { ...supabaseHeaders(key), Prefer: "return=minimal" },
      body: JSON.stringify({ notes: existing ? `${existing}\n\n${note}` : note }),
      cache: "no-store",
    });
    if (!res.ok) console.error(`[${TAG}] lead update failed`, res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error(`[${TAG}] lead update threw`, err);
    return false;
  }
}

const eastern = (d: Date) =>
  d.toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

function buyerEmail(firstName: string, plan: ListingPaymentPlan) {
  const hello = firstName ? `Hi ${firstName},` : "Hi there,";
  const what = plan.recurring
    ? `Welcome to Listing Partner! Your payment came through, and every new listing you send me goes live within ${plan.hours} hours.`
    : `Your payment came through, and I'm starting on your Signature Listing right now. It will be live within ${plan.hours} hours.`;
  return [
    hello,
    ``,
    what,
    ``,
    `Just reply to this email with the listing address plus any photos, notes, or favorite details you want included. If we already talked it through, you're all set.`,
    ``,
    `Thank you for trusting me with your listing.`,
    ``,
    `Moe`,
    `EVOGENCY Global`,
  ].join("\n");
}

export async function handleListingPayment(
  eventType: string,
  session: PaymentLinkSession,
  plan: ListingPaymentPlan,
  fulfillable: boolean,
): Promise<string> {
  const email = session.customer_details?.email ?? "";
  const name = session.customer_details?.name ?? "";
  const paid = `$${((session.amount_total ?? 0) / 100).toFixed(2)}`;

  if (eventType === "checkout.session.async_payment_failed") {
    await notifyMoe(
      `Listing Suite payment FAILED: ${plan.label}, ${name || email || session.id}`,
      [
        `A delayed payment for ${plan.label} failed. Do not start building.`,
        ``,
        `Name: ${name || "Not given"}`,
        `Email: ${email || "Not given"}`,
        `Stripe session: ${session.id}`,
      ].join("\n"),
      email || undefined,
    );
    return "OK";
  }

  const fulfillOn = ["checkout.session.completed", "checkout.session.async_payment_succeeded"];
  if (!fulfillOn.includes(eventType) || !fulfillable) return "Ignored";
  if (await leadExistsForNote(session.id)) return "Already handled";

  const now = new Date();
  const due = new Date(now.getTime() + plan.hours * 3600 * 1000);
  const note = [
    `PAID ${plan.label} ${paid}${plan.recurring ? " a month" : ""} on ${eastern(now)} ET. ${plan.hours} hour clock, due ${eastern(due)} ET.`,
    `Stripe session ${session.id}`,
  ].join("\n");

  const existing = await findLeadByEmail(email);
  const firstName = name.split(/\s+/)[0] ?? "";
  const [leadSaved, sent] = await Promise.all([
    existing
      ? appendLeadNote(existing.id, existing.notes, note)
      : createLead(TAG, {
          business_name: name || email || "Listing Suite buyer",
          contact_name: name || null,
          email: email || null,
          source: "listing_payment",
          stage: "new",
          deal_value: (session.amount_total ?? 0) / 100,
          notes: note,
        }),
    email
      ? emailFromMoe(email, plan.recurring ? "Welcome to Listing Partner" : "Your Signature Listing is underway", buyerEmail(firstName, plan))
      : false,
  ]);

  await notifyMoe(
    `Listing Suite PAID: ${plan.label} ${paid}, ${name || email}`,
    [
      `${name || "Someone"} just paid for ${plan.label}.`,
      ``,
      `Name: ${name || "Not given"}`,
      `Email: ${email || "Not given"}`,
      `Paid: ${paid}${plan.recurring ? " a month" : ""}`,
      ``,
      `${plan.hours} hour clock started ${eastern(now)} ET. Due ${eastern(due)} ET.`,
      ``,
      leadSaved
        ? existing
          ? `Added to their existing lead in Agency OS.`
          : `Saved to Agency OS as a New Lead (no earlier lead matched this email).`
        : `WARNING: this did NOT save to Agency OS. Add it by hand.`,
      sent ? `They got the "payment received" email from you.` : `WARNING: the "payment received" email FAILED. Reach out by hand.`,
    ].join("\n"),
    email || undefined,
  );

  return "OK";
}
