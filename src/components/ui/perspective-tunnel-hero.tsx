// Perspective tunnel hero, adapted from 21st.dev.
// What changed from the original: the page scrolls normally (a sticky stage driven by useScroll
// instead of a blocked wheel event, so touch works too), the headline and buttons are passed in as
// server-rendered HTML and are visible from the first frame, the flying app windows load after the
// first paint, images use next/image, and reduced motion gets a still collage.

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
    <section className="relative h-[190svh] bg-[radial-gradient(ellipse_80%_60%_at_50%_45%,#ffffff_0%,#f5f5f4_100%)] md:h-[230svh] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden motion-reduce:static motion-reduce:min-h-[100svh] motion-reduce:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(rgba(17,17,19,0.09)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)]"
          aria-hidden
        />

        <TunnelCardsLazy items={items} />

        {/* A soft white halo behind the copy keeps it readable while windows fly past */}
        <div className="relative z-20 flex w-full justify-center px-5">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0.85)_55%,transparent_85%)] md:bg-[radial-gradient(ellipse_40%_50%_at_50%_50%,rgba(255,255,255,0.93)_0%,rgba(255,255,255,0.55)_60%,transparent_82%)]" />
          {children}
        </div>

      </div>
    </section>
  );
}
