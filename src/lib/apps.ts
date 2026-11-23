// The 13 Koja apps. Fixed facts live here; the page copy lives in src/content/apps/<slug>.json (German) and
// src/content/apps/en/<slug>.json (English, same structure).

import type { Lang } from "@/lib/i18n";
import screenshots from "@/content/screenshots.json";
import demos from "@/content/demos.json";
import photo from "@/content/apps/photo-koja.json";
import light from "@/content/apps/light-koja.json";
import vector from "@/content/apps/vector-koja.json";
import design from "@/content/apps/design-koja.json";
import fig from "@/content/apps/fig-koja.json";
import film from "@/content/apps/film-koja.json";
import effect from "@/content/apps/effect-koja.json";
import sound from "@/content/apps/sound-koja.json";
import word from "@/content/apps/word-koja.json";
import grid from "@/content/apps/grid-koja.json";
import deck from "@/content/apps/deck-koja.json";
import pdf from "@/content/apps/pdf-koja.json";
import cad from "@/content/apps/cad-koja.json";
import photoEn from "@/content/apps/en/photo-koja.json";
import lightEn from "@/content/apps/en/light-koja.json";
import vectorEn from "@/content/apps/en/vector-koja.json";
import designEn from "@/content/apps/en/design-koja.json";
import figEn from "@/content/apps/en/fig-koja.json";
import filmEn from "@/content/apps/en/film-koja.json";
import effectEn from "@/content/apps/en/effect-koja.json";
import soundEn from "@/content/apps/en/sound-koja.json";
import wordEn from "@/content/apps/en/word-koja.json";
import gridEn from "@/content/apps/en/grid-koja.json";
import deckEn from "@/content/apps/en/deck-koja.json";
import pdfEn from "@/content/apps/en/pdf-koja.json";
import cadEn from "@/content/apps/en/cad-koja.json";
import extraEn from "@/content/apps/en/extra.json";
import { href } from "@/lib/i18n";

export type AppGroup = "Foto & Design" | "Video & Audio" | "Büro & Technik";

/** German page copy, one JSON file per app. */
export type AppContent = {
  kind: string;
  benefit: string;
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lead: string;
  highlights: string[];
  features: { title: string; text: string; screenshot?: string }[];
  screenshots: { file: string; alt: string; caption: string }[];
  switching: { title: string; paragraphs: string[] };
  comparison: { rows: { label: string; koja: string; other: string }[]; note: string };
  forWho: string[];
  notFor: string[];
  formats: string[];
  faq: { q: string; a: string }[];
};

type AppBase = {
  slug: string;
  name: string;
  upstream: string;
  group: AppGroup;
  color: string;
  /** The product people search an alternative for, with its owner for the trademark note. */
  familiar: { product: string; owner: string };
};

