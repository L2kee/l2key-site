import Link from "next/link";
import { ArrowRight, House } from "lucide-react";
import { START_PATHS } from "@/lib/start-paths";

// One tile per service, each opening its own funnel at /start/<slug>, plus
// the Listing Suite tile, which goes straight to its own page (it has no
// funnel). Used on the homepage hero and on /start. 8 tiles fill even rows
// in the 2 and 4 column grids, so no tile spans. The first carries the
// flagship ring. The Listing Suite tile (option L4, Moe 2026-11-01) gets a
// Cormorant italic gradient title and its own slower cream ring.
const TILES: { key: string; icon: typeof House; tile: string; tileLine: string; href: string; suite?: boolean }[] = [
  ...START_PATHS.map((p) => ({ key: p.slug, icon: p.icon, tile: p.tile, tileLine: p.tileLine, href: `/start/${p.slug}` })),
];
TILES.splice(2, 0, {
  key: "listing-suite",
  icon: House,
  tile: "Listing Suite",
  tileLine: "Luxury pages for real estate listings",
  href: "/real-estate-listing-websites-orlando",
  suite: true,
});
export function StartTiles({ className = "" }: { className?: string; wide?: boolean }) {
  return (
    <ul className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {TILES.map((p, i) => (
        <li key={p.key}>
          <Link
            href={p.href}
            className={`start-tile group glass flex h-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition hover:border-[#5fd8e6]/50 ${
              i === 0 ? "flagship-ring relative" : p.suite ? "suite-ring relative" : ""
            }`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#5fd8e6]/30 bg-[#5fd8e6]/10">
              <p.icon size={22} style={{ color: "#5fd8e6" }} />
            </span>
            <span className="min-w-0 flex-1">
              {p.suite ? (
                <span className={`suite-title block text-2xl leading-tight italic`}>{p.tile}</span>
              ) : (
                <span className="block font-semibold text-white">{p.tile}</span>
              )}
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
