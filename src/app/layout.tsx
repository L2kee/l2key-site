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

export const metadata: Metadata = {
  title: "EVOGENCY: Evolve. Elevate. Grow.",
  description:
    "EVOGENCY, founded by Mohamed Eltoukhy, helps local businesses build a real online presence: professional websites, stronger Google reviews, and SEO that gets found.",
  icons: { icon: "/evogency-logo.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BackgroundScene />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
