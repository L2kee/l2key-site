import localFont from "next/font/local";

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
