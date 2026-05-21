import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — Clipboard",
  description:
    "Datenschutzerklärung für die Clipboard-App von Kojalytics. Alle Daten bleiben lokal auf deinem Gerät.",
};

export default function ClipboardDatenschutzPage() {
  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent-light text-sm font-medium tracking-wide uppercase mb-3">
            Clipboard
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Datenschutzerklärung
          </h1>
          <p className="text-muted text-sm mb-10">
            Zuletzt aktualisiert: 21. Mai 2026
          </p>

          <div className="glass-card rounded-2xl p-10 space-y-10">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-5">
              <p className="text-accent-light font-medium text-sm leading-relaxed">
                Clipboard speichert alle Daten ausschließlich lokal auf deinem
                iPhone. Es werden keine Daten an Server gesendet, keine
                Analytics, kein Tracking, keine Werbung.
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

            <Section title="2. Was macht die App?">
              <p className="text-muted leading-relaxed">
                Clipboard speichert eine Historie deiner kopierten Inhalte
                (Texte, Links, Adressen) und macht sie über eine eigene
                iOS-Tastatur in jeder App zugänglich. Zusätzlich bietet die
                Tastatur ein deutsches QWERTZ-Layout mit Autokorrektur.
              </p>
            </Section>

            <Section title="3. Welche Daten werden verarbeitet?">
              <p className="text-muted leading-relaxed mb-3">
                Clipboard verarbeitet ausschließlich die Inhalte, die du selbst
                kopierst:
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">
                    Zwischenablage-Inhalte:
                  </strong>{" "}
                  Texte, URLs und Adressen, die du auf deinem iPhone kopierst.
                  Diese werden in einer lokalen Historie auf dem Gerät
                  gespeichert (maximal 25 Einträge plus angeheftete Clips).
                </li>
                <li>
                  <strong className="text-foreground">App-Einstellungen:</strong>{" "}
                  Deine bevorzugten Einstellungen für die Tastatur (z.B.
                  Setup-Status).
                </li>
              </ul>
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-5 mt-4">
                <p className="text-accent-light font-medium text-sm leading-relaxed">
                  Wichtig: Alle Daten verbleiben ausschließlich auf deinem
                  iPhone. Es findet keine Übertragung an Server, Cloud-Dienste
                  oder Dritte statt.
                </p>
              </div>
            </Section>

            <Section title="4. Was wird NICHT erfasst?">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>Keine Nutzerkonten oder Registrierung erforderlich</li>
                <li>Keine E-Mail-Adressen, Namen oder Telefonnummern</li>
                <li>Keine Standortdaten</li>
                <li>Keine Tastatureingaben (Keylogging findet NICHT statt)</li>
                <li>
                  Keine Analyse- oder Tracking-Tools (kein Google Analytics,
                  Firebase, Microsoft Clarity etc.)
                </li>
                <li>Keine Werbung oder Werbenetzwerke</li>
                <li>Keine Weitergabe von Daten an Dritte</li>
                <li>Keine Server-Übertragung von Zwischenablage-Inhalten</li>
              </ul>
            </Section>

            <Section title="5. Tastatur-Erweiterung & Voller Zugriff">
              <p className="text-muted leading-relaxed mb-3">
                Die Clipboard-Tastatur ist eine iOS Custom Keyboard Extension.
                Damit sie funktioniert, musst du in den iOS-Einstellungen
                <strong className="text-foreground">
                  {" "}
                  &bdquo;Vollen Zugriff erlauben&ldquo;{" "}
                </strong>
                aktivieren.
              </p>
              <p className="text-muted leading-relaxed mb-3 font-medium text-foreground text-sm">
                Wofür wird Voller Zugriff benötigt?
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Um den lokalen Clipboard-Verlauf zwischen der App und der
                  Tastatur zu teilen (über iOS App Groups).
                </li>
                <li>
                  Um beim Antippen des Clipboard-Icons in der Tastatur die
                  Zwischenablage zu lesen und den Verlauf zu aktualisieren.
                </li>
              </ul>
              <p className="text-muted leading-relaxed mt-3">
                Voller Zugriff wird{" "}
                <strong className="text-foreground">ausschließlich lokal</strong>{" "}
                genutzt. Die Tastatur sendet keine Daten an externe Server. Du
                kannst Vollen Zugriff jederzeit in den iOS-Einstellungen
                widerrufen — die App funktioniert dann nur noch eingeschränkt.
              </p>
            </Section>

            <Section title="6. Datenspeicherung">
              <p className="text-muted leading-relaxed mb-3 font-medium text-foreground text-sm">
                Auf deinem Gerät (lokal):
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed mb-4">
                <li>
                  Clipboard-Historie in einer geschützten, app-internen
                  Datenbank (iOS App Groups UserDefaults)
                </li>
                <li>
                  App-Einstellungen (z.B. Setup-Status, angeheftete Clips)
                </li>
              </ul>
              <p className="text-muted leading-relaxed mb-3 font-medium text-foreground text-sm">
                Auf unseren Servern:
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">Nichts.</strong> Clipboard
                  hat keine Server-Infrastruktur. Alle Daten verlassen dein
                  iPhone niemals.
                </li>
              </ul>
            </Section>

            <Section title="7. Drittanbieter">
              <p className="text-muted leading-relaxed mb-3">
                Die App nutzt folgende Komponenten:
              </p>
              <ul className="text-muted space-y-3 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">KeyboardKit:</strong> Eine
                  Open-Source Swift-Bibliothek zum Aufbau der Tastatur. Die
                  Bibliothek läuft komplett lokal auf dem Gerät und sendet keine
                  Daten.
                </li>
                <li>
                  <strong className="text-foreground">Apple UITextChecker:</strong>{" "}
                  Die integrierte Apple-Rechtschreibprüfung für die
                  Autokorrektur. Verarbeitet Texte lokal auf dem Gerät, keine
                  Server-Übertragung.
                </li>
              </ul>
              <p className="text-muted leading-relaxed mt-3">
                Es werden{" "}
                <strong className="text-foreground">
                  keine Drittanbieter-Dienste
                </strong>{" "}
                eingebunden, die personenbezogene Daten verarbeiten.
              </p>
            </Section>

            <Section title="8. Datensicherheit">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Alle Daten werden in einem iOS-Sandbox-Container gespeichert,
                  der nur der Clipboard-App und ihrer Tastatur-Erweiterung
                  zugänglich ist.
                </li>
                <li>
                  Keine Datenübertragung an externe Server — somit kein
                  Übertragungsrisiko.
                </li>
                <li>
                  Bei Deinstallation der App werden alle gespeicherten Daten
                  automatisch durch iOS gelöscht.
                </li>
              </ul>
            </Section>

            <Section title="9. Deine Rechte (DSGVO)">
              <p className="text-muted leading-relaxed mb-3">
                Als Nutzer:in innerhalb der EU hast du folgende Rechte:
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">Auskunft:</strong> Du
                  kannst erfragen, welche Daten über dich gespeichert sind.
                </li>
                <li>
                  <strong className="text-foreground">Löschung:</strong> Du
                  kannst alle Daten jederzeit selbst löschen — in der App über
                  den Papierkorb, oder durch Deinstallation der App.
                </li>
                <li>
                  <strong className="text-foreground">Widerspruch:</strong> Du
                  kannst der Verarbeitung jederzeit widersprechen, indem du die
                  App deinstallierst.
                </li>
              </ul>
              <p className="text-muted leading-relaxed mt-3">
                Da Clipboard keine Nutzerkonten verwendet und alle Daten lokal
                gespeichert werden, haben wir{" "}
                <strong className="text-foreground">
                  keinen Zugriff auf deine Daten
                </strong>
                . Bei Fragen kontaktiere uns unter{" "}
                <a
                  href="mailto:support@kojalytics.com"
                  className="text-accent-light hover:underline"
                >
                  support@kojalytics.com
                </a>
                .
              </p>
            </Section>

            <Section title="10. Geräteberechtigungen">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">
                    Tastatur-Erweiterung (Voller Zugriff):
                  </strong>{" "}
                  Zum Lesen der Zwischenablage und zum Teilen der Historie
                  zwischen App und Tastatur (siehe Abschnitt 5).
                </li>
              </ul>
              <p className="text-muted leading-relaxed mt-3">
                Es werden keine weiteren Berechtigungen benötigt (kein Kamera-,
                Mikrofon-, Standort-, Foto- oder Kontaktzugriff).
              </p>
            </Section>

            <Section title="11. Kinder">
              <p className="text-muted leading-relaxed">
                Clipboard richtet sich nicht an Kinder unter 16 Jahren. Wir
                erheben wissentlich keine Daten von Kindern. Da die App generell
                keine personenbezogenen Daten erhebt, ist die Nutzung jedoch
                unbedenklich.
              </p>
            </Section>

            <Section title="12. Änderungen dieser Datenschutzerklärung">
              <p className="text-muted leading-relaxed">
                Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf zu
                aktualisieren. Die aktuelle Version ist stets unter dieser URL
                abrufbar.
              </p>
            </Section>

            <Section title="13. Kontakt">
              <p className="text-muted leading-relaxed">
                Bei Fragen zum Datenschutz erreichst du uns unter:{" "}
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
