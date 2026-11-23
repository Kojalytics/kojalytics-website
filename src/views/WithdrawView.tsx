import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionBar from "@/components/instrument/SectionBar";
import WithdrawForm from "@/app/widerrufen/WithdrawForm";
import { href, type Lang } from "@/lib/i18n";

const link = "text-foreground underline underline-offset-4";

const de = {
  label: "Koja-Apps",
  meta: "Widerrufsfunktion · Eingangsbestätigung per E-Mail",
  title: (
    <>
      Vertrag <span className="text-highlight">widerrufen</span>
    </>
  ),
  intro: (
    <>
      Hier erklärst du den Widerruf deines Kaufs. Ob dir das Widerrufsrecht noch zusteht, steht in unserer{" "}
      <Link href="/agb#widerruf" className={link}>
        Widerrufsbelehrung
      </Link>
      . Du willst nur dein Abo beenden?{" "}
      <Link href="/kuendigen" className={link}>
        Dann kündige es hier
      </Link>
      .
    </>
  ),
};
const en: typeof de = {
  label: "Koja apps",
  meta: "Withdrawal function · Acknowledgement of receipt by email",
  title: (
    <>
      Withdraw from a <span className="text-highlight">contract</span>
    </>
  ),
  intro: (
    <>
      Use this page to withdraw from your purchase. Whether you still have the right of withdrawal is set out in our{" "}
      <Link href={href("en", "/agb#widerruf")} className={link}>
        withdrawal instructions
      </Link>
      . Only want to end your subscription?{" "}
      <Link href={href("en", "/kuendigen")} className={link}>
        Then cancel it here
      </Link>
      .
    </>
  ),
};
const T = { de, en };

/** The withdrawal function (Widerrufsfunktion, § 356a BGB): /widerrufen and /en/withdrawal. */
export default function WithdrawView({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <>
      <Navigation />
      <main className="pt-12">
        {/* 01 Withdrawal: explanation left, the form right (stacked on phones) */}
        <section className="rail">
          <SectionBar index="01" label={t.label} meta={t.meta} />
          <div className="grid gap-12 px-5 py-14 md:px-10 md:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <h1 className="display rise-in text-[clamp(2rem,4vw,3.2rem)]">{t.title}</h1>
              <p className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-muted [--i:1]">{t.intro}</p>
            </div>
            <div className="rise-in [--i:2]">
              <WithdrawForm lang={lang} />
            </div>
          </div>
        </section>
      </main>
      <Footer offer={false} lang={lang} />
    </>
  );
}
