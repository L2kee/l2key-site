"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Phone, Mail, CalendarClock } from "lucide-react";
import { isFunnelPath } from "@/lib/funnel-paths";
import { openMockup } from "@/components/mockup-notice";

// Moe 2026-11-08. AI Front Desk left the bar (still in the homepage services
// menu, Top Services, and the footer), Built in House moved to the footer,
// Contact came in, and Free Mockup (the lead magnet, in cyan) opens the
// mockup request form instead of navigating. /contact is its no script
// fallback. Client Portal is a small text link beside Get Started.
type NavItem = { href: string; label: string; mockup?: boolean };
const LINKS: NavItem[] = [
  { href: "/services", label: "Services" },
  { href: "/works", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/contact", label: "Free Mockup", mockup: true },
];

// Routes served outside this Next app (proxied or static). A next/link
// prefetch of them 404s, so they get a plain anchor and a full page load.
const EXTERNAL_ROUTES = new Set(["/agency-os"]);

function NavLink({
  href,
  className,
  onClick,
  style,
  mockup = false,
  children,
}: {
  href: string;
  className: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  mockup?: boolean;
  children: React.ReactNode;
}) {
  if (mockup) {
    return (
      <a
        href={href}
        className={className}
        style={style}
        onClick={(e) => {
          e.preventDefault();
          onClick?.();
          openMockup();
        }}
      >
        {children}
      </a>
    );
  }
  if (EXTERNAL_ROUTES.has(href)) {
    return (
      <a href={href} className={className} onClick={onClick} style={style}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick} style={style}>
      {children}
    </Link>
  );
}

// Desktop links share one indicator (.nav-morph in globals.css). At rest it
// is a faint line under the links. Hovering or focusing a link shrinks it to
// an underline under that link, then it swells into a faceted cyan crystal behind it.
// Moving along glides the crystal, and leaving melts it back into the line.
function DesktopLinks() {
  const group = useRef<HTMLDivElement>(null);
  const ind = useRef<HTMLSpanElement>(null);
  const state = useRef<"rest" | "line" | "pill">("rest");
  const cur = useRef<HTMLElement | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const place = (a: HTMLElement, mode: "line" | "pill") => {
    const g = group.current, el = ind.current;
    if (!g || !el) return;
    state.current = mode;
    el.className = `nav-morph-ind is-${mode}`;
    el.style.left = `${a.offsetLeft}px`;
    el.style.width = `${a.offsetWidth}px`;
    el.style.top = mode === "pill" ? `${a.offsetTop}px` : `${g.clientHeight - 2}px`;
    el.style.height = mode === "pill" ? `${a.offsetHeight}px` : "2px";
    g.querySelectorAll("a").forEach((o) => o.classList.toggle("is-lit", mode === "pill" && o === a));
  };

  const go = (a: HTMLElement) => {
    if (cur.current === a) return;
    window.clearTimeout(timer.current);
    cur.current = a;
    if (state.current === "pill") return place(a, "pill");
    place(a, "line");
    timer.current = window.setTimeout(() => place(a, "pill"), 260);
  };

  const leave = () => {
    window.clearTimeout(timer.current);
    const a = cur.current, el = ind.current;
    cur.current = null;
    if (!a || !el || state.current === "rest") return;
    place(a, "line");
    timer.current = window.setTimeout(() => {
      state.current = "rest";
      el.className = "nav-morph-ind";
      el.removeAttribute("style");
    }, 280);
  };

  return (
    <div
      ref={group}
      className="nav-morph relative hidden items-center gap-2 lg:col-start-2 lg:flex"
      onPointerOver={(e) => {
        const a = (e.target as HTMLElement).closest("a");
        if (e.pointerType === "mouse" && a) go(a);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") leave();
      }}
      onFocus={(e) => {
        const a = (e.target as HTMLElement).closest("a");
        if (a?.matches(":focus-visible")) go(a);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) leave();
      }}
    >
      <span ref={ind} className="nav-morph-ind" aria-hidden="true" />
      {LINKS.map((l) => (
        <NavLink
          key={l.label}
          href={l.href}
          mockup={l.mockup}
          className={`relative z-[1] rounded-full px-2 py-1.5 text-sm font-medium transition-colors ${
            l.mockup ? "font-semibold text-[#5fd8e6] hover:text-white" : "text-white/70 hover:text-white"
          }`}
        >
          {l.label}
        </NavLink>
      ))}
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  // A tapped menu link closes the menu without animating, so it never
  // fights the page crossfade (.menu-instant in globals.css).
  const [instant, setInstant] = useState(false);
  const [hidden, setHidden] = useState(false);
  const closeForNav = () => {
    navigating.current = true;
    setInstant(true);
    setOpen(false);
  };
  const lastY = useRef(0);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const navigating = useRef(false);

  // The phone menu behaves as a modal dialog for keyboard and screen reader
  // users. Opening moves focus to the close button, Tab and Shift+Tab stay
  // inside, Esc closes it, and closing puts focus back on the menu button
  // (unless a link was chosen, where the new page takes over).
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      navigating.current = false;
      closeRef.current?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
          return;
        }
        if (e.key !== "Tab" || !menuRef.current) return;
        const items = menuRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
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
      return () => document.removeEventListener("keydown", onKey);
    }
    if (wasOpen.current && !navigating.current) burgerRef.current?.focus();
    wasOpen.current = false;
  }, [open]);

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

  const pathname = usePathname();
  if (isFunnelPath(pathname)) {
    // Funnel pages keep the brand but offer no way out except the page's own button.
    return (
      <header className="flex justify-center px-4 pt-4">
        <span className="glass-nav flex items-center gap-2.5 rounded-2xl px-4 py-2.5">
          <Image src="/evogency-logo.png" alt="EVOGENCY logo" width={36} height={36} className="h-9 w-9 object-contain" />
          <span className="text-sm font-semibold tracking-wide text-white">EVOGENCY</span>
        </span>
      </header>
    );
  }

  return (
    <>
      {/* The header itself lets clicks through, only the bar catches them,
          so on the homepage the services rail under its left edge stays
          clickable. On the homepage (lg up) the services menu sits flush
          left (16px in, Moe 2026-11-08), so the bar spans the rest of the
          window: full width, padded by the menu's 184px plus the 24px gap. */}
      <header
        className={`pointer-events-none sticky top-0 z-50 flex justify-center px-4 pt-4 transition-transform duration-300 ease-out ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className={`flex w-full justify-center ${pathname === "/" ? "max-w-5xl lg:max-w-none lg:pl-[208px]" : "max-w-5xl"}`}>
        {/* From lg up a three column grid keeps the links dead center in the
            bar whether or not the logo shows: logo, links, Get Started. */}
        {/* Transparent bar, only the words and buttons show (Moe 2026-11-08).
            .nav-clear in globals.css gives the words a soft shadow so they
            stay readable over whatever scrolls behind them. */}
        <nav className="nav-clear pointer-events-auto flex w-full items-center justify-between rounded-2xl px-4 py-2.5 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          {/* On the homepage from lg up the services menu already carries the
              logo, so the bar drops it (Moe 2026-11-08). */}
          <Link
            href="/"
            className={`flex items-center gap-2.5 ${pathname === "/" ? "lg:hidden" : ""}`}
            onClick={() => setOpen(false)}
          >
            <Image src="/evogency-logo.png" alt="EVOGENCY logo" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="text-sm font-semibold tracking-wide text-white">EVOGENCY</span>
          </Link>

          <DesktopLinks />

          <div className="hidden items-center gap-4 lg:col-start-3 lg:flex lg:justify-self-end">
            <a href="/agency-os" className="text-xs text-white/55 transition hover:text-white">
              Client Portal
            </a>
            <Link href="/start" className="btn-solid !px-4 !py-2 text-sm">
              Get Started
            </Link>
          </div>

          <button
            ref={burgerRef}
            type="button"
            onClick={() => {
              setInstant(false);
              setOpen(true);
            }}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="site-menu"
            className="burger h-10 w-10 rounded-full border border-white/15 bg-white/5 text-white transition hover:border-[#5fd8e6]/50 hover:text-[#5fd8e6] lg:hidden"
          >
            <i /><i /><i />
          </button>
        </nav>
        </div>
      </header>

      {/* Always mounted so it can spread out from the menu button and fold
          back into it (.menu-overlay in globals.css). The top row sits exactly
          where the navbar's logo and button are, so the button's three lines
          fold into the X in place. */}
      <div
        ref={menuRef}
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        className={`menu-overlay fixed inset-0 z-[60] flex flex-col bg-black lg:hidden ${open ? "is-open" : ""} ${instant ? "menu-instant" : ""}`}
      >
        <div className="flex items-center justify-between px-[33px] pt-[27px]">
          <span className="flex items-center gap-2.5">
            <Image src="/evogency-logo.png" alt="EVOGENCY logo" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="text-sm font-semibold tracking-wide text-white">EVOGENCY</span>
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="burger h-10 w-10 rounded-full border border-white/15 bg-white/5 text-white"
          >
            <i /><i /><i />
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
          {LINKS.map((l, i) => (
            <NavLink
              key={l.label}
              href={l.href}
              mockup={l.mockup}
              onClick={closeForNav}
              style={{ "--m": i } as React.CSSProperties}
              className={`menu-item border-b border-white/10 py-4 text-3xl font-semibold hover:text-[#5fd8e6] ${l.mockup ? "text-[#5fd8e6]" : "text-white"}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="menu-item px-8 pb-10" style={{ "--m": LINKS.length } as React.CSSProperties}>
          <Link href="/start" onClick={closeForNav} className="btn-solid w-full justify-center">
            Get Started
          </Link>
          <div className="mt-6 flex flex-col gap-3 text-sm text-white/60">
            <a href="tel:+18138971954" className="flex items-center gap-3 transition hover:text-white">
              <Phone size={16} style={{ color: "#5fd8e6" }} /> (813) 897-1954
            </a>
            <a href="mailto:hello@evogencyglobal.com" className="flex items-center gap-3 transition hover:text-white">
              <Mail size={16} style={{ color: "#5fd8e6" }} /> hello@evogencyglobal.com
            </a>
            <a
              href="https://calendly.com/mohamed-eltoukhy011/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 transition hover:text-white"
            >
              <CalendarClock size={16} style={{ color: "#5fd8e6" }} /> Book a call
            </a>
            <a href="/agency-os" onClick={closeForNav} className="text-xs text-white/50 transition hover:text-white">
              Client Portal
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
