import Link from "next/link";
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
import { SAMPLES } from "@/lib/job-site-studio";
import { WORK } from "@/lib/content";

export default function Home() {
  return (
    <div id="top">
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
            <DropLetters text="Designed to be trusted." start={15} letterClass="hero-gold" />
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
        </div>
      </HeroReveal>

      <ServicesJourney />

      <Marquee />

      {/* Brand design strip */}
      <section className="mx-auto max-w-3xl px-6 pt-16">
        <TiltCard className="glass-strong rounded-3xl p-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f0c14b]">
            Brand design and rebrands
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            Is your brand as premium as your work?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/65">
            Logos and complete identities for brands launching or repositioning,
            designed so your look matches your price.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/brand-design" className="btn-solid">
              Explore brand design <ArrowRight size={16} />
            </Link>
          </div>
        </TiltCard>
      </section>

      {/* Job Site Studio strip: the sample videos as an expanding panel
          gallery, with the service summed up underneath. */}
      <section className="mx-auto max-w-3xl px-6 pt-8">
        <TiltCard className="glass-strong rounded-3xl p-3 sm:p-6">
          {/* Three samples here, all five on the Job Site Studio page. */}
          <SamplePanels samples={SAMPLES.slice(0, 3)} />
          <div className="px-4 pt-8 pb-4 text-center sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f0c14b]">
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

      {/* Work preview */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <SectionHeading eyebrow="Proof, not promises" title="Featured work" />
        <div className="mt-10 flex flex-col gap-14 md:gap-8">
          {WORK.map((w) => (
            <WorkCard key={w.title} item={w} layout="split" />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/works" className="text-sm font-medium text-[#f0c14b] hover:underline">
            See all work →
          </Link>
        </div>
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
