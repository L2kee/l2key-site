"use client";

import { useEffect, useRef, useState } from "react";

function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v));
}

function trapezoid(p: number, [a, b, c, d]: [number, number, number, number]) {
  if (p <= a || p >= d) return 0;
  if (p < b) return (p - a) / (b - a);
  if (p > c) return 1 - (p - c) / (d - c);
  return 1;
}

const STAGES = [
  { index: "01", kicker: "Build", title: "Websites", body: "Websites engineered to turn visitors into customers." },
  { index: "02", kicker: "Discover", title: "SEO", body: "Get discovered when customers are searching." },
  { index: "03", kicker: "Trust", title: "Reputation", body: "Turn happy customers into your strongest sales team." },
] as const;

// Faceted gem wireframe for BUILD — echoes the lotus's own faceted style.
const BUILD_LINES: [number, number, number, number][] = [
  [100, 30, 60, 60],
  [100, 30, 140, 60],
  [60, 60, 40, 110],
  [140, 60, 160, 110],
  [60, 60, 140, 60],
  [40, 110, 70, 150],
  [160, 110, 130, 150],
  [40, 110, 160, 110],
  [70, 150, 130, 150],
  [100, 30, 100, 150],
];

const BAND_BUILD: [number, number, number, number] = [0, 0.05, 0.3, 0.36];
const BAND_DISCOVER: [number, number, number, number] = [0.34, 0.39, 0.64, 0.7];
const BAND_TRUST: [number, number, number, number] = [0.68, 0.73, 1, 1];

