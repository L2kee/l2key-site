"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, Mail, CalendarClock } from "lucide-react";

const LINKS = [
  { href: "/services", label: "Our Craft" },
  { href: "/works", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/agency-os", label: "Client Portal" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (open || y < 80) {
        setHidden(false);
        lastY.current = y;
        return;
      }
      if (y > lastY.current + 4) setHidden(true);
      else if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 flex justify-center px-4 pt-4 transition-transform duration-300 ease-out ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <nav className="glass-nav flex w-full max-w-5xl items-center justify-between rounded-2xl px-4 py-2.5">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <Image src="/evogency-logo.png" alt="EVOGENCY logo" width={36} height={36} className="h-9 w-9 object-contain" />
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

          <Link href="/contact" className="btn-solid hidden !px-4 !py-2 text-sm sm:inline-flex">
            Get a Free Audit
          </Link>

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-[#f0c14b]/50 hover:text-[#f0c14b] sm:hidden"
          >
            <Menu size={20} />
          </button>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[#0a0805]/98 backdrop-blur-xl sm:hidden">
          <div className="flex items-center justify-between px-6 pt-7">
            <span className="flex items-center gap-2.5">
              <Image src="/evogency-logo.png" alt="EVOGENCY logo" width={32} height={32} className="h-8 w-8 object-contain" />
              <span className="text-sm font-semibold tracking-wide text-white">EVOGENCY</span>
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-4 text-3xl font-semibold text-white transition hover:text-[#f0c14b]"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="px-8 pb-10">
            <Link href="/contact" onClick={() => setOpen(false)} className="btn-solid w-full justify-center">
              Get a Free Audit
            </Link>
            <div className="mt-6 flex flex-col gap-3 text-sm text-white/60">
              <a href="tel:+18138971954" className="flex items-center gap-3 transition hover:text-white">
                <Phone size={16} style={{ color: "#f0c14b" }} /> (813) 897-1954
              </a>
              <a href="mailto:hello@evogencyglobal.com" className="flex items-center gap-3 transition hover:text-white">
                <Mail size={16} style={{ color: "#f0c14b" }} /> hello@evogencyglobal.com
              </a>
              <a
                href="https://calendly.com/mohamed-eltoukhy011/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <CalendarClock size={16} style={{ color: "#f0c14b" }} /> Book a call
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
