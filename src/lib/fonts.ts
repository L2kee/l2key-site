import localFont from "next/font/local";
import { Cormorant_Garamond } from "next/font/google";

// The one site font (Moe 2026-11-13): Cormorant Garamond everywhere except
// the Evolve. Elevate. Grow. marquee. It started as the homepage headline
// serif (option D5, 2026-11-01). Loaded once in layout.tsx as --font-site,
// which globals.css maps to font-sans and font-mono. Its lowercase letters
// are short (x height .39 of the size), so globals.css sets font-size-adjust
// to render text 12% bigger than the size it's set at.
export const serif = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-site",
  display: "swap",
});

// The marquee's glass outline words (.mojo-word), the one place that is
// not the site font, use Vercel's static Geist
// Bold, not the variable Geist from Google: the variable file keeps the
// overlapping contours where strokes join, and -webkit-text-stroke traces
// every one of them (stray lines inside the "t" and "E"). The static file
// has the overlaps removed, so only the outer edge is drawn.
export const outline = localFont({
  src: "../fonts/Geist-Bold.woff2",
  weight: "700",
  display: "swap",
});
