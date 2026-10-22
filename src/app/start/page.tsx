import type { Metadata } from "next";
import { StartTiles } from "@/components/start-tiles";

const TITLE = "What do you need? | EVOGENCY";
const DESCRIPTION =
  "AI front desks, websites, web apps, CRMs, online stores, brands, and personal sites. Pick what you need and get a straight answer within one business day.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/start" },
  // Funnel forms stay out of search so they don't compete with the service
  // pages. follow keeps the links counting.
  robots: { index: false, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/start",
    siteName: "EVOGENCY",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "EVOGENCY: Evolve. Elevate. Grow." }],
    locale: "en_US",
    type: "website",
  },
};

export default function StartPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pt-14 pb-20">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5fd8e6]/80">Let&apos;s get started</p>
        <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl">What do you need?</h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-white/65">
          Pick one. A few quick taps and we&apos;ll come back within one business day with a plan and a real price.
        </p>
      </div>
      <StartTiles className="mt-10" />
      <p className="mt-8 text-center text-sm text-white/50">
        Rather talk to a person?{" "}
        <a href="tel:+18138971954" className="font-medium text-[#5fd8e6] hover:underline">
          Call or text (813) 897 1954
        </a>
      </p>
    </div>
  );
}
