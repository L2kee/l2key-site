import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { REALTOR_TILES } from "@/lib/realtor-tiles";

// Listing Suite tiles for realtors. Same look as StartTiles, six tiles in
// an even 3 by 2 grid, the first one carries the flagship ring.
export function RealtorTiles({ className = "" }: { className?: string }) {
  return (
    <ul className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {REALTOR_TILES.map((p, i) => (
        <li key={p.key}>
          <Link
            href={p.href}
            className={`start-tile group glass flex h-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition hover:border-[#5fd8e6]/50 ${
              i === 0 ? "flagship-ring relative" : ""
            }`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#5fd8e6]/30 bg-[#5fd8e6]/10">
              <p.icon size={22} style={{ color: "#5fd8e6" }} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-white">{p.tile}</span>
              <span className="block text-sm text-white/55">{p.tileLine}</span>
            </span>
            <ArrowRight
              size={18}
              className="shrink-0 text-white/35 transition group-hover:translate-x-1 group-hover:text-[#5fd8e6]"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
