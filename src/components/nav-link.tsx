"use client";

import Link from "next/link";
import { openMockup } from "@/components/mockup-notice";
import { EXTERNAL_ROUTES } from "@/lib/site-nav";

// A nav link that knows the two special cases. A mockup link opens the
// mockup form in place, and a route served outside Next gets a plain anchor.
export function NavLink({
  href,
  className,
  onClick,
  style,
  mockup = false,
  children,
}: {
  href: string;
  className: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  mockup?: boolean;
  children: React.ReactNode;
}) {
  if (mockup) {
    return (
      <a
        href={href}
        className={className}
        style={style}
        onClick={(e) => {
          e.preventDefault();
          onClick?.();
          openMockup();
        }}
      >
        {children}
      </a>
    );
  }
  if (EXTERNAL_ROUTES.has(href)) {
    return (
      <a href={href} className={className} onClick={onClick} style={style}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick} style={style}>
      {children}
    </Link>
  );
}
