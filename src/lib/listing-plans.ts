// Listing Suite choices for the realtor intake form at
// /real-estate-listing-websites-orlando/start?plan=<id>. Shared by the
// plan cards, the tiles, the form, and its server action.

export const LISTING_PATH = "/real-estate-listing-websites-orlando";
export const LISTING_START_PATH = `${LISTING_PATH}/start`;

export type ListingPlanId = "free" | "signature" | "partner" | "brokerage" | "unsure";

export type ListingPlan = {
  id: ListingPlanId;
  label: string;
  price: string;
  // Listing address: required, optional, or not asked (brokerage asks team size instead).
  address: "required" | "optional" | "none";
  submit: string;
  paid: boolean;
};

export const LISTING_PLANS: ListingPlan[] = [
  { id: "free", label: "Complimentary Page", price: "Free", address: "required", submit: "Build my complimentary page", paid: false },
  { id: "signature", label: "Signature Listing", price: "$199 per listing", address: "required", submit: "Start my Signature Listing", paid: true },
  { id: "partner", label: "Listing Partner", price: "$399 a month", address: "optional", submit: "Start Listing Partner", paid: true },
  { id: "brokerage", label: "Brokerage Plan", price: "Quoted per agent", address: "none", submit: "Request my team quote", paid: false },
  { id: "unsure", label: "Not Sure Yet", price: "Help me pick", address: "optional", submit: "Help me pick the right fit", paid: false },
];

export function getListingPlan(id: string | undefined | null): ListingPlan | undefined {
  return LISTING_PLANS.find((p) => p.id === id);
}

export const listingStartHref = (id: ListingPlanId) => `${LISTING_START_PATH}?plan=${id}`;
