export const SITE_URL = "https://evogencyglobal.com";
export const SITE_NAME = "EVOGENCY";

export const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/evogency-logo.png`,
  image: `${SITE_URL}/evogency-logo.png`,
  description:
    "EVOGENCY builds websites, search presence, and digital systems for local businesses, based in Orlando, FL and serving clients worldwide.",
  email: "hello@evogencyglobal.com",
  telephone: "+1-813-897-1954",
  founder: {
    "@type": "Person",
    name: "Mohamed Eltoukhy",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Orlando",
    addressRegion: "FL",
    addressCountry: "US",
  },
  areaServed: [
    { "@type": "City", name: "Orlando" },
    { "@type": "AdministrativeArea", name: "Florida" },
    { "@type": "Place", name: "Worldwide" },
  ],
  sameAs: ["https://github.com/L2kee"],
} as const;
