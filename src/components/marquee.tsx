import localFont from "next/font/local";
import { TECH_LOGOS } from "@/components/tech-logos";

// The mojo strip is outlined glass letters. It uses Vercel's static Geist
// Bold, not the variable Geist from Google: the variable file keeps the
// overlapping contours where strokes join, and -webkit-text-stroke traces
// every one of them (stray lines inside the "t" and "E"). The static file
// has the overlaps removed, so only the outer edge is drawn.
const outline = localFont({
  src: "../fonts/Geist-Bold.woff2",
  weight: "700",
  display: "swap",
});

const WORDS = ["Evolve.", "Elevate.", "Grow."];

// Two strips with a tagline between them. Top, the three mojo words, each
// once, spread across exactly one screen width so the word leaving one
// edge is the same word entering the other. Bottom, the tech logos in
// brand color, running the opposite way.
export function Marquee() {
  return (
    <div>
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
