import Image from "next/image";

export function Footer() {
  return (
    <footer className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 pb-10 pt-16 text-center">
      <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md">
        <Image src="/evogency-logo.png" alt="EVOGENCY" width={28} height={28} className="h-8 w-8 object-cover" />
      </span>
      <p className="text-xs text-white/40">
        © {new Date().getFullYear()} EVOGENCY — Evolve. Elevate. Grow.
      </p>
    </footer>
  );
}
