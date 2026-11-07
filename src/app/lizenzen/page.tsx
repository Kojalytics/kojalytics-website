import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, FileSpreadsheet, HardDrive, MessagesSquare, MonitorCog, Palette, Receipt, Wrench } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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

export default function LicensingPage() {
  return (
    <>
      <Navigation />
      <main className="px-5 pb-24 pt-28 md:px-6 md:pt-36">
        <section className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">Software-Lizenzen</p>
          <h1 className="display mt-3 text-[clamp(2.5rem,6vw,4.5rem)]">Die richtige Software, sauber lizenziert.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Wir liefern Office-Pakete, Betriebssysteme und Business-Software an Unternehmen und Privatpersonen. Sag uns, was du
            brauchst, und wir empfehlen dir die passenden Lizenzen und helfen bei der Einrichtung.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/kontakt" className="btn-primary">
              Beratung anfragen <ArrowRight size={16} aria-hidden />
            </Link>
            <a href="#ablauf" className="text-sm font-medium text-muted hover:text-foreground">
              So funktioniert es
            </a>
          </div>
        </section>

        <section className="mx-auto mt-28 max-w-7xl">
          <h2 className="display text-center text-4xl">Software für jeden Arbeitsplatz</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <div key={c.title} className="rounded-[22px] border border-border p-7">
                <c.icon size={24} className="text-accent" aria-hidden />
                <h3 className="mt-5 text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{c.description}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-muted">
            Du suchst ein bestimmtes Produkt oder eine bestimmte Edition? Frag uns, wir sagen dir, was verfügbar ist und was zu dir passt.
          </p>
        </section>

        <section id="ablauf" className="mx-auto mt-28 max-w-6xl scroll-mt-24">
          <h2 className="display text-center text-4xl">Von der Anfrage bis zur laufenden Software</h2>
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-[22px] bg-surface p-7">
                <span className="display text-3xl text-accent">{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{s.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto mt-28 max-w-7xl">
          <h2 className="display text-center text-4xl">Erst beraten, dann lizenzieren</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title} className="rounded-[22px] border border-border p-7">
                <r.icon size={24} className="text-accent" aria-hidden />
                <h3 className="mt-5 text-lg font-semibold">{r.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{r.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-28 max-w-4xl rounded-[28px] bg-foreground p-10 text-center text-white md:p-14">
          <h2 className="display text-4xl">Unsicher, welche Lizenz du brauchst?</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">
            Schreib uns kurz, wie viele Personen und Geräte ihr habt. Du bekommst eine klare Empfehlung.
          </p>
          <Link href="/kontakt" className="btn-secondary mt-10">
            Schreib uns <ArrowRight size={16} aria-hidden />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