// Order of the apps everywhere on the site (owner's choice): Office first, then video/audio, design, photo, CAD.
const BASE: AppBase[] = [
  { slug: "word-koja", name: "WordKoja", upstream: "WordCraft", group: "Büro & Technik", color: "#3c5bdc", familiar: { product: "Microsoft Word", owner: "Microsoft Corporation" } },
  { slug: "grid-koja", name: "GridKoja", upstream: "GridCraft", group: "Büro & Technik", color: "#1d9d54", familiar: { product: "Microsoft Excel", owner: "Microsoft Corporation" } },
  { slug: "deck-koja", name: "DeckKoja", upstream: "DeckCraft", group: "Büro & Technik", color: "#ef641b", familiar: { product: "Microsoft PowerPoint", owner: "Microsoft Corporation" } },
  { slug: "pdf-koja", name: "PdfKoja", upstream: "PdfCraft", group: "Büro & Technik", color: "#11a58a", familiar: { product: "Adobe Acrobat", owner: "Adobe Inc." } },
  { slug: "photo-koja", name: "PhotoKoja", upstream: "PhotoCraft", group: "Foto & Design", color: "#2f7bf5", familiar: { product: "Photoshop", owner: "Adobe Inc." } },
  { slug: "film-koja", name: "FilmKoja", upstream: "FilmCraft", group: "Video & Audio", color: "#8a5cf6", familiar: { product: "Premiere Pro", owner: "Adobe Inc." } },
  { slug: "sound-koja", name: "SoundKoja", upstream: "SoundCraft", group: "Video & Audio", color: "#2fa8c0", familiar: { product: "Pro Tools", owner: "Avid Technology, Inc." } },
  { slug: "design-koja", name: "DesignKoja", upstream: "DesignCraft", group: "Foto & Design", color: "#7ab51b", familiar: { product: "InDesign", owner: "Adobe Inc." } },
  { slug: "fig-koja", name: "FigKoja", upstream: "FigCraft", group: "Foto & Design", color: "#02c98a", familiar: { product: "Figma", owner: "Figma, Inc." } },
  { slug: "vector-koja", name: "VectorKoja", upstream: "VectorCraft", group: "Foto & Design", color: "#e7573e", familiar: { product: "Illustrator", owner: "Adobe Inc." } },
  { slug: "light-koja", name: "LightKoja", upstream: "LightCraft", group: "Foto & Design", color: "#f3a617", familiar: { product: "Lightroom", owner: "Adobe Inc." } },
  { slug: "effect-koja", name: "EffectKoja", upstream: "EffectCraft", group: "Video & Audio", color: "#e03690", familiar: { product: "After Effects", owner: "Adobe Inc." } },
  { slug: "cad-koja", name: "CADKoja", upstream: "CADCraft", group: "Büro & Technik", color: "#13a4c7", familiar: { product: "AutoCAD", owner: "Autodesk, Inc." } },
];

const CONTENT: Record<string, AppContent> = {
  "photo-koja": photo,
  "light-koja": light,
  "vector-koja": vector,
  "design-koja": design,
  "fig-koja": fig,
  "film-koja": film,
  "effect-koja": effect,
  "sound-koja": sound,
  "word-koja": word,
  "grid-koja": grid,
  "deck-koja": deck,
  "pdf-koja": pdf,
  "cad-koja": cad,
};

/**
 * Card pictures for "02 / Die Apps" (public/apps/<slug>/karte.webp, 1440×900): illustrations of each app in one
 * shared design, made by scripts/app-cards (no third-party screenshots). The alt text says what is shown.
 */
const CARD_ALT: Record<string, string> = {
  "word-koja": "Illustration: WordKoja mit einer Bewerbung, Kommentaren und Formatvorlagen",
  "grid-koja": "Illustration: GridKoja mit einem Haushaltsbuch, SUMME-Formel und Ringdiagramm",
  "deck-koja": "Illustration: DeckKoja mit einer Folie zum Quartalsbericht und dem Übergang Morph",
  "pdf-koja": "Illustration: PdfKoja beim Ordnen von PDF-Seiten und Schützen mit Passwort",
  "photo-koja": "Illustration: PhotoKoja mit einem Plakat, Ebenen und Schlagschatten",
  "film-koja": "Illustration: FilmKoja mit Vorschau, Timeline und Farbkorrektur",
  "sound-koja": "Illustration: SoundKoja mit Podcast-Spuren, Wellenformen und Mischpult",
  "design-koja": "Illustration: DesignKoja mit einer Magazin-Doppelseite und Absatzformaten",
  "fig-koja": "Illustration: FigKoja mit zwei App-Bildschirmen, Auto Layout und Prototyp-Verbindung",
  "vector-koja": "Illustration: VectorKoja mit einem Logo, Ankerpunkten und Pathfinder",
  "light-koja": "Illustration: LightKoja beim Entwickeln eines Bergfotos mit Histogramm",
  "effect-koja": "Illustration: EffectKoja mit einem 3D-Titel, Keyframes und Kurveneditor",
  "cad-koja": "Illustration: CADKoja mit einem bemaßten Grundriss und der Befehlszeile",
};

export type Screenshot = { src: string; width: number; height: number; alt: string; caption: string };
export type KojaApp = AppBase &
  AppContent & {
    shots: Screenshot[];
    card: { src: string; width: number; height: number; alt: string };
    /**
     * Demo loop rendered by scripts/app-demos from the stops in src/content/demos.json. `start` is when the
     * camera arrives at a stop, `duration` the length of the loop, both in seconds (same timing as the renderer).
     */
    demo?: { src: string; poster: string; duration: number; travel: number; steps: { label: string; text: string; start: number }[] };
  };

