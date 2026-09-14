const PHRASES = ["Evolve.", "Elevate.", "Grow."];

export function Marquee() {
  const strip = Array.from({ length: 4 }).flatMap(() => PHRASES);

  return (
    <div className="marquee border-y border-white/10 py-6">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee-group" aria-hidden={copy === 1}>
            {strip.map((word, i) => (
              <span key={`${copy}-${i}`} className="flex items-center gap-8">
                <span className="text-2xl font-bold tracking-tight text-white/85 sm:text-4xl">
                  {word}
                </span>
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#f0c14b]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
