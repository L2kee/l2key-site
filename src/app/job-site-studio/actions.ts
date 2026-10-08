"use server";

// Free "3 clips, 3 finished videos" request. The browser has already uploaded
// the clips to Supabase Storage. This saves the owner to Agency OS as a lead,
// tells Moe where the clips are, and confirms to the owner by email.

import { createLead, emailFromMoe, notifyMoe } from "@/lib/growth-kit";
import { BASE_PATH, CLIP_PATH_PATTERN, CLIPS_BUCKET, MAX_CLIPS } from "@/lib/job-site-studio";
import { TRADES } from "@/lib/trades";

export type ClipRequest = {
  firstName: string;
  business: string;
  trade: string;
  phone: string;
  email: string;
  city: string;
  clips: string[];
  company_url?: string;
};

export type ClipRequestResult = { ok: true } | { ok: false; message: string };

const clean = (value: unknown, max = 200) => String(value ?? "").trim().slice(0, max);

export async function submitClipRequest(input: ClipRequest): Promise<ClipRequestResult> {
  // Honeypot: real visitors never see this field, bots fill it.
  if (clean(input.company_url)) return { ok: true };

  const firstName = clean(input.firstName, 60);
  const business = clean(input.business, 150);
  const trade = clean(input.trade, 40);
  const phone = clean(input.phone, 30);
  const email = clean(input.email, 200);
  const city = clean(input.city, 80);
  const clips = Array.isArray(input.clips) ? input.clips.map((c) => clean(c, 120)) : [];

  const digits = phone.replace(/\D/g, "");
  if (
    !firstName ||
    !business ||
    !(TRADES as readonly string[]).includes(trade) ||
    digits.length < 10 ||
    digits.length > 15 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    clips.length < 1 ||
    clips.length > MAX_CLIPS ||
    !clips.every((c) => CLIP_PATH_PATTERN.test(c))
  ) {
    return { ok: false, message: "Something in the form didn't come through right. Please check it and try again." };
  }

  const folder = clips[0].split("/")[0];

  const leadSaved = await createLead({
    business_name: business,
    contact_name: firstName,
    email,
    phone,
    category: trade,
    ...(city ? { city } : {}),
    source: "job_site_studio",
    // A founding member for a year.
    deal_value: 348,
    notes: [
      `Job Site Studio free videos request (evogencyglobal.com${BASE_PATH}).`,
      `${clips.length} clip(s) in Supabase Storage bucket ${CLIPS_BUCKET}, folder ${folder}.`,
    ].join(" "),
  });

  const confirmed = await emailFromMoe(
    email,
    "Got your clips. Your videos are in the works.",
    [
      `Hi ${firstName},`,
      ``,
      `Your ${clips.length === 1 ? "clip" : `${clips.length} clips`} came through. I'll send your finished videos to this email within 2 business days, ready to post on TikTok, Facebook, and Instagram.`,
      ``,
      `If you think of anything I should know (the job, your city, a phone number or offer you want on screen), just reply to this email.`,
      ``,
      `Talk soon,`,
      `Moe`,
      `EVOGENCY | (813) 897 1954`,
    ].join("\n"),
  );

  await notifyMoe(
    `New Job Site Studio clips: ${business}`,
    [
      `An owner just sent clips for the free videos offer.`,
      ``,
      `Name: ${firstName}`,
      `Business: ${business}`,
      `Trade: ${trade}`,
      `City: ${city || "not given"}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      ``,
      `Clips (Supabase Storage, bucket ${CLIPS_BUCKET}):`,
      ...clips.map((c) => `  ${c}`),
      ``,
      `Deliver within 2 business days, then delete the clips (the free storage plan holds 1GB).`,
      leadSaved ? `Saved to Agency OS as a New Lead.` : `WARNING: this did NOT save to Agency OS. Add it by hand.`,
      confirmed ? `The confirmation email was sent.` : `WARNING: the confirmation email FAILED.`,
    ].join("\n"),
    email,
  );

  return { ok: true };
}
