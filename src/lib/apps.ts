// The 13 Koja apps. Fixed facts live here; the German page copy lives in src/content/apps/<slug>.json.
// Each Koja app is a build of an open-source app (Apache 2.0 / MIT).

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
  /** Development stage of the upstream build, shown as a tag. */
  status: "Alpha" | "Pre-Alpha";
  /** The product people search an alternative for, with its owner for the trademark note. */
  familiar: { product: string; owner: string };
};

// Order of the apps everywhere on the site (owner's choice): Office first, then video/audio, design, photo, CAD.
const BASE: AppBase[] = [
  { slug: "word-koja", name: "WordKoja", upstream: "WordCraft", group: "Büro & Technik", color: "#3c5bdc", status: "Alpha", familiar: { product: "Microsoft Word", owner: "Microsoft Corporation" } },
  { slug: "grid-koja", name: "GridKoja", upstream: "GridCraft", group: "Büro & Technik", color: "#1d9d54", status: "Alpha", familiar: { product: "Microsoft Excel", owner: "Microsoft Corporation" } },
  { slug: "deck-koja", name: "DeckKoja", upstream: "DeckCraft", group: "Büro & Technik", color: "#ef641b", status: "Alpha", familiar: { product: "Microsoft PowerPoint", owner: "Microsoft Corporation" } },
  { slug: "pdf-koja", name: "PdfKoja", upstream: "PdfCraft", group: "Büro & Technik", color: "#11a58a", status: "Alpha", familiar: { product: "Adobe Acrobat", owner: "Adobe Inc." } },
  { slug: "photo-koja", name: "PhotoKoja", upstream: "PhotoCraft", group: "Foto & Design", color: "#2f7bf5", status: "Alpha", familiar: { product: "Photoshop", owner: "Adobe Inc." } },
  { slug: "film-koja", name: "FilmKoja", upstream: "FilmCraft", group: "Video & Audio", color: "#8a5cf6", status: "Alpha", familiar: { product: "Premiere Pro", owner: "Adobe Inc." } },
  { slug: "sound-koja", name: "SoundKoja", upstream: "SoundCraft", group: "Video & Audio", color: "#2fa8c0", status: "Pre-Alpha", familiar: { product: "Pro Tools", owner: "Avid Technology, Inc." } },
  { slug: "design-koja", name: "DesignKoja", upstream: "DesignCraft", group: "Foto & Design", color: "#7ab51b", status: "Pre-Alpha", familiar: { product: "InDesign", owner: "Adobe Inc." } },
  { slug: "fig-koja", name: "FigKoja", upstream: "FigCraft", group: "Foto & Design", color: "#02c98a", status: "Alpha", familiar: { product: "Figma", owner: "Figma, Inc." } },
  { slug: "vector-koja", name: "VectorKoja", upstream: "VectorCraft", group: "Foto & Design", color: "#e7573e", status: "Alpha", familiar: { product: "Illustrator", owner: "Adobe Inc." } },
  { slug: "light-koja", name: "LightKoja", upstream: "LightCraft", group: "Foto & Design", color: "#f3a617", status: "Alpha", familiar: { product: "Lightroom", owner: "Adobe Inc." } },
  { slug: "effect-koja", name: "EffectKoja", upstream: "EffectCraft", group: "Video & Audio", color: "#e03690", status: "Alpha", familiar: { product: "After Effects", owner: "Adobe Inc." } },
  { slug: "cad-koja", name: "CADKoja", upstream: "CADCraft", group: "Büro & Technik", color: "#13a4c7", status: "Pre-Alpha", familiar: { product: "AutoCAD", owner: "Autodesk, Inc." } },
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

const DEMOS = demos.apps as Record<string, { label: string; text: string }[]>;
const { intro, dwell, travel, outro } = demos.timing;

/** Sizes of the screenshots in public/apps (our own captures of the Koja apps with our own demo content). */
const SIZES = screenshots as Record<string, { width: number; height: number }>;

function withShots(base: AppBase): KojaApp {
  const content = CONTENT[base.slug];
  const shots = content.screenshots
    .map((s) => {
      const key = `${base.slug}/${s.file}`;
      const size = SIZES[key];
      return size ? { src: `/apps/${key}`, width: size.width, height: size.height, alt: s.alt, caption: s.caption } : null;
    })
    .filter((s): s is Screenshot => s !== null);
  const card = { src: `/apps/${base.slug}/karte.webp`, width: 1440, height: 900, alt: CARD_ALT[base.slug] };
  const stops = DEMOS[base.slug];
  const demo = stops && {
    src: `/apps/${base.slug}/demo.mp4`,
    poster: `/apps/${base.slug}/demo.jpg`,
    duration: intro + stops.length * dwell + (stops.length - 1) * travel + outro,
    travel,
    steps: stops.map(({ label, text }, i) => ({ label, text, start: intro + i * (dwell + travel) })),
  };
  return { ...base, ...content, shots, card, demo };
}

export const APPS: KojaApp[] = BASE.map(withShots);

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
