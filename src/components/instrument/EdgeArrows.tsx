"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Prev/next arrows laid over a sideways swipe row, at the left and right edge of its pictures (vertically centred on
 * the first card's `[data-row-anchor]` element), so people see at once that there is more and can tap instead of
 * guessing that the row swipes. They only show while the row actually scrolls (the apps grid on tablets and desktops
 * does not), the left one only once there is something to go back to. The right arrow nudges sideways twice when the
 * row first comes into view (not with reduced motion). Place it in a `relative` wrapper around the row.
 */
export default function EdgeArrows({ target, prev, next }: { target: string; prev: string; next: string }) {
  const [top, setTop] = useState<number | null>(null);
  const [scrolls, setScrolls] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [nudge, setNudge] = useState(false);
  const aim = useRef({ i: 0, at: 0 });
  const wrap = useRef<HTMLDivElement>(null);

  const cards = (row: HTMLElement) => [...row.children].filter((c): c is HTMLElement => (c as HTMLElement).offsetWidth > 0);
  const current = (row: HTMLElement) => {
    const list = cards(row);
    const left = row.getBoundingClientRect().left;
    let best = 0;
    list.forEach((c, i) => {
      if (Math.abs(c.getBoundingClientRect().left - left) < Math.abs(list[best].getBoundingClientRect().left - left)) best = i;
    });
    return best;
  };

  useEffect(() => {
    const row = document.getElementById(target);
    const box = wrap.current?.parentElement;
    if (!row || !box) return;
    const update = () => {
      setScrolls(row.scrollWidth > row.clientWidth + 2);
      setAtStart(row.scrollLeft <= 2);
      setAtEnd(row.scrollLeft >= row.scrollWidth - row.clientWidth - 2);
      const anchor = row.querySelector<HTMLElement>("[data-row-anchor]");
      if (anchor) {
        const a = anchor.getBoundingClientRect();
        setTop(a.top - box.getBoundingClientRect().top + a.height / 2);
      }
    };
    update();
    row.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const ro = new ResizeObserver(update);
    ro.observe(row);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setNudge(true);
        io.disconnect();
      },
      { threshold: 0.5 },
    );
    io.observe(row);
    return () => {
      row.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
      io.disconnect();
    };
  }, [target]);

  const go = (step: number) => {
    const row = document.getElementById(target);
    if (!row) return;
    const list = cards(row);
    const index = current(row);
    // Quick taps during the smooth scroll add up instead of getting lost.
    const moving = aim.current.i !== index && performance.now() - aim.current.at < 1500;
    const i = Math.max(0, Math.min(list.length - 1, (moving ? aim.current.i : index) + step));
    const card = list[i];
    if (!card) return;
    aim.current = { i, at: performance.now() };
    row.scrollTo({ left: row.scrollLeft + card.getBoundingClientRect().left - row.getBoundingClientRect().left, behavior: "smooth" });
  };

  const btn =
    "edge-arrow pointer-events-auto absolute grid h-11 w-11 -translate-y-1/2 place-items-center border border-foreground/25 bg-background/90 text-foreground backdrop-blur-sm transition-[opacity,background-color,color] duration-200 hover:bg-foreground hover:text-background focus-visible:opacity-100";

  return (
    <div ref={wrap} aria-hidden={!scrolls} className={`pointer-events-none absolute inset-0 z-10 ${scrolls && top !== null ? "" : "hidden"}`}>
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label={prev}
        tabIndex={atStart ? -1 : 0}
        className={`${btn} left-3 ${atStart ? "pointer-events-none! opacity-0" : "opacity-100"}`}
        style={{ top: top ?? 0 }}
      >
        <ArrowLeft size={18} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label={next}
        tabIndex={atEnd ? -1 : 0}
        className={`${btn} right-3 ${atEnd ? "pointer-events-none! opacity-0" : "opacity-100"} ${nudge && atStart ? "edge-arrow-nudge" : ""}`}
        style={{ top: top ?? 0 }}
      >
        <ArrowRight size={18} aria-hidden />
      </button>
    </div>
  );
}
