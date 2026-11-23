import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, ChevronRight, KeyRound, Lock, Mail, Phone, Undo2 } from "lucide-react";
import Footer from "@/components/Footer";
import AppIcon from "@/components/ui/app-icon";
import RevealManager from "@/components/instrument/RevealManager";
import OfficeBox from "@/components/office/OfficeBox";
import OfficeFilm from "@/components/office/OfficeFilm";
import SendLinkForm from "@/components/office/SendLinkForm";
import BuyButton from "@/components/software/BuyButton";
import DownloadButton from "@/components/software/DownloadButton";
import StickyBuyBar from "@/components/software/StickyBuyBar";
import TrackView from "@/components/software/TrackView";
import DiscountProvider from "@/components/software/DiscountProvider";
import { CodeBar, HeroPrice, OnceBar, Price, Receipt, Savings } from "@/components/software/OfficePrice";
import Faq, { type FaqItem } from "@/components/software/Faq";
import { APPS, appInk, getApp } from "@/lib/apps";
import { TRIAL_DAYS } from "@/lib/pricing";
import { discountForPage } from "@/lib/discount-page";
import { OG_BASE, SITE_URL } from "@/lib/site";
import "./office.css";

/*
 * Landing page for the Meta ads ("Koja Office 2026"): the dark offer ad, continued. The first screen repeats the ad
 * (headline, box, price, the code already taken off), then dark and white sections alternate. Built for phones (almost
 * all ad traffic) and for an older audience: large type, full-width buttons, one goal, no site navigation. The ad
 * link's ?code= is checked on the server, so the reduced price is there with the first paint. Not in the sitemap and
 * not indexed: /software is the page for search. Styles: ./office.css (prefix ko-).
 */

export const metadata: Metadata = {
  title: { absolute: "Koja Office 2026 – Office ohne Abo für Mac und Windows | Kojalytics" },
  description: `Word-, Excel-, PowerPoint- und PDF-Dateien öffnen und bearbeiten, ohne Abo. Für Mac und Windows, einmal zahlen. ${TRIAL_DAYS} Tage kostenlos testen.`,
  alternates: { canonical: `${SITE_URL}/office` },
  robots: { index: false, follow: true },
  openGraph: {
    ...OG_BASE,
    title: "Koja Office 2026: Office ohne Abo. Einmal zahlen, behalten.",
    description: "Word-, Excel-, PowerPoint- und PDF-Dateien öffnen und bearbeiten. Für Mac und Windows.",
    url: "/office",
    images: [{ url: "/og/software.jpg", width: 1200, height: 630, alt: "Koja Office auf dem Mac" }],
  },
};

/*
 * The four office apps, each with a silent story film (rendered with Remotion, public/office/demo-*.mp4): the everyday
 * steps of a school paper, a household book, a talk and a form. `steps` are the film's captions with the second each
 * appears (frame / 30); every film fades back to step 1 at frame 430 before it loops. `color` is the film's accent (the
 * colour of the app icon), used for the file badge and the step numbers so they match the film.
 */
