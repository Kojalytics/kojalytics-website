import Link from "next/link";
import { Download, ShieldCheck, TriangleAlert } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Faq, { faqJsonLd, type FaqItem } from "@/components/software/Faq";
import SectionBar from "@/components/instrument/SectionBar";
import { DOWNLOAD_PATH_WINDOWS } from "@/lib/pricing";
import { href, type Lang } from "@/lib/i18n";

// Must match the subject of the code-signing certificate on Kojalytics-Launcher.msi,
// because buyers are told to compare it with what Windows shows.
const PUBLISHER = "Farzad Khojazada";

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

/*
 * The words of the page. The English names of buttons and dialogs (Key, the two replicas) are the ones an English
 * Windows, Edge and Chrome show; the launcher's own labels are the ones of its English interface.
 */
const de = {
  heroLabel: "Installation unter Windows",
  title: (
    <>
      Windows fragt nach? <span className="text-highlight">Das ist bei neuen Programmen normal.</span>
    </>
  ),
  lead: "In wenigen Minuten sind deine Koja-Apps installiert. Hier siehst du jeden Schritt und erfährst, warum Windows beim ersten Mal einmal nachfragt.",
  download: "Launcher für Windows laden",
  overview: "Zur Hilfe-Übersicht",
  whyTitle: "Warum Windows nachfragt",
  why: (
    <>
      Der Kojalytics Launcher ist <strong className="text-foreground">digital signiert</strong>. Windows
      prüft zusätzlich mit <strong className="text-foreground">SmartScreen</strong>, wie oft ein Programm
      schon heruntergeladen wurde. Unsere Apps sind neu, deshalb fragt Windows sicherheitshalber nach. Das
      heißt nicht, dass etwas Schädliches gefunden wurde.
    </>
  ),
  checkTitle: "So prüfst du, dass die Datei echt ist",
  check: (
    <>
      Lade sie nur über kojalytics.com. Die Datei heißt{" "}
      <strong className="text-foreground">Kojalytics-Launcher.msi</strong>, und Windows zeigt als
      verifizierten Herausgeber <strong className="text-foreground">„{PUBLISHER}“</strong> an, den Inhaber
      von Kojalytics (siehe <Link href="/impressum" className="text-accent underline">Impressum</Link>).
      Steht dort etwas anderes oder „Unbekannt“, installiere die Datei nicht und schreib uns.
    </>
  ),
  stepsLabel: "Schritt für Schritt",
  stepsMeta: "Download · Installation · Lizenz",
  stepsLead:
    "Je nach Browser und Windows-Einstellungen siehst du nicht jeden Hinweis. Überspringe einfach, was bei dir nicht erscheint.",
  step1: "Installationsdatei herunterladen",
  step1Text: (
    <>
      Klicke oben auf <Key>Launcher für Windows laden</Key>. Die Datei landet in deinem Ordner{" "}
      <Key>Downloads</Key>.
    </>
  ),
  ifBrowser: "Falls dein Browser den Download anhält",
  edge: (
    <>
      <strong className="text-foreground">Microsoft Edge</strong> meldet eventuell „wird nicht häufig
      heruntergeladen“. Klicke in der Download-Liste auf <Key>…</Key> neben der Datei, dann auf{" "}
      <Key>Behalten</Key>, <Key>Mehr anzeigen</Key> und <Key>Trotzdem behalten</Key>.
    </>
  ),
  chrome: (
    <>
      <strong className="text-foreground">Google Chrome</strong> zeigt eventuell einen ähnlichen Hinweis. Öffne
      die Downloads mit <Key>Strg + J</Key> und wähle bei der Kojalytics-Datei <Key>Beibehalten</Key> bzw.{" "}
      <Key>Trotzdem herunterladen</Key>.
    </>
  ),
  step2: "Installation starten",
  step2Text: (
    <>
      Doppelklicke auf <strong className="text-foreground">Kojalytics-Launcher.msi</strong>.
    </>
  ),
  ifBlue: "Falls ein blaues Fenster erscheint",
  blue: (
    <>
      Windows zeigt dann „Der Computer wurde durch Windows geschützt“. Klicke auf{" "}
      <Key>Weitere Informationen</Key>. Prüfe, dass als Herausgeber <strong className="text-foreground">{PUBLISHER}</strong>{" "}
      steht, und klicke dann auf <Key>Trotzdem ausführen</Key>.
    </>
  ),
  smartscreen: {
    label: "Vereinfachter Nachbau des blauen SmartScreen-Fensters von Windows",
    title: "Der Computer wurde durch Windows geschützt",
    text: "Von Microsoft Defender SmartScreen wurde der Start einer unbekannten App verhindert …",
    publisher: (name: string) => <>Herausgeber: {name}</>,
    run: "Trotzdem ausführen",
    dont: "Nicht ausführen",
  },
  smartscreenNote: "Vereinfachter Nachbau. „Trotzdem ausführen“ erscheint erst nach dem Klick auf „Weitere Informationen“.",
  step3: "Änderungen erlauben",
  step3Text: (
    <>
      Windows fragt: „Möchten Sie zulassen, dass durch diese App Änderungen an Ihrem Gerät vorgenommen
      werden?“ Das ist bei jeder Installation üblich. Steht dort{" "}
      <strong className="text-foreground">Verifizierter Herausgeber: {PUBLISHER}</strong>, klicke auf{" "}
      <Key>Ja</Key>.
    </>
  ),
  uac: {
    label: "Vereinfachter Nachbau der Windows-Benutzerkontensteuerung",
    title: "Benutzerkontensteuerung",
    question: "Möchten Sie zulassen, dass durch diese App Änderungen an Ihrem Gerät vorgenommen werden?",
    publisher: (name: string) => <>Verifizierter Herausgeber: {name}</>,
    yes: "Ja",
    no: "Nein",
  },
  replica: "Vereinfachter Nachbau.",
  step4: "Lizenz aktivieren und Apps installieren",
  step4Text: (
    <>
      Der <strong className="text-foreground">Kojalytics Launcher</strong> öffnet sich. Öffne{" "}
      <Key>Einstellungen › Lizenz</Key>, füge deinen Schlüssel aus der Kauf-E-Mail ein und klicke auf{" "}
      <Key>Aktivieren</Key>. Dann wählst du, welche der 13 Apps du installieren möchtest. Fertig.
    </>
  ),
  blockedTitle: "Die Installation wird ganz blockiert, ohne „Trotzdem ausführen“?",
  blocked: (
    <>
      Das kann auf Firmen-PCs mit strengen Richtlinien oder bei besonders strengen Windows-Einstellungen
      passieren. Bitte schalte keine Schutzfunktionen ab. Schreib uns an{" "}
      <a href="mailto:support@kojalytics.com" className="font-semibold underline">
        support@kojalytics.com
      </a>
      , wir finden gemeinsam eine Lösung. Auf Firmen-PCs hilft auch eure IT-Abteilung.
    </>
  ),
  faqLabel: "Häufige Fragen",
  faqMeta: "Sicherheit · Virenschutz · Systeme",
  faqTitle: (
    <>
      Noch <span className="text-highlight">Fragen</span>?
    </>
  ),
  faq: [
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
  ] as FaqItem[],
};

