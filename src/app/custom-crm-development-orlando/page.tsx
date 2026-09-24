import type { Metadata } from "next";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/cta-band";
import { servicePageGraph } from "@/lib/schema";

const TITLE = "Custom CRM Development Orlando | EVOGENCY";
const DESCRIPTION =
  "EVOGENCY builds custom CRM platforms for Orlando businesses: real pipeline management, lead tracking, and automation built around how your business actually works.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/custom-crm-development-orlando" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/custom-crm-development-orlando",
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

const INCLUDED = [
  {
    title: "Pipeline and lead management",
    body: "A pipeline built around your actual sales stages, not generic categories that don't match how your business really moves a deal forward.",
  },
  {
    title: "Built to connect with the tools you use",
    body: "Your CRM talks to your email, your calendar, and your outreach, so information doesn't have to be re entered by hand across five different systems.",
  },
  {
    title: "Role based access",
    body: "Give your team exactly the access they need and nothing more, whether that's a salesperson, a manager, or an outside contractor.",
  },
  {
    title: "Real ownership, not a per seat license",
    body: "A custom CRM you actually own outright, instead of paying a growing per seat subscription forever as your team grows.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Map your process",
    body: "We learn how leads and customers actually move through your business today, not how a generic CRM assumes they should.",
  },
  {
    step: "02",
    title: "Design the system",
    body: "A CRM structured around your specific pipeline stages, fields, and workflows, not a one size fits all template.",
  },
  {
    step: "03",
    title: "Build and connect",
    body: "The CRM gets built and connected to the tools you already use, tested against how your team actually works day to day.",
  },
  {
    step: "04",
    title: "Launch and support",
    body: "Once it's live we keep improving it as your business grows and your process changes.",
  },
];

const FAQ = [
  {
    q: "What is a custom CRM?",
    a: "It's a system built specifically around how your business tracks leads and customers, instead of a generic tool you have to adapt your process to fit.",
  },
  {
    q: "Why build a custom CRM instead of using something like HubSpot or Salesforce?",
    a: "Off the shelf tools work fine for a lot of businesses, but they charge per seat forever and force you into their categories and workflow. A custom CRM is built around your actual process and you own it outright.",
  },
  {
    q: "Do you have real CRM experience or is this new?",
    a: "Yes. Agency OS, the CRM running EVOGENCY's own pipeline, prospecting, and outreach today, was built entirely in house. It's not a demo, it's the tool we use every day, and you can see it on the Work page.",
  },
  {
    q: "How long does it take to build a custom CRM?",
    a: "It depends on how many pipelines, integrations, and users are involved. A simple single pipeline CRM takes far less time than a full multi team system with role based access and outreach automation built in.",
  },
  {
    q: "How much does custom CRM development cost in Orlando?",
    a: "It depends on the scope. A workflow audit gives you a real number based on what your business actually needs, not a generic package price.",
  },
  {
    q: "Is there a CRM developer near me in Orlando?",
    a: "Yes. EVOGENCY is based in Orlando and builds custom CRM platforms directly for local businesses, not through an outside contractor.",
  },
  {
    q: "Can the CRM grow with my business later?",
    a: "Yes. Since it's built and owned by you, new pipelines, fields, and automations can be added later instead of being locked into whatever tier a subscription service decides to sell you.",
  },
];

export default function CustomCrmDevelopmentOrlandoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicePageGraph("/custom-crm-development-orlando", DESCRIPTION, FAQ)) }}
      />
      <SectionHeading
        as="h1"
        eyebrow="Custom CRM Development in Orlando, FL"
        title="Custom CRM Development Orlando"
      />
      <p className="mx-auto mt-6 max-w-2xl text-center text-white/65">
        Off the shelf CRM software forces your business to work around its
        limitations. EVOGENCY builds custom CRM platforms shaped around how
        you actually sell, track leads, and manage customers, not a generic
        template you have to bend your process to fit.
      </p>

      <div className="mt-16">
        <SectionHeading eyebrow="What's included" title="What a custom CRM should actually do for you" />
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
        <SectionHeading eyebrow="Frequently asked" title="Custom CRM development Orlando: the honest answers" />
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
