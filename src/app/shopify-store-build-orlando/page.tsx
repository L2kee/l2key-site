import type { Metadata } from "next";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/cta-band";
import { faqSchema } from "@/lib/faq-schema";

const TITLE = "Shopify Store Build Orlando | EVOGENCY";
const DESCRIPTION =
  "EVOGENCY builds custom Shopify stores for Orlando businesses: real product catalogs, fast mobile checkout, and a storefront built around your brand, not a generic template.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/shopify-store-build-orlando" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/shopify-store-build-orlando",
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

const INCLUDED = [
  {
    title: "A theme built around your brand",
    body: "A storefront designed to match how your brand actually looks and sells, not a stock theme with your logo dropped on top of it.",
  },
  {
    title: "A catalog set up to actually sell",
    body: "Products, variants, and collections structured so customers can find what they want fast, and so Shopify's own search and filters actually work for you.",
  },
  {
    title: "Payments, shipping, and taxes done right",
    body: "Checkout, payment providers, shipping rates, and tax settings configured correctly from day one, not left for you to figure out after launch.",
  },
  {
    title: "Fast, mobile first checkout",
    body: "Most shoppers are buying from their phone. Every store is built and tested to load fast and check out cleanly on mobile, not just on a desktop demo.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Map your catalog",
    body: "We learn what you actually sell, how it's organized, and what a customer needs to see to decide to buy, not a generic product list.",
  },
  {
    step: "02",
    title: "Design the storefront",
    body: "A storefront built around your brand and your products, with a layout designed to move a visitor toward checkout.",
  },
  {
    step: "03",
    title: "Build and configure",
    body: "The store gets built in Shopify, connected to payments and shipping, and tested with real products before anyone else sees it.",
  },
  {
    step: "04",
    title: "Launch and support",
    body: "Once it's live we keep an eye on it and help with new products, promotions, and changes as your store grows.",
  },
];

const FAQ = [
  {
    q: "Why build on Shopify instead of a custom store?",
    a: "Shopify handles hosting, security, and payments reliably out of the box, which means less to maintain long term. The value we add is a storefront built specifically around your brand and catalog instead of a generic theme.",
  },
  {
    q: "Can you migrate my existing store to Shopify?",
    a: "Yes. Products, customers, and order history can be moved over from most platforms without starting your catalog from scratch.",
  },
  {
    q: "How much does a Shopify store build cost in Orlando?",
    a: "It depends on how many products, custom features, and integrations are involved. A simple single collection store costs far less than a full multi collection catalog with custom functionality. We give you a real number after understanding what you actually need.",
  },
  {
    q: "How long does it take to build a Shopify store?",
    a: "A straightforward store with an existing product catalog can launch in a few weeks. Custom features, large catalogs, or third party integrations add time. We give you an honest timeline upfront.",
  },
  {
    q: "Do I own my Shopify store?",
    a: "You own your Shopify account, your catalog, and your customer data outright. The design and setup work is yours, though Shopify itself is a hosted platform with its own subscription, which we're upfront about.",
  },
  {
    q: "Is there a Shopify developer near me in Orlando?",
    a: "Yes. EVOGENCY is based in Orlando and builds Shopify stores directly for local businesses, not through an outside contractor.",
  },
  {
    q: "Can you connect my Shopify store to other tools I use?",
    a: "Yes. Email marketing, inventory, fulfillment, and other tools can be connected to your store so orders and customer data flow where you actually need them.",
  },
];

export default function ShopifyStoreBuildOrlandoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(FAQ)) }}
      />
      <SectionHeading
        as="h1"
        eyebrow="Shopify Store Build in Orlando, FL"
        title="Shopify Store Build Orlando"
      />
      <p className="mx-auto mt-6 max-w-2xl text-center text-white/65">
        A generic Shopify theme can get a store online, but it rarely gets
        anyone to actually buy. EVOGENCY builds Shopify stores shaped around
        your brand and your catalog, with checkout built to convert the
        traffic you're already working to get.
      </p>

      <div className="mt-16">
        <SectionHeading eyebrow="What's included" title="What a Shopify store build should actually do for you" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {INCLUDED.map((item) => (
            <TiltCard key={item.title} className="glass h-full rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{item.body}</p>
            </TiltCard>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <SectionHeading eyebrow="How it works" title="A process built on being honest, not flashy" />
        <div className="mt-10 space-y-8">
          {PROCESS.map((p) => (
            <div key={p.step} className="flex gap-6 border-b border-white/10 pb-8 last:border-0">
              <span className="shrink-0 text-2xl font-bold text-[#f0c14b]/50">{p.step}</span>
              <div>
                <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CtaBand text="Get Your Free Audit" />

      <div className="mt-20">
        <SectionHeading eyebrow="Frequently asked" title="Shopify store build Orlando: the honest answers" />
        <div className="mt-10 space-y-6">
          {FAQ.map((item) => (
            <TiltCard key={item.q} className="glass rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white">{item.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{item.a}</p>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  );
}
