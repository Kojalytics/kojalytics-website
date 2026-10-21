"use client";

import { useState } from "react";
import {
  Aperture,
  AudioLines,
  Check,
  DraftingCompass,
  FileLock2,
  FileText,
  Film,
  Frame,
  Grid3x3,
  Image as ImageIcon,
  LayoutTemplate,
  PenTool,
  Presentation,
  ShieldCheck,
  Sparkles,
  Infinity as InfinityIcon,
  Laptop,
} from "lucide-react";
import "./koja-apps.css";

const apps = [
  { icon: FileText, name: "WordKoja", desc: "Texte, Briefe und Berichte. Öffnet und speichert .docx." },
  { icon: Grid3x3, name: "GridKoja", desc: "Tabellen mit Formeln und Diagrammen. Öffnet und speichert .xlsx." },
  { icon: Presentation, name: "DeckKoja", desc: "Präsentationen und Folien. Öffnet und speichert .pptx." },
  { icon: FileLock2, name: "PdfKoja", desc: "PDFs lesen, ordnen, kommentieren und schützen." },
  { icon: ImageIcon, name: "PhotoKoja", desc: "Bildbearbeitung mit Ebenen, Masken und Filtern." },
  { icon: Aperture, name: "LightKoja", desc: "Fotobibliothek und RAW-Entwicklung." },
  { icon: PenTool, name: "VectorKoja", desc: "Vektorgrafiken, Logos und Illustrationen." },
  { icon: LayoutTemplate, name: "DesignKoja", desc: "Layout für Flyer, Magazine und Broschüren." },
  { icon: Frame, name: "FigKoja", desc: "Interface-Design und klickbare Prototypen." },
  { icon: Film, name: "FilmKoja", desc: "Videoschnitt, Farbkorrektur und Ton." },
  { icon: Sparkles, name: "EffectKoja", desc: "Motion Graphics und visuelle Effekte." },
  { icon: AudioLines, name: "SoundKoja", desc: "Audio aufnehmen, schneiden und mischen." },
  { icon: DraftingCompass, name: "CADKoja", desc: "Technisches Zeichnen und CAD-Konstruktion." },
];

const included = [
  "Alle Koja-Apps, auch zukünftige",
  "Lebenslang nutzbar, kein Abo",
  "Bis zu 3 Geräte",
  "Updates über den Kojalytics Launcher",
];

export default function KojaAppsPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buy() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/license/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "checkout failed");
      window.location.href = data.url;
    } catch {
      setError("Der Bezahlvorgang konnte nicht gestartet werden. Bitte versuche es gleich noch einmal.");
      setBusy(false);
    }
  }

  return (
    <main className="koja">
      <section className="koja-hero">
        <p className="koja-eyebrow">Koja Apps · für den Mac</p>
        <h1>
          Dein Büro.
          <br />
          <span>Einmal gekauft.</span>
        </h1>
        <p className="koja-lead">
          13 Apps für Büro, Foto, Design, Video und Audio in einer Lizenz. Ohne Abo, ohne Konto, ohne Cloud-Zwang.
        </p>
        <button className="koja-buy" onClick={buy} disabled={busy}>
          {busy ? "Weiter zu Stripe…" : "Jetzt kaufen · 39,95 €"}
        </button>
        {error && <p className="koja-error">{error}</p>}
        <p className="koja-fine">Einmalzahlung inkl. MwSt. · Sichere Zahlung über Stripe</p>
      </section>

      <section className="koja-apps">
        {apps.map(({ icon: Icon, name, desc }) => (
          <article key={name} className="koja-app">
            <Icon size={28} strokeWidth={1.6} />
            <h2>{name}</h2>
            <p>{desc}</p>
          </article>
        ))}
      </section>

      <section className="koja-offer">
        <div className="koja-price">
          <span className="koja-amount">39,95 €</span>
          <span className="koja-once">einmalig</span>
        </div>
        <ul>
          {included.map((item) => (
            <li key={item}>
              <Check size={18} /> {item}
            </li>
          ))}
        </ul>
        <button className="koja-buy" onClick={buy} disabled={busy}>
          {busy ? "Weiter zu Stripe…" : "Lizenz kaufen"}
        </button>
      </section>

      <section className="koja-facts">
        <div>
          <InfinityIcon size={22} />
          <h3>Für immer deins</h3>
          <p>Du zahlst einmal und behältst die Apps. Kein Abo läuft im Hintergrund weiter.</p>
        </div>
        <div>
          <Laptop size={22} />
          <h3>Bis zu 3 Geräte</h3>
          <p>Aktiviere deinen Schlüssel auf deinem MacBook, deinem iMac und einem weiteren Gerät.</p>
        </div>
        <div>
          <ShieldCheck size={22} />
          <h3>Open Source</h3>
          <p>Die Koja-Apps basieren auf offenen Projekten des ArtCraft-Teams (MIT/Apache-2.0) und werden von Kojalytics herausgegeben.</p>
        </div>
      </section>
    </main>
  );
}
