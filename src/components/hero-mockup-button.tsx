"use client";

import { ArrowRight } from "lucide-react";
import { openMockup } from "@/components/mockup-notice";

// Phone hero CTA (Moe 2026-11-13). Opens the free mockup request form, the
// same one as the navbar's Free Mockup link. /contact is the no script
// fallback.
export function HeroMockupButton({ className = "" }: { className?: string }) {
  return (
    <a
      href="/contact"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        openMockup();
      }}
    >
      Get my free mockup <ArrowRight size={16} />
    </a>
  );
}
