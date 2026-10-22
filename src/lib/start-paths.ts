import { PhoneCall, Globe2, Database, ShoppingBag, Gem, UserRound, Compass } from "lucide-react";

// The guided funnel (/start). The homepage asks "What do you need?", each
// tile opens /start/<slug>, and that page runs a one question per screen
// form built from these steps, ending with contact details. Answers land in
// Agency OS and the hello@ alert (app/start/actions.ts).

export type StartQuestion = {
  id: string;
  q: string;
  // Multi select steps show a Continue button, single select ones advance on tap.
  multi?: boolean;
  options: string[];
};

export type StartPath = {
  slug: string;
  icon: typeof PhoneCall;
  tile: string;
  tileLine: string;
  eyebrow: string;
  headline: string;
  sub: string;
  outcomes: string[];
  // The two ways to buy, or one line when the work is a one time build anyway.
  pricing: { label: string; body: string }[];
  proof: { label: string; href: string }[];
  questions: StartQuestion[];
  // Personal projects skip the business name field.
  personal?: boolean;
};

const TIMELINE: StartQuestion = {
  id: "timeline",
  q: "When do you want it live?",
  options: ["As soon as possible", "Within a month", "In 1 to 3 months", "Just exploring for now"],
};

const QUOTE_BOTH_WAYS = [
  {
    label: "We run it",
    body: "We build it, host it, and keep it updated for a flat monthly price. You never touch the tech.",
  },
  {
    label: "You run it",
    body: "You pay once, we build it in accounts you own, train your team, and hand you the keys.",
  },
];

