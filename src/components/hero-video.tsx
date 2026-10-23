"use client";

import { useEffect, useRef } from "react";
import { preload } from "react-dom";

const SRC = "/hero-lotus.mp4";
const POSTER = "/hero-lotus-poster.webp";

/** Silent looping lotus video at the top of the homepage. The file has no
    audio track, 120px of black headroom so the flower tip clears the navbar,
    and a crossfaded loop. The frame is never cropped top or bottom (the
    flower fills nearly the whole frame at the end of the push in); see
    .hero-video-* in globals.css. Reduced motion users get the still poster.

    The poster is the homepage's largest paint on phones, so it is preloaded
    at high priority, and the 2.5 MB video only gets its src after hydration
    instead of competing with the poster and fonts during first load. */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  preload(POSTER, { as: "image", fetchPriority: "high" });

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (motionMq.matches) {
        video.pause();
        return;
      }
      if (!video.getAttribute("src")) video.src = SRC;
      video.play().catch(() => {});
    };
    apply();
    motionMq.addEventListener("change", apply);
    return () => motionMq.removeEventListener("change", apply);
  }, []);

  return (
    <div className="hero-video-outer">
      <div className="hero-video-box">
        <video
          ref={ref}
          poster={POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
