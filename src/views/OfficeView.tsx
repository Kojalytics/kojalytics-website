import { Suspense, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, ChevronRight, KeyRound, Lock, Mail, Phone, Undo2 } from "lucide-react";
import Footer from "@/components/Footer";
import AppIcon from "@/components/ui/app-icon";
import RevealManager from "@/components/instrument/RevealManager";
import OfficeBox from "@/components/office/OfficeBox";
import OfficeFilm from "@/components/office/OfficeFilm";
import BuyButton from "@/components/software/BuyButton";
import DownloadButton from "@/components/software/DownloadButton";
import WebTestButton from "@/components/software/WebTestButton";
import StickyBuyBar from "@/components/software/StickyBuyBar";
import TrackView from "@/components/software/TrackView";
import DiscountProvider from "@/components/software/DiscountProvider";
import { CodeBar, HeroPrice, OnceBar, Price, Receipt, Savings } from "@/components/software/OfficePrice";
import Faq, { type FaqItem } from "@/components/software/Faq";
import { appInk, appsFor } from "@/lib/apps";
import { TRIAL_DAYS } from "@/lib/pricing";
import { discountForPage } from "@/lib/discount-page";
import { money, type Currency } from "@/lib/currency";
import { visitorCurrency } from "@/lib/currency-server";
import { CurrencyProvider } from "@/lib/use-currency";
import { href, type Lang } from "@/lib/i18n";
import "@/app/office/office.css";

/*
 * Landing page for the Meta ads ("Koja Office 2026"): the dark offer ad, continued. The first screen repeats the ad
 * (headline, box, price, the code already taken off), then dark and white sections alternate. Built for phones (almost
 * all ad traffic) and for an older audience: large type, full-width buttons, one goal, no site navigation. The ad
 * link's ?code= is checked on the server, so the reduced price is there with the first paint. Not in the sitemap and
 * not indexed: /software is the page for search. German at /office, English at /en/office. Styles:
 * src/app/office/office.css (prefix ko-).
 */

/*
 * The four office apps, each with a silent story film (rendered with Remotion, public/office/demo-*.mp4): the everyday
 * steps of a school paper, a household book, a talk and a form. `at` is the second each of the film's captions appears
 * (frame / 30); every film fades back to step 1 at frame 430 before it loops. `color` is the film's accent (the
 * colour of the app icon), used for the file badge and the step numbers so they match the film. Their words: T.apps.
 */
const FILM_RESTART = 430 / 30;
const OFFICE = [
  { slug: "word-koja", file: ".docx", film: "word", color: "#2a66d8", at: [0, 100 / 30, 190 / 30, 290 / 30] },
  { slug: "grid-koja", file: ".xlsx", film: "grid", color: "#12924f", at: [0, 98 / 30, 186 / 30, 306 / 30] },
  { slug: "deck-koja", file: ".pptx", film: "deck", color: "#e2601f", at: [0, 95 / 30, 186 / 30, 300 / 30] },
  { slug: "pdf-koja", file: "PDF", film: "pdf", color: "#d93445", at: [0, 95 / 30, 190 / 30, 290 / 30] },
];
const OFFICE_SLUGS = new Set(OFFICE.map((o) => o.slug));

// The only comparison on the page: Microsoft 365 Single, list price 99 € a year, over five years.
const ABO_YEAR = 99;
const ABO_YEARS = [1, 2, 3, 4, 5];
const ABO_TOTAL_CENTS = ABO_YEAR * ABO_YEARS.length * 100;

// In the narrow cells of the nine other apps a long kind breaks at the joint of the compound ("Bild-bearbeitung").
const jointed = (kind: string) => kind.replace(/^(Bild|Audio|Layout)(?=\p{Ll})/u, "$1­");

// "E-Mail" never breaks at its hyphen.
const EMAIL = <span className="whitespace-nowrap">E-Mail</span>;
const EMAIL_EN = <span className="whitespace-nowrap">email</span>;
const SAMPLE_KEY = "KOJA-7Q2M-XXXX-XXXX";

