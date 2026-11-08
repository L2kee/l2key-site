import { TECH_LOGOS } from "@/components/tech-logos";
import { outline } from "@/lib/fonts";

// The mojo strip is outlined glass letters, in the static Geist Bold from
// lib/fonts.ts (why that file and not Google's Geist is explained there).

const WORDS = ["Evolve.", "Elevate.", "Grow."];

// Two strips with a tagline between them. Top, the three mojo words, each
// once, spread across exactly one screen width so the word leaving one
// edge is the same word entering the other. Bottom, the tech logos in
// brand color, running the opposite way.
// children: optional content placed above the mojo strip (the homepage puts
// its three steps there, Moe 2026-11-08).
export function Marquee({ children }: { children?: React.ReactNode }) {
  return (
    <div>
      {children}

      <div className="marquee marquee-mojo border-y border-white/10 py-6">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="marquee-group" aria-hidden={copy === 1}>
              {WORDS.map((word) => (
                <span key={word} className="marquee-cell">
                  <span className={`mojo-word ${outline.className}`}>{word}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="marquee-tagline">
        <span className="marquee-rule" />
        <p className="whitespace-nowrap">Seamlessly Integrated Tech</p>
        <span className="marquee-rule marquee-rule-end" />
      </div>

      <div className="marquee marquee-logos border-y border-white/10 py-6">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="marquee-group">
              {/* Two sets per group so one group is wider than a 2560px screen. */}
              {[0, 1].map((set) =>
                TECH_LOGOS.map((logo) => {
                  const hidden = copy === 1 || set === 1;
                  return (
                    <svg
                      key={`${set}-${logo.name}`}
                      className="tech-logo"
                      viewBox="0 0 24 24"
                      fill={logo.color}
                      role={hidden ? undefined : "img"}
                      aria-label={hidden ? undefined : logo.name}
                      aria-hidden={hidden || undefined}
                    >
                      {!hidden && <title>{logo.name}</title>}
                      <path d={logo.path} />
                    </svg>
                  );
                }),
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
