import Link from "next/link";
import { Download, ShieldCheck, TriangleAlert } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Faq, { faqJsonLd } from "@/components/software/Faq";
import SectionBar from "@/components/instrument/SectionBar";
import { DOWNLOAD_PATH_WINDOWS } from "@/lib/pricing";

// Must match the subject of the code-signing certificate on Kojalytics-Launcher.msi,
// because buyers are told to compare it with what Windows shows.
const PUBLISHER = "Farzad Khojazada";

const faq = [
  {
    q: "Ist die Datei sicher?",
    a: `Ja, wenn du sie über diese Seite oder kojalytics.com geladen hast. Die Datei ist digital signiert, Windows zeigt dir den verifizierten Herausgeber „${PUBLISHER}“ an. Der Hinweis entsteht nur, weil Windows neue Programme erst nach vielen Downloads als „bekannt“ einstuft.`,
  },
  {
    q: "Wer ist Farzad Khojazada?",
    a: "Der Inhaber von Kojalytics. Unter diesem Namen ist unser Code-Signing-Zertifikat ausgestellt, du findest ihn auch im [Impressum](/impressum).",
  },
  {
    q: "Mein Virenschutz hat die Datei in Quarantäne verschoben. Was nun?",
    a: "Stelle die Datei bitte nicht auf eigene Faust wieder her, sondern schreib an support@kojalytics.com. Wir prüfen den Fall und melden Fehlalarme direkt an den Hersteller des Virenschutzes.",
  },
  {
    q: "Muss ich das bei jedem Start wiederholen?",
    a: "Nein. Die Hinweise kommen nur bei der Installation. Danach startest du die Apps ganz normal über das Startmenü oder den Kojalytics Launcher.",
  },
  {
    q: "Welche Windows-Version brauche ich?",
    a: "Windows 10 oder Windows 11 in der 64-Bit-Version.",
  },
];

const pad = "px-5 md:px-10";

function Key({ children }: { children: React.ReactNode }) {
  return (
    <span className="whitespace-nowrap border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[0.92em] font-semibold text-accent">
      {children}
    </span>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="grid gap-4 p-6 sm:grid-cols-[3rem_1fr] md:p-8" data-reveal>
      <span className="flex size-10 items-center justify-center bg-accent text-base font-bold text-accent-ink" aria-hidden>
        {n}
      </span>
      <div className="min-w-0 space-y-3 leading-relaxed text-muted">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        {children}
      </div>
    </li>
  );
}

function IfLabel({ children }: { children: React.ReactNode }) {
  return <p className="hud pt-2">{children}</p>;
}

