import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { LazyBackgroundScene } from "@/components/lazy-background-scene";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ORG_DESCRIPTION, siteGraph } from "@/lib/schema";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_TITLE = "EVOGENCY | Web Design, SEO & Google Reviews in Orlando";
const SITE_DESCRIPTION = ORG_DESCRIPTION;

export const metadata: Metadata = {
  metadataBase: new URL("https://evogencyglobal.com"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: {
    icon: [{ url: "/icon-64.png", sizes: "64x64", type: "image/png" }],
    apple: "/apple-icon.png",
  },
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: "EVOGENCY",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "EVOGENCY: Evolve. Elevate. Grow." }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraph()) }}
        />
        <LazyBackgroundScene />
        <Navbar />
        <main className="flex flex-col">{children}</main>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-P0SVMCCT5Y" />
    </html>
  );
}
