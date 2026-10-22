"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

// Remounts its children so a play once animation (letter drop, drawn check)
// runs again on demand.
export function Replay({ children }: { children: React.ReactNode }) {
  const [run, setRun] = useState(0);
  return (
    <div className="flex flex-col items-center gap-4">
      <div key={run}>{children}</div>
      <button
        type="button"
        onClick={() => setRun((r) => r + 1)}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/60 transition hover:border-[#5fd8e6]/50 hover:text-white"
      >
        <RotateCcw size={13} /> Play again
      </button>
    </div>
  );
}

// A muted looping clip that only downloads and plays once it scrolls near
// the screen, and pauses when it leaves, so the page stays light.
export function LazyVideo({ src, poster, label, tall = false }: { src: string; poster: string; label: string; tall?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!v.src) v.src = src;
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);
  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className={`w-full rounded-xl border border-white/10 bg-black object-cover ${tall ? "mx-auto aspect-[390/844] max-h-[420px] w-auto" : "aspect-[16/10]"}`}
    />
  );
}
