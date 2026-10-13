"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const STAGES = [
  {
    kicker: "Build",
    title: "Websites",
    body: "Websites engineered to turn visitors into customers.",
    ask: "Is your website winning you customers, or sending them to a competitor?",
    cta: "Build my website",
    href: "/web-design-agency-orlando",
    image: "/services-build.png",
    imageAlt: "Conceptual illustration of a glass building framework under a crane, representing custom website design and development",
  },
  {
    kicker: "Brand",
    title: "Brand Design",
    body: "Brands that look as premium as the work behind them.",
    ask: "Does your brand look as good as the work you deliver?",
    cta: "Elevate my brand",
    href: "/brand-design",
    image: "/services-brand.jpg",
    imageAlt: "Conceptual illustration of three gold edged glass panels on a black pedestal showing an abstract gold emblem, a black gold and cream color palette, and a gold monogram curve, representing luxury brand identity design",
  },
  {
    kicker: "Discover",
    title: "SEO",
    body: "Get discovered when customers are searching.",
    ask: "When customers search for what you do, do they find you first?",
    cta: "Get me found",
    href: "/seo-agency-orlando",
    image: "/services-discover.png",
    imageAlt: "Conceptual illustration of a glowing globe and search bar surrounded by local search suggestions and rising traffic graphics, representing search engine optimization",
  },
] as const;

// How long the mouse rests on a side card before it glides into the middle.
const DWELL_MS = 350;

/** Spotlight carousel. The three services sit in one row that swipes and
    snaps. The card in the middle is full size and asks the visitor if it's
    the service they need. The cards beside it lean back, shrink, and dim.
    With a mouse, resting on a side card glides it into the spotlight, and
    the arrows and dots work too. A click on a side card centers it instead
    of following its link. */
export function ServicesJourney() {
  const row = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const dwell = useRef(0);
  // Where the mouse sat when a card last glided in. A card sliding under a
  // still mouse must not glide again on its own, so hovering waits until the
  // mouse has actually moved away from this spot.
  const parked = useRef<{ x: number; y: number } | null>(null);
  const [active, setActive] = useState(0);

  // Each card's lean, size, and fade come from its distance to the middle of
  // the row, written straight to the style on scroll so it tracks a swipe.
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const update = () => {
      frame = 0;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestGap = Infinity;
      cards.current.forEach((c, i) => {
        if (!c) return;
        const gap = c.offsetLeft + c.offsetWidth / 2 - mid;
        if (Math.abs(gap) < bestGap) {
          bestGap = Math.abs(gap);
          best = i;
        }
        const d = Math.max(-1, Math.min(1, gap / c.offsetWidth));
        const inner = c.firstElementChild as HTMLElement | null;
        if (!inner) return;
        inner.style.transform = still
          ? ""
          : `perspective(1200px) rotateY(${d * -14}deg) scale(${1 - Math.abs(d) * 0.14})`;
        inner.style.opacity = String(1 - Math.abs(d) * 0.55);
      });
      setActive(best);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    el.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const goTo = (i: number) => {
    const el = row.current;
    const c = cards.current[i];
    if (!el || !c) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({
      left: c.offsetLeft + c.offsetWidth / 2 - el.clientWidth / 2,
      behavior: still ? "auto" : "smooth",
    });
  };

  const rest = (i: number, e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const p = parked.current;
    if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) < 24) return;
    parked.current = null;
    clearTimeout(dwell.current);
    if (i === active) return;
    const at = { x: e.clientX, y: e.clientY };
    dwell.current = window.setTimeout(() => {
      parked.current = at;
      goTo(i);
    }, DWELL_MS);
  };
  useEffect(() => () => clearTimeout(dwell.current), []);

  const arrow =
    "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#f0c14b]/50 bg-black/70 text-white backdrop-blur transition hover:bg-black/90 sm:grid";
  const spacer =
    "shrink-0 w-[calc(50%_-_min(39vw,260px)_-_1rem)] sm:w-[calc(50%_-_min(39vw,260px)_-_1.5rem)]";

  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f0c14b]">
          The EVOGENCY system
        </h2>
      </div>

      <div className="relative mt-14">
        {active > 0 && (
          <button
            type="button"
            aria-label="Previous service"
            onClick={() => goTo(active - 1)}
            className={`${arrow} left-0`}
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {active < STAGES.length - 1 && (
          <button
            type="button"
            aria-label="Next service"
            onClick={() => goTo(active + 1)}
            className={`${arrow} right-0`}
          >
            <ChevronRight size={20} />
          </button>
        )}

        <div
          ref={row}
          className="relative -mx-6 overflow-x-auto [contain:inline-size] sm:[mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex snap-x snap-mandatory gap-4 py-4 sm:gap-6">
            <li aria-hidden className={spacer} />
            {STAGES.map((s, i) => {
              const on = i === active;
              return (
                <li
                  key={s.kicker}
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  className="w-[78vw] max-w-[520px] shrink-0 snap-center"
                  onPointerMove={(e) => rest(i, e)}
                  onPointerLeave={() => clearTimeout(dwell.current)}
                  onClickCapture={(e) => {
                    if (!on) {
                      e.preventDefault();
                      e.stopPropagation();
                      goTo(i);
                    }
                  }}
                >
                  <article
                    className={`glass-strong flex h-full flex-col overflow-clip rounded-2xl transition-shadow duration-500 ${
                      on ? "shadow-[0_30px_80px_-24px_rgba(240,193,75,0.25)] ring-1 ring-[#f0c14b]/30" : "cursor-pointer"
                    }`}
                  >
                    <div className="relative aspect-[16/9] w-full overflow-clip border-b border-white/10">
                      <Image
                        src={s.image}
                        alt={s.imageAlt}
                        fill
                        sizes="(max-width: 640px) 78vw, 520px"
                        className="journey-drift object-cover"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                    </div>

                    <div className="flex flex-1 flex-col p-6 text-center sm:p-8 sm:text-left">
                      <span className="text-xs font-semibold tracking-[0.15em] text-[#f0c14b]">
                        {s.kicker.toUpperCase()}
                      </span>
                      <h3 className="mt-1 text-xl font-bold text-white">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">{s.body}</p>
                      <p className="mt-5 text-base font-semibold leading-snug text-white">{s.ask}</p>
                      <div className="mt-auto flex justify-center pt-5 sm:justify-start">
                        <Link href={s.href} tabIndex={on ? 0 : -1} className="btn-solid">
                          {s.cta} <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
            <li aria-hidden className={spacer} />
          </ul>
        </div>

        <div className="mt-6 flex justify-center gap-1">
          {STAGES.map((s, i) => (
            <button
              key={s.kicker}
              type="button"
              aria-label={`Show ${s.title}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className="group flex h-6 items-center px-1"
            >
              <span
                className={`block h-2 rounded-full transition-all ${
                  i === active ? "w-6 bg-[#f0c14b]" : "w-2 bg-white/25 group-hover:bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
