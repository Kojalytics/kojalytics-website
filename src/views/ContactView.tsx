import { Mail, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionBar from "@/components/instrument/SectionBar";
import ContactForm from "@/app/kontakt/ContactForm";
import type { Lang } from "@/lib/i18n";

const pad = "px-5 md:px-10";
const two = (n: number) => String(n).padStart(2, "0");

const de = {
  label: "Kontakt",
  meta: "Fragen zu Koja Office",
  title: (
    <>
      Fragen zu <span className="text-highlight">Koja Office</span>?
    </>
  ),
  lead: "Vor dem Kauf, bei der Installation oder zur Lizenz: Schreib uns. Es antworten die Menschen, die Koja Office entwickeln.",
  mail: "E-Mail",
  place: "Standort",
  country: "Deutschland",
  nextTitle: "Was du bekommst",
  next: ["Persönliche Antwort per E-Mail", "Hilfe bei Installation, Lizenz und Aktivierung", "Fragen vor dem Kauf beantworten wir gern"],
};

const en: typeof de = {
  label: "Contact",
  meta: "Questions about Koja Office",
  title: (
    <>
      Questions about <span className="text-highlight">Koja Office</span>?
    </>
  ),
  lead: "Before you buy, during installation or about your license: write to us. You'll hear back from the people who develop Koja Office.",
  mail: "Email",
  place: "Location",
  country: "Germany",
  nextTitle: "What you get",
  next: [
    "A personal reply by email, in English or German",
    "Help with installation, license and activation",
    "We're happy to answer questions before you buy",
  ],
};

const T = { de, en };

export default function ContactView({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <>
      <Navigation />
      <main className="pt-12">
        <section className="rail">
          <SectionBar index="01" label={t.label} meta={t.meta} />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h1 className="display rise-in max-w-3xl text-[clamp(2.1rem,5.4vw,4.6rem)]">{t.title}</h1>
            <p className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-muted [--i:1]">{t.lead}</p>
          </div>

          <div className="cells rise-in border-t border-border lg:grid-cols-[0.8fr_1.2fr] [--i:2]">
            <div className="grid content-start divide-y divide-border">
              <div className="flex items-start gap-4 p-6 md:p-8">
                <span className="icon-box shrink-0">
                  <Mail size={18} aria-hidden />
                </span>
                <div className="min-w-0">
                  <h2 className="hud">{t.mail}</h2>
                  <a
                    href="mailto:support@kojalytics.com"
                    className="-my-1.5 inline-flex min-h-11 items-center break-all text-lg font-semibold underline-offset-4 hover:text-accent hover:underline"
                  >
                    support@kojalytics.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 md:p-8">
                <span className="icon-box shrink-0">
                  <MapPin size={18} aria-hidden />
                </span>
                <div>
                  <h2 className="hud">{t.place}</h2>
                  <p className="-my-1.5 flex min-h-11 items-center text-lg font-semibold">{t.country}</p>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <h2 className="hud">{t.nextTitle}</h2>
                <ul className="mt-4 grid gap-3 text-muted">
                  {t.next.map((item, i) => (
                    <li key={item} className="flex gap-3">
                      <span className="hud mt-1 shrink-0 text-faint">{two(i + 1)}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <ContactForm lang={lang} />
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  );
}