const de = {
  brand: "Direkt vom Hersteller",
  /** The headline continues the ad the visitor tapped (utm_content of the ad link), see headline(). */
  h1: {
    laptop: {
      first: (
        <>
          Neuer Laptop,
          <br />
          kein Office?
        </>
      ),
      second: "Einmal zahlen. Behalten.",
    },
    rechner: {
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
    },
    vs: { first: "Jedes Jahr zahlen?", second: "Oder einmal." },
    default: { first: "Office ohne Abo.", second: "Einmal zahlen. Behalten." },
  } as Record<string, { first: ReactNode; second: ReactNode }>,
  assure: (
    <>
      Einmalzahlung · sicher über Stripe · Lizenzschlüssel sofort per {EMAIL} ·{" "}
      <span className="whitespace-nowrap">14 Tage Widerrufsrecht</span>
    </>
  ),
  trial: `${TRIAL_DAYS} Tage kostenlos testen`,
  peek: (
    <>
      <b>Erst ansehen?</b> Koja Office in Aktion.
    </>
  ),
  // The four check tiles of the ad. Each is two halves that stay whole, so a narrow tile breaks between them.
  tiles: [
    ["Öffnet Word- &", "Excel-Dateien"],
    ["PDFs bearbeiten", "& unterschreiben"],
    ["Mac & Windows ·", "3 Geräte"],
    ["Offline ·", "ohne Konto"],
  ],
  secure: "Sichere Zahlung mit PayPal, Karte oder Klarna · Kojalytics, Hamburg",

  sumHud: "Abo oder einmal zahlen",
  sumTitle: "Rechne mal nach.",
  abo: (
    <>
      Office im Abo<sup>1</sup>
    </>
  ),
  aboYears: (years: number, price: number) => (
    <>
      {years} Jahre × {price} €
    </>
  ),
  aboSum: (sum: number) => <>{sum} €</>,
  year: (year: number) => <>Jahr {year}</>,
  kojaOnce: "einmal, ohne Abo",
  foot: (
    <>
      ¹ Microsoft 365 Single, Listenpreis 99{" "}€ pro Jahr, Stand November 2026. Funktionsumfang nicht identisch. Microsoft ist eine
      Marke ihres Inhabers; es besteht keine Verbindung zu Kojalytics.
    </>
  ),

  afterHud: "Die Folgekosten",
  afterTitle: (
    <>
      Und danach? <em>Keine Rechnung mehr.</em>
    </>
  ),
  // What comes after the one payment: nothing.
  after: [
    { label: "Abo-Gebühr pro Jahr", note: "Einmalkauf: einmal zahlen, kein Abo." },
    { label: "Updates", note: "Kostenlos über den Kojalytics Launcher." },
    { label: "Zweiter und dritter Computer", note: "Bis zu 3 Geräte, Mac oder Windows-PC." },
  ],
  zero: "0,00 €",
  afterSum: "Folgekosten gesamt",

  appsHud: "Die vier Office-Apps",
  appsTitle: (
    <>
      So arbeitest du <em>mit Koja Office.</em>
    </>
  ),
  appsLead: "Schreiben, rechnen, präsentieren, unterschreiben: die vier Apps in Aktion.",
  apps: {
    "word-koja": {
      use: "Briefe, Lebenslauf, Vereinsordnung",
      text: "Öffnet und bearbeitet deine Word-Dateien, mit Formatvorlagen, Kommentaren und Inhaltsverzeichnis.",
      steps: ["Text schreiben", "Wort markieren", "Kommentar schreiben", "Bild einfügen"],
    },
    "grid-koja": {
      use: "Haushaltsbuch, Abrechnung, Listen",
      text: "Öffnet deine Excel-Tabellen, mit Formeln, Diagrammen und Farbskalen.",
      steps: ["Zahlen eintragen", "Summe rechnen", "Zellen färben", "Diagramm einfügen"],
    },
    "deck-koja": {
      use: "Vorträge für Verein, Familie und Beruf",
      text: "Öffnet deine PowerPoint-Folien zum Bearbeiten und Präsentieren.",
      steps: ["Titel schreiben", "Bild einfügen", "Stichpunkte schreiben", "Präsentieren"],
    },
    "pdf-koja": {
      use: "Formulare, Verträge, Scans",
      text: "PDFs kommentieren, ordnen, zusammenfügen, ausfüllen und unterschreiben.",
      steps: ["PDF öffnen", "Text markieren", "Kommentar schreiben", "Unterschreiben"],
    },
  } as Record<string, { use: string; text: string; steps: string[] }>,
  filesNote: (
    <>
      Bei sehr aufwendigen Dateien können Layout und Umbrüche abweichen. Teste deshalb {TRIAL_DAYS} Tage kostenlos mit Kopien deiner
      Dateien.
    </>
  ),
  moreTitle: "Plus 9 weitere Apps, ohne Aufpreis",

  stepsHud: "In drei Schritten",
  stepsTitle: "So kommt Koja Office zu dir",
  steps: [
    { title: "Jetzt kaufen", text: "Am Handy oder am Computer. Mit PayPal, Karte oder Klarna, sicher über Stripe." },
    { title: <>Lizenz per {EMAIL}</>, text: "Dein Lizenzschlüssel kommt sofort nach dem Kauf." },
    {
      title: "Am Computer installieren",
      text: "Kojalytics Launcher laden, Schlüssel einfügen, Apps installieren. Das dauert ein paar Minuten.",
    },
  ] as { title: ReactNode; text: string }[],
  order: { cap: "Bestellung", kind: "Einmalkauf", total: "Gesamt, einmalig" },
  mail: {
    cap: (
      <>
        {EMAIL} <span>jetzt</span>
      </>
    ),
    subject: "Dein Kojalytics-Lizenzschlüssel",
    sample: "Beispiel",
  },
  launcher: { settings: "Einstellungen › Lizenz", more: "+ 9 weitere" },
  later: (
    <>
      <b>Gerade nur am Handy?</b> Teste die Apps direkt hier im Browser, ohne Konto und ohne Download.
    </>
  ),

  knowHud: "Testen und Widerruf",
  knowTitle: "Was du vorher wissen solltest",
  honestHud: "Ehrlich gesagt",
  honest1: (
    <>
      Koja Office ist <strong>nicht</strong> Microsoft Office. Es sind eigene Apps von Kojalytics, die deine Office-Dateien öffnen.
      Wir entwickeln sie laufend weiter, Updates bekommst du kostenlos.
    </>
  ),
  honest2:
    "Wenn deine Firma ausdrücklich Microsoft Office verlangt, bleib bei Microsoft. Für Briefe, Tabellen, Präsentationen und PDFs im Alltag ist Koja Office gemacht.",
  copyTag: "KOPIE",
  copy: (
    <>
      <b>Teste mit Kopien deiner Dateien.</b>
      {TRIAL_DAYS} Tage gratis, ohne Zahlungsdaten.
    </>
  ),
  withdraw: "Nach dem Kauf hast du 14 Tage Widerrufsrecht. Online, ohne Begründung.",
  withdrawLink: "Vertrag widerrufen",

  faqHud: "Fragen und Antworten",
  faqTitle: "Häufige Fragen",
  faq: [
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
  ] as FaqItem[],

  finalA: "Office ohne Abo.",
  finalB: (
    <>
      Für einmal{" "}
      <b>
        <Price />
      </b>
      .
    </>
  ),
  checkKey: <>Lizenzschlüssel sofort per {EMAIL}</>,
  checkWithdraw: "14 Tage Widerrufsrecht",
  checkPay: "Sichere Zahlung über Stripe mit PayPal, Karte oder Klarna",
  firmClaim: (
    <>
      <strong>
        Kein anonymer <span className="whitespace-nowrap">Schlüssel-Shop.</span>
      </strong>{" "}
      Koja Office kommt direkt von uns, Kojalytics aus Hamburg.
    </>
  ),
  owner: "Inhaber: Farzad Khojazada",
  address: (
    <>
      Am Diggen 40i, <span className="whitespace-nowrap">21077 Hamburg</span>
    </>
  ),
};

