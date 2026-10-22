import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import type { BlogPost } from "@/lib/blog";

// Blog cards linking out from a post or a service page. Same card as the
// /blog list, so it reads as part of the blog. The links also give Google a
// path to every post besides the deep /blog/page/N listings.
export function RelatedGuides({
  posts,
  eyebrow,
  title,
  columns = 2,
}: {
  posts: BlogPost[];
  eyebrow: string;
  title: string;
  columns?: 1 | 2;
}) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-20">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className={`mt-10 grid gap-6 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <TiltCard className="glass h-full rounded-2xl p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5fd8e6]">
                {post.tag}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-white">{post.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{post.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#5fd8e6]">
                Read more <ArrowRight size={14} />
              </span>
            </TiltCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
