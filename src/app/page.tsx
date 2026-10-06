import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { Marquee } from "@/components/marquee";
import { WorkCard } from "@/components/work-card";
import { ServicesJourney } from "@/components/services-journey";
import { HeroVideo } from "@/components/hero-video";
import { WORK } from "@/lib/content";

export default function Home() {
  return (
    <div id="top">
      <HeroVideo />

      {/* Hero */}
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-8 pb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Built to be found.
          <br />
          <span className="gradient-text">Designed to be trusted.</span>
        </h1>

        <p className="mt-6 text-balance text-xl font-semibold text-white sm:text-2xl">
          Your business deserves to be seen.
        </p>
        <p className="mt-3 max-w-2xl text-balance text-white/70 sm:text-lg">
          EVOGENCY builds the websites, search presence, and digital systems
          that turn attention into customers.
        </p>

        <div className="mt-10">
          <Link
            href="/contact"
            className="btn-solid !px-8 !py-4 text-base sm:text-lg"
          >
            Get Your Free Audit <ArrowRight size={18} />
          </Link>
        </div>
      </section>

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
        <TiltCard className="glass-strong rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Let&apos;s get your business found online
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/65">
            Free, no pressure audit of your current site and Google presence.
            We&apos;ll tell you exactly what&apos;s costing you customers.
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
