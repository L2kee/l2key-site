import { Sparkles, PhoneCall, Database, Globe2, Gem, Smartphone, Search, Star, House } from "lucide-react";

// One list of the site's main pages, shared by the navbar, the phone menu,
// and the funnel drawer (funnel-nav.tsx). Free Mockup (the lead magnet, in
// cyan) opens the mockup request form instead of navigating, /contact is its
// no script fallback.
export type NavItem = { href: string; label: string; mockup?: boolean };
export const NAV_LINKS: NavItem[] = [
  { href: "/services", label: "Services" },
  { href: "/works", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/contact", label: "Free Mockup", mockup: true },
];

// Every service, each linking to its own page. The first three are the
// highest margin services (Service Margin Grid in the vault, 2026-11-08), so
// they lead. Shared by the homepage services rail and the funnel drawer.
export const SERVICE_LINKS = [
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

// Routes served outside this Next app (proxied or static). A next/link
// prefetch of them 404s, so they get a plain anchor and a full page load.
export const EXTERNAL_ROUTES = new Set(["/agency-os"]);
