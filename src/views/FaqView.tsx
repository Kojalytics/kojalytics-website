import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionBar from "@/components/instrument/SectionBar";
import Faq, { faqJsonLd } from "@/components/software/Faq";
import BuyButton from "@/components/software/BuyButton";
import DownloadButton from "@/components/software/DownloadButton";
import { softwareFaq } from "@/lib/software-faq";
import { currencyFor } from "@/lib/currency";
import { TRIAL_DAYS } from "@/lib/pricing";
import { jsonLd } from "@/lib/site";
import type { Lang } from "@/lib/i18n";

/** The questions about Koja Office (/fragen, /en/faq), moved off the home page; linked from the guides and the footer. */
const T = {
  de: {
    hud: "Häufige Fragen",
    h1: (
      <>
        Bevor du <span className="text-highlight">lädst</span>.
      </>
    ),
    lead: "Preise, Lizenz, Geräte, Datenschutz und Dateiformate: die Antworten auf das, was Leute vor dem Kauf fragen.",
    label: "Fragen zu Koja Office",
    meta: "Preis · Lizenz · Daten",
    more: "Noch eine Frage? Schreib an",
    guides: "Zu den Ratgebern",
    trial: `${TRIAL_DAYS} Tage kostenlos testen`,
  },
  en: {
    hud: "FAQ",
    h1: (
      <>
        Before you <span className="text-highlight">download</span>.
      </>
    ),
    lead: "Pricing, licence, devices, privacy and file formats: answers to what people ask before they buy.",
    label: "Questions about Koja Office",
    meta: "Price · licence · data",
    more: "Another question? Write to",
    guides: "",
    trial: `Try it free for ${TRIAL_DAYS} days`,
  },
};

export default function FaqView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const faq = softwareFaq(lang, currencyFor(lang));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd(faq))} />
      <Navigation cta="buy" />
      <main className="pt-12">
        <section className="rail crosshairs">
          <div className="px-5 py-16 md:px-10 md:py-24">
            <p className="hud rise-in">{t.hud}</p>
            <h1 className="display rise-in mt-5 max-w-4xl text-[clamp(2.2rem,5vw,4.2rem)] [--i:1]">{t.h1}</h1>
            <p className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-muted [--i:2]">{t.lead}</p>
          </div>
        </section>
        <section className="rail crosshairs">
          <SectionBar index="01" label={t.label} meta={t.meta} />
          <div className="px-5 py-12 md:px-10 md:py-16">
            <Faq items={faq} />
            <p className="mt-10 text-[15px] text-muted">
              {t.more}{" "}
              <a href="mailto:support@kojalytics.com" className="text-foreground underline underline-offset-4">
                support@kojalytics.com
              </a>
              .
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <BuyButton source="faq" />
              <DownloadButton source="faq" variant="secondary" label={t.trial} mobile="send" />
              {lang === "de" && (
                <Link href="/ratgeber" className="link-hud sm:ml-4">
                  {t.guides} <ArrowUpRight size={14} aria-hidden />
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  );
}

