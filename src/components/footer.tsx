import Image from "next/image";
import Link from "next/link";
import { LinkedInIcon } from "@/components/linkedin-icon";
import { FOUNDER_LINKEDIN } from "@/lib/schema";
import { Phone, Mail, MapPin, CalendarClock } from "lucide-react";

// Two even link columns instead of one long one (Moe 2026-11-25, Page
// Proportions Lesson). Get Started lives on the button under the brand.
const COMPANY = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/works", label: "Work" },
  { href: "/built-in-house", label: "Built in House" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const PRODUCTS = [
  { href: "/agency-os", label: "Client Portal" },
  { href: "/electricalai-pro", label: "ElectricalAI Pro" },
  { href: "/free-review-kit", label: "Free Review Kit" },
  { href: "/job-site-studio", label: "Job Site Studio" },
  { href: "/real-estate-listing-websites-orlando", label: "Listing Suite" },
];

function LinkColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-olive">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm text-white/60">
        {links.map((p) => (
          <li key={p.href}>
            {/* Agency OS is proxied, not part of this app, so a Link prefetch 404s. */}
            {p.href === "/agency-os" ? (
              <a href={p.href} className="link-grow transition hover:text-white">
                {p.label}
              </a>
            ) : (
              <Link href={p.href} className="link-grow transition hover:text-white">
                {p.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="flex items-center gap-2.5">
              <Image
                src="/evogency-logo.png"
                alt="EVOGENCY logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <span className="font-semibold tracking-wide text-white">EVOGENCY</span>
            </span>
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              Websites, SEO, and Google presence for local businesses. Real
              software, actually shipped.
            </p>
            <Link href="/start" className="btn-solid mt-6 !px-5 !py-2.5 text-sm">
              Get Started
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-olive">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-white/35" />
                <address className="not-italic">
                  100 E Pine St, Suite 110
                  <br />
                  Orlando, FL 32801
                </address>
              </li>
              <li>
                <a href="tel:+18138971954" className="flex min-h-6 items-center gap-2.5 transition hover:text-white">
                  <Phone size={16} className="shrink-0 text-white/35" />
                  (813) 897-1954
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@evogencyglobal.com"
                  className="flex min-h-6 items-center gap-2.5 transition hover:text-white"
                >
                  <Mail size={16} className="shrink-0 text-white/35" />
                  hello@evogencyglobal.com
                </a>
              </li>
              <li>
                <a
                  href="https://calendly.com/mohamed-eltoukhy011/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-6 items-center gap-2.5 transition hover:text-white"
                >
                  <CalendarClock size={16} className="shrink-0 text-white/35" />
                  Book a call
                </a>
              </li>
              <li>
                <a
                  href={FOUNDER_LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-6 items-center gap-2.5 transition hover:text-white"
                >
                  <LinkedInIcon size={16} className="shrink-0 text-white/35" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <LinkColumn title="Company" links={COMPANY} />
          <LinkColumn title="Products" links={PRODUCTS} />
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} EVOGENCY. All rights reserved.
          </p>
          <p className="text-xs text-white/60">Evolve. Elevate. Grow.</p>
        </div>
      </div>
    </footer>
  );
}
