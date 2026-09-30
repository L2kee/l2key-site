import type { Metadata } from "next";
import { CalendarClock, CheckCircle2, FileText, FileType } from "lucide-react";
import { getCheckoutSession, isFulfillable } from "@/lib/stripe";
import { BOOKING_URL, KIT_PRODUCT_KEY } from "@/lib/growth-kit";

export const metadata: Metadata = {
  title: "Your Home Service Growth Kit | EVOGENCY",
  robots: { index: false, follow: false },
};

async function paidSession(id: string | undefined) {
  if (!id) return null;
  try {
    const session = await getCheckoutSession(id);
    return session && isFulfillable(session) && session.metadata?.product === KIT_PRODUCT_KEY ? session : null;
  } catch (err) {
    console.error("[growth-kit] success page lookup failed", err);
    return null;
  }
}

export default async function GrowthKitSuccessPage({ searchParams }: PageProps<"/growth-kit/success">) {
  const { session_id } = await searchParams;
  const sessionId = typeof session_id === "string" ? session_id : undefined;
  const session = await paidSession(sessionId);

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-8 pb-20 sm:px-6">
        <div className="glass-strong rounded-3xl p-8 text-center text-white/75">
          <h1 className="text-2xl font-bold text-white">We couldn&apos;t confirm your payment yet</h1>
          <p className="mt-3">
            If you just paid, your download links are also on their way to your email. Anything wrong? Email
            hello@evogencyglobal.com or call (813) 897 1954 and we&apos;ll fix it fast.
          </p>
        </div>
      </div>
    );
  }

  const firstName = session.customer_details?.name?.split(/\s+/)[0];
  const download = (file: string) => `/api/kit/download?session_id=${session.id}&file=${file}`;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 pt-8 pb-20 sm:px-6">
      <div className="glass-strong rounded-3xl p-8 text-center sm:p-10">
        <CheckCircle2 size={44} className="mx-auto text-[#f0c14b]" />
        <h1 className="mt-4 text-3xl font-bold text-white">You&apos;re in{firstName ? `, ${firstName}` : ""}!</h1>
        <p className="mx-auto mt-3 max-w-lg text-white/70">
          Here&apos;s your Home Service Growth Kit. We also emailed you these links so you can grab them anytime.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-4">
          <a href={download("pdf")} className="btn-solid">
            <FileText size={18} /> Download the PDF
          </a>
          <a href={download("docx")} className="btn-glass text-white">
            <FileType size={18} /> Editable Word copy
          </a>
        </div>
        <p className="mt-4 text-sm text-white/50">Start with the 30 minute setup on the Welcome page.</p>
      </div>

      <div className="glass rounded-3xl p-8 text-center sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f0c14b]">Your next step</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Book your free strategy call</h2>
        <p className="mx-auto mt-3 max-w-lg text-white/70">
          It comes with your kit. We&apos;ll look at your Google profile and website and tell you the top three things
          costing you jobs. No pressure, just honest advice.
        </p>
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-solid mt-6">
          <CalendarClock size={18} /> Pick a time
        </a>
      </div>
    </div>
  );
}
