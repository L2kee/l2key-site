import type { Metadata } from "next";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/cta-band";
import { faqSchema } from "@/lib/faq-schema";

const TITLE = "Mobile App Development Orlando | EVOGENCY";
const DESCRIPTION =
  "EVOGENCY builds custom mobile and desktop apps for Orlando businesses, cross platform with Flutter and backed by real, shipped software, not just mockups.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/mobile-app-development-orlando" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/mobile-app-development-orlando",
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
    title: "Cross platform builds",
    body: "Built once with Flutter and shipped to iOS, Android, and desktop, instead of paying to build and maintain three separate codebases.",
  },
  {
    title: "A real backend, not just a pretty screen",
    body: "A proper backend behind the app, built with Python and FastAPI, handling the actual logic, data, and any AI features the app needs.",
  },
  {
    title: "AI features built in when they help",
    body: "AI assistants, smart calculators, and automated features, only added where they genuinely make the app more useful, not bolted on for a buzzword.",
  },
  {
    title: "Shipped and maintained, not abandoned at launch",
    body: "Bug fixes, updates, and new features after launch, since a real app keeps changing as real users use it.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Define the real problem",
    body: "We start with the actual problem your app needs to solve for the person using it, not a feature list.",
  },
  {
    step: "02",
    title: "Design the experience",
    body: "A simple, clear interface built around how people actually use their phone, not a desktop layout squeezed onto a smaller screen.",
  },
  {
    step: "03",
    title: "Build and test",
    body: "The app gets built cross platform and tested on real devices before anyone outside the team touches it.",
  },
  {
    step: "04",
    title: "Ship and support",
    body: "Launched to the app stores or as a desktop install, then supported and improved as real users start using it.",
  },
];

const FAQ = [
  {
    q: "Do you have real apps you've actually shipped?",
    a: "Yes. ElectricalAI Pro is a live v1.0.0 Windows app built for electricians, with an AI assistant, professional calculators, and a Python backend. You can see it on the Work page and on GitHub.",
  },
  {
    q: "What is cross platform app development?",
    a: "It means building the app once with a single codebase, using Flutter, and shipping it to multiple platforms like iOS, Android, and desktop, instead of building and maintaining a separate app for each one.",
  },
  {
    q: "How much does it cost to build a mobile app in Orlando?",
    a: "It depends entirely on the scope, how many screens, what backend logic is needed, and whether AI features are involved. A real scoping conversation gives you an honest number, not a generic package price.",
  },
  {
    q: "How long does it take to build an app?",
    a: "A simple utility app can take a matter of weeks. Anything with a custom backend, accounts, or AI features takes longer. We give you a real timeline after understanding what you actually need.",
  },
  {
    q: "Do you build native iOS and Android apps or just cross platform?",
    a: "Flutter is our primary approach because it ships to every platform from one codebase without sacrificing performance, but the right tool depends on what your app actually needs to do.",
  },
  {
    q: "Is there an app developer near me in Orlando?",
    a: "Yes. EVOGENCY is based in Orlando and builds mobile and desktop apps directly, not through an outside contractor.",
  },
  {
    q: "Can you add AI features to an app that already exists?",
    a: "Yes. AI assistants, smart automation, and other AI features can often be added to an app you already have, not just built into something new from scratch.",
  },
];

export default function MobileAppDevelopmentOrlandoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(FAQ)) }}
      />
      <SectionHeading
        as="h1"
        eyebrow="Mobile App Development in Orlando, FL"
        title="Mobile App Development Orlando"
      />
      <p className="mx-auto mt-6 max-w-2xl text-center text-white/65">
        Most agencies talk about apps. EVOGENCY ships them. ElectricalAI Pro,
        a real AI powered app for electricians, is live today, built the
        same way your app would be, from a real business need to a real
        product people actually use.
      </p>

      <div className="mt-16">
        <SectionHeading eyebrow="What's included" title="What real app development should actually look like" />
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
        <SectionHeading eyebrow="Frequently asked" title="Mobile app development Orlando: the honest answers" />
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
