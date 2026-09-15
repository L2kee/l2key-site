import Image from "next/image";
import { TiltCard } from "@/components/tilt-card";

const STAGES = [
  {
    index: "01",
    kicker: "Build",
    title: "Websites",
    body: "Websites engineered to turn visitors into customers.",
    image: "/services-build.png",
  },
  {
    index: "02",
    kicker: "Discover",
    title: "SEO",
    body: "Get discovered when customers are searching.",
    image: "/services-discover.png",
  },
  {
    index: "03",
    kicker: "Trust",
    title: "Reputation",
    body: "Turn happy customers into your strongest sales team.",
    image: "/services-trust.png",
  },
] as const;

export function ServicesJourney() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f0c14b]">
          The EVOGENCY system
        </div>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {STAGES.map((s) => (
          <TiltCard
            key={s.index}
            className="glass-strong flex h-full flex-col overflow-hidden rounded-2xl"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/10">
              <Image
                src={s.image}
                alt={`${s.title} — ${s.kicker}`}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            </div>

            <div className="flex flex-1 flex-col p-6 text-center sm:text-left">
              <span className="text-xs font-semibold tracking-[0.15em] text-[#f0c14b]">
                {s.index} {s.kicker.toUpperCase()}
              </span>
              <h3 className="mt-1 text-lg font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{s.body}</p>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
