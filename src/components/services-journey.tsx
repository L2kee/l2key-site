"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Phone } from "lucide-react";

type Stage = {
  kicker: string;
  title: string;
  body: string;
  ask: string;
  cta: string;
  href: string;
  image: string;
  imageAlt: string;
  /** The main service. Gets the running border, the Flagship and live
      badges, and a call link so the card itself is the demo. */
  flagship?: { tel: string; display: string };
};

const STAGES: Stage[] = [
  {
    kicker: "Answer",
    title: "AI Front Desk",
    body: "An AI receptionist that answers, books, and follows up, day and night.",
    ask: "How many calls did you miss last week while you were on a job?",
    cta: "Hear it answer",
    href: "/ai",
    image: "/services-front-desk.jpg",
    imageAlt: "Conceptual illustration of an empty front desk on a rainy evening, a desk phone streaming cyan light into three floating glass panels showing a phone handset, a calendar with one day booked, and a checkmark, representing an AI receptionist that answers and books calls around the clock",
    flagship: { tel: "tel:+13214354469", display: "(321) 435 4469" },
  },
  {
    kicker: "Build",
    title: "Websites",
    body: "Websites engineered to turn visitors into customers.",
    ask: "Is your website winning you customers, or sending them to a competitor?",
    cta: "Build my website",
    href: "/web-design-agency-orlando",
    image: "/services-websites.jpg",
    imageAlt: "Conceptual illustration of a laptop on a desk at dusk showing a modern house, with cyan light building floating glass website panels and a glowing button beside it, representing custom website design and development",
  },
  {
    kicker: "Brand",
    title: "Brand Design",
    body: "Brands that look as premium as the work behind them.",
    ask: "Does your brand look as good as the work you deliver?",
    cta: "Elevate my brand",
    href: "/brand-design",
    image: "/services-brand-identity.jpg",
    imageAlt: "Conceptual illustration of black business cards and a black shopping bag carrying a gold diamond emblem, with cyan light rising into a floating glass panel of the emblem and black, gold, cream, and cyan color swatches, representing luxury brand identity design",
  },
  {
    kicker: "Discover",
    title: "SEO",
    body: "Get discovered when customers are searching.",
    ask: "When customers search for what you do, do they find you first?",
    cta: "Get me found",
    href: "/seo-agency-orlando",
    image: "/services-seo.jpg",
    imageAlt: "Conceptual illustration of a hand holding a phone with a map on a small town main street at dusk, cyan light rising into a glowing map pin above the shops beside floating panels of review stars, a rising chart, and a magnifying glass, representing local search engine optimization",
  },
  {
    kicker: "Film",
    title: "Job Site Studio",
    body: "Raw clips from the job site, turned into finished videos for TikTok, Reels, Shorts, and Facebook.",
    ask: "Are your best jobs getting seen, or dying in your camera roll?",
    cta: "Try 3 free videos",
    href: "/job-site-studio",
    image: "/services-job-site-studio.jpg",
    imageAlt: "Conceptual illustration of a phone on a work truck dashboard at dusk, streaming cyan light into two floating vertical videos of a roofer laying shingles and a driveway being pressure washed, representing job site video editing for social media",
  },
];

// How long the mouse rests on a side card before it glides into the middle.
const DWELL_MS = 350;

/** Spotlight carousel. The five services sit in one row that swipes and
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
    "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#5fd8e6]/50 bg-black/70 text-white backdrop-blur transition hover:bg-black/90 sm:grid";
  const spacer =
    "shrink-0 w-[calc(50%_-_min(39vw,260px)_-_1rem)] sm:w-[calc(50%_-_min(39vw,260px)_-_1.5rem)]";

  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5fd8e6]">
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
                    className={`glass-strong relative flex h-full flex-col overflow-clip rounded-2xl transition-shadow duration-500 ${
                      s.flagship ? "flagship-ring" : ""
                    } ${
                      on
                        ? s.flagship
                          ? "shadow-[0_30px_90px_-20px_rgba(95,216,230,0.45)]"
                          : "shadow-[0_30px_80px_-24px_rgba(95,216,230,0.25)] ring-1 ring-[#5fd8e6]/30"
                        : "cursor-pointer"
                    }`}
                  >
                    <div className="relative aspect-[16/9] w-full overflow-clip border-b border-white/10">
                      <Image
                        src={s.image}
                        alt={s.imageAlt}
                        fill
                        sizes="(max-width: 640px) 78vw, 520px"
                        className={`journey-drift object-cover ${s.flagship ? "journey-drift-soft" : ""}`}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                      {s.flagship && (
                        <div className="pointer-events-none absolute left-4 top-4 flex flex-col items-start gap-2">
                          <span className="rounded-full border border-[#5fd8e6]/60 bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5fd8e6] backdrop-blur">
                            Flagship
                          </span>
                          <span className="flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur">
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full rounded-full bg-[#5fd8e6] opacity-75 motion-safe:animate-ping" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5fd8e6]" />
                            </span>
                            Live 24/7
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6 text-center sm:p-8 sm:text-left">
                      <span className="text-xs font-semibold tracking-[0.15em] text-[#5fd8e6]">
                        {s.kicker.toUpperCase()}
                      </span>
                      <h3 className="mt-1 text-xl font-bold text-white">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">{s.body}</p>
                      <p className="mt-5 text-base font-semibold leading-snug text-white">{s.ask}</p>
                      <div className="mt-auto flex flex-col items-center gap-3 pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
                        <Link href={s.href} tabIndex={on ? 0 : -1} className="btn-solid">
                          {s.cta} <ArrowRight size={16} />
                        </Link>
                        {s.flagship && (
                          <a
                            href={s.flagship.tel}
                            tabIndex={on ? 0 : -1}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#5fd8e6] transition hover:text-white"
                          >
                            <Phone size={15} /> Or call it now, {s.flagship.display}
                          </a>
                        )}
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
                  i === active ? "w-6 bg-[#5fd8e6]" : "w-2 bg-white/25 group-hover:bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
