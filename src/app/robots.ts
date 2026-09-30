import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/agency-os", "/downloads/", "/api/"],
    },
    sitemap: "https://evogencyglobal.com/sitemap.xml",
  };
}
