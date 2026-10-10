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
  imageAlt?: string;
  images?: string[];
  imageAlts?: string[];
  imagePosition?: "top" | "left-top";
  fit?: string;
  /** Full length capture of the page, scrolled top to bottom inside the
      frame on hover (desktop) or with the page scroll (touch). */
  fullPage?: { src: string; width: number; height: number; alt: string };
  icon: keyof typeof ICONS;
  stack: string[];
  links: { label: string; href: string }[];
};

function WorkMedia({ item }: { item: WorkItem }) {
  const Icon = ICONS[item.icon];
  return (
    <>
      {item.images && item.images.length > 0 ? (
        <WorkCarousel
          images={item.images}
          alt={item.title}
          alts={item.imageAlts}
          objectPosition={item.imagePosition}
        />
      ) : item.image ? (
        <Image
          src={item.image}
          alt={item.imageAlt ?? item.title}
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
      {item.fullPage && (
        // Sits over the carousel, see .work-scroll-* in globals.css. The
        // scroll time grows with the page length.
        <div
          className="work-scroll-frame"
          style={{ "--scroll-dur": `${((item.fullPage.height / item.fullPage.width) * 2.2).toFixed(1)}s` } as React.CSSProperties}
        >
          <Image
            src={item.fullPage.src}
            alt={item.fullPage.alt}
            width={item.fullPage.width}
            height={item.fullPage.height}
            sizes="(max-width: 768px) 100vw, 52vw"
            className="work-scroll-img"
          />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
      {item.tag && (
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-[#f0c14b]/30 bg-black/60 px-3 py-1 text-xs font-medium text-[#f0c14b] backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f0c14b]" />
          {item.tag}
        </span>
      )}
    </>
  );
}

function WorkDetails({ item }: { item: WorkItem }) {
  return (
    <>
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

      {item.links.length > 0 && (
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
      )}
    </>
  );
}

const MEDIA_BG =
  "relative overflow-clip bg-gradient-to-br from-[#f0c14b]/15 via-[#c9922c]/5 to-transparent";

/** "stacked" is the tilting image over details grid card (Works page).
    "split" (homepage) is two separate glass cards, image and details, each
    tilting on its own: side by side from md up, stacked on phones. */
export function WorkCard({
  item,
  layout = "stacked",
}: {
  item: WorkItem;
  layout?: "stacked" | "split";
}) {
  if (layout === "split") {
    return (
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        {/* work-in-*: the pair slides in from opposite sides on scroll. */}
        <div className="work-in work-in-media md:w-[52%] md:shrink-0">
          <TiltCard className={`glass-strong aspect-[16/10] w-full rounded-2xl ${MEDIA_BG}`}>
            <WorkMedia item={item} />
          </TiltCard>
        </div>
        <div className="work-in work-in-details flex-1">
          <TiltCard className="glass-strong rounded-2xl p-6 md:p-8">
            <WorkDetails item={item} />
          </TiltCard>
        </div>
      </div>
    );
  }

  return (
    <TiltCard className="glass-strong flex h-full flex-col overflow-clip rounded-2xl">
      <div className={`aspect-[16/10] w-full border-b border-white/10 ${MEDIA_BG}`}>
        <WorkMedia item={item} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <WorkDetails item={item} />
      </div>
    </TiltCard>
  );
}
