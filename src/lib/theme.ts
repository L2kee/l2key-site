// Dark and light themes (Moe 2026-11-25). The site is dark by default and a
// visitor's pick is remembered in localStorage. THEME_SCRIPT runs inline in
// <head> before the first paint, so a light visitor never sees a dark flash.
// The colors themselves live in globals.css (html[data-theme="light"]).

export type Theme = "dark" | "light";

export const THEME_KEY = "evogency-theme";

/** Fired on <html> when the theme changes, for parts that swap media (the hero video). */
export const THEME_EVENT = "evogency-theme-change";

export const THEME_SCRIPT = `try{if(localStorage.getItem(${JSON.stringify(THEME_KEY)})==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") root.dataset.theme = "light";
  else delete root.dataset.theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Private mode can block storage, the switch still works for this visit.
  }
  root.dispatchEvent(new Event(THEME_EVENT));
}
