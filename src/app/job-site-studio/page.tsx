import type { Metadata } from "next";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { ClipRequestForm } from "@/components/clip-request-form";
import {
  BASE_PATH,
  FOUNDING_CLOSES,
  FOUNDING_PAYMENT_LINK,
  FOUNDING_PRICE,
  PRODUCT_NAME,
  REGULAR_PRICE,
} from "@/lib/job-site-studio";

const TITLE = "Job Site Studio | Free Videos From Your Job Site Clips | EVOGENCY";
const DESCRIPTION =
  "Film 20 seconds on the job and get back a finished video for TikTok, Facebook, and Instagram. Send 3 clips and get 3 videos free. For plumbers, HVAC, electricians, roofers, and contractors.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: BASE_PATH },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: BASE_PATH,
    siteName: "EVOGENCY",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "EVOGENCY: Evolve. Elevate. Grow." }],
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-image.png"] },
};

const STEPS = [
  {
    title: "Film 10 to 30 seconds on the job",
    body: "Vertical, on your phone. Talk if you want, or just show the work. Your techs can film too.",
  },
  {
    title: "Send it here",
    body: "We pick the best moment, write the hook, cut the dead air, and add captions, your city, and a call to action.",
  },
  {
    title: "Post it everywhere",
    body: "You get back a finished vertical video for TikTok, Facebook, Instagram, and YouTube Shorts.",
  },
];

const FORMATS = [
  { name: "Before and after", detail: "The money shot for every trade. Ugly to perfect in 15 seconds." },
  { name: "Look what we found", detail: "Roots in the sewer line, a scorched breaker, a rotted deck board. People can't look away." },
  { name: "Don't do this", detail: "The homeowner mistakes you fix every week. It builds trust and gets shared." },
  { name: "Real price talk", detail: "What a water heater swap really costs in your town. Buyers love straight answers." },
  { name: "Meet the crew", detail: "Homeowners want to know who's coming into their house. Show them." },
  { name: "Review videos", detail: "Your real Google reviews read over real job footage. Never made up, always yours." },
];

const MEMBER_GETS = [
  "12 finished videos a month (3 a week) made from your clips",
  "Hooks and captions written for your trade and your city",
  "A weekly list of what to film, so you never wonder what to shoot",
  `The full ${PRODUCT_NAME} app the day it launches, at the same price`,
];

const FAQ = [
  {
    q: "How long should my clips be?",
    a: "10 to 30 seconds each. Hold the phone upright, get close to the work, and keep it steady. That's it.",
  },
  {
    q: "Do I need to be on camera?",
    a: "No. Hands only videos with text on screen work great. If you don't want your face in it, it won't be.",
  },
  {
    q: "Do I need a TikTok account?",
    a: "No. Every video works on Facebook, Instagram, and YouTube Shorts too. Post wherever your customers already are.",
  },
  {
    q: "What music do you use?",
    a: "Only music that's cleared for business use, so your account never gets flagged or muted.",
  },
  {
    q: "What about my customers' privacy?",
    a: "We blur house numbers, license plates, and faces we're not sure about. Please don't film customers without asking first.",
  },
  {
    q: "Who owns the videos?",
    a: "You do. Post them, boost them, put them on your website. They're yours to keep, member or not.",
  },
  {
    q: "What happens to my clips?",
    a: "They're used only to make your videos, then deleted. We never post anything for you without your OK.",
  },
];

