"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// three.js is the heaviest script on the site and the scene is purely
// decorative, so it loads in its own chunk and only mounts once the page
// has loaded and the browser is idle. Keeps it off the critical path for
// the headline paint (mobile LCP).
const BackgroundScene = dynamic(
  () => import("@/components/background-scene").then((m) => m.BackgroundScene),
  { ssr: false },
);

export function LazyBackgroundScene() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const mount = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      } else {
        timeoutId = setTimeout(() => setReady(true), 1200);
      }
    };

    if (document.readyState === "complete") mount();
    else window.addEventListener("load", mount, { once: true });

    return () => {
      window.removeEventListener("load", mount);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  return ready ? <BackgroundScene /> : null;
}
