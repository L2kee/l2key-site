import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  Check,
  CreditCard,
  Globe,
  Kanban,
  MessagesSquare,
  PhoneCall,
  ReceiptText,
  Send,
  Users,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { FaqList } from "@/components/faq-list";
import { CrmWaitlistForm } from "@/components/crm-waitlist-form";
import { BOOKING_URL } from "@/lib/growth-kit";

// Product page for the EVOGENCY CRM (Agency OS, sold to home service
// companies). It isn't open to outside businesses yet (self signup, billing,
// and the per company AI front desk are still being built), so the page is an
// honest Founding 10 waitlist. "Today" lists only what runs in production now,
// everything else is marked as coming. Keep it that way as phases ship.

const TITLE = "The CRM for Home Service Pros | Founding 10 | EVOGENCY";
const DESCRIPTION =
  "Leads, callbacks, quotes, and customers in one simple CRM built for plumbers, HVAC techs, electricians, roofers, and contractors. Join the Founding 10 free.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/crm" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/crm",
    siteName: "EVOGENCY",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "EVOGENCY: Evolve. Elevate. Grow." }],
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-image.png"] },
};

const TODAY = [
  {
    icon: Kanban,
    win: "Never lose a lead in a text thread again.",
    how: "Every lead sits on one board, from first call to booked job, and you drag it forward as it moves.",
  },
  {
    icon: Globe,
    win: "Website leads land on the board by themselves.",
    how: "Forms and chat on your site drop straight in, so nobody gets copied off a sticky note.",
  },
  {
    icon: PhoneCall,
    win: "Call back with the right words every time.",
    how: "Call Mode puts the script on screen with their name filled in. One tap logs how it went and sets the next follow up.",
  },
  {
    icon: Send,
    win: "Follow ups that send themselves.",
    how: "Email sequences go out on schedule until they answer, so warm leads don't go cold while you're on a job.",
  },
  {
    icon: ReceiptText,
    win: "Quotes in a few taps, not a few evenings.",
    how: "Your services and prices live in the CRM. Tap what the job needs, adjust, done. One time and monthly work on the same quote.",
  },
  {
    icon: Users,
    win: "Your whole crew looking at the same page.",
    how: "Everyone sees the same board and the same customer history, and you decide who sees what.",
  },
];

const COMING = [
  { icon: Bot, text: "An AI front desk that answers your calls and chats, books the job, and logs it for you" },
  { icon: CreditCard, text: "Quotes your customer can pay right from their phone (built, in final testing)" },
  { icon: MessagesSquare, text: "One timeline per customer with every call, text, email, and note" },
  { icon: CalendarDays, text: "Jobs and a schedule your whole crew can see" },
];

const FOUNDING = [
  { win: "Setup done for you.", how: "We load your customers, your services, and your prices. You log in to a CRM that already knows your business." },
  { win: "Your founding price, locked.", how: "Whatever you start at, you keep for as long as you stay. You see the number before you pay a cent." },
  { win: "First in line for the AI front desk.", how: "Founding members get it before anyone else does." },
  { win: "A direct line to me.", how: "Tell us what's missing and it goes to the top of the build list." },
];

const FAQ = [
  {
    q: "How much will it cost?",
    a: "We set the founding price before the first spot opens, and you'll see it before you pay anything. Founding members keep that price for as long as they stay. Joining the list is free.",
  },
  {
    q: "When does it open?",
    a: "When the AI front desk and the self setup are finished and tested on our own business first. We won't promise a date we can't keep. Founding members hear first, before anything goes public.",
  },
  {
    q: "Can I see it before then?",
    a: "Yes. Book a 15 minute walkthrough and I'll show you the real thing, running our real pipeline. No slides.",
  },
  {
    q: "Does it replace Housecall Pro or Jobber?",
    a: "Not on day one for shops that live on dispatch and routing. It's built for owners who lose jobs between the first call and the signed quote. If that's where your money leaks, it's built for you.",
  },
  {
    q: "Is my customer list safe?",
    a: "Every company's data is walled off at the database level, so one business can never see another's. Your customers stay yours.",
  },
  {
    q: "Can you build me a fully custom CRM instead?",
    a: "Yes. If your process is one of a kind, we build CRMs from scratch too. See our custom CRM development page for how that works.",
  },
];

