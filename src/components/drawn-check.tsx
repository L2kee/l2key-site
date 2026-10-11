// Success check that draws itself, the ring first, then the tick, then a
// small pop (.drawn-check in globals.css). Reduced motion gets it drawn.
export function DrawnCheck({ size = 44 }: { size?: number }) {
  return (
    <svg className="drawn-check mx-auto" width={size} height={size} viewBox="0 0 52 52" aria-hidden="true">
      <circle cx="26" cy="26" r="24" pathLength={1} />
      <path d="M15 27 l7 7 l15 -16" pathLength={1} />
    </svg>
  );
}
