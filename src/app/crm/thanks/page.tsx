import type { Metadata } from "next";
import { CalendarClock, MailCheck } from "lucide-react";
import { GrowthKitLetter } from "@/components/growth-kit-letter";
import { BOOKING_URL } from "@/lib/growth-kit";

export const metadata: Metadata = {
  title: "Your Founding Spot Is Saved | EVOGENCY",
  robots: { index: false, follow: false },
};

// After a /crm waitlist signup. Acknowledge it first (no "wait, what just
// happened" moment), then hand the same owner the next step, the $27 Growth
// Kit, while they're warm.
export default function CrmThanksPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pt-28 pb-20 sm:px-6">
      <div className="glass rounded-3xl px-6 py-6 text-center">
        <p className="flex items-center justify-center gap-2 text-lg font-semibold text-white">
          <MailCheck size={22} className="text-olive" aria-hidden="true" /> You&apos;re on the Founding 10 list.
        </p>
        <p className="mt-2 text-white/70">
          A welcome email from Moe is on its way. You&apos;ll hear first when a founding spot opens.
        </p>
        <p className="mt-3 text-white/70">
          Want to see it running now?{" "}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-olive underline underline-offset-4"
          >
            <CalendarClock size={14} aria-hidden="true" /> Book a 15 minute walkthrough
          </a>
          .
        </p>
        <p className="mt-5 text-xl font-semibold text-white">...and while you wait, there&apos;s something you should know.</p>
      </div>
      <GrowthKitLetter />
    </div>
  );
}
