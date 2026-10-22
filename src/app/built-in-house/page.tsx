import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { TiltCard } from "@/components/tilt-card";
import { DropLetters } from "@/components/drop-letters";
import { DrawnCheck } from "@/components/drawn-check";
import { CtaTrace } from "@/components/cta-trace";
import { LogoWall } from "@/components/logo-wall";
import { Marquee } from "@/components/marquee";
import { FaqList } from "@/components/faq-list";
import { FloatInput } from "@/components/float-field";
import { WorkCard } from "@/components/work-card";
import { Replay, LazyVideo } from "@/components/showcase-demos";
import { WORK } from "@/lib/content";

const TITLE = "Built in House | Web Effects and Motion by EVOGENCY";
const DESCRIPTION =
  "Every effect on evogencyglobal.com was built by hand. Glass, motion, scroll effects, and interactions you can try live, and have on your own site.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/built-in-house" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/built-in-house",
    siteName: "EVOGENCY",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "EVOGENCY: Evolve. Elevate. Grow." }],
    locale: "en_US",
    type: "website",
  },
};

const DRAWERS = [
  {
    q: "Do effects like these slow a site down?",
    a: "Not the way we build them. Most of what you see here is plain CSS that runs on the graphics chip, with no animation library at all. Anything heavy only loads when you scroll to it.",
  },
  {
    q: "What about people who get motion sick?",
    a: "Every animation on this page switches off for visitors who turn on reduced motion in their phone or computer settings. They get the same content, standing still.",
  },
];

const CLIPS = [
  {
    src: "/showcase/hero-entrance",
    title: "A hero that makes an entrance",
    body: "The headline drops in letter by letter, the lines rise out of a blur, and a light glints across the button.",
  },
  {
    src: "/showcase/page-crossfade",
    title: "Pages that glide, not blink",
    body: "Each page fades up while the background crossfades to that section's own render.",
  },
  {
    src: "/showcase/mockup-notice",
    title: "Offers that show up at the right moment",
    body: "A notice springs up after a visitor has had time to look around, then opens a form that never leaves the page.",
  },
  {
    src: "/showcase/ava-chat",
    title: "An AI assistant on every page",
    body: "Ava answers questions around the clock and hands real leads straight to the inbox.",
  },
  {
    src: "/showcase/reading-progress",
    title: "Little touches that keep people reading",
    body: "A bar along the top tracks how far into a post you are, with zero JavaScript.",
  },
];

function Demo({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <div className="glass flex flex-col rounded-2xl p-6">
      <div className="flex min-h-[170px] flex-1 items-center justify-center">{children}</div>
      <h3 className="mt-6 font-semibold text-white">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-white/60">{body}</p>
    </div>
  );
}

