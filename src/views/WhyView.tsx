import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Code2,
  CloudOff,
  CreditCard,
  FileText,
  Lock,
  Mail,
  MapPin,
  MousePointerClick,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionBar from "@/components/instrument/SectionBar";
import BuyButton from "@/components/software/BuyButton";
import DownloadButton from "@/components/software/DownloadButton";
import { TRIAL_DAYS, planText } from "@/lib/pricing";
import { currencyFor } from "@/lib/currency";
import { href, type Lang } from "@/lib/i18n";
import "@/components/why/why.css";

/**
 * "Warum Koja Office" (/warum-koja, /en/why-koja): why people switch, what every Koja app does the same way and who is
 * behind it. Moved off the home page to keep it short; here as graphics that animate in (src/components/why/why.css).
 */

const de = {
  hud: "Warum Koja Office",
  h1: (
    <>
      Weniger verwalten. Mehr <span className="text-highlight">erschaffen</span>.
    </>
  ),
  lead: "Drei Gründe, warum Leute von Abo-Software zu Koja Office wechseln.",
  s1Label: "Abo-Frust, gelöst",
  s1Meta: "12 Monate im Vergleich",
  s1Title: (
    <>
      Du willst etwas erschaffen. <span className="text-highlight">Keine</span> Abos verwalten.
    </>
  ),
  billAbo: "Adobe CC Pro",
  billAboSum: "935,88 € im Jahr",
  billKoja: "Koja Office",
  billKojaSum: (once: string) => `${once} einmal`,
  billNote: "Listenpreis Adobe Creative Cloud Pro: 77,99 € im Monat (Stand November 2026).",
  fixes: [
    { pain: "Abo-Kosten, die nie enden", fix: "Einmal zahlen und behalten" },
    { pain: "Konto und Cloud vor der ersten Datei", fix: "Startet offline, ohne Konto" },
    { pain: "Ein ganz neues Programm lernen", fix: "Ebenen, Menüs und Kurzbefehle, wo du sie erwartest" },
  ],
  s2Label: "Gebaut für deinen Computer",
  s2Meta: "Für jede App gleich",
  s2Title: (
    <>
      Gebaut für deinen <span className="text-highlight">Computer</span>.
    </>
  ),
  offline: "Offline",
  benefits: [
    { icon: Zap, title: "Echte Desktop-Apps", text: "Starten schnell, laufen ohne Internet." },
    { icon: FileText, title: "Deine Dateiformate", text: ".docx, .xlsx, .pptx, .psd und PDF direkt öffnen." },
    { icon: CloudOff, title: "Kein Konto, keine Cloud", text: "Deine Arbeit bleibt auf deinem Computer." },
    { icon: MousePointerClick, title: "Online kündigen", text: "Zwei Felder, ein Klick. Ohne Gebühr." },
    { icon: Lock, title: "Geprüft und signiert", text: "Mit Launcher, Aktivierung und Updates." },
    { icon: ShieldCheck, title: "Ein echtes Unternehmen", text: "Mit Impressum und Support von Menschen." },
  ],
  formats: "Layout und Umbrüche können abweichen. Teste mit Kopien deiner Dateien.",
  s3Label: "Wer dahinter steht",
  s3Meta: "Kojalytics · Hamburg",
  s3Title: (
    <>
      Ein kleines Studio. <span className="text-highlight">Echter</span> Support.
    </>
  ),
  pipe: [
    { icon: Code2, t: "Entwickeln" },
    { icon: ScanSearch, t: "Prüfen" },
    { icon: BadgeCheck, t: "Signieren" },
    { icon: Truck, t: "Ausliefern" },
    { icon: RefreshCw, t: "Updates gratis" },
  ],
  facts: [
    { icon: MapPin, t: "Kojalytics aus Hamburg" },
    { icon: CreditCard, t: "Sichere Zahlung über Stripe" },
    { icon: Mail, t: "support@kojalytics.com, von uns beantwortet" },
  ],
  ctaTitle: "Selbst ausprobieren?",
  ctaText: `Alle 13 Apps ${TRIAL_DAYS} Tage kostenlos, ohne Zahlungsdaten.`,
  trial: `${TRIAL_DAYS} Tage kostenlos testen`,
  apps: "Alle 13 Apps ansehen",
};

