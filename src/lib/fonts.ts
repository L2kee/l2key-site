import localFont from "next/font/local";
import { Cormorant_Garamond } from "next/font/google";

// The homepage headline serif (option D5, Moe 2026-11-01). Line one is
// solid ice, line two the italic gradient signature.
export const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "600",
  style: ["normal", "italic"],
  display: "swap",
});

// Glass outline text (.glass-text, .mojo-word) uses Vercel's static Geist
// Bold, not the variable Geist from Google: the variable file keeps the
// overlapping contours where strokes join, and -webkit-text-stroke traces
// every one of them (stray lines inside the "t" and "E"). The static file
// has the overlaps removed, so only the outer edge is drawn.
export const outline = localFont({
  src: "../fonts/Geist-Bold.woff2",
  weight: "700",
  display: "swap",
});
