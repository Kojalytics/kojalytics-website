import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bot, Calculator, Compass, KeyRound, LayoutGrid, Route, Smartphone, Workflow } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AppIcon from "@/components/ui/app-icon";
import ContactCta from "@/components/studio/ContactCta";
import SectionBar from "@/components/instrument/SectionBar";
import { APPS } from "@/lib/apps";
import { LICENSE_CATEGORIES, PROJECTS, SERVICES } from "@/lib/studio";
import { PLANS } from "@/lib/pricing";
import { DEFAULT_OG_IMAGE, OG_BASE, WEBSITE_JSON_LD, jsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Kojalytics: Software-Lizenzen, Beratung und App-Entwicklung" },
  description:
    "Kojalytics liefert Lizenzen für Office-, System- und Business-Software und berät Unternehmen bei Digitalisierung und KI. Dazu Apps und Websites. Jetzt anfragen.",
  alternates: { canonical: "/" },
  openGraph: {
    ...OG_BASE,
    url: "/",
    title: "Kojalytics: Software-Lizenzen, Beratung und App-Entwicklung",
    description: "Lizenzen für Büro- und Business-Software, Beratung zu Digitalisierung und KI, Apps und Websites. Alles aus einer Hand.",
    images: [DEFAULT_OG_IMAGE],
  },
};

/** The four things Kojalytics does: the overview next to the headline and the order of the sections below. */
const AREAS = [
  { id: "lizenzen", icon: KeyRound, title: "Software-Lizenzen", text: "Office, Betriebssysteme, Server- und Fachsoftware, passend lizenziert." },
  { id: "beratung", icon: Compass, title: "Unternehmensberatung", text: "Digitalisierung, KI und die richtige Software für euren Alltag." },
  { id: "entwicklung", icon: Smartphone, title: "App- und Web-Entwicklung", text: "iOS-Apps, Web-Plattformen und KI-Funktionen, bis zum Release." },
  { id: "koja-apps", icon: LayoutGrid, title: "Koja-Apps", text: "Unsere eigene Software: 13 Apps für Mac und Windows." },
];

const CONSULTING = [
  { icon: Workflow, title: "Digitalisierung und Abläufe", text: "Papier, Excel-Listen und Doppelarbeit durch Software ersetzen, die zu euren Abläufen passt." },
  { icon: Bot, title: "KI im Unternehmen", text: "Wo KI wirklich Zeit spart: Texte, Bilder, Suche und Automatisierung, mit klaren Kosten und Datenschutz." },
  { icon: Calculator, title: "Software-Auswahl und Kosten", text: "Welche Programme ihr braucht, Abo oder Kauf, und wo sich Lizenzkosten sparen lassen." },
  { icon: Route, title: "Apps und Web-Strategie", text: "Eigene App, Web-Plattform oder Shop: was sich lohnt, was es kostet und wie es weitergeht." },
];

const CONSULTING_STEPS = [
  { title: "Erstgespräch", text: "Du erzählst, wie ihr heute arbeitet und wo es hakt. Das Erstgespräch ist kostenlos." },
  { title: "Konkreter Plan", text: "Du bekommst Vorschläge mit Aufwand und Kosten, schriftlich und verständlich." },
  { title: "Umsetzung", text: "Auf Wunsch setzen wir um: Software, Lizenzen und Einrichtung aus einer Hand." },
];

const LICENSE_POINTS = ["Persönliche Beratung statt Checkout", "Privat, Business oder Volumen: die passende Lizenzart", "Schriftliches Angebot und ordentliche Rechnung", "Hilfe bei Installation und Aktivierung"];

