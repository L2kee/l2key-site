import type { Metadata } from "next";
import { GrowthKitLetter } from "@/components/growth-kit-letter";

const TITLE = "The Home Service Growth Kit | EVOGENCY";
const DESCRIPTION =
  "Copy and paste review requests, missed call text backs, and ad templates for plumbers, HVAC, electricians, and roofers. $27, instant download, 30 day guarantee.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/growth-kit" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/growth-kit",
    siteName: "EVOGENCY",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "EVOGENCY: Evolve. Elevate. Grow." }],
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-image.png"] },
};

export default async function GrowthKitPage({ searchParams }: PageProps<"/growth-kit">) {
  const { canceled, error } = await searchParams;
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pt-8 pb-20 sm:px-6">
      {canceled && (
        <p className="glass rounded-2xl px-5 py-4 text-center text-white/75">
          No worries, your order wasn&apos;t placed. The kit is right here whenever you&apos;re ready.
        </p>
      )}
      {error && (
        <p className="glass rounded-2xl px-5 py-4 text-center text-rose-200">
          Checkout didn&apos;t load on our end. Please try again, or email hello@evogencyglobal.com and we&apos;ll sort
          it out.
        </p>
      )}
      <GrowthKitLetter />
    </div>
  );
}
