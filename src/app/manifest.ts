import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME}: Evolve. Elevate. Grow.`,
    short_name: SITE_NAME,
    description:
      "EVOGENCY builds websites, search presence, and digital systems for local businesses in Orlando, FL and worldwide.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0805",
    theme_color: "#0a0805",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
