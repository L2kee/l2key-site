import type { MetadataRoute } from "next";

const BASE_URL = "https://www.evogencyglobal.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/services",
    "/works",
    "/contact",
    "/seo-agency-orlando",
    "/generative-engine-optimization-orlando",
    "/ai-automation-orlando",
    "/web-design-agency-orlando",
    "/google-reviews-orlando",
    "/custom-crm-development-orlando",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
