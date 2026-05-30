import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — Copy Paste Pro",
  description:
    "Datenschutzerklärung für die iOS-App Copy Paste Pro von Kojalytics. Alle Daten bleiben lokal auf deinem Gerät — kein Tracking, keine Werbung.",
  alternates: {
    canonical: "https://kojalytics.com/copypastepro/de/datenschutz",
    languages: {
      de: "https://kojalytics.com/copypastepro/de/datenschutz",
      en: "https://kojalytics.com/copypastepro/en/privacy",
      fr: "https://kojalytics.com/copypastepro/fr/confidentialite",
      es: "https://kojalytics.com/copypastepro/es/privacidad",
      nl: "https://kojalytics.com/copypastepro/nl/privacy",
    },
  },
};

export default function CopyPasteProDatenschutzPage() {
  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent-light text-sm font-medium tracking-wide uppercase mb-3">
            Copy Paste Pro
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Datenschutzerklärung
          </h1>
          <p className="text-muted text-sm mb-10">
            Zuletzt aktualisiert: 30. Mai 2026
          </p>

          <div className="glass-card rounded-2xl p-10 space-y-10">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-5">
              <p className="text-accent-light font-medium text-sm leading-relaxed">
                Copy Paste Pro speichert deine Daten ausschließlich lokal auf
                deinem iPhone. Keine Server-Übertragung, keine Analytics, kein
                Tracking, keine Werbung.
              </p>
            </div>

            <Section title="1. Verantwortlicher">
              <p className="text-muted leading-relaxed">
                Kojalytics
                <br />
                E-Mail:{" "}
                <a
                  href="mailto:support@kojalytics.com"
                  className="text-accent-light hover:underline"
                >
                  support@kojalytics.com
                </a>
                <br />
                Website:{" "}
                <a
                  href="https://kojalytics.com"
                  className="text-accent-light hover:underline"
                >
                  kojalytics.com
                </a>
              </p>
            </Section>

            <Section title="2. Was macht Copy Paste Pro?">
              <p className="text-muted leading-relaxed">
                Copy Paste Pro ist ein Zwischenablage-Manager mit eigener
                iOS-Tastatur in 12 Sprachen, integrierter Übersetzungsfunktion
                via Apple Translation, Kalender-Anbindung und KI-gestützter
                Autokorrektur. Alle Verarbeitung läuft lokal auf dem Gerät.
              </p>
            </Section>

            <Section title="3. Welche Daten werden lokal verarbeitet?">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">
                    Zwischenablage-Verlauf:
                  </strong>{" "}
                  Texte, URLs und Adressen, die du kopierst, werden in einer
                  lokalen Historie auf dem Gerät gespeichert.
                </li>
                <li>
                  <strong className="text-foreground">
                    Persönliches Wörterbuch:
                  </strong>{" "}
                  Häufig genutzte Wörter werden lokal gelernt, um die
                  Autokorrektur zu verbessern.
                </li>
                <li>
                  <strong className="text-foreground">App-Einstellungen:</strong>{" "}
                  Sprachwahl, Onboarding-Status, gewählte Pläne.
                </li>
              </ul>
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-5 mt-4">
                <p className="text-accent-light font-medium text-sm leading-relaxed">
                  Wichtig: Alle Daten verbleiben ausschließlich auf deinem
                  iPhone. Keine Übertragung an unsere oder fremde Server.
                </p>
              </div>
            </Section>

            <Section title="4. Was wird NICHT erfasst?">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>Keine Nutzerkonten oder Registrierung</li>
                <li>Keine E-Mail-Adressen, Namen, Telefonnummern</li>
                <li>Keine Standortdaten</li>
                <li>
                  Keine Tastatureingaben (Keylogging findet ausdrücklich NICHT
                  statt)
                </li>
                <li>
                  Keine Analyse-Tools (kein Google Analytics, Firebase,
                  Clarity etc.)
                </li>
                <li>Keine Werbung, keine Werbenetzwerke</li>
                <li>Keine Weitergabe an Dritte</li>
              </ul>
            </Section>

            <Section title="5. Tastatur-Erweiterung & Voller Zugriff">
              <p className="text-muted leading-relaxed mb-3">
                Die Tastatur ist eine iOS Custom Keyboard Extension. Damit sie
                auf den Clipboard-Verlauf zugreifen kann, musst du in den
                iOS-Einstellungen{" "}
                <strong className="text-foreground">
                  „Vollen Zugriff erlauben"
                </strong>{" "}
                aktivieren.
              </p>
              <p className="text-muted leading-relaxed mb-3 font-medium text-foreground text-sm">
                Wofür wird Voller Zugriff genutzt?
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Um den lokalen Clipboard-Verlauf zwischen App und Tastatur
                  über iOS App Groups zu teilen.
                </li>
                <li>
                  Um beim Antippen des Clipboard-Icons in der Tastatur die
                  Zwischenablage zu lesen und den Verlauf zu aktualisieren.
                </li>
                <li>
                  Für den Übersetzungs-Roundtrip an die Host-App (Apple
                  Translation Framework läuft nur in der Host-App).
                </li>
              </ul>
              <p className="text-muted leading-relaxed mt-3">
                Voller Zugriff wird{" "}
                <strong className="text-foreground">ausschließlich lokal</strong>{" "}
                genutzt. Die Tastatur sendet keinerlei Daten an externe Server.
                Du kannst Vollen Zugriff jederzeit in den iOS-Einstellungen
                widerrufen.
              </p>
            </Section>

            <Section title="6. iCloud (CloudKit) — nur für Promo-Codes">
              <p className="text-muted leading-relaxed mb-3">
                Falls du einen Promo-Code einlöst, nutzen wir Apples CloudKit
                Public Database zur einmaligen Aktivierung. Dabei werden
                gespeichert:
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Ein anonymer Geräte-Identifier (zufällige UUID — keine
                  Apple-ID, kein Name)
                </li>
                <li>
                  Ein Hash des Codes (SHA-256), um doppelte Einlösung zu
                  verhindern
                </li>
              </ul>
              <p className="text-muted leading-relaxed mt-3">
                Diese Daten liegen in deinem eigenen iCloud-Bereich unter Apples
                Verantwortung. Wir können sie auf Anfrage löschen lassen — siehe
                Kontakt unten.
              </p>
            </Section>

            <Section title="7. Apple Translation Framework">
              <p className="text-muted leading-relaxed">
                Übersetzungen werden über das Apple Translation Framework
                durchgeführt. Apple verarbeitet Texte on-device oder über eigene
                Server — siehe Apples Datenschutzerklärung. Wir senden keine
                Texte an eigene oder Dritt-Server.
              </p>
            </Section>

            <Section title="8. Kalender">
              <p className="text-muted leading-relaxed">
                Wenn du Kalender-Zugriff erlaubst, werden Termine ausschließlich
                in der App angezeigt. Es findet keine Übertragung statt.
              </p>
            </Section>

            <Section title="9. In-App-Käufe">
              <p className="text-muted leading-relaxed">
                Käufe werden über Apple StoreKit 2 abgewickelt. Wir erhalten
                keine Zahlungsinformationen. Es gilt Apples Datenschutzerklärung.
              </p>
            </Section>

            <Section title="10. Deine Rechte (DSGVO)">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">Auskunft:</strong> Da wir
                  keine personenbezogenen Daten erheben, haben wir keinen Zugriff
                  auf deine Daten.
                </li>
                <li>
                  <strong className="text-foreground">Löschung lokal:</strong>{" "}
                  Deinstalliere die App — alle lokalen Daten werden von iOS
                  gelöscht.
                </li>
                <li>
                  <strong className="text-foreground">
                    Löschung CloudKit-Promo-Daten:
                  </strong>{" "}
                  Schreibe an support@kojalytics.com mit Betreff „CloudKit-
                  Löschung Copy Paste Pro".
                </li>
              </ul>
            </Section>

            <Section title="11. Kinder">
              <p className="text-muted leading-relaxed">
                Copy Paste Pro richtet sich nicht an Kinder unter 16 Jahren. Da
                keine personenbezogenen Daten erhoben werden, ist die Nutzung
                jedoch unbedenklich.
              </p>
            </Section>

            <Section title="12. Änderungen">
              <p className="text-muted leading-relaxed">
                Wir können diese Erklärung bei Bedarf aktualisieren. Die jeweils
                aktuelle Version ist stets unter dieser URL abrufbar.
              </p>
            </Section>

            <Section title="13. Kontakt">
              <p className="text-muted leading-relaxed">
                Bei Fragen zum Datenschutz:{" "}
                <a
                  href="mailto:support@kojalytics.com"
                  className="text-accent-light hover:underline"
                >
                  support@kojalytics.com
                </a>
              </p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {children}
    </section>
  );
}