const pad = "px-5 md:px-10";
const two = (n: number) => String(n).padStart(2, "0");

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(WEBSITE_JSON_LD)} />
      <Navigation cta="contact" />
      <main className="pt-12">
        {/* 01 Hero: what Kojalytics does, with the four areas as an index on the right */}
        <section className="rail">
          <SectionBar index="01" label="Kojalytics · Hamburg" meta="Software-Handel · Lizenzen · Beratung" />
          <div className={`grid gap-12 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center ${pad}`}>
            <div>
              <h1 className="display rise-in text-[clamp(2.1rem,5.2vw,4.3rem)]">
                Software-<span className="text-highlight">Lizenzen</span> und Beratung für dein Unternehmen.
              </h1>
              <p className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-muted [--i:1]">
                Kojalytics liefert die passenden Lizenzen für Büro- und Business-Software und berät Unternehmen bei Digitalisierung und
                KI. Dazu entwickeln wir Apps und Websites. Alles aus einer Hand, mit festen Ansprechpartnern.
              </p>
              <div className="rise-in mt-9 flex flex-col gap-3 [--i:2] sm:flex-row">
                <Link href="/kontakt?thema=lizenzen" className="btn-primary">
                  Lizenz anfragen <ArrowRight size={15} strokeWidth={2.2} aria-hidden />
                </Link>
                <Link href="/kontakt?thema=beratung" className="btn-secondary">
                  Beratung anfragen
                </Link>
              </div>
              <p className="hud rise-in mt-5 [--i:3]">Kostenloses Erstgespräch · Antwort per E-Mail</p>
            </div>

            <nav aria-label="Unsere Leistungen" className="rise-in border border-border [--i:2]">
              <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2.5">
                <span className="hud">
                  <span className="text-faint">Abb. 01</span> · Was wir machen
                </span>
                <span className="hud text-faint">{AREAS.length} Bereiche</span>
              </div>
              <ul className="cells">
                {AREAS.map((a, i) => (
                  <li key={a.id}>
                    <a href={`#${a.id}`} className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 transition-colors hover:bg-surface sm:px-5 sm:py-5">
                      <span className="icon-box">
                        <a.icon size={18} aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-baseline gap-2">
                          <span className="hud text-faint">{two(i + 1)}</span>
                          <span className="display text-[1.15rem] transition-colors group-hover:text-accent sm:text-[1.3rem]">{a.title}</span>
                        </span>
                        <span className="mt-1 block text-[14px] leading-snug text-muted">{a.text}</span>
                      </span>
                      <ArrowRight size={16} className="text-faint transition-colors group-hover:text-accent" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>

        {/* 02 Software licences: the main business */}
        <section id="lizenzen" className="rail crosshairs scroll-mt-12">
          <SectionBar index="02" label="Software-Lizenzen" meta="Office · Betriebssysteme · Business-Software" />
          <div className={`grid gap-10 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 ${pad}`}>
            <div>
              <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
                Die richtige Software, sauber <span className="text-highlight">lizenziert</span>.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted" data-reveal>
                Wir liefern Office-Pakete, Betriebssysteme und Business-Software an Unternehmen und Privatpersonen. Sag uns, was du
                brauchst und für wie viele Geräte, und du bekommst ein passendes Angebot.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row" data-reveal>
                <Link href="/kontakt?thema=lizenzen" className="btn-primary">
                  Lizenz anfragen <ArrowRight size={15} strokeWidth={2.2} aria-hidden />
                </Link>
                <Link href="/lizenzen" className="btn-secondary">
                  Mehr zu Lizenzen
                </Link>
              </div>
            </div>
            <ul className="grid self-end divide-y divide-border border-y border-border" data-reveal>
              {LICENSE_POINTS.map((t, i) => (
                <li key={t} className="flex gap-4 py-3.5">
                  <span className="hud mt-1 shrink-0 text-faint">{two(i + 1)}</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="cells border-t border-border sm:grid-cols-2 xl:grid-cols-4">
            {LICENSE_CATEGORIES.map((c, i) => (
              <Link
                key={c.title}
                href="/kontakt?thema=lizenzen"
                className="group block p-6 transition-colors hover:bg-surface md:p-8"
                data-reveal
                style={{ ["--i" as string]: i }}
              >
                <div className="flex items-start justify-between">
                  <span className="icon-box">
                    <c.icon size={18} aria-hidden />
                  </span>
                  <ArrowUpRight size={16} className="text-faint transition-colors group-hover:text-accent" aria-hidden />
                </div>
                <h3 className="display mt-6 text-[1.3rem] transition-colors group-hover:text-accent">{c.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{c.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 03 Consulting */}
        <section id="beratung" className="rail crosshairs scroll-mt-12">
          <SectionBar index="03" label="Unternehmensberatung" meta="Digitalisierung · KI · Software" />
          <div className={`grid gap-6 py-14 md:py-20 lg:grid-cols-2 lg:items-end lg:gap-10 ${pad}`}>
            <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Erst verstehen, dann <span className="text-highlight">digitalisieren</span>.
            </h2>
            <div data-reveal>
              <p className="max-w-xl text-lg leading-relaxed text-muted">
                Wir schauen uns an, wie ihr heute arbeitet, und zeigen, wo Software und KI wirklich Zeit und Geld sparen. Ohne
                Fachchinesisch, mit einem konkreten Plan.
              </p>
              <Link href="/kontakt?thema=beratung" className="link-hud mt-6 min-h-11">
                Beratung anfragen <ArrowUpRight size={14} aria-hidden />
              </Link>
            </div>
          </div>
          <div className="cells border-y border-border sm:grid-cols-2 xl:grid-cols-4">
            {CONSULTING.map((c, i) => (
              <div key={c.title} className="p-6 md:p-8" data-reveal style={{ ["--i" as string]: i }}>
                <div className="flex items-start justify-between">
                  <span className="icon-box">
                    <c.icon size={18} aria-hidden />
                  </span>
                  <span className="hud text-faint">{two(i + 1)}</span>
                </div>
                <h3 className="display mt-6 text-[1.3rem]">{c.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{c.text}</p>
              </div>
            ))}
          </div>
          <ol className="cells md:grid-cols-3">
            {CONSULTING_STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-5 p-6 md:p-8" data-reveal style={{ ["--i" as string]: i }}>
                <span className="display text-[2rem] leading-none text-faint">{two(i + 1)}</span>
                <span>
                  <span className="block font-semibold">{s.title}</span>
                  <span className="mt-1.5 block leading-relaxed text-muted">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* 04 App and web development */}
        <section id="entwicklung" className="rail crosshairs scroll-mt-12">
          <SectionBar index="04" label="App- und Web-Entwicklung" meta="iOS · Web · KI · Design · Backend" />
          <div className={`flex flex-col justify-between gap-4 py-14 md:flex-row md:items-end md:py-20 ${pad}`}>
            <h2 className="display max-w-3xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Von der Idee bis zum <span className="whitespace-nowrap text-highlight">Release</span>.
            </h2>
            <Link href="/leistungen" className="link-hud min-h-11 shrink-0">
              Alle Leistungen <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>
          <ul className="cells border-t border-border">
            {SERVICES.map((s, i) => (
              <li key={s.slug}>
                <Link
                  href={`/leistungen#${s.slug}`}
                  data-reveal
                  style={{ ["--i" as string]: i }}
                  className={`group grid gap-3 py-6 transition-colors hover:bg-surface md:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1.25fr)_1.5rem] md:items-baseline md:gap-8 md:py-8 ${pad}`}
                >
                  <span className="hud text-faint">{two(i + 1)}</span>
                  <h3 className="display text-[1.35rem] transition-colors group-hover:text-accent md:text-[1.55rem]">{s.title}</h3>
                  <p className="text-[15px] leading-relaxed text-muted">{s.summary}</p>
                  <ArrowUpRight size={16} className="hidden justify-self-end text-faint transition-colors group-hover:text-accent md:block" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* 05 Projects */}
        <section className="rail crosshairs">
          <SectionBar index="05" label="Projekte" meta="Apps · Websites · Shops · KI" />
          <div className={`flex flex-col justify-between gap-4 py-14 md:flex-row md:items-end md:py-20 ${pad}`}>
            <h2 className="display max-w-3xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Was wir schon <span className="text-highlight">gebaut</span> haben.
            </h2>
            <Link href="/projekte" className="link-hud min-h-11 shrink-0">
              Alle Projekte <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>
          <ul className="cells border-t border-border grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {PROJECTS.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={`/projekte/${p.slug}`}
                  data-reveal
                  style={{ ["--i" as string]: i % 4 }}
                  className="group flex h-full flex-col gap-3 p-4 transition-colors hover:bg-surface sm:p-6"
                >
                  <span className="hud truncate text-faint">{p.kind}</span>
                  <span className="display text-[1.05rem] leading-tight transition-colors group-hover:text-accent sm:text-[1.25rem]">{p.title}</span>
                  <span className="mt-auto hidden text-[14px] leading-snug text-muted sm:block">{p.summary}</span>
                </Link>
              </li>
            ))}
            <li className="md:col-span-2 lg:col-span-3">
              <Link href="/projekte" className="group flex h-full items-end justify-between gap-4 p-4 transition-colors hover:bg-surface sm:p-6">
                <span className="hud text-foreground">{PROJECTS.length} Projekte</span>
                <span className="link-hud group-hover:text-accent">
                  Alle Projekte <ArrowUpRight size={14} aria-hidden />
                </span>
              </Link>
            </li>
          </ul>
        </section>

        {/* 06 Our own software: a short pointer to /software */}
        <section id="koja-apps" className="rail crosshairs scroll-mt-12">
          <SectionBar index="06" label="Eigene Software" meta="Koja-Apps für Mac und Windows" />
          <div className={`grid gap-10 py-14 md:py-20 lg:grid-cols-2 lg:items-center lg:gap-12 ${pad}`}>
            <div>
              <h2 className="display text-[clamp(1.8rem,3.4vw,2.8rem)]" data-reveal>
                Unsere eigenen Apps: die <span className="text-highlight">Koja-Apps</span>.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted" data-reveal>
                13 Programme für Office, PDF, Bildbearbeitung, Video und mehr. Offline, ohne Konto, ab{" "}
                <span className="whitespace-nowrap">{PLANS.monthly.label}</span> im Monat.
              </p>
              <Link href="/software" className="link-hud mt-6 min-h-11" data-reveal>
                Zu den Koja-Apps <ArrowUpRight size={14} aria-hidden />
              </Link>
            </div>
            <Link href="/software" aria-label="Alle 13 Koja-Apps ansehen" className="grid grid-cols-5 gap-3 sm:gap-4 lg:grid-cols-7" data-reveal>
              {APPS.map((a) => (
                <AppIcon key={a.slug} slug={a.slug} name={a.name} size={52} />
              ))}
            </Link>
          </div>
        </section>

        <ContactCta
          hud="Kontakt · Lizenzen · Beratung · Projekte"
          title={
            <>
              Lizenzen, Beratung oder ein Projekt? <span className="text-highlight">Schreib</span> uns.
            </>
          }
          text="Erzähl uns kurz, worum es geht. Du bekommst eine persönliche Antwort mit einem ersten Vorschlag."
          label="Kontakt aufnehmen"
        />
      </main>
      <Footer />
    </>
  );
}
