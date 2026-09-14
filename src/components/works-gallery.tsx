"use client";

import { useState } from "react";
import { WorkCard } from "@/components/work-card";
import type { WorkItem } from "@/components/work-card";

export function WorksGallery({
  items,
  categories,
}: {
  items: WorkItem[];
  categories: string[];
}) {
  const [active, setActive] = useState("All");
  const shown = active === "All" ? items : items.filter((i) => i.category === active);
  const available = categories.filter(
    (c) => c === "All" || items.some((i) => i.category === c),
  );

  return (
    <>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {available.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={
              active === c
                ? "rounded-full border border-[#f0c14b]/40 bg-[#f0c14b]/15 px-5 py-2 text-sm font-medium text-[#f0c14b] transition"
                : "rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white"
            }
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {shown.map((w) => (
          <WorkCard key={w.title} item={w} />
        ))}
      </div>
    </>
  );
}
