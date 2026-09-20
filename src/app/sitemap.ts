import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog";
import { getTotalPages } from "@/lib/blog-pagination";

const BASE_URL = "https://evogencyglobal.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/services",
    "/works",
    "/contact",
    "/blog",
    "/seo-agency-orlando",
    "/generative-engine-optimization-orlando",
    "/ai-automation-orlando",
    "/web-design-agency-orlando",
    "/google-reviews-orlando",
    "/custom-crm-development-orlando",
    "/mobile-app-development-orlando",
  ];

  const staticEntries = routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const blogEntries = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
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