const faqGraph = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function CrmPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-28 pb-20 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqGraph) }} />

      {/* First screen answers what it is, can I trust it, and what it costs. */}
      <section className="glass-strong grid items-center gap-10 rounded-3xl px-6 py-10 sm:px-10 md:grid-cols-[1fr_1.15fr]">
        <div className="text-center md:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-olive">Founding 10 · Home service pros</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            Every Callback You Forget Is a Job Your Competitor Books.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-white/75">
            Leads, callbacks, quotes, and customers in <strong className="text-white">one simple CRM</strong>. We run our
            own company on it every day, and we&apos;re opening it to <strong className="text-white">10 home service businesses first</strong>.
          </p>
          <p className="mt-4 text-sm text-white/65">Free to join. Founding price locked for as long as you stay.</p>
          <div className="mt-6 flex flex-col items-center gap-x-5 gap-y-3 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
            <a href="#join" className="btn-solid whitespace-nowrap">
              Save my founding spot <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap text-sm text-white/75 underline underline-offset-4 hover:text-white">
              Or see it live in 15 minutes
            </a>
          </div>
        </div>
        <figure>
          <Image
            src="/agency-os-1-pipeline.png"
            alt="The CRM pipeline board with local plumbing businesses sorted into New Lead, Contacted, Interested, and Proposal Sent columns"
            width={2000}
            height={1250}
            sizes="(min-width: 768px) 540px, 100vw"
            className="rounded-xl border border-white/10 shadow-2xl shadow-black/60"
            priority
          />
          <figcaption className="mt-3 flex items-center justify-center gap-2 text-xs text-white/65 md:justify-start">
            <Check size={14} className="text-olive" aria-hidden="true" /> Our real pipeline. Live in production today.
          </figcaption>
        </figure>
      </section>

      {/* The story is the problem. First person, Moe to the owner. */}
      <section className="mx-auto mt-20 max-w-2xl">
        <SectionHeading eyebrow="Why we built it" title="The phone rings while you're under a sink" />
        <div className="mt-8 space-y-4 text-lg leading-relaxed text-white/75">
          <p>
            Most CRMs are built for sales teams sitting at desks. You&apos;re on a roof, in a crawl space, or halfway
            through a panel swap when the phone rings. <strong className="text-white">By the time you call back, they&apos;ve booked someone else.</strong>
          </p>
          <p>
            So we built our own. Every lead, call, quote, and customer at EVOGENCY runs through it today. Not a demo.
            The tool we open every morning.
          </p>
          <p>
            Now we&apos;re turning it into the CRM we wish every contractor we work with already had.{" "}
            <strong className="text-white">Simple enough to run between jobs, with an AI front desk that picks up when you can&apos;t.</strong>
          </p>
          <p className="text-base text-white/65">Moe, founder of EVOGENCY</p>
        </div>
      </section>

      <section className="mt-20">
        <SectionHeading eyebrow="What it does today" title="Built for the money that leaks between call and quote" />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {TODAY.map(({ icon: Icon, win, how }) => (
            <li key={win} className="glass flex gap-4 rounded-2xl p-6">
              <Icon size={22} strokeWidth={1.75} className="mt-1 shrink-0 text-olive" aria-hidden="true" />
              <div>
                <h3 className="text-lg font-semibold text-white">{win}</h3>
                <p className="mt-1.5 text-base leading-relaxed text-white/70">{how}</p>
              </div>
            </li>
          ))}
        </ul>
        <figure className="mx-auto mt-10 max-w-3xl">
          <Image
            src="/agency-os-2-playbook.png"
            alt="Call Mode with a searchable call script, tabs from the opener through the close, and quick rules for the call"
            width={2000}
            height={1250}
            sizes="(min-width: 768px) 768px, 100vw"
            className="rounded-xl border border-white/10 shadow-2xl shadow-black/60"
          />
          <figcaption className="mt-3 text-center text-xs text-white/65">Call Mode, with the script on screen while you dial.</figcaption>
        </figure>
      </section>

      <section className="mx-auto mt-20 max-w-3xl">
        <SectionHeading eyebrow="Coming to founding members first" title="What we're finishing before the doors open" />
        <ul className="mt-8 space-y-3">
          {COMING.map(({ icon: Icon, text }) => (
            <li key={text} className="flex gap-3 text-base leading-relaxed text-white/75">
              <Icon size={20} strokeWidth={1.75} className="mt-0.5 shrink-0 text-olive" aria-hidden="true" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* The elephant in the room, said plainly. Honesty is the proof here. */}
      <section className="glass mx-auto mt-20 max-w-3xl rounded-3xl px-6 py-8 sm:px-10">
        <h2 className="text-2xl font-bold text-white">The honest part</h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-white/75">
          <p>
            <strong className="text-white">It isn&apos;t open to other businesses yet.</strong> We&apos;re running our own
            company on it first, so we find the bugs and you don&apos;t. We&apos;d rather open late than hand you something
            half done.
          </p>
          <p>
            That&apos;s also why there are <strong className="text-white">only 10 founding spots</strong>. We&apos;re setting up
            every one of them by hand. When they&apos;re gone, everyone else waits for the public launch.
          </p>
        </div>
      </section>

      <section className="mt-20">
        <SectionHeading eyebrow="The Founding 10" title="What the first 10 get" />
        <ul className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
          {FOUNDING.map(({ win, how }) => (
            <li key={win} className="flex gap-3">
              <Check size={20} className="mt-1 shrink-0 text-olive" aria-hidden="true" />
              <p className="text-base leading-relaxed text-white/70">
                <strong className="text-white">{win}</strong> {how}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="join" className="glass-strong mx-auto mt-20 max-w-3xl scroll-mt-24 rounded-3xl px-6 py-10 sm:px-10">
        <h2 className="text-center text-3xl font-bold text-white">Save your founding spot</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-white/70">
          Takes 30 seconds. You get a welcome email from me today, and you hear first when a spot opens.
        </p>
        <div className="mt-8">
          <CrmWaitlistForm />
        </div>
        <p className="mt-6 text-center text-sm text-white/65">
          Rather see it first?{" "}
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="text-olive underline underline-offset-4">
            Book a 15 minute walkthrough
          </a>
          .
        </p>
      </section>

      <section className="mx-auto mt-20 max-w-3xl">
        <SectionHeading eyebrow="Questions" title="Straight answers" />
        <FaqList items={FAQ} />
        <p className="mt-8 text-center text-sm text-white/65">
          Need one built around your exact process?{" "}
          <Link href="/custom-crm-development-orlando" className="text-olive underline underline-offset-4">
            See custom CRM development
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