const en: typeof de = {
  brand: "Direct from the developer",
  h1: {
    laptop: {
      first: (
        <>
          New laptop,
          <br />
          no Office?
        </>
      ),
      second: "Pay once. Keep using it.",
    },
    rechner: {
      first: "€495 for a subscription?",
      second: (
        <>
          Or pay{" "}
          <b>
            <Price />
          </b>{" "}
          once.
        </>
      ),
    },
    vs: { first: "Pay every year?", second: "Or pay once." },
    default: { first: "Office, no subscription.", second: "Pay once. Keep using it." },
  },
  assure: (
    <>
      One-time payment · secure via Stripe · license key by {EMAIL_EN} right away ·{" "}
      <span className="whitespace-nowrap">14-day right of withdrawal</span>
    </>
  ),
  trial: `Try it free for ${TRIAL_DAYS} days`,
  peek: (
    <>
      <b>Want to see it first?</b> Koja Office in action.
    </>
  ),
  tiles: [
    ["Opens Word &", "Excel files"],
    ["Edit & sign", "PDFs"],
    ["Mac & Windows ·", "3 devices"],
    ["Offline ·", "no account"],
  ],
  secure: "Secure payment with PayPal, card or Klarna · Kojalytics, Hamburg",

  sumHud: "Subscription or pay once",
  sumTitle: "Run the numbers.",
  abo: (
    <>
      Office subscription<sup>1</sup>
    </>
  ),
  aboYears: (years: number, price: number) => (
    <>
      {years} years × €{price}
    </>
  ),
  aboSum: (sum: number) => <>€{sum}</>,
  year: (year: number) => <>Year {year}</>,
  kojaOnce: "once, no subscription",
  foot: (
    <>
      ¹ Microsoft 365 Personal (sold as Microsoft 365 Single in Germany), German list price €99 a year, as of November 2026. Features
      are not identical. Microsoft is a trademark of its owner; Kojalytics has no connection to it.
    </>
  ),

  afterHud: "Ongoing costs",
  afterTitle: (
    <>
      And after that? <em>No more bills.</em>
    </>
  ),
  after: [
    { label: "Subscription fee per year", note: "One-time purchase: pay once, no subscription." },
    { label: "Updates", note: "Free via the Kojalytics Launcher." },
    { label: "Second and third computer", note: "Up to 3 devices, Mac or Windows PC." },
  ],
  zero: "€0.00",
  afterSum: "Total ongoing costs",

  appsHud: "The four office apps",
  appsTitle: (
    <>
      How you work <em>with Koja Office.</em>
    </>
  ),
  appsLead: "Write, calculate, present, sign: the four apps in action.",
  apps: {
    "word-koja": {
      use: "Letters, CVs, club rules",
      text: "Opens and edits your Word files, with styles, comments and a table of contents.",
      steps: ["Write text", "Select a word", "Write a comment", "Insert a picture"],
    },
    "grid-koja": {
      use: "Household budget, bills, lists",
      text: "Opens your Excel spreadsheets, with formulas, charts and colour scales.",
      steps: ["Enter numbers", "Add up a total", "Colour cells", "Insert a chart"],
    },
    "deck-koja": {
      use: "Talks for clubs, family and work",
      text: "Opens your PowerPoint slides for editing and presenting.",
      steps: ["Write a title", "Insert a picture", "Write bullet points", "Present"],
    },
    "pdf-koja": {
      use: "Forms, contracts, scans",
      text: "Comment on, rearrange, merge, fill in and sign PDFs.",
      steps: ["Open a PDF", "Highlight text", "Write a comment", "Sign"],
    },
  },
  filesNote: (
    <>
      With very complex files, the layout and line breaks may differ. So try it free for {TRIAL_DAYS} days with copies of your files.
    </>
  ),
  moreTitle: "Plus 9 more apps at no extra cost",

  stepsHud: "In three steps",
  stepsTitle: "How Koja Office gets to you",
  steps: [
    { title: "Buy now", text: "On your phone or your computer. With PayPal, card or Klarna, securely via Stripe." },
    { title: <>License by {EMAIL_EN}</>, text: "Your license key arrives right after you buy." },
    {
      title: "Install on your computer",
      text: "Download the Kojalytics Launcher, paste in the key, install the apps. It takes a few minutes.",
    },
  ],
  order: { cap: "Order", kind: "One-time purchase", total: "Total, one-time" },
  mail: {
    cap: (
      <>
        <span className="whitespace-nowrap">Email</span> <span>now</span>
      </>
    ),
    subject: "Your Kojalytics license key",
    sample: "Example",
  },
  launcher: { settings: "Settings › License", more: "+ 9 more" },
  later: (
    <>
      <b>Only on your phone right now?</b> Try the apps right here in your browser, with no account and no download.
    </>
  ),

  knowHud: "Trial and withdrawal",
  knowTitle: "What you should know first",
  honestHud: "To be honest",
  honest1: (
    <>
      Koja Office is <strong>not</strong> Microsoft Office. It is a set of apps made by Kojalytics that open your Office files. We keep
      developing them, and updates are free.
    </>
  ),
  honest2:
    "If your company specifically requires Microsoft Office, stay with Microsoft. Koja Office is made for everyday letters, spreadsheets, presentations and PDFs.",
  copyTag: "COPY",
  copy: (
    <>
      <b>Test with copies of your files.</b>
      {TRIAL_DAYS} days free, no payment details needed.
    </>
  ),
  withdraw: "After you buy, you have a 14-day right of withdrawal. Online, no reason needed.",
  withdrawLink: "Withdraw from a contract",

  faqHud: "Questions and answers",
  faqTitle: "Common questions",
  faq: [
    {
      q: "Is this Microsoft Office?",
      a: "No. Koja Office is a set of apps made by Kojalytics. They open your Word, Excel, PowerPoint and PDF files, but they are not a Microsoft product.",
    },
    {
      q: "Will my Word and Excel files work?",
      a: `You open .docx, .xlsx, .pptx and PDF files directly. With very complex files, the layout and line breaks may differ. So try it free for ${TRIAL_DAYS} days with copies of your files.`,
    },
    {
      q: "I'm on my phone right now. Can I still buy?",
      a: "Yes. You buy here, and the license key arrives by email right away. On your computer, you then download the Kojalytics Launcher from kojalytics.com and paste in the key. Or just send yourself the link first and decide later.",
    },
    {
      q: "What if it's not right for me?",
      a: `You have a 14-day right of withdrawal and get your money back, no reason needed. You can do it online under [Withdraw from a contract](${href("en", "/widerrufen")}).`,
    },
    { q: "How many devices can I use it on?", a: "On up to 3 devices, Mac or Windows PC." },
    {
      q: "Is this a subscription?",
      a: "No. You pay once and use Koja Office with no expiry date. Updates are free via the Kojalytics Launcher.",
    },
  ],

  finalA: "Office, no subscription.",
  finalB: (
    <>
      Pay{" "}
      <b>
        <Price />
      </b>{" "}
      once.
    </>
  ),
  checkKey: <>License key by {EMAIL_EN} right away</>,
  checkWithdraw: "14-day right of withdrawal",
  checkPay: "Secure payment via Stripe with PayPal, card or Klarna",
  firmClaim: (
    <>
      <strong>
        Not an anonymous <span className="whitespace-nowrap">key shop.</span>
      </strong>{" "}
      Koja Office comes directly from us: Kojalytics, based in Hamburg, Germany.
    </>
  ),
  owner: "Owner: Farzad Khojazada",
  address: (
    <>
      Am Diggen 40i, <span className="whitespace-nowrap">21077 Hamburg, Germany</span>
    </>
  ),
};

