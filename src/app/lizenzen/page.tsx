import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, FileSpreadsheet, HardDrive, MessagesSquare, MonitorCog, Palette, Receipt, Wrench } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionBar from "@/components/instrument/SectionBar";

const categories = [
  { icon: FileSpreadsheet, title: "Office & Produktivität", description: "Textverarbeitung, Tabellen, Präsentationen und E-Mail für Einzelne und ganze Teams." },
  { icon: MonitorCog, title: "Betriebssysteme", description: "Desktop-Betriebssysteme für neue Rechner, Upgrades und ganze Arbeitsplatz-Flotten." },
  { icon: HardDrive, title: "Server & Infrastruktur", description: "Server-Software und Zugriffslizenzen für Büros, Praxen und wachsende Unternehmen." },
  { icon: Palette, title: "Kreativ- & Spezialsoftware", description: "Design, Video, Projektplanung und Diagramme für Spezialisten." },
];

const steps = [
  { title: "Sag uns, was du brauchst", description: "Anzahl der Nutzer und Geräte, wie ihr heute arbeitet und was ihr erreichen wollt." },
  { title: "Passendes Angebot erhalten", description: "Wir empfehlen die Editionen und Lizenzarten, die passen, und nicht mehr, als ihr braucht." },
  { title: "Lizenzierung & Einrichtung", description: "Du bekommst deine Lizenzen mit Rechnung, und wir helfen bei Installation und Aktivierung." },
];

const reasons = [
  { icon: MessagesSquare, title: "Persönliche Beratung", description: "Ein echter Mensch schaut sich deine Situation an, statt dass ein Checkout für dich rät." },
  { icon: BriefcaseBusiness, title: "Die richtige Lizenzart", description: "Privat, Business oder Volumen: Wir erklären die Unterschiede, bevor du kaufst." },
  { icon: Receipt, title: "Klare Angebote & Rechnungen", description: "Transparente Preise schriftlich und ordentliche Rechnungen für deine Buchhaltung." },
  { icon: Wrench, title: "Hilfe bei der Einrichtung", description: "Unterstützung bei Installation und Aktivierung, damit dein Team loslegen kann." },
];

const pad = "px-5 md:px-10";
const two = (n: number) => String(n).padStart(2, "0");

export default function LicensingPage() {
  return (
    <>
      <Navigation />
      <main className="pt-12">
        {/* 01 Hero */}
        <section className="rail">
          <SectionBar index="01" label="Software-Lizenzen" meta="Office · Betriebssysteme · Business-Software" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h1 className="display rise-in max-w-5xl text-[clamp(2.1rem,5.4vw,4.6rem)]">
              Die richtige Software, sauber <span className="text-highlight">lizenziert</span>.
            </h1>
            <p className="rise-in mt-6 max-w-2xl text-lg leading-relaxed text-muted [--i:1]">
              Wir liefern Office-Pakete, Betriebssysteme und Business-Software an Unternehmen und Privatpersonen. Sag uns, was du
              brauchst, und wir empfehlen dir die passenden Lizenzen und helfen bei der Einrichtung.
            </p>
            <div className="rise-in mt-9 flex flex-col gap-3 [--i:2] sm:flex-row">
              <Link href="/kontakt" className="btn-primary">
                Beratung anfragen <ArrowRight size={16} aria-hidden />
              </Link>
              <a href="#ablauf" className="btn-secondary">
                So funktioniert es
              </a>
            </div>
          </div>
        </section>

        {/* 02 Categories */}
        <section className="rail crosshairs">
          <SectionBar index="02" label="Sortiment" meta={`${categories.length} Bereiche`} />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h2 className="display max-w-3xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Software für jeden <span className="text-highlight">Arbeitsplatz</span>
            </h2>
          </div>
          <div className="cells border-y border-border sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, i) => (
              <div key={c.title} className="p-6 md:p-8" data-reveal style={{ ["--i" as string]: i }}>
                <div className="flex items-start justify-between">
                  <span className="icon-box">
                    <c.icon size={18} aria-hidden />
                  </span>
                  <span className="hud text-faint">{two(i + 1)}</span>
                </div>
                <h3 className="display mt-6 text-[1.35rem]">{c.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{c.description}</p>
              </div>
            ))}
          </div>
          <div className={`py-10 md:py-12 ${pad}`}>
            <p className="max-w-2xl text-muted" data-reveal>
              Du suchst ein bestimmtes Produkt oder eine bestimmte Edition? Frag uns, wir sagen dir, was verfügbar ist und was zu dir passt.
            </p>
          </div>
        </section>

        {/* 03 Process */}
        <section id="ablauf" className="rail crosshairs scroll-mt-12">
          <SectionBar index="03" label="Ablauf" meta={`In ${steps.length} Schritten`} />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h2 className="display max-w-3xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Von der Anfrage bis zur laufenden <span className="text-highlight">Software</span>
            </h2>
          </div>
          <ol className="cells border-t border-border md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="p-6 md:p-8" data-reveal style={{ ["--i" as string]: i }}>
                <span className="display block text-[2.4rem] text-faint">{two(i + 1)}</span>
                <h3 className="display mt-6 text-[1.35rem]">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{s.description}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 04 Why advice first */}
        <section className="rail crosshairs">
          <SectionBar index="04" label="Warum mit Beratung" meta={`${reasons.length} Gründe`} />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h2 className="display max-w-3xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Erst beraten, dann <span className="text-highlight">lizenzieren</span>
            </h2>
          </div>
          <div className="cells border-t border-border sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r, i) => (
              <div key={r.title} className="p-6 md:p-8" data-reveal style={{ ["--i" as string]: i }}>
                <div className="flex items-start justify-between">
                  <span className="icon-box">
                    <r.icon size={18} aria-hidden />
                  </span>
                  <span className="hud text-faint">{two(i + 1)}</span>
                </div>
                <h3 className="display mt-6 text-[1.35rem]">{r.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{r.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="rail crosshairs border-t border-border">
          <div className={`flex flex-col items-center py-20 text-center md:py-28 ${pad}`}>
            <p className="hud">Persönliche Beratung · Software-Lizenzen</p>
            <h2 className="display mt-8 max-w-4xl text-[clamp(2.2rem,5vw,4.4rem)]" data-reveal>
              Unsicher, welche <span className="text-highlight">Lizenz</span> du brauchst?
            </h2>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Schreib uns kurz, wie viele Personen und Geräte ihr habt. Du bekommst eine klare Empfehlung.
            </p>
            <div className="mt-9">
              <Link href="/kontakt" className="btn-primary">
                Schreib uns <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
