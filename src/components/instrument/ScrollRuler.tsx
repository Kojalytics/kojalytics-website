"use client";

import { useEffect, useRef } from "react";

/**
 * A measuring ruler on the right edge (wide screens only): fine ticks, a marker that travels with the
 * scroll position and a mono read-out of how far down the page you are. Pure decoration (aria-hidden).
 */
export default function ScrollRuler() {
  const marker = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (marker.current) marker.current.style.transform = `translateY(${p * (window.innerHeight - 120)}px)`;
      if (readout.current) readout.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed bottom-0 right-0 top-12 z-30 hidden w-7 xl:block">
      <div className="absolute inset-y-0 right-0 w-3 [background:repeating-linear-gradient(to_bottom,var(--color-border-strong)_0_1px,transparent_1px_14px)]" />
      <div className="absolute inset-y-0 right-0 w-5 [background:repeating-linear-gradient(to_bottom,var(--color-faint)_0_1px,transparent_1px_70px)]" />
      <div ref={marker} className="absolute right-0 top-14 flex items-center gap-1 will-change-transform">
        <span ref={readout} className="font-mono text-[9px] tracking-[0.12em] text-accent">
          000
        </span>
        <span className="h-px w-3 bg-accent" />
      </div>
    </div>
  );
}
