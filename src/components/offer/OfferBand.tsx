import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionBar from "@/components/instrument/SectionBar";
import OfficeBoxStatic from "@/components/office/OfficeBoxStatic";
import DownloadButton from "@/components/software/DownloadButton";
import { TRIAL_DAYS, planText } from "@/lib/pricing";
import { OFFER_CODE, OFFER_HREF, isOfferRunning, offerText } from "@/lib/offer";
import { href, type Lang } from "@/lib/i18n";

const T = {
  de: {
    meta: "Software ohne Abo",
    fig: "Abb. · Koja Office 2026",
    license: "13 Apps · 1 Lizenz",
    intro: "Einführungspreis bis",
    title: (
      <>
        13&nbsp;Apps für Mac und Windows. <span className="whitespace-nowrap">Einmal zahlen,</span>{" "}
        <span className="text-highlight">kein&nbsp;Abo</span>.
      </>
    ),
    instead: "statt",
    once: "einmalig, inkl. MwSt.",
    applied: "wird automatisch angewendet",
    see: "Koja Office ansehen",
    trial: `${TRIAL_DAYS} Tage kostenlos testen`,
    facts: (
      <>
        Einmalzahlung · <span className="whitespace-nowrap">auf bis zu 3 Geräten</span> ·{" "}
        <span className="whitespace-nowrap">14 Tage Widerrufsrecht</span>
      </>
    ),
  },
  en: {
    meta: "Software without a subscription",
    fig: "Fig. · Koja Office 2026",
    license: "13 apps · 1 license",
    intro: "Introductory price until",
    title: (
      <>
        13&nbsp;apps for Mac and Windows. <span className="whitespace-nowrap">Pay once,</span>{" "}
        <span className="text-highlight">no&nbsp;subscription</span>.
      </>
    ),
    instead: "instead of",
    once: "one-time, incl. VAT",
    applied: "applied automatically",
    see: "See Koja Office",
    trial: `Try it free for ${TRIAL_DAYS} days`,
    facts: (
      <>
        One-time payment · <span className="whitespace-nowrap">on up to 3 devices</span> ·{" "}
        <span className="whitespace-nowrap">14-day right of withdrawal</span>
      </>
    ),
  },
};

/**
 * The Koja Office band right above the footer of every content page (Footer.tsx, `offer`): box, one line on what it
 * is, the price with the introductory code and two ways forward. While the offer runs both states are in the markup
 * (.offer-live / .offer-over, switched by the inline script in layout.tsx at the end); rendered after the end, only the
 * regular price is left.
 */
export default function OfferBand({ lang = "de" }: { lang?: Lang }) {
  const t = T[lang];
  const offer = offerText(lang);
  const regular = planText("lifetime", lang).label;
  const running = isOfferRunning();
  const over = running ? "offer-over" : "";

  return (
    <section className="rail crosshairs" aria-labelledby="offer-band-title">
      <SectionBar index="→" label="Koja Office" meta={t.meta} />
      <div className="grid border-b border-border lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="offer-band-stage border-b border-border lg:border-b-0 lg:border-r">
          <span aria-hidden className="hud absolute left-5 top-4 text-faint md:left-6">
            {t.fig}
          </span>
          <span aria-hidden className="hud absolute right-5 top-4 text-faint max-sm:hidden md:right-6">
            {t.license}
          </span>
          <OfficeBoxStatic width="clamp(150px, 40vw, 210px)" sizes="(min-width: 640px) 420px, 300px" tone="light" priority={false} lang={lang} />
        </div>

        <div className="px-5 py-10 md:px-10 md:py-14">
          {running && (
            <p className="offer-live flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="offer-tag">{offer.label}</span>
              <span className="text-[16px] text-muted">
                {t.intro} {offer.endLong}
              </span>
            </p>
          )}
          <h2 id="offer-band-title" className="display mt-4 max-w-2xl text-balance text-[clamp(1.7rem,3.3vw,2.7rem)]">
            {t.title}
          </h2>

          {running && (
            <div className="offer-live">
              <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-1">
                <p className="display text-[clamp(2.6rem,5vw,3.5rem)] leading-none">{offer.price}</p>
                <p className="pb-1 text-[16px] text-muted">
                  {t.instead} <s className="decoration-2">{regular}</s> · {t.once}
                </p>
              </div>
              <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[16px] text-muted">
                <span>
                  Code <span className="offer-code ml-1 text-[15px] text-foreground">{OFFER_CODE}</span>
                </span>
                <span>{t.applied}</span>
              </p>
            </div>
          )}
          <div className={over}>
            <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-1">
              <p className="display text-[clamp(2.6rem,5vw,3.5rem)] leading-none">{regular}</p>
              <p className="pb-1 text-[16px] text-muted">{t.once}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {running && (
              <a href={href(lang, OFFER_HREF)} className="btn-buy btn-lg offer-live">
                {t.see} <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
              </a>
            )}
            <Link href={href(lang, "/")} className={`btn-buy btn-lg ${over}`}>
              {t.see} <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
            </Link>
            <DownloadButton
              source="offer-band"
              variant="secondary"
              label={t.trial}
              className="btn-lg"
            />
          </div>
          <p className="hud mt-5 !text-[13px] !tracking-[0.1em]">
            {t.facts}
          </p>
        </div>
      </div>
    </section>
  );
}
