import { serif } from "@/lib/fonts";
import Link from "next/link";
import { AskAvaLink } from "@/components/site-chat";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { WorkCard } from "@/components/work-card";
import { HeroVideo } from "@/components/hero-video";
import { HeroReveal } from "@/components/hero-reveal";
import { HeroMockupButton } from "@/components/hero-mockup-button";
import { CtaTrace } from "@/components/cta-trace";
import { DropLetters } from "@/components/drop-letters";
import { FaqList } from "@/components/faq-list";
import { Marquee } from "@/components/marquee";
import { LogoWall } from "@/components/logo-wall";
import { DrawnSteps } from "@/components/drawn-steps";
import { ServicesRail } from "@/components/services-rail";
import { TOP_SERVICES } from "@/lib/content";

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

const STEPS = [
  {
    title: "Get Started",
    body: "Tap what you need and answer a few quick questions. Two minutes, tops, and no sales call to sit through.",
  },
  {
    title: "Get Your Plan & Price",
    body: "Within one business day a real person sends you a clear plan and a fixed price. No \"it depends.\" No surprise invoices.",
  },
  {
    title: "Get It Built Your Way",
    body: "We run it for you month to month, or we build it, train your team, and hand you the keys. Your call, every time.",
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
      {/* Hero. From sm up the lotus video sits behind the copy (.hero-stage
          in globals.css), the welcome message centered in the first
          screen (.home-hero). Phones keep the video above the copy. From lg up the
          services menu runs down the left beside it (services-rail.tsx,
          Moe 2026-11-08), lifted to line up with the navbar (.home-rail). */}
      <div className="flex w-full gap-6 lg:px-4">
      <ServicesRail className="home-rail" />
      <div className="hero-stage home-hero min-w-0 flex-1">
      <HeroVideo />

      <HeroReveal className="hero-copy mx-auto flex max-w-6xl flex-col items-center px-6 pt-8 pb-16 text-center [--hero-delay:1200ms]">
        {/* The headline drops in letter by letter (40 letters, the last one
            lands a little after 2s), then each hero-in line rises after the one
            before it, starting at --hero-delay (1.2s, so the tiles rise
            while the last letters land). --i sets its place in the
            order (see .hero-letter and .hero-in in globals.css). */}
        <h1
          aria-label="Redefining Communication Through Innovation"
          className={`hero-serif text-4xl font-semibold leading-[1.05] text-[#d6f6fa] [--accent-first:23] [--accent-last:39] sm:text-5xl xl:text-6xl ${serif.className}`}
        >
          <span className="block">
            <DropLetters text="Redefining Communication" />
          </span>
          <span className="block italic">
            <DropLetters text="Through Innovation" start={23} letterClass="hero-accent" />
          </span>
        </h1>

        <p className="hero-in mt-4 max-w-2xl text-balance text-base text-white/80 [--i:2] sm:text-lg">
          Delivering Excellence Beyond Expectations
        </p>

        {/* Phones only (Moe 2026-11-13): a tap target in the first screen.
            Its own short --hero-delay so it rises right after the video
            instead of waiting out the 2s letter drop. */}
        <div className="hero-in mt-6 flex flex-col items-center gap-3 [--hero-delay:300ms] [--i:0] sm:hidden">
          <HeroMockupButton className="btn-solid hero-cta" />
          <Link href="/start" className="text-sm font-medium text-[#5fd8e6] underline-offset-4 hover:underline">
            or tell us what you need
          </Link>
        </div>

        <p className="hero-in mt-8 text-sm text-white/60 [--i:3]">
          Got a question right now?{" "}
          <AskAvaLink className="font-semibold text-[#5fd8e6] underline-offset-4 transition hover:text-white hover:underline" />{" "}
          She&apos;s the same tech we build for you.
        </p>
      </HeroReveal>
      </div>
      </div>

      {/* How it works, then Grow. Evolve. Elevate., then the tech logos
          (Moe 2026-11-08). */}
      <Marquee>
        <section className="mx-auto max-w-5xl px-6 py-16">
          <SectionHeading eyebrow="Simple. Smart. Seamless." title="From Idea To Execution. Three Steps. One Seamless Experience." />
          <DrawnSteps steps={STEPS} />
        </section>
      </Marquee>

      {/* Top services (Moe 2026-11-08), in the Featured Work card layout
          that used to sit here. The work itself lives on /works. */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <SectionHeading eyebrow="Proof, not promises" title="Our Top Services" />
        <div className="mt-10 flex flex-col gap-14 md:gap-8">
          {TOP_SERVICES.map((w, i) => (
            <WorkCard key={w.title} item={w} layout="split" flip={i % 2 === 1} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/services" className="text-sm font-medium text-[#5fd8e6] hover:underline">
            See all services →
          </Link>
        </div>
      </section>

      {/* Logo wall cycle: concept marks only (logo-wall.tsx). */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <SectionHeading eyebrow="From our concept studio" title="Marks made to be remembered" />
        <div className="mt-10">
          <LogoWall />
        </div>
        <div className="mt-8 text-center">
          <Link href="/brand-design" className="text-sm font-medium text-[#5fd8e6] hover:underline">
            See our brand design studio →
          </Link>
        </div>
      </section>

      {/* Built in house teaser */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <Link
          href="/built-in-house"
          className="glass group flex flex-col items-center justify-between gap-4 rounded-2xl px-6 py-6 text-center transition hover:border-[#5fd8e6]/50 sm:flex-row sm:text-left"
        >
          <span>
            <span className="block font-semibold text-white">Every effect on this site was built by hand.</span>
            <span className="block text-sm text-white/60">
              The letter drop, the glass, the morphing menu. See all of it, and picture it on yours.
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-[#5fd8e6]">
            See what we build <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </span>
        </Link>
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
            Tell us what you need
          </h2>
          <p className="mark-scope mx-auto mt-3 max-w-md text-white/65">
            A few quick taps. Within one business day you get{" "}
            <mark className="mark-sweep">a plan and a real price,</mark> not a sales pitch.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/start" className="btn-solid">
              Get started <ArrowRight size={16} />
            </Link>
          </div>
        </TiltCard>
      </section>
    </div>
  );
}
