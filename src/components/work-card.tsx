import Image from "next/image";
import { ArrowUpRight, Smartphone, LayoutDashboard, Zap, Globe2 } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import { WorkCarousel } from "@/components/work-carousel";

const ICONS = { phone: Smartphone, dashboard: LayoutDashboard, bolt: Zap, globe: Globe2 };

export type WorkItem = {
  title: string;
  category: string;
  year: string;
  body: string;
  tag?: string;
  image?: string;
  images?: string[];
  fit?: string;
  icon: keyof typeof ICONS;
  stack: string[];
  links: { label: string; href: string }[];
};

export function WorkCard({ item }: { item: WorkItem }) {
  const Icon = ICONS[item.icon];
  return (
    <TiltCard className="glass-strong flex h-full flex-col overflow-hidden rounded-2xl">
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#f0c14b]/15 via-[#c9922c]/5 to-transparent">
        {item.images && item.images.length > 0 ? (
          <WorkCarousel images={item.images} alt={item.title} />
        ) : item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className={
              item.fit === "contain"
                ? "object-contain p-6"
                : "object-cover object-top opacity-85 saturate-[0.9]"
            }
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon size={64} strokeWidth={1.25} style={{ color: "#f0c14b" }} />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
        {item.tag && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-[#f0c14b]/30 bg-black/60 px-3 py-1 text-xs font-medium text-[#f0c14b] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f0c14b]" />
            {item.tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/45">
          <span>{item.category}</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>{item.year}</span>
        </div>

        <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60">{item.body}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.stack.map((s) => (
            <span
              key={s}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/55"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3 pt-2">
          {item.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass text-sm text-white"
            >
              {l.label} <ArrowUpRight size={15} />
            </a>
          ))}
        </div>
      </div>
    </TiltCard>
  );
}
