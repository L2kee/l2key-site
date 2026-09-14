import Link from "next/link";
import Image from "next/image";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex justify-center px-4 pt-4">
      <nav className="glass-nav flex w-full max-w-5xl items-center justify-between rounded-2xl px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg">
            <Image src="/evogency-logo.png" alt="EVOGENCY" width={36} height={36} className="h-9 w-9 object-cover" />
          </span>
          <span className="text-sm font-semibold tracking-wide text-white">EVOGENCY</span>
        </Link>
        <div className="hidden items-center gap-6 sm:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/70 transition hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link href="/contact" className="btn-solid !px-4 !py-2 text-sm">
          Get a Free Audit
        </Link>
      </nav>
    </header>
  );
}
