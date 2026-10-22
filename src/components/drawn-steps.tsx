"use client";

import { useEffect, useRef, useState } from "react";
import { Caveat } from "next/font/google";

const hand = Caveat({ subsets: ["latin"], weight: ["600"], display: "swap" });

type Step = { title: string; body: string };

// How it works, drawn. When the list scrolls into view each card's title
// writes itself in ink, letter by letter (every letter's outline traces,
// then fills), one card after the other. While the pen finishes, the body
// copy seeps up out of the background word by word, dark to dim to full.
// Everything is fully visible until JS arms it, and reduced motion never
// arms it (.drawn-steps in globals.css).
export function DrawnSteps({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.add("is-armed");
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        el.classList.add("is-drawn");
        io.disconnect();
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ol ref={ref} className="drawn-steps mt-10 grid gap-4 sm:grid-cols-3">
      {steps.map((step, i) => {
        // Each card starts after the one before it finishes writing.
        const start = steps
          .slice(0, i)
          .reduce((t, s) => t + writeTime(s.title) + 250, 0);
        return (
          <li
            key={step.title}
            className="glass rounded-2xl p-6"
            style={{ "--start": `${start}ms`, "--write": `${writeTime(step.title)}ms` } as React.CSSProperties}
          >
            <span className="step-num flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#5fd8e6] to-[#1f9fb3] text-sm font-bold text-[#041016]">
              {i + 1}
            </span>
            <h3 className="mt-4">
              <InkTitle text={step.title} />
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              {step.body.split(" ").map((word, w) => (
                <span key={w} className="seep-word" style={{ "--w": w } as React.CSSProperties}>
                  {word}{" "}
                </span>
              ))}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

// 55ms per letter plus the last letter's own 700ms trace.
function writeTime(text: string) {
  return text.length * 55 + 700;
}

// The title as SVG text so each letter's outline can trace. The viewBox is
// fitted to the real text box once the font loads, so it scales down to fit
// a narrow card instead of wrapping.
function InkTitle({ text }: { text: string }) {
  const textRef = useRef<SVGTextElement>(null);
  const [box, setBox] = useState({ x: 0, y: 0, w: text.length * 14, h: 44 });

  useEffect(() => {
    let live = true;
    document.fonts.ready.then(() => {
      const b = textRef.current?.getBBox();
      if (live && b && b.width) setBox({ x: b.x - 3, y: b.y - 3, w: b.width + 6, h: b.height + 6 });
    });
    return () => {
      live = false;
    };
  }, []);

  return (
    <svg
      className={`ink-title ${hand.className}`}
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      style={{ width: box.w, maxWidth: "100%" }}
      role="img"
      aria-label={text}
    >
      <text ref={textRef} x="0" y="32" fontSize="34" style={{ whiteSpace: "pre" }}>
        {[...text].map((ch, i) => (
          <tspan key={i} style={{ "--l": i } as React.CSSProperties}>
            {ch}
          </tspan>
        ))}
      </text>
    </svg>
  );
}
