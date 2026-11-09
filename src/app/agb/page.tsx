import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionBar from "@/components/instrument/SectionBar";
import { PLANS, TRIAL_DAYS } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "AGB für die Koja-Apps",
  description: "Allgemeine Geschäftsbedingungen für die Koja-Apps: Monatsabo, dauerhafte Lizenz, Kündigung und Widerrufsrecht.",
  alternates: { canonical: "/agb" },
  robots: { index: false },
};

const PROVIDER = "Farzad Khojazada, Kojalytics, Am Diggen 40i, 21077 Hamburg, Deutschland, E-Mail: support@kojalytics.com";

const pad = "px-5 md:px-10";

export default function TermsPage() {
  const preview = process.env.VERCEL_ENV !== "production";
  return (
    <>
      <Navigation />
      <main className="pt-12">
        {/* 01 Title */}
        <section className="rail">
          <SectionBar index="01" label="Rechtliches" meta="AGB · Widerrufsbelehrung · Muster-Widerrufsformular" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h1 className="display rise-in text-[clamp(2rem,4vw,3.2rem)]">
              AGB für die <span className="text-highlight">Koja-Apps</span>
            </h1>
            <p className="hud rise-in mt-5 [--i:1]">Stand: 7. November 2026</p>
            {preview && (
              <p className="rise-in mt-8 max-w-3xl border border-dashed border-accent p-4 text-sm text-accent [--i:2]">
                [Nur in der Vorschau sichtbar] Vor dem Livegang von einem Anwalt prüfen lassen.
              </p>
            )}
          </div>
        </section>

        {/* 02 Sections 1 to 8 */}
        <section className="rail crosshairs">
          <SectionBar index="02" label="Bedingungen" meta="Abschnitte 1–8" />
          <div className="divide-y divide-border">
            <Section title="1. Geltungsbereich und Anbieter">
              <P>
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge über die Koja-Apps, die du über
                kojalytics.com abschließt. Dein Vertragspartner ist:
              </P>
              <P>
                Farzad Khojazada, Kojalytics (Einzelunternehmen)
                <br />
                Am Diggen 40i, 21077 Hamburg, Deutschland
                <br />
                E-Mail: support@kojalytics.com
              </P>
              <P>
                Verbraucher ist jede natürliche Person, die einen Vertrag überwiegend weder für ihre gewerbliche noch für ihre
                selbständige berufliche Tätigkeit abschließt (§ 13 BGB).
              </P>
            </Section>

            <Section title="2. Leistungen">
              <P>
                Du erhältst das Recht, alle Koja-Apps für macOS auf bis zu 3 eigenen Macs zu nutzen. Die Lizenz wird als
                Lizenzschlüssel geliefert, den du im Kojalytics Launcher aktivierst; über den Launcher installierst du die Apps.
                Die Apps laufen nur auf dem Mac. Für Download und Aktivierung brauchst du eine Internetverbindung.
              </P>
              <P>
                Vor dem Kauf kannst du die Apps nach dem Download {TRIAL_DAYS} Tage kostenlos testen. Der Test endet automatisch
                und verursacht keine Kosten.
              </P>
              <P>
                <strong className="text-foreground">Frühe Versionen:</strong> Die Koja-Apps befinden sich in einem frühen
                Entwicklungsstadium (Alpha, einzelne Apps Pre-Alpha). Einige Funktionen fehlen noch, Fehler und Abstürze sind
                möglich, und die Apps erfüllen nicht in jeder Hinsicht die Erwartungen an fertige Software. Diese Abweichung von
                den objektiven Anforderungen an digitale Produkte (§ 327e Abs. 3 BGB) vereinbaren wir vor dem Kauf im
                Bestellvorgang ausdrücklich und gesondert mit dir (§ 327h BGB). Sichere deine Dateien deshalb regelmäßig.
              </P>
            </Section>

            <Section title="3. Vertragsschluss">
              <P>
                Die Darstellung der Koja-Apps auf kojalytics.com ist noch kein bindendes Angebot. Der Bestellvorgang läuft so ab:
              </P>
              <ol>
                <li>
                  Du wählst auf kojalytics.com das Monatsabo oder die dauerhafte Lizenz und bestätigst zwei Punkte: dass dir der
                  Entwicklungsstand der Apps bekannt ist (Abschnitt 2) und dass wir sofort mit der Ausführung des Vertrags
                  beginnen sollen (Abschnitt 9).
                </li>
                <li>
                  Du wirst zu Stripe Checkout weitergeleitet, der Bezahlseite unseres Zahlungsdienstleisters Stripe. Dort gibst
                  du deine E-Mail-Adresse und deine Zahlungsdaten ein und siehst eine Übersicht mit Produkt und Preis.
                </li>
                <li>
                  Mit Klick auf den Bezahl-Button gibst du ein verbindliches Angebot zum Abschluss des Vertrags ab.
                </li>
                <li>
                  Der Vertrag kommt zustande, sobald die Zahlung bestätigt ist und wir dir deinen Lizenzschlüssel bereitstellen:
                  auf der Bestätigungsseite und per E-Mail.
                </li>
              </ol>
              <P>
                <strong className="text-foreground">Eingabefehler korrigieren:</strong> Bis zum Klick auf den Bezahl-Button
                kannst du alle Eingaben im Stripe Checkout prüfen und ändern. Über den Zurück-Link im Checkout kehrst du zur
                Preisübersicht zurück und kannst deine Auswahl ändern oder den Kauf abbrechen.
              </P>
              <P>
                <strong className="text-foreground">Vertragstext:</strong> Wir speichern deine Bestelldaten. Die
                Vertragsbestätigung mit deinem Lizenzschlüssel und den wesentlichen Vertragsdaten senden wir dir per E-Mail.
                Diese AGB kannst du jederzeit auf dieser Seite abrufen, ausdrucken oder speichern.
              </P>
              <P>
                <strong className="text-foreground">Vertragssprache</strong> ist Deutsch.
              </P>
            </Section>

            <Section title="4. Preise und Zahlung">
              <P>
                Alle Preise sind Endpreise inklusive Mehrwertsteuer. Du zahlst über Stripe per Kredit- oder Debitkarte oder mit
                einer anderen im Stripe Checkout angezeigten Zahlungsart. Das Monatsabo wird ab dem Kauf monatlich im Voraus abgerechnet, die dauerhafte
                Lizenz einmalig beim Kauf.
              </P>
            </Section>

            <Section title="5. Monatsabo: Laufzeit und Kündigung">
              <P>
                Das Monatsabo kostet {PLANS.monthly.label} pro Monat. Es läuft jeweils einen Monat und verlängert sich
                automatisch um einen weiteren Monat, wenn du nicht kündigst.
              </P>
              <P>
                Du kannst jederzeit ohne Gebühr zum Ende des bezahlten Monats kündigen: über den Button{" "}
                <Link href="/kuendigen">
                  „Verträge hier kündigen“
                </Link>{" "}
                (kojalytics.com/kuendigen) oder per E-Mail an support@kojalytics.com. Wir bestätigen dir die
                Kündigung per E-Mail. Dein Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
              </P>
              <P>Mit dem Ende des Abos endet dein Nutzungsrecht, und wir sperren deinen Lizenzschlüssel.</P>
            </Section>

            <Section title="6. Dauerhafte Lizenz">
              <P>
                Die dauerhafte Lizenz kostet einmalig {PLANS.lifetime.label}. Sie hat kein Ablaufdatum und verlängert sich
                nicht; weitere Zahlungen fallen nicht an.
              </P>
            </Section>

            <Section title="7. Gewährleistung und Aktualisierungen">
              <P>
                Es gelten die gesetzlichen Mängelrechte für digitale Produkte (§§ 327 ff. BGB), unter Berücksichtigung des in
                Abschnitt 2 vereinbarten Entwicklungsstands.
              </P>
              <P>
                Wir stellen dir Aktualisierungen bereit, einschließlich Sicherheitsaktualisierungen, die für den Erhalt der
                Vertragsmäßigkeit erforderlich sind (§ 327f BGB): beim Monatsabo während der gesamten Laufzeit, bei der dauerhaften
                Lizenz für den Zeitraum, den du nach Art und Zweck der Apps und den Umständen des Vertrags erwarten kannst.
                Aktualisierungen erhältst du über den Kojalytics Launcher. Installierst du eine Aktualisierung nicht innerhalb
                einer angemessenen Frist, obwohl wir dich über sie und die Folgen einer unterlassenen Installation informiert
                haben, haften wir nicht für einen Mangel, der allein darauf beruht (§ 327f Abs. 2 BGB).
              </P>
            </Section>

            <Section title="8. Haftung">
              <P>
                Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei Verletzung von Leben, Körper oder Gesundheit,
                nach dem Produkthaftungsgesetz und soweit wir eine Garantie übernommen haben. Bei leichter Fahrlässigkeit haften
                wir nur bei Verletzung einer wesentlichen Vertragspflicht, also einer Pflicht, deren Erfüllung die
                ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht und auf deren Einhaltung du regelmäßig
                vertrauen darfst. In diesem Fall ist die Haftung auf den vorhersehbaren, vertragstypischen Schaden begrenzt.
              </P>
              <P>
                Bei Datenverlust haften wir nur für den Aufwand, der auch bei regelmäßiger, dem Risiko angemessener
                Datensicherung entstanden wäre. Die gesetzlichen Mängelrechte (Abschnitt 7) bleiben unberührt.
              </P>
            </Section>
          </div>
        </section>

        {/* 03 Withdrawal instructions */}
        <section id="widerruf" className="rail crosshairs scroll-mt-12">
          <SectionBar index="03" label="Widerrufsbelehrung" meta="Abschnitt 9" />
          <Section title="9. Widerrufsbelehrung">
            <P>Verbrauchern steht ein Widerrufsrecht nach folgender Maßgabe zu.</P>

            <h3>Widerrufsrecht</h3>
            <P>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</P>
            <P>Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.</P>
            <P>
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns ({PROVIDER}) mittels einer eindeutigen Erklärung (z. B. ein mit
              der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie
              können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist. Sie können
              den Widerruf auch über die Widerrufsfunktion auf unserer Website erklären:{" "}
              <Link href="/widerrufen">
                „Vertrag widerrufen“
              </Link>{" "}
              (kojalytics.com/widerrufen).
            </P>
            <P>
              Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor
              Ablauf der Widerrufsfrist absenden.
            </P>

            <h3>Folgen des Widerrufs</h3>
            <P>
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben,
              einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine
              andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und
              spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses
              Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der
              ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart;
              in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
            </P>

            <h3>Vorzeitiges Erlöschen des Widerrufsrechts</h3>
            <P>
              Bei einem Vertrag über die Bereitstellung von digitalen Inhalten, die sich nicht auf einem körperlichen
              Datenträger befinden, erlischt Ihr Widerrufsrecht vorzeitig, wenn wir mit der Vertragserfüllung begonnen haben,
              nachdem Sie
            </P>
            <ol>
              <li>ausdrücklich zugestimmt haben, dass wir vor Ablauf der Widerrufsfrist mit der Vertragserfüllung beginnen,</li>
              <li>
                Ihre Kenntnis davon bestätigt haben, dass Sie durch Ihre Zustimmung mit Beginn der Vertragserfüllung Ihr
                Widerrufsrecht verlieren, und
              </li>
              <li>wir Ihnen eine Bestätigung nach § 312f BGB zur Verfügung gestellt haben (§ 356 Abs. 5 BGB).</li>
            </ol>
            <P>Ende der Widerrufsbelehrung</P>
          </Section>
        </section>

        {/* 04 Model withdrawal form */}
        <section className="rail crosshairs">
          <SectionBar index="04" label="Muster-Widerrufsformular" meta="Abschnitt 10" />
          <Section title="10. Muster-Widerrufsformular">
            <P>
              (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)
            </P>
            <div className="my-6 border border-border-strong p-5 sm:p-6">
              <ul className="m-0 list-none p-0">
                <li>– An {PROVIDER}:</li>
                <li>
                  – Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden
                  Waren (*)/die Erbringung der folgenden Dienstleistung (*)
                </li>
                <li>– Bestellt am (*)/erhalten am (*)</li>
                <li>– Name des/der Verbraucher(s)</li>
                <li>– Anschrift des/der Verbraucher(s)</li>
                <li>– Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)</li>
                <li>– Datum</li>
              </ul>
            </div>
            <P>(*) Unzutreffendes streichen.</P>
          </Section>
        </section>

        {/* 05 Open source and final provisions */}
        <section className="rail crosshairs">
          <SectionBar index="05" label="Schlussbestimmungen" meta="Abschnitte 11–12" />
          <div className="divide-y divide-border">
            <Section title="11. Open-Source-Software">
              <P>
                Die Koja-Apps basieren auf Open-Source-Software des ArtCraft-Teams, die unter den Lizenzen MIT und Apache-2.0
                veröffentlicht ist. Diese Lizenzen gelten für den Quellcode und bleiben von diesen AGB unberührt.
              </P>
            </Section>

            <Section title="12. Streitbeilegung und Schlussbestimmungen">
              <P>
                Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
                teilzunehmen.
              </P>
              <P>
                Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Bist du Verbraucher, gilt diese Rechtswahl nur,
                soweit dir dadurch nicht der Schutz zwingender Vorschriften des Staates entzogen wird, in dem du deinen
                gewöhnlichen Aufenthalt hast.
              </P>
            </Section>
            <div className={`grid py-8 lg:grid-cols-[17rem_minmax(0,48rem)] lg:gap-12 ${pad}`}>
              <p className="text-sm leading-relaxed text-muted lg:col-start-2">
                Fragen zu diesen AGB: support@kojalytics.com. Siehe auch{" "}
                <Link href="/impressum" className="text-foreground underline underline-offset-4">
                  Impressum
                </Link>{" "}
                und{" "}
                <Link href="/datenschutz" className="text-foreground underline underline-offset-4">
                  Datenschutz
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/** One numbered clause: title left (sticky on wide screens), text right in a readable column. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={`grid gap-4 py-10 md:py-12 lg:grid-cols-[17rem_minmax(0,48rem)] lg:gap-12 ${pad}`}>
      <h2 className="text-[1.125rem] font-semibold leading-snug lg:sticky lg:top-20 lg:self-start">{title}</h2>
      <div className="prose-de [&>:first-child]:mt-0 [&>:last-child]:mb-0">{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}
