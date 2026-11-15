"use client";

import { useEffect, useRef, useState } from "react";

export type FilmStep = { at: number; text: string };

/**
 * A silent story film of one office app (rendered with Remotion, 720×900, 15 s) beside the list of its four steps.
 * The film's captions are the list, so everything it shows can also be read. It plays only while it is on screen and
 * never by itself for people who prefer reduced motion (they get the poster and player controls). The step on screen
 * is marked in the list. Styles: src/app/office/office.css (.ko-film).
 */
export default function OfficeFilm({
  name,
  src,
  poster,
  steps,
  restart,
  ink,
}: {
  name: string;
  src: string;
  poster: string;
  /** The film's captions, each with the second it appears. */
  steps: FilmStep[];
  /** Second at which the film fades back to its first step before it loops. */
  restart: number;
  /** The app's colour, dark enough for white text. */
  ink: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // With reduced motion nothing starts by itself; the player controls let people start it.
    v.controls = reduced;
    const onTime = () => {
      const t = v.currentTime;
      let i = 0;
      if (t < restart) while (i < steps.length - 1 && t >= steps[i + 1].at) i++;
      setActive(i);
    };
    v.addEventListener("timeupdate", onTime);
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
      v.removeEventListener("timeupdate", onTime);
    };
  }, [steps, restart]);

  return (
    <div className="ko-film" style={{ ["--ink" as string]: ink }}>
      <div className="ko-film-frame">
        <video
          ref={video}
          width={720}
          height={900}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={`${name} in Aktion, Film ohne Ton`}
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
      <div className="ko-film-side">
        <ol className="ko-film-steps">
          {steps.map((s, i) => (
            <li key={s.text} aria-current={i === active ? "step" : undefined}>
              <span aria-hidden>{i + 1}</span>
              {s.text}
            </li>
          ))}
        </ol>
        <p className="ko-film-note">Animation, vereinfacht dargestellt.</p>
      </div>
    </div>
  );
}
