import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCheckoutSession, isFulfillable } from "@/lib/stripe";
import { KIT_FILES, KIT_PRODUCT_KEY, type KitFile } from "@/lib/growth-kit";

// Serves the paid kit files, only for a checkout session Stripe confirms as paid.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id") ?? "";
  const file = url.searchParams.get("file") as KitFile;
  if (!(file in KIT_FILES)) return new Response("Unknown file", { status: 400 });

  let paid = false;
  try {
    const session = await getCheckoutSession(sessionId);
    paid = !!session && isFulfillable(session) && session.metadata?.product === KIT_PRODUCT_KEY;
  } catch (err) {
    console.error("[growth-kit] download lookup failed", err);
    return new Response("We couldn't check your order right now. Please try again in a minute.", { status: 503 });
  }
  if (!paid) return new Response("We couldn't find a paid order for this link.", { status: 403 });

  const { file: name, type } = KIT_FILES[file];
  const body = await readFile(path.join(process.cwd(), "private", "growth-kit", name));
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
