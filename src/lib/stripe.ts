// Minimal Stripe client over the REST API (no SDK dependency). Server only.
// STRIPE_SECRET_KEY should hold a restricted key (rk_) limited to what this
// site needs: Checkout Sessions (write) and Products (read).
import { createHmac, timingSafeEqual } from "node:crypto";

const API = "https://api.stripe.com/v1";
// Pinned so a Stripe account upgrade never changes behavior underneath us.
const STRIPE_VERSION = "2026-08-26.dahlia";

export type CheckoutSession = {
  id: string;
  payment_status: "paid" | "unpaid" | "no_payment_required";
  amount_total: number | null;
  metadata: Record<string, string> | null;
  customer_details: { email: string | null; name: string | null } | null;
};

function headers(extra: Record<string, string> = {}) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return { Authorization: `Bearer ${key}`, "Stripe-Version": STRIPE_VERSION, ...extra };
}

// A session is safe to fulfill once Stripe has the money, or the order was
// free (a 100% promo code). Delayed methods like bank debits start "unpaid".
export function isFulfillable(session: Pick<CheckoutSession, "payment_status">): boolean {
  return session.payment_status === "paid" || session.payment_status === "no_payment_required";
}

export async function getDefaultPrice(productId: string): Promise<string> {
  const res = await fetch(`${API}/products/${productId}`, { headers: headers(), cache: "no-store" });
  if (!res.ok) throw new Error(`Stripe product lookup failed: ${res.status} ${await res.text()}`);
  const product = (await res.json()) as { active: boolean; default_price: string | null };
  if (!product.active || !product.default_price) throw new Error(`Stripe product ${productId} has no active default price`);
  return product.default_price;
}

export async function createCheckoutSession(params: Record<string, string>): Promise<{ url: string }> {
  const res = await fetch(`${API}/checkout/sessions`, {
    method: "POST",
    headers: headers({ "Content-Type": "application/x-www-form-urlencoded" }),
    body: new URLSearchParams(params),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Stripe checkout create failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function getCheckoutSession(id: string): Promise<CheckoutSession | null> {
  if (!/^cs_[A-Za-z0-9_]+$/.test(id)) return null;
  const res = await fetch(`${API}/checkout/sessions/${id}`, { headers: headers(), cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

// Checks the Stripe-Signature header against the raw body, per Stripe's
// documented scheme: HMAC SHA256 of "timestamp.payload", 5 minute tolerance.
export function verifyWebhook(payload: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((kv) => {
      const i = kv.indexOf("=");
      return [kv.slice(0, i), kv.slice(i + 1)];
    }),
  );
  const timestamp = Number(parts.t);
  if (!timestamp || Math.abs(Date.now() / 1000 - timestamp) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  const signatures = header
    .split(",")
    .filter((kv) => kv.startsWith("v1="))
    .map((kv) => kv.slice(3));
  return signatures.some(
    (sig) => sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected)),
  );
}