const CONTENT_EN: Record<string, AppContent> = {
  "photo-koja": photoEn,
  "light-koja": lightEn,
  "vector-koja": vectorEn,
  "design-koja": designEn,
  "fig-koja": figEn,
  "film-koja": filmEn,
  "effect-koja": effectEn,
  "sound-koja": soundEn,
  "word-koja": wordEn,
  "grid-koja": gridEn,
  "deck-koja": deckEn,
  "pdf-koja": pdfEn,
  "cad-koja": cadEn,
};

const DEMOS = demos.apps as Record<string, { label: string; text: string }[]>;
const DEMOS_EN = extraEn.demos as Record<string, { label: string; text: string }[]>;
const CARD_ALT_EN = extraEn.cardAlt as Record<string, string>;
const { intro, dwell, travel, outro } = demos.timing;

/** Sizes of the screenshots in public/apps (our own captures of the Koja apps with our own demo content). */
const SIZES = screenshots as Record<string, { width: number; height: number }>;

/**
 * Links in the English copy point at German addresses (as written in the German files): send them to the English pages,
 * and drop links to the German-only guides (their text stays).
 */
function englishLinks<T>(value: T): T {
  if (typeof value === "string") {
    return value.replace(/\[([^\]\[]+)\]\((\/[^)\s]*)\)/g, (all, label: string, path: string) => {
      const to = href("en", path);
      return to === path && /^\/ratgeber/.test(path) ? label : `[${label}](${to})`;
    }) as T;
  }
  if (Array.isArray(value)) return value.map(englishLinks) as T;
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, englishLinks(v)])) as T;
  return value;
}

function withShots(base: AppBase, lang: Lang = "de"): KojaApp {
  const content = lang === "de" ? CONTENT[base.slug] : englishLinks(CONTENT_EN[base.slug]);
  const shots = content.screenshots
    .map((s) => {
      const key = `${base.slug}/${s.file}`;
      const size = SIZES[key];
      return size ? { src: `/apps/${key}`, width: size.width, height: size.height, alt: s.alt, caption: s.caption } : null;
    })
    .filter((s): s is Screenshot => s !== null);
  const card = { src: `/apps/${base.slug}/karte.webp`, width: 1440, height: 900, alt: (lang === "de" ? CARD_ALT : CARD_ALT_EN)[base.slug] };
  const stops = (lang === "de" ? DEMOS : DEMOS_EN)[base.slug];
  const demo = stops && {
    src: `/apps/${base.slug}/demo.mp4`,
    poster: `/apps/${base.slug}/demo.jpg`,
    duration: intro + stops.length * dwell + (stops.length - 1) * travel + outro,
    travel,
    steps: stops.map(({ label, text }, i) => ({ label, text, start: intro + i * (dwell + travel) })),
  };
  return { ...base, ...content, shots, card, demo };
}

export const APPS: KojaApp[] = BASE.map((b) => withShots(b));

/** The apps with their page copy in a language (English from src/content/apps/en). */
export function appsFor(lang: Lang): KojaApp[] {
  return lang === "en" ? APPS_EN : APPS;
}

const APPS_EN: KojaApp[] = BASE.map((b) => withShots(b, "en"));

/**
 * The app colour darkened until it reads as text on white (WCAG AA, 4.5:1), e.g. for the "Koja" part
 * of an app name. Light icon colours like LightKoja's amber become a deep ochre.
 */
export function appInk(hex: string) {
  let [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const lum = (v: number[]) => {
    const [R, G, B] = v.map((c) => {
      const x = c / 255;
      return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };
  while (1.05 / (lum([r, g, b]) + 0.05) < 4.5) [r, g, b] = [r, g, b].map((c) => Math.round(c * 0.92));
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export const APP_GROUPS: AppGroup[] = ["Foto & Design", "Video & Audio", "Büro & Technik"];

export function getApp(slug: string) {
  return APPS.find((a) => a.slug === slug);
}

export function shotFor(app: KojaApp, file?: string) {
  return (file && app.shots.find((s) => s.src.endsWith(`/${file}`))) || app.shots[0];
}
