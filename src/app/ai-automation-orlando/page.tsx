import type { Metadata } from "next";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/cta-band";
import { servicePageGraph } from "@/lib/schema";

const TITLE = "AI Automation Orlando | EVOGENCY";
const DESCRIPTION =
  "EVOGENCY builds AI agents and automation for Orlando businesses: instant lead response, workflows connected across the tools you already use, and follow up that never gets missed.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/ai-automation-orlando" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/ai-automation-orlando",
    siteName: "EVOGENCY",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "EVOGENCY: Evolve. Elevate. Grow." }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
};

const LEAKS = [
  {
    title: "Capture and intake",
    body: "A lead fills out a form at 9pm and doesn't hear back until Monday morning. By then they've already called someone else.",
  },
  {
    title: "Workflow and operations",
    body: "The same customer details get typed into three different systems by three different people, and none of them ever quite match.",
  },
  {
    title: "Follow up and retention",
    body: "A quote or booking gets left half finished and nobody follows up, so a nearly closed sale just quietly disappears.",
  },
];

const INCLUDED = [
  {
    title: "A real workflow audit",
    body: "We map exactly where time and leads are leaking before we build anything, so every automation solves a real problem, not a guessed one.",
  },
  {
    title: "AI agents that do real work",
    body: "Agents for lead qualification, customer support, and research, built around how your business actually operates, not a generic script.",
  },
  {
    title: "Automation on the tools you already have",
    body: "Connected automation, not a rip and replace. Your CRM, calendar, and phone system stay exactly where they are.",
  },
  {
    title: "Monitoring that catches failures fast",
    body: "Automations get watched, not set and forgotten. When something breaks, we catch it in hours, not when a customer complains.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Map the process",
    body: "We walk through how work actually moves through your business today, not how the org chart says it should.",
  },
  {
    step: "02",
    title: "Design the blueprint",
    body: "A clear plan for exactly what gets automated, in what order, and why, before a single tool gets touched.",
  },
  {
    step: "03",
    title: "Build and connect",
    body: "Automations get built directly into the tools you already run on, tested against the messy edge cases real customers create.",
  },
  {
    step: "04",
    title: "Launch and keep watching",
    body: "We monitor what we build after it goes live and adjust it as your business changes, instead of walking away once it's turned on.",
  },
];

const FAQ = [
  {
    q: "Do we need a bunch of new software?",
    a: "No. We build automation on top of the tools you already use, your CRM, your calendar, your phone system. The goal is fewer logins, not more.",
  },
  {
    q: "Will this replace my team?",
    a: "No. It replaces the manual data entry and copy pasting that eats their time, so they can spend it on the parts of the job that actually need a person.",
  },
  {
    q: "How is this different from just using Zapier?",
    a: "Zapier is one piece of the puzzle. We design the whole workflow around your business first, build it to handle real edge cases, and then actually watch it, so a silent failure gets caught in hours instead of showing up as a customer complaint weeks later.",
  },
  {
    q: "How fast will we see results?",
    a: "Faster response to new leads can show up within days of launch. A full intake to close automation takes longer and depends on how many systems are involved.",
  },
  {
    q: "Do the automations just run forever untouched?",
    a: "No. Businesses change, so the workflows get revisited and adjusted on an ongoing basis, not built once and forgotten.",
  },
  {
    q: "Can you guarantee this will save us a specific amount of time or money?",
    a: "No, and you should be skeptical of anyone who gives you an exact number before looking at your business. What we can tell you honestly after the audit is exactly where the leaks are and what closing them is worth.",
  },
  {
    q: "What is AI automation for a small business?",
    a: "It's using software and AI agents to handle the repetitive parts of running a business, answering common questions, moving leads through your pipeline, following up on quotes, so your team spends time on the work that actually needs a person.",
  },
  {
    q: "How much does business automation cost?",
    a: "It depends on how many workflows need to be built and how many systems they connect to. A workflow audit gives you a real number instead of a guess.",
  },
  {
    q: "Is there an AI automation agency near me in Orlando?",
    a: "Yes. EVOGENCY is based in Orlando and builds AI agents and automation for local businesses directly, not through an offshore team.",
  },
];

export default function AiAutomationOrlandoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicePageGraph("/ai-automation-orlando", DESCRIPTION, FAQ)) }}
      />
      <SectionHeading
        as="h1"
        eyebrow="AI Agents & Automation in Orlando, FL"
        title="AI Automation Orlando"
      />
      <p className="mx-auto mt-6 max-w-2xl text-center text-white/65">
        Every missed call, slow lead response, and manual data entry is money
        leaking out of your business. EVOGENCY builds AI agents and
        automation that plug into the tools you already use, so nothing
        falls through the cracks.
      </p>

      <div className="mt-16">
        <SectionHeading eyebrow="Where work leaks" title="The moments most Orlando businesses lose money" />
        <div className="mt-10 space-y-6">
          {LEAKS.map((item) => (
            <TiltCard key={item.title} className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{item.body}</p>
            </TiltCard>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <SectionHeading eyebrow="What's included" title="What we actually build" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {INCLUDED.map((item) => (
            <TiltCard key={item.title} className="glass h-full rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{item.body}</p>
            </TiltCard>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <SectionHeading eyebrow="How it works" title="A process built on being honest, not flashy" />
        <div className="mt-10 space-y-8">
          {PROCESS.map((p) => (
            <div key={p.step} className="flex gap-6 border-b border-white/10 pb-8 last:border-0">
              <span className="shrink-0 text-2xl font-bold text-[#f0c14b]/50">{p.step}</span>
              <div>
                <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CtaBand text="Get Your Free Audit" />

      <div className="mt-20">
        <SectionHeading eyebrow="Frequently asked" title="AI automation Orlando: the honest answers" />
        <div className="mt-10 space-y-6">
          {FAQ.map((item) => (
            <TiltCard key={item.q} className="glass rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white">{item.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{item.a}</p>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  );
}
