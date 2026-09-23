import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { BlogPaginationNav } from "@/components/blog-pagination-nav";
import { getPostsForPage, getTotalPages } from "@/lib/blog-pagination";

export function BlogList({ page }: { page: number }) {
  const posts = getPostsForPage(page);
  const totalPages = getTotalPages();

  return (
    <div className="mx-auto max-w-5xl px-6 pt-28 pb-20">
      <SectionHeading
        as="h1"
        eyebrow="From EVOGENCY"
        title={
          page === 1
            ? "Marketing guides for Orlando businesses"
            : `Marketing guides for Orlando businesses, page ${page}`
        }
      />
      <p className="mx-auto mt-6 max-w-2xl text-center text-white/65">
        Honest, practical guides on SEO, web design, Google reviews, AI
        automation, custom CRMs, and app development, written by the people
        who actually build it.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
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

      <BlogPaginationNav currentPage={page} totalPages={totalPages} />
    </div>
  );
}
