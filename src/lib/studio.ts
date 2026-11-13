// Leistungen und Projekte des Studios: eine Quelle für Startseite, /leistungen, /lizenzen und /projekte.

import { FileSpreadsheet, HardDrive, MonitorCog, Palette } from "lucide-react";

export type Service = { slug: string; title: string; summary: string; details: string[]; stack: string[] };

export const SERVICES: Service[] = [
  {
    slug: "ios-apps",
    title: "iOS-Apps",
    summary: "Native Apps für iPhone und iPad in SwiftUI, vom ersten Prototyp bis zur Veröffentlichung im App Store.",
    details: ["Produktdesign und klickbarer Prototyp", "SwiftUI-App mit Offline-Funktionen", "In-App-Käufe und Abos", "Einreichung im App Store und Updates"],
    stack: ["SwiftUI", "StoreKit", "Supabase"],
  },
  {
    slug: "web",
    title: "Web-Apps und Websites",
    summary: "Schnelle Web-Plattformen und Landingpages in Next.js, gebaut für gute Google-Rankings und Conversions.",
    details: ["Next.js und React", "Zahlungen mit Stripe", "SEO und Core Web Vitals", "Hosting bei Vercel"],
    stack: ["Next.js", "TypeScript", "Stripe", "Vercel"],
  },
  {
    slug: "ki",
    title: "KI-Integration",
    summary: "KI-Funktionen in deinem Produkt: Bild- und Texterzeugung, Suche und Automatisierung, die echte Arbeit sparen.",
    details: ["Bild- und Textgenerierung", "Dokumentensuche und Assistenten", "Automatisierte Abläufe", "Kosten und Datenschutz im Griff"],
    stack: ["Gemini", "Claude", "OpenAI", "Supabase"],
  },
  {
    slug: "design",
    title: "Design",
    summary: "Oberflächen und Marken, die Menschen ohne Anleitung verstehen.",
    details: ["UX-Abläufe und Wireframes", "UI-Design und Design-Systeme", "Marke und App-Icons", "Nutzertests"],
    stack: ["Figma", "Design-Tokens"],
  },
  {
    slug: "backend",
    title: "Backend und Cloud",
    summary: "APIs, Datenbanken und Infrastruktur, die echte Kunden und Zahlungen tragen.",
    details: ["APIs und Webhooks", "Postgres-Datenbanken mit Supabase", "Login, Rollen und Lizenzierung", "Monitoring und Backups"],
    stack: ["Supabase", "Postgres", "Node.js", "Vercel"],
  },
];

/**
 * A project we built, shown as text only: no pictures and no links to the project itself (the owner shows what we
 * did, not the products). `status` says honestly how far it got. Only our own Koja-Apps link to their shop page.
 */
