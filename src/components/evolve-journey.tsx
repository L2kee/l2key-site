"use client";

import { useEffect, useRef, useState } from "react";
import { setSceneCovered } from "@/lib/scene-covered";

const TOTAL_FRAMES = 24;
const MOBILE = { w: 155, h: 155 };
const SM = { w: 193, h: 193 };

function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v));
}

/** 0 -> fade in -> 1 (hold) -> fade out -> 0, across [a,b,c,d] of progress. */
function trapezoid(p: number, [a, b, c, d]: [number, number, number, number]) {
  if (p <= a || p >= d) return 0;
  if (p < b) return (p - a) / (b - a);
  if (p > c) return 1 - (p - c) / (d - c);
  return 1;
}

export function EvolveJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lotusFrameRef = useRef<HTMLDivElement>(null);
  const lotusScaleRef = useRef<HTMLDivElement>(null);
  const evolveRef = useRef<HTMLSpanElement>(null);
  const elevateRef = useRef<HTMLSpanElement>(null);
  const growRef = useRef<HTMLSpanElement>(null);
  const payoffRef = useRef<HTMLParagraphElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionMq.matches);
    const onMotionChange = () => setReducedMotion(motionMq.matches);
    motionMq.addEventListener("change", onMotionChange);
    return () => motionMq.removeEventListener("change", onMotionChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const smMq = window.matchMedia("(min-width: 640px)");
    const mobileMq = window.matchMedia("(max-width: 640px)");
    let dims = smMq.matches ? SM : MOBILE;
    let maxScale = mobileMq.matches ? 1.08 : 1.18;

    const onMqChange = () => {
      dims = smMq.matches ? SM : MOBILE;
      maxScale = mobileMq.matches ? 1.08 : 1.18;
    };
    smMq.addEventListener("change", onMqChange);
    mobileMq.addEventListener("change", onMqChange);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const section = sectionRef.current;
        if (!section) return;

        const rect = section.getBoundingClientRect();
        setSceneCovered(rect.top <= 0 && rect.bottom >= window.innerHeight);
        const scrollable = section.offsetHeight - window.innerHeight;
        // On phones, start while the section is still sliding in (its top
        // 35% of a screen from the top, when the lotus is already in view)
        // instead of waiting for the pin, so there's no still stretch of a
        // closed bud on black. The end point is unchanged.
        const lead = mobileMq.matches ? window.innerHeight * 0.35 : 0;
        const raw = scrollable + lead > 0 ? (lead - rect.top) / (scrollable + lead) : 0;
        const progress = clamp(raw, 0, 1);

        // Lotus bloom completes by the end of the GROW band, then holds.
        const bloomProgress = clamp(progress / 0.66, 0, 1);
        const frame = Math.round(bloomProgress * (TOTAL_FRAMES - 1));
        if (lotusFrameRef.current) {
          lotusFrameRef.current.style.transform = `translateX(-${frame * dims.w}px)`;
        }

        // "Camera moves closer": a one-way scale ramp during ELEVATE, then
        // holds — the viewer keeps moving deeper, never pulls back out.
        const scaleProgress = clamp((progress - 0.22) / (0.44 - 0.22), 0, 1);
        const scale = 1 + scaleProgress * (maxScale - 1);
        if (lotusScaleRef.current) {
          lotusScaleRef.current.style.transform = `scale(${scale})`;
        }

        if (evolveRef.current) {
          evolveRef.current.style.opacity = String(trapezoid(progress, [0, 0.04, 0.18, 0.22]));
        }
        if (elevateRef.current) {
          elevateRef.current.style.opacity = String(trapezoid(progress, [0.22, 0.26, 0.4, 0.44]));
        }
        if (growRef.current) {
          growRef.current.style.opacity = String(trapezoid(progress, [0.44, 0.48, 0.62, 0.66]));
        }
        if (payoffRef.current) {
          const p = clamp((progress - 0.66) / (0.72 - 0.66), 0, 1);
          payoffRef.current.style.opacity = String(p);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      setSceneCovered(false);
      smMq.removeEventListener("change", onMqChange);
      mobileMq.removeEventListener("change", onMqChange);
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="evolve-journey-static bg-black px-6 py-24 text-center">
        <div className="evolve-journey-lotus-wrap relative mx-auto">
          <div className="evolve-journey-lotus-viewport">
            <div
              className="evolve-journey-lotus-frame"
              style={{ transform: `translateX(-${23 * SM.w}px)` }}
            />
          </div>
        </div>
        <p className="mt-8 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Evolve. Elevate. Grow.
        </p>
        <p className="mt-4 text-sm font-medium uppercase tracking-[0.3em] text-[#f0c14b]">
          That&apos;s EVOGENCY.
        </p>
      </section>
    );
  }

  return (
    // Shorter on phones (2.5 screens instead of 4) so the moment doesn't
    // drag under a thumb. svh units ignore Safari's collapsing toolbar, so
    // the section isn't re-laid out mid-scroll when the address bar hides.
    <section ref={sectionRef} className="evolve-journey relative h-[250svh] bg-black sm:h-[400vh]">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div ref={lotusScaleRef} className="evolve-journey-lotus-wrap relative mx-auto">
          <div className="evolve-journey-lotus-viewport">
            <div ref={lotusFrameRef} className="evolve-journey-lotus-frame" />
          </div>
        </div>

        <div className="evolve-journey-word-stage relative mt-10">
          <span ref={evolveRef} className="evolve-journey-word">
            Evolve.
          </span>
          <span ref={elevateRef} className="evolve-journey-word">
            Elevate.
          </span>
          <span ref={growRef} className="evolve-journey-word">
            Grow.
          </span>
        </div>

        <p ref={payoffRef} className="evolve-journey-payoff mt-8">
          That&apos;s EVOGENCY.
        </p>
      </div>
    </section>
  );
}