const T = { de, en };

/** The headline continues the ad the visitor tapped (utm_content of the ad link). */
function headline(content: string, lang: Lang, cur: Currency): { key: string; first: ReactNode; second: ReactNode } {
  const ad = content.toLowerCase();
  // The calculator headline quotes euro prices: other currencies get the default one.
  const key = ad.includes("laptop") ? "laptop" : ad.includes("rechner") && cur === "EUR" ? "rechner" : ad.includes("vs") ? "vs" : "default";
  return { key, ...T[lang].h1[key] };
}

function Secure({ lang }: { lang: Lang }) {
  return (
    <p className="ko-secure">
      <Lock size={17} strokeWidth={2.2} aria-hidden />
      {T[lang].secure}
    </p>
  );
}

/* The three small pictures of "So kommt Koja Office zu dir": flat paper slips drawn in HTML, decoration only. Nothing
   in them looks like a control: no button shapes, no fields to tap. */
function OrderCard({ lang }: { lang: Lang }) {
  const t = T[lang].order;
  return (
    <div className="ko-ui">
      <p className="ko-ui-cap">{t.cap}</p>
      <div className="ko-ui-row">
        <Image src="/office/koja-office-icon.png" alt="" width={34} height={34} unoptimized />
        <span>
          <b>Koja Office 2026</b>
          <small>{t.kind}</small>
        </span>
        <span className="ko-ui-amount">
          <Price />
        </span>
      </div>
      <p className="ko-ui-line">
        <span>{t.total}</span>
        <span>
          <Price />
        </span>
      </p>
    </div>
  );
}