const en: typeof de = {
  heroLabel: "Installing on Windows",
  title: (
    <>
      Windows asks first? <span className="text-highlight">That&apos;s normal for new programs.</span>
    </>
  ),
  lead: "Your Koja apps are installed in a few minutes. Here you'll see every step and learn why Windows asks for confirmation the first time.",
  download: "Download the launcher for Windows",
  overview: "Back to help & support",
  whyTitle: "Why Windows asks",
  why: (
    <>
      The Kojalytics Launcher is <strong className="text-foreground">digitally signed</strong>. Windows also uses{" "}
      <strong className="text-foreground">SmartScreen</strong> to check how often a program has been downloaded. Our apps are new, so
      Windows asks to be on the safe side. That doesn&apos;t mean anything harmful was found.
    </>
  ),
  checkTitle: "How to check that the file is genuine",
  check: (
    <>
      Only download it from kojalytics.com. The file is called{" "}
      <strong className="text-foreground">Kojalytics-Launcher.msi</strong>, and Windows shows{" "}
      <strong className="text-foreground">“{PUBLISHER}”</strong> as the verified publisher, the owner of Kojalytics (see{" "}
      <Link href={href("en", "/impressum")} className="text-accent underline">
        Imprint
      </Link>
      ). If it shows anything else or “Unknown”, don&apos;t install the file and write to us.
    </>
  ),
  stepsLabel: "Step by step",
  stepsMeta: "Download · Installation · License",
  stepsLead:
    "Depending on your browser and Windows settings, you may not see every prompt. Simply skip whatever doesn't appear for you.",
  step1: "Download the installer",
  step1Text: (
    <>
      Click <Key>Download the launcher for Windows</Key> above. The file goes to your <Key>Downloads</Key> folder.
    </>
  ),
  ifBrowser: "If your browser holds back the download",
  edge: (
    <>
      <strong className="text-foreground">Microsoft Edge</strong> may say the file “isn&apos;t commonly downloaded”. In the downloads
      list, click <Key>…</Key> next to the file, then <Key>Keep</Key>, <Key>Show more</Key> and <Key>Keep anyway</Key>.
    </>
  ),
  chrome: (
    <>
      <strong className="text-foreground">Google Chrome</strong> may show a similar message. Open your downloads with{" "}
      <Key>Ctrl + J</Key> and choose <Key>Keep</Key> or <Key>Download anyway</Key> for the Kojalytics file.
    </>
  ),
  step2: "Start the installation",
  step2Text: (
    <>
      Double-click <strong className="text-foreground">Kojalytics-Launcher.msi</strong>.
    </>
  ),
  ifBlue: "If a blue window appears",
  blue: (
    <>
      Windows then shows “Windows protected your PC”. Click <Key>More info</Key>. Check that the publisher is{" "}
      <strong className="text-foreground">{PUBLISHER}</strong>, then click <Key>Run anyway</Key>.
    </>
  ),
  smartscreen: {
    label: "Simplified replica of the blue Windows SmartScreen window",
    title: "Windows protected your PC",
    text: "Microsoft Defender SmartScreen prevented an unrecognized app from starting …",
    publisher: (name: string) => <>Publisher: {name}</>,
    run: "Run anyway",
    dont: "Don't run",
  },
  smartscreenNote: "Simplified replica. “Run anyway” only appears after you click “More info”.",
  step3: "Allow changes",
  step3Text: (
    <>
      Windows asks: “Do you want to allow this app to make changes to your device?” This is usual for any installation. If it says{" "}
      <strong className="text-foreground">Verified publisher: {PUBLISHER}</strong>, click <Key>Yes</Key>.
    </>
  ),
  uac: {
    label: "Simplified replica of Windows User Account Control",
    title: "User Account Control",
    question: "Do you want to allow this app to make changes to your device?",
    publisher: (name: string) => <>Verified publisher: {name}</>,
    yes: "Yes",
    no: "No",
  },
  replica: "Simplified replica.",
  step4: "Activate your license and install the apps",
  step4Text: (
    <>
      The <strong className="text-foreground">Kojalytics Launcher</strong> opens. Open <Key>Settings › License</Key>, paste the key from
      your purchase email and click <Key>Activate</Key>. Then choose which of the 13 apps you want to install. Done.
    </>
  ),
  blockedTitle: "Is the installation blocked completely, with no “Run anyway”?",
  blocked: (
    <>
      This can happen on company PCs with strict policies or with especially strict Windows settings. Please don&apos;t turn off any
      protection features. Write to us at{" "}
      <a href="mailto:support@kojalytics.com" className="font-semibold underline">
        support@kojalytics.com
      </a>
      , and we&apos;ll find a solution together. On company PCs, your IT department can help too.
    </>
  ),
  faqLabel: "Common questions",
  faqMeta: "Security · Antivirus · Systems",
  faqTitle: (
    <>
      Any more <span className="text-highlight">questions</span>?
    </>
  ),
  faq: [
    {
      q: "Is the file safe?",
      a: `Yes, if you downloaded it from this page or kojalytics.com. The file is digitally signed, and Windows shows you the verified publisher “${PUBLISHER}”. The warning only appears because Windows rates new programs as “known” only after many downloads.`,
    },
    {
      q: "Who is Farzad Khojazada?",
      a: `The owner of Kojalytics. Our code signing certificate is issued in this name, and you'll also find it in the [imprint](${href("en", "/impressum")}).`,
    },
    {
      q: "My antivirus moved the file to quarantine. What now?",
      a: "Please don't restore the file yourself. Write to support@kojalytics.com instead. We'll look into it and report false alarms directly to the maker of the antivirus software.",
    },
    {
      q: "Do I have to do this every time I start the apps?",
      a: "No. The prompts only appear during installation. After that, you start the apps as usual from the Start menu or the Kojalytics Launcher.",
    },
    {
      q: "Which version of Windows do I need?",
      a: "Windows 10 or Windows 11, 64-bit.",
    },
  ],
};

