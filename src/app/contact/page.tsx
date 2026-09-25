import type { Metadata } from "next";
import { Phone, CalendarClock, Mail, ExternalLink } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import { AuditRequestForm } from "@/components/audit-request-form";

const TITLE = "Contact EVOGENCY | Free Website & SEO Audit, Orlando FL";
const DESCRIPTION =
  "Get a free audit of your website and Google presence. Call, email, or book a time with EVOGENCY, based in Orlando, FL and remote friendly.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/contact",
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

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 pt-28 pb-20">
      <div className="glass-strong rounded-3xl p-6 sm:p-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Let&apos;s get your business found online
          </h1>
          <p className="mx-auto mt-3 max-w-md text-white/65">
            Free, no pressure audit of your current site and Google presence.
            We&apos;ll tell you exactly what&apos;s costing you customers.
          </p>
          <h2 className="mt-8 text-lg font-semibold text-[#f0c14b]">Request your free audit</h2>
        </div>
        <div className="mt-6">
          <AuditRequestForm />
        </div>
      </div>

      <TiltCard className="glass-strong rounded-3xl p-10 text-center">
        <h2 className="text-lg font-semibold text-white">Rather talk now?</h2>
        <p className="mx-auto mt-2 max-w-md text-white/65">
          Call, book a time, or send us an email. Whatever works for you.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <a href="tel:+18138971954" className="btn-solid">
            <Phone size={16} /> Call (813) 897-1954
          </a>
          <a
            href="https://calendly.com/mohamed-eltoukhy011/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glass text-white"
          >
            <CalendarClock size={16} /> Book a call
          </a>
          <a href="mailto:hello@evogencyglobal.com" className="btn-glass text-white">
            <Mail size={16} /> Email us
          </a>
          <a
            href="https://github.com/L2kee"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glass text-white"
          >
            <ExternalLink size={16} /> GitHub
          </a>
        </div>
      </TiltCard>
    </div>
  );
}
