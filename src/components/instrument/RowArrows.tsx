"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const two = (n: number) => String(n).padStart(2, "0");

/**
 * Prev/next buttons for a sideways swipe row (the apps row on phones): each click moves the row to the
 * neighbouring card. The counter follows the row, so it stays right when people swipe by hand.
 */
export default function RowArrows({ target, count, prev, next }: { target: string; count: number; prev: string; next: string }) {
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(count);
  const [atEnd, setAtEnd] = useState(false);
  // The card the last click is heading to, so quick taps during the smooth scroll add up instead of getting lost.
  const aim = useRef({ i: 0, at: 0 });

  const cards = (row: HTMLElement) => [...row.children].filter((c): c is HTMLElement => (c as HTMLElement).offsetWidth > 0);

  useEffect(() => {
    const row = document.getElementById(target);
    if (!row) return;
    const update = () => {
      const list = cards(row);
      const left = row.getBoundingClientRect().left;
      let best = 0;
      list.forEach((c, i) => {
        if (Math.abs(c.getBoundingClientRect().left - left) < Math.abs(list[best].getBoundingClientRect().left - left)) best = i;
      });
      const end = row.scrollLeft >= row.scrollWidth - row.clientWidth - 2;
      setTotal(list.length);
      setAtEnd(end);
      setIndex(end ? list.length - 1 : best);
    };
    update();
    row.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      row.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [target]);

  const go = (step: number) => {
    const row = document.getElementById(target);
    if (!row) return;
    const list = cards(row);
    const moving = aim.current.i !== index && performance.now() - aim.current.at < 1500;
    const base = moving ? aim.current.i : index;
    const i = Math.max(0, Math.min(list.length - 1, base + step));
    const card = list[i];
    if (!card) return;
    aim.current = { i, at: performance.now() };
    row.scrollTo({ left: row.scrollLeft + card.getBoundingClientRect().left - row.getBoundingClientRect().left, behavior: "smooth" });
  };

  const btn =
    "grid h-11 w-11 place-items-center border border-foreground bg-background text-foreground transition-colors active:bg-foreground active:text-background disabled:border-border disabled:text-border-strong";

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="hud tabular-nums" aria-live="polite">
        {two(index + 1)} / {two(total)}
      </span>
      <div className="flex gap-2">
        <button type="button" className={btn} onClick={() => go(-1)} disabled={index === 0} aria-label={prev}>
          <ArrowLeft size={18} aria-hidden />
        </button>
        <button type="button" className={btn} onClick={() => go(1)} disabled={atEnd} aria-label={next}>
          <ArrowRight size={18} aria-hidden />
        </button>
      </div>
    </div>
  );
}
