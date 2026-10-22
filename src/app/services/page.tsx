import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/cta-band";
import { ServicesJourney } from "@/components/services-journey";
import { SERVICES } from "@/lib/content";

const TITLE = "AI Front Desk, Website and SEO Services | EVOGENCY Orlando";
const DESCRIPTION =
  "AI front desks that answer every call and book the job, plus websites that convert and SEO that gets found. Built for local businesses in Orlando, FL.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/services",
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

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-28 pb-20">
      <SectionHeading as="h1" eyebrow="What we do" title="Services built to grow your business" />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <TiltCard key={s.title} className="glass h-full rounded-2xl p-6">
            <s.icon size={28} style={{ color: "#5fd8e6" }} />
            <h2 className="mt-4 text-lg font-semibold text-white">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/65">{s.body}</p>
            {s.href && (
              <Link
                href={s.href}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#5fd8e6] hover:text-[#1f9fb3]"
              >
                Learn more <ArrowRight size={14} />
              </Link>
            )}
          </TiltCard>
        ))}
      </div>

      <div className="-mx-6">
        <ServicesJourney />
      </div>

      <CtaBand text="Tell Us What You Need" href="/start" />
    </div>
  );
}
