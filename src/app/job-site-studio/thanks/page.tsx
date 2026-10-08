import type { Metadata } from "next";
import { ArrowRight, Check, MailCheck, ShieldCheck } from "lucide-react";
import {
  FOUNDING_CLOSES,
  FOUNDING_PAYMENT_LINK,
  FOUNDING_PRICE,
  PRODUCT_NAME,
  REGULAR_PRICE,
} from "@/lib/job-site-studio";

export const metadata: Metadata = {
  title: "Your Clips Are In | Job Site Studio | EVOGENCY",
  robots: { index: false, follow: false },
};

const MEMBER_GETS = [
  "12 finished videos a month (3 a week) made from your clips",
  "Hooks and captions written for your trade and your city",
  "A weekly list of what to film, so you never wonder what to shoot",
  `The full ${PRODUCT_NAME} app the day it launches, at the same price`,
];

export default function ClipsThanksPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 pt-8 pb-20 sm:px-6">
      <div className="glass rounded-3xl px-6 py-6 text-center">
        <p className="flex items-center justify-center gap-2 text-lg font-semibold text-white">
          <MailCheck size={22} className="text-[#f0c14b]" /> Got your clips. Your videos land in your inbox within 2
          business days.
        </p>
        <p className="mt-2 text-white/60">We just emailed you a confirmation. Reply to it with anything we should know.</p>
        <p className="mt-5 text-xl font-semibold text-white">...and there&apos;s something you should know.</p>
      </div>

      <article className="glass-strong rounded-3xl px-6 py-10 text-lg leading-relaxed text-white/80 sm:px-12">
        <h1 className="text-center text-3xl font-bold leading-tight text-white sm:text-4xl">
          3 Videos Get You Noticed. 3 a Week Make You the Name Everyone in Town Knows.
        </h1>
        <div className="mx-auto mt-8 max-w-2xl space-y-5">
          <p>
            The owners who win on social aren&apos;t the ones with one great video. They&apos;re the ones who show up
            every week until homeowners feel like they already know them.
          </p>
          <p>
            That&apos;s what founding members get. You keep filming 20 seconds here and there.{" "}
            <strong className="text-white">We keep the videos coming.</strong>
          </p>
          <ul className="space-y-3">
            {MEMBER_GETS.map((item) => (
              <li key={item} className="flex gap-3">
                <Check size={22} className="mt-1 shrink-0 text-[#f0c14b]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-center">
            <span className="text-white/50 line-through">${REGULAR_PRICE} a month</span>{" "}
            <strong className="text-3xl text-white">${FOUNDING_PRICE} a month</strong>{" "}
            <span className="text-white/70">locked in for life</span>
          </p>
          <p className="text-center text-base text-white/60">
            Founding spots close at midnight on {FOUNDING_CLOSES}. Cancel anytime.
          </p>
          {FOUNDING_PAYMENT_LINK ? (
            <div className="flex flex-col items-center gap-3 pt-2">
              <a href={FOUNDING_PAYMENT_LINK} className="btn-solid justify-center !px-8 !py-4 text-lg">
                Lock In ${FOUNDING_PRICE} a Month <ArrowRight size={20} />
              </a>
              <p className="flex items-center gap-2 text-sm text-white/55">
                <ShieldCheck size={16} className="text-[#f0c14b]" /> 30 day money back guarantee. You keep every
                video.
              </p>
            </div>
          ) : (
            <p className="text-center text-white/70">
              Want in? Just reply to your confirmation email and say &ldquo;founding member.&rdquo;
            </p>
          )}
          <p className="text-white/70">
            Not ready? No problem. Watch your free videos first. This offer will be in your inbox too.
          </p>
        </div>
      </article>
    </div>
  );
}
