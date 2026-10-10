import { Globe2, Star, Search, Smartphone, Sparkles, Database, Gem } from "lucide-react";
import type { WorkItem } from "@/components/work-card";

type Service = {
  icon: typeof Globe2;
  title: string;
  body: string;
  href?: string;
};

export const SERVICES: Service[] = [
  {
    icon: Gem,
    title: "Luxury Brand Design & Rebrands",
    body: "Logos, color, type, and full brand identities for premium brands launching or repositioning, designed so your look matches the price you charge.",
    href: "/brand-design",
  },
  {
    icon: Globe2,
    title: "Websites That Convert",
    body: "Fast websites built mobile first, designed to turn visitors into calls and bookings, not just look nice sitting there.",
    href: "/web-design-agency-orlando",
  },
  {
    icon: Search,
    title: "SEO That Gets Found",
    body: "Search engine optimization, local search tuning, and technical fixes so your business shows up when people are actually looking.",
    href: "/seo-agency-orlando",
  },
  {
    icon: Star,
    title: "Google Reviews & Presence",
    body: "Google Business Profile setup and systems that generate more reviews, turning happy customers into five star social proof.",
    href: "/google-reviews-orlando",
  },
  {
    icon: Sparkles,
    title: "AI Automation & Agents",
    body: "AI agents and workflow automation connected to the tools you already use, so leads get answered fast and nothing falls through the cracks.",
    href: "/ai-automation-orlando",
  },
  {
    icon: Database,
    title: "Custom CRM Development",
    body: "Real pipeline management, lead tracking, and role based access built around how your business actually works, not a generic template.",
    href: "/custom-crm-development-orlando",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    body: "Cross platform mobile and desktop apps built with Flutter, backed by real shipped software, not just mockups.",
    href: "/mobile-app-development-orlando",
  },
];

export const WORK_CATEGORIES = ["All", "Websites", "Mobile Apps", "Web Apps", "Desktop Apps"];

export const WORK: WorkItem[] = [
  {
    title: "ElectricalAI Pro",
    category: "Desktop Apps",
    year: "2026",
    tag: "Live on the web",
    images: [
      "/electricalai-1-home.png",
      "/electricalai-2-modules.png",
      "/electricalai-3-voltage-drop.png",
      "/electricalai-4-material-list.png",
    ],
    imageAlts: [
      "ElectricalAI Pro home screen in its dark Kinetic glass theme, headlined Electrical math, jobsite ready, with Start calculating and Ask the assistant buttons",
      "ElectricalAI Pro calculator modules under the heading The full bench, one surface, showing Ohm's Law, voltage drop, wire ampacity, and 8 more modules",
      "ElectricalAI Pro voltage drop calculator result showing a 3.47 volt drop, 2.89 percent, within a common 3 percent branch circuit target",
      "ElectricalAI Pro material list generator, where an electrician describes the job and the AI assistant returns a structured takeoff",
    ],
    icon: "bolt",
    body: "An AI powered app for electricians, live on the web and on Windows: 11 calculator modules built on NEC tables, an AI electrical assistant, and two switchable themes. Flutter and Dart up front, a FastAPI and Python backend behind it.",
    fullPage: {
      src: "/work-electricalai-full.jpg",
      width: 1000,
      height: 1748,
      alt: "The full ElectricalAI Pro product page, from the Electrical math, jobsite ready hero through the calculator grid, the code tables, and the call to action",
    },
    stack: ["Flutter", "Dart", "FastAPI", "Python"],
    links: [{ label: "Try it live", href: "/electricalai-pro/app" }],
  },
  {
    title: "Agency OS",
    category: "Web Apps",
    year: "2026",
    tag: "Live in production",
    icon: "dashboard",
    images: ["/agency-os-1-pipeline.png", "/agency-os-2-playbook.png"],
    imageAlts: [
      "Agency OS pipeline board with Orlando plumbing businesses organized into New Lead, Contacted, Interested, and Proposal Sent columns",
      "Agency OS cold call playbook with a script search, tabs from the opener through the close, and the mindset and rules card",
    ],
    body: "A full CRM and prospecting platform built from the ground up: pipeline management, local business prospecting, outreach sequences, a cold calling playbook, and role based access. Live in production today.",
    stack: ["Next.js", "TypeScript", "Supabase", "Tailwind"],
    links: [{ label: "View live app", href: "https://evogencyglobal.com/agency-os" }],
  },
  {
    title: "Orlando Suits",
    category: "Websites",
    year: "2026",
    tag: "Design concept",
    icon: "globe",
    images: ["/orlando-hero.png", "/orlando-reviews.png", "/orlando-grid.png"],
    imageAlts: [
      "Orlando Suits homepage hero showing a tailor fitting a customer's suit jacket, headlined \"Nobody remembers the guy in the rental\"",
      "Orlando Suits page section showing five star customer review quotes under the headline \"The room notices. So do the reviews.\"",
      "Orlando Suits product grid showing suits, shirts, shoes, ties and accessories, hats, and cologne",
    ],
    body: "A pitch concept for a downtown Orlando menswear and tailoring shop, built with real product photography to show the client what the brand could look like online before any commitment. Full landing page, review driven, built to get a man through the door for a fitting.",
    fullPage: {
      src: "/work-orlando-full.jpg",
      width: 1000,
      height: 3112,
      alt: "The full Orlando Suits concept page, from the hero through the reviews, the tailor story, the product grid, the fit guide signup, and the visit section",
    },
    stack: ["HTML", "CSS", "Design"],
    links: [],
  },
];