export const START_PATHS: StartPath[] = [
  {
    slug: "ai-front-desk",
    icon: PhoneCall,
    tile: "AI Front Desk",
    tileLine: "Never miss a call again",
    eyebrow: "AI Front Desk",
    headline: "Every call answered. Every job booked.",
    sub: "An AI receptionist that picks up 24/7, answers questions in your voice, books onto your calendar, and texts back anyone who hangs up.",
    outcomes: [
      "Nights, weekends, and busy hours covered",
      "Appointments land right on your calendar",
      "Missed callers get a text back in seconds",
    ],
    pricing: [
      {
        label: "We run it",
        body: "$997 setup plus $297 a month, month to month. The first 3 founding clients pay $497 setup.",
      },
      {
        label: "You run it",
        body: "One time price. We build it in your own accounts, train your team, and hand you the keys.",
      },
    ],
    proof: [
      { label: "Call ours right now at (321) 435 4469", href: "tel:+13214354469" },
      { label: "See how it works", href: "/ai" },
    ],
    questions: [
      {
        id: "business",
        q: "What kind of business is it?",
        options: ["Home services", "Medical or dental", "Legal or professional", "Salon or spa", "Auto", "Something else"],
      },
      {
        id: "calls",
        q: "About how many calls a day?",
        options: ["Under 10", "10 to 30", "30 to 100", "Over 100"],
      },
      {
        id: "missed",
        q: "What happens to the calls you miss today?",
        options: ["Voicemail", "They ring my cell", "Staff catches most", "Honestly, they're gone"],
      },
      {
        id: "jobs",
        q: "What should it handle?",
        multi: true,
        options: ["Answer questions", "Book appointments", "Text back missed calls", "Ask for Google reviews", "Follow up on quotes"],
      },
      {
        id: "plan",
        q: "Which way sounds better?",
        options: ["You run it for me", "I run it, you hand me the keys", "Not sure yet"],
      },
    ],
  },
  {
    slug: "website",
    icon: Globe2,
    tile: "Website",
    tileLine: "A site that brings in customers",
    eyebrow: "Websites",
    headline: "A website that makes the phone ring.",
    sub: "Fast, built for phones first, and designed around one job, turning visitors into calls, bookings, and sales. You own every line of it.",
    outcomes: [
      "See your new homepage before you pay a dime",
      "Built to show up on Google",
      "Real code you own, not a rented template",
    ],
    pricing: [
      {
        label: "One fixed price",
        body: "You get a real number within one business day of this form, plus a free homepage mockup. No surprise invoices.",
      },
    ],
    proof: [
      { label: "See sites we've built", href: "/works" },
      { label: "See what we can build", href: "/built-in-house" },
    ],
    questions: [
      {
        id: "current",
        q: "Where are you starting?",
        options: ["No website yet", "I have one, it needs a redo", "I have one, it needs fixes"],
      },
      {
        id: "goal",
        q: "What's the main job of the site?",
        options: ["Get calls and leads", "Book appointments", "Sell products", "Show off my work", "Something else"],
      },
      {
        id: "pages",
        q: "About how many pages?",
        options: ["Just 1", "2 to 5", "6 to 15", "Not sure"],
      },
      TIMELINE,
      {
        id: "budget",
        q: "What budget feels right?",
        options: ["Under $1,000", "$1,000 to $3,000", "$3,000 to $7,500", "Over $7,500", "Not sure, guide me"],
      },
    ],
  },
  {
    slug: "web-app",
    icon: Database,
    tile: "Web app or CRM",
    tileLine: "Software built for how you work",
    eyebrow: "Web apps and CRMs",
    headline: "Software that fits your business, not the other way around.",
    sub: "Custom CRMs, customer portals, booking systems, and internal tools, built around how your team actually works.",
    outcomes: [
      "Retire the spreadsheets and sticky notes",
      "Your team, your customers, one system",
      "Live in production, not a demo",
    ],
    pricing: QUOTE_BOTH_WAYS,
    proof: [
      { label: "Agency OS, our own CRM", href: "/works" },
      { label: "ElectricalAI Pro, a live AI app", href: "/electricalai-pro" },
    ],
    questions: [
      {
        id: "build",
        q: "What are you looking to build?",
        options: ["A CRM for my team", "A customer portal", "Booking or scheduling", "An internal tool", "A software product to sell", "Something else"],
      },
      {
        id: "users",
        q: "Who will use it?",
        options: ["Just me", "My team", "My customers", "The public"],
      },
      {
        id: "today",
        q: "What are you using today?",
        options: ["Spreadsheets", "Another software", "Nothing yet", "An app that needs work"],
      },
      TIMELINE,
      {
        id: "budget",
        q: "What budget feels right?",
        options: ["Under $2,500", "$2,500 to $5,000", "$5,000 to $15,000", "Over $15,000", "Not sure, guide me"],
      },
    ],
  },
  {
    slug: "online-store",
    icon: ShoppingBag,
    tile: "Online store",
    tileLine: "From zero to first sale",
    eyebrow: "Online stores",
    headline: "An online store, built from A to Z.",
    sub: "Design, products, payments, shipping, and the pages that actually sell. Starting from nothing or fixing a store that isn't selling.",
    outcomes: [
      "A store that looks like a real brand",
      "Product pages written to sell",
      "Payments, shipping, and email set up for you",
    ],
    pricing: QUOTE_BOTH_WAYS,
    proof: [{ label: "See our work", href: "/works" }],
    questions: [
      {
        id: "current",
        q: "Where are you starting?",
        options: ["Nothing yet", "A store that needs a redesign", "A store that needs more sales"],
      },
      {
        id: "products",
        q: "What are you selling?",
        options: ["Physical products", "Digital products", "Dropshipping", "Not sure yet"],
      },
      {
        id: "count",
        q: "About how many products?",
        options: ["1 to 10", "11 to 50", "Over 50", "Not sure"],
      },
      {
        id: "help",
        q: "What do you need help with?",
        multi: true,
        options: ["Store design", "Product pages", "Payments and shipping", "Ads", "Email marketing"],
      },
      {
        id: "budget",
        q: "What budget feels right?",
        options: ["Under $1,500", "$1,500 to $5,000", "Over $5,000", "Not sure, guide me"],
      },
    ],
  },
  {
    slug: "brand",
    icon: Gem,
    tile: "Brand",
    tileLine: "A look that matches your price",
    eyebrow: "Brand design",
    headline: "Look like the brand you already are.",
    sub: "Logos, color, type, and full identities for brands launching or repositioning, so the first glance justifies the price.",
    outcomes: [
      "A mark people remember",
      "A brand guide your whole team can follow",
      "Ready for your site, packaging, and socials",
    ],
    pricing: [
      {
        label: "One fixed price",
        body: "We start with a Brand Direction session, credited in full toward the full rebrand.",
      },
    ],
    proof: [
      { label: "Our brand design studio", href: "/brand-design" },
      { label: "Concept marks we've made", href: "/built-in-house" },
    ],
    questions: [
      {
        id: "stage",
        q: "Where's the brand right now?",
        options: ["Launching something new", "Full rebrand", "Refreshing the logo"],
      },
      {
        id: "needs",
        q: "What do you need?",
        multi: true,
        options: ["Logo", "Colors and type", "Brand guide", "Packaging", "Website"],
      },
      {
        id: "feel",
        q: "How should people feel when they see it?",
        options: ["Luxury", "Bold", "Friendly", "Trusted and established", "Not sure yet"],
      },
      TIMELINE,
    ],
  },
  {
    slug: "personal",
    icon: UserRound,
    tile: "Something for me",
    tileLine: "Personal sites and app ideas",
    eyebrow: "Personal projects",
    headline: "Your corner of the internet, done right.",
    sub: "Portfolio sites, personal brand sites, resume sites, and app ideas you've been sitting on. Built properly, without the agency runaround.",
    outcomes: [
      "Stand out to clients and employers",
      "Plain talk, no tech homework",
      "Live on your own domain",
    ],
    pricing: [
      {
        label: "One fixed price",
        body: "You get a real number within one business day of this form.",
      },
    ],
    proof: [{ label: "A personal site we built", href: "https://moe.evogencyglobal.com" }],
    personal: true,
    questions: [
      {
        id: "what",
        q: "What do you have in mind?",
        options: ["A portfolio site", "A personal brand site", "A resume site", "An app idea", "Something else"],
      },
      {
        id: "goal",
        q: "What's it for?",
        options: ["Getting hired", "Getting clients", "Selling something", "Sharing my work"],
      },
      TIMELINE,
      {
        id: "budget",
        q: "What budget feels right?",
        options: ["Under $500", "$500 to $1,500", "Over $1,500", "Not sure, guide me"],
      },
    ],
  },
  {
    slug: "not-sure",
    icon: Compass,
    tile: "Not sure yet",
    tileLine: "Help me figure it out",
    eyebrow: "Not sure yet",
    headline: "Tell us what's bugging you. We'll tell you what fixes it.",
    sub: "No sales script. Answer a few questions and we'll come back with a straight answer on what would actually help, even if it's not us.",
    outcomes: [
      "A plain answer, not a pitch",
      "Where AI could save your team hours",
      "What to fix first for the most money",
    ],
    pricing: [
      {
        label: "Free 30 minute call",
        body: "We talk it through and you leave with a clear next step.",
      },
      {
        label: "AI Audit, $1,500",
        body: "For teams of 10 to 50. We map where the hours go and hand you a ranked plan. Credited in full toward any build within 30 days.",
      },
    ],
    proof: [{ label: "See what we've built", href: "/works" }],
    questions: [
      {
        id: "size",
        q: "How big is the team?",
        options: ["Just me", "2 to 10", "11 to 50", "Over 50"],
      },
      {
        id: "pain",
        q: "What's costing you the most right now?",
        multi: true,
        options: ["Missed calls", "Not enough leads", "Too much busywork", "An old website", "No online sales", "Not sure"],
      },
      {
        id: "next",
        q: "What sounds like the right first step?",
        options: ["A free 30 minute call", "The paid AI Audit", "Just send me ideas"],
      },
    ],
  },
];

export function getStartPath(slug: string): StartPath | undefined {
  return START_PATHS.find((p) => p.slug === slug);
}
