"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createCheckoutSession, getDefaultPrice } from "@/lib/stripe";
import { KIT_PRODUCT_KEY, KIT_STRIPE_PRODUCT } from "@/lib/growth-kit";

// Sends the buyer to Stripe's hosted checkout. Stripe collects the email and
// card; we only ask for the business name so the buyer lands in Agency OS properly.
export async function startCheckout() {
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;

  let url: string | null = null;
  try {
    const session = await createCheckoutSession({
      mode: "payment",
      "line_items[0][quantity]": "1",
      "line_items[0][price]": await getDefaultPrice(KIT_STRIPE_PRODUCT),
      // Only collects in jurisdictions with an active registration in Stripe Tax.
      "automatic_tax[enabled]": "true",
      integration_identifier: "growth_kit_qmvrtxad",
      "metadata[product]": KIT_PRODUCT_KEY,
      "custom_fields[0][key]": "business",
      "custom_fields[0][label][type]": "custom",
      "custom_fields[0][label][custom]": "Business name",
      "custom_fields[0][type]": "text",
      "custom_fields[0][optional]": "true",
      allow_promotion_codes: "true",
      success_url: `${origin}/growth-kit/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/growth-kit?canceled=1`,
    });
    url = session.url;
  } catch (err) {
    console.error("[growth-kit] checkout failed", err);
  }
  redirect(url ?? "/growth-kit?error=checkout");
}
