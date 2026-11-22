"use server";

// Founding 10 waitlist for the EVOGENCY CRM (Agency OS sold to home service
// companies). Saves the owner to Agency OS as a lead, emails them a welcome
// from Moe, alerts hello@, then sends them to the thank you page. Joining is
// free, so nothing here touches Stripe.

import { redirect } from "next/navigation";
import { BOOKING_URL, createLead, emailFromMoe, notifyMoe } from "@/lib/growth-kit";
import { CURRENT_TOOLS, TRADES } from "@/lib/trades";

type Field = "firstName" | "email" | "business" | "trade" | "tool";

export type WaitlistState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<Field, string>>;
  values?: Record<Field, string>;
};

const field = (data: FormData, key: string, max = 200) => String(data.get(key) ?? "").trim().slice(0, max);

function welcomeEmail(firstName: string) {
  return [
    `Hi ${firstName},`,
    ``,
    `You're on the Founding 10 list for the EVOGENCY CRM. Thanks for raising your hand.`,
    ``,
    `Here's the honest version of what happens next. We run our own business on this CRM every day, and we're finishing the AI front desk and the self setup before we open it to anyone else. When a founding spot opens, you hear about it first, before anything goes public.`,
    ``,
    `Founding members get the setup done for them (we load your customers and your price list), a founding price locked in for as long as you stay, and a direct line to me for what gets built next.`,
    ``,
    `Want to see it running before then? Grab 15 minutes and I'll walk you through it live.`,
    BOOKING_URL,
    ``,
    `One quick question while I have you. What's the one thing your current setup makes harder than it should be? Just hit reply. I read every answer, and it decides what we build first.`,
    ``,
    `Talk soon,`,
    `Moe`,
    `EVOGENCY | (813) 897 1954`,
  ].join("\n");
}

export async function joinWaitlist(_prev: WaitlistState, data: FormData): Promise<WaitlistState> {
  const firstName = field(data, "firstName", 60);
  const email = field(data, "email", 200);
  const business = field(data, "business", 150);
  const trade = field(data, "trade", 40);
  const tool = field(data, "tool", 40);

  // Honeypot: real visitors never see this field, bots fill it.
  if (field(data, "company_url")) redirect("/crm/thanks");

  const fieldErrors: WaitlistState["fieldErrors"] = {};
  if (!firstName) fieldErrors.firstName = "Please enter your first name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Please enter a valid email address.";
  if (!business) fieldErrors.business = "Please enter your business name.";
  if (!(TRADES as readonly string[]).includes(trade)) fieldErrors.trade = "Pick your trade.";
  if (!(CURRENT_TOOLS as readonly string[]).includes(tool)) fieldErrors.tool = "Pick what you use today.";

  const values = { firstName, email, business, trade, tool };
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors, values };
  }

  const [leadSaved, sent] = await Promise.all([
    createLead({
      business_name: business,
      contact_name: firstName,
      email,
      category: trade,
      source: "crm_waitlist",
      notes: `Joined the Founding 10 CRM waitlist at evogencyglobal.com/crm. Uses today: ${tool}.`,
    }),
    emailFromMoe(email, "You're on the Founding 10 list", welcomeEmail(firstName)),
  ]);

  await notifyMoe(
    `New CRM founding signup: ${business}`,
    [
      `Someone just joined the Founding 10 CRM waitlist.`,
      ``,
      `Name: ${firstName}`,
      `Email: ${email}`,
      `Business: ${business}`,
      `Trade: ${trade}`,
      `Uses today: ${tool}`,
      ``,
      leadSaved ? `Saved to Agency OS as a New Lead.` : `WARNING: this did NOT save to Agency OS. Add it by hand.`,
      sent ? `The welcome email was sent.` : `WARNING: the welcome email FAILED. Email them by hand.`,
    ].join("\n"),
    email,
  );

  redirect("/crm/thanks");
}
