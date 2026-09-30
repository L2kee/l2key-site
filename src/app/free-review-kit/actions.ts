"use server";

// Free 5 Star Review Kit opt in. Saves the person to Agency OS as a lead,
// emails them the PDF, alerts Moe, then sends them to the thank you page,
// which also offers a direct download in case the email is slow.

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createLead, emailFromMoe, leadMagnetEmail, notifyMoe } from "@/lib/growth-kit";
import { TRADES } from "@/lib/trades";

export type OptInState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"firstName" | "email" | "business" | "trade", string>>;
  values?: Record<"firstName" | "email" | "business" | "trade", string>;
};

const field = (data: FormData, key: string, max = 200) => String(data.get(key) ?? "").trim().slice(0, max);

export async function submitOptIn(_prev: OptInState, data: FormData): Promise<OptInState> {
  const firstName = field(data, "firstName", 60);
  const email = field(data, "email", 200);
  const business = field(data, "business", 150);
  const trade = field(data, "trade", 40);

  // Honeypot: real visitors never see this field, bots fill it.
  if (field(data, "company_url")) redirect("/free-review-kit/thanks");

  const fieldErrors: OptInState["fieldErrors"] = {};
  if (!firstName) fieldErrors.firstName = "Please enter your first name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Please enter a valid email address.";
  if (!business) fieldErrors.business = "Please enter your business name.";
  if (!(TRADES as readonly string[]).includes(trade)) fieldErrors.trade = "Pick your trade.";

  const values = { firstName, email, business, trade };
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors, values };
  }

  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;

  const [leadSaved, sent] = await Promise.all([
    createLead({
      business_name: business,
      contact_name: firstName,
      email,
      category: trade,
      source: "lead_magnet",
      deal_value: 597,
      notes: "Downloaded the free 5 Star Review Kit from evogencyglobal.com/free-review-kit.",
    }),
    emailFromMoe(email, "Your 5 Star Review Kit is here", leadMagnetEmail(firstName, origin)),
  ]);

  await notifyMoe(
    `New kit opt in: ${business}`,
    [
      `Someone just downloaded the free 5 Star Review Kit.`,
      ``,
      `Name: ${firstName}`,
      `Email: ${email}`,
      `Business: ${business}`,
      `Trade: ${trade}`,
      ``,
      leadSaved ? `Saved to Agency OS as a New Lead.` : `WARNING: this did NOT save to Agency OS. Add it by hand.`,
      sent ? `The kit email was sent.` : `WARNING: the kit email FAILED. They can still download it from the thank you page.`,
    ].join("\n"),
    email,
  );

  redirect("/free-review-kit/thanks");
}
