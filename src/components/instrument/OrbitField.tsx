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
 * `aroundBox` (the /software hero with the Koja Office box, .sw-hero in globals.css): the hero sets the centre and
 * scale; below lg all 13 icons ride one ring that keeps clear of the box, from lg up the wide orbits.
 */

const C = 1200; // centre of the 2400px field
type Orbit = { rx: number; ry: number; dur: number; reverse?: boolean; count: number };
type Layout = { key: "wide" | "phone" | "ring"; orbits: Orbit[]; rings: [number, number][]; ticks: [number, number][]; arcs: [number, number, number][] };

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

// Around the box (phones and tablets): one ring for all 13 icons, wide enough that no icon ever passes over the box
// (box 389 × 506 field units at every scale, see .sw-hero), with hairline rings inside and outside.
const RING: Layout = {
  key: "ring",
  orbits: [{ rx: 400, ry: 440, dur: 70, count: 13 }],
  rings: [[290, 335], [400, 440], [530, 575], [680, 730]],
  ticks: [[400, 440], [680, 730]],
  arcs: [[290, 335, 16], [530, 575, 26]],
};

// Around the box, wide screens: one flat ring of all 13 icons through the band between wordmark and headline, seen
// slightly from above (icons shrink towards the back, .sw-hero in globals.css), so they pass beside the box and never
// under the type; they fade out while they pass the box. Big rings fill the sides.
const BAND: Layout = {
  key: "wide",
  orbits: [{ rx: 600, ry: 110, dur: 64, count: 13 }],
  rings: [[300, 56], [440, 80], [600, 110], [860, 300], [1060, 460]],
  ticks: [[600, 110], [860, 300]],
  arcs: [[440, 80, 18], [600, 110, 26], [860, 300, 34]],
};

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

/** The hairline rings, tick rings and sweeping arcs of a layout. */
function Lines({ layout }: { layout: Layout }) {
  return (
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
  );
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

export default function OrbitField({
  apps,
  linked = true,
  aroundBox = false,
  clearOf,
}: {
  apps: OrbitApp[];
  linked?: boolean;
  aroundBox?: boolean;
  /** With the wide orbits: a selector for the type (and the box) the icons must never cross; an icon fades out before it would. */
  clearOf?: string;
}) {
  const layouts = aroundBox ? [BAND, RING] : LAYOUTS;
  // Around the box the phone composition runs up to lg (tablets too), otherwise up to md.
  const [wideOnly, smallOnly] = aroundBox ? ["max-lg:hidden", "lg:hidden"] : ["max-md:hidden", "md:hidden"];
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

  // Wide orbits around the box: an icon fades out (.is-off) while it is on or near the type of the hero, so no icon ever
  // shows through a headline. The text's own line boxes are measured (not the full-width blocks), now and then.
  useEffect(() => {
    const el = field.current;
    const hero = el?.closest("section");
    if (!el || !hero || !clearOf) return;
    const wide = window.matchMedia("(min-width: 1024px)");
    const riders = [...el.querySelectorAll<HTMLElement>("[data-layout='wide'] .orbit-rider")];
    // Distance kept from type, and the larger one from the box (an icon passing it moves along its edge for longer).
    const PAD = 18;
    const BOX_PAD = 36;
    let text: { r: DOMRect; pad: number }[] = [];
    let measured = 0;
    let frame = 0;
    const measure = () => {
      const range = document.createRange();
      text = [...hero.querySelectorAll(clearOf)].flatMap((node) => {
        // Type: its line boxes; anything else (the box): its own rectangle.
        if (!node.textContent?.trim()) return [{ r: node.getBoundingClientRect(), pad: BOX_PAD }];
        range.selectNodeContents(node);
        return [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0).map((r) => ({ r, pad: PAD }));
      });
    };
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!wide.matches || window.scrollY > hero.offsetHeight) return;
      if (now - measured > 600) {
        measured = now;
        measure();
      }
      for (const rider of riders) {
        const r = rider.getBoundingClientRect();
        const off = text.some(({ r: t, pad }) => r.right + pad > t.left && r.left - pad < t.right && r.bottom + pad > t.top && r.top - pad < t.bottom);
        if (off !== rider.classList.contains("is-off")) rider.classList.toggle("is-off", off);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [clearOf]);

  return (
    <div ref={field} className="orbit-field">
      {layouts.map((layout) => (
        <div key={layout.key} data-layout={layout.key} className={`absolute inset-0 ${layout.key === "wide" ? wideOnly : smallOnly}`}>
          {aroundBox ? (
            // Around the box the lines sit in two masks (.orbit-lines in globals.css) that keep them off the type
            <div className="orbit-lines">
              <div>
                <Lines layout={layout} />
              </div>
            </div>
          ) : (
            <Lines layout={layout} />
          )}

          <div className="orbit-icons absolute inset-0">
            {ridersFor(layout, apps).map(({ app, orbit, distance }) => (
              <div
                key={`${layout.key}-${app.slug}`}
                className="orbit-rider"
                style={
                  {
                    offsetPath: `path("${ellipsePath(orbit.rx, orbit.ry)}")`,
                    "--d": `${distance.toFixed(2)}%`,
                    // For animations that follow the ride (the depth scale on /software): the same lap, started at this
                    // icon's place on the path.
                    "--dur": `${orbit.dur}s`,
                    "--dd": `${(-(orbit.reverse ? 100 - distance : distance) * orbit.dur) / 100}s`,
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
