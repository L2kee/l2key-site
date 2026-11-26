"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { currentTheme, setTheme, THEME_EVENT, type Theme } from "@/lib/theme";

/** Sun and moon switch in the navbar (Moe 2026-11-25). It shows the theme
    you would switch TO, and keeps in step if another toggle on the page (the
    phone menu) flips it. Before hydration it renders the dark state, which
    matches the server, then corrects itself. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setLocal] = useState<Theme>("dark");

  useEffect(() => {
    const sync = () => setLocal(currentTheme());
    sync();
    const root = document.documentElement;
    root.addEventListener(THEME_EVENT, sync);
    return () => root.removeEventListener(THEME_EVENT, sync);
  }, []);

  const next: Theme = theme === "light" ? "dark" : "light";
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={`grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-olive/50 hover:text-olive ${className}`}
    >
      {theme === "light" ? <Moon size={17} aria-hidden="true" /> : <Sun size={17} aria-hidden="true" />}
    </button>
  );
}
