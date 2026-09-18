import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

function pageHref(page: number) {
  return page === 1 ? "/blog" : `/blog/page/${page}`;
}

export function BlogPaginationNav({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-14 flex flex-wrap items-center justify-center gap-2" aria-label="Blog pagination">
      {currentPage > 1 && (
        <Link
          href={pageHref(currentPage - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-[#f0c14b]/50 hover:text-[#f0c14b]"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </Link>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={pageHref(p)}
          aria-current={p === currentPage ? "page" : undefined}
          className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition ${
            p === currentPage
              ? "border-[#f0c14b] bg-[#f0c14b] text-[#0a0805]"
              : "border-white/10 bg-white/5 text-white/70 hover:border-[#f0c14b]/50 hover:text-[#f0c14b]"
          }`}
        >
          {p}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={pageHref(currentPage + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-[#f0c14b]/50 hover:text-[#f0c14b]"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </Link>
      )}
    </nav>
  );
}
