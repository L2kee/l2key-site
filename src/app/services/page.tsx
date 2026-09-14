import type { Metadata } from "next";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/cta-band";
import { SERVICES, SKILLS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services — EVOGENCY",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-28 pb-20">
      <SectionHeading eyebrow="What we do" title="Services built to grow your business" />

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {SERVICES.map((s) => (
          <TiltCard key={s.title} className="glass h-full rounded-2xl p-6">
            <s.icon size={28} style={{ color: "#f0c14b" }} />
            <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/65">{s.body}</p>
          </TiltCard>
        ))}
      </div>

      <CtaBand text="Get a Free Proposal" />

      <div className="mt-16">
        <SectionHeading eyebrow="What we build with" title="The toolkit behind the work" />
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {SKILLS.map((s) => (
            <TiltCard key={s.title} className="glass h-full rounded-2xl p-6">
              <s.icon size={28} style={{ color: "#c9922c" }} />
              <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  );
}
