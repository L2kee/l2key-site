// Funnel pages drop the site nav and footer so the only choices are the form
// or the buy button (a squeeze page has exactly two exits: opt in or leave).
const FUNNEL_PREFIXES = ["/free-review-kit", "/growth-kit", "/job-site-studio"];

export function isFunnelPath(pathname: string | null): boolean {
  return !!pathname && FUNNEL_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
