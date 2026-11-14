"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { WindowFrame } from "@/components/ui/mac-window";

type Step = { label: string; text: string; start: number };

/**
 * A silent demo loop of an app (rendered by scripts/app-demos) next to the list of the features it visits.
 * The video carries no words, so it works in every language; the list is the text. It plays only while it
 * is on screen and never by itself for people who prefer reduced motion (they get the poster and player
 * controls). The feature on screen is marked, a thin line shows how long it stays; a click jumps there.
 */
export default function AppDemo({
  name,
  src,
  poster,
  duration,
  travel,
  steps,
  ink,
  children,
}: {
  name: string;
  src: string;
  poster: string;
  /** Length of the loop in seconds. */
  duration: number;
  /** Seconds the camera needs from one feature to the next. */
  travel: number;
  steps: Step[];
  ink: string;
  /** Heading and intro above the list. */
  children: ReactNode;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // With reduced motion nothing starts by itself; the player controls let people start it.
    v.controls = reduced;
    // A feature counts as shown from halfway through the move towards it until halfway through the next move.
    const from = steps.map((s, i) => (i === 0 ? 0 : s.start - travel / 2));
    let raf = 0;
    const tick = () => {
      const t = v.currentTime;
      let i = 0;
      while (i < steps.length - 1 && t >= from[i + 1]) i++;
      setActive(i);
      const end = i < steps.length - 1 ? from[i + 1] : duration;
      bars.current.forEach((b, j) => b && (b.style.transform = `scaleX(${j === i ? Math.min(1, (t - from[i]) / (end - from[i])) : 0})`));
      if (!v.paused) raf = requestAnimationFrame(tick);
    };
    const onPlay = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    v.addEventListener("play", onPlay);
    v.addEventListener("seeked", tick);
    const io = new IntersectionObserver(
      ([e]) => {
        if (reduced) return;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("seeked", tick);
    };
  }, [duration, travel, steps]);

  const jump = (i: number) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = Math.max(0, steps[i].start - travel * 0.6);
    v.play().catch(() => {});
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
      <div className="min-w-0" data-reveal>
        {children}
        <ol className="mt-8 border-t border-border">
          {steps.map((s, i) => (
            <li key={s.label} className="border-b border-border">
              <button
                type="button"
                onClick={() => jump(i)}
                aria-current={i === active ? "step" : undefined}
                className={`relative flex w-full items-baseline gap-4 py-3 text-left transition-colors ${i === active ? "text-foreground" : "text-muted hover:text-foreground"}`}
              >
                <span className="w-5 shrink-0 font-mono text-xs font-semibold" style={{ color: i === active ? ink : undefined }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="display block text-[1.1rem]">{s.label}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-muted">{s.text}</span>
                </span>
                <span
                  ref={(el) => {
                    bars.current[i] = el;
                  }}
                  aria-hidden
                  className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0"
                  style={{ background: ink }}
                />
              </button>
            </li>
          ))}
        </ol>
      </div>
      <figure className="m-0 min-w-0" data-reveal>
        <WindowFrame label={name}>
          <video
            ref={video}
            className="block h-auto w-full bg-white"
            width={1280}
            height={800}
            poster={poster}
            muted
            loop
            playsInline
            preload="none"
            aria-label={`${name}: ${steps.map((s) => s.label).join(", ")}`}
          >
            <source src={src} type="video/mp4" />
          </video>
        </WindowFrame>
        <figcaption className="mt-3 text-sm leading-relaxed text-muted">
          Animation aus Bildschirmfotos der aktuellen Version, ohne Ton.
        </figcaption>
      </figure>
    </div>
  );
}