function FoundingButton() {
  if (!FOUNDING_PAYMENT_LINK) {
    return (
      <a href="#send-clips" className="btn-solid justify-center !px-8 !py-4 text-lg">
        Start With 3 Free Videos <ArrowRight size={20} />
      </a>
    );
  }
  return (
    <div className="flex flex-col items-center gap-3">
      <a href={FOUNDING_PAYMENT_LINK} className="btn-solid justify-center !px-8 !py-4 text-lg">
        Become a Founding Member <ArrowRight size={20} />
      </a>
      <p className="flex items-center gap-2 text-sm text-white/55">
        <ShieldCheck size={16} className="text-[#f0c14b]" /> Secure checkout by Stripe. Cancel anytime. 30 day
        guarantee.
      </p>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-12 text-2xl font-bold text-[#f0c14b] sm:text-3xl">{children}</h2>;
}

export default function JobSiteStudioPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pt-8 pb-20 sm:px-6">
      <article className="glass-strong rounded-3xl px-6 py-10 text-lg leading-relaxed text-white/80 sm:px-12 sm:py-14">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f0c14b]">
            {PRODUCT_NAME} by EVOGENCY
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-5xl">
            Film 20 Seconds on the Job. Get Back a Video Built to Make Your Phone Ring.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-xl text-white/70">
            Send us 3 raw clips from your phone and we&apos;ll send back 3 finished videos for TikTok, Facebook, and
            Instagram. <strong className="text-white">Free.</strong> No editing, no dancing, no becoming a
            &ldquo;TikTok guy.&rdquo;
          </p>
          <a href="#send-clips" className="btn-solid mt-8 inline-flex justify-center !px-8 !py-4 text-lg">
            Send 3 Clips, Get 3 Free Videos <ArrowRight size={20} />
          </a>
        </header>

        <div className="mx-auto mt-12 max-w-2xl space-y-5">
          <p>Hey,</p>
          <p>
            Right now, somewhere in your town, a homeowner is scrolling Facebook and TikTok with a problem you fix
            every single day.
          </p>
          <p>
            When it finally breaks, they call the company they&apos;ve already seen. Not the best one.{" "}
            <strong className="text-white">The one that kept showing up on their phone.</strong>
          </p>
          <p>
            Here&apos;s the crazy part. You already have better content than any agency could ever fake. A sewer line
            packed with roots. A panel one spark away from a fire. A water heater swap that saved a family&apos;s
            weekend. <em>Real work beats stock photos every time.</em>
          </p>
          <p>
            The problem was never the content. It&apos;s that nobody has time to edit it. You&apos;re under a sink,
            not inside a video app.
          </p>
          <p>
            <strong className="text-white">So send it to us.</strong>
          </p>

          <H2>How it works</H2>
          <ol className="space-y-5">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0c14b] font-bold text-black">
                  {i + 1}
                </span>
                <span>
                  <strong className="text-white">{step.title}.</strong> {step.body}
                </span>
              </li>
            ))}
          </ol>

          <H2>The videos that get local calls</H2>
          <p>We already know what works for the trades, so you don&apos;t have to guess.</p>
          <ul className="space-y-4">
            {FORMATS.map((f) => (
              <li key={f.name} className="flex gap-3">
                <Check size={22} className="mt-1 shrink-0 text-[#f0c14b]" />
                <span>
                  <strong className="text-white">{f.name}.</strong> {f.detail}
                </span>
              </li>
            ))}
          </ul>

          <H2>&ldquo;But I&apos;m not a TikTok guy.&rdquo;</H2>
          <p>
            Good. You don&apos;t have to dance, talk to the camera, or learn an app. Film the work like you&apos;d
            show it to a buddy. <strong className="text-white">We handle the rest.</strong>
          </p>
          <p>
            And your customers don&apos;t have to be on TikTok either. Every video works on Facebook and Instagram, where
            homeowners scroll every night. You see every video before it goes anywhere, and nothing posts without your
            OK.
          </p>

          <H2>Want this every week? Become a founding member.</H2>
          <div className="glass rounded-2xl p-6 sm:p-8">
            <ul className="space-y-3">
              {MEMBER_GETS.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check size={22} className="mt-1 shrink-0 text-[#f0c14b]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-center">
              <span className="text-white/50 line-through">${REGULAR_PRICE} a month</span>{" "}
              <strong className="text-3xl text-white">${FOUNDING_PRICE} a month</strong>{" "}
              <span className="text-white/70">locked in for life</span>
            </p>
            <p className="mt-2 text-center text-base text-white/60">
              Founding spots close at midnight on {FOUNDING_CLOSES}.
            </p>
            <div className="mt-6 flex justify-center">
              <FoundingButton />
            </div>
          </div>

          <H2>&ldquo;So what&apos;s the catch?&rdquo;</H2>
          <p>Fair question. Here&apos;s the honest answer.</p>
          <p>
            We&apos;re building an app that does all of this automatically, and we want real owners using it from day
            one to tell us what works. <strong className="text-white">The free videos are a shameless bribe</strong>{" "}
            to get you to try it.
          </p>
          <p>
            If you love them, become a founding member and lock in the lowest price we&apos;ll ever offer. If you
            don&apos;t, you keep the videos. They&apos;re yours, no hard feelings.
          </p>
          <p>
            And while the app is being built, <strong className="text-white">I personally check every video</strong>{" "}
            before it goes back to you. You won&apos;t get that once there are thousands of members.
          </p>

          <H2>The guarantee</H2>
          <p>
            Try the membership for 30 days. If it&apos;s not worth it, email hello@evogencyglobal.com and I&apos;ll
            refund every penny. <strong className="text-white">No forms, no hoops, and you keep every video.</strong>
          </p>

          <p className="pt-4">Talk soon,</p>
          <p>
            <strong className="text-white">Moe</strong>
            <br />
            <span className="text-white/60">Founder, EVOGENCY, Orlando</span>
          </p>
          <p className="text-white/70">
            <strong className="text-white">P.S.</strong> One water heater job from one video covers a full year of
            founding membership. Start with the 3 free ones and see for yourself.
          </p>
        </div>
      </article>

      <section id="send-clips" className="glass-strong scroll-mt-6 rounded-3xl px-6 py-10 sm:px-12">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
          Send 3 clips. Get 3 finished videos back in 2 business days.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-white/65">
          Free, no card needed. Pick the clips straight from your phone&apos;s camera roll.
        </p>
        <div className="mx-auto mt-8 max-w-2xl">
          <ClipRequestForm />
        </div>
      </section>

      <section className="glass rounded-3xl px-6 py-10 sm:px-12">
        <h2 className="text-center text-2xl font-bold text-white">Questions owners ask</h2>
        <dl className="mx-auto mt-6 max-w-2xl space-y-5">
          {FAQ.map((item) => (
            <div key={item.q}>
              <dt className="font-semibold text-white">{item.q}</dt>
              <dd className="mt-1 text-white/70">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
