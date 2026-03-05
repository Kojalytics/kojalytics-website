import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — Kojalytics",
  description: "Datenschutzerklärung für PortraitPro AI und die Dienste von Kojalytics.",
};

export default function DatenschutzPage() {
  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent-light text-sm font-medium tracking-wide uppercase mb-3">
            PortraitPro AI
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Datenschutzerklärung
          </h1>
          <p className="text-muted text-sm mb-10">
            Zuletzt aktualisiert: 5. März 2025
          </p>

          <div className="glass-card rounded-2xl p-10 space-y-10">
            {/* Highlight box */}
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-5">
              <p className="text-accent-light font-medium text-sm leading-relaxed">
                PortraitPro AI erfasst keine persönlichen Daten, erstellt keine
                Nutzerprofile und verwendet keinerlei Tracking oder
                Analyse-Tools.
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

            <Section title="2. Welche Daten werden verarbeitet?">
              <p className="text-muted leading-relaxed mb-3">
                PortraitPro AI verarbeitet ausschließlich die Daten, die für die
                Erstellung von KI-generierten Portraits notwendig sind:
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">Referenzfotos:</strong> Die
                  von Ihnen ausgewählten Fotos (max. 5) werden zur Erstellung
                  der Portraits an unseren Server übermittelt.
                </li>
                <li>
                  <strong className="text-foreground">
                    Portrait-Einstellungen:
                  </strong>{" "}
                  Ihre gewählten Stil-Optionen (z.B. Stil, Bildausschnitt,
                  Hintergrund).
                </li>
                <li>
                  <strong className="text-foreground">Kaufdaten:</strong>{" "}
                  Transaktions-IDs für In-App-Käufe werden lokal auf Ihrem Gerät
                  gespeichert. Die Zahlungsabwicklung erfolgt ausschließlich
                  durch Apple.
                </li>
              </ul>
            </Section>

            <Section title="3. Was wird NICHT erfasst?">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>Keine Nutzerkonten oder Registrierung erforderlich</li>
                <li>Keine E-Mail-Adressen, Namen oder Telefonnummern</li>
                <li>Keine Standortdaten</li>
                <li>
                  Keine Analyse- oder Tracking-Tools (kein Google Analytics,
                  Firebase etc.)
                </li>
                <li>Keine Werbung oder Werbenetzwerke</li>
                <li>
                  Keine Weitergabe von Daten an Dritte zu Marketingzwecken
                </li>
              </ul>
            </Section>

            <Section title="4. Wie werden Ihre Fotos verarbeitet?">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Die Fotos werden verschlüsselt (HTTPS) an unseren Server
                  übermittelt.
                </li>
                <li>
                  Zur Bildgenerierung wird die{" "}
                  <strong className="text-foreground">Google Gemini API</strong>{" "}
                  verwendet. Google verarbeitet die Bilder gemäß der{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-light hover:underline"
                  >
                    Google-Datenschutzrichtlinie
                  </a>
                  .
                </li>
                <li>
                  Nach Abschluss der Generierung werden die Referenzfotos vom
                  Server gelöscht.
                </li>
                <li>
                  Die generierten Portraits werden über zeitlich begrenzte,
                  signierte URLs (1 Stunde Gültigkeit) bereitgestellt.
                </li>
              </ul>
            </Section>

            <Section title="5. Datenspeicherung">
              <p className="text-muted leading-relaxed mb-3 font-medium text-foreground text-sm">
                Auf Ihrem Gerät (lokal):
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed mb-4">
                <li>
                  Generierte Portraits und Vorschaubilder im App-Speicher
                </li>
                <li>
                  Kaufbelege und Einstellungen im verschlüsselten
                  iOS-Schlüsselbund (Keychain)
                </li>
                <li>
                  Vault-Daten mit automatischem Ablauf (24 Stunden bis 30 Tage
                  je nach Paket)
                </li>
              </ul>
              <p className="text-muted leading-relaxed mb-3 font-medium text-foreground text-sm">
                Auf unserem Server:
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Referenzfotos werden nach der Verarbeitung gelöscht
                </li>
                <li>
                  Generierte Portraits werden temporär gespeichert und sind nur
                  über zeitlich begrenzte URLs abrufbar
                </li>
                <li>
                  Auftrags-Metadaten (Status, Zeitstempel) werden gespeichert —
                  ohne Personenbezug
                </li>
              </ul>
            </Section>

            <Section title="6. Drittanbieter">
              <ul className="text-muted space-y-3 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">Google Gemini API:</strong>{" "}
                  Zur KI-basierten Bildgenerierung. Verarbeitung gemäß der{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-light hover:underline"
                  >
                    Google-Datenschutzrichtlinie
                  </a>
                  .
                </li>
                <li>
                  <strong className="text-foreground">Supabase:</strong>{" "}
                  Backend-Infrastruktur für sichere Datenverarbeitung und
                  -speicherung.
                </li>
                <li>
                  <strong className="text-foreground">Apple StoreKit:</strong>{" "}
                  Für In-App-Käufe. Apple verarbeitet Zahlungsdaten gemäß der{" "}
                  <a
                    href="https://www.apple.com/legal/privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-light hover:underline"
                  >
                    Apple-Datenschutzrichtlinie
                  </a>
                  .
                </li>
              </ul>
            </Section>

            <Section title="7. Datensicherheit">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Alle Datenübertragungen erfolgen verschlüsselt über HTTPS
                </li>
                <li>
                  Lokale Daten werden im iOS-Schlüsselbund verschlüsselt
                  gespeichert
                </li>
                <li>
                  Zugriff auf generierte Portraits nur über zeitlich begrenzte,
                  signierte URLs
                </li>
                <li>
                  Sicherheit durch eindeutige, nicht erratbare Auftrags-IDs
                </li>
              </ul>
            </Section>

            <Section title="8. Ihre Rechte (DSGVO)">
              <p className="text-muted leading-relaxed mb-3">
                Als Nutzer:in innerhalb der EU haben Sie folgende Rechte:
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">Auskunft:</strong> Sie
                  können erfragen, welche Daten über Sie gespeichert sind.
                </li>
                <li>
                  <strong className="text-foreground">Löschung:</strong> Sie
                  können die Löschung Ihrer Daten verlangen.
                </li>
                <li>
                  <strong className="text-foreground">Widerspruch:</strong> Sie
                  können der Verarbeitung Ihrer Daten widersprechen.
                </li>
                <li>
                  <strong className="text-foreground">
                    Datenübertragbarkeit:
                  </strong>{" "}
                  Sie können die Herausgabe Ihrer Daten in einem gängigen Format
                  verlangen.
                </li>
              </ul>
              <p className="text-muted leading-relaxed mt-3">
                Da die App keine Nutzerkonten verwendet, werden keine
                personenbezogenen Daten dauerhaft gespeichert. Bei Fragen oder
                zur Ausübung Ihrer Rechte kontaktieren Sie uns unter{" "}
                <a
                  href="mailto:support@kojalytics.com"
                  className="text-accent-light hover:underline"
                >
                  support@kojalytics.com
                </a>
                .
              </p>
            </Section>

            <Section title="9. Geräteberechtigungen">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">
                    Fotobibliothek (Lesen):
                  </strong>{" "}
                  Zum Auswählen von Referenzfotos für die Portrait-Erstellung.
                </li>
                <li>
                  <strong className="text-foreground">
                    Fotobibliothek (Schreiben):
                  </strong>{" "}
                  Zum Speichern generierter Portraits in Ihrer Fotobibliothek.
                </li>
              </ul>
              <p className="text-muted leading-relaxed mt-3">
                Es werden keine weiteren Berechtigungen benötigt (kein Kamera-,
                Mikrofon-, Standort- oder Kontaktzugriff).
              </p>
            </Section>

            <Section title="10. Kinder">
              <p className="text-muted leading-relaxed">
                PortraitPro AI richtet sich nicht an Kinder unter 16 Jahren. Wir
                erheben wissentlich keine Daten von Kindern.
              </p>
            </Section>

            <Section title="11. Änderungen dieser Datenschutzerklärung">
              <p className="text-muted leading-relaxed">
                Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf zu
                aktualisieren. Die aktuelle Version ist stets unter dieser URL
                abrufbar.
              </p>
            </Section>

            <Section title="12. Kontakt">
              <p className="text-muted leading-relaxed">
                Bei Fragen zum Datenschutz erreichen Sie uns unter:{" "}
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
