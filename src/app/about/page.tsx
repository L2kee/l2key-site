import type { Metadata } from "next";
import Image from "next/image";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "About — EVOGENCY",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <SectionHeading eyebrow="Who's behind it" title="Founder" />

      <div className="mt-12">
        <TiltCard className="glass-strong flex flex-col items-center gap-6 rounded-3xl p-10 text-center sm:flex-row sm:text-left">
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10 shadow-[0_20px_50px_-15px_rgba(240,193,75,0.5)]">
            <Image
              src="/moe-avatar.png"
              alt="Mohamed Eltoukhy"
              width={112}
              height={112}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Mohamed Eltoukhy</h3>
            <p className="text-sm font-medium text-[#f0c14b]">Founder, EVOGENCY</p>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              I build the websites, tools, and systems behind EVOGENCY myself —
              from full CRM platforms to the sites and SEO work we run for
              clients. Every project ships real, working software, not just
              a pitch deck.
            </p>
          </div>
        </TiltCard>
      </div>

      <CtaBand text="Work with us" />
    </div>
  );
}
