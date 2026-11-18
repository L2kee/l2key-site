import type { Metadata } from "next";
import Link from "next/link";
import { ORG_ID, SITE_URL, breadcrumbs } from "@/lib/schema";

// Product page for ElectricalAI Pro, in the site's own look (2026-11-17,
// Moe: the app is an extension of the site, so it follows the brand). Olive
// accent (the --color-accent-* tokens), warm cream type, .glass panels and
// .btn-solid buttons from globals.css, and the site's lotus backdrop showing
// through instead of a page colored fill. The app itself lives at
// /electricalai-pro/app (static Flutter build) and wears the same palette.

// Plain <a>, not next/link: the app is a static Flutter build, not a Next
// route, so a <Link> prefetch of it 404s.
const APP_HREF = "/electricalai-pro/app";

const TITLE = "ElectricalAI Pro | Electrical Calculators and AI Assistant";
const DESCRIPTION =
  "Free electrical calculators built on NEC tables, plus an AI assistant for electricians. Ampacity, voltage drop, conduit fill, and box fill in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/electricalai-pro" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/electricalai-pro",
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

const MODULES = [
  { n: "01", tag: "AWG", title: "Wire ampacity", body: "Allowable ampacity by size, metal, and 60, 75, or 90°C rating.", foot: "8 AWG Cu · 50 A" },
  { n: "02", tag: "DROP", title: "Voltage drop", body: "Single and three phase drop, checked against 3% and 5% targets.", foot: "2.04% drop" },
  { n: "03", tag: "FILL", title: "Conduit fill", body: "Fill percentage by raceway, trade size, and conductor.", foot: "53 · 31 · 40%" },
  { n: "04", tag: "V·I·R", title: "Ohm's Law", body: "Solve voltage, current, or resistance from any two.", foot: "V = I × R" },
  { n: "05", tag: "M", title: "Motors and transformers", body: "Motor full load current and transformer FLA from kVA.", foot: "FLC · FLA" },
];

const TABLES = [
  { code: "AMP", title: "Conductor ampacity", ref: "Table 310.16 basis" },
  { code: "FILL", title: "Raceway fill", ref: "Chapter 9, Table 1 limits" },
  { code: "BOX", title: "Box fill", ref: "314.16 allowances" },
  { code: "MTR", title: "Motor full load current", ref: "430.248 · 430.250 basis" },
];

// Only what this page visibly says: free, no signup, runs in the browser.
const APP_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/electricalai-pro#app`,
      name: "ElectricalAI Pro",
      description: DESCRIPTION,
      url: `${SITE_URL}/electricalai-pro`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web browser",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      creator: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
    },
    breadcrumbs([
      { name: "Home", path: "" },
      { name: "ElectricalAI Pro", path: "/electricalai-pro" },
    ]),
  ],
};

// Shared type styles. Muted #bdb7ab and faint #8f8a80 are the site's warm
// grays (both at least 5.6:1 on the page); the eyebrow is the site's
// SectionHeading eyebrow.
const MUTED = "text-[#bdb7ab]";
const FAINT = "text-[#8f8a80]";
const EYEBROW = "text-xs font-semibold uppercase tracking-[0.2em] text-[#a3b06a]";
const LABEL = "text-[11px] font-semibold uppercase tracking-[0.14em]";
const RULE = "border-white/10";

// The live dot. Decorative, and it holds still for reduced motion.
function Pulse() {
  return (
    <span aria-hidden="true" className="relative flex size-1.5">
      <span className="absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-60 motion-safe:animate-ping" />
      <span className="relative inline-flex size-1.5 rounded-full bg-accent-cyan" />
    </span>
  );
}

