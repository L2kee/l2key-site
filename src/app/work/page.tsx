import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/cta-band";
import { WORK } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work — EVOGENCY",
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-28 pb-20">
      <SectionHeading eyebrow="Proof, not promises" title="Real tools, actually shipped" />

      <div className="mt-12 space-y-6">
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

      <CtaBand text="See what we can build for you" />
    </div>
  );
}
