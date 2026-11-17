import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { REALTOR_TILES } from "@/lib/realtor-tiles";
import { PlanJumpLink } from "@/components/plan-jump-link";

// Listing Suite tiles for realtors. Same look as StartTiles, six tiles in
// an even 3 by 2 grid, the first one carries the flagship ring.
export function RealtorTiles({ className = "" }: { className?: string }) {
  return (
    <ul className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {REALTOR_TILES.map((p, i) => {
        const tileClass = `start-tile group glass flex h-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition hover:border-[#a3b06a]/50 ${
          i === 0 ? "flagship-ring relative" : ""
        }`;
        const inner = (
          <>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#a3b06a]/30 bg-[#a3b06a]/10">
              <p.icon size={22} style={{ color: "#a3b06a" }} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-white">{p.tile}</span>
              <span className="block text-sm text-white/55">{p.tileLine}</span>
            </span>
            <ArrowRight
              size={18}
              className="shrink-0 text-white/35 transition group-hover:translate-x-1 group-hover:text-[#a3b06a]"
            />
          </>
        );
        return (
          <li key={p.key}>
            {p.href.startsWith("#") ? (
              <PlanJumpLink href={p.href} className={tileClass}>
                {inner}
              </PlanJumpLink>
            ) : (
              <Link href={p.href} className={tileClass}>
                {inner}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
