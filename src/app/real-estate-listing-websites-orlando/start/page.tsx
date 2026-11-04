import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import { ArrowLeft, CalendarClock, Check, Phone } from "lucide-react";
import { ListingRequestForm } from "@/components/listing-request-form";
import { getListingPlan, LISTING_PATH, LISTING_START_PATH } from "@/lib/listing-plans";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500"], style: ["normal", "italic"], display: "swap" });

const TITLE = "Start Your Listing Page | EVOGENCY Listing Suite";
const DESCRIPTION =
  "Tell us about your listing and pick a plan. Complimentary first page, Signature Listing at $199, or Listing Partner at $399 a month.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: LISTING_START_PATH },
  // A form step, kept out of search like /start. The main Listing Suite page is the one that ranks.
  robots: { index: false, follow: true },
};

const POINTS = [
  "Live in as little as 48 hours, 24 on Listing Partner",
  "Your listing photos, your name, your brokerage",
  "You review the page before it goes out",
  "No payment today. We confirm the details first",
];

export default async function ListingStartPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string | string[] }>;
}) {
  const { plan } = await searchParams;
  const initial = getListingPlan(Array.isArray(plan) ? plan[0] : plan);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pt-28 pb-20">
      <Link href={LISTING_PATH} className="inline-flex items-center gap-1.5 text-sm text-white/50 transition hover:text-white">
        <ArrowLeft size={14} /> Back to Listing Suite
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5fd8e6]/80">EVOGENCY Listing Suite</p>
          <h1 className={`mt-3 text-4xl leading-[1.05] font-medium sm:text-5xl ${cormorant.className}`}>
            <span className="text-[#f3ede0]">Let&apos;s Put Your Listing </span>
            <span className="gradient-text italic">on Stage</span>
          </h1>
          <p className="mt-4 text-white/65">
            Pick a plan, tell us about the property, and we take it from there. One short form, then we reach out
            within one business day.
          </p>
          <ul className="mt-6 space-y-2.5">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-white/85">
                <Check size={18} className="mt-0.5 shrink-0 text-[#5fd8e6]" aria-hidden="true" /> {p}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="tel:+18138971954" className="btn-glass text-white">
              <Phone size={16} /> Call (813) 897-1954
            </a>
            <a
              href="https://calendly.com/mohamed-eltoukhy011/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass text-white"
            >
              <CalendarClock size={16} /> Book a call
            </a>
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-6 sm:p-8">
          <ListingRequestForm initialPlan={initial?.id} />
        </div>
      </div>
    </div>
  );
}
