"use client";

/* Workbench: the free mockups and unsolicited concepts we built for real
   businesses, each with a desktop and a phone capture (public/workbench,
   made 2026-11-04 from the sources in D:\Business\Clients and Brands, faces
   blurred). Motions from the Motion Catalog: staggered blur rise, count up,
   flowing gradient text, marquee, gliding tab highlight, full page scroll in
   a frame, 3D tilt, cursor spotlight, orbiting border light, lightbox zoom.
   Styles are the .wb-* block in globals.css. The captures are already sized
   JPEGs, so they skip the image optimizer (a 21,000px tall page is too big
   for it). */

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, Monitor, Smartphone, X } from "lucide-react";

type View = "desk" | "phone";
type Item = {
  slug: string;
  name: string;
  where: string;
  url: string;
  tag: string;
  brand?: boolean;
  cats: string[];
  text: string;
};

const WORK: Item[] = [
  { slug: "chef-janice", name: "Chef Janice Catering", where: "Deltona, Florida", url: "chefjanicecatering.com", tag: "Free homepage concept", cats: ["web"],
    text: "A full homepage built from her own photos and real menu. Tap to call on every screen, a menu Google can finally read, and a build your plate tool that turns browsers into quote requests." },
  { slug: "jrw", name: "J. Richard Watson Construction", where: "Central Florida", url: "jrichardwatson.com", tag: "Unsolicited brand concept", brand: true, cats: ["brand"],
    text: "A quiet estate identity for a luxury custom home builder. An arch monogram, a limestone and bronze palette, and a homepage that opens on the homes themselves." },
  { slug: "watson-gp", name: "Watson General Practice", where: "Canberra, Australia", url: "wgp.net.au", tag: "Free section mockup", cats: ["web", "health"],
    text: "Their vaccine section, rebuilt so patients can see if they qualify and book in without picking up the phone. Same fonts, same colors, same clinical wording." },
  { slug: "majestic", name: "Majestic Jewelers", where: "Winter Park, Florida", url: "majesticjewelers.com", tag: "Unsolicited brand concept", brand: true, cats: ["brand"],
    text: "Forty years of family trust, given a mark to match. The M became the crown, the diamond became its jewel, and the anniversary got a seal worth framing." },
  { slug: "quinns-podiatry", name: "Quinns Podiatry", where: "Perth, Australia", url: "quinnspodiatry.com.au", tag: "Free page mockup", cats: ["web", "health"],
    text: "Two sentences on a one page site became a full diabetic foot care page. Written for patients, checked against current guidance, and built to rank locally." },
  { slug: "soluma", name: "Soluma Aesthetics", where: "Orlando and Oviedo, Florida", url: "solumaaesthetics.com", tag: "Unsolicited brand concept", brand: true, cats: ["brand", "health"],
    text: "Soluma means sun and light, so the brand finally does too. Their sun rises inside an arch, the palette comes straight from golden hour, and a touch of their pink stays." },
  { slug: "you-are-the-buddha", name: "You are the Buddha", where: "Breda, Netherlands", url: "youarethebuddha.com", tag: "Free page sketch", cats: ["web", "health"],
    text: "A private yoga therapy page that sends the right people through the right door. One clear first step, one honest price table, and a real request form instead of a bare email link." },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "web", label: "Websites" },
  { id: "brand", label: "Brand identity" },
  { id: "health", label: "Healthcare" },
];

const MARQUEE = ["Catering", "General practice", "Luxury custom homes", "Podiatry", "Fine jewelry", "Med spa", "Yoga therapy"];

const img = (slug: string, v: View) => `/workbench/${slug}-${v === "desk" ? "desktop" : "phone"}.jpg`;

function subscribeHover(cb: () => void) {
  const m = window.matchMedia("(hover: none)");
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}
const isTouch = () => window.matchMedia("(hover: none)").matches;

function reduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* A pill group whose highlight glides to the active button. */
function Pills<T extends string>({
  options, value, onChange, className, label,
}: {
  options: { id: T; label: React.ReactNode; aria?: string }[];
  value: T;
  onChange: (v: T) => void;
  className: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [glide, setGlide] = useState<React.CSSProperties>({ opacity: 0 });
  const place = useCallback(() => {
    const btn = ref.current?.querySelector<HTMLButtonElement>(`button[data-v="${value}"]`);
    if (btn) setGlide({ width: btn.offsetWidth, height: btn.offsetHeight, transform: `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)` });
  }, [value]);
  useEffect(() => {
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [place]);
  return (
    <div ref={ref} className={className} role="group" aria-label={label}>
      <span className="wb-glide" style={glide} aria-hidden="true" />
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          data-v={o.id}
          aria-pressed={value === o.id}
          aria-label={o.aria}
          className={value === o.id ? "is-on" : undefined}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function CountUp({ to, run }: { to: number; run: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    const dur = reduced() ? 1 : 1400;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setN(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return <>{n}</>;
}

/* Adds .is-in once the element scrolls into view (staggered blur rise). */
function useRise<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
}

function Card({ item, index, onOpen }: { item: Item; index: number; onOpen: (v: View) => void }) {
  const [view, setView] = useState<View>("desk");
  const [loaded, setLoaded] = useState<Record<View, boolean>>({ desk: false, phone: false });
  const [ref, inView] = useRise<HTMLElement>();
  const stageRef = useRef<HTMLDivElement>(null);
  const frames = useRef<Record<View, HTMLSpanElement | null>>({ desk: null, phone: null });

  // Desktop shot loads as the card nears the screen, the phone shot only when asked for.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setLoaded((l) => ({ ...l, desk: true })); io.disconnect(); }
    }, { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  const play = useCallback((v: View) => {
    const frame = frames.current[v];
    const im = frame?.querySelector("img");
    if (!frame || !im || reduced()) return;
    const d = Math.max(0, im.getBoundingClientRect().height - frame.getBoundingClientRect().height);
    if (!d) return;
    const secs = Math.min(16, Math.max(2.5, d / 520));
    im.style.transition = `transform ${secs}s cubic-bezier(.45,.05,.4,1)`;
    im.style.transform = `translateY(${-d}px)`;
  }, []);
  const reset = useCallback((v: View) => {
    const im = frames.current[v]?.querySelector("img");
    if (!im) return;
    im.style.transition = "transform 1.1s cubic-bezier(.22,1,.36,1)";
    im.style.transform = "translateY(0)";
  }, []);

  // Touch screens get a gentle auto scroll while the card sits mid screen.
  const touch = useSyncExternalStore(subscribeHover, isTouch, () => false);
  useEffect(() => {
    const el = ref.current;
    if (!touch || !el) return;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      window.clearTimeout(timer);
      if (e.isIntersecting) timer = window.setTimeout(() => play(view), 400);
      else reset(view);
    }, { rootMargin: "-35% 0px -35% 0px" });
    io.observe(el);
    return () => { io.disconnect(); window.clearTimeout(timer); };
  }, [ref, touch, view, play, reset]);

  const switchView = (v: View) => {
    reset("desk");
    reset("phone");
    setView(v);
    setLoaded((l) => ({ ...l, [v]: true }));
    if (!touch && stageRef.current?.matches(":hover")) window.setTimeout(() => play(v), 600);
  };

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    if (!reduced()) {
      el.style.setProperty("--ry", `${(x - 0.5) * 5}deg`);
      el.style.setProperty("--rx", `${(0.5 - y) * 5}deg`);
    }
  };
  const onLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <article
      ref={ref}
      className={`wb-card glass-strong wb-rise${inView ? " is-in" : ""}`}
      style={{ "--d": index % 2 } as React.CSSProperties}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div
        ref={stageRef}
        className="wb-stage"
        onPointerEnter={(e) => { if (e.pointerType === "mouse") play(view); }}
        onPointerLeave={() => reset(view)}
      >
        <Pills<View>
          className="wb-tabs"
          label={`${item.name} view`}
          value={view}
          onChange={switchView}
          options={[
            { id: "desk", label: <><Monitor size={14} /><span>Desktop</span></>, aria: "Desktop view" },
            { id: "phone", label: <><Smartphone size={14} /><span>Phone</span></>, aria: "Phone view" },
          ]}
        />
        <button
          type="button"
          className={`wb-dev wb-browser${view === "desk" ? "" : " is-off"}`}
          onClick={() => onOpen("desk")}
          aria-label={`Open the ${item.name} desktop page`}
          tabIndex={view === "desk" ? 0 : -1}
        >
          <span className="wb-chrome"><i /><i /><i /><span>{item.url}</span></span>
          <span className="wb-view" ref={(n) => { frames.current.desk = n; }}>
            {loaded.desk && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img(item.slug, "desk")} alt={`${item.name} desktop mockup`} decoding="async" />
            )}
          </span>
        </button>
        <button
          type="button"
          className={`wb-dev wb-phone${view === "phone" ? "" : " is-off"}`}
          onClick={() => onOpen("phone")}
          aria-label={`Open the ${item.name} phone page`}
          tabIndex={view === "phone" ? 0 : -1}
        >
          <span className="wb-view" ref={(n) => { frames.current.phone = n; }}>
            {loaded.phone && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img(item.slug, "phone")} alt={`${item.name} phone mockup`} decoding="async" />
            )}
          </span>
        </button>
        <span className="wb-hint" aria-hidden="true">{touch ? "Tap to open the full page" : "Hover to scroll the page"}</span>
      </div>
      <div className="wb-meta">
        <span className={`wb-tag${item.brand ? " is-brand" : ""}`}>{item.tag}</span>
        <h3>{item.name}</h3>
        <div className="wb-where">{item.where}</div>
        <p>{item.text}</p>
        <button type="button" className="wb-open" onClick={() => onOpen(view)}>
          View the full page <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}

