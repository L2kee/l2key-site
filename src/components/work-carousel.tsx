"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function WorkCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 2800);
    return () => clearInterval(id);
  }, [paused, images.length]);

  return (
    <div
      className="relative h-full w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${alt} screenshot ${i + 1}`}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover object-top opacity-90 saturate-[0.9] transition-opacity duration-500"
          style={{ opacity: i === index ? 0.9 : 0 }}
          priority={i === 0}
        />
      ))}
      <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full transition-colors"
            style={{ background: i === index ? "#f0c14b" : "rgba(255,255,255,0.3)" }}
          />
        ))}
      </div>
    </div>
  );
}
