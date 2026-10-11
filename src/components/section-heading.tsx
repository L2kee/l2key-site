// reveal: each line of the title (split on a newline) rises out of its own mask
// (.mask-line in globals.css). An h1 plays on load, an h2 when it scrolls
// into view.
export function SectionHeading({
  eyebrow,
  title,
  as: Heading = "h2",
  reveal = false,
}: {
  eyebrow: string;
  title: string;
  as?: "h1" | "h2";
  reveal?: boolean;
}) {
  return (
    <div className="text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f0c14b]/80">
        {eyebrow}
      </p>
      {reveal ? (
        <Heading
          className={`mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl ${Heading === "h1" ? "mask-rise-load" : "mask-rise-view"}`}
        >
          {title.split("\n").map((line, i) => (
            <span key={line} className="mask-line">
              <span style={{ "--i": i } as React.CSSProperties}>{line}</span>
            </span>
          ))}
        </Heading>
      ) : (
        <Heading className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </Heading>
      )}
    </div>
  );
}
