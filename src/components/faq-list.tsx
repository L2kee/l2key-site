import { Plus } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";

// FAQ drawers built on <details>, so every answer stays in the HTML for
// Google, AI answer engines, and find in page. The glide open and closed is
// CSS only (.faq in globals.css). The first answer starts open so the list
// reads as content, not a wall of closed boxes.
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="mt-10 space-y-4">
      {items.map((item, i) => (
        <TiltCard key={item.q} className="glass rounded-2xl">
          <details className="faq" open={i === 0}>
            <summary className="flex cursor-pointer items-start justify-between gap-4 p-6">
              <h3 className="text-base font-semibold text-white">{item.q}</h3>
              <Plus size={18} aria-hidden="true" className="faq-icon mt-0.5 shrink-0 text-[#f0c14b]" />
            </summary>
            <p className="px-6 pb-6 text-sm leading-relaxed text-white/65">{item.a}</p>
          </details>
        </TiltCard>
      ))}
    </div>
  );
}
