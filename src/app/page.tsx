import Image from "next/image";
import {
  Globe2,
  Star,
  Search,
  Code2,
  Smartphone,
  Bot,
  ArrowRight,
  ExternalLink,
  Mail,
  Phone,
  CalendarClock,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { TiltCard } from "@/components/tilt-card";

const SERVICES = [
  {
    icon: Globe2,
    title: "Websites That Convert",
    body: "Fast, mobile-first websites built to turn visitors into calls and bookings — not just look nice sitting there.",
  },
  {
    icon: Search,
    title: "SEO That Gets Found",
    body: "On-page SEO, local search optimization, and technical fixes so your business shows up when people are actually looking.",
  },
  {
    icon: Star,
    title: "Google Reviews & Presence",
    body: "Google Business Profile setup and review-generation systems that turn happy customers into 5-star social proof.",
  },
];

const WORK = [
  {
    title: "Agency OS",
    body: "A full CRM and prospecting platform built from the ground up: pipeline management, local-business prospecting, outreach sequences, a cold-calling playbook, and role-based access — live in production today.",
    linkLabel: "View live app",
    href: "https://agency-os-v2-sage.vercel.app",
  },
  {
    title: "ElectricalAI Pro",
    body: "An AI-powered Windows desktop app built for electricians: an AI electrical assistant, six professional electrical calculators, and a FastAPI/Python backend — built with Flutter and Dart, v1.0.0 shipped.",
    linkLabel: "View on GitHub",
    href: "https://github.com/L2kee/ElectricalAI-Pro",
  },
];

const SKILLS = [
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
    tags: ["Dart", "Flutter", "Cross-platform"],
  },
];

export default function Home() {
  return (
    <div id="top">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-20 pb-24 text-center sm:pt-28">
        <div className="glass-strong flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-white/80">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f0c14b]" />
          Available for new projects
        </div>

        <div className="mt-8 h-28 w-28 overflow-hidden rounded-full shadow-[0_20px_60px_-15px_rgba(240,193,75,0.55)] sm:h-32 sm:w-32">
          <Image
            src="/evogency-logo.png"
            alt="EVOGENCY"
            width={128}
            height={128}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <h1 className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-6xl">
          <span className="gradient-text">EVOGENCY</span>
        </h1>
        <p className="mt-3 text-lg font-medium text-white/50">
          Evolve. Elevate. Grow.
        </p>

        <p className="mt-6 max-w-2xl text-balance text-white/70 sm:text-lg">
          We help local businesses build a real online presence: professional
          websites, stronger Google reviews, and SEO that actually gets
          found — so more of the right people walk through the door.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#contact" className="btn-solid">
            Get a free site audit <ArrowRight size={16} />
          </a>
          <a href="#work" className="btn-glass text-white">
            See our work
          </a>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-5xl px-6 py-20">
        <SectionHeading eyebrow="What we do" title="Services built to grow your business" />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {SERVICES.map((s) => (
            <TiltCard key={s.title} className="glass h-full rounded-2xl p-6">
              <s.icon size={28} style={{ color: "#f0c14b" }} />
              <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{s.body}</p>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="mx-auto max-w-5xl px-6 py-20">
        <SectionHeading eyebrow="What we build with" title="The toolkit behind the work" />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {SKILLS.map((s) => (
            <TiltCard key={s.title} className="glass h-full rounded-2xl p-6">
              <s.icon size={28} style={{ color: "#c9922c" }} />
              <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Work / Proof */}
      <section id="work" className="mx-auto max-w-5xl px-6 py-20">
        <SectionHeading eyebrow="Proof, not promises" title="Real tools, actually shipped" />
        <div className="mt-12 space-y-6">
          {WORK.map((w) => (
            <TiltCard key={w.title} className="glass-strong rounded-2xl p-8">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-xl font-semibold text-white">{w.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">{w.body}</p>
                </div>
                <a
                  href={w.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass shrink-0 text-white"
                >
                  {w.linkLabel} <ArrowRight size={16} />
                </a>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section id="founder" className="mx-auto max-w-3xl px-6 py-20">
        <SectionHeading eyebrow="Who's behind it" title="Founder" />
        <div className="mt-12">
          <TiltCard className="glass-strong flex flex-col items-center gap-6 rounded-3xl p-10 text-center sm:flex-row sm:text-left">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10 shadow-[0_20px_50px_-15px_rgba(240,193,75,0.5)]">
              <Image
                src="/moe-avatar.png"
                alt="Mohamed Eltoukhy"
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Mohamed Eltoukhy</h3>
              <p className="text-sm font-medium text-[#f0c14b]">Founder, EVOGENCY</p>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                I build the websites, tools, and systems behind EVOGENCY myself —
                from full CRM platforms to the sites and SEO work we run for
                clients. Every project ships real, working software, not just
                a pitch deck.
              </p>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-3xl px-6 py-20">
        <TiltCard className="glass-strong rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Let&apos;s get your business found online
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/65">
            Free, no-pressure audit of your current site and Google presence —
            we&apos;ll tell you exactly what&apos;s costing you customers.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="tel:+18138971954" className="btn-solid">
              <Phone size={16} /> Call (813) 897-1954
            </a>
            <a
              href="https://calendly.com/mohamed-eltoukhy011/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass text-white"
            >
              <CalendarClock size={16} /> Book a call
            </a>
            <a href="mailto:mohamed.eltoukhy011@gmail.com" className="btn-glass text-white">
              <Mail size={16} /> Email us
            </a>
            <a
              href="https://github.com/L2kee"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass text-white"
            >
              <ExternalLink size={16} /> GitHub
            </a>
          </div>
        </TiltCard>
      </section>

      <footer className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 pb-10 pt-6 text-center">
        <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md">
          <Image src="/evogency-logo.png" alt="EVOGENCY" width={28} height={28} className="h-8 w-8 object-cover" />
        </span>
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} EVOGENCY — Evolve. Elevate. Grow.
        </p>
      </footer>
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f0c14b]/80">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
