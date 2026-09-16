import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BackgroundScene } from "@/components/background-scene";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_TITLE = "EVOGENCY | Websites, SEO & Google Reviews for Orlando Businesses";
const SITE_DESCRIPTION =
  "EVOGENCY, founded by Mohamed Eltoukhy, helps Orlando area local businesses build a real online presence: professional websites, stronger Google reviews, and SEO that gets found.";

export const metadata: Metadata = {
  metadataBase: new URL("https://evogencyglobal.com"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: { icon: "/evogency-logo.png" },
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: "EVOGENCY",
    images: [{ url: "/evogency-logo.png", width: 1024, height: 1024, alt: "EVOGENCY" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/evogency-logo.png"],
  },
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "EVOGENCY",
  image: "https://evogencyglobal.com/evogency-logo.png",
  url: "https://evogencyglobal.com",
  logo: "https://evogencyglobal.com/evogency-logo.png",
  description: SITE_DESCRIPTION,
  email: "hello@evogencyglobal.com",
  telephone: "+1-813-897-1954",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Orlando",
    addressRegion: "FL",
    addressCountry: "US",
  },
  areaServed: "Orlando, FL",
  founder: {
    "@type": "Person",
    name: "Mohamed Eltoukhy",
  },
  sameAs: ["https://github.com/L2kee"],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <BackgroundScene />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
