import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Faq, { type FaqItem } from "@/components/software/Faq";
import SectionBar from "@/components/instrument/SectionBar";
import { href, type Lang } from "@/lib/i18n";

const de = {
  heroLabel: "Hilfe & Support",
  heroMeta: "Koja-Apps · AI Headshot",
  title: (
    <>
      Wie können wir <span className="text-highlight">helfen</span>?
    </>
  ),
  lead: "Antworten auf häufige Fragen zu den Koja-Apps und AI Headshot. Oder schreib uns direkt.",
  mailTitle: "E-Mail-Support",
  mailNote: "Antwort in der Regel innerhalb von 24 Stunden",
  formTitle: "Kontaktformular",
  formNote: "Für ausführliche Anfragen",
  formLink: "Zur Kontaktseite →",
  kojaLabel: "Koja-Apps",
  kojaMeta: "Lizenz · Abo · Schlüssel",
  kojaTitle: (
    <>
      Koja-<span className="text-highlight">Apps</span>
    </>
  ),
  headshotMeta: "Pakete · Erstattung · Datenschutz",
  kojaFaq: [
    {
      q: "Wie aktiviere ich meine Koja-Lizenz?",
      a: "Starte den Kojalytics Launcher, öffne Einstellungen › Lizenz, füge deinen Schlüssel aus der Kauf-E-Mail ein und klicke auf „Aktivieren“. Eine Lizenz gilt für bis zu 3 Geräte, Mac und Windows-PC gemischt.",
    },
    {
      q: "Windows zeigt bei der Installation eine Warnung. Was tun?",
      a: "Das ist bei neuen Programmen normal: Der Launcher ist signiert, Windows kennt ihn nur noch nicht oft genug. Unsere [Anleitung für Windows](/support/windows-installation) zeigt dir jeden Schritt und wie du prüfst, dass die Datei echt ist.",
    },
    {
      q: "Wie kündige ich mein Koja-Abo?",
      a: "Unter [Verträge hier kündigen](/kuendigen), ohne Login und ohne Gebühr. Das Abo endet zum Ende des bezahlten Monats, die Bestätigung kommt sofort per E-Mail.",
    },
    {
      q: "Ich habe meinen Lizenzschlüssel verloren.",
      a: "Schreib an support@kojalytics.com mit der E-Mail-Adresse, mit der du bezahlt hast. Wir schicken dir den Schlüssel erneut.",
    },
  ] as FaqItem[],
  headshotFaq: [
    {
      q: "Wie funktioniert AI Headshot?",
      a: "Du wählst bis zu 5 Fotos von dir aus, und unsere KI erstellt daraus professionelle Porträts in verschiedenen Stilen. Das dauert nur wenige Minuten. Du bekommst hochauflösende Bilder für LinkedIn, Lebenslauf oder Social Media.",
    },
    {
      q: "Welche Pakete gibt es?",
      a: "Starter (9,99 €) mit 12 KI-Porträts und Premium (19,99 €) mit 24 Porträts und mehr Stilen. Beides sind Einmalkäufe, kein Abo.",
    },
    {
      q: "Kann ich mein Geld zurückbekommen?",
      a: "Käufe in der App laufen über Apple, deshalb erstattet auch Apple: Fordere die Erstattung unter reportaproblem.apple.com an. Wenn du mit deinen Porträts nicht zufrieden bist, schreib uns außerdem an support@kojalytics.com, wir helfen dir gern weiter.",
    },
    {
      q: "Sind meine Fotos sicher?",
      a: "Deine Fotos werden verschlüsselt übertragen und nur zur Erstellung deiner Porträts an unseren KI-Dienstleister Google (Gemini API) übermittelt, und zwar erst, nachdem du in der App eingewilligt hast. Nach der Erstellung werden sie auf unserem Server und bei Google gelöscht. Wir verkaufen deine Fotos nicht und nutzen sie nicht zum Training. Mehr dazu in der [Datenschutzerklärung](/datenschutz#ai-headshot).",
    },
    {
      q: "Auf welchen Geräten läuft AI Headshot?",
      a: "AI Headshot gibt es für das iPhone (ab iOS 17). iPad und Android sind in Planung.",
    },
    {
      q: "Brauche ich ein Konto, und wie lösche ich meine Daten?",
      a: "AI Headshot funktioniert ohne Konto, es gibt also keins zu löschen. Deine Fotos werden nach der Erstellung der Porträts automatisch von unserem Server gelöscht. Porträts, Tresor-Einträge und Einstellungen auf deinem iPhone löschst du in der App unter Einstellungen › „Alle meine Daten löschen“. Bei Fragen zu deinen Daten schreib an support@kojalytics.com.",
    },
  ] as FaqItem[],
};

