import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/cta-band";
import { SERVICES } from "@/lib/content";

const TITLE = "Web Design, SEO & Reputation Services | EVOGENCY Orlando";
const DESCRIPTION =
  "Websites that convert, SEO that gets found, and Google review systems that turn happy customers into new business. Built for local businesses in Orlando, FL.";

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

      <CtaBand text="Get a Free Proposal" />
    </div>
  );
}