export default function BuiltInHousePage() {
  const scroller = WORK.find((w) => w.fullPage);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-28 pb-20">
      <SectionHeading as="h1" eyebrow="Built in house" title={"Every effect on this site\nwas built by hand"} reveal />
      <p className="mx-auto mt-5 max-w-2xl text-balance text-center text-white/65">
        No page builder, no template. Try them right here, then picture them on your own site.
      </p>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Demo title="Letters that drop in" body="Each letter falls into place with a little bounce, then the colors flow across the line nonstop.">
          <Replay>
            <p
              aria-label="Built to be found. Designed to be trusted."
              className="text-center text-2xl font-bold leading-tight text-white [--hero-delay:2000ms]"
            >
              <span className="block">
                <DropLetters text="Built to be found." />
              </span>
              <span className="block">
                <DropLetters text="Designed to be trusted." start={15} letterClass="hero-accent" />
              </span>
            </p>
          </Replay>
        </Demo>

        <Demo title="Glass buttons" body="Frosted glass that fills with color from the left, lifts, and nudges its arrow. Hover them.">
          <div className="flex flex-col items-center gap-4">
            <button type="button" className="btn-glass text-white">
              Hover me <ArrowRight size={16} />
            </button>
            <button type="button" className="btn-solid">
              And me <ArrowRight size={16} />
            </button>
          </div>
        </Demo>

        <Demo title="Cards with real depth" body="The card tilts toward your cursor in 3D while its shadow stays put underneath.">
          <div className="w-full max-w-[220px]">
            <TiltCard className="glass-strong flex h-32 w-full items-center justify-center rounded-2xl text-sm text-white/70">
              Move over me
            </TiltCard>
          </div>
        </Demo>

        <Demo title="A light that runs the border" body="A cyan light circles the card's edge forever, while the glass inside stays perfectly clear.">
          <div className="flagship-ring glass-strong relative flex h-32 w-full max-w-[220px] items-center justify-center rounded-2xl text-sm text-white/70">
            The flagship card
          </div>
        </Demo>

        <Demo title="A border that draws itself" body="A line traces once around the card as it scrolls into view, and the key phrase gets highlighted as you read.">
          <div className="glass-strong relative w-full max-w-[260px] rounded-2xl p-5 text-center">
            <CtaTrace radius={16} />
            <p className="mark-scope text-sm text-white/70">
              It&apos;s the <mark className="mark-sweep">one line that sells.</mark>
            </p>
          </div>
        </Demo>

        <Demo title="Labels that float" body="The label sits inside the box, then floats up and turns cyan the moment you start typing.">
          <div className="w-full max-w-[260px]">
            <FloatInput label="Type your name" type="text" autoComplete="off" />
          </div>
        </Demo>

        <Demo title="A check that draws itself" body="The success mark draws its circle, then the check, then gives a little pop. Shown after every form.">
          <Replay>
            <DrawnCheck size={56} />
          </Replay>
        </Demo>

        <Demo title="The morphing menu" body="Hover the menu at the top of this page. One shape slides from link to link and turns into a cut crystal.">
          <span className="rounded-full border border-[#5fd8e6]/40 px-4 py-2 text-sm text-[#5fd8e6]">Look up ↑</span>
        </Demo>

        <Demo title="Phone menu that spreads in a circle" body="On phones the menu grows out of the button in a circle and the links cascade in one by one.">
          <LazyVideo src="/showcase/phone-menu.mp4" poster="/showcase/phone-menu.jpg" label="Phone menu reveal" tall />
        </Demo>
      </div>

      {scroller && (
        <section className="mt-20">
          <SectionHeading eyebrow="Hover the picture" title="A whole website, inside a card" />
          <p className="mx-auto mt-4 max-w-xl text-center text-white/60">
            Hover the screenshot and the full site scrolls top to bottom. On a phone it scrolls with you.
          </p>
          <div className="mx-auto mt-10 max-w-md">
            <WorkCard item={scroller} />
          </div>
        </section>
      )}

      <section className="mt-20">
        <SectionHeading eyebrow="Brand marks" title="Logos that swap themselves" />
        <div className="mx-auto mt-10 max-w-4xl">
          <LogoWall />
        </div>
      </section>

      <div className="mt-16">
        <Marquee />
      </div>

      <section className="mt-16">
        <SectionHeading eyebrow="See them in action" title="The bigger moves" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {CLIPS.map((c) => (
            <div key={c.src} className="glass rounded-2xl p-4">
              <LazyVideo src={`${c.src}.mp4`} poster={`${c.src}.jpg`} label={c.title} />
              <h3 className="mt-4 px-2 font-semibold text-white">{c.title}</h3>
              <p className="mt-1 px-2 pb-2 text-sm text-white/60">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-3xl">
        <SectionHeading eyebrow="Open me" title="Drawers that glide" />
        <FaqList items={DRAWERS} />
      </section>

      <section className="mx-auto mt-16 max-w-3xl">
        <TiltCard className="glass-strong relative rounded-3xl p-10 text-center">
          <CtaTrace radius={24} />
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Want this on your site?</h2>
          <p className="mx-auto mt-3 max-w-md text-white/65">
            A few quick taps and you&apos;ll see your new homepage before you pay a dime.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/start/website" className="btn-solid">
              Get my free homepage mockup <ArrowRight size={16} />
            </Link>
          </div>
        </TiltCard>
      </section>
    </div>
  );
}
