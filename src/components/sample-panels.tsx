"use client";

import { useEffect, useRef, useState } from "react";
import type { Sample } from "@/components/sample-reel";

/** Expanding panel gallery of the Job Site Studio sample videos. Narrow strips
    sit side by side, and the one under the mouse (or the one tapped) widens
    and plays muted on a loop. Only the open panel ever loads or plays, and
    nothing plays while the row is off screen or under reduced motion. */
export function SamplePanels({ samples }: { samples: Sample[] }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const row = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.3,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && visible && !still) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [active, visible]);

  return (
    <div ref={row} className="flex h-72 gap-1.5 sm:h-[30rem] sm:justify-center sm:gap-2">
      {samples.map((s, i) => {
        const open = i === active;
        return (
          <button
            key={s.src}
            type="button"
            aria-label={`Show ${s.trade} sample video`}
            aria-pressed={open}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
            onClick={() => setActive(i)}
            onFocus={() => setActive(i)}
            className={`relative min-w-0 overflow-clip rounded-2xl border transition-[flex-basis,flex-grow,border-color] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              // The open panel is exactly 9:16 for the row height (h-72 is 288px,
              // h-[30rem] is 480px), so a vertical video shows uncropped. On desktop
              // the closed strips stay narrow so the open one stands out.
              open
                ? "shrink-0 grow-0 basis-[162px] border-[#5fd8e6]/50 sm:basis-[270px]"
                : "grow basis-0 border-white/10 sm:grow-0 sm:basis-24"
            }`}
          >
            <video
              ref={(el) => {
                videos.current[i] = el;
              }}
              src={s.src}
              poster={s.poster}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                open ? "opacity-100" : "opacity-45"
              }`}
            />
            <span
              className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pt-10 pb-3 text-left text-sm font-semibold whitespace-nowrap text-white transition-opacity duration-300 ${
                open ? "opacity-100 delay-200" : "opacity-0"
              }`}
            >
              {s.trade}
            </span>
          </button>
        );
      })}
    </div>
  );
}
