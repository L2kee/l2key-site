import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { START_PATHS } from "@/lib/start-paths";

// "What do you need?" One tile per service, each opening its own funnel at
// /start/<slug>. Used on the homepage hero and on /start.
export function StartTiles({ className = "" }: { className?: string }) {
  return (
    <ul className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {START_PATHS.map((p, i) => (
        <li key={p.slug} className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}>
          <Link
            href={`/start/${p.slug}`}
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
