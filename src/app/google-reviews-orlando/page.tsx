import type { Metadata } from "next";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/cta-band";

const TITLE = "Google Reviews & Reputation Management Orlando | EVOGENCY";
const DESCRIPTION =
  "EVOGENCY sets up your Google Business Profile and builds a real system for getting more reviews, so happy customers become the reason the next one picks you.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/google-reviews-orlando" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/google-reviews-orlando",
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

const INCLUDED = [
  {
    title: "Google Business Profile setup",
    body: "Your hours, categories, service area, and photos set up correctly, since a half filled out profile quietly costs you the map pack.",
  },
  {
    title: "A real system for asking",
    body: "A simple, repeatable way to ask happy customers for a review right after the job is done, when they're most likely to actually leave one.",
  },
  {
    title: "Monitoring and responses",
    body: "Someone actually watching for new reviews, good or bad, and responding to them instead of letting them sit there unanswered.",
  },
  {
    title: "Honest reporting",
    body: "Real numbers on how many reviews came in and where they're showing up, not a vague promise about your reputation improving.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Audit your current presence",
    body: "We look at your Google Business Profile and current reviews and show you exactly what's missing or holding you back.",
  },
  {
    step: "02",
    title: "Fix the profile",
    body: "Categories, hours, service area, and photos get cleaned up and optimized so you're actually eligible to show up in the map pack.",
  },
  {
    step: "03",
    title: "Build the ask",
    body: "A simple system gets put in place for asking real customers for a review at the right moment. No gimmicks, no fake reviews.",
  },
  {
    step: "04",
    title: "Monitor and respond",
    body: "Reviews get watched and responded to on an ongoing basis instead of being set up once and forgotten.",
  },
];

const FAQ = [
  {
    q: "Can you get us fake reviews?",
    a: "No, and we won't. Fake reviews violate Google's policies and can get a business profile suspended entirely. Everything we build is aimed at getting real reviews from real customers.",
  },
  {
    q: "How many reviews will we actually get?",
    a: "It depends on how many customers you serve and how consistently the ask goes out. What we can guarantee is a real system, not a made up number.",
  },
  {
    q: "What if we get a bad review?",
    a: "We help you respond professionally and quickly. A single bad review handled well often builds more trust than having none at all.",
  },
  {
    q: "Do you write the reviews for customers?",
    a: "No. We build the system that asks for a review and makes it easy to leave one. What they actually say is entirely up to them.",
  },
  {
    q: "How is this different from just asking customers myself?",
    a: "You can ask customers yourself, but most businesses stop asking because it's easy to forget in the moment. We build a system so it happens every time, not just when someone remembers.",
  },
  {
    q: "Can you guarantee a five star rating?",
    a: "No, and you should be skeptical of anyone who says they can control what a customer writes. What we guarantee is a real process for asking, and honest responses when they do.",
  },
];

export default function GoogleReviewsOrlandoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <SectionHeading
        as="h1"
        eyebrow="Google Reviews & Reputation in Orlando, FL"
        title="Google Reviews & Reputation Orlando"
      />
      <p className="mx-auto mt-6 max-w-2xl text-center text-white/65">
        Most customers check your reviews before they ever call. EVOGENCY
        sets up your Google Business Profile the right way and builds a
        simple system for asking happy customers to leave a review, so your
        reputation does the selling before you ever pick up the phone.
      </p>

      <div className="mt-16">
        <SectionHeading eyebrow="What's included" title="What real reputation management actually looks like" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {INCLUDED.map((item) => (
            <TiltCard key={item.title} className="glass h-full rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{item.body}</p>
            </TiltCard>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <SectionHeading eyebrow="How it works" title="A process built on being honest, not flashy" />
        <div className="mt-10 space-y-8">
          {PROCESS.map((p) => (
            <div key={p.step} className="flex gap-6 border-b border-white/10 pb-8 last:border-0">
              <span className="shrink-0 text-2xl font-bold text-[#f0c14b]/50">{p.step}</span>
              <div>
                <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CtaBand text="Get Your Free Audit" />

      <div className="mt-20">
        <SectionHeading eyebrow="Frequently asked" title="Google reviews Orlando: the honest answers" />
        <div className="mt-10 space-y-6">
          {FAQ.map((item) => (
            <TiltCard key={item.q} className="glass rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white">{item.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{item.a}</p>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  );
}
