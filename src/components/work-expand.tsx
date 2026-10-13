"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";

/** Homepage Featured work picture. At rest it rotates through the project's
    screenshots like before. When the mouse comes over it, it slides to the
    middle of the row, grows a little, and shows arrows and dots so the visitor
    can flip through the screenshots. On touch screens a tap shows the arrows
    in place. Children are the overlays (gradient and tag). */
export function WorkExpand({
  images,
  alt,
  alts,
  objectPosition = "top",
  className,
  children,
}: {
  images: string[];
  alt: string;
  alts?: string[];
  objectPosition?: "top" | "left-top";
  className?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [shift, setShift] = useState(0);
  const slot = useRef<HTMLDivElement>(null);
  const n = images.length;

  // Rotates on its own only while closed, same timing as the old carousel.
  useEffect(() => {
    if (open || n < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % n), 2800);
    return () => clearInterval(id);
  }, [open, n]);

  const expand = () => {
    const el = slot.current;
    const row = el?.closest("[data-work-row]");
    if (!el || !row || !window.matchMedia("(min-width: 768px)").matches) {
      setShift(0);
    } else {
      const a = el.getBoundingClientRect();
      const b = row.getBoundingClientRect();
      setShift(b.left + b.width / 2 - (a.left + a.width / 2));
    }
    setOpen(true);
  };

  const go = (d: number) => setIndex((i) => (i + d + n) % n);

  return (
    <div
      ref={slot}
      data-open={open || undefined}
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && expand()}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      onClick={() => !open && expand()}
    >
      <div
        className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{ transform: open && shift ? `translateX(${shift}px) scale(1.25)` : "none" }}
      >
        <TiltCard
          className={`${className ?? ""} transition-shadow duration-500 ${
            open ? "shadow-[0_30px_80px_-20px_rgba(0,0,0,0.95)] ring-1 ring-[#f0c14b]/40" : ""
          }`}
        >
          {/* Solid backing while open, so the details card never shows through
              the glass. */}
          <div
            className={`absolute inset-0 bg-[#0a0c10] transition-opacity duration-300 ${
              open ? "opacity-100" : "opacity-0"
            }`}
          />
          {images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={alts?.[i] ?? `${alt} screenshot ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className={`object-cover saturate-[0.9] transition-opacity duration-500 ${
                objectPosition === "left-top" ? "object-left-top" : "object-top"
              } ${i === index ? (open ? "opacity-100" : "opacity-90") : "opacity-0"}`}
            />
          ))}
          {children}
          {n > 1 && (
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                open ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {[
                { d: -1, label: "Previous screenshot", Icon: ChevronLeft, side: "left-3" },
                { d: 1, label: "Next screenshot", Icon: ChevronRight, side: "right-3" },
              ].map(({ d, label, Icon, side }) => (
                <button
                  key={d}
                  type="button"
                  aria-label={label}
                  onClick={(e) => {
                    e.stopPropagation();
                    go(d);
                  }}
                  className={`absolute top-1/2 ${side} grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-[#f0c14b]/50 bg-black/70 text-white backdrop-blur transition hover:bg-black/90`}
                >
                  <Icon size={18} />
                </button>
              ))}
              <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    aria-label={`Show screenshot ${i + 1}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIndex(i);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-5 bg-[#f0c14b]" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </TiltCard>
      </div>
    </div>
  );
}
