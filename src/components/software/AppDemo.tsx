"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { WindowFrame } from "@/components/ui/mac-window";

type Step = { label: string; text: string };

/**
 * A short, silent demo loop of an app (rendered by scripts/app-demos) next to the list of the features it shows.
 * It plays only while it is on screen and never for people who prefer reduced motion (they get the poster and
 * the player controls). The step that is on screen is marked; a click on a step jumps there.
 */
export default function AppDemo({
  name,
  src,
  poster,
  seconds,
  steps,
  ink,
  children,
}: {
  name: string;
  src: string;
  poster: string;
  /** Length of one step in the video. */
  seconds: number;
  steps: Step[];
  ink: string;
  /** Heading and intro above the step list. */
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
    let raf = 0;
    const tick = () => {
      const i = Math.floor(v.currentTime / seconds) % steps.length;
      setActive(i);
      bars.current.forEach((b, j) => b && (b.style.transform = `scaleX(${j === i ? (v.currentTime % seconds) / seconds : 0})`));
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
  }, [seconds, steps.length]);

  const jump = (i: number) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = i * seconds + 1.2;
    v.play().catch(() => {});
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
      <div className="min-w-0" data-reveal>
        {children}
        <ol className="mt-8 border-t border-border">
          {steps.map((s, i) => (
            <li key={s.label} className="border-b border-border">
              <button
                type="button"
                onClick={() => jump(i)}
                aria-current={i === active ? "step" : undefined}
                className={`relative flex w-full items-baseline gap-4 py-4 text-left transition-colors ${i === active ? "text-foreground" : "text-muted hover:text-foreground"}`}
              >
                <span className="font-mono text-xs font-semibold" style={{ color: i === active ? ink : undefined }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="display block text-[1.2rem]">{s.label}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">{s.text}</span>
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
            aria-label={`${name} in Aktion: ${steps.map((s) => s.label).join(", ")}`}
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
