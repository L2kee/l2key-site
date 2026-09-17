import { Globe2, Star, Search, Code2, Smartphone, Bot, Sparkles } from "lucide-react";
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
  },
  {
    icon: Sparkles,
    title: "AI Automation & Agents",
    body: "AI agents and workflow automation connected to the tools you already use, so leads get answered fast and nothing falls through the cracks.",
    href: "/ai-automation-orlando",
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