const FILM_RESTART = 430 / 30;
const OFFICE = [
  {
    slug: "word-koja",
    file: ".docx",
    use: "Briefe, Lebenslauf, Vereinsordnung",
    text: "Öffnet und bearbeitet deine Word-Dateien, mit Formatvorlagen, Kommentaren und Inhaltsverzeichnis.",
    film: "word",
    color: "#2a66d8",
    steps: [
      { at: 0, text: "Text schreiben" },
      { at: 100 / 30, text: "Wort markieren" },
      { at: 190 / 30, text: "Kommentar schreiben" },
      { at: 290 / 30, text: "Bild einfügen" },
    ],
  },
  {
    slug: "grid-koja",
    file: ".xlsx",
    use: "Haushaltsbuch, Abrechnung, Listen",
    text: "Öffnet deine Excel-Tabellen, mit Formeln, Diagrammen und Farbskalen.",
    film: "grid",
    color: "#12924f",
    steps: [
      { at: 0, text: "Zahlen eintragen" },
      { at: 98 / 30, text: "Summe rechnen" },
      { at: 186 / 30, text: "Zellen färben" },
      { at: 306 / 30, text: "Diagramm einfügen" },
    ],
  },
  {
    slug: "deck-koja",
    file: ".pptx",
    use: "Vorträge für Verein, Familie und Beruf",
    text: "Öffnet deine PowerPoint-Folien zum Bearbeiten und Präsentieren.",
    film: "deck",
    color: "#e2601f",
    steps: [
      { at: 0, text: "Titel schreiben" },
      { at: 95 / 30, text: "Bild einfügen" },
      { at: 186 / 30, text: "Stichpunkte schreiben" },
      { at: 300 / 30, text: "Präsentieren" },
    ],
  },
  {
    slug: "pdf-koja",
    file: "PDF",
    use: "Formulare, Verträge, Scans",
    text: "PDFs kommentieren, ordnen, zusammenfügen, ausfüllen und unterschreiben.",
    film: "pdf",
    color: "#d93445",
    steps: [
      { at: 0, text: "PDF öffnen" },
      { at: 95 / 30, text: "Text markieren" },
      { at: 190 / 30, text: "Kommentar schreiben" },
      { at: 290 / 30, text: "Unterschreiben" },
    ],
  },
];
const OFFICE_SLUGS = new Set(OFFICE.map((o) => o.slug));

// The only comparison on the page: Microsoft 365 Single, list price 99 € a year, over five years.
const ABO_YEAR = 99;
const ABO_YEARS = [1, 2, 3, 4, 5];
const ABO_TOTAL_CENTS = ABO_YEAR * ABO_YEARS.length * 100;

// The four check tiles of the ad. Each is two halves that stay whole, so a narrow tile breaks between them.
const TILES = [
  ["Öffnet Word- &", "Excel-Dateien"],
  ["PDFs bearbeiten", "& unterschreiben"],
  ["Mac & Windows ·", "3 Geräte"],
  ["Offline ·", "ohne Konto"],
];

// What comes after the one payment: nothing.
const AFTER = [
  { label: "Abo-Gebühr pro Jahr", note: "Dauerlizenz: einmal zahlen, kein Abo." },
  { label: "Updates", note: "Kostenlos über den Kojalytics Launcher." },
  { label: "Zweiter und dritter Computer", note: "Bis zu 3 Geräte, Mac oder Windows-PC." },
];

// In the narrow cells of the nine other apps a long kind breaks at the joint of the compound ("Bild-bearbeitung").
const jointed = (kind: string) => kind.replace(/^(Bild|Audio|Layout)(?=\p{Ll})/u, "$1\u00ad");

// "E-Mail" never breaks at its hyphen.
const EMAIL = <span className="whitespace-nowrap">E-Mail</span>;
const SAMPLE_KEY = "KOJA-7Q2M-XXXX-XXXX";

const FAQ: FaqItem[] = [
  {
    q: "Ist das Microsoft Office?",
    a: "Nein. Koja Office besteht aus eigenen Apps von Kojalytics. Sie öffnen deine Word-, Excel-, PowerPoint- und PDF-Dateien, sind aber kein Produkt von Microsoft.",
  },
  {
    q: "Funktionieren meine Word- und Excel-Dateien?",
    a: `.docx, .xlsx, .pptx und PDF öffnest du direkt. Bei sehr aufwendigen Dateien können Layout und Umbrüche abweichen. Teste deshalb ${TRIAL_DAYS} Tage kostenlos mit Kopien deiner Dateien.`,
  },
  {
    q: "Ich bin gerade am Handy. Kann ich trotzdem kaufen?",
    a: "Ja. Du kaufst hier, der Lizenzschlüssel kommt sofort per E-Mail. Am Computer lädst du dann den Kojalytics Launcher von kojalytics.com und fügst den Schlüssel ein. Oder du schickst dir erst nur den Link und entscheidest später.",
  },
  {
    q: "Was ist, wenn es nicht passt?",
    a: "Du hast 14 Tage Widerrufsrecht und bekommst dein Geld zurück, ohne Begründung. Das geht online unter [Vertrag widerrufen](/widerrufen).",
  },
  { q: "Auf wie vielen Geräten kann ich es nutzen?", a: "Auf bis zu 3 Geräten, Mac oder Windows-PC." },
  {
    q: "Ist das ein Abo?",
    a: "Nein. Du zahlst einmal und nutzt Koja Office ohne Ablaufdatum. Updates bekommst du kostenlos über den Kojalytics Launcher.",
  },
];

