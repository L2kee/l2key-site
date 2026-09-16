import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/agency-os",
    },
    sitemap: "https://www.evogencyglobal.com/sitemap.xml",
  };
}
