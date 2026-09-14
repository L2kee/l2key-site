"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#skills", label: "Skills" },
  { href: "#work", label: "Work" },
  { href: "#founder", label: "Founder" },
  { href: "#contact", label: "Contact" },
];

// How far you can scroll before the nav disappears. Small on purpose —
// it should read as "the landing page's nav," not a bar that lingers.
const TOP_THRESHOLD = 40;

export function Navbar() {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    function update() {
      setAtTop(window.scrollY < TOP_THRESHOLD);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 transition-all duration-300 ease-out ${
        atTop ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-6 opacity-0"
      }`}
    >
      <nav className="glass-nav flex w-full max-w-5xl items-center justify-between rounded-2xl px-4 py-2.5">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg">
            <Image src="/evogency-logo.png" alt="EVOGENCY" width={36} height={36} className="h-9 w-9 object-cover" />
          </span>
          <span className="text-sm font-semibold tracking-wide text-white">EVOGENCY</span>
        </a>
        <div className="hidden items-center gap-6 sm:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/70 transition hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>
        <a href="#contact" className="btn-solid !px-4 !py-2 text-sm">
          Get a quote
        </a>
      </nav>
    </header>
  );
}
