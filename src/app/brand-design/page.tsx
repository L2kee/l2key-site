import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/cta-band";
import { servicePageGraph } from "@/lib/schema";

const TITLE = "Luxury Brand Design and Rebranding Agency | EVOGENCY";
const DESCRIPTION =
  "EVOGENCY designs logos and complete brand identities for premium brands that are launching or repositioning, then builds the website and search presence to match.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/brand-design" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/brand-design",
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
    title: "A logo and mark with a point of view",
    body: "A primary logo, a simple mark for small spaces, and the rules for using both, designed to look expensive on a storefront, a box, or a phone screen.",
  },
  {
    title: "Color and type that carry the price tag",
    body: "A restrained palette and a typeface pairing chosen to signal quality before a single word is read. Cheap brands shout. Premium brands do not have to.",
  },
  {
    title: "A brand guide your team can actually use",
    body: "One clear document covering logo spacing, color values, type, and tone, so every future designer, printer, and post stays on brand.",
  },
  {
    title: "Launch ready assets",
    body: "Social profile graphics, business cards, and the core pieces you need on day one, sized and ready to publish.",
  },
];

const WHO = [
  {
    title: "Launching a brand",
    body: "You are about to put a premium product or service into the world and you want it to look like it belongs at the top of its category from the first day.",
  },
  {
    title: "Repositioning a brand",
    body: "Your work moved upmarket but your logo and look did not. The price went up, the image stayed behind, and customers feel the gap.",
  },
  {
    title: "Outgrowing a first logo",
    body: "The identity you started with was fine for a side project. It does not match the business you run now, and it is quietly costing you trust.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Discovery",
    body: "We learn who you sell to, what you charge, who you compete with, and the feeling a customer should have when they first see you.",
  },
  {
    step: "02",
    title: "Direction",
    body: "You see a clear visual direction before any final design work starts, so the big decisions are made together and early.",
  },
  {
    step: "03",
    title: "Design",
    body: "The logo, palette, type, and supporting pieces are designed and refined by the founder, not pulled from a template or a logo generator.",
  },
  {
    step: "04",
    title: "Handoff and launch",
    body: "You get the final files and the brand guide, and if you want it, we carry the new identity straight into your website and search presence.",
  },
];

const FAQ = [
  {
    q: "Who is this for?",
    a: "Premium brands that are launching or repositioning, such as boutique hospitality, wellness and beauty, jewelry and fashion, real estate, and founders building a high end product line. If you charge more because you are better, your brand should show it.",
  },
  {
    q: "Do you only work with businesses in Orlando?",
    a: "No. Brand work is done remotely, so we work with brands anywhere. EVOGENCY is based in Orlando, FL, and we still run local SEO for Orlando businesses.",
  },
  {
    q: "What is the difference between a logo and a brand identity?",
    a: "A logo is one piece. A brand identity is the whole system around it, including color, type, tone, and the rules that keep everything consistent. A logo alone rarely makes a business look premium. The system does.",
  },
  {
    q: "How long does a rebrand take?",
    a: "Most identity projects take a few weeks from kickoff to final files, depending on how much supporting material you need. We give you a clear timeline after the discovery conversation.",
  },
  {
    q: "What does brand design cost?",
    a: "It depends on the scope, from a focused logo and palette to a full identity with launch assets. We give you a real number after understanding what you need, not a generic package price.",
  },
  {
    q: "Can you build the website after the rebrand?",
    a: "Yes, and it is usually the smartest order. A new brand on an old website wastes the investment. We design the identity and then build and optimize the site around it, so everything matches.",
  },
  {
    q: "Do you guarantee that a rebrand will increase sales?",
    a: "No, and be skeptical of anyone who does. What we guarantee is a clear, professional identity that matches the quality of what you sell, which removes a common reason premium buyers hesitate.",
  },
  {
    q: "Will I own the final design files?",
    a: "Yes. You receive the final logo files and the brand guide, so you can use them anywhere without being tied to us.",
  },
];

export default function BrandDesignPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicePageGraph("/brand-design", DESCRIPTION, FAQ)) }}
      />
      <SectionHeading
        as="h1"
        eyebrow="Brand design and rebrands"
        title="A brand that looks like what you charge"
      />
      {/* Plain, quotable definition first, for readers and AI answer engines. */}
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-white/90">
        {"EVOGENCY is a brand design and web agency that creates logos and complete brand identities for premium brands launching or repositioning, then builds the website and search presence to match."}
      </p>
      <p className="mx-auto mt-4 max-w-2xl text-center text-white/65">
        People judge your price in about three seconds, long before they read
        a word. If your logo, colors, and type say budget while your work says
        premium, you lose the sale at the first glance. We close that gap.
      </p>
      <div className="mt-8 flex justify-center">
        <Link href="/contact" className="btn-solid">
          Start a brand conversation <ArrowRight size={16} />
        </Link>
      </div>

      <div className="mt-20">
        <SectionHeading eyebrow="What you get" title="Everything a premium brand needs to look the part" />
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
        <SectionHeading eyebrow="Who it is for" title="Three moments when a brand needs to level up" />
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {WHO.map((item) => (
            <TiltCard key={item.title} className="glass h-full rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{item.body}</p>
            </TiltCard>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <SectionHeading eyebrow="How it works" title="A clear path from first call to final files" />
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

      <div className="mt-20">
        <SectionHeading eyebrow="Beyond the logo" title="A new brand deserves a website and search presence to match" />
        <p className="mx-auto mt-6 max-w-2xl text-center text-white/65">
          A beautiful identity on an outdated website is money left on the
          table. After the brand is done, we can build the{" "}
          <Link href="/web-design-agency-orlando" className="text-[#f0c14b] hover:underline">website</Link>{" "}
          and keep it found with{" "}
          <Link href="/seo-agency-orlando" className="text-[#f0c14b] hover:underline">SEO</Link>
          , so the look, the site, and the search results all say the same
          thing.
        </p>
      </div>

      <div className="mt-12">
        <CtaBand text="Start a Brand Conversation" />
      </div>

      <div className="mt-20">
        <SectionHeading eyebrow="Frequently asked" title="Brand design and rebranding, the honest answers" />
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
