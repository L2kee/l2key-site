import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone, PhoneCall, CalendarCheck, MessageSquareText, Star, FileClock } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { FaqList } from "@/components/faq-list";
import { CtaBand } from "@/components/cta-band";
import { RelatedGuides } from "@/components/related-guides";
import { guidesFor } from "@/lib/blog";
import { servicePageGraph } from "@/lib/schema";

// The landing page for the AI Front Desk and AI Audit Google Ads groups, so
// the ad and the page make the same promise. The phone number is EVOGENCY's
// own line, answered by the same AI receptionist the page sells.
const AI_PHONE_TEL = "tel:+13214354469";
const AI_PHONE_DISPLAY = "(321) 435 4469";

const TITLE = "AI Receptionist in Orlando | AI Front Desk by EVOGENCY";
const DESCRIPTION =
  "EVOGENCY sets up an AI front desk for Orlando businesses that answers every call 24/7, books the appointment, and texts back anyone you miss. From $297 a month.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/ai" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/ai",
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
    title: "The call at 9 PM",
    body: "Someone needs you tonight, gets voicemail, and books whoever picks up next. You never even knew they called.",
  },
  {
    title: "The call during your busiest hour",
    body: "You're with a patient, a client, or a customer, and the phone rings out. The person on the other end doesn't leave a message. They leave.",
  },
  {
    title: "The quote nobody followed up on",
    body: "A job was nearly yours, then life got busy and the follow up never went out. The sale just quietly disappears.",
  },
];

const INCLUDED = [
  {
    icon: PhoneCall,
    title: "Every call answered, day or night",
    body: "An AI receptionist picks up 24/7, answers the questions you get all day, and sounds like the best front desk person in town.",
  },
  {
    icon: CalendarCheck,
    title: "Appointments booked while you work",
    body: "It checks your calendar and books the slot right there on the call, so the job is on your schedule before you hang up with your current one.",
  },
  {
    icon: MessageSquareText,
    title: "A text back to every missed caller",
    body: "Anyone who hangs up gets a friendly text within moments, so a missed call turns into a conversation instead of a lost customer.",
  },
  {
    icon: Star,
    title: "More five star Google reviews",
    body: "After each visit or job, happy customers get a review request automatically, so your reputation grows without you remembering to ask.",
  },
  {
    icon: FileClock,
    title: "Quotes that get followed up",
    body: "Open quotes get a polite nudge on schedule, so nearly closed sales stop slipping through the cracks.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "A free call",
    body: "We learn how your phone actually gets answered today, what callers ask, and how you like jobs booked.",
  },
  {
    step: "02",
    title: "Setup and tuning",
    body: "We write your receptionist's script from your real prices, hours, and policies, connect your calendar, and test it with real calls before it ever answers a customer.",
  },
  {
    step: "03",
    title: "Live, and watched",
    body: "It goes live on your line. We read the calls, tune what needs tuning, and send you a monthly report of calls answered, jobs booked, and reviews gained.",
  },
];

const PROOF = [
  {
    title: "Our own phone runs on it",
    body: `Call ${AI_PHONE_DISPLAY}. The AI that answers is the same front desk we set up for clients.`,
  },
  {
    title: "ElectricalAI Pro",
    body: "A live AI app for electricians that we designed, built, and run ourselves. You can try it on our Work page.",
  },
  {
    title: "Agency OS",
    body: "Our own CRM with automations built in, running in production. We build software, not slide decks.",
  },
];

const FAQ = [
  {
    q: "Will my callers know they're talking to AI?",
    a: "Yes. It tells them up front, and if anyone asks, it says so again. Honest beats clever, and most callers care far more about getting booked than about who picked up.",
  },
  {
    q: "What if it gets something wrong?",
    a: "It only answers from what we give it, like your prices, hours, and policies. Anything it doesn't know becomes a message for you instead of a guess. We read the calls and tune it every month.",
  },
  {
    q: "Can it book onto my calendar?",
    a: "Yes. It checks your calendar for open times and books the appointment during the call, with the caller's name, number, and what they need in the details.",
  },
  {
    q: "What kinds of businesses is this for?",
    a: "Any business that answers a phone. Clinics, spas, salons, trades, offices, and anyone else who loses money when a call goes to voicemail.",
  },
  {
    q: "How long does setup take?",
    a: "The receptionist can be answering calls within about a week of our first call. Texting features go live once the phone carriers approve your business for texting, which can take a couple of weeks.",
  },
  {
    q: "How much does an AI receptionist cost?",
    a: "The AI Front Desk is $997 to set up, then $297 a month, month to month with no contract. Our first 3 clients get the setup for $497 in exchange for a testimonial and a case study.",
  },
  {
    q: "Is there a contract?",
    a: "No. It's month to month. If it isn't earning its keep, you can cancel.",
  },
  {
    q: "We have a bigger team. Can you automate more than the phone?",
    a: "Yes. For teams of about 10 to 50 people we run a paid AI Audit. We interview you and your staff, map where the hours go, and hand you a ranked plan of what to automate, with hours saved, dollars saved, and a fixed build price for each. The $1,500 audit is credited in full toward any build you sign within 30 days.",
  },
];