/** The headline continues the ad the visitor tapped (utm_content of the ad link). */
function headline(content: string): { key: string; first: ReactNode; second: ReactNode } {
  const ad = content.toLowerCase();
  if (ad.includes("laptop"))
    return {
      key: "laptop",
      first: (
        <>
          Neuer Laptop,
          <br />
          kein Office?
        </>
      ),
      second: "Einmal zahlen. Behalten.",
    };
  if (ad.includes("rechner"))
    return {
      key: "rechner",
      first: "495 € im Abo?",
      second: (
        <>
          Oder einmal{" "}
          <b>
            <Price />
          </b>
          .
        </>
      ),
    };
  if (ad.includes("vs")) return { key: "vs", first: "Jedes Jahr zahlen?", second: "Oder einmal." };
  return { key: "default", first: "Office ohne Abo.", second: "Einmal zahlen. Behalten." };
}

function Secure() {
  return (
    <p className="ko-secure">
      <Lock size={17} strokeWidth={2.2} aria-hidden />
      Sichere Zahlung mit PayPal, Karte oder Klarna · Kojalytics, Hamburg
    </p>
  );
}

/* The three small pictures of "So kommt Koja Office zu dir": flat paper slips drawn in HTML, decoration only. Nothing
   in them looks like a control: no button shapes, no fields to tap. */
function OrderCard() {
  return (
    <div className="ko-ui">
      <p className="ko-ui-cap">Bestellung</p>
      <div className="ko-ui-row">
        <Image src="/office/koja-office-icon.png" alt="" width={34} height={34} unoptimized />
        <span>
          <b>Koja Office 2026</b>
          <small>Dauerlizenz</small>
        </span>
        <span className="ko-ui-amount">
          <Price />
        </span>
      </div>
      <p className="ko-ui-line">
        <span>Gesamt, einmalig</span>
        <span>
          <Price />
        </span>
      </p>
    </div>
  );
}

function MailCard() {
  return (
    <div className="ko-ui">
      <p className="ko-ui-cap">
        {EMAIL} <span>jetzt</span>
      </p>
      <div className="ko-ui-row">
        <span className="ko-k">K</span>
        <span>
          <b>Kojalytics</b>
          <small>Dein Kojalytics-Lizenzschlüssel</small>
        </span>
      </div>
      <p className="ko-ui-key">
        <code>{SAMPLE_KEY}</code>
        <span>Beispiel</span>
      </p>
    </div>
  );
}

function LauncherCard() {
  return (
    <div className="ko-ui">
      <p className="ko-ui-cap">Kojalytics Launcher</p>
      <p className="ko-ui-label">Einstellungen › Lizenz</p>
      <p className="ko-ui-key">
        <code>{SAMPLE_KEY}</code>
        <Check size={16} strokeWidth={3} />
      </p>
      <div className="ko-ui-icons">
        {OFFICE.map((o) => (
          <Image key={o.slug} src={`/apps/${o.slug}/icon.webp`} alt="" width={34} height={34} className="rounded-[22%]" />
        ))}
        <span>+ 9 weitere</span>
      </div>
    </div>
  );
}

const STEPS = [
  { title: "Jetzt kaufen", text: "Am Handy oder am Computer. Mit PayPal, Karte oder Klarna, sicher über Stripe.", ui: <OrderCard /> },
  { title: <>Lizenz per {EMAIL}</>, text: "Dein Lizenzschlüssel kommt sofort nach dem Kauf.", ui: <MailCard /> },
  {
    title: "Am Computer installieren",
    text: "Kojalytics Launcher laden, Schlüssel einfügen, Apps installieren. Das dauert ein paar Minuten.",
    ui: <LauncherCard />,
  },
];

