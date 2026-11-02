"use client";

// Same page anchor that works on every click. A plain Link to "#x" does
// nothing once the URL already ends in "#x", which left the Listing Suite
// plan tiles dead after the first click (2026-11-02). This scrolls to the
// target each time and replays a highlight pulse on it.
export function PlanJumpLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        const el = document.getElementById(href.slice(1));
        if (!el) return;
        e.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        history.replaceState(null, "", href);
        el.classList.remove("plan-flash");
        void el.offsetWidth; // restart the animation
        el.classList.add("plan-flash");
      }}
    >
      {children}
    </a>
  );
}
