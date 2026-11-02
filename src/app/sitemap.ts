import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog";
import { getTotalPages } from "@/lib/blog-pagination";

const BASE_URL = "https://evogencyglobal.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // Each page's last real change, so search engines know what to recrawl.
  // Bump a page's date when its content changes (git log -1 on its folder).
  // The blog index follows the newest post instead.
  const routes: Record<string, string> = {
    "": "2026-10-31",
    "/about": "2026-10-22",
    "/services": "2026-10-22",
    "/ai": "2026-10-22",
    "/built-in-house": "2026-10-31",
    "/brand-design": "2026-10-22",
    "/works": "2026-10-22",
    "/contact": "2026-10-22",
    "/blog": "",
    "/seo-agency-orlando": "2026-11-01",
    "/generative-engine-optimization-orlando": "2026-10-22",
    "/ai-automation-orlando": "2026-10-22",
    "/web-design-agency-orlando": "2026-10-22",
    "/google-reviews-orlando": "2026-10-22",
    "/custom-crm-development-orlando": "2026-10-22",
    "/mobile-app-development-orlando": "2026-10-22",
    "/electricalai-pro": "2026-10-22",
    "/free-review-kit": "2026-11-01",
    "/growth-kit": "2026-10-22",
    "/job-site-studio": "2026-11-01",
    "/real-estate-listing-websites-orlando": "2026-11-01",
  };
  const newestPost = BLOG_POSTS.reduce(
    (max, post) => Math.max(max, new Date(post.updated ?? post.date).getTime()),
    0,
  );

  const staticEntries = Object.entries(routes).map(([route, date]) => ({
    url: `${BASE_URL}${route}`,
    lastModified: route === "/blog" ? new Date(newestPost) : new Date(date),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const blogEntries = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const totalPages = getTotalPages();
  const blogPageEntries = [];
  for (let p = 2; p <= totalPages; p++) {
    blogPageEntries.push({
      url: `${BASE_URL}/blog/page/${p}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    });
  }

  return [...staticEntries, ...blogEntries, ...blogPageEntries];
}
