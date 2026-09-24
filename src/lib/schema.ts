// Linked structured data (schema.org JSON-LD). One business entity, one
// founder entity and one website entity live in the root layout with stable
// @ids; every other page references them by @id instead of repeating a
// loose copy. That lets search engines and AI answer engines connect pages,
// services, articles and the founder into one clear picture of EVOGENCY,
// which matters because other businesses share the name.
//
// Rule: only state what the page visibly says. No invented dates, prices,
// ratings or reviews (Google treats mismatched markup as spam).

export const SITE_URL = "https://evogencyglobal.com";
export const ORG_ID = `${SITE_URL}/#organization`;
export const FOUNDER_ID = `${SITE_URL}/#founder`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const ORG_DESCRIPTION =
  "EVOGENCY, founded by Mohamed Eltoukhy, helps Orlando area local businesses build a real online presence: professional websites, stronger Google reviews, and SEO that gets found.";

/** The service landing pages, in the order they appear on /services. */
export const SERVICE_PAGES: Record<string, { name: string; serviceType: string }> = {
  "/web-design-agency-orlando": { name: "Web Design in Orlando", serviceType: "Web design" },
  "/seo-agency-orlando": { name: "SEO in Orlando", serviceType: "Search engine optimization" },
  "/google-reviews-orlando": { name: "Google Reviews and Reputation Management in Orlando", serviceType: "Reputation management" },
  "/ai-automation-orlando": { name: "AI Automation in Orlando", serviceType: "Business process automation" },
  "/custom-crm-development-orlando": { name: "Custom CRM Development in Orlando", serviceType: "Custom software development" },
  "/mobile-app-development-orlando": { name: "Mobile App Development in Orlando", serviceType: "Mobile app development" },
  "/generative-engine-optimization-orlando": { name: "Generative Engine Optimization in Orlando", serviceType: "Search engine optimization" },
};

const ORLANDO = { "@type": "City", name: "Orlando", containedInPlace: { "@type": "State", name: "Florida" } };

export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": ORG_ID,
        name: "EVOGENCY",
        alternateName: "EVOGENCY Global",
        url: SITE_URL,
        logo: `${SITE_URL}/evogency-logo-512.png`,
        image: `${SITE_URL}/evogency-logo-512.png`,
        description: ORG_DESCRIPTION,
        email: "hello@evogencyglobal.com",
        telephone: "+1-813-897-1954",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Orlando",
          addressRegion: "FL",
          addressCountry: "US",
        },
        areaServed: ORLANDO,
        founder: { "@id": FOUNDER_ID, "@type": "Person", name: "Mohamed Eltoukhy" },
        sameAs: ["https://github.com/L2kee"],
        knowsAbout: Object.values(SERVICE_PAGES).map((s) => s.serviceType),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "EVOGENCY services",
          itemListElement: Object.entries(SERVICE_PAGES).map(([path, s]) => ({
            "@type": "Offer",
            itemOffered: { "@id": `${SITE_URL}${path}#service`, "@type": "Service", name: s.name },
          })),
        },
      },
      {
        "@type": "Person",
        "@id": FOUNDER_ID,
        name: "Mohamed Eltoukhy",
        jobTitle: "Founder",
        worksFor: { "@id": ORG_ID },
        image: `${SITE_URL}/moe-founder.webp`,
        url: `${SITE_URL}/about`,
        sameAs: ["https://github.com/L2kee"],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: "EVOGENCY",
        publisher: { "@id": ORG_ID },
        inLanguage: "en-US",
      },
    ],
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** Service + breadcrumb + FAQ for a service landing page, as one graph. */
export function servicePageGraph(
  path: string,
  description: string,
  faq: { q: string; a: string }[],
) {
  const svc = SERVICE_PAGES[path];
  if (!svc) throw new Error(`No SERVICE_PAGES entry for ${path}`);
  const url = `${SITE_URL}${path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: svc.name,
        serviceType: svc.serviceType,
        description,
        url,
        provider: { "@id": ORG_ID },
        areaServed: ORLANDO,
      },
      breadcrumbs([
        { name: "Home", path: "" },
        { name: "Services", path: "/services" },
        { name: svc.name, path },
      ]),
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}