const en: typeof de = {
  heroLabel: "Help & support",
  heroMeta: "Koja apps · AI Headshot",
  title: (
    <>
      How can we <span className="text-highlight">help</span>?
    </>
  ),
  lead: "Answers to common questions about the Koja apps and AI Headshot. Or write to us directly.",
  mailTitle: "Email support",
  mailNote: "We usually reply within 24 hours, in English or German",
  formTitle: "Contact form",
  formNote: "For detailed questions",
  formLink: "Go to the contact page →",
  kojaLabel: "Koja apps",
  kojaMeta: "License · Subscription · Key",
  kojaTitle: (
    <>
      Koja <span className="text-highlight">apps</span>
    </>
  ),
  headshotMeta: "Packages · Refunds · Privacy",
  kojaFaq: [
    {
      q: "How do I activate my Koja license?",
      a: "Open the Kojalytics Launcher, go to Settings › License, paste the key from your purchase email and click “Activate”. One license covers up to 3 devices, any mix of Mac and Windows PC.",
    },
    {
      q: "Windows shows a warning during installation. What should I do?",
      a: `That's normal for new programs: the launcher is signed, but Windows hasn't seen it often enough yet. Our [Windows guide](${href("en", "/support/windows-installation")}) shows you every step and how to check that the file is genuine.`,
    },
    {
      q: "How do I cancel my Koja subscription?",
      a: `At [Cancel contracts here](${href("en", "/kuendigen")}), with no login and no fee. The subscription ends at the end of the paid month, and the confirmation arrives by email right away.`,
    },
    {
      q: "I've lost my license key.",
      a: "Write to support@kojalytics.com and include the email address you paid with. We'll send you the key again.",
    },
  ],
  headshotFaq: [
    {
      q: "How does AI Headshot work?",
      a: "You choose up to 5 photos of yourself, and our AI turns them into professional portraits in different styles. It only takes a few minutes. You get high-resolution images for LinkedIn, your CV or social media.",
    },
    {
      q: "Which packages are there?",
      a: "Starter (€9.99) with 12 AI portraits and Premium (€19.99) with 24 portraits and more styles. Both are one-time purchases, no subscription.",
    },
    {
      q: "Can I get my money back?",
      a: "Purchases in the app go through Apple, so Apple handles refunds: request one at reportaproblem.apple.com. If you're not happy with your portraits, please also write to us at support@kojalytics.com, and we'll be glad to help.",
    },
    {
      q: "Are my photos safe?",
      a: `Your photos are transferred encrypted and sent to our AI provider Google (Gemini API) only to create your portraits, and only after you have given your consent in the app. Once the portraits are created, the photos are deleted from our server and at Google. We don't sell your photos and don't use them for training. More in the [privacy policy](${href("en", "/datenschutz#ai-headshot")}).`,
    },
    {
      q: "Which devices does AI Headshot run on?",
      a: "AI Headshot is available for iPhone (iOS 17 or later). iPad and Android are planned.",
    },
    {
      q: "Do I need an account, and how do I delete my data?",
      a: "AI Headshot works without an account, so there's none to delete. Your photos are deleted from our server automatically once the portraits are created. You delete portraits, Vault entries and settings on your iPhone in the app under Settings › “Delete all my data”. For questions about your data, write to support@kojalytics.com.",
    },
  ],
};

const T = { de, en };

const pad = "px-5 md:px-10";

export default function SupportView({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <>
      <Navigation />
      <main className="pt-12">
        {/* 01 Hero + contact options */}
        <section className="rail">
          <SectionBar index="01" label={t.heroLabel} meta={t.heroMeta} />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h1 className="display rise-in max-w-4xl text-[clamp(2.1rem,5.4vw,4.6rem)]">{t.title}</h1>
            <p className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-muted [--i:1]">{t.lead}</p>
          </div>

          <div className="cells rise-in border-t border-border md:grid-cols-2 [--i:2]">
            <div className="flex items-start gap-4 p-6 md:p-8">
              <span className="icon-box shrink-0">
                <Mail size={18} aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 className="hud">{t.mailTitle}</h2>
                <p className="mt-2 text-sm text-muted">{t.mailNote}</p>
                <p className="mt-3 select-all break-all text-lg font-semibold">support@kojalytics.com</p>
              </div>
            </div>
            <Link href={href(lang, "/kontakt")} className="group flex items-start gap-4 p-6 transition-colors hover:bg-surface md:p-8">
              <span className="icon-box shrink-0">
                <MessageCircle size={18} aria-hidden />
              </span>
              <div>
                <h2 className="hud">{t.formTitle}</h2>
                <p className="mt-2 text-sm text-muted">{t.formNote}</p>
                <p className="mt-3 text-lg font-semibold group-hover:text-accent">{t.formLink}</p>
              </div>
            </Link>
          </div>
        </section>

        {/* 02 Koja-Apps */}
        <section className="rail crosshairs">
          <SectionBar index="02" label={t.kojaLabel} meta={t.kojaMeta} />
          <div className={`grid gap-10 py-14 md:py-20 lg:grid-cols-[0.8fr_1.2fr] ${pad}`}>
            <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              {t.kojaTitle}
            </h2>
            <Faq items={t.kojaFaq} />
          </div>
        </section>

        {/* 03 AI Headshot */}
        <section className="rail crosshairs">
          <SectionBar index="03" label="AI Headshot" meta={t.headshotMeta} />
          <div className={`grid gap-10 py-14 md:py-20 lg:grid-cols-[0.8fr_1.2fr] ${pad}`}>
            <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              AI <span className="text-highlight">Headshot</span>
            </h2>
            <Faq items={t.headshotFaq} />
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  );
}
