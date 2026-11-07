"use client";

import { useState } from "react";
import { Check, ShieldCheck, Infinity as InfinityIcon, Laptop } from "lucide-react";
import "./koja-apps.css";

const apps = [
  { icon: "/koja-apps/icons/wordcraft.svg", name: "WordKoja", desc: "Texte, Briefe und Berichte. Öffnet und speichert .docx." },
  { icon: "/koja-apps/icons/gridcraft.svg", name: "GridKoja", desc: "Tabellen mit Formeln und Diagrammen. Öffnet und speichert .xlsx." },
  { icon: "/koja-apps/icons/deckcraft.svg", name: "DeckKoja", desc: "Präsentationen und Folien. Öffnet und speichert .pptx." },
  { icon: "/koja-apps/icons/pdfcraft.svg", name: "PdfKoja", desc: "PDFs lesen, ordnen, kommentieren und schützen." },
  { icon: "/koja-apps/icons/photocraft.svg", name: "PhotoKoja", desc: "Bildbearbeitung mit Ebenen, Masken und Filtern." },
  { icon: "/koja-apps/icons/lightcraft.svg", name: "LightKoja", desc: "Fotobibliothek und RAW-Entwicklung." },
  { icon: "/koja-apps/icons/vectorcraft.svg", name: "VectorKoja", desc: "Vektorgrafiken, Logos und Illustrationen." },
  { icon: "/koja-apps/icons/designcraft.svg", name: "DesignKoja", desc: "Layout für Flyer, Magazine und Broschüren." },
  { icon: "/koja-apps/icons/figcraft.svg", name: "FigKoja", desc: "Interface-Design und klickbare Prototypen." },
  { icon: "/koja-apps/icons/filmcraft.svg", name: "FilmKoja", desc: "Videoschnitt, Farbkorrektur und Ton." },
  { icon: "/koja-apps/icons/effectcraft.svg", name: "EffectKoja", desc: "Motion Graphics und visuelle Effekte." },
  { icon: "/koja-apps/icons/soundcraft.svg", name: "SoundKoja", desc: "Audio aufnehmen, schneiden und mischen." },
  { icon: "/koja-apps/icons/cadcraft.svg", name: "CADKoja", desc: "Technisches Zeichnen und CAD-Konstruktion." },
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
        {apps.map(({ icon, name, desc }) => (
          <article key={name} className="koja-app">
            {/* eslint-disable-next-line @next/next/no-img-element -- small static SVGs */}
            <img className="koja-app-icon" src={icon} alt="" width={56} height={56} loading="lazy" />
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
