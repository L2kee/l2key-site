import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/cta-band";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog";
import { FOUNDER_ID, ORG_ID, SITE_URL, WEBSITE_ID, breadcrumbs } from "@/lib/schema";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const url = `/blog/${post.slug}`;
  const title = post.seoTitle ?? `${post.title} | EVOGENCY`;
  return {
    title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: post.description,
      url,
      siteName: "EVOGENCY",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "EVOGENCY: Evolve. Elevate. Grow." }],
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.description,
      images: ["/og-image.png"],
    },
  };
}

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function articleSchema(post: NonNullable<ReturnType<typeof getBlogPost>>) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        image: `${SITE_URL}/og-image.png`,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        author: { "@id": FOUNDER_ID, "@type": "Person", name: "Mohamed Eltoukhy" },
        publisher: { "@id": ORG_ID },
        isPartOf: { "@id": WEBSITE_ID },
        mainEntityOfPage: url,
      },
      breadcrumbs([
        { name: "Home", path: "" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path: `/blog/${post.slug}` },
      ]),
    ],
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(post)) }}
      />
      <SectionHeading as="h1" eyebrow={post.tag} title={post.title} />
      <p className="mt-4 text-center text-xs text-white/60">
        By{" "}
        <Link href="/about" className="font-medium text-white/80 hover:text-white">
          Mohamed Eltoukhy
        </Link>
        , founder of EVOGENCY · <time dateTime={post.date}>{formatDate(post.date)}</time>
        {post.updated && (
          <>
            {" "}· Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
          </>
        )}
      </p>

      <div className="mt-10 space-y-8">
        {post.sections.map((section, i) => (
          <div key={i}>
            {section.heading && (
              <h2 className="text-xl font-semibold text-white">{section.heading}</h2>
            )}
            <div className={section.heading ? "mt-3 space-y-4" : "space-y-4"}>
              {section.paragraphs.map((p, j) => (
                <p key={j} className="text-sm leading-relaxed text-white/70">
                  {p}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {post.relatedHref && post.relatedLabel && (
        <Link
          href={post.relatedHref}
          className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-[#f0c14b] hover:text-[#c9922c]"
        >
          {post.relatedLabel} <ArrowRight size={14} />
        </Link>
      )}

      <CtaBand text="Get Your Free Audit" />

      <div className="mt-16 text-center">
        <Link href="/blog" className="text-sm font-medium text-white/60 hover:text-white">
          Back to the blog
        </Link>
      </div>
    </div>
  );
}
