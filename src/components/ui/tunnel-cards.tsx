"use client";

// The flying cards of the perspective tunnel hero. Loaded after the first paint (see
// perspective-tunnel-hero.tsx), so the headline never waits for this code.

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";

export type TunnelItem = { src: string; alt: string; label: string };

type CardGeometry = { x: number; y: number; rotateZ: number; index: number };

function geometry(count: number): CardGeometry[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = i * 137.5 * (Math.PI / 180); // golden angle spreads cards evenly around the center
    return {
      x: Math.cos(angle) * (28 + (i % 3) * 8), // vw
      y: Math.sin(angle) * (26 + (i % 2) * 9), // vh
      rotateZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
      index: i,
    };
  });
}

function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

function usePointerParallax(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 25, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 60, damping: 25, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

function TunnelCard({
  item,
  geo,
  total,
  progress,
  pointer,
  mobile,
}: {
  item: TunnelItem;
  geo: CardGeometry;
  total: number;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  mobile: boolean;
}) {
  const span = 0.55;
  const start = (geo.index / total) * (1 - span);
  const local = useTransform(progress, [start, start + span], [0, 1]);
  const z = useTransform(local, [0, 1], mobile ? [-1200, 350] : [-1700, 500]);
  const opacity = useTransform(local, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);
  // Cards that are out of the flight take no layer at all.
  const display = useTransform(local, (v) => (v <= 0 || v >= 0.98 ? "none" : "block"));
  const pan = mobile ? 20 : 45;

  const transform = useTransform([z, pointer.x, pointer.y], ([cz, px, py]: number[]) => {
    return `translate3d(calc(-50% + ${geo.x}vw - ${px * pan}px), calc(-50% + ${geo.y}vh - ${py * pan}px), ${cz}px) rotateZ(${geo.rotateZ}deg)`;
  });

  return (
    <motion.figure
      style={{ transform, opacity, display, zIndex: geo.index + 1 }}
      className="absolute left-1/2 top-1/2 m-0 aspect-[4/5] w-[clamp(140px,22vw,300px)] select-none"
    >
      <div className="relative h-full w-full overflow-hidden rounded-[16px] bg-surface ring-1 ring-accent/25 shadow-2xl shadow-black/80">
        <Image src={item.src} alt={item.alt} fill sizes="(max-width: 767px) 40vw, 300px" draggable={false} className="object-cover" />
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-10 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
          {item.label}
        </figcaption>
      </div>
    </motion.figure>
  );
}

export default function TunnelCards({ items }: { items: TunnelItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const mobile = useMedia("(max-width: 767px)");
  const finePointer = useMedia("(pointer: fine)");

  // Scroll progress is measured on the hero section that contains this layer.
  useLayoutEffect(() => {
    section.current = root.current?.closest("section") ?? null;
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  // Start a little into the flight so cards are already on screen when they appear.
  const progress = useSpring(useTransform(scrollYProgress, [0, 1], [0.32, 1]), {
    stiffness: 120,
    damping: 30,
    restDelta: 0.0001,
  });
  const pointer = usePointerParallax(!reduce && finePointer);
  const geos = geometry(items.length);

  if (reduce) {
    // Calm, still collage instead of the flight.
    return (
      <div ref={root} className="pointer-events-none absolute inset-0 grid grid-cols-3 gap-3 p-3 opacity-25 md:grid-cols-6" aria-hidden>
        {items.slice(0, 6).map((item) => (
          <div key={item.src} className="relative aspect-[4/5] overflow-hidden rounded-[16px]">
            <Image src={item.src} alt="" fill sizes="20vw" className="object-cover" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={root}
      className="pointer-events-none absolute inset-0 animate-[tunnel-in_0.8s_ease-out]"
      style={{ transformStyle: "preserve-3d", perspective: mobile ? "900px" : "1200px" }}
      aria-hidden
    >
      {items.map((item, i) => (
        <TunnelCard key={item.src} item={item} geo={geos[i]} total={items.length} progress={progress} pointer={pointer} mobile={mobile} />
      ))}
    </div>
  );
}
