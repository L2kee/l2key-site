import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { startCheckout } from "@/app/growth-kit/actions";

function BuyButton() {
  return (
    <form action={startCheckout} className="flex flex-col items-center gap-3 py-4">
      <button type="submit" className="btn-solid justify-center !px-8 !py-4 text-lg">
        Get the Kit for $27 <ArrowRight size={20} />
      </button>
      <p className="flex items-center gap-2 text-sm text-white/55">
        <ShieldCheck size={16} className="text-[#f0c14b]" /> Secure checkout by Stripe. Instant download. 30 day guarantee.
      </p>
    </form>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 text-2xl font-bold text-[#f0c14b] sm:text-3xl">{children}</h2>;
}

const PARTS = [
  {
    name: "The Google Review Request Kit",
    promise: "Get the reviews you've already earned.",
    detail:
      "The exact texts to send within 2 hours of a job, a text for every customer from the last 30 days, two follow ups that don't nag, and what to say to every review, including the 1 star ones.",
  },
  {
    name: "The Missed Call Text Back Pack",
    promise: "Stop losing jobs to voicemail.",
    detail:
      "Instant replies for business hours, after hours, weekends, and emergencies. What to say when they text back or ask for a price. Plus a 3 text quote follow up that turns \"I'll think about it\" into booked jobs.",
  },
  {
    name: "The Ad Template Pack",
    promise: "Ads that make the phone ring.",
    detail:
      "10 hooks that stop the scroll, ready to run Facebook and Instagram ads for plumbing, HVAC, electrical, and roofing, and 4 Google Business Profile posts to rotate every week.",
  },
  {
    name: "The Quick Start Checklist and Tracker",
    promise: "Know exactly what to do today.",
    detail:
      "A today, this week, and this month plan that most shops finish in under an hour, plus a simple tracker so you can see the reviews and jobs add up.",
  },
];

export function GrowthKitLetter() {
  return (
    <article className="glass-strong rounded-3xl px-6 py-10 text-lg leading-relaxed text-white/80 sm:px-12 sm:py-14">
      <header className="text-center">
        <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl">
          Every Missed Call Is a Job You Just Handed to Your Competitor
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-xl text-white/70">
          The copy and paste texts, review requests, and ads that keep your phone ringing. Set up in 30 minutes, no
          marketing experience needed.
        </p>
      </header>

      <div className="mx-auto mt-10 max-w-2xl space-y-5">
        <p>Hey,</p>
        <p>Quick question. What happens when a homeowner with a burst pipe calls your shop and nobody picks up?</p>
        <p>
          They don&apos;t leave a voicemail. They hit back, tap the next company on Google, and that company gets the
          job. Not because they&apos;re better than you. <strong className="text-white">Because they answered.</strong>
        </p>
        <p>
          And it happens while you&apos;re doing exactly what you should be doing: the work. You&apos;re under a sink,
          up in an attic, or on a roof. You can&apos;t answer every call. Nobody can.
        </p>
        <p>
          Here&apos;s what I&apos;ve learned working with home service businesses:{" "}
          <strong className="text-white">
            the shops that win aren&apos;t always the best at the trade. They&apos;re the best at not letting customers
            slip away.
          </strong>{" "}
          They text back every missed call in seconds. They ask every customer for a review. They follow up on every
          quote.
        </p>
        <p>
          None of that takes talent. It takes the right words, set up once. <em>So I wrote them for you.</em>
        </p>

        <H2>Introducing The Home Service Growth Kit</H2>
        <p>Four ready to use packs for plumbers, HVAC techs, electricians, roofers, and contractors:</p>
        <ul className="space-y-5">
          {PARTS.map((part) => (
            <li key={part.name} className="flex gap-3">
              <Check size={22} className="mt-1 shrink-0 text-[#f0c14b]" />
              <span>
                <strong className="text-white">{part.name}:</strong> <em className="text-[#f0c14b]/90">{part.promise}</em>{" "}
                {part.detail}
              </span>
            </li>
          ))}
          <li className="flex gap-3">
            <Check size={22} className="mt-1 shrink-0 text-[#f0c14b]" />
            <span>
              <strong className="text-white">Plus an editable copy of every script</strong>, so you can paste straight
              into your phone or CRM.
            </span>
          </li>
        </ul>

        <BuyButton />

        <H2>What it feels like when this is running</H2>
        <p>
          You finish a job, and before you&apos;re back in the truck, a review request is already on its way.
        </p>
        <p>
          A new customer calls while you&apos;re elbow deep in a water heater. Before they can dial the next guy,
          they&apos;ve got a text from you asking what they need.
        </p>
        <p>The estimate you sent last week turns into a booked job, because a text followed up while you were busy.</p>
        <p>
          <strong className="text-white">That&apos;s the whole point. Your phone keeps working even when you can&apos;t
          answer it.</strong>
        </p>

        <H2>&ldquo;So why is it only $27?&rdquo;</H2>
        <p>Fair question. Honestly? Because some of you will read this kit and think:</p>
        <p className="border-l-2 border-[#f0c14b]/60 pl-4 italic text-white/75">
          &ldquo;This is great, but I don&apos;t have time to set any of it up. Can you just do it for me?&rdquo;
        </p>
        <p>
          That&apos;s what we do at EVOGENCY: websites that book jobs, AI phone agents that answer every call, and
          managed ads and reviews. <strong className="text-white">The kit is how we earn your trust first.</strong>
        </p>
        <p>If you never hire us, that&apos;s completely fine. You keep the kit, and it keeps working for you.</p>

        <H2>The bonus: a free strategy call</H2>
        <p>
          Every kit buyer gets a free strategy call. We&apos;ll look at your Google profile and website and tell you the{" "}
          <strong className="text-white">top three things costing you jobs</strong>. No pressure, just honest advice.
        </p>

        <H2>The guarantee</H2>
        <p>
          Use the kit for 30 days. If it doesn&apos;t pay for itself, email hello@evogencyglobal.com and I&apos;ll
          refund every penny. <strong className="text-white">No forms, no hoops, and you keep the kit.</strong>
        </p>

        <BuyButton />

        <p>Talk soon,</p>
        <p>
          <strong className="text-white">Moe</strong>
          <br />
          <span className="text-white/60">Founder, EVOGENCY</span>
        </p>
        <p className="text-white/70">
          <strong className="text-white">P.S.</strong> One saved job pays for this kit many times over. If the missed
          call text back catches a single customer who would have called someone else, you&apos;re already ahead.
        </p>
      </div>
    </article>
  );
}