export default function WindowsInstallationPage() {
  return (
    <>
      <Navigation />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faq)) }} />
      <main className="pt-12">
        {/* 01 Hero */}
        <section className="rail">
          <SectionBar index="01" label="Installation unter Windows" meta="Windows 10 · Windows 11" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h1 className="display rise-in max-w-4xl text-[clamp(2.1rem,5.4vw,4.6rem)]">
              Windows fragt nach? <span className="text-highlight">Das ist bei neuen Programmen normal.</span>
            </h1>
            <p className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-muted [--i:1]">
              In wenigen Minuten sind deine Koja-Apps installiert. Hier siehst du jeden Schritt und erfährst, warum
              Windows beim ersten Mal einmal nachfragt.
            </p>
            <div className="rise-in mt-8 flex flex-wrap gap-3 [--i:2]">
              <a href={DOWNLOAD_PATH_WINDOWS} className="btn-primary">
                <Download size={18} aria-hidden /> Launcher für Windows laden
              </a>
              <Link href="/support" className="btn-outline">
                Zur Hilfe-Übersicht
              </Link>
            </div>
          </div>

          <div className="cells rise-in border-t border-border md:grid-cols-2 [--i:3]">
            <div className="flex items-start gap-4 p-6 md:p-8">
              <span className="icon-box shrink-0">
                <ShieldCheck size={18} aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 className="hud">Warum Windows nachfragt</h2>
                <p className="mt-3 leading-relaxed text-muted">
                  Der Kojalytics Launcher ist <strong className="text-foreground">digital signiert</strong>. Windows
                  prüft zusätzlich mit <strong className="text-foreground">SmartScreen</strong>, wie oft ein Programm
                  schon heruntergeladen wurde. Unsere Apps sind neu, deshalb fragt Windows sicherheitshalber nach. Das
                  heißt nicht, dass etwas Schädliches gefunden wurde.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 md:p-8">
              <span className="icon-box shrink-0">
                <ShieldCheck size={18} aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 className="hud">So prüfst du, dass die Datei echt ist</h2>
                <p className="mt-3 leading-relaxed text-muted">
                  Lade sie nur über kojalytics.com. Die Datei heißt{" "}
                  <strong className="text-foreground">Kojalytics-Launcher.msi</strong>, und Windows zeigt als
                  verifizierten Herausgeber <strong className="text-foreground">„{PUBLISHER}“</strong> an, den Inhaber
                  von Kojalytics (siehe <Link href="/impressum" className="text-accent underline">Impressum</Link>).
                  Steht dort etwas anderes oder „Unbekannt“, installiere die Datei nicht und schreib uns.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 02 Steps */}
        <section className="rail crosshairs">
          <SectionBar index="02" label="Schritt für Schritt" meta="Download · Installation · Lizenz" />
          <div className={`py-10 md:py-14 ${pad}`}>
            <p className="max-w-2xl leading-relaxed text-muted">
              Je nach Browser und Windows-Einstellungen siehst du nicht jeden Hinweis. Überspringe einfach, was bei dir
              nicht erscheint.
            </p>
          </div>
          <ol className="divide-y divide-border border-t border-border">
            <Step n={1} title="Installationsdatei herunterladen">
              <p>
                Klicke oben auf <Key>Launcher für Windows laden</Key>. Die Datei landet in deinem Ordner{" "}
                <Key>Downloads</Key>.
              </p>
              <IfLabel>Falls dein Browser den Download anhält</IfLabel>
              <p>
                <strong className="text-foreground">Microsoft Edge</strong> meldet eventuell „wird nicht häufig
                heruntergeladen“. Klicke in der Download-Liste auf <Key>…</Key> neben der Datei, dann auf{" "}
                <Key>Behalten</Key>, <Key>Mehr anzeigen</Key> und <Key>Trotzdem behalten</Key>.
              </p>
              <p>
                <strong className="text-foreground">Google Chrome</strong> zeigt eventuell einen ähnlichen Hinweis. Öffne
                die Downloads mit <Key>Strg + J</Key> und wähle bei der Kojalytics-Datei <Key>Beibehalten</Key> bzw.{" "}
                <Key>Trotzdem herunterladen</Key>.
              </p>
            </Step>

            <Step n={2} title="Installation starten">
              <p>
                Doppelklicke auf <strong className="text-foreground">Kojalytics-Launcher.msi</strong>.
              </p>
              <IfLabel>Falls ein blaues Fenster erscheint</IfLabel>
              <p>
                Windows zeigt dann „Der Computer wurde durch Windows geschützt“. Klicke auf{" "}
                <Key>Weitere Informationen</Key>. Prüfe, dass als Herausgeber <strong className="text-foreground">{PUBLISHER}</strong>{" "}
                steht, und klicke dann auf <Key>Trotzdem ausführen</Key>.
              </p>
              <div
                className="max-w-md rounded-lg bg-[#1a5fb4] p-5 font-[Segoe_UI,system-ui,sans-serif] text-white"
                role="img"
                aria-label="Vereinfachter Nachbau des blauen SmartScreen-Fensters von Windows"
              >
                <p className="text-lg font-semibold">Der Computer wurde durch Windows geschützt</p>
                <p className="mt-2 text-sm text-white/85">
                  Von Microsoft Defender SmartScreen wurde der Start einer unbekannten App verhindert …
                </p>
                <p className="mt-3 text-sm">
                  App: Kojalytics-Launcher.msi
                  <br />
                  Herausgeber: {PUBLISHER}
                </p>
                <div className="mt-4 flex justify-end gap-2 text-sm">
                  <span className="bg-white px-4 py-1.5 font-semibold text-[#1a5fb4] outline outline-[3px] outline-offset-2 outline-[#ffc63a]">
                    Trotzdem ausführen
                  </span>
                  <span className="border border-white/70 px-4 py-1.5">Nicht ausführen</span>
                </div>
              </div>
              <p className="text-sm">
                Vereinfachter Nachbau. „Trotzdem ausführen“ erscheint erst nach dem Klick auf „Weitere Informationen“.
              </p>
            </Step>

            <Step n={3} title="Änderungen erlauben">
              <p>
                Windows fragt: „Möchten Sie zulassen, dass durch diese App Änderungen an Ihrem Gerät vorgenommen
                werden?“ Das ist bei jeder Installation üblich. Steht dort{" "}
                <strong className="text-foreground">Verifizierter Herausgeber: {PUBLISHER}</strong>, klicke auf{" "}
                <Key>Ja</Key>.
              </p>
              <div
                className="max-w-md overflow-hidden rounded-lg border border-border-strong bg-white font-[Segoe_UI,system-ui,sans-serif] text-[#1b1b1b]"
                role="img"
                aria-label="Vereinfachter Nachbau der Windows-Benutzerkontensteuerung"
              >
                <p className="bg-[#2b5797] px-4 py-2 text-sm text-white">Benutzerkontensteuerung</p>
                <div className="space-y-2 p-4 text-sm">
                  <p>Möchten Sie zulassen, dass durch diese App Änderungen an Ihrem Gerät vorgenommen werden?</p>
                  <p className="text-[#555]">Verifizierter Herausgeber: {PUBLISHER}</p>
                </div>
                <div className="flex justify-end gap-2 px-4 pb-4 text-sm">
                  <span className="bg-[#0067c0] px-6 py-1.5 font-semibold text-white outline outline-[3px] outline-offset-2 outline-[#ffc63a]">
                    Ja
                  </span>
                  <span className="border border-[#999] px-6 py-1.5">Nein</span>
                </div>
              </div>
              <p className="text-sm">Vereinfachter Nachbau.</p>
            </Step>

            <Step n={4} title="Lizenz aktivieren und Apps installieren">
              <p>
                Der <strong className="text-foreground">Kojalytics Launcher</strong> öffnet sich. Öffne{" "}
                <Key>Einstellungen › Lizenz</Key>, füge deinen Schlüssel aus der Kauf-E-Mail ein und klicke auf{" "}
                <Key>Aktivieren</Key>. Dann wählst du, welche der 13 Apps du installieren möchtest. Fertig.
              </p>
            </Step>
          </ol>

          <div className={`border-t border-border py-8 ${pad}`}>
            <div className="flex max-w-3xl items-start gap-4 border border-[#f3dfae] bg-[#fff8e8] p-5 text-[#5b4a1e]">
              <TriangleAlert size={20} className="mt-0.5 shrink-0" aria-hidden />
              <div className="leading-relaxed">
                <p className="font-semibold text-[#3d300f]">Die Installation wird ganz blockiert, ohne „Trotzdem ausführen“?</p>
                <p className="mt-1">
                  Das kann auf Firmen-PCs mit strengen Richtlinien oder bei besonders strengen Windows-Einstellungen
                  passieren. Bitte schalte keine Schutzfunktionen ab. Schreib uns an{" "}
                  <a href="mailto:support@kojalytics.com" className="font-semibold underline">
                    support@kojalytics.com
                  </a>
                  , wir finden gemeinsam eine Lösung. Auf Firmen-PCs hilft auch eure IT-Abteilung.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 03 FAQ */}
        <section className="rail crosshairs">
          <SectionBar index="03" label="Häufige Fragen" meta="Sicherheit · Virenschutz · Systeme" />
          <div className={`grid gap-10 py-14 md:py-20 lg:grid-cols-[0.8fr_1.2fr] ${pad}`}>
            <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Noch <span className="text-highlight">Fragen</span>?
            </h2>
            <Faq items={faq} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
