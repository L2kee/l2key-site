import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BlogList } from "@/components/blog-list";
import { getTotalPages } from "@/lib/blog-pagination";

export function generateStaticParams() {
  const totalPages = getTotalPages();
  const params = [];
  for (let p = 2; p <= totalPages; p++) {
    params.push({ num: String(p) });
  }
  return params;
}

function parsePageNum(num: string) {
  if (!/^\d+$/.test(num)) return null;
  return parseInt(num, 10);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ num: string }>;
}): Promise<Metadata> {
  const { num } = await params;
  const page = parsePageNum(num);
  if (!page) return {};

  const TITLE = `Blog: Page ${page} | EVOGENCY Orlando`;
  const DESCRIPTION =
    "Honest, practical guides on SEO, web design, Google reviews, AI automation, custom CRMs, and app development for Orlando businesses, from the people who actually build it.";
  const url = `/blog/page/${page}`;

  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url,
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
}

export default async function BlogPagedPage({
  params,
}: {
  params: Promise<{ num: string }>;
}) {
  const { num } = await params;
  const page = parsePageNum(num);
  const totalPages = getTotalPages();

  if (!page || page < 1) notFound();
  if (page === 1) redirect("/blog");
  if (page > totalPages) notFound();

  return <BlogList page={page} />;
}
