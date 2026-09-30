import { isFulfillable, verifyWebhook, type CheckoutSession } from "@/lib/stripe";
import {
  buyerEmail,
  createLead,
  emailFromMoe,
  KIT_PRODUCT_KEY,
  leadExistsForNote,
  notifyMoe,
} from "@/lib/growth-kit";

type CompletedSession = CheckoutSession & {
  custom_fields?: { key: string; text?: { value: string | null } }[];
};

// Stripe calls this after a kit checkout. Card payments arrive paid on
// checkout.session.completed; delayed methods (bank debits) arrive unpaid there
// and settle later with async_payment_succeeded or async_payment_failed.
// Fulfillment runs once per session: Stripe retries on any non 2xx, and a
// session that was already recorded is skipped.
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set");
    return new Response("Not configured", { status: 500 });
  }
  const payload = await request.text();
  if (!verifyWebhook(payload, request.headers.get("stripe-signature"), secret)) {
    return new Response("Bad signature", { status: 400 });
  }

  const event = JSON.parse(payload) as { type: string; data: { object: CompletedSession } };
  const session = event.data.object;
  if (session.metadata?.product !== KIT_PRODUCT_KEY) return new Response("Ignored", { status: 200 });

  if (event.type === "checkout.session.async_payment_failed") {
    await notifyMoe(
      `Kit payment failed: ${session.customer_details?.email ?? session.id}`,
      [
        `A delayed payment for The Home Service Growth Kit failed, so nothing was delivered.`,
        ``,
        `Email: ${session.customer_details?.email ?? "Not given"}`,
        `Stripe session: ${session.id}`,
      ].join("\n"),
      session.customer_details?.email ?? undefined,
    );
    return new Response("OK", { status: 200 });
  }

  const fulfillOn = ["checkout.session.completed", "checkout.session.async_payment_succeeded"];
  if (!fulfillOn.includes(event.type) || !isFulfillable(session)) return new Response("Ignored", { status: 200 });

  const marker = `Stripe session ${session.id}`;
  if (await leadExistsForNote(session.id)) return new Response("Already handled", { status: 200 });

  const email = session.customer_details?.email ?? "";
  const name = session.customer_details?.name ?? "";
  const firstName = name.split(/\s+/)[0] ?? "";
  const business = session.custom_fields?.find((f) => f.key === "business")?.text?.value?.trim() || name || email;
  const paid = `$${((session.amount_total ?? 0) / 100).toFixed(2)}`;
  const origin = new URL(request.url).origin;

  const [leadSaved, sent] = await Promise.all([
    createLead({
      business_name: business,
      contact_name: name || null,
      email: email || null,
      source: "kit_purchase",
      deal_value: 597,
      notes: `Bought The Home Service Growth Kit (${paid}). Book them for the free strategy call.\n${marker}`,
    }),
    email ? emailFromMoe(email, "Your Home Service Growth Kit (download inside)", buyerEmail(firstName, origin, session.id)) : false,
  ]);

  await notifyMoe(
    `Kit sale: ${business}`,
    [
      `Someone just bought The Home Service Growth Kit.`,
      ``,
      `Name: ${name || "Not given"}`,
      `Email: ${email || "Not given"}`,
      `Business: ${business}`,
      `Paid: ${paid}`,
      ``,
      leadSaved ? `Saved to Agency OS as a New Lead.` : `WARNING: this did NOT save to Agency OS. Add it by hand.`,
      sent ? `The download email was sent.` : `WARNING: the download email FAILED. Send them the links by hand.`,
    ].join("\n"),
    email || undefined,
  );

  return new Response("OK", { status: 200 });
}
