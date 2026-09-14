import type { Metadata } from "next";
import { Phone, CalendarClock, Mail, ExternalLink } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";

export const metadata: Metadata = {
  title: "Contact — EVOGENCY",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <TiltCard className="glass-strong rounded-3xl p-10 text-center">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Let&apos;s get your business found online
        </h1>
        <p className="mx-auto mt-3 max-w-md text-white/65">
          Free, no-pressure audit of your current site and Google presence —
          we&apos;ll tell you exactly what&apos;s costing you customers.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
          <a href="mailto:mohamed.eltoukhy011@gmail.com" className="btn-glass text-white">
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
