export function SectionHeading({
  eyebrow,
  title,
  as: Heading = "h2",
}: {
  eyebrow: string;
  title: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f0c14b]/80">
        {eyebrow}
      </p>
      <Heading className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </Heading>
    </div>
  );
}
