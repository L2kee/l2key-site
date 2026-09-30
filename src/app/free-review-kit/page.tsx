import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { ReviewKitForm } from "@/components/review-kit-form";

const TITLE = "Free 5 Star Review Kit for Home Service Businesses | EVOGENCY";
const DESCRIPTION =
  "7 copy and paste messages that get happy customers to leave Google reviews. Free for plumbers, HVAC techs, electricians, roofers, and contractors.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/free-review-kit" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/free-review-kit",
    siteName: "EVOGENCY",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "EVOGENCY: Evolve. Elevate. Grow." }],
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-image.png"] },
};

const INSIDE = [
  "The 3 texts to send within 2 hours of a job (and why timing is everything)",
  "The email version for customers without a cell number",
  "The past customer text that turns last month's jobs into reviews this week",
  "2 follow ups that get the review without being annoying",
  "A timing cheat sheet so you always know what to send and when",
];

export default function FreeReviewKitPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 pb-20 sm:px-6">
      <div className="glass-strong grid items-center gap-10 rounded-3xl px-6 py-10 sm:px-10 md:grid-cols-[1fr_1.1fr]">
        <div className="text-center md:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f0c14b]">Free for home service pros</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            How Many 5 Star Reviews Are Your Happy Customers Forgetting to Leave?
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Enter your email and I&apos;ll send you the free <strong className="text-white">5 Star Review Kit</strong>: 7
            copy and paste messages that get happy customers to actually leave the review. Takes 2 minutes to set up.
          </p>
          <Image
            src="/free-review-kit-cover.png"
            alt="Cover of The 5 Star Review Kit by EVOGENCY"
            width={425}
            height={550}
            className="mx-auto mt-8 w-48 rotate-[-3deg] rounded-lg shadow-2xl shadow-black/60 sm:w-56 md:mx-0"
            priority
          />
        </div>
        <div>
          <ul className="mb-7 space-y-3 text-white/75">
            {INSIDE.map((item) => (
              <li key={item} className="flex gap-3">
                <Check size={20} className="mt-0.5 shrink-0 text-[#f0c14b]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <ReviewKitForm />
        </div>
      </div>
    </div>
  );
}
