import { Globe2, Star, Search, Code2, Smartphone, Bot, Sparkles, Database } from "lucide-react";
import type { WorkItem } from "@/components/work-card";

type Service = {
  icon: typeof Globe2;
  title: string;
  body: string;
  href?: string;
};

export const SERVICES: Service[] = [
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
    stack: ["HTML", "CSS", "Design"],
    links: [],
  },
  {
    title: "Agency OS",
    category: "Web Apps",
    year: "2026",
    tag: "Live in production",
    icon: "dashboard",
    images: [
      "/agency-dashboard.png",
      "/agency-pipeline.png",
      "/agency-leads.png",
      "/agency-playbook.png",
      "/agency-settings.png",
    ],
    imagePosition: "left-top",
    imageAlts: [
      "Agency OS dashboard showing open leads, pipeline value, deals won, revenue won, and a pipeline stage breakdown",
      "Agency OS pipeline board showing prospected businesses organized into columns from new lead through won",
      "Agency OS leads table listing prospected businesses with category, pipeline stage, website link, and deal value",
      "Agency OS cold call playbook screen with scripts and objection handling tabs for outreach calls",
      "Agency OS settings screen for app appearance and connecting a custom email sending domain",
    ],
    body: "A full CRM and prospecting platform built from the ground up: pipeline management, local business prospecting, outreach sequences, a cold calling playbook, and role based access. Live in production today.",
    stack: ["Next.js", "TypeScript", "Supabase", "Tailwind"],
    links: [{ label: "View live app", href: "https://www.evogencyglobal.com/agency-os" }],
  },
  {
    title: "ElectricalAI Pro",
    category: "Desktop Apps",
    year: "2026",
    tag: "v1.0.0 shipped",
    image: "/electricalai-shot.png",
    imageAlt:
      "ElectricalAI Pro app screen showing quick action tools like Ohm's Law and Voltage Drop calculators, plus AI Assistant and Material List features",
    icon: "bolt",
    body: "An AI powered Windows desktop app built for electricians: an AI electrical assistant, six professional electrical calculators, and a FastAPI/Python backend, built with Flutter and Dart.",
    stack: ["Flutter", "Dart", "FastAPI", "Python"],
    links: [{ label: "View on GitHub", href: "https://github.com/L2kee/ElectricalAI-Pro" }],
  },
];

export const SKILLS = [
  {
    icon: Code2,
    title: "Web Development",
    tags: ["TypeScript", "Next.js", "React", "Tailwind CSS"],
  },
  {
    icon: Bot,
    title: "Automation & AI Tooling",
    tags: ["Python", "AI Agents", "Workflow Automation", "APIs"],
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    tags: ["Dart", "Flutter", "Cross platform"],
  },
];