const en: typeof de = {
  hud: "Why Koja Office",
  h1: (
    <>
      Manage less. <span className="text-highlight">Create</span> more.
    </>
  ),
  lead: "Three reasons people switch from subscription software to Koja Office.",
  s1Label: "Subscription fatigue, solved",
  s1Meta: "12 months compared",
  s1Title: (
    <>
      You want to create things. <span className="text-highlight">Not</span> manage subscriptions.
    </>
  ),
  billAbo: "Adobe CC Pro",
  billAboSum: "$839.88 a year",
  billKoja: "Koja Office",
  billKojaSum: (once: string) => `${once} once`,
  billNote: "List price of Adobe Creative Cloud Pro: $69.99 a month (as of November 2026).",
  fixes: [
    { pain: "Subscription fees that never end", fix: "Pay once and keep it" },
    { pain: "An account and the cloud before your first file", fix: "Starts offline, no account" },
    { pain: "Learning a whole new program", fix: "Layers, menus and shortcuts where you expect them" },
  ],
  s2Label: "Built for your computer",
  s2Meta: "The same for every app",
  s2Title: (
    <>
      Built for your <span className="text-highlight">computer</span>.
    </>
  ),
  offline: "Offline",
  benefits: [
    { icon: Zap, title: "Real desktop apps", text: "Start fast, run without the internet." },
    { icon: FileText, title: "Your file formats", text: "Open .docx, .xlsx, .pptx, .psd and PDF directly." },
    { icon: CloudOff, title: "No account, no cloud", text: "Your work stays on your computer." },
    { icon: MousePointerClick, title: "Cancel online", text: "Two fields, one click. No fee." },
    { icon: Lock, title: "Tested and signed", text: "With launcher, activation and updates." },
    { icon: ShieldCheck, title: "A real company", text: "With an imprint and support from people." },
  ],
  formats: "Layout and line breaks may differ. Test with copies of your files.",
  s3Label: "Who's behind it",
  s3Meta: "Kojalytics · Hamburg",
  s3Title: (
    <>
      A small studio. <span className="text-highlight">Real</span> support.
    </>
  ),
  pipe: [
    { icon: Code2, t: "Develop" },
    { icon: ScanSearch, t: "Test" },
    { icon: BadgeCheck, t: "Sign" },
    { icon: Truck, t: "Deliver" },
    { icon: RefreshCw, t: "Free updates" },
  ],
  facts: [
    { icon: MapPin, t: "Kojalytics, Hamburg, Germany" },
    { icon: CreditCard, t: "Secure payment via Stripe" },
    { icon: Mail, t: "support@kojalytics.com, answered by us" },
  ],
  ctaTitle: "Try it yourself?",
  ctaText: `All 13 apps free for ${TRIAL_DAYS} days, no payment details.`,
  trial: `${TRIAL_DAYS}-day free trial`,
  apps: "See all 13 apps",
};

const pad = "px-5 md:px-10";
const two = (n: number) => String(n).padStart(2, "0");
const v = (vars: Record<string, string | number>) => vars as CSSProperties;

// Where each file starts before it flies into the window.
const FILES = [
  { ext: ".docx", color: "#2b579a", fx: "-60px", fy: "-50px", fr: "-12deg" },
  { ext: ".xlsx", color: "#217346", fx: "0px", fy: "-70px", fr: "6deg" },
  { ext: ".pptx", color: "#c43e1c", fx: "60px", fy: "-50px", fr: "12deg" },
  { ext: ".psd", color: "#2563eb", fx: "-60px", fy: "50px", fr: "10deg" },
  { ext: ".pdf", color: "#dc2626", fx: "0px", fy: "70px", fr: "-6deg" },
  { ext: ".svg", color: "#9333ea", fx: "60px", fy: "50px", fr: "-10deg" },
];

