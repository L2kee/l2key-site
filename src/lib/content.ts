import { Globe2, Star, Search, Code2, Smartphone, Bot } from "lucide-react";
import type { WorkItem } from "@/components/work-card";

export const SERVICES = [
  {
    icon: Globe2,
    title: "Websites That Convert",
    body: "Fast websites built mobile first, designed to turn visitors into calls and bookings, not just look nice sitting there.",
  },
  {
    icon: Search,
    title: "SEO That Gets Found",
    body: "Search engine optimization, local search tuning, and technical fixes so your business shows up when people are actually looking.",
  },
  {
    icon: Star,
    title: "Google Reviews & Presence",
    body: "Google Business Profile setup and systems that generate more reviews, turning happy customers into five star social proof.",
  },
];

export const WORK_CATEGORIES = ["All", "Mobile Apps", "Web Apps", "Desktop Apps"];

export const WORK: WorkItem[] = [
  {
    title: "BiteMate: AI Food Finder",
    category: "Mobile Apps",
    year: "2026",
    tag: "Live on the App Store",
    image: "/bitemate-shot.png",
    fit: "contain",
    icon: "phone",
    body: "A published iOS and Android app that answers \"what should I eat?\" in one tap. AI matches you to nearby restaurants or recipes based on what you're actually craving, with four modes (Mate, Date, Health, and Recipe) and a clear reason behind every recommendation. Rated 5.0 stars on the App Store.",
    stack: ["React Native", "AI Recommendations", "iOS", "Android"],
    links: [
      { label: "App Store", href: "https://apps.apple.com/us/app/bitemate-ai-food-finder/id6756649109" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.bitemate.app" },
    ],
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
      "/agency-prospecting.png",
      "/agency-playbook.png",
      "/agency-settings.png",
    ],
    body: "A full CRM and prospecting platform built from the ground up: pipeline management, local business prospecting, outreach sequences, a cold calling playbook, and role based access. Live in production today.",
    stack: ["Next.js", "TypeScript", "Supabase", "Tailwind"],
    links: [{ label: "View live app", href: "https://agency-os-v2-sage.vercel.app" }],
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
