import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import { StatPills } from "@/components/stat-pills";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/cta-band";
import { SERVICES, WORK } from "@/lib/content";

export default function Home() {
  return (
    <div id="top">
      {/* Hero */}
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-20 pb-16 text-center sm:pt-28">
        <div className="glass-strong flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-white/80">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f0c14b]" />
          Available for new projects
        </div>

        <div className="mt-8 h-28 w-28 overflow-hidden rounded-full shadow-[0_20px_60px_-15px_rgba(240,193,75,0.55)] sm:h-32 sm:w-32">
          <Image
            src="/evogency-logo.png"
            alt="EVOGENCY"
            width={128}
            height={128}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <h1 className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Built to be found.
          <br />
          <span className="gradient-text">Designed to be trusted.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-white/70 sm:text-lg">
          We help local businesses build a real online presence: professional
          websites, stronger Google reviews, and SEO that actually gets
          found — so more of the right people walk through the door.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/contact" className="btn-solid">
            Get a free site audit <ArrowRight size={16} />
          </Link>
          <Link href="/work" className="btn-glass text-white">
            See our work
          </Link>
        </div>

        <StatPills />
      </section>

      {/* Services preview — horizontal scroll strip */}
      <section className="py-16">
        <SectionHeading eyebrow="What we do" title="Services built to grow your business" />
        <div className="mt-10 flex gap-5 overflow-x-auto px-6 pb-4 sm:justify-center [scrollbar-width:thin]">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="glass w-72 shrink-0 rounded-2xl p-6 sm:w-80"
            >
              <s.icon size={28} style={{ color: "#f0c14b" }} />
              <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{s.body}</p>
            </div>
          ))}
        </div>
        <CtaBand text="Get a Free Proposal" />
      </section>

      {/* Work preview */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <SectionHeading eyebrow="Proof, not promises" title="Featured work" />
        <div className="mt-10 space-y-6">
          {WORK.map((w) => (
            <TiltCard key={w.title} className="glass-strong rounded-2xl p-8">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-xl font-semibold text-white">{w.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">{w.body}</p>
                </div>
                <a
                  href={w.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass shrink-0 text-white"
                >
                  {w.linkLabel} <ArrowRight size={16} />
                </a>
              </div>
            </TiltCard>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/work" className="text-sm font-medium text-[#f0c14b] hover:underline">
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
            Free, no-pressure audit of your current site and Google presence —
            we&apos;ll tell you exactly what&apos;s costing you customers.
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
