// Perspective tunnel hero, adapted from 21st.dev.
// What changed from the original: the page scrolls normally (a sticky stage driven by useScroll
// instead of a blocked wheel event, so touch works too), the headline and buttons are passed in as
// server-rendered HTML and are visible from the first frame, the flying cards load after the first
// paint, cards use next/image, and reduced motion gets a still collage.

import type { ReactNode } from "react";
import TunnelCardsLazy from "./tunnel-cards-lazy";
import type { TunnelItem } from "./tunnel-cards";

export type { TunnelItem };

export default function PerspectiveTunnelHero({
  items,
  children,
}: {
  items: TunnelItem[];
  /** Headline, subline and buttons. Rendered above the tunnel and visible from the first frame. */
  children: ReactNode;
}) {
  return (
    <section className="relative h-[200svh] md:h-[240svh] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden motion-reduce:static motion-reduce:min-h-[100svh] motion-reduce:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(209,254,23,0.18)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute h-[48vmin] w-[48vmin] rounded-full border border-accent/15" aria-hidden />
        <div className="pointer-events-none absolute h-[76vmin] w-[76vmin] rounded-full border border-dashed border-white/10" aria-hidden />

        <TunnelCardsLazy items={items} />

        {/* A dark halo behind the copy keeps it readable while cards fly past */}
        <div className="relative z-20 flex w-full justify-center px-5">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_75%_55%_at_50%_50%,rgba(15,16,18,0.92)_0%,rgba(15,16,18,0.7)_60%,transparent_90%)] md:bg-[radial-gradient(ellipse_44%_50%_at_50%_50%,rgba(15,16,18,0.78)_0%,rgba(15,16,18,0.4)_55%,transparent_80%)]" />
          {children}
        </div>

        <div className="pointer-events-none absolute bottom-6 z-20 flex flex-col items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted motion-reduce:hidden" aria-hidden>
          <span>Scroll</span>
          <span className="h-6 w-px bg-gradient-to-b from-accent to-transparent" />
        </div>
      </div>
    </section>
  );
}
