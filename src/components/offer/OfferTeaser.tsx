import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PLANS } from "@/lib/pricing";
import { OFFER_CODE, OFFER_END_LONG, OFFER_HREF, OFFER_LABEL, OFFER_PRICE, isOfferRunning } from "@/lib/offer";

const icon = <Image src="/office/koja-office-icon.svg" alt="" width={44} height={44} unoptimized className="h-11 w-11" />;

/**
 * One line on Koja Office right after the first section of the busiest entry pages (home, /lizenzen), so nobody has
 * to find it in the menu. Before/after the end of the offer as in OfferBand.
 */
export default function OfferTeaser() {
  const running = isOfferRunning();
  return (
    <aside className="rail border-t border-border" aria-label="Koja Office">
      {running && (
        <a href={OFFER_HREF} className="offer-teaser offer-live">
          {icon}
          <span className="min-w-0 md:flex md:items-center md:gap-4">
            <span className="offer-tag">{OFFER_LABEL}</span>
            <span className="mt-2 block text-[16px] leading-snug md:mt-0 md:text-[17px]">
              <b className="font-semibold">Koja Office:</b> 13 Apps für Mac und Windows.{" "}
              {/* Its own line where the row is too narrow for one (lg to xl) */}
              <span className="lg:max-xl:block">
                Einmal{" "}
                <span className="whitespace-nowrap">
                  <b className="font-semibold">{OFFER_PRICE}</b> statt <s className="text-muted">{PLANS.lifetime.label}</s>
                </span>
                , kein Abo.
              </span>
              {/* Below lg the code and the end date as a second line of normal text */}
              <span className="mt-1.5 flex flex-wrap gap-x-4 text-muted lg:hidden">
                <span>
                  Code <span className="font-mono font-semibold tracking-[0.06em] text-foreground">{OFFER_CODE}</span>
                </span>
                <span className="whitespace-nowrap">bis {OFFER_END_LONG}</span>
              </span>
            </span>
          </span>
          <span className="flex items-center gap-4">
            <span className="hud hidden whitespace-nowrap lg:flex lg:flex-col lg:items-end lg:gap-1.5">
              <span className="offer-code text-foreground">{OFFER_CODE}</span>
              <span>bis {OFFER_END_LONG}</span>
            </span>
            <span className="link-hud">
              <span className="max-md:sr-only">Ansehen</span>
              <ArrowRight size={16} aria-hidden />
            </span>
          </span>
        </a>
      )}
      <Link href="/software" className={`offer-teaser ${running ? "offer-over" : ""}`}>
        {icon}
        <span className="text-[16px] leading-snug md:text-[17px]">
          <b className="font-semibold">Koja Office:</b> 13 Apps für Mac und Windows. Einmal{" "}
          <b className="whitespace-nowrap font-semibold">{PLANS.lifetime.label}</b>, kein Abo.
        </span>
        <span className="link-hud">
          <span className="max-md:sr-only">Ansehen</span>
          <ArrowRight size={16} aria-hidden />
        </span>
      </Link>
    </aside>
  );
}
