import Link from "next/link";
import { AskAvaLink } from "@/components/site-chat";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { WorkCard } from "@/components/work-card";
import { HeroVideo } from "@/components/hero-video";
import { HeroReveal } from "@/components/hero-reveal";
import { CtaTrace } from "@/components/cta-trace";
import { DropLetters } from "@/components/drop-letters";
import { FaqList } from "@/components/faq-list";
import { Marquee } from "@/components/marquee";
import { LogoWall } from "@/components/logo-wall";
import { StartTiles } from "@/components/start-tiles";
import { DrawnSteps } from "@/components/drawn-steps";
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
          in globals.css) so the headline and the tiles share the first
          screen. Phones keep the video above the copy. */}
      <div className="hero-stage">
      <HeroVideo />

      <HeroReveal className="hero-copy mx-auto flex max-w-6xl flex-col items-center px-6 pt-8 pb-16 text-center [--hero-delay:1200ms]">
        {/* The headline drops in letter by letter (35 letters, the last one
            lands at about 2s), then each hero-in line rises after the one
            before it, starting at --hero-delay (1.2s, so the tiles rise
            while the last letters land). --i sets its place in the
            order (see .hero-letter and .hero-in in globals.css). */}
        <h1
          aria-label="Built to be found. Designed to be trusted."
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl xl:text-6xl"
        >
          <span className="block">
            <DropLetters text="Built to be found." />
          </span>
          <span className="block">
            <DropLetters text="Designed to be trusted." start={15} letterClass="hero-accent" />
          </span>
        </h1>

        <p className="hero-in mt-5 max-w-2xl text-balance text-lg text-white/80 [--i:2] sm:text-xl">
          AI front desks, websites, apps, and online stores. Built for you from
          the first sketch to the first sale.
        </p>

        <div className="hero-in mt-8 w-full [--i:3]">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5fd8e6]">
            What do you need?
          </h2>
          <StartTiles className="mt-4 lg:grid-cols-4" wide />
          <p className="mt-6 text-sm text-white/60">
            Got a question right now?{" "}
            <AskAvaLink className="font-semibold text-[#5fd8e6] underline-offset-4 transition hover:text-white hover:underline" />{" "}
            She&apos;s the same tech we build for you.
          </p>
        </div>
      </HeroReveal>
      </div>

      <Marquee />

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <SectionHeading eyebrow="How it works" title="From idea to built in three steps." />
        <DrawnSteps steps={STEPS} />
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