const T = { de, en };

export default function WindowsInstallationView({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <>
      <Navigation />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(t.faq)) }} />
      <main className="pt-12">
        {/* 01 Hero */}
        <section className="rail">
          <SectionBar index="01" label={t.heroLabel} meta="Windows 10 · Windows 11" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h1 className="display rise-in max-w-4xl text-[clamp(2.1rem,5.4vw,4.6rem)]">{t.title}</h1>
            <p className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-muted [--i:1]">{t.lead}</p>
            <div className="rise-in mt-8 flex flex-wrap gap-3 [--i:2]">
              <a href={DOWNLOAD_PATH_WINDOWS} className="btn-primary">
                <Download size={18} aria-hidden /> {t.download}
              </a>
              <Link href={href(lang, "/support")} className="btn-outline">
                {t.overview}
              </Link>
            </div>
          </div>

          <div className="cells rise-in border-t border-border md:grid-cols-2 [--i:3]">
            <div className="flex items-start gap-4 p-6 md:p-8">
              <span className="icon-box shrink-0">
                <ShieldCheck size={18} aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 className="hud">{t.whyTitle}</h2>
                <p className="mt-3 leading-relaxed text-muted">{t.why}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 md:p-8">
              <span className="icon-box shrink-0">
                <ShieldCheck size={18} aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 className="hud">{t.checkTitle}</h2>
                <p className="mt-3 leading-relaxed text-muted">{t.check}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 02 Steps */}
        <section className="rail crosshairs">
          <SectionBar index="02" label={t.stepsLabel} meta={t.stepsMeta} />
          <div className={`py-10 md:py-14 ${pad}`}>
            <p className="max-w-2xl leading-relaxed text-muted">{t.stepsLead}</p>
          </div>
          <ol className="divide-y divide-border border-t border-border">
            <Step n={1} title={t.step1}>
              <p>{t.step1Text}</p>
              <IfLabel>{t.ifBrowser}</IfLabel>
              <p>{t.edge}</p>
              <p>{t.chrome}</p>
            </Step>

            <Step n={2} title={t.step2}>
              <p>{t.step2Text}</p>
              <IfLabel>{t.ifBlue}</IfLabel>
              <p>{t.blue}</p>
              <div
                className="max-w-md rounded-lg bg-[#1a5fb4] p-5 font-[Segoe_UI,system-ui,sans-serif] text-white"
                role="img"
                aria-label={t.smartscreen.label}
              >
                <p className="text-lg font-semibold">{t.smartscreen.title}</p>
                <p className="mt-2 text-sm text-white/85">{t.smartscreen.text}</p>
                <p className="mt-3 text-sm">
                  App: Kojalytics-Launcher.msi
                  <br />
                  {t.smartscreen.publisher(PUBLISHER)}
                </p>
                <div className="mt-4 flex justify-end gap-2 text-sm">
                  <span className="bg-white px-4 py-1.5 font-semibold text-[#1a5fb4] outline outline-[3px] outline-offset-2 outline-[#ffc63a]">
                    {t.smartscreen.run}
                  </span>
                  <span className="border border-white/70 px-4 py-1.5">{t.smartscreen.dont}</span>
                </div>
              </div>
              <p className="text-sm">{t.smartscreenNote}</p>
            </Step>

            <Step n={3} title={t.step3}>
              <p>{t.step3Text}</p>
              <div
                className="max-w-md overflow-hidden rounded-lg border border-border-strong bg-white font-[Segoe_UI,system-ui,sans-serif] text-[#1b1b1b]"
                role="img"
                aria-label={t.uac.label}
              >
                <p className="bg-[#2b5797] px-4 py-2 text-sm text-white">{t.uac.title}</p>
                <div className="space-y-2 p-4 text-sm">
                  <p>{t.uac.question}</p>
                  <p className="text-[#555]">{t.uac.publisher(PUBLISHER)}</p>
                </div>
                <div className="flex justify-end gap-2 px-4 pb-4 text-sm">
                  <span className="bg-[#0067c0] px-6 py-1.5 font-semibold text-white outline outline-[3px] outline-offset-2 outline-[#ffc63a]">
                    {t.uac.yes}
                  </span>
                  <span className="border border-[#999] px-6 py-1.5">{t.uac.no}</span>
                </div>
              </div>
              <p className="text-sm">{t.replica}</p>
            </Step>

            <Step n={4} title={t.step4}>
              <p>{t.step4Text}</p>
            </Step>
          </ol>

          <div className={`border-t border-border py-8 ${pad}`}>
            <div className="flex max-w-3xl items-start gap-4 border border-[#f3dfae] bg-[#fff8e8] p-5 text-[#5b4a1e]">
              <TriangleAlert size={20} className="mt-0.5 shrink-0" aria-hidden />
              <div className="leading-relaxed">
                <p className="font-semibold text-[#3d300f]">{t.blockedTitle}</p>
                <p className="mt-1">{t.blocked}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 03 FAQ */}
        <section className="rail crosshairs">
          <SectionBar index="03" label={t.faqLabel} meta={t.faqMeta} />
          <div className={`grid gap-10 py-14 md:py-20 lg:grid-cols-[0.8fr_1.2fr] ${pad}`}>
            <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              {t.faqTitle}
            </h2>
            <Faq items={t.faq} />
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  );
}
