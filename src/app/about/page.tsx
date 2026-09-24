import type { Metadata } from "next";
import Image from "next/image";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/cta-band";

const TITLE = "About EVOGENCY | Orlando Web Design & SEO Agency";
const DESCRIPTION =
  "Meet Mohamed Eltoukhy, the founder and builder behind EVOGENCY. Real software shipped for local businesses in Orlando, FL, not templates and outsourced work.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/about",
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

const FACTS: { label: string; value: React.ReactNode }[] = [
  { label: "What", value: "A web design, SEO, and custom software studio based in Orlando, Florida." },
  { label: "Who runs it", value: "Founded by Mohamed Eltoukhy, who designs and builds every project himself." },
  { label: "Services", value: "Websites, SEO, Google review systems, AI automation, custom CRMs, and mobile apps." },
  { label: "Built in house", value: "Agency OS, the CRM EVOGENCY runs on, and ElectricalAI Pro, free electrical calculators for the trades." },
  {
    label: "Contact",
    value: (
      <>
        <a href="tel:+18138971954" className="hover:text-white">(813) 897-1954</a>
        {" · "}
        <a href="mailto:hello@evogencyglobal.com" className="hover:text-white">hello@evogencyglobal.com</a>
      </>
    ),
  },
];

const PRINCIPLES = [
  {
    title: "Ship real things, not mockups",
    body: "Every project ends with something live that you can open, use, and measure. No endless revision cycles on a slide deck.",
  },
  {
    title: "Speed is a feature",
    body: "A beautiful site that takes six seconds to load loses the customer before they see it. Everything gets built fast first, mobile first.",
  },
  {
    title: "You talk to the builder",
    body: "No account manager relaying messages to an offshore team. The person who writes your code answers your calls.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <SectionHeading as="h1" eyebrow="Not an agency. An engineer." title="The Orlando engineer behind EVOGENCY" />

      <div className="mt-12">
        <TiltCard className="glass-strong flex flex-col items-center gap-6 rounded-3xl p-10 text-center sm:flex-row sm:text-left">
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10 shadow-[0_20px_50px_-15px_rgba(240,193,75,0.5)]">
            <Image
              src="/moe-founder.webp"
              alt="Mohamed Eltoukhy, founder of EVOGENCY, in a navy suit in his office"
              width={112}
              height={112}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Mohamed Eltoukhy</h2>
            <p className="text-sm font-medium text-[#f0c14b]">Founder, EVOGENCY</p>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              Mohamed built EVOGENCY on a simple premise: agencies should ship
              real software, not slideshows. He designs and builds the CRM
              platforms, websites, and SEO systems clients rely on, combining
              a background in electronics and systems work with hands on
              software development.
            </p>
          </div>
        </TiltCard>
      </div>

      {/* Plain facts, stated once, for visitors and for AI answer engines
          that need to tell this EVOGENCY apart from similarly named ones. */}
      <section className="mt-10">
        <div className="glass rounded-3xl p-8">
          <h2 className="text-lg font-semibold text-white">EVOGENCY at a glance</h2>
          <dl className="mt-5 space-y-3 text-sm leading-relaxed">
            {FACTS.map((f) => (
              <div key={f.label} className="sm:flex sm:gap-4">
                <dt className="shrink-0 font-semibold text-[#f0c14b] sm:w-32">{f.label}</dt>
                <dd className="text-white/70">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* How we work */}
      <section className="mt-24">
        <SectionHeading eyebrow="How we work" title="Three rules we don't break" />
        <div className="mt-12 space-y-8">
          {PRINCIPLES.map((p, i) => (
            <div key={p.title} className="flex gap-6 border-b border-white/10 pb-8 last:border-0">
              <span className="shrink-0 text-2xl font-bold text-[#f0c14b]/50">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="mt-20">
        <SectionHeading eyebrow="Why EVOGENCY exists" title="Built by someone who builds" />
        <div className="mt-10 space-y-4 text-white/65">
          <p>
            Most agencies sell local businesses a template, a monthly retainer,
            and a report nobody reads. The work gets outsourced, the site loads
            slow, and the owner never finds out why the phone isn&apos;t ringing.
          </p>
          <p>
            EVOGENCY runs the other way. The person who writes the code is the
            person you talk to. Everything on the work page was built here, from
            a professional desktop app to the CRM that runs this business.
            That is the bar, and your website gets held to it too.
          </p>
        </div>
      </section>

      <CtaBand text="Work with us" />
    </div>
  );
}
