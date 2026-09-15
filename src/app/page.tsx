import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import { StatPills } from "@/components/stat-pills";
import { SectionHeading } from "@/components/section-heading";
import { Marquee } from "@/components/marquee";
import { WorkCard } from "@/components/work-card";
import { EvolveJourney } from "@/components/evolve-journey";
import { ServicesJourney } from "@/components/services-journey";
import { WORK } from "@/lib/content";

export default function Home() {
  return (
    <div id="top">
      {/* Hero */}
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-20 pb-16 text-center sm:pt-28">
        <div className="glass-strong flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-white/80">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f0c14b]" />
          Available for new projects
        </div>

        <div className="logo-bloom-wrap relative mt-8">
          <div className="absolute inset-0 rounded-full bg-[#f0c14b]/20 blur-3xl" />
          <div role="img" aria-label="EVOGENCY" className="logo-bloom-viewport">
            <div className="logo-bloom-sprite" />
          </div>
        </div>

        <h1 className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-6xl">
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

        <StatPills />
      </section>

      <EvolveJourney />

      <ServicesJourney />

      <Marquee />

      {/* Work preview */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <SectionHeading eyebrow="Proof, not promises" title="Featured work" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {WORK.slice(0, 2).map((w) => (
            <WorkCard key={w.title} item={w} />
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
