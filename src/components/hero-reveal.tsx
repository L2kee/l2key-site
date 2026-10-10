"use client";

import { useLayoutEffect } from "react";

const ID = "hero-copy";

/** Holds the hero entrance (.hero-in, .hero-cta in globals.css) until the
    copy scrolls into view, because on laptops the hero video fills the
    first screen and the sequence used to finish unseen. Copy already on
    screen at load just plays. Runs twice on purpose, from an inline script
    during the HTML parse (so a full load never paints the text and then
    hides it) and from the layout effect (client side navigation back to
    the homepage, where React never runs inline scripts). Both are safe to
    repeat. Without JS nothing is held and the entrance plays on load. */
function armHeroReveal(id: string) {
  const el = document.getElementById(id);
  if (!el || el.dataset.heroArmed) return;
  el.dataset.heroArmed = "1";
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (el.getBoundingClientRect().top < window.innerHeight * 0.7) return;
  el.classList.add("hero-wait");
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      el.classList.remove("hero-wait");
      io.disconnect();
    },
    { rootMargin: "0px 0px -30% 0px" },
  );
  io.observe(el);
}

export function HeroReveal({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  useLayoutEffect(() => armHeroReveal(ID), []);

  return (
    <>
      {/* The inline script edits this element's class before hydration. */}
      <section id={ID} className={className} suppressHydrationWarning>
        {children}
      </section>
      <script
        dangerouslySetInnerHTML={{
          __html: `(${armHeroReveal.toString()})(${JSON.stringify(ID)})`,
        }}
      />
    </>
  );
}
