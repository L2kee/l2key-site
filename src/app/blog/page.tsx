import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { BLOG_POSTS } from "@/lib/blog";

const TITLE = "Blog | EVOGENCY Orlando";
const DESCRIPTION =
  "Honest, practical guides on SEO, web design, Google reviews, AI automation, custom CRMs, and app development for Orlando businesses, from the people who actually build it.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/blog",
    siteName: "EVOGENCY",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "EVOGENCY: Evolve. Elevate. Grow." }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-28 pb-20">
      <SectionHeading as="h1" eyebrow="From EVOGENCY" title="Blog" />
      <p className="mx-auto mt-6 max-w-2xl text-center text-white/65">
        Honest, practical guides on SEO, web design, Google reviews, AI
        automation, custom CRMs, and app development, written by the people
        who actually build it.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {BLOG_POSTS.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <TiltCard className="glass h-full rounded-2xl p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#f0c14b]">
                {post.tag}
              </span>
              <h2 className="mt-3 text-lg font-semibold text-white">{post.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{post.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#f0c14b]">
                Read more <ArrowRight size={14} />
              </span>
            </TiltCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
