import type { Metadata } from "next";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/cta-band";

const TITLE = "Web Design Agency Orlando | EVOGENCY";
const DESCRIPTION =
  "EVOGENCY designs and builds fast, mobile first websites for Orlando businesses that turn visitors into calls and bookings, not just look nice sitting there.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/web-design-agency-orlando" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/web-design-agency-orlando",
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
    title: "Mobile first design",
    body: "Most of your visitors are on a phone. Every site is designed and tested for mobile first, not squeezed in as an afterthought.",
  },
  {
    title: "Built for speed",
    body: "A slow site loses visitors before they ever see what you offer. Every page is built lean and fast, not weighed down by a bloated page builder.",
  },
  {
    title: "A layout built to convert",
    body: "Clear calls to action and easy to find contact information, laid out around getting a visitor to actually reach out, not just scroll through.",
  },
  {
    title: "Real ownership, not a rental",
    body: "You get a real website built with real code. Nothing locked behind a template subscription you lose access to the day you stop paying it.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Discovery",
    body: "We start by understanding your business and what a visitor actually needs to see to trust you and reach out.",
  },
  {
    step: "02",
    title: "Design",
    body: "A design built around your brand and your customers, not a generic template with your logo pasted on top of it.",
  },
  {
    step: "03",
    title: "Build",
    body: "The site gets built fast, secure, and mobile first, tested across real devices before it ever goes live.",
  },
  {
    step: "04",
    title: "Launch and support",
    body: "Once it's live we keep watching it, fixing issues, and making updates as your business changes.",
  },
];

const FAQ = [
  {
    q: "How long does a new website take to build?",
    a: "Most small business sites take a few weeks from kickoff to launch, depending on how much content and how many pages are involved.",
  },
  {
    q: "Do I own my website?",
    a: "Yes. It's built with real code you own, not a locked template on a page builder you have to keep renting month to month.",
  },
  {
    q: "Will my site actually work well on phones?",
    a: "Every site is designed mobile first, then adapted up to desktop, since most of your visitors are checking you out from their phone anyway.",
  },
  {
    q: "Can you redesign my current site instead of starting over?",
    a: "Yes. Sometimes the smart move is rebuilding a few key pages instead of tearing down something that already works. We audit first and tell you honestly which one makes sense.",
  },
  {
    q: "What if I need changes after it launches?",
    a: "Sites need updates as a business changes. We handle ongoing changes and can also hand off the parts you want to manage yourself.",
  },
  {
    q: "Do you guarantee more customers from a new website?",
    a: "No, and you should be skeptical of anyone who guarantees a specific number of customers from a website alone. What we guarantee is a site that's fast, easy to use, and built to convert the traffic you already have or start driving.",
  },
];

export default function WebDesignAgencyOrlandoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <SectionHeading
        as="h1"
        eyebrow="Web Design in Orlando, FL"
        title="Web Design Agency Orlando"
      />
      <p className="mx-auto mt-6 max-w-2xl text-center text-white/65">
        Your website is often the first impression a customer gets of your
        business. EVOGENCY builds fast, mobile first websites that load
        quickly, look sharp, and are built to turn a visitor into a call or a
        booking.
      </p>

      <div className="mt-16">
        <SectionHeading eyebrow="What's included" title="What an Orlando web design agency should actually do" />
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
        <SectionHeading eyebrow="Frequently asked" title="Web design agency Orlando: the honest answers" />
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
