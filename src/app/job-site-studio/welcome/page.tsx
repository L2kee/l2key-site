import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { BASE_PATH } from "@/lib/job-site-studio";

export const metadata: Metadata = {
  title: "Welcome, Founding Member | Job Site Studio | EVOGENCY",
  robots: { index: false, follow: false },
};

const NEXT_STEPS = [
  "Check your email for your Stripe receipt. I'll personally reach out within 1 business day to get you set up.",
  "Film 3 clips this week. 10 to 30 seconds each, phone upright, close to the work.",
  "Send them through the same upload form you used before. We'll take it from there.",
];

export default function FoundingWelcomePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 pb-20 sm:px-6">
      <div className="glass-strong rounded-3xl p-8 text-center sm:p-10">
        <CheckCircle2 size={44} className="mx-auto text-[#f0c14b]" />
        <h1 className="mt-4 text-3xl font-bold text-white">You&apos;re a founding member.</h1>
        <p className="mx-auto mt-3 max-w-lg text-white/70">
          Your price is locked in for life. Here&apos;s what happens next.
        </p>
        <ol className="mx-auto mt-8 max-w-lg space-y-4 text-left text-white/80">
          {NEXT_STEPS.map((step, i) => (
            <li key={step} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f0c14b] font-bold text-black">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <a href={`${BASE_PATH}#send-clips`} className="btn-solid mt-8 inline-flex justify-center">
          Send This Week&apos;s Clips
        </a>
        <p className="mt-6 text-sm text-white/55">
          Questions? Call or text (813) 897 1954, or email hello@evogencyglobal.com.
        </p>
      </div>
    </div>
  );
}
