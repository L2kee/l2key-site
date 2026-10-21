"use client";

import { useEffect, useRef, useState } from "react";
import { Cormorant_Garamond } from "next/font/google";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500"], display: "swap" });

// Logo wall cycle (Motion Catalog). Six slots, and every few seconds one slot
// blurs out and comes back as a mark that isn't on the wall yet. Every mark
// here is concept work from our studio, never a client logo: JRW, Majestic,
// and Soluma are our unsolicited concept rebrands (see the Brand Design
// page), the rest are luxury brands we invented to show range. Real client logos (House of Manchester once signed) join later.
// Cycling pauses offscreen and in background tabs, and never runs under
// reduced motion.

type Mark = { name: string; note: string; svg: React.ReactNode; tight?: boolean };

const MARKS: Mark[] = [
  {
    name: "JRW",
    note: "Custom homes",
    svg: (
      <svg viewBox="0 0 120 170" aria-hidden="true">
        <path d="M6 166 V64 A54 54 0 0 1 114 64 V166" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M14 166 V66 A46 46 0 0 1 106 66 V166" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <line x1="0" y1="166" x2="120" y2="166" stroke="currentColor" strokeWidth="3" />
        <line x1="40" y1="138" x2="80" y2="138" stroke="currentColor" strokeWidth="1.2" />
        <text x="60" y="122" textAnchor="middle" fontSize="46" fill="currentColor" letterSpacing="1">JRW</text>
      </svg>
    ),
    tight: true,
  },
  {
    name: "Majestic",
    note: "Jewelers",
    svg: (
      <svg viewBox="0 0 120 100" aria-hidden="true">
        <g fill="currentColor">
          <polygon points="22.2,30 24.6,30 24.6,90 22.2,90" />
          <polygon points="22.2,30 31.4,30 62.6,85 60.6,90" />
          <polygon points="59.2,90 61.6,90 97,30 94.6,30" />
          <polygon points="92.4,30 100.6,30 100.6,90 92.4,90" />
          <rect x="15" y="29.2" width="16.4" height="1.5" />
          <rect x="15.5" y="88.6" width="16" height="1.5" />
          <rect x="92.4" y="29.2" width="14" height="1.5" />
          <rect x="85.5" y="88.6" width="21.5" height="1.5" />
        </g>
        <g fill="none" stroke="currentColor">
          <path d="M55.5 16 H64.5 L68.5 22 L60 37 L51.5 22 Z" strokeWidth="1.6" />
          <path d="M51.5 22 H68.5 M55.5 16 L58 22 L60 37 L62 22 L64.5 16" strokeWidth=".7" />
        </g>
      </svg>
    ),
  },
  {
    name: "Soluma",
    note: "Aesthetics",
    svg: (
      <svg viewBox="0 0 60 80" aria-hidden="true">
        <path d="M10 78 V32 A20 20 0 0 1 50 32 V78" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M19 56 A11 11 0 0 1 41 56 Z" fill="currentColor" />
        <line x1="10" y1="56" x2="50" y2="56" stroke="currentColor" strokeWidth="1.3" />
        <line x1="10" y1="78" x2="50" y2="78" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    name: "Aureline",
    note: "Fine fragrance",
    svg: (
      <svg viewBox="0 0 80 80" aria-hidden="true" fill="none" stroke="currentColor">
        <circle cx="40" cy="40" r="36" strokeWidth="1.2" />
        <circle cx="40" cy="40" r="31" strokeWidth=".6" />
        <path d="M40 16 C50 32 52 42 52 48 A12 12 0 0 1 28 48 C28 42 30 32 40 16 Z" strokeWidth="1.6" />
        <path d="M40 30 C45 39 46 44 46 48 A6 6 0 0 1 34 48" strokeWidth=".8" />
      </svg>
    ),
  },
  {
    name: "Noctis",
    note: "Supper club",
    svg: (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="M48 12 A28 28 0 1 0 64 58 A22 22 0 1 1 48 12 Z" fill="currentColor" />
        <circle cx="58" cy="22" r="1.6" fill="currentColor" />
        <circle cx="66" cy="34" r="1" fill="currentColor" />
        <line x1="8" y1="74" x2="72" y2="74" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    name: "Velmore",
    note: "Estates",
    svg: (
      <svg viewBox="0 0 90 80" aria-hidden="true" fill="none" stroke="currentColor">
        <path d="M8 76 V40 A16 16 0 0 1 40 40 V76" strokeWidth="1.6" />
        <path d="M50 76 V40 A16 16 0 0 1 82 40 V76" strokeWidth="1.6" />
        <path d="M24 30 V18 A21 21 0 0 1 66 18" strokeWidth=".8" />
        <path d="M41 4 H49 L47 12 H43 Z" fill="currentColor" stroke="none" />
        <line x1="2" y1="76" x2="88" y2="76" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    name: "Ossia",
    note: "Skin atelier",
    svg: (
      <svg viewBox="0 0 80 80" aria-hidden="true" fill="none" stroke="currentColor">
        <ellipse cx="40" cy="40" rx="18" ry="34" strokeWidth="1.4" />
        <ellipse cx="40" cy="40" rx="34" ry="18" strokeWidth="1.4" />
        <circle cx="40" cy="40" r="4" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "Halden & Rowe",
    note: "Tailors",
    svg: (
      <svg viewBox="0 0 90 80" aria-hidden="true">
        <rect x="4" y="4" width="82" height="72" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <rect x="9" y="9" width="72" height="62" fill="none" stroke="currentColor" strokeWidth=".5" />
        <text x="45" y="52" textAnchor="middle" fontSize="32" fill="currentColor" fontStyle="italic">
          H&amp;R
        </text>
      </svg>
    ),
  },
  {
    name: "Lumen Atelier",
    note: "Lighting design",
    svg: (
      <svg viewBox="0 0 80 80" aria-hidden="true" fill="none" stroke="currentColor">
        <path d="M40 14 L58 40 L40 66 L22 40 Z" strokeWidth="1.6" />
        <path d="M40 14 V66 M22 40 H58" strokeWidth=".6" />
        <path d="M40 2 V8 M40 72 V78 M10 40 H16 M64 40 H70 M18 18 L22 22 M62 18 L58 22 M18 62 L22 58 M62 62 L58 58" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    name: "Casa Serena",
    note: "Boutique hotel",
    svg: (
      <svg viewBox="0 0 80 80" aria-hidden="true" fill="none" stroke="currentColor">
        <path d="M10 76 V36 A30 30 0 0 1 70 36 V76" strokeWidth="1.6" />
        <circle cx="40" cy="44" r="10" fill="currentColor" stroke="none" />
        <path d="M14 60 Q22 54 30 60 T46 60 T62 60 T70 58" strokeWidth="1.3" />
        <path d="M14 68 Q22 62 30 68 T46 68 T62 68 T70 66" strokeWidth="1.3" />
        <line x1="4" y1="76" x2="76" y2="76" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    name: "Kestrel",
    note: "Motor works",
    svg: (
      <svg viewBox="0 0 100 70" aria-hidden="true" fill="none" stroke="currentColor" strokeLinejoin="miter">
        <path d="M4 20 L50 52 L96 20" strokeWidth="2.4" />
        <path d="M16 12 L50 36 L84 12" strokeWidth="1.2" />
        <path d="M44 62 H56" strokeWidth="1.6" />
      </svg>
    ),
  },
];

const SLOTS = 6;
const EVERY_MS = 2600;
const FADE_MS = 450;

export function LogoWall() {
  const [shown, setShown] = useState(() => MARKS.slice(0, SLOTS).map((_, i) => i));
  const [out, setOut] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    let last = -1;
    let swapTimer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (ref.current) io.observe(ref.current);

    const tick = setInterval(() => {
      if (!visible || document.hidden) return;
      let slot = Math.floor(Math.random() * SLOTS);
      if (slot === last) slot = (slot + 1) % SLOTS;
      last = slot;
      setOut(slot);
      swapTimer = setTimeout(() => {
        setShown((cur) => {
          const spare = MARKS.map((_, i) => i).filter((i) => !cur.includes(i));
          const next = [...cur];
          next[slot] = spare[Math.floor(Math.random() * spare.length)];
          return next;
        });
        setOut(null);
      }, FADE_MS);
    }, EVERY_MS);

    return () => {
      clearInterval(tick);
      clearTimeout(swapTimer);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={serif.className}>
      <div className="logo-wall grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-3">
        {shown.map((m, slot) => {
          const mark = MARKS[m];
          return (
            <div key={slot} className="logo-slot flex aspect-[5/3] items-center justify-center bg-[#050607] px-4">
              <div className={`logo-cell flex flex-col items-center gap-2.5 ${out === slot ? "is-out" : ""}`}>
                <div className={`logo-mark ${mark.tight ? "h-14" : "h-11"} text-[#e9e3d6] sm:h-14`}>{mark.svg}</div>
                <div className="text-center leading-none">
                  <p className="text-[15px] tracking-[0.28em] text-[#f3ede0] uppercase sm:text-base">{mark.name}</p>
                  <p className="mt-1.5 font-sans text-[10px] tracking-[0.2em] text-white/40 uppercase">{mark.note}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
