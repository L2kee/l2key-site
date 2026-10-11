"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export type Sample = { src: string; poster: string; trade: string; hook: string };

/** A swipeable row of finished sample videos. Whichever card is mostly on
    screen plays muted on a loop, the rest pause, so a phone never pulls all
    five at once (preload is none). Tapping a card turns its sound on and
    mutes the others. With reduced motion nothing autoplays, and a tap
    plays the video with sound. */
export function SampleReel({ samples }: { samples: Sample[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [soundOn, setSoundOn] = useState<number | null>(null);

  // Measured on scroll instead of an IntersectionObserver, because WebKit
  // never reported sideways scrolling inside the row to the observer.
  useEffect(() => {
    const row = scroller.current;
    if (!row) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = row.getBoundingClientRect();
      const top = Math.max(box.top, 0);
      const bottom = Math.min(box.bottom, window.innerHeight);
      videos.current.forEach((v) => {
        if (!v) return;
        const r = v.getBoundingClientRect();
        const w = Math.max(0, Math.min(r.right, box.right) - Math.max(r.left, box.left));
        const h = Math.max(0, Math.min(r.bottom, bottom) - Math.max(r.top, top));
        if ((w * h) / (r.width * r.height) >= 0.6) v.play().catch(() => {});
        else v.pause();
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    // timeupdate is the backstop: the playing video rechecks a few times a
    // second, so a swipe that WebKit didn't report still switches videos.
    const vids = videos.current.filter((v): v is HTMLVideoElement => !!v);
    vids.forEach((v) => v.addEventListener("timeupdate", schedule));
    row.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      vids.forEach((v) => v.removeEventListener("timeupdate", schedule));
      row.removeEventListener("scroll", schedule);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  function toggleSound(i: number) {
    const next = soundOn === i ? null : i;
    videos.current.forEach((v, j) => {
      if (!v) return;
      v.muted = j !== next;
    });
    const v = videos.current[i];
    if (next === i && v) {
      if (v.ended) v.currentTime = 0;
      v.play().catch(() => {});
    }
    setSoundOn(next);
  }

  return (
    // contain inline-size keeps the five cards from widening the page on phones
    // (an ancestor sizes to its content, so the row's full width leaked up).
    <div ref={scroller} className="-mx-6 overflow-x-auto px-6 pb-3 [contain:inline-size] [scrollbar-width:thin] sm:-mx-12 sm:px-12">
      <ul className="flex snap-x snap-mandatory gap-4">
        {samples.map((s, i) => (
          <li key={s.src} className="w-[62vw] max-w-[220px] shrink-0 snap-center">
            <button
              type="button"
              onClick={() => toggleSound(i)}
              aria-label={`${soundOn === i ? "Mute" : "Play with sound"}, ${s.trade} sample video`}
              className="relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-black"
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
                className="aspect-[9/16] w-full object-cover"
              />
              <span className="absolute right-2 bottom-2 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white">
                {soundOn === i ? (
                  <>
                    <Volume2 size={14} className="text-[#f0c14b]" /> Sound on
                  </>
                ) : (
                  <>
                    <VolumeX size={14} /> Tap for sound
                  </>
                )}
              </span>
            </button>
            <p className="mt-2 text-center text-sm font-semibold text-white">{s.trade}</p>
            <p className="text-center text-xs text-white/55">{s.hook}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