export type Project = {
  slug: string;
  title: string;
  kind: string;
  summary: string;
  lead: string;
  built: string[];
  tags: string[];
  status: string;
  /** Heading above `built`, for projects that are still a plan. */
  builtTitle?: string;
  productHref?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "koja-apps",
    title: "Koja-Apps",
    kind: "Eigene Software · Mac und Windows",
    summary: "13 Programme für Office, PDF, Bild, Video und mehr, mit eigenem Launcher, Lizenzsystem und Abo.",
    lead: "Unsere eigene Software: 13 Desktop-Apps für Mac und Windows, die offline laufen und kein Konto brauchen. Wir liefern sie mit einem eigenen Launcher, einem Lizenzsystem und Abos aus, die sich jederzeit online kündigen lassen.",
    built: [
      "13 Apps für Office, PDF, Bild, Video, Audio, Layout und CAD",
      "Kojalytics Launcher für Mac und Windows, der die Apps installiert und aktuell hält",
      "Lizenzschlüssel, Geräte-Aktivierung und kostenloser Test",
      "Bezahlung mit Stripe, Abo jederzeit online kündbar",
      "Website mit eigener Seite für jede App und einem Ratgeber",
    ],
    tags: ["macOS", "Windows", "Stripe", "Supabase"],
    status: "Live",
    productHref: "/software",
  },
  {
    slug: "websites",
    title: "Websites",
    kind: "Websites und Landingpages",
    summary: "Schnelle Websites und Landingpages, gebaut für gute Google-Rankings und mehr Anfragen.",
    lead: "Wir bauen Websites und Landingpages mit Next.js: schnell geladen, für Suchmaschinen aufbereitet und darauf ausgelegt, dass Besucher anfragen oder kaufen.",
    built: [
      "Websites und Landingpages mit Next.js und React",
      "SEO mit strukturierten Daten, Sitemaps und schnellen Ladezeiten",
      "Kauf, Lizenzen und Zahlungen mit Stripe",
      "Mehrsprachige Seiten",
      "Hosting bei Vercel",
    ],
    tags: ["Next.js", "SEO", "Vercel"],
    status: "Umgesetzt",
  },
  {
    slug: "online-shops",
    title: "Online-Shops",
    kind: "E-Commerce mit Shopify",
    summary: "Online-Shops mit Shopify: Einrichtung, Design, Produkte, Zahlung und Werbung.",
    lead: "Wir richten Online-Shops mit Shopify ein und bringen sie zum Verkaufen: vom Theme über die Produktseiten bis zur Anbindung von Werbekanälen und Marktplätzen.",
    built: [
      "Shop-Einrichtung und Anpassung des Themes",
      "Produktseiten und Kollektionen",
      "Zahlung und Versand",
      "Werbe-Pixel und Marktplatz-Anbindung",
    ],
    tags: ["Shopify", "E-Commerce"],
    status: "Umgesetzt",
  },
  {
    slug: "ai-headshot",
    title: "AI Headshot",
    kind: "iOS-App und Web-App",
    summary: "Professionelle Porträts aus ein paar Selfies, mit KI-Bilderzeugung und Bezahlung per Stripe.",
    lead: "AI Headshot macht aus ein paar Selfies professionelle Porträts für LinkedIn, Lebenslauf und Firmenwebsite, ohne Fotograf und ohne Termin. Wir haben die iOS-App, die Web-App und das Backend dahinter entworfen und entwickelt.",
    built: [
      "SwiftUI-App für das iPhone und eine Next.js-Web-App mit gemeinsamem Backend",
      "Selfie-Upload am Computer, per Webcam oder vom Handy per QR-Code",
      "Qualitätsprüfung der Selfies vor der Erzeugung",
      "KI-Porträts in mehreren professionellen Stilen",
      "Stripe-Checkout mit zwei Einmal-Paketen",
      "Landingpages in 8 Sprachen",
    ],
    tags: ["SwiftUI", "Next.js", "Supabase", "Gemini", "Stripe"],
    status: "Live",
  },
  {
    slug: "koja-ai",
    title: "Koja-AI",
    kind: "iOS-App mit KI-Tastatur",
    summary: "Eine iPhone-Tastatur mit KI: Antwortvorschläge, Textkorrektur, Chat und Übersetzung beim Schreiben.",
    lead: "Koja-AI bringt KI in jede App auf dem iPhone, über eine eigene Tastatur. Die KI-Anfragen laufen über unseren eigenen Server, damit kein Schlüssel in der App steckt.",
    built: [
      "Tastatur mit Antwortvorschlägen, Textkorrektur und Chat",
      "Übersetzung beim Schreiben und Wörterbücher für 5 Sprachen",
      "Zwischenablage-Verlauf, Textbausteine, Zierschriften und Emoji",
      "Rechner, Wetter und Termine direkt aus der Tastatur",
      "Diktat und KI-Bilderzeugung in der App",
      "Eigener Server für die KI-Anfragen",
    ],
    tags: ["SwiftUI", "KeyboardKit", "Gemini", "Supabase"],
    status: "In Entwicklung",
  },
  {
    slug: "copy-paste-pro",
    title: "Copy Paste Pro",
    kind: "iOS-App mit Tastatur",
    summary: "Zwischenablage-Verlauf und Tastatur in einem. Alles bleibt auf dem Gerät.",
    lead: "Copy Paste Pro merkt sich alles, was du kopierst, und fügt es über die eigene Tastatur in jede App ein. Verlauf, Übersetzung und Korrektur laufen direkt auf dem iPhone.",
    built: [
      "Verlauf für Texte, Links und Bilder, mit Anpinnen und Suche",
      "Eigene Tastatur zum schnellen Einfügen",
      "Offline-Übersetzung in 15 Sprachen",
      "Lernende Autovervollständigung und Grammatikkorrektur",
      "Termine direkt einfügen",
      "In-App-Käufe mit StoreKit 2",
    ],
    tags: ["SwiftUI", "Tastatur-Erweiterung", "StoreKit"],
    status: "Bei Apple eingereicht",
  },
  {
    slug: "ai-jobwriter",
    title: "AI JobWriter",
    kind: "iOS-App · Bewerbungen",
    summary: "Lebenslauf und Anschreiben mit KI, passend zur Stellenanzeige.",
    lead: "AI JobWriter erstellt mit KI einen Lebenslauf und ein Anschreiben, die zur Stellenanzeige passen. Vorhandene Unterlagen lassen sich per Kamera, PDF oder Word übernehmen.",
    built: [
      "6 Lebenslauf-Vorlagen",
      "KI-Anschreiben passend zur Stellenanzeige",
      "KI-Bewerbungsfoto",
      "Import per Kamera-Scan, PDF oder Word",
      "Export als PDF",
      "In-App-Käufe mit StoreKit 2",
    ],
    tags: ["SwiftUI", "Supabase", "Claude", "Gemini"],
    status: "Prototyp",
  },
  {
    slug: "wohnungssuche-pro",
    title: "Wohnungssuche Pro",
    kind: "App · Wohnungssuche",
    summary: "Sammelt neue Mietwohnungen aus vielen Quellen und meldet passende Treffer sofort per Push.",
    lead: "Wohnungssuche Pro durchsucht laufend Wohnungsportale und Vermieter in Deutschland, prüft die Anzeigen mit KI und meldet passende Wohnungen sofort aufs Handy.",
    built: [
      "Neue Angebote aus Dutzenden Quellen an einem Ort",
      "KI-Prüfung der Anzeigen",
      "KI-Anschreiben in 5 Tonarten",
      "Bewerbermappe mit sicherem Link",
      "Merkliste, Karte und Besichtigungstermine",
      "Push-Benachrichtigungen",
    ],
    tags: ["React Native", "Python", "Supabase", "Claude"],
    status: "In Entwicklung",
  },
  {
    slug: "ki-bildstudio",
    title: "KI-Bildstudio",
    kind: "iOS-App · KI-Bilder",
    summary: "Bilder per Text erzeugen und bearbeiten, mit den Bildmodellen von Google Gemini.",
    lead: "Mit dem KI-Bildstudio entstehen Bilder aus einer Beschreibung, und vorhandene Bilder lassen sich per Text oder im Chat bearbeiten.",
    built: [
      "Bilder aus Text erzeugen",
      "Bilder per Text bearbeiten, auch im Chat",
      "Bis zu 14 Referenzbilder",
      "Zwei Modelle, Ausgabe bis 4K",
      "Bezahlung über Token-Pakete",
    ],
    tags: ["SwiftUI", "Supabase", "Gemini"],
    status: "Vor der Veröffentlichung",
  },
  {
    slug: "hvv-live",
    title: "HVV Live",
    kind: "iOS-App · Nahverkehr Hamburg",
    summary: "Zeigt live auf der Karte, wo Bus und Bahn in Hamburg gerade sind.",
    lead: "HVV Live zeigt Busse und Bahnen in Hamburg live auf der Karte, dazu Abfahrten, Routen und Störungen. Ein eigener Prototyp, kein offizielles Angebot des HVV.",
    built: [
      "Live-Karte der Fahrzeuge, alle 5 Sekunden aktualisiert",
      "Abfahrten an jeder Haltestelle",
      "Routensuche",
      "Störungsmeldungen",
      "Anbindung an die Fahrplan-Schnittstelle des HVV",
      "Backend mit Supabase und regelmäßigen Abrufen",
    ],
    tags: ["SwiftUI", "MapKit", "Supabase"],
    status: "Prototyp",
  },
  {
    slug: "ebay-shopify",
    title: "eBay-Anbindung für Shopify",
    kind: "Shopify-App",
    summary: "Listet Shopify-Produkte auf eBay und holt Verkäufe als Bestellungen zurück in den Shop.",
    lead: "Eine Shopify-App für Händler, die auch auf eBay verkaufen: Produkte, Bestände und Bestellungen bleiben zwischen beiden Kanälen gleich.",
    built: [
      "Produkt-Sync mit Varianten und Preisaufschlag",
      "eBay-Verkäufe als Shopify-Bestellungen",
      "Sendungsnummern zurück an eBay",
      "Bestandsabgleich in beide Richtungen",
      "Kategorie-Zuordnung",
    ],
    tags: ["Shopify", "Remix", "Polaris"],
    status: "Prototyp",
  },
  {
    slug: "postflow-ai",
    title: "Postflow AI",
    kind: "Web-App · Social Media",
    summary: "Macht aus Shopify-Produkten automatisch Social-Media-Beiträge und plant sie ein.",
    lead: "Postflow AI nimmt die Produkte eines Shopify-Shops und erstellt daraus mit KI Beiträge, Bilder und Reels für die sozialen Netzwerke, fertig eingeplant.",
    built: [
      "Anbindung an Shopify-Produkte",
      "KI-Texte und -Bilder aus den Produktdaten",
      "Reels aus Produktbildern",
      "Planung für Instagram, TikTok, Facebook, Pinterest und X",
    ],
    tags: ["Next.js", "Supabase", "Claude", "Gemini"],
    status: "Prototyp",
  },
  {
    slug: "ki-organizer",
    title: "KI-Organizer",
    kind: "Web-App · Planung",
    summary: "Ein persönlicher Planer, in dem die KI Aufgaben und Ziele priorisiert.",
    lead: "Der KI-Organizer soll Aufgaben, Termine und Ziele an einem Ort sammeln und mit KI sagen, was als Nächstes wichtig ist.",
    built: ["Aufgaben und Ziele an einem Ort", "Priorisierung durch KI", "Geplant als Web-App"],
    builtTitle: "Was geplant ist",
    tags: ["Web-App", "KI"],
    status: "Konzept",
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}

/** What we license (/lizenzen and the home page). */
export const LICENSE_CATEGORIES = [
  { icon: FileSpreadsheet, title: "Office & Produktivität", description: "Textverarbeitung, Tabellen, Präsentationen und E-Mail für Einzelne und ganze Teams." },
  { icon: MonitorCog, title: "Betriebssysteme", description: "Desktop-Betriebssysteme für neue Rechner, Upgrades und ganze Arbeitsplatz-Flotten." },
  { icon: HardDrive, title: "Server & Infrastruktur", description: "Server-Software und Zugriffslizenzen für Büros, Praxen und wachsende Unternehmen." },
  { icon: Palette, title: "Kreativ- & Spezialsoftware", description: "Design, Video, Projektplanung und Diagramme für Spezialisten." },
];
