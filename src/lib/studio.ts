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

export type Project = {
  slug: string;
  title: string;
  kind: string;
  summary: string;
  image: { src: string; width: number; height: number; alt: string };
  href: string;
  tags: string[];
};

export const PROJECTS: Project[] = [
  {
    slug: "koja-apps",
    title: "Koja-Apps",
    kind: "Eigenes Produkt",
    summary: "13 Kreativ- und Büro-Apps für Mac und Windows, ausgeliefert mit Launcher, Lizenzsystem und Abos, die sich jederzeit online kündigen lassen.",
    image: { src: "/apps/photo-koja/hero.webp", width: 1600, height: 1000, alt: "PhotoKoja mit Ebenen und Werkzeugen auf dem Mac" },
    href: "/software",
    tags: ["macOS", "Windows", "Lizenzierung", "Stripe"],
  },
  {
    slug: "ai-headshot",
    title: "AI Headshot",
    kind: "iOS-App und Web-App",
    summary: "Professionelle Porträts aus ein paar Selfies. iOS-App und Web-App mit Zahlungen, Upload vom Handy und KI-Bilderzeugung.",
    image: { src: "/aiheadshot/comparisons/after-1.webp", width: 500, height: 600, alt: "Von KI erzeugtes professionelles Business-Porträt" },
    href: "/projekte/ai-headshot",
    tags: ["SwiftUI", "Next.js", "Supabase", "Gemini", "Stripe"],
  },
  {
    slug: "etsy-sync",
    title: "Etsy Sync",
    kind: "Shopify-App",
    summary: "Auf Etsy verkaufen und alles in Shopify verwalten. Produkte werden mit einem Klick synchronisiert, Bestellungen kommen automatisch zurück.",
    image: { src: "/projects/etsy-sync.webp", width: 1600, height: 860, alt: "Die Website von Etsy Sync" },
    href: "/etsy-sync",
    tags: ["Shopify", "Etsy-API", "Node.js"],
  },
];

/** What we license (/lizenzen and the home page). */
export const LICENSE_CATEGORIES = [
  { icon: FileSpreadsheet, title: "Office & Produktivität", description: "Textverarbeitung, Tabellen, Präsentationen und E-Mail für Einzelne und ganze Teams." },
  { icon: MonitorCog, title: "Betriebssysteme", description: "Desktop-Betriebssysteme für neue Rechner, Upgrades und ganze Arbeitsplatz-Flotten." },
  { icon: HardDrive, title: "Server & Infrastruktur", description: "Server-Software und Zugriffslizenzen für Büros, Praxen und wachsende Unternehmen." },
  { icon: Palette, title: "Kreativ- & Spezialsoftware", description: "Design, Video, Projektplanung und Diagramme für Spezialisten." },
];
