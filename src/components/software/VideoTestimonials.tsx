"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { posterSrc, videoSrc, type TestimonialVideo } from "@/lib/testimonial-videos";


const two = (n: number) => String(n).padStart(2, "0");

const L = {
  de: {
    soundOn: "Ton einschalten",
    soundOff: "Ton ausschalten",
    note: "Nachgestellt mit KI · echte Kundenaussage",
    label: (role: string) => `Kundenstimme (${role}), mit KI nachgestellt`,
  },
  en: {
    soundOn: "Turn sound on",
    soundOff: "Turn sound off",
    note: "Re-enacted with AI · real customer quote",
    label: (role: string) => `Customer voice (${role}), re-enacted with AI`,
  },
};

/**
 * One card of the customer-voices row: a 7-second vertical clip with burnt-in-looking captions (real text, so it
 * is translatable and readable by search engines) and the full quote below. Nothing loads until the card is close
 * to the screen (no poster, no video bytes), so the row costs the page nothing above the fold. The clip plays
 * silently while it is mostly on screen; a button turns the sound on (and off for every other card).
 * With reduced motion or data saver on, nothing plays by itself: people get the poster and player controls.
 */
function Card({
  video,
  index,
  lang,
  soundOwner,
  setSoundOwner,
}: {
  video: TestimonialVideo;
  index: number;
  lang: Lang;
  soundOwner: string | null;
  setSoundOwner: (slug: string | null) => void;
}) {
  const t = L[lang];
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [cue, setCue] = useState(-1);
  const loud = soundOwner === video.slug;
  const role = video.role[lang];

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches || !!conn?.saveData;
    // Without autoplay, the player controls let people start the clip themselves.
    v.controls = calm;
    // Load only when the card comes within ~one screen of the viewport.
    const nearIo = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          nearIo.disconnect();
        }
      },
      { rootMargin: "600px 600px" },
    );
    nearIo.observe(v);
    // Play only while most of the clip is visible (also sideways in the row).
    const playIo = new IntersectionObserver(
      ([e]) => {
        if (calm) return;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.6 },
    );
    playIo.observe(v);
    const onTime = () => {
      const now = v.currentTime;
      setCue(video.cues.findIndex((c) => now >= c.start && now < c.end));
    };
    v.addEventListener("timeupdate", onTime);
    return () => {
      nearIo.disconnect();
      playIo.disconnect();
      v.removeEventListener("timeupdate", onTime);
    };
  }, [video.cues]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = !loud;
    if (loud) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  }, [loud]);

  const quote = video.cues.map((c) => c[lang]).join(" ");

  return (
    <article data-reveal style={{ ["--i" as string]: index % 4 }} className="flex w-[78%] shrink-0 flex-col sm:w-[46%] lg:w-[calc(25%_-_1px)]">
      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <span className="grid h-6 min-w-8 place-items-center bg-foreground px-1.5 font-mono text-[11px] font-semibold text-white">{two(index + 1)}</span>
        <span className="hud truncate">{role}</span>
      </div>
      <div className="relative aspect-[9/16] overflow-hidden border-y border-border bg-surface">
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          width={540}
          height={960}
          src={near ? videoSrc(video) : undefined}
          poster={near ? posterSrc(video) : undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-label={t.label(role)}
        />
        {cue >= 0 && (
          <p aria-hidden className="pointer-events-none absolute inset-x-3 bottom-3 bg-foreground/85 px-3 py-2 text-[15px] font-medium leading-snug text-white">
            {video.cues[cue][lang]}
          </p>
        )}
        <button
          type="button"
          onClick={() => setSoundOwner(loud ? null : video.slug)}
          aria-pressed={loud}
          aria-label={loud ? t.soundOff : t.soundOn}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center border border-foreground bg-background text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          {loud ? <Volume2 size={18} aria-hidden /> : <VolumeX size={18} aria-hidden />}
        </button>
      </div>
      <div className="flex flex-1 flex-col px-5 pb-6 pt-5">
        <blockquote className="m-0 flex-1 text-[15px] leading-relaxed text-foreground">{lang === "de" ? `„${quote}“` : `“${quote}”`}</blockquote>
        <p className="hud mt-5">{t.note}</p>
      </div>
    </article>
  );
}

export default function VideoTestimonials({ videos, lang, rowId }: { videos: TestimonialVideo[]; lang: Lang; rowId: string }) {
  const [soundOwner, setSoundOwner] = useState<string | null>(null);
  return (
    <div id={rowId} className="cells flex overflow-x-auto overflow-y-hidden overscroll-x-contain border-y border-border [scrollbar-width:none]">
      {videos.map((v, i) => (
        <Card key={v.slug} video={v} index={i} lang={lang} soundOwner={soundOwner} setSoundOwner={setSoundOwner} />
      ))}
    </div>
  );
}
