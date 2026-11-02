import { Gift, Gem, Repeat, Building2, PhoneCall, Compass } from "lucide-react";

// The Listing Suite page's tiles, right under its headline (Moe, 2026-11-01).
// The first tile is the flagship. Plan tiles jump to #plans on the same page.
export type RealtorTile = {
  key: string;
  icon: typeof Gift;
  tile: string;
  tileLine: string;
  href: string;
};

export const REALTOR_TILES: RealtorTile[] = [
  { key: "free", icon: Gift, tile: "Complimentary Listing Page", tileLine: "Your current listing, on us", href: "/contact" },
  { key: "signature", icon: Gem, tile: "Signature Listing", tileLine: "One luxury page, live in 48 hours", href: "#plans" },
  { key: "partner", icon: Repeat, tile: "Listing Partner", tileLine: "Every listing gets its own page", href: "#plans" },
  { key: "brokerage", icon: Building2, tile: "Brokerage Plan", tileLine: "Pages for your whole team", href: "#plans" },
  { key: "front-desk", icon: PhoneCall, tile: "AI Front Desk", tileLine: "Buyer calls answered day and night", href: "/ai" },
  { key: "not-sure", icon: Compass, tile: "Not Sure Yet", tileLine: "Help me pick the right fit", href: "/contact" },
];
