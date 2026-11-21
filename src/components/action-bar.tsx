"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { openMockup } from "@/components/mockup-notice";
import { startCheckout } from "@/app/growth-kit/actions";
import { isFunnelPath } from "@/lib/funnel-paths";

// Sticky bottom action bar for phones and tablets (UI Design Playbook,
// upgrade 2, Moe 2026-11-21). The header hides on scroll down, so on a long
// page the main action used to scroll away. The bar slides up once the
// first screen is behind the visitor and keeps one page specific action in
// reach. Hidden from lg up, where the navbar carries Get Started. Ava's
// bubble sits inside the bar's right end (.action-bar rules in globals.css),
// so it rests on the bar instead of over the page text.

type Action =
  | { kind: "mockup"; label: string }
  | { kind: "link"; label: string; href: string }
  | { kind: "kit"; label: string };

/** The one action for this page, or null where the page already leads with
    a form (contact, the /start wizard, the free review kit, Job Site
    Studio) or is an app page. */
function actionFor(path: string): Action | null {
  if (path === "/growth-kit") return { kind: "kit", label: "Get the Kit for $27" };
  if (path === "/ai") return { kind: "link", label: "Book a free call", href: "/contact" };
  if (path === "/real-estate-listing-websites-orlando") {
    return { kind: "link", label: "Get a free listing page", href: "/contact" };
  }
  const none = ["/contact", "/start", "/free-review-kit", "/job-site-studio", "/electricalai-pro"];
  if (none.some((p) => path === p || path.startsWith(`${p}/`))) return null;
  return { kind: "mockup", label: "Get my free mockup" };
}

export function ActionBar() {
  const path = usePathname() ?? "/";
  const action = actionFor(path);
  const hasAction = action !== null;
  const [on, setOn] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (!hasAction) {
      root.classList.remove("has-action-bar", "action-bar-on");
      return;
    }
    root.classList.add("has-action-bar");
    const update = () => {
      const show = window.scrollY > window.innerHeight * 0.6;
      setOn(show);
      root.classList.toggle("action-bar-on", show);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      root.classList.remove("has-action-bar", "action-bar-on");
    };
  }, [hasAction]);

  if (!action) return null;

  const content = (
    <>
      {action.label} <ArrowRight size={16} />
    </>
  );

  return (
    <aside
      aria-label="Quick action"
      className={`action-bar lg:hidden ${on ? "is-on" : ""} ${isFunnelPath(path) ? "no-ava" : ""}`}
      inert={!on}
    >
      {action.kind === "kit" ? (
        <form action={startCheckout} className="flex-1">
          <button type="submit" className="btn-solid action-bar-cta">
            {content}
          </button>
        </form>
      ) : action.kind === "link" ? (
        <Link href={action.href} className="btn-solid action-bar-cta flex-1">
          {content}
        </Link>
      ) : (
        <a
          href="/contact"
          className="btn-solid action-bar-cta flex-1"
          onClick={(e) => {
            e.preventDefault();
            openMockup();
          }}
        >
          {content}
        </a>
      )}
    </aside>
  );
}
