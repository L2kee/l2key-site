import type { Metadata } from "next";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/cta-band";

const TITLE = "SEO Agency Orlando | EVOGENCY";
const DESCRIPTION =
  "EVOGENCY is an SEO agency in Orlando, FL helping local businesses rank higher, show up in the map pack, and turn searches into real customers. Get a free audit.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/seo-agency-orlando" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/seo-agency-orlando",
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
    title: "Technical fixes",
    body: "Site speed, mobile usability, broken links, and the crawl errors that quietly keep Google from trusting your site.",
  },
  {
    title: "Local SEO and the map pack",
    body: "Google Business Profile optimization, citations, and the local signals that decide who shows up when someone searches near them.",
  },
  {
    title: "Content that actually ranks",
    body: "Pages built around what your customers are really typing into Google, not generic filler written to hit a word count.",
  },
  {
    title: "Reporting you can read",
    body: "Plain language updates on what changed, what it did, and what's next. No jargon dashboards you need us to translate.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Free audit",
    body: "We look at your current site and Google presence and tell you exactly what's costing you customers, before you spend a dollar.",
  },
  {
    step: "02",
    title: "Fix the foundation",
    body: "Technical issues and local listings get cleaned up first. Rankings don't move on a broken foundation.",
  },
  {
    step: "03",
    title: "Grow month over month",
    body: "Ongoing content and local optimization, with real reporting so you always know what's working.",
  },
];

const FAQ = [
  {
    q: "How long does SEO take to work?",
    a: "Most local businesses start seeing real movement in 60 to 90 days, with compounding results after that. Anyone promising results in a week is selling something else.",
  },
  {
    q: "Do you guarantee first page rankings?",
    a: "No, and you should be skeptical of anyone who does. Google's algorithm isn't for sale. What we guarantee is real work on the things that actually move rankings.",
  },
  {
    q: "Is local SEO different from regular SEO?",
    a: "Yes. Local SEO is about showing up in the map pack and for near me searches, which runs on different signals than ranking a national site, including your Google Business Profile, reviews, and local citations.",
  },
  {
    q: "What kind of businesses is this for?",
    a: "Local service businesses that live and die by whether customers can find them: plumbers, roofers, contractors, and similar trades doing business in and around Orlando.",
  },
];

export default function SeoAgencyOrlandoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <SectionHeading
        as="h1"
        eyebrow="SEO in Orlando, FL"
        title="SEO Agency Orlando"
      />
      <p className="mx-auto mt-6 max-w-2xl text-center text-white/65">
        Your customers are already searching. EVOGENCY builds the technical
        foundation, local presence, and content that make sure they find you
        first, not the competitor three spots above you on Google.
      </p>

      <div className="mt-16">
        <SectionHeading eyebrow="What's included" title="What an Orlando SEO agency should actually do" />
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
        <SectionHeading eyebrow="Frequently asked" title="SEO agency Orlando: the honest answers" />
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
