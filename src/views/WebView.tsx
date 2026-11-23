import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AppIcon from "@/components/ui/app-icon";
import SectionBar from "@/components/instrument/SectionBar";
import { appsFor } from "@/lib/apps";
import { WEB_APPS } from "@/lib/web-apps";
import { planText } from "@/lib/pricing";
import { href, type Lang } from "@/lib/i18n";

const de = {
  label: "Im Browser",
  meta: "kostenlos · ohne Konto · ohne Installation",
  title: (
    <>
      Koja-Apps im Browser <span className="text-highlight">testen</span>.
    </>
  ),
  intro:
    "Öffne eine App und leg los: kein Konto, keine Installation. Deine Dateien öffnest und speicherst du direkt auf deinem Gerät, nichts wird hochgeladen. Das klappt auch am Handy, am Computer hast du mehr Platz.",
  open: "Im Browser öffnen",
  first: "Beim ersten Start",
  firstText: "lädt die App einige Sekunden (rund 15–20 MB). Danach startet sie schneller.",
  desktop: "Die Desktop-Version",
  desktopText: "läuft schneller, offline und mit allen Funktionen. Dazu gehören auch FilmKoja, EffectKoja und LightKoja.",
  all: "Alle 13 Apps",
  allText: (price: string) => `für Mac und Windows bekommst du für einmal ${price}, kein Abo.`,
  prices: "Zu den Preisen",
};

const en: typeof de = {
  label: "In your browser",
  meta: "free · no account · no installation",
  title: (
    <>
      Try the Koja apps in your <span className="text-highlight">browser</span>.
    </>
  ),
  intro:
    "Open an app and get started: no account, no installation. You open and save your files directly on your device, nothing is uploaded. It works on your phone too; on a computer you have more room.",
  open: "Open in browser",
  first: "The first time",
  firstText: "the app takes a few seconds to load (about 15–20 MB). After that it starts faster.",
  desktop: "The desktop version",
  desktopText: "is faster, works offline and has every feature. It also includes FilmKoja, EffectKoja and LightKoja.",
  all: "All 13 apps",
  allText: (price: string) => `for Mac and Windows are yours for ${price} once, no subscription.`,
  prices: "See pricing",
};

const T = { de, en };

const pad = "px-5 md:px-10";

/** The browser versions of the Koja apps (/web and /en/web). */
export default function WebView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const apps = appsFor(lang).filter((a) => WEB_APPS.includes(a.slug));
  return (
    <>
      <Navigation />
      <main className="pt-12">
        <section className="rail">
          <SectionBar index="01" label={t.label} meta={t.meta} />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h1 className="display max-w-3xl text-[clamp(2rem,4.6vw,4rem)]">
              {t.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              {t.intro}
            </p>

            <ul className="cells mt-12 grid-cols-1 border border-border sm:grid-cols-2 lg:grid-cols-5">
              {apps.map((app) => (
                <li key={app.slug}>
                  <a href={href(lang, `/web/${app.slug}`)} className="group flex h-full flex-col gap-4 p-6 transition-colors hover:bg-[#f6f6f4]">
                    <AppIcon slug={app.slug} name={app.name} size={56} lang={lang} />
                    <span>
                      <span className="display block text-xl">{app.name}</span>
                      <span className="mt-1 block text-sm text-muted">{app.kind}</span>
                    </span>
                    <span className="hud mt-auto flex items-center gap-1 text-foreground">
                      {t.open} <ArrowUpRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <p className="text-[15px] leading-relaxed text-muted">
                <span className="text-foreground">{t.first}</span> {t.firstText}
              </p>
              <p className="text-[15px] leading-relaxed text-muted">
                <span className="text-foreground">{t.desktop}</span> {t.desktopText}
              </p>
              <p className="text-[15px] leading-relaxed text-muted">
                <span className="text-foreground">{t.all}</span> {t.allText(planText("lifetime", lang).label)}{" "}
                <Link href={href(lang, "/#preise")} className="text-foreground underline underline-offset-4">
                  {t.prices}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  );
}