function MailCard({ lang }: { lang: Lang }) {
  const t = T[lang].mail;
  return (
    <div className="ko-ui">
      <p className="ko-ui-cap">{t.cap}</p>
      <div className="ko-ui-row">
        <span className="ko-k">K</span>
        <span>
          <b>Kojalytics</b>
          <small>{t.subject}</small>
        </span>
      </div>
      <p className="ko-ui-key">
        <code>{SAMPLE_KEY}</code>
        <span>{t.sample}</span>
      </p>
    </div>
  );
}

function LauncherCard({ lang }: { lang: Lang }) {
  const t = T[lang].launcher;
  return (
    <div className="ko-ui">
      <p className="ko-ui-cap">Kojalytics Launcher</p>
      <p className="ko-ui-label">{t.settings}</p>
      <p className="ko-ui-key">
        <code>{SAMPLE_KEY}</code>
        <Check size={16} strokeWidth={3} />
      </p>
      <div className="ko-ui-icons">
        {OFFICE.map((o) => (
          <Image key={o.slug} src={`/apps/${o.slug}/icon.webp`} alt="" width={34} height={34} className="rounded-[22%]" />
        ))}
        <span>{t.more}</span>
      </div>
    </div>
  );
}

const STEP_UI = [OrderCard, MailCard, LauncherCard];