function Lightbox({ item, view, onView, onClose }: { item: Item; view: View; onView: (v: View) => void; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const src = img(item.slug, view);
  const [readySrc, setReadySrc] = useState("");
  const ready = readySrc === src;
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    // Esc closes, and Tab and Shift+Tab wrap inside the popup so keyboard
    // focus can't slip behind it.
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !boxRef.current) return;
      const items = boxRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]");
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !boxRef.current.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !boxRef.current.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", key); prev?.focus(); };
  }, [onClose]);
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = 0; }, [src]);
  return (
    <div ref={boxRef} className="wb-lb" role="dialog" aria-modal="true" aria-label={`${item.name} full page`} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="wb-lb-top">
        <b>{item.name}</b>
        <div className="wb-lb-r">
          <Pills<View>
            className="wb-tabs is-static"
            label="Full page view"
            value={view}
            onChange={onView}
            options={[
              { id: "desk", label: <><Monitor size={14} /><span>Desktop</span></>, aria: "Desktop view" },
              { id: "phone", label: <><Smartphone size={14} /><span>Phone</span></>, aria: "Phone view" },
            ]}
          />
          <button ref={closeRef} type="button" className="wb-x" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
      </div>
      <div ref={bodyRef} className="wb-lb-body" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={src}
          src={src}
          alt={`${item.name} ${view === "desk" ? "desktop" : "phone"} full page`}
          className={`${view === "phone" ? "is-phone" : ""}${ready ? " is-ready" : ""}`}
          onLoad={() => setReadySrc(src)}
          ref={(n) => { if (n?.complete && n.naturalWidth) setReadySrc(src); }}
        />
      </div>
    </div>
  );
}

export function Workbench() {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<{ i: number; v: View } | null>(null);
  const [headRef, headIn] = useRise<HTMLDivElement>();
  const [ctaRef, ctaIn] = useRise<HTMLDivElement>();
  const shown = WORK.map((w, i) => ({ w, i })).filter(({ w }) => filter === "all" || w.cats.includes(filter));
  const close = useCallback(() => setOpen(null), []);

  return (
    <section id="workbench" className="wb mt-28" aria-labelledby="workbench-title">
      <div ref={headRef} className={`wb-head wb-rise${headIn ? " is-in" : ""}`}>
        <div className="glass-strong wb-eyebrow"><span className="wb-dot" />Fresh off the workbench</div>
        <h2 id="workbench-title">
          What we&apos;ve been <span className="wb-flow">working on</span>
        </h2>
        <p>
          Real businesses, real problems, and the fixes we built for them. Every
          piece below started as a free mockup or concept, built in their own
          colors, fonts, and photos.
        </p>
        <div className="wb-stats">
          <div><b><CountUp to={7} run={headIn} /></b><span>Businesses</span></div>
          <div><b><CountUp to={14} run={headIn} /></b><span>Screens built</span></div>
          <div><b><CountUp to={3} run={headIn} /></b><span>Countries</span></div>
        </div>
      </div>

      <div className="wb-marquee" aria-hidden="true">
        <div className="wb-track">
          {[...MARQUEE, ...MARQUEE].map((w, i) => (
            <span key={i}>{w}<em>&#10022;</em></span>
          ))}
        </div>
      </div>

      <div className="wb-bar">
        <Pills<string>
          className="wb-chips glass-strong"
          label="Filter projects"
          value={filter}
          onChange={setFilter}
          options={FILTERS.map((f) => ({ id: f.id, label: f.label }))}
        />
      </div>

      <div className="wb-grid">
        {shown.map(({ w, i }, n) => (
          <Card key={`${filter}-${w.slug}`} item={w} index={n} onOpen={(v) => setOpen({ i, v })} />
        ))}
      </div>

      <div ref={ctaRef} className={`wb-cta glass-strong wb-rise${ctaIn ? " is-in" : ""}`}>
        <h3>Want to see yours <span className="wb-flow">done right?</span></h3>
        <p>
          Send us your website and we will build you a free mockup like these.
          No pressure, no obligation, just a clear look at what better looks like.
        </p>
        <a href="/contact" className="btn-solid wb-shine">
          Get your free mockup <ArrowRight size={16} />
        </a>
      </div>
      <p className="wb-fine">
        Free mockups and unsolicited concepts made by EVOGENCY for illustration
        only. Not affiliated with or endorsed by the businesses shown. Faces are
        blurred for privacy, and photography in brand concepts is illustrative.
      </p>

      {open && (
        <Lightbox
          item={WORK[open.i]}
          view={open.v}
          onView={(v) => setOpen({ i: open.i, v })}
          onClose={close}
        />
      )}
    </section>
  );
}
