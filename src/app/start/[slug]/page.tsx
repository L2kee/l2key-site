import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { StartWizard } from "@/components/start-wizard";
import { START_PATHS, getStartPath } from "@/lib/start-paths";

export function generateStaticParams() {
  return START_PATHS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const path = getStartPath(slug);
  if (!path) return {};
  const url = `/start/${path.slug}`;
  const title = `${path.tile} | EVOGENCY`;
  return {
    title,
    description: path.sub,
    alternates: { canonical: url },
    // Same as /start, kept out of search, links still followed.
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description: path.sub,
      url,
      siteName: "EVOGENCY",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "EVOGENCY: Evolve. Elevate. Grow." }],
      locale: "en_US",
      type: "website",
    },
  };
}

// A squeeze page: the pitch in three lines, the form right under it, then
// the pricing and proof for anyone who scrolls before deciding.
export default async function StartPathPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const path = getStartPath(slug);
  if (!path) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pt-10 pb-20">
      <Link href="/start" className="inline-flex items-center gap-1.5 text-sm text-white/50 transition hover:text-white">
        <ArrowLeft size={14} /> Not this? Pick something else
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
        <div className="lg:sticky lg:top-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5fd8e6]/80">{path.eyebrow}</p>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">{path.headline}</h1>
          <p className="mt-4 text-white/65">{path.sub}</p>
          <ul className="mt-6 space-y-2.5">
            {path.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-2.5 text-white/85">
                <Check size={18} className="mt-0.5 shrink-0 text-[#5fd8e6]" /> {o}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-strong rounded-3xl p-6 sm:p-8">
          <StartWizard slug={path.slug} />
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#5fd8e6]/80">
          {path.pricing.length > 1 ? "Two ways to do it" : "How pricing works"}
        </h2>
        <div className={`mx-auto mt-6 grid gap-4 ${path.pricing.length > 1 ? "max-w-4xl sm:grid-cols-2" : "max-w-xl"}`}>
          {path.pricing.map((p) => (
            <div key={p.label} className="glass rounded-2xl p-6">
              <p className="font-semibold text-white">{p.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
        <span className="text-white/45">Proof, not promises</span>
        {path.proof.map((p) => (
          <a key={p.href} href={p.href} className="font-medium text-[#5fd8e6] underline-offset-4 hover:underline">
            {p.label}
          </a>
        ))}
      </section>
    </div>
  );
}
