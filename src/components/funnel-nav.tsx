"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, House, Phone, Mail, CalendarClock, ArrowRight } from "lucide-react";
import { NavLink } from "@/components/nav-link";
import { NAV_LINKS, SERVICE_LINKS } from "@/lib/site-nav";

// Funnel pages (Moe 2026-11-13): the page stays focused on its form or buy
// button, but a visitor is never trapped. The logo and a Home button lead
// back to the homepage, and a menu tab pinned to the top left slides the
// whole site out from the left (.funnel-drawer in globals.css). It behaves as
// a modal dialog: focus moves in, Tab stays inside, Esc or a tap outside
// closes it, and focus goes back to the tab.
export function FunnelNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const tabRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const navigating = useRef(false);

  const closeForNav = () => {
    navigating.current = true;
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      navigating.current = false;
      closeRef.current?.focus();
      const root = document.documentElement;
      const prevOverflow = root.style.overflow;
      root.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
          return;
        }
        if (e.key !== "Tab" || !drawerRef.current) return;
        const items = drawerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("keydown", onKey);
        root.style.overflow = prevOverflow;
      };
    }
    if (wasOpen.current && !navigating.current) tabRef.current?.focus();
    wasOpen.current = false;
  }, [open]);

  const onStart = pathname === "/start" || pathname?.startsWith("/start/");

  return (
    <>
      <header className="relative flex items-center justify-center px-4 pt-4">
        <Link
          href="/"
          aria-label="EVOGENCY home"
          className="glass-nav flex items-center gap-2.5 rounded-2xl px-4 py-2.5 transition hover:border-[#5fd8e6]/40"
        >
          <Image src="/evogency-logo.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" />
          <span className="text-sm font-semibold tracking-wide text-white">EVOGENCY</span>
        </Link>
        <Link
          href="/"
          data-funnel-home
          className="glass-nav absolute right-4 top-[22px] flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-medium text-white/80 transition hover:border-[#5fd8e6]/50 hover:text-white"
        >
          <House size={16} aria-hidden="true" style={{ color: "#5fd8e6" }} />
          <span className="max-sm:sr-only">Home</span>
        </Link>
      </header>

      {/* Pinned, so the way out stays in reach on long funnel pages. */}
      <button
        ref={tabRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="funnel-menu"
        className="glass-nav fixed left-4 top-[22px] z-50 flex h-11 min-w-11 items-center justify-center gap-1 rounded-full px-3 text-sm font-medium text-white/80 transition hover:border-[#5fd8e6]/50 hover:text-white"
      >
        <span className="max-sm:sr-only">Menu</span>
        <ChevronRight size={18} aria-hidden="true" style={{ color: "#5fd8e6" }} />
      </button>

      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`funnel-drawer-scrim fixed inset-0 z-[70] bg-black/60 ${open ? "is-open" : ""}`}
      />
      <div
        ref={drawerRef}
        id="funnel-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        className={`funnel-drawer glass-nav fixed inset-y-0 left-0 z-[71] flex w-[min(320px,88vw)] flex-col overflow-y-auto rounded-r-2xl px-4 pb-8 pt-4 ${open ? "is-open" : ""}`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" onClick={closeForNav} className="flex items-center gap-2.5 px-1 py-1">
            <Image src="/evogency-logo.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
            <span className="text-sm font-semibold tracking-wide text-white">EVOGENCY</span>
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close site menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-[#5fd8e6]/50 hover:text-[#5fd8e6]"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
        </div>

        <Link
          href="/"
          onClick={closeForNav}
          className="mt-5 flex min-h-11 items-center gap-3 rounded-xl border border-[#5fd8e6]/30 bg-[#5fd8e6]/10 px-3 py-2.5 text-base font-semibold text-white transition hover:border-[#5fd8e6]/60"
        >
          <House size={18} aria-hidden="true" style={{ color: "#5fd8e6" }} /> Home
        </Link>

        <nav aria-label="Pages" className="mt-4 flex flex-col">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.label}
              href={l.href}
              mockup={l.mockup}
              onClick={closeForNav}
              className={`flex min-h-11 items-center rounded-xl px-3 text-base transition hover:bg-white/5 ${
                l.mockup ? "font-semibold text-[#5fd8e6] hover:text-white" : "text-white/80 hover:text-white"
              }`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <p className="mt-5 px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fe3ee]">All services</p>
        <nav aria-label="Services" className="flex flex-col gap-0.5">
          {SERVICE_LINKS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              onClick={closeForNav}
              className={`flex min-h-11 items-center gap-2.5 rounded-xl px-2 py-1 text-sm transition hover:bg-white/5 hover:text-white ${
                s.top ? "font-semibold text-white" : "text-white/75"
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#5fd8e6]/30 bg-[#5fd8e6]/10">
                <s.icon size={16} aria-hidden="true" style={{ color: "#5fd8e6" }} />
              </span>
              <span className="min-w-0 flex-1">{s.label}</span>
            </Link>
          ))}
        </nav>

        {!onStart && (
          <Link href="/start" onClick={closeForNav} className="btn-solid mt-6 w-full justify-center !py-2.5 text-sm">
            Get Started <ArrowRight size={15} aria-hidden="true" />
          </Link>
        )}

        <div className="mt-6 flex flex-col gap-1 border-t border-white/10 pt-4 text-sm text-white/65">
          <a href="tel:+18138971954" className="flex min-h-11 items-center gap-3 px-3 transition hover:text-white">
            <Phone size={16} aria-hidden="true" style={{ color: "#5fd8e6" }} /> (813) 897 1954
          </a>
          <a href="mailto:hello@evogencyglobal.com" className="flex min-h-11 items-center gap-3 px-3 transition hover:text-white">
            <Mail size={16} aria-hidden="true" style={{ color: "#5fd8e6" }} /> hello@evogencyglobal.com
          </a>
          <a
            href="https://calendly.com/mohamed-eltoukhy011/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center gap-3 px-3 transition hover:text-white"
          >
            <CalendarClock size={16} aria-hidden="true" style={{ color: "#5fd8e6" }} /> Book a call
          </a>
          <a href="/agency-os" onClick={closeForNav} className="flex min-h-11 items-center px-3 text-xs text-white/50 transition hover:text-white">
            Client Portal
          </a>
        </div>
      </div>
    </>
  );
}
