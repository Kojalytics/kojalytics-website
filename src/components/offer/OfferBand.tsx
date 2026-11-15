import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionBar from "@/components/instrument/SectionBar";
import OfficeBoxStatic from "@/components/office/OfficeBoxStatic";
import DownloadButton from "@/components/software/DownloadButton";
import { PLANS, TRIAL_DAYS } from "@/lib/pricing";
import { OFFER_CODE, OFFER_END_LONG, OFFER_HREF, OFFER_LABEL, OFFER_PRICE, isOfferRunning } from "@/lib/offer";

/**
 * The Koja Office band right above the footer of every content page (Footer.tsx, `offer`): box, one line on what it
 * is, the price with the introductory code and two ways forward. While the offer runs both states are in the markup
 * (.offer-live / .offer-over, switched by the inline script in layout.tsx at the end); rendered after the end, only the
 * regular price is left.
 */
export default function OfferBand() {
  const running = isOfferRunning();
  const over = running ? "offer-over" : "";

  return (
    <section className="rail crosshairs" aria-labelledby="offer-band-title">
      <SectionBar index="→" label="Koja Office" meta="Software ohne Abo" />
      <div className="grid border-b border-border lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="offer-band-stage border-b border-border lg:border-b-0 lg:border-r">
          <span aria-hidden className="hud absolute left-5 top-4 text-faint md:left-6">
            Abb. · Koja Office 2026
          </span>
          <span aria-hidden className="hud absolute right-5 top-4 text-faint max-sm:hidden md:right-6">
            13 Apps · 1 Lizenz
          </span>
          <OfficeBoxStatic width="clamp(150px, 40vw, 210px)" sizes="(min-width: 640px) 420px, 300px" tone="light" priority={false} />
        </div>

        <div className="px-5 py-10 md:px-10 md:py-14">
          {running && (
            <p className="offer-live flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="offer-tag">{OFFER_LABEL}</span>
              <span className="text-[16px] text-muted">Einführungspreis bis {OFFER_END_LONG}</span>
            </p>
          )}
          <h2 id="offer-band-title" className="display mt-4 max-w-2xl text-balance text-[clamp(1.7rem,3.3vw,2.7rem)]">
            13&nbsp;Apps für Mac und Windows. <span className="whitespace-nowrap">Einmal zahlen,</span>{" "}
            <span className="text-highlight">kein&nbsp;Abo</span>.
          </h2>

          {running && (
            <div className="offer-live">
              <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-1">
                <p className="display text-[clamp(2.6rem,5vw,3.5rem)] leading-none">{OFFER_PRICE}</p>
                <p className="pb-1 text-[16px] text-muted">
                  statt <s className="decoration-2">{PLANS.lifetime.label}</s> · einmalig, inkl. MwSt.
                </p>
              </div>
              <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[16px] text-muted">
                <span>
                  Code <span className="offer-code ml-1 text-[15px] text-foreground">{OFFER_CODE}</span>
                </span>
                <span>wird automatisch angewendet</span>
              </p>
            </div>
          )}
          <div className={over}>
            <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-1">
              <p className="display text-[clamp(2.6rem,5vw,3.5rem)] leading-none">{PLANS.lifetime.label}</p>
              <p className="pb-1 text-[16px] text-muted">einmalig, inkl. MwSt.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {running && (
              <a href={OFFER_HREF} className="btn-buy btn-lg offer-live">
                Koja Office ansehen <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
              </a>
            )}
            <Link href="/software" className={`btn-buy btn-lg ${over}`}>
              Koja Office ansehen <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
            </Link>
            <DownloadButton
              source="offer-band"
              variant="secondary"
              label={`${TRIAL_DAYS} Tage kostenlos testen`}
              shareLabel="Link an Computer senden"
              className="btn-lg"
            />
          </div>
          <p className="hud mt-5 !text-[13px] !tracking-[0.1em]">
            Einmalzahlung · <span className="whitespace-nowrap">auf bis zu 3 Geräten</span> ·{" "}
            <span className="whitespace-nowrap">14 Tage Widerrufsrecht</span>
          </p>
        </div>
      </div>
    </section>
  );
}
