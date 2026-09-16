import type { MetadataRoute } from "next";

const BASE_URL = "https://www.evogencyglobal.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/services", "/works", "/contact"];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
