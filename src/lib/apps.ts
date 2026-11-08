// The 13 Koja apps. Fixed facts live here; the German page copy lives in src/content/apps/<slug>.json.
// Each Koja app is a macOS build of an open-source Craft app by the ArtCraft team (MIT / Apache-2.0).

import screenshots from "@/content/screenshots.json";
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
  /** The product people search an alternative for, with its owner for the trademark note. */
  familiar: { product: string; owner: string };
};

const BASE: AppBase[] = [
  { slug: "photo-koja", name: "PhotoKoja", upstream: "PhotoCraft", group: "Foto & Design", color: "#2f7bf5", familiar: { product: "Photoshop", owner: "Adobe Inc." } },
  { slug: "light-koja", name: "LightKoja", upstream: "LightCraft", group: "Foto & Design", color: "#f3a617", familiar: { product: "Lightroom", owner: "Adobe Inc." } },
  { slug: "vector-koja", name: "VectorKoja", upstream: "VectorCraft", group: "Foto & Design", color: "#e7573e", familiar: { product: "Illustrator", owner: "Adobe Inc." } },
  { slug: "design-koja", name: "DesignKoja", upstream: "DesignCraft", group: "Foto & Design", color: "#7ab51b", familiar: { product: "InDesign", owner: "Adobe Inc." } },
  { slug: "fig-koja", name: "FigKoja", upstream: "FigCraft", group: "Foto & Design", color: "#02c98a", familiar: { product: "Figma", owner: "Figma, Inc." } },
  { slug: "film-koja", name: "FilmKoja", upstream: "FilmCraft", group: "Video & Audio", color: "#8a5cf6", familiar: { product: "Premiere Pro", owner: "Adobe Inc." } },
  { slug: "effect-koja", name: "EffectKoja", upstream: "EffectCraft", group: "Video & Audio", color: "#e03690", familiar: { product: "After Effects", owner: "Adobe Inc." } },
  { slug: "sound-koja", name: "SoundKoja", upstream: "SoundCraft", group: "Video & Audio", color: "#2fa8c0", familiar: { product: "Pro Tools", owner: "Avid Technology, Inc." } },
  { slug: "word-koja", name: "WordKoja", upstream: "WordCraft", group: "Büro & Technik", color: "#3c5bdc", familiar: { product: "Microsoft Word", owner: "Microsoft Corporation" } },
  { slug: "grid-koja", name: "GridKoja", upstream: "GridCraft", group: "Büro & Technik", color: "#1d9d54", familiar: { product: "Microsoft Excel", owner: "Microsoft Corporation" } },
  { slug: "deck-koja", name: "DeckKoja", upstream: "DeckCraft", group: "Büro & Technik", color: "#ef641b", familiar: { product: "Microsoft PowerPoint", owner: "Microsoft Corporation" } },
  { slug: "pdf-koja", name: "PdfKoja", upstream: "PdfCraft", group: "Büro & Technik", color: "#11a58a", familiar: { product: "Adobe Acrobat", owner: "Adobe Inc." } },
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

export type Screenshot = { src: string; width: number; height: number; alt: string; caption: string };
export type KojaApp = AppBase & AppContent & { shots: Screenshot[] };

/** Sizes of the screenshots in public/apps (from the ArtCraft press kit, cropped where ArtCraft branding was visible). */
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
  return { ...base, ...content, shots };
}

export const APPS: KojaApp[] = BASE.map(withShots);

export const APP_GROUPS: AppGroup[] = ["Foto & Design", "Video & Audio", "Büro & Technik"];

export function getApp(slug: string) {
  return APPS.find((a) => a.slug === slug);
}

export function shotFor(app: KojaApp, file?: string) {
  return (file && app.shots.find((s) => s.src.endsWith(`/${file}`))) || app.shots[0];
}
