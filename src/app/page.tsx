import Link from "next/link";
import { AskAvaLink } from "@/components/site-chat";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { Marquee } from "@/components/marquee";
import { WorkCard } from "@/components/work-card";
import { ServicesJourney } from "@/components/services-journey";
import { HeroVideo } from "@/components/hero-video";
import { HeroReveal } from "@/components/hero-reveal";
import { CtaTrace } from "@/components/cta-trace";
import { DropLetters } from "@/components/drop-letters";
import { SamplePanels } from "@/components/sample-panels";
import { LogoWall } from "@/components/logo-wall";
import { FaqList } from "@/components/faq-list";
import { SAMPLES } from "@/lib/job-site-studio";
import { WORK } from "@/lib/content";

const FAQ = [
  {
    q: "What is the free homepage mockup?",
    a: "We design what your new homepage could look like, built around your business and your customers, before you pay anything. If you like it, we talk about building the full site. If not, you owe us nothing.",
  },
  {
    q: "How long does a new website take?",
    a: "Most small business sites take a few weeks from kickoff to launch, depending on how many pages and features you need.",
  },
  {
    q: "How much does a website cost?",
    a: "It depends on the pages and features you need. A clean single page site costs far less than a full site with booking built in. We give you a real number once we understand what you need, not a generic package price.",
  },
  {
    q: "Do I own my website?",
    a: "Yes. It's built with real code you own, not a locked template you keep renting month to month.",
  },
  {
    q: "Will my site work well on phones?",
    a: "Every site is designed for phones first and then adapted up to desktop, because most of your visitors find you on their phone.",
  },
  {
    q: "Do you only work with Orlando businesses?",
    a: "We're based in Orlando and work with businesses anywhere. Everything from the kickoff call to launch day happens online.",
  },
];

export default function Home() {
  return (
    <div id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }),
        }}
      />
      <HeroVideo />

      {/* Hero */}
      <HeroReveal className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-8 pb-16 text-center [--hero-delay:2000ms]">
        {/* The headline drops in letter by letter (35 letters, the last one
            lands at about 2s), then each hero-in line rises after the one
            before it, starting at --hero-delay. --i sets its place in the
            order (see .hero-letter and .hero-in in globals.css). */}
        <h1
          aria-label="Built to be found. Designed to be trusted."
          className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
        >
          <span className="block">
            <DropLetters text="Built to be found." />
          </span>
          <span className="block">
            <DropLetters text="Designed to be trusted." start={15} letterClass="hero-accent" />
          </span>
        </h1>

        <p className="hero-in mt-6 text-balance text-xl font-semibold text-white [--i:2] sm:text-2xl">
          Your business deserves to be seen.
        </p>
        <p className="hero-in mt-3 max-w-2xl text-balance text-white/70 [--i:3] sm:text-lg">
          EVOGENCY builds the websites, search presence, and digital systems
          that turn attention into customers.
        </p>

        <div className="hero-in mt-10 [--i:4]">
          <Link
            href="/contact"
            className="btn-solid hero-cta !px-8 !py-4 text-base sm:text-lg"
          >
            Get Your Free Audit <ArrowRight size={18} />
          </Link>
          <p className="mt-5 text-sm text-white/60">
            Got a question right now?{" "}
            <AskAvaLink className="font-semibold text-[#5fd8e6] underline-offset-4 transition hover:text-white hover:underline" />{" "}
            She&apos;s the same tech we build for you.
          </p>
        </div>
      </HeroReveal>

      <ServicesJourney />

      <Marquee />

      {/* Job Site Studio strip: the sample videos as an expanding panel
          gallery, with the service summed up underneath. */}
      <section className="mx-auto max-w-3xl px-6 pt-16">
        <TiltCard className="glass-strong rounded-3xl p-3 sm:p-6">
          {/* Three samples here, all five on the Job Site Studio page. */}
          <SamplePanels samples={SAMPLES.slice(0, 3)} />
          <div className="px-4 pt-8 pb-4 text-center sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5fd8e6]">
              Job Site Studio
            </p>
            <p className="mx-auto mt-3 max-w-md text-white/65">
              Send us raw clips from the job site and get back finished videos
              for TikTok, Reels, Shorts, and Facebook. No editing, no app to
              learn.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/job-site-studio" className="btn-solid">
                Try 3 free videos <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </TiltCard>
      </section>

      {/* Logo wall cycle: concept marks only, labeled as such (logo-wall.tsx). */}
      <section className="mx-auto max-w-4xl px-6 pt-20">
        <SectionHeading eyebrow="From our concept studio" title="Marks made to be remembered" />
        <div className="mt-10">
          <LogoWall />
        </div>
        <p className="mx-auto mt-5 max-w-xl text-center text-xs text-white/45">
          Concept marks from our studio. Some reimagine real local brands, some
          are brands we dreamed up. None are client logos.
        </p>
        <div className="mt-6 text-center">
          <Link href="/brand-design" className="text-sm font-medium text-[#5fd8e6] hover:underline">
            See our brand design studio →
          </Link>
        </div>
      </section>

      {/* Work preview */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <SectionHeading eyebrow="Proof, not promises" title="Featured work" />
        <div className="mt-10 flex flex-col gap-14 md:gap-8">
          {WORK.map((w) => (
            <WorkCard key={w.title} item={w} layout="split" />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/works" className="text-sm font-medium text-[#5fd8e6] hover:underline">
            See all work →
          </Link>
        </div>
      </section>

      {/* FAQ drawers (faq-list.tsx), same as the service pages. */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <SectionHeading eyebrow="Questions" title="Before you ask" />
        <FaqList items={FAQ} />
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <TiltCard className="glass-strong relative rounded-3xl p-10 text-center">
          <CtaTrace radius={24} />
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Let&apos;s get your business found online
          </h2>
          <p className="mark-scope mx-auto mt-3 max-w-md text-white/65">
            Free, no pressure audit of your current site and Google presence.
            We&apos;ll tell you{" "}
            <mark className="mark-sweep">exactly what&apos;s costing you customers.</mark>
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/contact" className="btn-solid">
              Get started <ArrowRight size={16} />
            </Link>
          </div>
        </TiltCard>
      </section>
    </div>
  );
}
