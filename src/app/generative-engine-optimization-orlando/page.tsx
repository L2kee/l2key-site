import type { Metadata } from "next";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/cta-band";
import { faqSchema } from "@/lib/faq-schema";

const TITLE = "Generative Engine Optimization Orlando | EVOGENCY";
const DESCRIPTION =
  "EVOGENCY helps Orlando businesses show up when people ask ChatGPT, Perplexity, and Google AI Overviews for a recommendation. Structured content built for the way AI actually reads the web.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/generative-engine-optimization-orlando" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/generative-engine-optimization-orlando",
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
    title: "Structured content and schema",
    body: "Pages organized and marked up so AI systems can parse a clear, direct answer out of your site, not just crawl it.",
  },
  {
    title: "Clear, quotable business information",
    body: "Copy, profiles, and listings written so an AI answer engine can lift an accurate line about your business and get it right.",
  },
  {
    title: "The SEO foundation underneath it",
    body: "Generative engine optimization builds on the same base as regular SEO: local signals, reviews, and site authority. We do not skip that step.",
  },
  {
    title: "Ongoing monitoring",
    body: "Checking what ChatGPT, Perplexity, and Google AI Overviews actually say about your business, then adjusting the content feeding those answers.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "See how you show up today",
    body: "We ask the major AI tools about your business and your competitors and show you exactly what they say, or don't say, right now.",
  },
  {
    step: "02",
    title: "Structure the content",
    body: "Key pages get rebuilt so the facts about your business are unambiguous and easy for an AI model to extract and repeat correctly.",
  },
  {
    step: "03",
    title: "Track and adjust",
    body: "Answer engines change how and what they cite over time. We keep watching what's being said and adjust the content behind it.",
  },
];

const FAQ = [
  {
    q: "What is generative engine optimization?",
    a: "It's the practice of making sure AI systems like ChatGPT, Perplexity, and Google AI Overviews actually name your business when someone asks for a recommendation in your space.",
  },
  {
    q: "How is this different from regular SEO?",
    a: "They share the same foundation, but traditional SEO earns you a spot in a ranked list of links. Generative engine optimization earns you a mention inside the answer itself, which takes differently structured content to win.",
  },
  {
    q: "Can you guarantee we'll get mentioned by name?",
    a: "No, and you should be skeptical of anyone who says they can. These systems change constantly and none of them publish their exact criteria. What we guarantee is real, structured work on the things that actually influence it.",
  },
  {
    q: "Is this actually worth doing yet?",
    a: "It's early, but growing fast, and right now almost nobody in Orlando is actively competing for this. Being early here costs a lot less than trying to catch up once it's crowded.",
  },
  {
    q: "How do I get my business mentioned in ChatGPT or AI search results?",
    a: "By making sure your business information is structured, accurate, and consistent everywhere it appears online. That's exactly what generative engine optimization does.",
  },
  {
    q: "Is there a generative engine optimization agency near me?",
    a: "Yes. EVOGENCY is based in Orlando and builds this work directly for local businesses, not as an afterthought bolted onto traditional SEO.",
  },
];

export default function GenerativeEngineOptimizationOrlandoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(FAQ)) }}
      />
      <SectionHeading
        as="h1"
        eyebrow="AI Search in Orlando, FL"
        title="Generative Engine Optimization Orlando"
      />
      <p className="mx-auto mt-6 max-w-2xl text-center text-white/65">
        People are starting to ask ChatGPT, Perplexity, and Google AI Overviews
        for a recommendation instead of typing a search and scrolling links.
        EVOGENCY builds the content and structure that make AI systems name
        your business when that question gets asked.
      </p>

      <div className="mt-16">
        <SectionHeading eyebrow="What's included" title="What generative engine optimization actually takes" />
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
        <SectionHeading eyebrow="Frequently asked" title="Generative engine optimization: the honest answers" />
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
