import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import OfficeBoxStatic from "@/components/office/OfficeBoxStatic";
import { href, type Lang } from "@/lib/i18n";

export type SolarApp = { slug: string; name: string; kind: string };

/**
 * The /software hero stage: the Koja Office box as the sun, hovering above a tilted orbital plane, and the 13 app icons
 * on three orbits around it. CSS only, no client JavaScript (styles: .solar in globals.css).
 *
 * Every length is a multiple of --u, the size of an icon at the front, set per breakpoint; the orbits are circles seen
 * at an angle (ry = K · rx). An icon rides its orbit with three nested transforms: translateX and translateY follow a
 * sine each (a quarter lap apart, so together they trace the ellipse), and scale/opacity follow the depth (1 at the
 * front, 0.7 at the back). The box stands above the plane's centre, so icons on the front half always pass below it and
 * icons on the back half pass behind it (the box is the top layer).
 *
 * Lap times 40/80/120 s (inner faster) repeat every 240 s; the start angles were chosen so that no two icons ever come
 * closer than 1.15 × their size over that whole period (checked every 0.1 s, .office-landing/solar-check.mjs).
 * Hovering or focusing an icon holds the whole system still; reduced motion shows the start frame.
 */

const K = 0.42; // tilt of the plane: ry / rx (about 65° from the viewer)
const BACK = 0.7; // icon scale at the back
// Radius (× --u), lap time (s) and the start angles of its icons (radians, 0 = right end, π/2 = front).
const ORBITS = [
  { r: 2.4, lap: 40, at: [0.6781, 2.8612, 5.6939] },
  { r: 3.7, lap: 80, at: [3.1031, 4.7954, 6.2466, 1.658] },
  { r: 5, lap: 120, at: [5.2649, 0.1372, 1.0533, 2.2384, 3.1645, 4.3025] },
];

const TAU = Math.PI * 2;
// The negative delay that puts a sine running `shift` radians ahead at the right place (the motion runs clockwise
// as seen from above: the angle falls over time, so the front moves from left to right).
const delay = (shift: number, lap: number) => `${(-(((shift % TAU) + TAU) % TAU) / TAU * lap).toFixed(2)}s`;
const n = (v: number) => v.toFixed(4);

function Lines() {
  // 100 units = --u, around the plane's centre (.solar-lines is 10.9 × 5 --u); the hairlines stay 1px at every size.
  return (
    <svg className="solar-lines" viewBox="-545 -250 1090 500" aria-hidden>
      <defs>
        {/* Near side darker than the far side */}
        <linearGradient id="solar-ring" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3e3e1" />
          <stop offset="1" stopColor="#a4a4a8" />
        </linearGradient>
        <radialGradient id="solar-floor">
          <stop offset="0" stopColor="rgba(14,14,16,0.3)" />
          <stop offset="0.45" stopColor="rgba(14,14,16,0.1)" />
          <stop offset="1" stopColor="rgba(14,14,16,0)" />
        </radialGradient>
      </defs>
      {/* The box's shadow on the plane */}
      <ellipse cx="0" cy="0" rx="175" ry="175" transform={`scale(1 ${K})`} fill="url(#solar-floor)" />
      {ORBITS.map(({ r }) => (
        <ellipse key={r} cx="0" cy="0" rx={r * 100} ry={r * 100 * K} fill="none" stroke="url(#solar-ring)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
      {/* A tick scale just outside the outer orbit, and a faint ring beyond */}
      <ellipse cx="0" cy="0" rx="530" ry={530 * K} fill="none" stroke="#e3e3e1" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <ellipse cx="0" cy="0" rx="530" ry={530 * K} fill="none" stroke="#c9c9c6" strokeWidth="9" pathLength={1000} strokeDasharray="0.9 9.1" />
    </svg>
  );
}

export default function SolarSystem({ apps, lang = "de" }: { apps: SolarApp[]; lang?: Lang }) {
  let next = 0;
  return (
    <div className="solar" style={{ ["--k" as string]: K, ["--back" as string]: BACK }}>
      <Lines />
      {ORBITS.map(({ r, lap, at }) => (
        <div key={r} className="solar-orbit" style={{ ["--r" as string]: r, ["--lap" as string]: `${lap}s` } as CSSProperties}>
          {at.map((a) => {
            const app = apps[next++];
            if (!app) return null;
            const style = {
              "--dx": delay(-a, lap),
              "--dy": delay(Math.PI / 2 - a, lap),
              // The still frame (reduced motion), in units of --u
              "--x0": n(r * Math.cos(a)),
              "--y0": n(r * K * Math.sin(a)),
              "--s0": n((1 + BACK) / 2 + ((1 - BACK) / 2) * Math.sin(a)),
            } as CSSProperties;
            return (
              <div key={app.slug} className="solar-x" style={style}>
                <div className="solar-y">
                  <Link href={href(lang, `/software/${app.slug}`)} prefetch={false} className="solar-app group" aria-label={`${app.name}: ${app.kind}`}>
                    <Image src={`/apps/${app.slug}/icon.webp`} alt="" width={104} height={104} sizes="(min-width: 1024px) 72px, 52px" className="solar-icon" />
                    <span className="solar-name">{app.name}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div className="solar-box">
        <OfficeBoxStatic
          width="var(--bw)"
          sizes="(min-width: 1440px) 440px, (min-width: 1280px) 400px, (min-width: 1024px) 320px, (min-width: 640px) 320px, 260px"
          tone="light"
          lang={lang}
        />
      </div>
    </div>
  );
}
