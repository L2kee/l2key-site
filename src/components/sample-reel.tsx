"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

export type Sample = { src: string; poster: string; trade: string; hook: string };

/** A row of finished sample videos with one active card at a time. The card
    in the middle is full strength and plays muted on a loop from the start,
    every other card is paused and dimmed to 10%. The arrows, the dots, a
    swipe, or a click on a dimmed card switch the active card. Tapping the
    active card toggles sound, and sound stays on for the next card once a
    visitor has asked for it. Only one video ever loads at a time (preload is
    none), and nothing plays while the row is off screen. With reduced motion
    nothing autoplays, and a tap plays the video with sound. */
export function SampleReel({ samples }: { samples: Sample[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  // The card that plays. It trails active until the row stops moving, so a
  // jump across several cards doesn't start and stop every one it passes.
  const [settled, setSettled] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  const [sound, setSound] = useState(false);

  // Active is whichever card sits nearest the middle. Measured on scroll, and
  // the playing video's timeupdate is the backstop, because WebKit doesn't
  // always report a sideways swipe inside the row.
  useEffect(() => {
    const row = scroller.current;
    if (!row) return;
    let frame = 0;
    let timer = 0;
    const update = () => {
      frame = 0;
      const mid = row.scrollLeft + row.clientWidth / 2;
      let best = 0;
      let bestGap = Infinity;
      cards.current.forEach((c, i) => {
        if (!c) return;
        const gap = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
        if (gap < bestGap) {
          bestGap = gap;
          best = i;
        }
      });
      setActive(best);
      clearTimeout(timer);
      timer = window.setTimeout(() => setSettled(best), 150);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    const vids = videos.current.filter((v): v is HTMLVideoElement => !!v);
    vids.forEach((v) => v.addEventListener("timeupdate", schedule));
    row.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      vids.forEach((v) => v.removeEventListener("timeupdate", schedule));
      row.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Up and down page scrolling only, which every browser reports reliably.
  useEffect(() => {
    const row = scroller.current;
    if (!row) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.5 });
    io.observe(row);
    return () => io.disconnect();
  }, []);

  // The settled card plays from the start, everything else stops.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i !== settled) {
        v.pause();
        v.muted = true;
        return;
      }
      v.muted = !sound;
      if (!onScreen) v.pause();
      else if (!reduced || sound) {
        v.currentTime = 0;
        v.play().catch(() => {});
      }
    });
    // Sound is left out on purpose. Toggling it mutes or unmutes the playing
    // video in place (toggleSound) instead of restarting it.
  }, [settled, onScreen]);

  function goTo(i: number) {
    const row = scroller.current;
    const card = cards.current[i];
    if (!row || !card) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollTo({
      left: card.offsetLeft - (row.clientWidth - card.offsetWidth) / 2,
      behavior: smooth ? "smooth" : "auto",
    });
  }

  function toggleSound() {
    const next = !sound;
    const v = videos.current[active];
    if (v) {
      v.muted = !next;
      if (next && v.paused) {
        if (v.ended) v.currentTime = 0;
        v.play().catch(() => {});
      }
    }
    setSound(next);
  }

  const arrow =
    "absolute top-[196px] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#5fd8e6]/60 bg-black/80 text-[#5fd8e6] transition hover:bg-[#5fd8e6] hover:text-black disabled:pointer-events-none disabled:opacity-0 sm:flex";
  // Empty space before the first card and after the last, so each end card can
  // reach the middle. Half the row less half a card (min(62vw, 220px)) less the gap.
  const spacer = "shrink-0 w-[calc(50%_-_min(31vw,110px)_-_1rem)]";

  return (
    // The arrows sit at half a desktop card's height (220px wide, 9:16).
    <div className="relative">
      <button
        type="button"
        onClick={() => goTo(active - 1)}
        disabled={active === 0}
        aria-label="Previous sample video"
        className={`${arrow} -left-3`}
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        onClick={() => goTo(active + 1)}
        disabled={active === samples.length - 1}
        aria-label="Next sample video"
        className={`${arrow} -right-3`}
      >
        <ChevronRight size={22} />
      </button>
      {/* contain inline-size keeps the five cards from widening the page on phones
          (an ancestor sizes to its content, so the row's full width leaked up). */}
      <div
        ref={scroller}
        className="relative -mx-6 overflow-x-auto [contain:inline-size] [scrollbar-width:none] sm:-mx-12 [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex snap-x snap-mandatory gap-4">
          <li aria-hidden className={spacer} />
          {samples.map((s, i) => (
            <li
              key={s.src}
              ref={(el) => {
                cards.current[i] = el;
              }}
              className={`w-[62vw] max-w-[220px] shrink-0 snap-center transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-10"}`}
            >
              <button
                type="button"
                onClick={() => (active === i ? toggleSound() : goTo(i))}
                aria-label={
                  active === i
                    ? `${sound ? "Mute" : "Play with sound"}, ${s.trade} sample video`
                    : `Show ${s.trade} sample video`
                }
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
                  {sound ? (
                    <>
                      <Volume2 size={14} className="text-[#5fd8e6]" /> Sound on
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
          <li aria-hidden className={spacer} />
        </ul>
      </div>
      <div className="mt-5 flex justify-center gap-1">
        {samples.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show ${s.trade} sample video`}
            aria-current={active === i}
            className="group flex h-6 items-center px-1"
          >
            <span
              className={`block h-2 rounded-full transition-all ${active === i ? "w-6 bg-[#5fd8e6]" : "w-2 bg-white/25 group-hover:bg-white/50"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
