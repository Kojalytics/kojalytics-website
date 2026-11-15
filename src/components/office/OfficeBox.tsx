"use client";

import { useRef } from "react";
import "./kbox.css";

/**
 * The Koja Office 2026 box as a real 3D object: six CSS planes, three of them the artwork of the box from the ads
 * (public/office/box-*.webp). It sways gently by itself; a horizontal drag (mouse or finger) turns it, and it swings
 * back when released. Vertical swipes still scroll the page. Size it with `width` (any CSS length); height and depth
 * follow. `tone="light"` swaps the blue glow of the dark stage for a soft contact shadow on white.
 * Styles: ./kbox.css (.kbox-*). Without dragging (no client JavaScript): OfficeBoxStatic.
 */
export default function OfficeBox({
  width,
  tone = "dark",
  priority = false,
  className = "",
}: {
  width: string;
  tone?: "dark" | "light";
  /** The box on the first screen: load its front right away. */
  priority?: boolean;
  className?: string;
}) {
  const tilt = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; id: number } | null>(null);

  const turn = (deg: number, release = false) => {
    const el = tilt.current;
    if (!el) return;
    el.style.transition = release ? "transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none";
    el.style.transform = `rotateY(${deg}deg)`;
  };

  return (
    <div
      className={`kbox-stage ${tone === "light" ? "on-light" : ""} ${className}`}
      style={{ ["--w" as string]: width }}
      role="img"
      aria-label="Die Verpackung von Koja Office 2026 mit den 13 App-Symbolen"
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, id: e.pointerId };
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d || d.id !== e.pointerId) return;
        const dx = e.clientX - d.x;
        // A clear sideways move turns the box (and keeps the pointer); small moves stay taps and scrolls.
        if (Math.abs(dx) > 6) e.currentTarget.setPointerCapture(e.pointerId);
        turn(Math.max(-75, Math.min(75, dx * 0.55)));
      }}
      onPointerUp={() => {
        drag.current = null;
        turn(0, true);
      }}
      onPointerCancel={() => {
        drag.current = null;
        turn(0, true);
      }}
    >
      <div ref={tilt} className="kbox-tilt">
        <div className="kbox">
          {/* eslint-disable @next/next/no-img-element -- faces of a 3D object: plain images at their natural size */}
          <img className="kbox-face kbox-front" src="/office/box-front.webp" alt="" width={900} height={1170} decoding="async" fetchPriority={priority ? "high" : undefined} draggable={false} />
          <img className="kbox-face kbox-spine" src="/office/box-spine.webp" alt="" width={248} height={1170} decoding="async" draggable={false} />
          <img className="kbox-face kbox-top" src="/office/box-top.webp" alt="" width={900} height={248} decoding="async" draggable={false} />
          {/* eslint-enable @next/next/no-img-element */}
          <i className="kbox-face kbox-right" />
          <i className="kbox-face kbox-back" />
          <i className="kbox-face kbox-bottom" />
        </div>
      </div>
      <i className="kbox-glow" />
      <i className="kbox-shadow" />
    </div>
  );
}
