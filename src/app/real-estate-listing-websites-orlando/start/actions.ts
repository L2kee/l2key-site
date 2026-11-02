"use server";

// Listing Suite intake. Every request (free page, paid plan, team quote, or
// "not sure") becomes a New Lead in Agency OS tagged with the plan, plus an
// alert to hello@. No payment is taken here: Moe confirms the details and
// sends the payment link himself until Stripe products exist.

import { createLead, notify } from "@/lib/leads";
import { getListingPlan, LISTING_START_PATH } from "@/lib/listing-plans";

const TAG = "listing-form";
const CONTACT_METHODS = { call: "Call", text: "Text", email: "Email" } as const;
type ContactMethod = keyof typeof CONTACT_METHODS;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldKey = "plan" | "name" | "brokerage" | "phone" | "email" | "address" | "team" | "contact";
type ValueKey = "name" | "brokerage" | "phone" | "email" | "address" | "team";

export type ListingFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<FieldKey, string>>;
  firstName?: string;
  method?: string;
  plan?: string;
  // Echoed back on errors so React's post-submit form reset doesn't wipe what they typed.
  values?: Record<ValueKey, string>;
};

const field = (data: FormData, key: string, max = 200) =>
  String(data.get(key) ?? "").trim().slice(0, max);

export async function submitListingRequest(
  _prev: ListingFormState,
  data: FormData,
): Promise<ListingFormState> {
  const plan = getListingPlan(field(data, "plan", 20));
  const name = field(data, "name", 100);
  const brokerage = field(data, "brokerage", 150);
  const phone = field(data, "phone", 40);
  const email = field(data, "email", 200);
  const address = field(data, "address", 300);
  const team = field(data, "team", 20);
  const contact = field(data, "contact", 10) as ContactMethod;

  // Honeypot: real visitors never see this field, bots fill it. Pretend it worked.
  if (field(data, "company_url")) return { status: "success", firstName: "", method: "", plan: "free" };

  const fieldErrors: ListingFormState["fieldErrors"] = {};
  if (!plan) fieldErrors.plan = "Pick the option that fits you.";
  if (!name) fieldErrors.name = "Please enter your name.";
  if (!brokerage) fieldErrors.brokerage = "Please enter your brokerage.";
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 10 || phoneDigits.length > 15) fieldErrors.phone = "Please enter a valid phone number.";
  if (!email) fieldErrors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(email)) fieldErrors.email = "Please enter a valid email address.";
  if (plan?.address === "required" && !address) fieldErrors.address = "Please enter the listing address.";
  if (plan?.id === "brokerage" && !team) fieldErrors.team = "Roughly how many agents?";
  if (!(contact in CONTACT_METHODS)) fieldErrors.contact = "Pick the best way to reach you.";

  const values = { name, brokerage, phone, email, address, team };
  if (!plan || Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors, values };
  }

  const method = CONTACT_METHODS[contact];
  const choice = `${plan.label} (${plan.price})`;
  const lines = [
    `Listing Suite request from evogencyglobal.com${LISTING_START_PATH}.`,
    `Plan: ${choice}${plan.paid ? ". Ready to pay, send the payment link after confirming details." : "."}`,
    plan.address !== "none" ? `Listing address: ${address || "Not given"}` : `Team size: ${team} agents`,
    `Best way to reach: ${method}.`,
  ];

  const leadSaved = await createLead(TAG, {
    business_name: brokerage,
    contact_name: name,
    phone,
    email,
    website: null,
    has_website: null,
    source: "website_form",
    stage: "new",
    notes: lines.join("\n"),
  });

  const emailSent = await notify(
    TAG,
    `${plan.paid ? "PAID " : ""}Listing Suite request: ${plan.label}, ${name} (${brokerage})`,
    [
      `New Listing Suite request from the website.`,
      ``,
      `Plan: ${choice}`,
      `Name: ${name}`,
      `Brokerage: ${brokerage}`,
      plan.address !== "none" ? `Listing address: ${address || "Not given"}` : `Team size: ${team} agents`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Best way to reach: ${method}`,
      ``,
      ...(plan.paid ? [`They picked a paid plan. Confirm the details and send the payment link.`] : []),
      leadSaved ? `Saved to Agency OS as a New Lead.` : `WARNING: this did NOT save to Agency OS. Add it by hand.`,
    ].join("\n"),
    email,
  );

  if (!leadSaved && !emailSent) {
    return {
      status: "error",
      message: "Something went wrong on our end. Call or text (813) 897-1954 and we'll take it from there.",
      values,
    };
  }

  return { status: "success", firstName: name.split(/\s+/)[0], method: method.toLowerCase(), plan: plan.id };
}
