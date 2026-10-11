import { Fragment } from "react";

// One headline line split into letters that drop in and bounce into place
// one after another (.hero-letter in globals.css). Words stay whole, so a
// line only wraps at spaces. The letters are hidden from screen readers,
// the heading's aria-label reads the line whole. start is this line's
// first letter number across the headline, so a second line picks up
// where the first one ends.
export function DropLetters({
  text,
  start = 0,
  letterClass = "",
}: {
  text: string;
  start?: number;
  letterClass?: string;
}) {
  let n = start;
  return (
    <span aria-hidden="true">
      {text.split(" ").map((word, w) => (
        <Fragment key={w}>
          {w > 0 && " "}
          <span className="inline-block whitespace-nowrap">
            {[...word].map((ch, i) => (
              <span key={i} className={`hero-letter ${letterClass}`} style={{ "--l": n++ } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </span>
  );
}
