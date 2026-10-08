// Job Site Studio: owners send raw job site clips, we send back finished short
// videos. Week one runs concierge style (Moe plus AI edit by hand) while the app
// is built. Clips go straight from the browser into a Supabase Storage bucket on
// the Agency OS project, so big videos never pass through a Vercel function.

export const PRODUCT_NAME = "Job Site Studio";
export const BASE_PATH = "/job-site-studio";

// Public by design (Supabase publishable key). The bucket only allows anonymous
// uploads of video files into it. Nobody can list, read, or overwrite a clip
// without the service role key.
export const CLIPS_SUPABASE_URL = "https://vpoceoyfprpzapwrunuf.supabase.co";
export const CLIPS_PUBLISHABLE_KEY = "sb_publishable_oq6SEiEDJvJikzw486OtUA_A1An-Q3S";
export const CLIPS_BUCKET = "job-site-clips";
export const MAX_CLIPS = 3;
export const MAX_CLIP_MB = 50;

// Stripe Payment Link for the founding offer ($29/mo, live product
// job_site_studio_founding, redirects to /welcome). If it's ever emptied, the
// buy buttons fall back to the free clip offer.
export const FOUNDING_PAYMENT_LINK = "https://buy.stripe.com/14A00k2K2cPWbzg28ZbjW00";
export const FOUNDING_PRICE = 29;
export const REGULAR_PRICE = 49;
// The founding offer closes at the end of this day (Eastern). It's a real deadline.
export const FOUNDING_CLOSES = "Wednesday, October 14";

// A clip path is "<request uuid>/<1..3>.<ext>". The server only accepts that shape.
export const CLIP_PATH_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[1-3]\.(mp4|mov|m4v|webm|3gp)$/;
