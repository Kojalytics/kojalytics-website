"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

export type OrbitApp = { slug: string; name: string; kind: string };

/**
 * Background of the /software hero: the app icons ride on elliptical orbits around the centre, so all
 * 13 are on screen at once (CSS motion paths; icons stay upright). Hairline rings with tick marks and
 * darker arcs sweeping along them complete the instrument look. On scroll the field widens and the
 * icons fade out. Reduced motion: icons stand still, evenly spread on their orbits.
 *
 * The field is a 2400px square, scaled per breakpoint in globals.css (.orbit-field). Phones (< md) get
 * their own, rounder orbits around the K mark; from md up the orbits are wide ellipses around the copy.
 * `linked={false}` (the Digistore24 partner page): the icons are not links to the app pages.
 */

const C = 1200; // centre of the 2400px field
type Orbit = { rx: number; ry: number; dur: number; reverse?: boolean; count: number };
type Layout = { key: "wide" | "phone"; orbits: Orbit[]; rings: [number, number][]; ticks: [number, number][]; arcs: [number, number, number][] };

const LAYOUTS: Layout[] = [
  {
    key: "wide",
    orbits: [
      { rx: 470, ry: 290, dur: 55, count: 6 },
      { rx: 640, ry: 375, dur: 70, reverse: true, count: 7 },
    ],
    rings: [[300, 190], [470, 290], [640, 375], [830, 490], [1030, 610]],
    ticks: [[470, 290], [830, 490]],
    // rx, ry, seconds per sweep
    arcs: [[470, 290, 18], [640, 375, 26], [830, 490, 34]],
  },
  {
    key: "phone",
    orbits: [
      { rx: 230, ry: 200, dur: 40, count: 5 },
      { rx: 350, ry: 330, dur: 52, reverse: true, count: 8 },
    ],
    rings: [[130, 120], [230, 200], [350, 330], [480, 450], [620, 580]],
    ticks: [[230, 200], [480, 450]],
    arcs: [[230, 200, 14], [350, 330, 20], [480, 450, 28]],
  },
];

// Closed ("Z"), so offset-distance past 100% wraps around instead of parking icons at the end point.
const ellipsePath = (rx: number, ry: number) => `M ${C - rx},${C} a ${rx},${ry} 0 1,0 ${2 * rx},0 a ${rx},${ry} 0 1,0 ${-2 * rx},0 Z`;

// The apps of each orbit, in order: the first `count` apps on the inner orbit, the rest on the outer one.
function ridersFor(layout: Layout, apps: OrbitApp[]) {
  return layout.orbits.flatMap((o, oi) => {
    const first = layout.orbits.slice(0, oi).reduce((sum, prev) => sum + prev.count, 0);
    const items = apps.slice(first, first + o.count);
    return items.map((app, i) => ({ app, orbit: o, distance: (100 / items.length) * i + (o.reverse ? 7 : 0) }));
  });
}

function OrbitIcon({ app }: { app: OrbitApp }) {
  return (
    <>
      <Image
        src={`/apps/${app.slug}/icon.webp`}
        alt=""
        width={104}
        height={104}
        loading="lazy"
        fetchPriority="low"
        className="h-full w-full rounded-[22%] shadow-[0_22px_34px_-16px_rgba(14,14,16,0.5)] transition-transform duration-300 group-hover:scale-110"
      />
      <span className="pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap border border-border bg-white px-2 py-1 font-mono text-[15px] uppercase tracking-[0.14em] text-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {app.name}
      </span>
    </>
  );
}

export default function OrbitField({ apps, linked = true }: { apps: OrbitApp[]; linked?: boolean }) {
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

  return (
    <div ref={field} className="orbit-field">
      {LAYOUTS.map((layout) => (
        <div key={layout.key} className={`absolute inset-0 ${layout.key === "wide" ? "max-md:hidden" : "md:hidden"}`}>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 2400 2400" aria-hidden>
            {layout.rings.map(([rx, ry], i) => (
              <ellipse key={`r${rx}`} cx={C} cy={C} rx={rx} ry={ry} fill="none" stroke={i % 2 ? "#e4e4e1" : "#d8d8d5"} strokeWidth={1.5} />
            ))}
            {layout.ticks.map(([rx, ry]) => (
              <ellipse key={`t${rx}`} cx={C} cy={C} rx={rx} ry={ry} fill="none" stroke="#c9c9c5" strokeWidth={10} pathLength={1000} strokeDasharray="1.2 9.2" />
            ))}
            {layout.arcs.map(([rx, ry, s], i) => (
              <ellipse
                key={`a${rx}`}
                className="orbit-arc"
                cx={C}
                cy={C}
                rx={rx}
                ry={ry}
                fill="none"
                stroke="#7d7d83"
                strokeWidth={2.5}
                strokeLinecap="round"
                pathLength={1000}
                strokeDasharray="110 890"
                style={{ animationDuration: `${s}s`, animationDirection: i % 2 ? "reverse" : "normal" }}
              />
            ))}
          </svg>

          <div className="orbit-icons absolute inset-0">
            {ridersFor(layout, apps).map(({ app, orbit, distance }) => (
              <div
                key={`${layout.key}-${app.slug}`}
                className="orbit-rider"
                style={
                  {
                    offsetPath: `path("${ellipsePath(orbit.rx, orbit.ry)}")`,
                    "--d": `${distance.toFixed(2)}%`,
                    animationDuration: `${orbit.dur}s`,
                    animationDirection: orbit.reverse ? "reverse" : "normal",
                  } as CSSProperties
                }
              >
                {linked ? (
                  <Link
                    href={`/software/${app.slug}`}
                    prefetch={false}
                    className="orbit-app group relative block h-[104px] w-[104px]"
                    aria-label={`${app.name}: ${app.kind}`}
                  >
                    <OrbitIcon app={app} />
                  </Link>
                ) : (
                  <span className="orbit-app group relative block h-[104px] w-[104px]" aria-hidden>
                    <OrbitIcon app={app} />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