export default function ElectricalAIProPage() {
  return (
    <div className="relative w-full selection:bg-accent-cyan/30">
      {/* Product sub bar. The site nav hides on scroll down, so this sticks
          to the very top and the site nav slides back over it on scroll up.
          On phones the section links drop to a second row instead of
          disappearing. */}
      <div className={`sticky top-0 z-30 border-b ${RULE} bg-[#0b0a09]/85 backdrop-blur-xl`}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 px-5 py-2 sm:px-6 md:h-14 md:flex-nowrap md:py-0">
          <a href="#top-eap" className="flex min-h-11 items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid size-7 place-items-center bg-accent-cyan/15 text-sm text-accent-cyan ring-1 ring-accent-cyan/30 [clip-path:polygon(7px_0,100%_0,100%_calc(100%-7px),calc(100%-7px)_100%,0_100%,0_7px)]"
            >
              ϟ
            </span>
            <span className="text-base font-semibold">
              ElectricalAI <span className="text-accent-cyan">Pro</span>
            </span>
          </a>
          <a href={APP_HREF} className="btn-solid !px-4 !py-1.5 text-sm md:order-last">
            Open the app
          </a>
          <nav
            aria-label="ElectricalAI Pro sections"
            className={`order-last flex w-full items-center gap-6 text-sm ${MUTED} md:order-none md:w-auto md:gap-7`}
          >
            <a href="#calculators" className="py-2 transition-colors hover:text-white">Calculators</a>
            <a href="#assistant" className="py-2 transition-colors hover:text-white">AI Assistant</a>
            <a href="#tables" className="py-2 transition-colors hover:text-white">Code tables</a>
          </nav>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }}
      />
      <div id="top-eap" className="relative">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-6 md:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <div className="glass mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5">
                <Pulse />
                <span className={`${LABEL} ${MUTED}`}>NEC tables · Free · No signup</span>
              </div>
              <h1 className="text-balance text-[2.75rem] font-bold leading-[0.98] tracking-tight sm:text-6xl">
                Electrical math, <span className="gradient-text">jobsite ready.</span>
              </h1>
              <p className={`mt-6 max-w-[46ch] text-pretty text-lg leading-relaxed ${MUTED}`}>
                Precision calculators and an AI assistant for electricians, contractors, and students. The math runs
                on your device, built on the same tables you&apos;d check in the codebook.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={APP_HREF} className="btn-solid text-sm">
                  Start calculating
                </a>
                <a href="#assistant" className="btn-glass text-sm">
                  See a real check
                </a>
              </div>
              <dl className={`mt-10 grid max-w-md grid-cols-3 gap-4 border-t ${RULE} pt-6 sm:gap-6`}>
                <div>
                  <dt className={`${LABEL} ${FAINT}`}>Modules</dt>
                  <dd className="mt-1 text-3xl font-bold">11</dd>
                </div>
                <div>
                  <dt className={`${LABEL} ${FAINT}`}>Code basis</dt>
                  <dd className="mt-1 text-3xl font-bold">NEC</dd>
                </div>
                <div>
                  <dt className={`${LABEL} ${FAINT}`}>Price</dt>
                  <dd className="mt-1 text-3xl font-bold">Free</dd>
                </div>
              </dl>
            </div>

            {/* Worked example card. Every number here is real calculator output
                (40 A, 240 V, 80 ft one way, copper, 75°C), not placeholder copy. */}
            <div id="assistant" className="scroll-mt-40">
              <figure className="glass-strong overflow-hidden rounded-2xl">
                <div className={`flex items-center justify-between border-b ${RULE} px-4 py-3`}>
                  <div className="flex items-center gap-2">
                    <Pulse />
                    <span className={`${LABEL} ${MUTED}`}>Wire check</span>
                  </div>
                  <span className={`${LABEL} ${FAINT}`}>Example</span>
                </div>
                <div className="space-y-4 p-4 sm:p-5">
                  <p className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm bg-accent-cyan/15 px-4 py-3 text-base ring-1 ring-accent-cyan/25">
                    <span className="sr-only">Question. </span>
                    What copper wire for a 40 A, 240 V circuit, 80 ft one way?
                  </p>
                  <div className={`max-w-[94%] rounded-2xl rounded-tl-sm bg-[#191816] px-4 py-3 text-base ${MUTED} ring-1 ring-white/10`}>
                    <p>
                      <span className="sr-only">Answer. </span>
                      Go with <strong className="font-semibold text-[#f4f1ea]">8 AWG</strong> copper. 10 AWG only
                      carries 35 A in the 75°C column, so it fails before voltage drop even comes into it.
                    </p>
                    <dl className={`mt-4 grid grid-cols-3 gap-2 border-t ${RULE} pt-3`}>
                      <div>
                        <dt className={`${LABEL} ${FAINT}`}>Ampacity</dt>
                        <dd className="mt-1 font-semibold text-[#f4f1ea]">50 A</dd>
                      </div>
                      <div>
                        <dt className={`${LABEL} ${FAINT}`}>Voltage drop</dt>
                        <dd className="mt-1 font-semibold text-[#f4f1ea]">2.04%</dd>
                      </div>
                      <div>
                        <dt className={`${LABEL} ${FAINT}`}>Result</dt>
                        <dd className="mt-1 font-semibold text-accent-cyan">Passes</dd>
                      </div>
                    </dl>
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-accent-cyan/10 px-3 py-2 ring-1 ring-accent-cyan/20">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-accent-cyan" />
                      <span className="text-sm text-accent-cyan">Table 310.16 basis · 75°C column</span>
                    </div>
                  </div>
                </div>
              </figure>
              <p className={`mt-3 px-1 text-sm ${FAINT}`}>
                Numbers from the app&apos;s own calculators. Planning aid only, so confirm with your codebook and
                the AHJ.
              </p>
            </div>
          </div>
        </section>

        {/* Calculators */}
        <section id="calculators" aria-labelledby="calculators-title" className="mx-auto max-w-6xl scroll-mt-40 px-5 py-16 sm:px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className={EYEBROW}>(a) Calculators</p>
              <h2 id="calculators-title" className="glass-text mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                The full bench, one surface.
              </h2>
            </div>
            <p className={`hidden text-sm md:block ${FAINT}`}>11 modules</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((m) => (
              <li key={m.n}>
                <a
                  href={APP_HREF}
                  className="glass group flex h-full flex-col rounded-2xl p-5 transition-colors hover:border-accent-cyan/50"
                >
                  <span aria-hidden="true" className={`flex items-center justify-between ${LABEL} ${FAINT}`}>
                    <span>{m.n}</span>
                    <span>{m.tag}</span>
                  </span>
                  <h3 className="mt-4 text-xl font-semibold">{m.title}</h3>
                  <span className={`mt-1 text-base ${MUTED}`}>{m.body}</span>
                  <span aria-hidden="true" className={`mt-auto flex items-center justify-between border-t ${RULE} pt-3 text-sm ${FAINT}`}>
                    <span className="mt-4">{m.foot}</span>
                    <span className="mt-4 text-accent-cyan transition-transform motion-safe:group-hover:translate-x-1">→</span>
                  </span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={APP_HREF}
                className="glass group flex h-full flex-col rounded-2xl !border-accent-cyan/40 p-5 transition-colors hover:!border-accent-cyan/70"
              >
                <span aria-hidden="true" className={`flex justify-between ${LABEL} text-accent-cyan`}>
                  <span>+</span>
                  <span>More</span>
                </span>
                <h3 className="mt-4 text-xl font-semibold">6 more modules</h3>
                <span className={`mt-1 text-base ${MUTED}`}>
                  Box fill, circuit load, voltage drop comparison, unit conversion, and an NEC quick reference.
                </span>
                <span aria-hidden="true" className="mt-auto flex justify-between border-t border-accent-cyan/25 pt-3 text-sm text-accent-cyan">
                  <span className="mt-4">Explore the suite</span>
                  <span className="mt-4 transition-transform motion-safe:group-hover:translate-x-1">→</span>
                </span>
              </a>
            </li>
          </ul>
        </section>

        {/* Code tables */}
        <section id="tables" aria-labelledby="tables-title" className="mx-auto max-w-6xl scroll-mt-40 px-5 py-16 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className={EYEBROW}>(b) Code tables</p>
              <h2 id="tables-title" className="glass-text mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Numbers you can check.
              </h2>
              <p className={`mt-4 max-w-[44ch] text-lg ${MUTED}`}>
                Each calculator is built on the NEC table you&apos;d reach for anyway, so when a number matters on
                site or on the plan, you know exactly where to check it.
              </p>
              <ul className="mt-8 space-y-3">
                {TABLES.map((t) => (
                  <li key={t.code} className="glass flex items-center gap-3 rounded-xl px-4 py-3">
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 place-items-center bg-accent-cyan/15 text-[10px] font-semibold tracking-wider text-accent-cyan [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)]"
                    >
                      {t.code}
                    </span>
                    <span>
                      <span className="block text-base font-semibold">{t.title}</span>
                      <span className={`block text-sm ${FAINT}`}>{t.ref}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <figure className="glass-strong overflow-hidden rounded-2xl" aria-labelledby="check-title">
              <div className={`flex justify-between border-b ${RULE} px-4 py-3`}>
                <span id="check-title" className={`${LABEL} ${MUTED}`}>Check · 8 AWG Cu</span>
                <span className={`${LABEL} text-accent-cyan`}>Pass</span>
              </div>
              {/* The bars are pictures of the numbers beside them, so screen
                  readers get the numbers and skip the bars. */}
              <div className="space-y-5 p-5">
                <div>
                  <div className="flex justify-between text-base">
                    <span className={MUTED}>Load vs. ampacity</span>
                    <span>40 A / 50 A</span>
                  </div>
                  <div aria-hidden="true" className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-accent-cyan to-accent-teal" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-base">
                    <span className={MUTED}>Voltage drop vs. 3% target</span>
                    <span>2.04% / 3%</span>
                  </div>
                  <div aria-hidden="true" className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-accent-cyan to-accent-teal" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-base">
                    <span className={MUTED}>10 AWG, same run</span>
                    <span className="text-[#f87171]">35 A · fails</span>
                  </div>
                  <div aria-hidden="true" className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-full rounded-full bg-[#f87171]/70" />
                  </div>
                </div>
                <p className="rounded-lg bg-accent-cyan/10 px-3 py-2 text-sm text-accent-cyan ring-1 ring-accent-cyan/20">
                  Table 310.16 basis · 240 V · 80 ft one way
                </p>
              </div>
            </figure>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="cta-title" className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
          <div className="glass-strong overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-16">
            <h2 id="cta-title" className="glass-text mx-auto max-w-[18ch] text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Put precision on the job.
            </h2>
            <p className={`mx-auto mt-4 max-w-[46ch] text-lg ${MUTED}`}>
              Free, no signup. Runs in your browser and installs to your phone&apos;s home screen in one tap.
            </p>
            <a href={APP_HREF} className="btn-solid mt-8 text-base">
              Open ElectricalAI Pro
            </a>
            <p className={`mt-8 text-base ${FAINT}`}>
              Want an app like this for your business?{" "}
              <Link
                href="/mobile-app-development-orlando"
                className={`${MUTED} underline decoration-white/30 underline-offset-4 hover:text-white`}
              >
                EVOGENCY builds them.
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
