import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BackgroundScene } from "@/components/background-scene";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LOCAL_BUSINESS_JSON_LD, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "EVOGENCY: Evolve. Elevate. Grow.";
const DESCRIPTION =
  "EVOGENCY, founded by Mohamed Eltoukhy, helps local businesses build a real online presence: professional websites, stronger Google reviews, and SEO that gets found. Based in Orlando, FL and serving clients worldwide.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Orlando web design",
    "Orlando SEO",
    "local SEO",
    "small business website",
    "website design agency",
  ],
  authors: [{ name: "Mohamed Eltoukhy" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD) }}
        />
        <BackgroundScene />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
