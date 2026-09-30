import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Promotes the free 5 Star Review Kit to readers who aren't ready for an
// audit yet. The audit stays the main offer; this catches everyone else.
export function ReviewKitCallout({
  title = "Get More 5 Star Reviews This Week",
  body = "7 copy and paste texts that get happy customers to actually leave the review. Free, and it takes 2 minutes to set up.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <aside className="glass my-10 flex flex-col items-center gap-6 rounded-2xl p-6 text-center sm:flex-row sm:text-left">
      <Image
        src="/free-review-kit-cover.png"
        alt="Cover of The 5 Star Review Kit by EVOGENCY"
        width={96}
        height={124}
        className="w-20 shrink-0 rotate-[-3deg] rounded-md shadow-xl shadow-black/50 sm:w-24"
      />
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f0c14b]">Free review kit</p>
        <p className="mt-1 text-lg font-semibold text-white">{title}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-white/65">{body}</p>
        <Link href="/free-review-kit" className="btn-solid mt-4 !px-5 !py-2.5 text-sm">
          Send Me the Free Kit <ArrowRight size={16} />
        </Link>
      </div>
    </aside>
  );
}
