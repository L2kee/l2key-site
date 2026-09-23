import type { Metadata } from "next";
import { BlogList } from "@/components/blog-list";

const TITLE = "Marketing Guides for Orlando Businesses | EVOGENCY Blog";
const DESCRIPTION =
  "Honest, practical guides on SEO, web design, Google reviews, AI automation, custom CRMs, and app development for Orlando businesses, from the people who actually build it.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/blog",
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

export default function BlogPage() {
  return <BlogList page={1} />;
}
