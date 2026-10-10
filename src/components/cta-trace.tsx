"use client";

import { useEffect, useRef } from "react";

/** A thin gold line that draws once around its card when the card scrolls
    into view, then settles as a faint gold border. Drop it inside a
    relative, rounded parent and pass the parent's corner radius. Without
    JS the line just never draws (see .cta-trace in globals.css). */
export function CtaTrace({ radius = 24 }: { radius?: number }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        el.classList.add("is-drawn");
        io.disconnect();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg ref={ref} className="cta-trace" aria-hidden="true">
      {/* The svg sits 1px out, on the card's own border; the 1.5px stroke
          is centered 0.75px in so it stays inside the rounded corner. */}
      <rect x="0.75" y="0.75" rx={radius - 0.75} ry={radius - 0.75} pathLength={1} />
    </svg>
  );
}
