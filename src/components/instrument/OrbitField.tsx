"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

export type OrbitApp = { slug: string; name: string; kind: string };

/**
 * Background of the /software hero: hairline orbit rings with tick marks around the centre, darker arcs
 * sweeping along some rings, and the app icons travelling on four orbits at different radii and speeds.
 * CSS animations only (icons counter-rotate so they stay upright). On scroll the field widens and the
 * icons fade out. Reduced motion: everything stands still. The field is a 2400px square, scaled per
 * breakpoint in globals.css (.orbit-field).
 */

const C = 1200; // centre of the 2400px field
const RINGS = [250, 430, 545, 670, 810, 960, 1130];
const ORBITS = [
  { r: 430, dur: 150, dir: "normal", start: 205, count: 3 },
  { r: 545, dur: 190, dir: "reverse", start: 20, count: 4 },
  { r: 670, dur: 230, dir: "normal", start: 115, count: 3 },
  { r: 810, dur: 280, dir: "reverse", start: 300, count: 3 },
] as const;
const ARCS = [
  { r: 545, len: 0.2, dur: 70, dir: "normal", from: 40 },
  { r: 810, len: 0.14, dur: 110, dir: "reverse", from: 210 },
  { r: 960, len: 0.1, dur: 150, dir: "normal", from: 120 },
] as const;

const ticks = (r: number, n: number) => `1.5 ${((2 * Math.PI * r) / n - 1.5).toFixed(2)}`;

export default function OrbitField({ apps }: { apps: OrbitApp[] }) {
  const field = useRef<HTMLDivElement>(null);

  // How far the hero has scrolled away (0…1) as --p; CSS widens the field and fades the icons.
  useEffect(() => {
    const el = field.current;
    const hero = el?.closest("section");
    if (!el || !hero) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, hero.offsetHeight)));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Hand the apps out to the orbits in order: the first 3 on the inner orbit, the next 4 on the second, …
  const groups = ORBITS.map((o, gi) => {
    const first = ORBITS.slice(0, gi).reduce((sum, prev) => sum + prev.count, 0);
    return { ...o, items: apps.slice(first, first + o.count) };
  });

  return (
    <div ref={field} className="orbit-field">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 2400 2400" aria-hidden>
        {RINGS.map((r, i) => (
          <circle key={r} cx={C} cy={C} r={r} fill="none" stroke={i % 2 ? "#e7e7e4" : "#dadad7"} strokeWidth={1.5} />
        ))}
        {[430, 670, 960].map((r) => (
          <circle key={`t${r}`} cx={C} cy={C} r={r} fill="none" stroke="#cdcdc9" strokeWidth={10} strokeDasharray={ticks(r, 96)} />
        ))}
        {[545, 810, 1130].map((r) => (
          <circle key={`f${r}`} cx={C} cy={C} r={r} fill="none" stroke="#dfdfdc" strokeWidth={6} strokeDasharray={ticks(r, 240)} />
        ))}
      </svg>

      {ARCS.map((a) => {
        const circ = 2 * Math.PI * a.r;
        return (
          <div key={`a${a.r}`} className="orbit absolute inset-0" style={{ "--dur": `${a.dur}s`, "--dir": a.dir, rotate: `${a.from}deg` } as CSSProperties}>
            <svg className="h-full w-full" viewBox="0 0 2400 2400" aria-hidden>
              <circle cx={C} cy={C} r={a.r} fill="none" stroke="#7d7d83" strokeWidth={2.5} strokeLinecap="round" strokeDasharray={`${(circ * a.len).toFixed(1)} ${circ.toFixed(1)}`} />
            </svg>
          </div>
        );
      })}

      <div className="orbit-icons absolute inset-0">
        {groups.map((g) => (
          <div
            key={g.r}
            className="orbit absolute inset-0"
            style={{ "--dur": `${g.dur}s`, "--dir": g.dir, "--counter": g.dir === "normal" ? "reverse" : "normal" } as CSSProperties}
          >
            {g.items.map((app, i) => {
              const angle = g.start + (360 / g.items.length) * i;
              return (
                <div key={app.slug} className="absolute left-1/2 top-1/2" style={{ transform: `rotate(${angle}deg) translateX(${g.r}px) rotate(${-angle}deg)` }}>
                  {/* 0×0 box: it turns around the orbit point itself, so the icon stays upright in place */}
                  <div className="orbit-counter absolute left-0 top-0 h-0 w-0">
                    <Link
                      href={`/software/${app.slug}`}
                      prefetch={false}
                      className="orbit-app group absolute -left-[52px] -top-[52px] block h-[104px] w-[104px]"
                      aria-label={`${app.name}: ${app.kind}`}
                    >
                      <Image
                        src={`/apps/${app.slug}/icon.webp`}
                        alt=""
                        width={104}
                        height={104}
                        loading="eager"
                        className="h-full w-full rounded-[22%] shadow-[0_22px_34px_-16px_rgba(14,14,16,0.5)] transition-transform duration-300 group-hover:scale-110"
                      />
                      <span className="pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap border border-border bg-white px-2 py-1 font-mono text-[15px] uppercase tracking-[0.14em] text-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                        {app.name}
                      </span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