export default function WhyView({ lang }: { lang: Lang }) {
  const t = lang === "de" ? de : en;
  const cur = currencyFor(lang);
  const once = planText("lifetime", lang, cur).label;

  return (
    <>
      <Navigation cta="buy" />
      <main className="pt-12">
        {/* Hero */}
        <section className="rail crosshairs">
          <div className={`py-16 md:py-24 ${pad}`}>
            <p className="hud rise-in">{t.hud}</p>
            <h1 className="display rise-in mt-5 max-w-4xl text-[clamp(2.2rem,5vw,4.2rem)] [--i:1]">{t.h1}</h1>
            <p className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-muted [--i:2]">{t.lead}</p>
          </div>
        </section>

        {/* 01 Subscription vs. once */}
        <section className="rail crosshairs">
          <SectionBar index="01" label={t.s1Label} meta={t.s1Meta} />
          <div className={`grid gap-12 py-14 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center ${pad}`}>
            <h2 className="display text-[clamp(2rem,4.2vw,3.4rem)]" data-reveal>
              {t.s1Title}
            </h2>
            <div className="border border-border p-6 md:p-8" data-reveal>
              <div className="why-bills">
                <div className="row">
                  <span className="lab hud text-foreground">{t.billAbo}</span>
                  <span className="ticks" aria-hidden>
                    {Array.from({ length: 12 }, (_, k) => (
                      <i key={k} style={v({ "--k": k })} />
                    ))}
                  </span>
                  <span className="sum text-[#c62a2f]">{t.billAboSum}</span>
                </div>
                <div className="row">
                  <span className="lab hud text-foreground">{t.billKoja}</span>
                  <span className="ticks once" aria-hidden>
                    {Array.from({ length: 12 }, (_, k) => (
                      <i key={k} style={v({ "--k": k })} />
                    ))}
                  </span>
                  <span className="sum font-semibold text-success">{t.billKojaSum(once)}</span>
                </div>
              </div>
              <p className="mt-5 text-xs text-muted">{t.billNote}</p>
            </div>
          </div>
          <div className="cells border-y border-border md:grid-cols-3">
            {t.fixes.map((f, i) => (
              <div key={f.pain} className="why-fix p-6 md:p-8" data-reveal style={v({ "--i": i })}>
                <div>
                  <p className="hud text-faint">{two(i + 1)}</p>
                  <p className="mt-4 text-[15px]">
                    <span className="pain">{f.pain}</span>
                  </p>
                  <p className="fix mt-3 text-lg font-semibold leading-snug">{f.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 02 Built for your computer */}
        <section className="rail crosshairs">
          <SectionBar index="02" label={t.s2Label} meta={t.s2Meta} />
          <div className={`grid gap-12 py-14 md:py-20 lg:grid-cols-2 lg:items-center ${pad}`}>
            <h2 className="display text-[clamp(2rem,4.2vw,3.4rem)]" data-reveal>
              {t.s2Title}
            </h2>
            <div data-reveal>
              <div className="why-mac">
                <div className="bar">
                  <i />
                  <i />
                  <i />
                  <span className="offline">
                    <span className="dot" />
                    {t.offline}
                  </span>
                </div>
                <div className="stage">
                  {FILES.map((f, k) => (
                    <span key={f.ext} className="file" style={v({ "--k": k, "--fx": f.fx, "--fy": f.fy, "--fr": f.fr })}>
                      <FileText size={22} strokeWidth={1.6} style={{ color: f.color }} aria-hidden />
                      {f.ext}
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-xs text-muted">{t.formats}</p>
            </div>
          </div>
          <div className="cells border-y border-border grid-cols-2 lg:grid-cols-3">
            {t.benefits.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="p-5 md:p-8" data-reveal style={v({ "--i": i % 3 })}>
                <div>
                  <span className="icon-box why-icon" style={v({ "--i": i % 3 })}>
                    <Icon size={18} aria-hidden />
                  </span>
                  <h3 className="display mt-5 text-[1.1rem] md:text-[1.3rem]">{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 03 Who's behind it */}
        <section className="rail crosshairs">
          <SectionBar index="03" label={t.s3Label} meta={t.s3Meta} />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h2 className="display max-w-3xl text-[clamp(2rem,4.2vw,3.4rem)]" data-reveal>
              {t.s3Title}
            </h2>
            <div className="mt-12 md:mt-16" data-reveal>
              <div className="why-pipe">
                <span className="line" aria-hidden />
                {t.pipe.map(({ icon: Icon, t: label }, k) => (
                  <div key={label} className="node">
                    <span className="ring" style={v({ "--k": k })}>
                      <Icon size={22} strokeWidth={1.8} aria-hidden />
                    </span>
                    <span className="cap hud text-foreground" style={v({ "--k": k })}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="cells border-y border-border md:grid-cols-3">
            {t.facts.map(({ icon: Icon, t: fact }, i) => (
              <div key={fact} className="p-6 md:p-8" data-reveal style={v({ "--i": i })}>
                <p className="flex items-center gap-3 text-[15px] font-semibold">
                  <span className="icon-box why-icon shrink-0" style={v({ "--i": i })}>
                    <Icon size={18} aria-hidden />
                  </span>
                  {fact}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Try it */}
        <section className="rail crosshairs">
          <div className={`flex flex-col items-center py-20 text-center md:py-24 ${pad}`}>
            <h2 className="display text-[clamp(1.8rem,3.4vw,2.8rem)]" data-reveal>
              {t.ctaTitle}
            </h2>
            <p className="mt-4 text-lg text-muted" data-reveal>
              {t.ctaText}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row" data-reveal>
              <BuyButton source="why-cta" />
              <DownloadButton source="why-cta" variant="secondary" label={t.trial} mobile="send" />
            </div>
            <Link href={href(lang, "/#apps")} className="link-hud mt-8">
              {t.apps} <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  );
}