export default async function OfficePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const found = await discountForPage(params.code ?? params.rabatt);
  const discount = found?.prices.lifetime !== undefined ? found : null;
  const ad = params.utm_content;
  const h1 = headline((Array.isArray(ad) ? ad[0] : ad) ?? "");

  return (
    <DiscountProvider initial={discount}>
      <TrackView name="office" />
      <RevealManager />

      {/* A boundary around the page: its markup streams in several rows, and React can only wait for a late row
          while hydrating inside a boundary (outside one it gives up and renders the whole page again in the browser). */}
      <Suspense>
        <div className="ko-page">
          <main>
            {/* 1 The ad, continued: brand, headline, price and box, the two ways forward */}
            <section className="ko-stage ko-hero">
              <div className="ko-col">
                <div className="ko-brand">
                  <Link href="/software" title="Mehr über Kojalytics und die Koja-Apps" className="ko-brand-mark">
                    <Image src="/office/koja-office-icon.png" alt="" width={28} height={28} unoptimized priority />
                    <span>Kojalytics</span>
                  </Link>
                  <span className="ko-hud">Direkt vom Hersteller</span>
                </div>

                <h1 className={`ko-h1 ko-h1--${h1.key}`}>
                  <span className="ko-h1-a ko-rise">{h1.first}</span>
                  <span className="ko-h1-b ko-rise" style={{ ["--i" as string]: 1 }}>
                    {h1.second}
                  </span>
                </h1>

                {/* Only the price rises in. The row itself never gets a transform: a transformed row would hold the
                    absolutely placed box of wide screens while it animates, and the box would jump when it ends. */}
                <div className="ko-product">
                  <div className="ko-product-price ko-rise" style={{ ["--i" as string]: 2 }}>
                    <HeroPrice />
                  </div>
                  <OfficeBox width="clamp(140px, 40vw, 250px)" priority />
                </div>

                <div className="ko-actions">
                  <CodeBar />
                  <BuyButton source="office-hero" from="office" className="ko-btn" />
                  <p className="ko-assure">
                    Einmalzahlung · sicher über Stripe · Lizenzschlüssel sofort per {EMAIL} ·{" "}
                    <span className="whitespace-nowrap">14 Tage Widerrufsrecht</span>
                  </p>
                  <DownloadButton
                    source="office-hero"
                    variant="secondary"
                    label={`${TRIAL_DAYS} Tage kostenlos testen`}
                    shareLabel="Erst testen: Link an meinen Computer schicken"
                    className="ko-btn ko-btn--ghost"
                  />
                </div>

                <a href="#beweis" className="ko-peek">
                  <span className="ko-peek-icons" aria-hidden>
                    {OFFICE.map((o) => (
                      <Image key={o.slug} src={`/apps/${o.slug}/icon.webp`} alt="" width={36} height={36} />
                    ))}
                  </span>
                  <span>
                    <b>Erst ansehen?</b> Koja Office in Aktion.
                  </span>
                  <span className="ko-peek-arrow" aria-hidden>
                    <ArrowDown size={20} strokeWidth={2.2} />
                  </span>
                </a>

                <ul className="ko-tiles">
                  {TILES.map(([a, b]) => (
                    <li key={a}>
                      <Check size={20} strokeWidth={3} aria-hidden />
                      <span>
                        <span>{a}</span> <span>{b}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <Secure />
              </div>
            </section>

            {/* 2 The sum of the calculator ad: five years of subscription against one payment */}
            <section className="ko-stage ko-sum">
              <div className="ko-col">
                <p className="ko-hud">Abo oder einmal zahlen</p>
                <h2 className="ko-h2">Rechne mal nach.</h2>

                <div className="ko-calc">
                  <div className="ko-calc-row ko-calc-row--abo">
                    <div className="ko-calc-head">
                      <p>
                        <strong>
                          Office im Abo<sup>1</sup>
                        </strong>
                        <span>
                          {ABO_YEARS.length} Jahre × {ABO_YEAR} €
                        </span>
                      </p>
                      <p className="ko-calc-sum">{ABO_YEAR * ABO_YEARS.length} €</p>
                    </div>
                    <ol className="ko-years" data-reveal aria-hidden>
                      {ABO_YEARS.map((year) => (
                        <li key={year} style={{ ["--i" as string]: year - 1 }}>
                          <i />
                          <span>Jahr {year}</span>
                          <b>{ABO_YEAR * year} €</b>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="ko-calc-row ko-calc-row--koja">
                    <div className="ko-calc-head">
                      <p>
                        <strong>Koja Office</strong>
                        <span>einmal, ohne Abo</span>
                      </p>
                      <p className="ko-calc-sum">
                        <Price />
                      </p>
                    </div>
                    <OnceBar totalCents={ABO_TOTAL_CENTS} />
                  </div>
                </div>

                <Savings totalCents={ABO_TOTAL_CENTS} />
                <p className="ko-foot">
                  ¹ Microsoft 365 Single, Listenpreis 99{"\u00a0"}€ pro Jahr, Stand November 2026. Funktionsumfang nicht identisch. Microsoft ist eine
                  Marke ihres Inhabers; es besteht keine Verbindung zu Kojalytics.
                </p>
              </div>
            </section>

            {/* 2b And after the one payment: a bill of nothing but zeros */}
            <section className="ko-sec">
              <div className="ko-col">
                <p className="ko-hud">Die Folgekosten</p>
                <h2 className="ko-h2">
                  Und danach? <em>Keine Rechnung mehr.</em>
                </h2>
                <dl className="ko-zeros" data-reveal>
                  {AFTER.map((row) => (
                    <div key={row.label} className="ko-zero">
                      <dt>
                        {row.label}
                        <small>{row.note}</small>
                      </dt>
                      <dd>0,00 €</dd>
                    </div>
                  ))}
                  <div className="ko-zero ko-zero--sum">
                    <dt>Folgekosten gesamt</dt>
                    <dd>0,00 €</dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* 3 The main worry: do my files work? A short film per office app with its steps as text, then the rest of the box */}
            <section id="beweis" className="ko-sec scroll-mt-4">
              <div className="ko-col">
                <p className="ko-hud">Die vier Office-Apps</p>
                <h2 className="ko-h2">
                  So arbeitest du <em>mit Koja Office.</em>
                </h2>
                <p className="ko-lead">Schreiben, rechnen, präsentieren, unterschreiben: die vier Apps in Aktion.</p>

                <div className="ko-apps">
                  {OFFICE.map((o) => {
                    const app = getApp(o.slug);
                    if (!app) return null;
                    return (
                      <article key={o.slug} className="ko-app" data-reveal>
                        <header className="ko-app-head">
                          <AppIcon slug={app.slug} name={app.name} size={56} />
                          <h3 className="ko-h3">{app.name}</h3>
                          <p>{app.kind}</p>
                          <span className="ko-file" style={{ color: appInk(o.color) }}>
                            {o.file}
                          </span>
                        </header>
                        <p className="ko-app-use">{o.use}</p>
                        <p className="ko-app-text">{o.text}</p>
                        <OfficeFilm
                          name={app.name}
                          src={`/office/demo-${o.film}.mp4`}
                          poster={`/office/demo-${o.film}.jpg`}
                          steps={o.steps}
                          restart={FILM_RESTART}
                          ink={appInk(o.color)}
                        />
                      </article>
                    );
                  })}
                </div>

                <p className="ko-note">
                  Bei sehr aufwendigen Dateien können Layout und Umbrüche abweichen. Teste deshalb {TRIAL_DAYS} Tage kostenlos mit Kopien deiner
                  Dateien.
                </p>

                <h3 className="ko-h3 ko-more-title">Plus 9 weitere Apps, ohne Aufpreis</h3>
                <ul className="ko-more">
                  {APPS.filter((a) => !OFFICE_SLUGS.has(a.slug)).map((a) => (
                    <li key={a.slug}>
                      <AppIcon slug={a.slug} name={a.name} size={52} />
                      <b>{a.name}</b>
                      <span>{jointed(a.kind)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 4 The phone problem: buy now, install on the computer later */}
            <section className="ko-sec">
              <div className="ko-col">
                <p className="ko-hud">In drei Schritten</p>
                <h2 className="ko-h2">So kommt Koja Office zu dir</h2>

                <ol className="ko-steps">
                  {STEPS.map((s, i) => (
                    <li key={i} className="ko-step" data-reveal>
                      <div className="ko-step-head">
                        <span className="ko-step-n" aria-hidden>
                          {i + 1}
                        </span>
                        <h3 className="ko-h3">{s.title}</h3>
                      </div>
                      <p className="ko-step-text">{s.text}</p>
                      <div className="ko-well" aria-hidden>
                        {s.ui}
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="ko-later" data-reveal>
                  <svg viewBox="0 0 172 52" width="172" height="52" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" aria-hidden>
                    <rect x="1" y="3" width="27" height="46" />
                    <path d="M11 8.5h7" />
                    <path d="M40 26h20M92 26h8" strokeDasharray="1 6" />
                    <rect x="66" y="19" width="20" height="14" fill="#fff" />
                    <path d="M66.5 19.5l9.5 7.5 9.5-7.5" strokeLinecap="butt" />
                    <path d="M99 19l8 7-8 7" />
                    <rect x="122" y="6" width="44" height="30" />
                    <path d="M114 44h57" />
                    <g fill="#2a66d8" stroke="none">
                      <rect x="136" y="13" width="4" height="4" />
                      <rect x="142" y="13" width="4" height="4" />
                      <rect x="148" y="13" width="4" height="4" />
                      <rect x="136" y="19" width="4" height="4" />
                      <rect x="142" y="19" width="4" height="4" />
                      <rect x="148" y="19" width="4" height="4" />
                      <rect x="136" y="25" width="4" height="4" />
                      <rect x="142" y="25" width="4" height="4" />
                      <rect x="148" y="25" width="4" height="4" />
                    </g>
                  </svg>
                  <p>
                    <b>Gerade nur am Handy?</b> Schick dir den Link und installiere später am Computer.
                  </p>
                  <SendLinkForm source="office-steps" />
                </div>
              </div>
            </section>

            {/* 5 Honest limits, the free trial and the statutory right to withdraw (a plain fact, never a promise or a "guarantee") */}
            <section className="ko-sec">
              <div className="ko-col">
                <p className="ko-hud">Testen und Widerruf</p>
                <h2 className="ko-h2">Was du vorher wissen solltest</h2>

                <div className="ko-honest" data-reveal>
                  <p className="ko-hud">Ehrlich gesagt</p>
                  <p>
                    Koja Office ist <strong>nicht</strong> Microsoft Office. Es sind eigene Apps von Kojalytics, die deine Office-Dateien öffnen.
                    Wir entwickeln sie laufend weiter, Updates bekommst du kostenlos.
                  </p>
                  <p>
                    Wenn deine Firma ausdrücklich Microsoft Office verlangt, bleib bei Microsoft. Für Briefe, Tabellen, Präsentationen und PDFs im
                    Alltag ist Koja Office gemacht.
                  </p>
                </div>

                <div className="ko-copy" data-reveal>
                  <span className="ko-copy-files" aria-hidden>
                    <svg width="58" height="70" viewBox="0 0 40 48">
                      <path d="M1 1h26l12 12v34H1z" fill="#fff" stroke="#c9c9c6" />
                      <path d="M27 1v12h12" fill="#eef2fb" stroke="#c9c9c6" />
                      <rect x="0" y="27" width="34" height="13" fill="#2a66d8" />
                      <text x="17" y="36.5" textAnchor="middle" fontFamily="var(--ko-mono)" fontSize="8.5" fontWeight="700" fill="#fff">
                        DOCX
                      </text>
                    </svg>
                    <svg width="58" height="70" viewBox="0 0 40 48">
                      <path d="M1 1h26l12 12v34H1z" fill="#fff" stroke="#0e0e10" />
                      <path d="M27 1v12h12" fill="#ffd84d" stroke="#0e0e10" />
                      <rect x="0" y="27" width="34" height="13" fill="#0e0e10" />
                      <text x="17" y="36.5" textAnchor="middle" fontFamily="var(--ko-mono)" fontSize="8" fontWeight="700" fill="#ffd84d">
                        KOPIE
                      </text>
                    </svg>
                  </span>
                  <p>
                    <b>Teste mit Kopien deiner Dateien.</b>
                    {TRIAL_DAYS} Tage gratis, ohne Zahlungsdaten.
                  </p>
                </div>

                <div className="ko-fact" data-reveal>
                  <Undo2 size={26} strokeWidth={2.2} aria-hidden />
                  <p>Nach dem Kauf hast du 14 Tage Widerrufsrecht. Online, ohne Begründung.</p>
                  <Link href="/widerrufen" prefetch={false} className="ko-link">
                    Vertrag widerrufen
                    <ArrowRight size={18} aria-hidden />
                  </Link>
                </div>
              </div>
            </section>

            {/* 8 Questions */}
            <section id="fragen" className="ko-sec scroll-mt-4">
              <div className="ko-col">
                <p className="ko-hud">Fragen und Antworten</p>
                <h2 className="ko-h2">Häufige Fragen</h2>
                <div className="ko-faq">
                  <Faq items={FAQ} />
                </div>
              </div>
            </section>

            {/* 9 Once more: the box and the price, then the offer as a receipt with the buy button, and who you buy from */}
            <section className="ko-stage ko-final">
              <div className="ko-col">
                <OfficeBox width="clamp(150px, 44vw, 230px)" />
                <h2 className="ko-h1">
                  <span className="ko-h1-a">Office ohne Abo.</span>
                  <span className="ko-h1-b">
                    Für einmal{" "}
                    <b>
                      <Price />
                    </b>
                    .
                  </span>
                </h2>
                <Receipt source="office-final" />

                <ul className="ko-checks">
                  <li>
                    <KeyRound size={20} strokeWidth={2.2} aria-hidden />
                    <span>Lizenzschlüssel sofort per {EMAIL}</span>
                  </li>
                  <li>
                    <Undo2 size={20} strokeWidth={2.2} aria-hidden />
                    14 Tage Widerrufsrecht
                  </li>
                  <li>
                    <Lock size={20} strokeWidth={2.2} aria-hidden />
                    Sichere Zahlung über Stripe mit PayPal, Karte oder Klarna
                  </li>
                </ul>

                <address className="ko-firm">
                  <p className="ko-firm-claim">
                    <strong>
                      Kein anonymer <span className="whitespace-nowrap">Schlüssel-Shop.</span>
                    </strong>{" "}
                    Koja Office kommt direkt von uns, einem Software-Studio aus Hamburg.
                  </p>
                  <p className="ko-firm-name">
                    <b>Kojalytics</b>
                  </p>
                  <p>Inhaber: Farzad Khojazada</p>
                  <p>
                    Am Diggen 40i, <span className="whitespace-nowrap">21077 Hamburg</span>
                  </p>
                  <a href="tel:+4915201482416" className="ko-tap">
                    <Phone size={20} aria-hidden />
                    <span>+49 1520 1482416</span>
                    <ChevronRight size={20} aria-hidden />
                  </a>
                  <a href="mailto:support@kojalytics.com" className="ko-tap">
                    <Mail size={20} aria-hidden />
                    <span>support@kojalytics.com</span>
                    <ChevronRight size={20} aria-hidden />
                  </a>
                </address>
              </div>
            </section>
          </main>

          <div className="pb-24 lg:pb-0">
            <Footer legalOnly />
          </div>
          <StickyBuyBar source="office-buybar" from="office" />
        </div>
      </Suspense>
    </DiscountProvider>
  );
}
