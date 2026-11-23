import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionBar from "@/components/instrument/SectionBar";
import CancelForm from "@/app/kuendigen/CancelForm";
import type { Lang } from "@/lib/i18n";

const de = {
  label: "Koja-Apps-Abo",
  meta: "Ohne Login · ohne Gebühr · Bestätigung per E-Mail",
  title: (
    <>
      Verträge hier <span className="text-highlight">kündigen</span>
    </>
  ),
  intro:
    "Ohne Login und ohne Gebühr: Gib deinen Namen und die E-Mail-Adresse deines Abos ein und klicke auf „Jetzt kündigen“. Dein Abo endet zum Ende des Monats, den du schon bezahlt hast, und du bekommst sofort eine Eingangsbestätigung per E-Mail.",
};
const en: typeof de = {
  label: "Koja apps subscription",
  meta: "No login · no fee · confirmation by email",
  title: (
    <>
      <span className="text-highlight">Cancel</span> contracts here
    </>
  ),
  intro:
    "No login and no fee: enter your name and the email address of your subscription and click “Cancel now”. Your subscription ends at the end of the month you have already paid for, and you immediately receive an acknowledgement of receipt by email.",
};
const T = { de, en };

/** The cancellation page behind the Kündigungsbutton (§ 312k BGB): /kuendigen and /en/cancel. */
export default function CancelView({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <>
      <Navigation />
      <main className="pt-12">
        {/* 01 Cancellation: explanation left, the form right (stacked on phones) */}
        <section className="rail">
          <SectionBar index="01" label={t.label} meta={t.meta} />
          <div className="grid gap-12 px-5 py-14 md:px-10 md:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <h1 className="display rise-in text-[clamp(2rem,4vw,3.2rem)]">{t.title}</h1>
              <p className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-muted [--i:1]">{t.intro}</p>
            </div>
            <div className="rise-in [--i:2]">
              <CancelForm lang={lang} />
            </div>
          </div>
        </section>
      </main>
      <Footer offer={false} lang={lang} />
    </>
  );
}
