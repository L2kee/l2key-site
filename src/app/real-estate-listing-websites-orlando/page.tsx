import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import { ArrowRight, CalendarClock, Check } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { FaqList } from "@/components/faq-list";
import { servicePageGraph } from "@/lib/schema";
import { RealtorTiles } from "@/components/realtor-tiles";
import { listingStartHref, LISTING_START_PATH, type ListingPlanId } from "@/lib/listing-plans";

// Moe picked Cormorant Garamond (option B, 2026-11-01) for the Listing Suite headline only.
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500"], style: ["normal", "italic"], display: "swap" });

const PATH = "/real-estate-listing-websites-orlando";

// Two buttons wherever the page asks for action: the paid start (main) and
// the complimentary page (second). Both land on the realtor intake form.
function CtaPair() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-4 sm:flex-row">
      <Link href={LISTING_START_PATH} className="btn-solid">
        Start My Listing <ArrowRight size={16} />
      </Link>
      <Link href={listingStartHref("free")} className="btn-glass text-white">
        Or try one page free
      </Link>
    </div>
  );
}
const TITLE = "Luxury Listing Websites for Orlando Real Estate Agents | EVOGENCY";
const DESCRIPTION =
  "EVOGENCY Listing Suite gives every Orlando listing its own bespoke property website, delivered in as little as 48 hours. Your first page is complimentary, then $297 per listing or $497 a month.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PATH,
    siteName: "EVOGENCY",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "EVOGENCY: Evolve. Elevate. Grow." }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
};

const BENEFITS = [
  {
    title: "Buyers fall for the home, not the next one",
    body: "One quiet page with no competing listings and no ads. Full screen photos, the story of living there, and every detail laid out beautifully.",
  },
  {
    title: "Walk into listing appointments with an ace",
    body: "Pull up a past page on your phone and show the seller exactly how their home will be presented. Few agents can do that.",
  },
  {
    title: "Showing requests land on your phone",
    body: "A request form on every page goes straight to your phone and inbox, so no buyer waits on a portal relay.",
  },
  {
    title: "Your yard sign starts working at night",
    body: "A QR code for the sign and the flyers takes drive by buyers straight to the page, even at 9 PM.",
  },
  {
    title: "Know who's looking",
    body: "A weekly report shows views and showing requests, ready to forward to your seller.",
  },
  {
    title: "Keep the glory after closing",
    body: "The page turns into a Just Sold page, so every sale keeps marketing you to the next seller.",
  },
];

const PLANS = [
  {
    id: "signature" as ListingPlanId,
    cta: "Start Signature Listing",
    eyebrow: "Per property",
    name: "Signature Listing",
    price: "$297",
    per: "per listing, paid once",
    items: [
      "Luxury page live in 48 hours",
      "Showing requests to your phone and email",
      "QR code for the sign and flyers",
      "Its own property domain",
      "Hosted through closing",
      "Weekly views and requests report",
      "Just Sold page after closing",
    ],
    fit: "Best for an occasional listing or one standout property.",
    hot: false,
  },
  {
    id: "partner" as ListingPlanId,
    cta: "Start Listing Partner",
    eyebrow: "Monthly",
    name: "Listing Partner",
    price: "$497",
    per: "a month, up to 4 new listings",
    items: [
      "Everything in Signature Listing",
      "Every new listing live in 24 hours",
      "Your own agent page with all your listings",
      "Monthly report you can show sellers",
      "Month to month, cancel anytime",
    ],
    fit: "About $124 a listing at 4 a month. Two or more listings a month and it pays for itself.",
    hot: true,
  },
  {
    id: "brokerage" as ListingPlanId,
    cta: "Get a Team Quote",
    eyebrow: "Teams and offices",
    name: "Brokerage Plan",
    price: "Quoted",
    per: "per agent, for the whole office",
    items: [
      "Listing Partner for every agent",
      "One consistent luxury look for the brokerage",
      "Office page with every active listing",
      "One monthly invoice",
    ],
    fit: "Best for team leads and brokers who want every listing to look like the flagship.",
    hot: false,
  },
];

const PROCESS = [
  { step: "01", title: "Send your listing address", body: "Tell us the property you want to show off. Your first page is free." },
  { step: "02", title: "We build the page", body: "Your listing photos, the story of the home, every detail, your name and brokerage. No homework for you." },
  { step: "03", title: "Share it everywhere", body: "Text it to buyers, put the QR code on the sign, and show it at your next listing appointment." },
];

const FAQ = [
  {
    q: "What is a single property website?",
    a: "A website made for one listing. It shows only that home, with full screen photos, the details, a map, and a showing request form, so buyers aren't distracted by other listings or ads the way they are on the big portals.",
  },
  {
    q: "How much does a listing website cost?",
    a: "Your first page is free. After that it's $297 per listing on Signature Listing, or $497 a month on Listing Partner for up to 4 new listings a month. Brokerages get a per agent quote.",
  },
  {
    q: "How fast can my listing page go live?",
    a: "48 hours on Signature Listing and 24 hours on Listing Partner, from the moment you send the address.",
  },
  {
    q: "I already have a marketing team. Do I still need this?",
    a: "They keep the photos, video, and ads. The page gives all of it one beautiful place to land, and it gives you something to show sellers.",
  },
  {
    q: "My brokerage gives me a listing page. How is this different?",
    a: "Most brokerage pages are a template with a form. This one sells the feeling of living in the home, and it's built around your name.",
  },
  {
    q: "What happens to my listing photos?",
    a: "We use your listing photos as they are, with your OK. We never edit, stage, or alter them.",
  },
  {
    q: "Does the page follow Florida advertising rules?",
    a: "Your brokerage's licensed name sits right with your contact info on every page, the way Florida advertising rules expect. You review the page before it goes out.",
  },
  {
    q: "Can I cancel Listing Partner?",
    a: "Yes. It's month to month with no long contract, and pages already live stay up through their closing.",
  },
];

export default function RealEstateListingWebsitesOrlandoPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicePageGraph(PATH, DESCRIPTION, FAQ)) }}
      />
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5fd8e6]/80">EVOGENCY Listing Suite</p>
        <h1 className={`mask-rise-load mt-3 text-5xl leading-[1.02] font-medium sm:text-6xl lg:text-7xl ${cormorant.className}`}>
          <span className="mask-line">
            <span className="text-[#f3ede0]" style={{ "--i": 0 } as React.CSSProperties}>Every Property</span>
          </span>
          <span className="mask-line">
            <span className="gradient-text italic" style={{ "--i": 1 } as React.CSSProperties}>Beautifully Presented</span>
          </span>
        </h1>
      </div>
      <RealtorTiles className="mx-auto mt-10 max-w-4xl" />
      {/* Plain, quotable definition first, for readers and AI answer engines. */}
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-white/90">
        {"EVOGENCY Listing Suite creates bespoke single property websites designed exclusively for real estate agents who understand that presentation matters."}
      </p>
      <p className="mx-auto mt-4 max-w-2xl text-center text-white/65">
        Every detail is thoughtfully curated, from the imagery and property story to your personal brand, creating an
        elevated digital experience that makes the home feel as exceptional online as it does in person.
      </p>
      <div className="mx-auto mt-8 max-w-2xl space-y-1 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5fd8e6]/85">Designed. Curated. Delivered in as little as 48 hours.</p>
        <p className="gradient-text text-2xl font-bold tracking-tight sm:text-3xl">Your Listing. Your Brand. Your Stage.</p>
        <p className="text-white/70">Give your sellers something they can see, share, and remember.</p>
      </div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-white/80">
        Ready for a page that sells? Start your listing today, or experience EVOGENCY Listing Suite with a
        complimentary page for your current listing.
      </p>
      <CtaPair />

      <div className="mt-16">
        <SectionHeading eyebrow="What every page does for you" title="Built to win the listing, and the buyer" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((item) => (
            <TiltCard key={item.title} className="glass h-full rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{item.body}</p>
            </TiltCard>
          ))}
        </div>
      </div>

      <div className="mt-20" id="plans">
        <SectionHeading eyebrow="The plans" title="Pick how you want to work" />
        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              id={plan.id}
              className={`plan-card glass relative flex scroll-mt-28 flex-col rounded-2xl p-6 ${plan.hot ? "border-[#5fd8e6]/60 shadow-[0_0_50px_-15px_rgba(95,216,230,0.55)]" : ""}`}
            >
              {plan.hot && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-[#5fd8e6] to-[#1f9fb3] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#041016]">
                  Most agents pick this
                </span>
              )}
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5fd8e6]/80">{plan.eyebrow}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{plan.name}</h3>
              <p className="gradient-text mt-3 text-4xl font-bold tracking-tight">{plan.price}</p>
              <p className="mt-1 text-sm text-white/55">{plan.per}</p>
              <ul className="mt-5 space-y-2 text-sm text-white/75">
                {plan.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <Check size={16} className="mt-0.5 shrink-0 text-[#5fd8e6]" aria-hidden="true" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-6 text-sm text-[#d6f6fa]/85">{plan.fit}</p>
              <Link
                href={listingStartHref(plan.id)}
                className={`${plan.hot ? "btn-solid" : "btn-glass text-white"} mt-5 w-full justify-center`}
              >
                {plan.cta} <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
        <div className="glass mt-6 flex flex-col gap-2 rounded-2xl p-6 sm:flex-row sm:items-center sm:gap-5">
          <span className="btn-solid w-fit shrink-0">Free</span>
          <p className="text-white/80">
            <span className="font-semibold text-white">Your first page is on us.</span> Send your current listing and
            we build it free. Keep it live when you start any plan.{" "}
            <Link href={listingStartHref("free")} className="font-semibold text-[#5fd8e6] hover:underline">
              Claim yours
            </Link>
          </p>
        </div>
        <p className="mt-4 text-center text-sm text-white/55">
          Add on. Put our AI front desk on your listing line to answer buyer questions and book showings around the
          clock.{" "}
          <Link href="/ai" className="text-[#5fd8e6] hover:underline">
            See how it works
          </Link>
        </p>
      </div>

      <div className="mx-auto mt-20 max-w-3xl">
        <SectionHeading eyebrow="How it works" title="Three steps, zero homework" />
        <div className="mt-10 space-y-8">
          {PROCESS.map((p) => (
            <div key={p.step} className="flex gap-6 border-b border-white/10 pb-8 last:border-0">
              <span className="shrink-0 text-2xl font-bold text-[#5fd8e6]/50">{p.step}</span>
              <div>
                <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="gradient-text text-2xl font-bold tracking-tight sm:text-3xl">Your next listing deserves a stage.</p>
        <CtaPair />
        <p className="text-sm text-white/55">
          Rather talk it through first?{" "}
          <a
            href="https://calendly.com/mohamed-eltoukhy011/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#5fd8e6] hover:underline"
          >
            <CalendarClock size={14} aria-hidden="true" /> Book a quick call
          </a>
        </p>
      </div>

      <div className="mx-auto mt-20 max-w-3xl">
        <SectionHeading eyebrow="Straight answers" title="Listing websites for Orlando agents" />
        <FaqList items={FAQ} />
      </div>
    </div>
  );
}
