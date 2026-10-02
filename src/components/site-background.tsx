"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Fixed gold lotus backdrop behind every page (below the 3D shapes canvas).
    On the homepage it stays hidden while the hero lotus video is on screen,
    so the two lotuses never show at once, and fades in after scrolling past
    it. Positioning and the phone fade live in .site-bg in globals.css. */
export function SiteBackground() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [heroVisible, setHeroVisible] = useState(true);
  const [prevPath, setPrevPath] = useState(pathname);
  const [instant, setInstant] = useState(false);

  // Arriving on the homepage from another page lands at the top, so assume
  // the hero is on screen until the observer says otherwise, and switch
  // without the fade so the backdrop never lingers over the hero.
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setHeroVisible(true);
    setInstant(true);
  }

  useEffect(() => {
    if (!instant) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
    return () => cancelAnimationFrame(id);
  }, [instant]);

  useEffect(() => {
    if (!isHome) return;
    const hero = document.querySelector(".hero-video-box");
    if (!hero) {
      setHeroVisible(false);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting));
    observer.observe(hero);
    return () => observer.disconnect();
  }, [isHome]);

  const hidden = isHome && heroVisible;
  return (
    <div
      aria-hidden="true"
      className={`site-bg${hidden ? " is-hidden" : ""}${instant ? " no-fade" : ""}`}
    />
  );
}
