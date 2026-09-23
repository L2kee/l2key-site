import type { Metadata } from "next";
import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";

// Product page for ElectricalAI Pro, styled in the app's own "kinetic
// glass" look (ink, hairline glass panels, one cyan signal color) rather
// than the site's gold theme, so the page and the app read as one product.
// The app itself lives at /electricalai-pro/app (static Flutter build).

const inter = Inter({ subsets: ["latin"], variable: "--font-eap-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-eap-mono" });

// Plain <a>, not next/link: the app is a static Flutter build, not a Next
// route, so a <Link> prefetch of it 404s.
const APP_HREF = "/electricalai-pro/app";

const TITLE = "ElectricalAI Pro | Electrical Calculators and AI Assistant";
const DESCRIPTION =
  "Free electrical calculators built on NEC tables, plus an AI assistant for electricians. Wire ampacity, voltage drop, conduit fill, box fill, and more, right in your browser.";

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

function Mono({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`font-[family-name:var(--font-eap-mono)] ${className}`}>{children}</span>;
}

function Pulse() {
  return (
    <span className="relative flex size-1.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00d3e3] opacity-60" />
      <span className="relative inline-flex size-1.5 rounded-full bg-[#00d3e3]" />
    </span>
  );
}

export default function ElectricalAIProPage() {
  return (
    <div
      className={`${inter.variable} ${mono.variable} relative w-full bg-[#060a12] font-[family-name:var(--font-eap-sans)] text-[#f1f5f9] selection:bg-[#00d3e3]/30`}
    >
      {/* Faint cyan glow behind the hero so the ink reads as depth, not a flat fill. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(60rem_28rem_at_70%_0%,rgba(0,211,227,0.10),transparent_70%)]"
      />

      {/* Product sub bar. The site nav hides on scroll down, so this sticks
          to the very top and the site nav slides back over it on scroll up. */}
      <div className="sticky top-0 z-30 border-b border-[#1c2735] bg-[#060a12]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-6">
          <a href="#top-eap" className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid size-7 place-items-center rounded-md bg-[#00d3e3]/15 text-sm text-[#00d3e3] ring-1 ring-[#00d3e3]/30"
            >
              ϟ
            </span>
            <span className="text-sm font-semibold">
              ElectricalAI <span className="text-[#00d3e3]">Pro</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-[#94a0b2] md:flex" aria-label="ElectricalAI Pro sections">
            <a href="#calculators" className="transition-colors hover:text-white">Calculators</a>
            <a href="#assistant" className="transition-colors hover:text-white">AI Assistant</a>
            <a href="#tables" className="transition-colors hover:text-white">Code tables</a>
          </nav>
          <a
            href={APP_HREF}
            className="rounded-full bg-[#00d3e3] px-4 py-1.5 text-sm font-semibold text-[#041016] transition-colors hover:bg-[#5ee8f2]"
          >
            Open the app
          </a>
        </div>
      </div>

      <main id="top-eap" className="relative">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-6 md:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1c2735] bg-[#0a111d]/60 px-3 py-1.5">
                <Pulse />
                <Mono className="text-[11px] uppercase tracking-wider text-[#94a0b2]">NEC tables · Free · No signup</Mono>
              </div>
              <h1 className="text-balance text-[2.6rem] font-extrabold leading-[0.98] tracking-tight sm:text-6xl">
                Electrical math, <span className="text-[#00d3e3]">jobsite ready.</span>
              </h1>
              <p className="mt-6 max-w-[46ch] text-pretty text-lg leading-relaxed text-[#94a0b2]">
                Precision calculators and an AI assistant for electricians, contractors, and students. The math runs
                on your device, built on the same tables you&apos;d check in the codebook.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={APP_HREF}
                  className="rounded-full bg-[#00d3e3] px-6 py-3 text-sm font-semibold text-[#041016] transition-colors hover:bg-[#5ee8f2]"
                >
                  Start calculating
                </a>
                <a
                  href="#assistant"
                  className="rounded-full border border-[#1c2735] bg-[#0a111d]/40 px-6 py-3 text-sm font-medium transition-colors hover:border-[#5e6b7d]"
                >
                  See a real check
                </a>
              </div>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-[#1c2735] pt-6 sm:gap-6">
                <div>
                  <dt><Mono className="text-[10px] uppercase tracking-wider text-[#5e6b7d]">Modules</Mono></dt>
                  <dd className="mt-1 text-2xl font-bold">11</dd>
                </div>
                <div>
                  <dt><Mono className="text-[10px] uppercase tracking-wider text-[#5e6b7d]">Code basis</Mono></dt>
                  <dd className="mt-1 text-2xl font-bold">NEC</dd>
                </div>
                <div>
                  <dt><Mono className="text-[10px] uppercase tracking-wider text-[#5e6b7d]">Price</Mono></dt>
                  <dd className="mt-1 text-2xl font-bold">Free</dd>
                </div>
              </dl>
            </div>

            {/* Worked example card. Every number here is real calculator output
                (40 A, 240 V, 80 ft one way, copper, 75°C), not placeholder copy. */}
            <div id="assistant" className="scroll-mt-40">
              <div className="overflow-hidden rounded-2xl border border-[#1c2735] bg-[#0a111d]/80 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8),0_0_60px_-30px_rgba(0,211,227,0.25)] ring-1 ring-white/[0.03]">
                <div className="flex items-center justify-between border-b border-[#1c2735] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Pulse />
                    <Mono className="text-[11px] uppercase tracking-wider text-[#94a0b2]">Wire check</Mono>
                  </div>
                  <Mono className="text-[11px] text-[#5e6b7d]">Example</Mono>
                </div>
                <div className="space-y-4 p-4 sm:p-5">
                  <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm bg-[#00d3e3]/15 px-4 py-3 text-sm ring-1 ring-[#00d3e3]/20">
                    What copper wire for a 40 A, 240 V circuit, 80 ft one way?
                  </div>
                  <div className="max-w-[94%] rounded-2xl rounded-tl-sm bg-[#0c1523] px-4 py-3 text-sm text-[#94a0b2] ring-1 ring-[#1c2735]">
                    <p>
                      Go with <strong className="font-semibold text-white">8 AWG</strong> copper. 10 AWG only carries
                      35 A in the 75°C column, so it fails before voltage drop even comes into it.
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#1c2735] pt-3">
                      <div>
                        <Mono className="block text-[9px] uppercase tracking-wider text-[#5e6b7d] sm:text-[10px]">Ampacity</Mono>
                        <div className="mt-1 text-sm font-semibold text-white">50 A</div>
                      </div>
                      <div>
                        <Mono className="block text-[9px] uppercase tracking-wider text-[#5e6b7d] sm:text-[10px]">Voltage drop</Mono>
                        <div className="mt-1 text-sm font-semibold text-white">2.04%</div>
                      </div>
                      <div>
                        <Mono className="block text-[9px] uppercase tracking-wider text-[#5e6b7d] sm:text-[10px]">Result</Mono>
                        <div className="mt-1 text-sm font-semibold text-[#00d3e3]">Passes</div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#00d3e3]/10 px-3 py-2 ring-1 ring-[#00d3e3]/20">
                      <span className="size-1.5 rounded-full bg-[#00d3e3]" />
                      <Mono className="text-[11px] text-[#00d3e3]">Table 310.16 basis · 75°C column</Mono>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 px-1 text-xs text-[#5e6b7d]">
                Numbers from the app&apos;s own calculators. Planning aid: confirm with your codebook and the AHJ.
              </p>
            </div>
          </div>
        </section>

        {/* Calculators */}
        <section id="calculators" className="mx-auto max-w-6xl scroll-mt-40 px-5 py-16 sm:px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <Mono className="text-[11px] uppercase tracking-wider text-[#00d3e3]">(a) Calculators</Mono>
              <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">The full bench, one surface.</h2>
            </div>
            <Mono className="hidden text-xs text-[#5e6b7d] md:block">11 modules</Mono>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((m) => (
              <a
                key={m.n}
                href={APP_HREF}
                className="group rounded-2xl border border-[#1c2735] bg-[#0a111d]/50 p-5 transition-colors hover:border-[#00d3e3]/40"
              >
                <div className="flex items-center justify-between">
                  <Mono className="text-[11px] text-[#5e6b7d]">{m.n}</Mono>
                  <Mono className="text-[11px] text-[#5e6b7d]">{m.tag}</Mono>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{m.title}</h3>
                <p className="mt-1 text-sm text-[#94a0b2]">{m.body}</p>
                <div className="mt-4 flex items-center justify-between border-t border-[#1c2735] pt-3">
                  <Mono className="text-xs text-[#5e6b7d]">{m.foot}</Mono>
                  <span className="text-[#00d3e3] transition-transform group-hover:translate-x-1">→</span>
                </div>
              </a>
            ))}
            <a
              href={APP_HREF}
              className="group rounded-2xl border border-[#00d3e3]/30 bg-[#00d3e3]/5 p-5 transition-colors hover:border-[#00d3e3]/60"
            >
              <div className="flex justify-between">
                <Mono className="text-[11px] text-[#00d3e3]">+</Mono>
                <Mono className="text-[11px] text-[#00d3e3]">MORE</Mono>
              </div>
              <h3 className="mt-4 text-lg font-semibold">6 more modules</h3>
              <p className="mt-1 text-sm text-[#94a0b2]">Box fill, circuit load, voltage drop comparison, unit conversion, and an NEC quick reference.</p>
              <div className="mt-4 flex justify-between border-t border-[#00d3e3]/20 pt-3">
                <Mono className="text-xs text-[#00d3e3]">Explore the suite</Mono>
                <span className="text-[#00d3e3] transition-transform group-hover:translate-x-1">→</span>
              </div>
            </a>
          </div>
        </section>

        {/* Code tables */}
        <section id="tables" className="mx-auto max-w-6xl scroll-mt-40 px-5 py-16 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Mono className="text-[11px] uppercase tracking-wider text-[#00d3e3]">(b) Code tables</Mono>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Numbers you can check.</h2>
              <p className="mt-4 max-w-[44ch] text-[#94a0b2]">
                Each calculator is built on the NEC table you&apos;d reach for anyway, so when a number matters on
                site or on the plan, you know exactly where to check it.
              </p>
              <div className="mt-8 space-y-3">
                {TABLES.map((t) => (
                  <div key={t.code} className="flex items-center gap-3 rounded-xl border border-[#1c2735] bg-[#0a111d]/50 px-4 py-3">
                    <Mono className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#00d3e3]/15 text-[10px] text-[#00d3e3] ring-1 ring-[#00d3e3]/25">
                      {t.code}
                    </Mono>
                    <div>
                      <div className="text-sm font-semibold">{t.title}</div>
                      <Mono className="text-[11px] text-[#5e6b7d]">{t.ref}</Mono>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#1c2735] bg-[#0c1523] ring-1 ring-white/[0.03]">
              <div className="flex justify-between border-b border-[#1c2735] px-4 py-3">
                <Mono className="text-[11px] uppercase tracking-wider text-[#94a0b2]">Check · 8 AWG Cu</Mono>
                <Mono className="text-[11px] uppercase tracking-wider text-[#00d3e3]">Pass</Mono>
              </div>
              <div className="p-5">
                <div className="mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#94a0b2]">Load vs. ampacity</span>
                    <Mono>40 A / 50 A</Mono>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#1c2735]">
                    <div className="h-full w-[80%] rounded-full bg-[#00d3e3]" />
                  </div>
                </div>
                <div className="mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#94a0b2]">Voltage drop vs. 3% target</span>
                    <Mono>2.04% / 3%</Mono>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#1c2735]">
                    <div className="h-full w-[68%] rounded-full bg-[#00d3e3]" />
                  </div>
                </div>
                <div className="mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#94a0b2]">10 AWG, same run</span>
                    <Mono className="text-[#f87171]">35 A · fails</Mono>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#1c2735]">
                    <div className="h-full w-full rounded-full bg-[#f87171]/70" />
                  </div>
                </div>
                <div className="rounded-lg bg-[#00d3e3]/10 px-3 py-2 ring-1 ring-[#00d3e3]/20">
                  <Mono className="text-[11px] text-[#00d3e3]">Table 310.16 basis · 240 V · 80 ft one way</Mono>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
          <div className="overflow-hidden rounded-3xl border border-[#1c2735] bg-[#0a111d]/60 px-6 py-14 text-center sm:px-16">
            <h2 className="mx-auto max-w-[18ch] text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
              Put precision on the job.
            </h2>
            <p className="mx-auto mt-4 max-w-[46ch] text-[#94a0b2]">
              Free, no signup. Runs in your browser and installs to your phone&apos;s home screen in one tap.
            </p>
            <a
              href={APP_HREF}
              className="mt-8 inline-flex rounded-full bg-[#00d3e3] px-7 py-3 text-sm font-semibold text-[#041016] transition-colors hover:bg-[#5ee8f2]"
            >
              Open ElectricalAI Pro
            </a>
            <p className="mt-8 text-sm text-[#5e6b7d]">
              Want an app like this for your business?{" "}
              <Link href="/mobile-app-development-orlando" className="text-[#94a0b2] underline decoration-[#1c2735] underline-offset-4 hover:text-white">
                EVOGENCY builds them.
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
