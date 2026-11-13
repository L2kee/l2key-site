// Funnel pages drop the full site nav and footer so the form or buy button
// leads. They still offer a way out on every page (Moe 2026-11-13, "the
// guest has the right to do whatever they want"): funnel-nav.tsx gives them
// a Home button and a slide out site menu.
const FUNNEL_PREFIXES = ["/free-review-kit", "/growth-kit", "/job-site-studio", "/start"];

export function isFunnelPath(pathname: string | null): boolean {
  return !!pathname && FUNNEL_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
