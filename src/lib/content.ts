import { Globe2, Star, Search, Smartphone, Sparkles, Database, Gem, PhoneCall } from "lucide-react";
import type { WorkItem } from "@/components/work-card";

type Service = {
  icon: typeof Globe2;
  title: string;
  body: string;
  href?: string;
};

export const SERVICES: Service[] = [
  {
    icon: PhoneCall,
    title: "AI Front Desk",
    body: "An AI receptionist that answers every call 24/7, books appointments onto your calendar, and texts back anyone you miss.",
    href: "/ai",
  },
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
  {
    title: "Listing Suite Sample",
    category: "Websites",
    year: "2026",
    tag: "Design concept",
    icon: "globe",
    images: ["/listing-suite-1-hero.webp", "/listing-suite-2-gallery.webp", "/listing-suite-3-details.webp"],
    imageAlts: [
      "Sample listing page hero for The Modern Residence in Windermere, Florida, a modern home with a pool, listed at $2,450,000 with a Request a private showing button",
      "Sample listing page gallery titled Every angle, showing the home's pool, stone and glass front, outdoor kitchen, and bright interiors",
      "Sample listing page details titled Made for living, with Living, Outdoor, and Location lists above a neighborhood map of Windermere",
    ],
    body: "A sample of what EVOGENCY Listing Suite builds for real estate agents. One home gets its own luxury page with a story, a full gallery, the details, a neighborhood map, and a showing request form that lands on the agent's phone. The home, price, and agent are illustrative.",
    fullPage: {
      src: "/work-listing-suite-full.jpg",
      width: 1000,
      height: 4734,
      alt: "The full sample listing page, from The Modern Residence hero through the story, the essentials, the gallery, the details, the map, the showing form, and the agent card",
    },
    stack: ["HTML", "CSS", "JavaScript"],
    links: [
      { label: "See the sample page", href: "https://demos.evogencyglobal.com/sample-modern-residence/" },
      { label: "Listing Suite plans", href: "/real-estate-listing-websites-orlando" },
    ],
  },
];

/** The homepage's three top services (highest margin, Service Margin Grid in
    the vault, 2026-11-08), shown in the Featured Work card layout. Each card
    uses real screenshots of things we built and run. */
export const TOP_SERVICES: WorkItem[] = [
  {
    title: "AI Automation & Agents",
    category: "Top service",
    year: "Builds from $3K",
    tag: "Live on this site",
    images: ["/ava-2-reply.webp", "/ava-1-greeting.webp"],
    imageAlts: [
      "Ava, the AI assistant on evogencyglobal.com, answering a visitor who asked whether the follow ups on open quotes can be automated",
      "Ava, the AI assistant on evogencyglobal.com, greeting a visitor and offering to answer questions about AI front desks, websites, SEO, or a free homepage mockup",
    ],
    icon: "bolt",
    body: "AI agents and workflows wired into the tools you already use, so leads get answered in seconds and follow ups send themselves. Meet Ava, the AI assistant on this site. She answers questions, qualifies visitors, and hands real leads to us, the same kind of agent we build for you.",
    stack: ["AI agents", "Lead follow up", "Workflows", "Care plan"],
    links: [{ label: "See AI Automation", href: "/ai-automation-orlando", internal: true }],
  },
  {
    title: "AI Front Desk",
    category: "Top service",
    year: "$297 a month",
    tag: "Answering calls now",
    images: ["/services-front-desk.jpg"],
    imageAlts: [
      "A desk phone at night projecting glowing call, calendar, and check mark icons, a call answered and booked",
    ],
    icon: "call",
    body: "An AI receptionist that answers every call 24/7, books the job onto your calendar, and texts back anyone you miss. $997 setup, then $297 a month, or pay once and own it. Call (321) 435 4469 and our own front desk picks up.",
    stack: ["Answers 24/7", "Books jobs", "Texts back missed calls"],
    links: [
      { label: "See the AI Front Desk", href: "/ai", internal: true },
      { label: "Call it now", href: "tel:+13214354469", internal: true },
    ],
  },
  {
    title: "Custom CRM Development",
    category: "Top service",
    year: "Fixed price quote",
    tag: "Live in production",
    images: ["/agency-os-1-pipeline.png", "/agency-os-2-playbook.png"],
    imageAlts: [
      "Agency OS pipeline board with Orlando plumbing businesses organized into New Lead, Contacted, Interested, and Proposal Sent columns",
      "Agency OS cold call playbook with a script search, tabs from the opener through the close, and the mindset and rules card",
    ],
    icon: "dashboard",
    body: "A CRM built around how your team actually sells, with pipeline management, lead tracking, outreach sequences, and role based access. We run our own agency on one. Agency OS is live in production today.",
    stack: ["Pipeline", "Lead tracking", "Outreach", "Role based access"],
    links: [
      { label: "See Custom CRM", href: "/custom-crm-development-orlando", internal: true },
      { label: "View Agency OS live", href: "https://evogencyglobal.com/agency-os" },
    ],
  },
];
