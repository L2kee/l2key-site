import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, PhoneCall, Database, Globe2, Gem, Smartphone, Search, Star, House } from "lucide-react";

// Every service, each linking to its own page. The first three are the
// highest margin services (Service Margin Grid in the vault, 2026-11-08),
// so they lead, each a glass card with the spinning flagship ring from the
// hero's AI Front Desk tile (.flagship-ring, offset per card by .rail-ring-N
// in globals.css so the three never spin in step).
const RAIL_SERVICES = [
  { href: "/ai-automation-orlando", label: "AI Automation", icon: Sparkles, top: true },
  { href: "/ai", label: "AI Front Desk", icon: PhoneCall, top: true },
  { href: "/custom-crm-development-orlando", label: "Custom CRM", icon: Database, top: true },
  { href: "/web-design-agency-orlando", label: "Websites That Convert", icon: Globe2 },
  { href: "/brand-design", label: "Luxury Brand Design", icon: Gem },
  { href: "/mobile-app-development-orlando", label: "Mobile App Development", icon: Smartphone },
  { href: "/seo-agency-orlando", label: "SEO That Gets Found", icon: Search },
  { href: "/google-reviews-orlando", label: "Google Reviews", icon: Star },
  { href: "/real-estate-listing-websites-orlando", label: "Listing Suite", icon: House },
];

// The icon box from the hero tiles (start-tiles.tsx), a size down.
function ServiceIcon({ icon: Icon }: { icon: typeof House }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#5fd8e6]/30 bg-[#5fd8e6]/10">
      <Icon size={16} aria-hidden="true" style={{ color: "#5fd8e6" }} />
    </span>
  );
}

/** The homepage's left services menu (lg and up only, Moe 2026-11-08).
    Borderless by Moe's pick: a faint frosted wash, no edge (.rail-soft).
    It stretches to the height of the hero beside it, with Get Started
    pinned to the bottom. */
export function ServicesRail({ className = "" }: { className?: string }) {
  const top = RAIL_SERVICES.filter((s) => s.top);
  const rest = RAIL_SERVICES.filter((s) => !s.top);
  return (
    <aside
      aria-label="All services"
      className={`rail-soft hidden w-[184px] shrink-0 flex-col gap-1 rounded-[20px] px-2.5 py-5 lg:flex ${className}`}
    >
      <Link href="/" className="mb-2 flex items-center gap-2.5 px-2 pb-4">
        <Image src="/evogency-logo.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
        <span className="text-sm font-semibold tracking-wide text-white">EVOGENCY</span>
      </Link>
      <p className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fe3ee]">
        All services
      </p>
      <nav aria-label="Services" className="flex flex-col gap-1">
        {top.map((s, i) => (
          <Link
            key={s.href}
            href={s.href}
            className={`start-tile group glass flagship-ring rail-ring-${i} relative mb-1.5 flex items-center gap-2 rounded-xl px-2 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition hover:border-[#5fd8e6]/50`}
          >
            <ServiceIcon icon={s.icon} />
            <span className="min-w-0 flex-1">{s.label}</span>
          </Link>
        ))}
        <span aria-hidden="true" className="mx-1.5 my-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        {rest.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="flex min-h-11 items-center gap-2.5 rounded-xl px-2 py-1 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
          >
            <ServiceIcon icon={s.icon} />
            <span className="min-w-0 flex-1">{s.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-4">
        <Link href="/start" className="btn-solid w-full justify-center !py-2.5 text-sm">
          Get Started <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
