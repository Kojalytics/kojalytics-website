"use client";

// The flying windows of the perspective tunnel hero. Loaded after the first paint (see
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

export type TunnelItem = { src: string; alt: string; label: string; icon: string };

type CardGeometry = { x: number; y: number; rotateZ: number; index: number };

function geometry(count: number): CardGeometry[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = i * 137.5 * (Math.PI / 180); // golden angle spreads cards evenly around the center
    return {
      x: Math.cos(angle) * (30 + (i % 3) * 7), // vw
      y: Math.sin(angle) * (27 + (i % 2) * 8), // vh
      rotateZ: (i % 2 === 0 ? 1 : -1) * (2 + (i % 4) * 1.5),
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
  const z = useTransform(local, [0, 1], mobile ? [-1300, 300] : [-1800, 420]);
  const opacity = useTransform(local, [0, 0.16, 0.8, 0.98], [0, 1, 1, 0]);
  // Cards that are out of the flight take no layer at all.
  const display = useTransform(local, (v) => (v <= 0 || v >= 0.98 ? "none" : "block"));
  const pan = mobile ? 16 : 40;

  const transform = useTransform([z, pointer.x, pointer.y], ([cz, px, py]: number[]) => {
    return `translate3d(calc(-50% + ${geo.x}vw - ${px * pan}px), calc(-50% + ${geo.y}vh - ${py * pan}px), ${cz}px) rotateZ(${geo.rotateZ}deg)`;
  });

  return (
    <motion.figure
      style={{ transform, opacity, display, zIndex: geo.index + 1 }}
      className="absolute left-1/2 top-1/2 m-0 w-[clamp(220px,30vw,440px)] select-none"
    >
      <div className="overflow-hidden rounded-[10px] bg-[#ececeb] ring-1 ring-black/10 shadow-[0_24px_48px_-24px_rgba(17,17,19,0.45)]">
        <div className="flex h-5 items-center gap-1 px-2.5">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </div>
        <div className="relative aspect-[16/10]">
          <Image src={item.src} alt={item.alt} fill sizes="(max-width: 767px) 60vw, 440px" draggable={false} className="object-cover object-top" />
        </div>
      </div>
      <figcaption className="mt-2 flex items-center gap-2 text-[13px] font-semibold text-foreground/80">
        <Image src={item.icon} alt="" width={20} height={20} className="rounded-[5px]" />
        {item.label}
      </figcaption>
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
  // Start a little into the flight so windows are already on screen when they appear.
  const progress = useSpring(useTransform(scrollYProgress, [0, 1], [0.3, 1]), {
    stiffness: 120,
    damping: 30,
    restDelta: 0.0001,
  });
  const pointer = usePointerParallax(!reduce && finePointer);
  const geos = geometry(items.length);

  if (reduce) {
    // Calm, still collage instead of the flight.
    return (
      <div ref={root} className="pointer-events-none absolute inset-0 grid grid-cols-2 content-center gap-4 p-4 opacity-20 md:grid-cols-4" aria-hidden>
        {items.slice(0, 8).map((item) => (
          <div key={item.src} className="relative aspect-[16/10] overflow-hidden rounded-[10px]">
            <Image src={item.src} alt="" fill sizes="25vw" className="object-cover" />
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
