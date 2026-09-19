import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, CalendarClock, ExternalLink } from "lucide-react";

const PAGES = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Our Craft" },
  { href: "/works", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/electricalai-pro", label: "ElectricalAI Pro" },
];

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
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#f0c14b]">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-white/35" />
                Orlando, FL, remote friendly
              </li>
              <li>
                <a href="tel:+18138971954" className="flex items-center gap-2.5 transition hover:text-white">
                  <Phone size={16} className="shrink-0 text-white/35" />
                  (813) 897-1954
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@evogencyglobal.com"
                  className="flex items-center gap-2.5 transition hover:text-white"
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
                  className="flex items-center gap-2.5 transition hover:text-white"
                >
                  <CalendarClock size={16} className="shrink-0 text-white/35" />
                  Book a call
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#f0c14b]">Pages</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              {PAGES.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="transition hover:text-white">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#f0c14b]">Elsewhere</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li>
                <a
                  href="https://github.com/L2kee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 transition hover:text-white"
                >
                  <ExternalLink size={16} className="shrink-0 text-white/35" />
                  GitHub
                </a>
              </li>
            </ul>
            <Link href="/contact" className="btn-solid mt-6 !px-5 !py-2.5 text-sm">
              Get a Free Audit
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} EVOGENCY. All rights reserved.
          </p>
          <p className="text-xs text-white/40">Evolve. Elevate. Grow.</p>
        </div>
      </div>
    </footer>
  );
}