export default async function OfficeView({
  lang,
  searchParams,
}: {
  lang: Lang;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t = T[lang];
  // Prices in the visitor's currency (from their country), here and in Checkout.
  const cur = await visitorCurrency();
  const apps = appsFor(lang, cur);
  const params = await searchParams;
  const found = await discountForPage(params.code ?? params.rabatt, cur);
  const discount = found?.prices.lifetime !== undefined ? found : null;
  const ad = params.utm_content;
  const h1 = headline((Array.isArray(ad) ? ad[0] : ad) ?? "", lang, cur);
  const zero = cur === "EUR" ? t.zero : money(0, cur, lang, true);

  return (
    <CurrencyProvider currency={cur}>
    <DiscountProvider initial={discount}>
      <TrackView name={lang === "de" ? "office" : "office-en"} />
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
                  <Link href={href(lang, "/")} title="Koja Office" className="ko-brand-mark">
                    <Image src="/office/koja-office-icon.png" alt="" width={28} height={28} unoptimized priority />
                    <span>Kojalytics</span>
                  </Link>
                  <span className="ko-hud">{t.brand}</span>
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
                  <p className="ko-assure">{t.assure}</p>
                  <WebTestButton className="mb-3 w-full" />
                  <DownloadButton source="office-hero" variant="secondary" label={t.trial} mobile="none" className="ko-btn ko-btn--ghost" />
                </div>

                <a href="#beweis" className="ko-peek">
                  <span className="ko-peek-icons" aria-hidden>
                    {OFFICE.map((o) => (
                      <Image key={o.slug} src={`/apps/${o.slug}/icon.webp`} alt="" width={36} height={36} />
                    ))}
                  </span>
                  <span>{t.peek}</span>
                  <span className="ko-peek-arrow" aria-hidden>
                    <ArrowDown size={20} strokeWidth={2.2} />
                  </span>
                </a>

                <ul className="ko-tiles">
                  {t.tiles.map(([a, b]) => (
                    <li key={a}>
                      <Check size={20} strokeWidth={3} aria-hidden />
                      <span>
                        <span>{a}</span> <span>{b}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <Secure lang={lang} />
              </div>
            </section>

            {/* 2 The sum of the calculator ad: five years of subscription against one payment (German euro list price of
                Microsoft 365, so only for visitors who pay in euros) */}
            {cur === "EUR" && (
            <section className="ko-stage ko-sum">
              <div className="ko-col">
                <p className="ko-hud">{t.sumHud}</p>
                <h2 className="ko-h2">{t.sumTitle}</h2>

                <div className="ko-calc">
                  <div className="ko-calc-row ko-calc-row--abo">
                    <div className="ko-calc-head">
                      <p>
                        <strong>{t.abo}</strong>
                        <span>{t.aboYears(ABO_YEARS.length, ABO_YEAR)}</span>
                      </p>
                      <p className="ko-calc-sum">{t.aboSum(ABO_YEAR * ABO_YEARS.length)}</p>
                    </div>
                    <ol className="ko-years" data-reveal aria-hidden>
                      {ABO_YEARS.map((year) => (
                        <li key={year} style={{ ["--i" as string]: year - 1 }}>
                          <i />
                          <span>{t.year(year)}</span>
                          <b>{t.aboSum(ABO_YEAR * year)}</b>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="ko-calc-row ko-calc-row--koja">
                    <div className="ko-calc-head">
                      <p>
                        <strong>Koja Office</strong>
                        <span>{t.kojaOnce}</span>
                      </p>
                      <p className="ko-calc-sum">
                        <Price />
                      </p>
                    </div>
                    <OnceBar totalCents={ABO_TOTAL_CENTS} />
                  </div>
                </div>

                <Savings totalCents={ABO_TOTAL_CENTS} />
                <p className="ko-foot">{t.foot}</p>
              </div>
            </section>
            )}

            {/* 2b And after the one payment: a bill of nothing but zeros */}
            <section className="ko-sec">
              <div className="ko-col">
                <p className="ko-hud">{t.afterHud}</p>
                <h2 className="ko-h2">{t.afterTitle}</h2>
                <dl className="ko-zeros" data-reveal>
                  {t.after.map((row) => (
                    <div key={row.label} className="ko-zero">
                      <dt>
                        {row.label}
                        <small>{row.note}</small>
                      </dt>
                      <dd>{zero}</dd>
                    </div>
                  ))}
                  <div className="ko-zero ko-zero--sum">
                    <dt>{t.afterSum}</dt>
                    <dd>{zero}</dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* 3 The main worry: do my files work? A short film per office app with its steps as text, then the rest of the box */}
            <section id="beweis" className="ko-sec scroll-mt-4">
              <div className="ko-col">
                <p className="ko-hud">{t.appsHud}</p>
                <h2 className="ko-h2">{t.appsTitle}</h2>
                <p className="ko-lead">{t.appsLead}</p>

                <div className="ko-apps">
                  {OFFICE.map((o) => {
                    const app = apps.find((a) => a.slug === o.slug);
                    if (!app) return null;
                    const words = t.apps[o.slug];
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
                        <p className="ko-app-use">{words.use}</p>
                        <p className="ko-app-text">{words.text}</p>
                        <OfficeFilm
                          name={app.name}
                          src={`/office/demo-${o.film}.mp4`}
                          poster={`/office/demo-${o.film}.jpg`}
                          steps={words.steps.map((text, i) => ({ at: o.at[i], text }))}
                          restart={FILM_RESTART}
                          ink={appInk(o.color)}
                        />
                      </article>
                    );
                  })}
                </div>

                <p className="ko-note">{t.filesNote}</p>

                <h3 className="ko-h3 ko-more-title">{t.moreTitle}</h3>
                <ul className="ko-more">
                  {apps
                    .filter((a) => !OFFICE_SLUGS.has(a.slug))
                    .map((a) => (
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
                <p className="ko-hud">{t.stepsHud}</p>
                <h2 className="ko-h2">{t.stepsTitle}</h2>

                <ol className="ko-steps">
                  {t.steps.map((s, i) => {
                    const Ui = STEP_UI[i];
                    return (
                      <li key={i} className="ko-step" data-reveal>
                        <div className="ko-step-head">
                          <span className="ko-step-n" aria-hidden>
                            {i + 1}
                          </span>
                          <h3 className="ko-h3">{s.title}</h3>
                        </div>
                        <p className="ko-step-text">{s.text}</p>
                        <div className="ko-well" aria-hidden>
                          <Ui lang={lang} />
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <div className="ko-later" data-reveal>
                  <p>{t.later}</p>
                  <WebTestButton className="mt-[18px] w-full" />
                </div>
              </div>
            </section>

            {/* 5 Honest limits, the free trial and the statutory right to withdraw (a plain fact, never a promise or a "guarantee") */}
            <section className="ko-sec">
              <div className="ko-col">
                <p className="ko-hud">{t.knowHud}</p>
                <h2 className="ko-h2">{t.knowTitle}</h2>

                <div className="ko-honest" data-reveal>
                  <p className="ko-hud">{t.honestHud}</p>
                  <p>{t.honest1}</p>
                  <p>{t.honest2}</p>
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
                        {t.copyTag}
                      </text>
                    </svg>
                  </span>
                  <p>{t.copy}</p>
                </div>

                <div className="ko-fact" data-reveal>
                  <Undo2 size={26} strokeWidth={2.2} aria-hidden />
                  <p>{t.withdraw}</p>
                  <Link href={href(lang, "/widerrufen")} prefetch={false} className="ko-link">
                    {t.withdrawLink}
                    <ArrowRight size={18} aria-hidden />
                  </Link>
                </div>
              </div>
            </section>

            {/* 8 Questions */}
            <section id="fragen" className="ko-sec scroll-mt-4">
              <div className="ko-col">
                <p className="ko-hud">{t.faqHud}</p>
                <h2 className="ko-h2">{t.faqTitle}</h2>
                <div className="ko-faq">
                  <Faq items={t.faq} />
                </div>
              </div>
            </section>

            {/* 9 Once more: the box and the price, then the offer as a receipt with the buy button, and who you buy from */}
            <section className="ko-stage ko-final">
              <div className="ko-col">
                <OfficeBox width="clamp(150px, 44vw, 230px)" />
                <h2 className="ko-h1">
                  <span className="ko-h1-a">{t.finalA}</span>
                  <span className="ko-h1-b">{t.finalB}</span>
                </h2>
                <Receipt source="office-final" />

                <ul className="ko-checks">
                  <li>
                    <KeyRound size={20} strokeWidth={2.2} aria-hidden />
                    <span>{t.checkKey}</span>
                  </li>
                  <li>
                    <Undo2 size={20} strokeWidth={2.2} aria-hidden />
                    {t.checkWithdraw}
                  </li>
                  <li>
                    <Lock size={20} strokeWidth={2.2} aria-hidden />
                    {t.checkPay}
                  </li>
                </ul>

                <address className="ko-firm">
                  <p className="ko-firm-claim">{t.firmClaim}</p>
                  <p className="ko-firm-name">
                    <b>Kojalytics</b>
                  </p>
                  <p>{t.owner}</p>
                  <p>{t.address}</p>
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
            <Footer legalOnly lang={lang} />
          </div>
          <StickyBuyBar source="office-buybar" from="office" />
        </div>
      </Suspense>
    </DiscountProvider>
    </CurrencyProvider>
  );
}
