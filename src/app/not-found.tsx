import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/cta-band";
import { SERVICES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page Not Found | EVOGENCY",
  description: "This page doesn't exist. Find what you're looking for on EVOGENCY's Orlando web design, SEO, and Google reviews services.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-28 pb-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f0c14b]/80">
        404
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        This page doesn&apos;t exist
      </h1>
      <p className="mx-auto mt-4 max-w-md text-white/65">
        The link may be broken or the page may have moved. Here&apos;s where
        people usually want to go instead.
      </p>

      <div className="mt-6">
        <Link
          href="/"
          className="text-sm font-medium text-[#f0c14b] hover:text-[#c9922c]"
        >
          Back to homepage
        </Link>
      </div>

      <div className="mt-16 text-left">
        <SectionHeading eyebrow="What we do" title="Or find what you need" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <TiltCard key={s.title} className="glass h-full rounded-2xl p-6">
              <s.icon size={28} style={{ color: "#f0c14b" }} />
              <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{s.body}</p>
              {s.href && (
                <Link
                  href={s.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#f0c14b] hover:text-[#c9922c]"
                >
                  Learn more <ArrowRight size={14} />
                </Link>
              )}
            </TiltCard>
          ))}
        </div>
      </div>

      <CtaBand text="Get a Free Audit" />
    </div>
  );
}
