"use client";

import { useEffect, useState } from "react";
import { preload } from "react-dom";

const SPRITE = "/evogency-logo-bloom.webp";

/** Hero lotus: the one-shot bloom only starts once the sprite has loaded and
    decoded, so a slow phone connection still sees the bud open instead of
    only the final frame (see .logo-bloom-ready in globals.css). */
export function LogoBloom() {
  preload(SPRITE, { as: "image", fetchPriority: "high" });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait for the load event, not img.decode(): Safari rejects decode()
    // while the file is still downloading, which started the bloom early.
    let cancelled = false;
    const start = () => {
      if (!cancelled) setReady(true);
    };
    const img = new Image();
    img.onload = () => img.decode().then(start, start);
    img.onerror = start; // never leave the bud stuck closed
    img.src = SPRITE;
    if (img.complete && img.naturalWidth > 0) start();
    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  return (
    <div className={`logo-bloom-wrap relative mt-8${ready ? " logo-bloom-ready" : ""}`}>
      <div className="absolute inset-0 rounded-full bg-[#f0c14b]/20 blur-3xl" />
      <div role="img" aria-label="EVOGENCY" className="logo-bloom-viewport">
        <div className="logo-bloom-sprite" />
      </div>
    </div>
  );
}