export function ServicesJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const buildLineRefs = useRef<(SVGLineElement | null)[]>([]);
  const buildStageRef = useRef<HTMLDivElement>(null);
  const discoverStageRef = useRef<HTMLDivElement>(null);
  const discoverBeamRef = useRef<SVGLineElement>(null);
  const discoverTargetRef = useRef<SVGCircleElement>(null);
  const trustStageRef = useRef<HTMLDivElement>(null);
  const trustPointRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const trustGroupRef = useRef<HTMLDivElement>(null);

  const indicatorRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const bodyRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const section = sectionRef.current;
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const raw = scrollable > 0 ? -rect.top / scrollable : 0;
        const progress = clamp(raw, 0, 1);

        const buildOpacity = trapezoid(progress, BAND_BUILD);
        const discoverOpacity = trapezoid(progress, BAND_DISCOVER);
        const trustOpacity = clamp((progress - BAND_TRUST[0]) / (BAND_TRUST[1] - BAND_TRUST[0]), 0, 1);

        if (buildStageRef.current) buildStageRef.current.style.opacity = String(buildOpacity);
        if (discoverStageRef.current) discoverStageRef.current.style.opacity = String(discoverOpacity);
        if (trustStageRef.current) trustStageRef.current.style.opacity = String(trustOpacity);

        // Indicator row: gold + full opacity for the active stage, dim for the rest.
        const stageOpacities = [buildOpacity, discoverOpacity, trustOpacity];
        indicatorRefs.current.forEach((el, i) => {
          if (!el) return;
          const active = clamp(stageOpacities[i], 0, 1);
          el.style.opacity = String(0.35 + active * 0.65);
          el.style.color = active > 0.5 ? "#f0c14b" : "rgba(255,255,255,0.55)";
        });

        // BUILD: staggered per-line draw-in.
        const buildLocal = clamp((progress - BAND_BUILD[0]) / (BAND_BUILD[2] - BAND_BUILD[0]), 0, 1);
        buildLineRefs.current.forEach((line, i) => {
          if (!line) return;
          const len = line.getTotalLength ? line.getTotalLength() : 100;
          const segProgress = clamp((buildLocal - i * 0.055) / 0.5, 0, 1);
          line.style.strokeDasharray = `${len}`;
          line.style.strokeDashoffset = `${len * (1 - segProgress)}`;
        });

        // DISCOVER: searching sweep, then lock onto target.
        const discoverLocal = clamp((progress - BAND_DISCOVER[0]) / (BAND_DISCOVER[2] - BAND_DISCOVER[0]), 0, 1);
        const foundAngle = 28;
        let angle: number;
        if (discoverLocal < 0.7) {
          angle = Math.sin((discoverLocal / 0.7) * Math.PI * 2.2) * 48;
        } else {
          const lockT = (discoverLocal - 0.7) / 0.3;
          const sweepEnd = Math.sin(2.2 * Math.PI) * 48;
          angle = sweepEnd + (foundAngle - sweepEnd) * clamp(lockT, 0, 1);
        }
        if (discoverBeamRef.current) {
          discoverBeamRef.current.style.transform = `rotate(${angle}deg)`;
          discoverBeamRef.current.style.transformOrigin = "100px 100px";
        }
        if (discoverTargetRef.current) {
          const foundT = clamp((discoverLocal - 0.7) / 0.3, 0, 1);
          discoverTargetRef.current.style.opacity = String(0.15 + foundT * 0.85);
          discoverTargetRef.current.style.r = String(2.5 + foundT * 2.5);
        }

        // TRUST: five points stagger in around the lotus.
        const trustLocal = clamp((progress - BAND_TRUST[0]) / 0.06, 0, 1);
        trustPointRefs.current.forEach((pt, i) => {
          if (!pt) return;
          const p = clamp((trustLocal - i * 0.12) / 0.4, 0, 1);
          pt.style.opacity = String(p * 0.9);
          pt.style.transform = `scale(${0.4 + p * 0.6})`;
        });
        if (trustGroupRef.current) {
          trustGroupRef.current.style.animationPlayState = trustLocal >= 1 ? "running" : "paused";
        }

        titleRefs.current.forEach((el, i) => {
          if (el) el.style.opacity = String(stageOpacities[i]);
        });
        bodyRefs.current.forEach((el, i) => {
          if (el) el.style.opacity = String(stageOpacities[i]);
        });
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#f0c14b]">
          The EVOGENCY system
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {STAGES.map((s) => (
            <div key={s.index} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
              <span className="text-xs font-semibold tracking-[0.15em] text-[#f0c14b]">
                {s.index} — {s.kicker.toUpperCase()}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative bg-black" style={{ height: "320vh" }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div className="mb-10 flex items-center gap-6 text-xs font-semibold uppercase tracking-[0.2em] sm:gap-10 sm:text-sm">
          {STAGES.map((s, i) => (
            <span key={s.index} ref={(el) => { indicatorRefs.current[i] = el; }}>
              {s.index} {s.kicker}
            </span>
          ))}
        </div>

        <div className="services-journey-stage relative">
          {/* BUILD */}
          <div ref={buildStageRef} className="services-journey-layer">
            <svg viewBox="0 0 200 180" className="services-journey-visual" aria-hidden="true">
              {BUILD_LINES.map((l, i) => (
                <line
                  key={i}
                  ref={(el) => { buildLineRefs.current[i] = el; }}
                  x1={l[0]}
                  y1={l[1]}
                  x2={l[2]}
                  y2={l[3]}
                  stroke="#f0c14b"
                  strokeWidth={1.25}
                  strokeOpacity={0.75}
                />
              ))}
            </svg>
          </div>

          {/* DISCOVER */}
          <div ref={discoverStageRef} className="services-journey-layer">
            <svg viewBox="0 0 200 200" className="services-journey-visual" aria-hidden="true">
              <circle cx="100" cy="100" r="78" fill="none" stroke="#f0c14b" strokeOpacity="0.15" strokeWidth="1" />
              <line
                ref={discoverBeamRef}
                x1="100"
                y1="100"
                x2="100"
                y2="24"
                stroke="#f0c14b"
                strokeWidth="1.5"
                strokeOpacity="0.55"
              />
              <circle cx="100" cy="100" r="2" fill="#f0c14b" fillOpacity="0.4" />
              <circle
                ref={discoverTargetRef}
                cx={100 + 78 * Math.sin((28 * Math.PI) / 180)}
                cy={100 - 78 * Math.cos((28 * Math.PI) / 180)}
                r="2.5"
                fill="#f0c14b"
                opacity="0.15"
              />
            </svg>
          </div>

          {/* TRUST */}
          <div ref={trustStageRef} className="services-journey-layer">
            <div className="services-journey-lotus-wrap relative mx-auto">
              <div className="services-journey-lotus-viewport">
                <div className="services-journey-lotus-frame" />
              </div>
              <div ref={trustGroupRef} className="services-journey-points">
                {[0, 1, 2, 3, 4].map((i) => {
                  const angle = -90 + i * 72;
                  const rad = (angle * Math.PI) / 180;
                  const radius = 92;
                  return (
                    <span
                      key={i}
                      ref={(el) => { trustPointRefs.current[i] = el; }}
                      className="services-journey-point"
                      style={{
                        left: `calc(50% + ${radius * Math.cos(rad)}px)`,
                        top: `calc(50% + ${radius * Math.sin(rad)}px)`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-8 h-8">
          {STAGES.map((s, i) => (
            <h3
              key={s.index}
              ref={(el) => { titleRefs.current[i] = el; }}
              className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white sm:text-3xl"
              style={{ opacity: 0 }}
            >
              {s.title}
            </h3>
          ))}
        </div>
        <div className="relative mt-3 h-12 w-full max-w-md">
          {STAGES.map((s, i) => (
            <p
              key={s.index}
              ref={(el) => { bodyRefs.current[i] = el; }}
              className="absolute inset-0 flex items-center justify-center text-balance text-sm text-white/65 sm:text-base"
              style={{ opacity: 0 }}
            >
              {s.body}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