export default function AiFrontDeskPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicePageGraph("/ai", DESCRIPTION, FAQ)) }}
      />
      <SectionHeading as="h1" eyebrow="AI Front Desk by EVOGENCY" title="Never miss another call." reveal />
      {/* Plain, quotable definition first, for readers and AI answer engines. */}
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-white/90">
        An AI front desk that answers every call, books the appointment, and texts back anyone you miss. Built and run
        for you.
      </p>
      <p className="mx-auto mt-3 max-w-2xl text-center text-white/65">Built in Orlando for businesses across Central Florida.</p>
      <p className="mx-auto mt-4 max-w-2xl text-center text-white/65">
        Don&apos;t take our word for it. Our own phone is answered by the exact product we sell, so call it and see
        how it handles you.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a href={AI_PHONE_TEL} className="btn-solid">
          <Phone size={16} /> Call our AI right now
        </a>
        <Link href="/contact" className="btn-glass">
          Book a free call <ArrowRight size={16} />
        </Link>
      </div>

      <div className="mt-20">
        <SectionHeading eyebrow="Where the money goes" title="The calls you never knew you lost" />
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
        <SectionHeading eyebrow="What you get" title="One front desk that never clocks out" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {INCLUDED.map((item) => (
            <TiltCard key={item.title} className="glass h-full rounded-2xl p-6">
              <item.icon size={26} style={{ color: "#5fd8e6" }} aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{item.body}</p>
            </TiltCard>
          ))}
        </div>
      </div>

      <TiltCard className="glass mt-20 rounded-2xl p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5fd8e6]/80">Call it yourself</p>
        <a
          href={AI_PHONE_TEL}
          className="mt-4 block text-3xl font-bold tracking-tight text-white transition hover:text-[#5fd8e6] sm:text-4xl"
        >
          {AI_PHONE_DISPLAY}
        </a>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/65">
          Ask it anything. Ask what we charge. Ask it to answer like your business for a minute. Then book a call with
          Moe right there on the phone.
        </p>
      </TiltCard>

      <div className="mt-20">
        <SectionHeading eyebrow="Pricing" title="Straight numbers, no contract" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <TiltCard className="glass h-full rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white">AI Front Desk</h3>
            <p className="mt-1 text-sm text-white/65">For any business that answers a phone</p>
            <p className="mt-5 text-3xl font-bold text-white">
              $297<span className="text-base font-medium text-white/60"> a month</span>
            </p>
            <p className="mt-1 text-sm text-white/65">plus $997 setup, month to month</p>
            <p className="mt-4 rounded-xl border border-[#5fd8e6]/30 bg-[#5fd8e6]/10 px-4 py-3 text-sm text-white/85">
              Founding offer. Our first 3 clients pay $497 setup in exchange for a testimonial and a case study.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-white/65">
              <li>AI receptionist answering 24/7</li>
              <li>Calendar booking on the call</li>
              <li>Missed call text back</li>
              <li>Google review requests</li>
              <li>Quote follow up</li>
              <li>Monthly tuning and report</li>
            </ul>
          </TiltCard>
          <TiltCard className="glass h-full rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white">AI Audit</h3>
            <p className="mt-1 text-sm text-white/65">For teams of about 10 to 50 people</p>
            <p className="mt-5 text-3xl font-bold text-white">$1,500</p>
            <p className="mt-1 text-sm text-white/65">credited in full toward your build</p>
            <ul className="mt-5 space-y-2 text-sm text-white/65">
              <li>Interviews with you and your staff</li>
              <li>A map of where the hours go</li>
              <li>A ranked list of what to automate</li>
              <li>Hours and dollars saved for each fix</li>
              <li>A fixed build price for each fix</li>
              <li>Credited if you build within 30 days</li>
            </ul>
          </TiltCard>
        </div>
      </div>

      <div className="mt-20">
        <SectionHeading eyebrow="How it works" title="Three steps, then it just answers" />
        <div className="mt-10 space-y-8">
          {PROCESS.map((p) => (
            <div key={p.step} className="flex gap-6 border-b border-white/10 pb-8 last:border-0">
              <span className="shrink-0 text-2xl font-bold text-[#5fd8e6]/50">{p.step}</span>
              <div>
                <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <SectionHeading eyebrow="Proof, not promises" title="We build the software ourselves" />
        <div className="mt-10 space-y-6">
          {PROOF.map((item) => (
            <TiltCard key={item.title} className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{item.body}</p>
            </TiltCard>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <CtaBand text="Get Your AI Front Desk" href="/start/ai-front-desk" />
      </div>

      <div className="mt-20">
        <SectionHeading eyebrow="Frequently asked" title="AI receptionist questions, answered honestly" />
        <FaqList items={FAQ} />
      </div>

      <RelatedGuides posts={guidesFor(["/ai", "/ai-automation-orlando"])} eyebrow="From the blog" title="Free guides on answering calls and automating the busywork" />
    </div>
  );
}
