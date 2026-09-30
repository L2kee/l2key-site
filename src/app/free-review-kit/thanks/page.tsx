import type { Metadata } from "next";
import { Download, MailCheck } from "lucide-react";
import { GrowthKitLetter } from "@/components/growth-kit-letter";
import { LEAD_MAGNET_PATH } from "@/lib/growth-kit";

export const metadata: Metadata = {
  title: "Your 5 Star Review Kit Is On Its Way | EVOGENCY",
  robots: { index: false, follow: false },
};

export default function ReviewKitThanksPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pt-8 pb-20 sm:px-6">
      <div className="glass rounded-3xl px-6 py-6 text-center">
        <p className="flex items-center justify-center gap-2 text-lg font-semibold text-white">
          <MailCheck size={22} className="text-[#f0c14b]" /> Your 5 Star Review Kit is on its way to your inbox.
        </p>
        <p className="mt-2 text-white/60">
          Don&apos;t see it in 5 minutes? Check your spam folder, or{" "}
          <a href={LEAD_MAGNET_PATH} className="inline-flex items-center gap-1 text-[#f0c14b] underline" download>
            <Download size={14} /> download it right now
          </a>
          .
        </p>
        <p className="mt-5 text-xl font-semibold text-white">...and there&apos;s something you should know.</p>
      </div>
      <GrowthKitLetter />
    </div>
  );
}
