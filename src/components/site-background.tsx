"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Orlando service landing pages share one backdrop. */
const SERVICE_PAGES = new Set([
  "/seo-agency-orlando",
  "/web-design-agency-orlando",
  "/google-reviews-orlando",
  "/ai-automation-orlando",
  "/custom-crm-development-orlando",
  "/mobile-app-development-orlando",
  "/generative-engine-optimization-orlando",
]);

/** Which lotus render sits behind a route. Anything unlisted (the blog,
    funnels, Growth Kit, 404) keeps the original site-bg.jpg. Images and per-key
    positioning live in the .site-bg-layer--* rules in globals.css. */
function backgroundFor(pathname: string) {
  if (pathname === "/") return "home";
  if (pathname === "/services") return "craft";
  if (pathname === "/works") return "work";
  if (pathname === "/about") return "about";
  if (pathname === "/contact") return "contact";
  if (pathname === "/brand-design") return "brand";
  if (SERVICE_PAGES.has(pathname)) return "services";
  return "default";
}

/** Fixed lotus backdrop behind every page (below the 3D shapes canvas), a
    different render per section that crossfades on navigation. Only layers
    that have been visited are mounted, so a visitor downloads just the
    images for the pages they open. On the homepage it stays hidden while
    the hero lotus video is on screen, so the two lotuses never show at
    once, and fades in after scrolling past it. */
export function SiteBackground() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const active = backgroundFor(pathname);
  const [visited, setVisited] = useState<string[]>([active]);
  const [heroVisible, setHeroVisible] = useState(true);
  const [prevPath, setPrevPath] = useState(pathname);
  const [instant, setInstant] = useState(false);

  // Arriving on the homepage from another page lands at the top, so assume
  // the hero is on screen until the observer says otherwise, and hide
  // without the fade so the old backdrop never lingers over the hero.
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setHeroVisible(true);
    setInstant(isHome);
    if (!visited.includes(active)) setVisited([...visited, active]);
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
    <div aria-hidden="true" className={`site-bg${hidden ? " is-hidden" : ""}${instant ? " no-fade" : ""}`}>
      {visited.map((key) => (
        <div
          key={key}
          className={`site-bg-layer site-bg-layer--${key}${key === active ? " is-active" : ""}`}
        />
      ))}
    </div>
  );
}
