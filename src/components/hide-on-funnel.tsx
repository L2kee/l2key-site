"use client";

import { usePathname } from "next/navigation";
import { isFunnelPath } from "@/lib/funnel-paths";

export function HideOnFunnel({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return isFunnelPath(pathname) ? null : <>{children}</>;
}
