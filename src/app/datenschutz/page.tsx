import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Datenschutzerklärung von Kojalytics: welche Daten die Website, die Koja-Apps und AI Headshot verarbeiten, welche Dienste wir nutzen und welche Rechte du hast.",
  alternates: { canonical: "/datenschutz" },
};

const USA_TRANSFER =
  "Grundlage für eine Übermittlung in die USA ist der Angemessenheitsbeschluss der EU-Kommission zum EU-US Data Privacy Framework (Art. 45 DSGVO), soweit der Empfänger danach zertifiziert ist, im Übrigen die Standardvertragsklauseln der EU-Kommission (Art. 46 Abs. 2 lit. c DSGVO).";

export default function DatenschutzPage() {
  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent-light text-sm font-medium tracking-wide uppercase mb-3">
            Rechtliches
          </p>
          <h1 className="mb-3 text-[2rem] font-bold tracking-tight hyphens-auto sm:text-4xl">
            Datenschutzerklärung
          </h1>
          <p className="text-muted text-sm mb-6">Stand: 7. November 2026</p>
          <p className="text-muted leading-relaxed mb-6">
            Hier erfährst du, welche personenbezogenen Daten wir verarbeiten,
            wenn du kojalytics.com besuchst, die Koja-Apps kaufst und nutzt oder
            die iOS-App AI Headshot verwendest. Teil A gilt für die Website und
            die Koja-Apps, Teil B für AI Headshot.
          </p>
          <nav
            aria-label="Inhalt"
            className="bg-accent/10 border border-accent/20 rounded-xl p-5 mb-10"
          >
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <a href="#website" className="text-accent-light hover:underline">
                  Teil A: Website kojalytics.com und Koja-Apps
                </a>
              </li>
              <li>
                <a href="#ai-headshot" className="text-accent-light hover:underline">
                  Teil B: AI Headshot (iOS-App)
                </a>
              </li>
            </ul>
          </nav>

          {/* Teil A */}
          <div id="website" className="glass-card rounded-2xl p-10 space-y-10 scroll-mt-28">
            <h2 className="text-2xl font-bold tracking-tight">
              Teil A: Website kojalytics.com und Koja-Apps
            </h2>

            <Section title="1. Verantwortlicher">
              <P className="mb-3">
                Verantwortlich für die Datenverarbeitung im Sinne der
                Datenschutz-Grundverordnung (DSGVO) ist:
              </P>
              <P>
                Kojalytics
                <br />
                Farzad Khojazada, Einzelunternehmen
                <br />
                Am Diggen 40i
                <br />
                21077 Hamburg
                <br />
                Deutschland
                <br />
                E-Mail: <SupportMail />
              </P>
            </Section>

            <Section title="2. Hosting und Server-Logfiles">
              <P className="mb-3">
                Unsere Website wird bei Vercel Inc. (USA) gehostet. Bei jedem
                Seitenaufruf verarbeitet Vercel automatisch Daten, die dein
                Browser übermittelt (Server-Logfiles):
              </P>
              <List>
                <li>IP-Adresse</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>aufgerufene Seite oder Datei und HTTP-Statuscode</li>
                <li>Referrer-URL (die zuvor besuchte Seite), soweit übermittelt</li>
                <li>Browser, Betriebssystem und Gerätetyp (User-Agent)</li>
              </List>
              <P className="mt-3">
                Wir brauchen diese Daten, um die Website auszuliefern, ihre
                Sicherheit und Stabilität zu gewährleisten und Angriffe
                abzuwehren. Rechtsgrundlage ist unser berechtigtes Interesse an
                einem sicheren und fehlerfreien Betrieb (Art. 6 Abs. 1 lit. f
                DSGVO); der Zugriff auf dein Endgerät ist dafür technisch
                erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG).
              </P>
              <P className="mt-3">
                Vercel verarbeitet die Daten in unserem Auftrag (Art. 28 DSGVO)
                und betreibt ein weltweites Servernetz, sodass Daten auch in den
                USA verarbeitet werden können. {USA_TRANSFER} Wir speichern die
                Logdaten nicht dauerhaft; Vercel löscht sie nach seinen eigenen
                Fristen. Wir werten sie nur aus, wenn das zur Fehlersuche oder
                zur Abwehr von Angriffen nötig ist.
              </P>
              <P className="mt-3">
                Schriftarten und Bilder laden wir von unserem eigenen Server. Es
                wird dafür keine Verbindung zu Google Fonts oder anderen
                Drittanbietern aufgebaut. Die Verbindung zu unserer Website ist
                per TLS (HTTPS) verschlüsselt.
              </P>
            </Section>

            <Section title="3. Einwilligung und Speicherung deiner Auswahl">
              <P>
                Beim ersten Besuch fragen wir dich in einem Banner, ob du Google
                Ads, das Meta-Pixel und Microsoft Clarity erlaubst (Abschnitte 4
                bis 6). Solange du nicht auf „Akzeptieren“ geklickt hast, laden
                wir keinen dieser Dienste, und sie können keine Cookies setzen.
              </P>
              <P className="mt-3">
                Deine Auswahl („Akzeptieren“ oder „Ablehnen“) speichern wir im
                lokalen Speicher deines Browsers (localStorage) unter dem
                Schlüssel <code>kj-consent-v1</code>. Dieser Eintrag ist kein
                Cookie, wird nicht an uns übertragen und bleibt gespeichert, bis
                du ihn in deinem Browser löschst oder deine Auswahl änderst. Er
                ist technisch erforderlich, damit wir dich nicht bei jedem
                Seitenaufruf erneut fragen (§ 25 Abs. 2 Nr. 2 TDDDG, Art. 6 Abs.
                1 lit. f DSGVO).
              </P>
              <P className="mt-3">
                Rechtsgrundlage für die Dienste in den Abschnitten 4 bis 6 ist
                deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1
                TDDDG). Sie ist freiwillig. Du kannst sie jederzeit mit Wirkung
                für die Zukunft widerrufen: Klicke im Footer auf
                „Cookie-Einstellungen“ und dann auf „Ablehnen“. Die Seite lädt
                danach ohne diese Dienste neu. Cookies, die die Dienste bereits
                gesetzt haben, bleiben bis zu ihrem Ablauf in deinem Browser; du
                kannst sie in den Browser-Einstellungen löschen. Der Widerruf
                berührt nicht die Rechtmäßigkeit der Verarbeitung bis zum
                Widerruf.
              </P>
            </Section>

            <Section title="4. Google Ads (Conversion-Messung und Remarketing)">
              <Facts
                items={[
                  ["Anbieter", "Google Ireland Limited, Irland („Google“)."],
                  [
                    "Zweck",
                    "Nach deiner Einwilligung laden wir das Google-Tag (gtag.js) für unser Google-Ads-Konto AW-17685521393. Damit messen wir, ob Besucher über unsere Anzeigen zu uns kommen und danach bestimmte Aktionen ausführen (Conversion-Messung). Google kann die Daten außerdem nutzen, um dir auf anderen Websites und in Google-Diensten passende Werbung von uns zu zeigen (Remarketing) und unsere Anzeigen auszusteuern.",
                  ],
                  [
                    "Daten",
                    "IP-Adresse, Angaben zu Browser und Gerät, aufgerufene Seiten und Referrer, Zeitpunkt, Cookie-Kennungen und, wenn du über eine Google-Anzeige kommst, die Klick-ID. Außerdem melden wir diese Ereignisse an Google: Seitenaufruf, Ansicht einer App-Seite, Klick auf einen Download-Button, Klick auf „Link für den Computer senden“ (auf Geräten ohne macOS oder Windows), Beginn des Bezahlvorgangs (mit Tarif und Preis) und abgeschlossener Kauf (mit Betrag, Währung und Bestellnummer). Bist du in einem Google-Konto angemeldet, kann Google die Daten deinem Konto zuordnen.",
                  ],
                  [
                    "Speicherdauer",
                    "Google setzt unter anderem das Cookie _gcl_au, das nach Angaben von Google bis zu 90 Tage gespeichert bleibt; Cookies auf Google-Domains können länger bestehen. Wie lange Google die Daten auf seinen Servern speichert, legt Google fest.",
                  ],
                  [
                    "Rechtsgrundlage",
                    "Deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Widerruf jederzeit über „Cookie-Einstellungen“ im Footer.",
                  ],
                  [
                    "Drittland",
                    "Google kann Daten an die Google LLC in den USA übermitteln. " + USA_TRANSFER,
                  ],
                ]}
              />
            </Section>

            <Section title="5. Meta-Pixel">
              <Facts
                items={[
                  ["Anbieter", "Meta Platforms Ireland Limited, Irland („Meta“)."],
                  [
                    "Zweck",
                    "Nach deiner Einwilligung laden wir das Meta-Pixel. Damit messen wir, wie erfolgreich unsere Anzeigen auf Facebook und Instagram sind, und können Besuchern unserer Website dort passende Werbung zeigen (Retargeting) und Zielgruppen für unsere Anzeigen bilden.",
                  ],
                  [
                    "Daten",
                    "IP-Adresse, Angaben zu Browser und Gerät, aufgerufene Seiten und Referrer, Zeitpunkt, Cookie-Kennungen (z. B. _fbp) und diese Ereignisse: PageView (Seitenaufruf), ViewContent (Ansicht einer App-Seite), Lead (Klick auf einen Download-Button), SendToMac (Klick auf „Link für den Computer senden“ auf Geräten ohne macOS oder Windows), InitiateCheckout (Beginn des Bezahlvorgangs mit Tarif und Preis) sowie Purchase oder Subscribe (abgeschlossener Kauf oder abgeschlossenes Abo mit Betrag, Währung und Bestellnummer). Bist du bei Facebook oder Instagram angemeldet, kann Meta die Daten deinem Konto zuordnen.",
                  ],
                  [
                    "Gemeinsame Verantwortung",
                    "Für die Erhebung der Daten auf unserer Website und ihre Übermittlung an Meta sind wir gemeinsam mit Meta verantwortlich (Art. 26 DSGVO). Dafür gilt der Zusatz für Verantwortliche („Controller Addendum“) zu den Meta-Geschäftsbedingungen. Meta stellt die wesentlichen Inhalte dieser Vereinbarung bereit und ist für Anfragen zu den bei Meta gespeicherten Daten zuständig; du kannst dich aber auch an uns wenden. Die weitere Verarbeitung bei Meta verantwortet Meta allein.",
                  ],
                  [
                    "Speicherdauer",
                    "Das Cookie _fbp bleibt nach Angaben von Meta 90 Tage gespeichert. Wie lange Meta die Daten auf seinen Servern speichert, legt Meta fest.",
                  ],
                  [
                    "Rechtsgrundlage",
                    "Deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Widerruf jederzeit über „Cookie-Einstellungen“ im Footer.",
                  ],
                  [
                    "Drittland",
                    "Meta kann Daten an die Meta Platforms, Inc. in den USA übermitteln. " + USA_TRANSFER,
                  ],
                ]}
              />
            </Section>

            <Section title="6. Microsoft Clarity (Heatmaps und Sitzungsaufzeichnungen)">
              <Facts
                items={[
                  ["Anbieter", "Microsoft Ireland Operations Limited, Irland („Microsoft“)."],
                  [
                    "Zweck",
                    "Nach deiner Einwilligung laden wir Microsoft Clarity (Projekt wrmm9ck898). Clarity zeichnet auf, wie du unsere Website nutzt, und erstellt daraus Heatmaps (zusammengefasste Klick- und Scrollkarten) und Sitzungsaufzeichnungen (eine Wiedergabe deines Besuchs). So sehen wir, wo unsere Seiten unklar sind oder nicht funktionieren, und können sie verbessern.",
                  ],
                  [
                    "Daten",
                    "Mausbewegungen, Klicks und Scrollen, die angezeigten Seiteninhalte, aufgerufene Seiten, Bildschirmgröße, Angaben zu Browser, Gerät und Betriebssystem, IP-Adresse und daraus abgeleitet dein ungefährer Standort (z. B. Land) sowie Cookie-Kennungen (_clck, _clsk).",
                  ],
                  [
                    "Speicherdauer",
                    "Nach Angaben von Microsoft bleibt das Cookie _clck ein Jahr und das Cookie _clsk einen Tag gespeichert. Sitzungsaufzeichnungen löscht Microsoft nach eigenen Angaben standardmäßig nach 30 Tagen.",
                  ],
                  [
                    "Rechtsgrundlage",
                    "Deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Widerruf jederzeit über „Cookie-Einstellungen“ im Footer.",
                  ],
                  [
                    "Drittland",
                    "Microsoft kann Daten an die Microsoft Corporation in den USA übermitteln. " + USA_TRANSFER,
                  ],
                ]}
              />
            </Section>

            <Section title="7. Kauf der Koja-Apps">
              <P>
                Wenn du ein Monatsabo (2,99 €) oder eine dauerhafte Lizenz (79 €)
                kaufst, verarbeiten wir die Daten, die für Vertragsschluss,
                Zahlung und Lieferung deines Lizenzschlüssels nötig sind.
              </P>
              <P className="mt-3">
                <B>Zahlung über Stripe:</B> Die Zahlung wickelt Stripe Payments
                Europe, Limited (Irland) über Stripe Checkout ab. Dort gibst du
                deine E-Mail-Adresse und deine Zahlungsdaten ein; je nach
                Zahlungsart fragt Stripe weitere Angaben ab, etwa deinen Namen
                oder dein Land. Vollständige Kartendaten erhalten wir nicht. Von
                Stripe bekommen wir unter anderem E-Mail-Adresse, Tarif, Betrag,
                Zahlungsstatus und Zeitpunkt der Zahlung. Bei Stripe vermerken wir
                außerdem, wann du vor dem Kauf den sofortigen Vertragsbeginn
                verlangt und den Entwicklungsstand der Apps bestätigt hast. Für einen
                Teil der Verarbeitung ist Stripe selbst verantwortlich, etwa für
                Betrugsprävention und eigene gesetzliche Pflichten als
                Zahlungsdienstleister. Stripe kann Daten an die Stripe, Inc. in
                den USA übermitteln. {USA_TRANSFER}
              </P>
              <P className="mt-3">
                <B>Bestätigungsseite:</B> Nach der Zahlung leitet Stripe dich zu
                uns zurück. Wir setzen dann für eine Stunde ein technisch
                notwendiges Cookie (<code>kj_session</code>) mit der Kennung
                deiner Bezahlsitzung, damit nur du auf der Bestätigungsseite
                deinen Lizenzschlüssel siehst (§ 25 Abs. 2 Nr. 2 TDDDG, Art. 6
                Abs. 1 lit. b DSGVO).
              </P>
              <P className="mt-3">
                <B>Lizenzdatenbank (Supabase):</B> Nach der Zahlung erzeugen wir
                deinen Lizenzschlüssel und speichern in unserer Datenbank bei
                Supabase (Server in der EU) deine E-Mail-Adresse, den
                Lizenzschlüssel (verschlüsselt), den Tarif, die Kennung der
                Stripe-Bezahlsitzung und gegebenenfalls den Zeitpunkt, zu dem die
                Lizenz gesperrt wurde, etwa nach dem Ende eines Abos. Supabase
                verarbeitet die Daten in unserem Auftrag (Art. 28 DSGVO). Soweit
                dabei ein Zugriff aus den USA möglich ist, gilt: {USA_TRANSFER}
              </P>
              <P className="mt-3">
                <B>E-Mail-Versand (Resend):</B> Deinen Lizenzschlüssel und die
                Kaufbestätigung senden wir dir per E-Mail über Resend, Inc.
                (USA). Resend verarbeitet dafür deine E-Mail-Adresse und den
                Inhalt der E-Mail in unserem Auftrag. {USA_TRANSFER}
              </P>
              <P className="mt-3">
                <B>Rechtsgrundlage:</B> Erfüllung des Vertrags (Art. 6 Abs. 1
                lit. b DSGVO) und gesetzliche Aufbewahrungspflichten (Art. 6 Abs.
                1 lit. c DSGVO). Ohne E-Mail-Adresse und Zahlungsdaten können wir
                den Vertrag nicht abschließen.
              </P>
              <P className="mt-3">
                <B>Speicherdauer:</B> Die Lizenzdaten speichern wir, solange
                deine Lizenz besteht. Danach bewahren wir die Daten auf, die wir
                nach Handels- und Steuerrecht aufbewahren müssen (§ 147 AO, § 257
                HGB): Rechnungen und andere Buchungsbelege acht Jahre, Handels-
                und Geschäftsbriefe sechs Jahre, Bücher und Aufzeichnungen zehn
                Jahre, jeweils ab dem Ende des Kalenderjahres. Anschließend
                löschen wir sie.
              </P>
            </Section>

            <Section title="8. Lizenzaktivierung im Kojalytics Launcher">
              <P>
                Wenn du deinen Lizenzschlüssel im Kojalytics Launcher
                aktivierst, sendet der Launcher an unseren Server: den
                Lizenzschlüssel, eine pseudonyme Gerätekennung (einen Hashwert)
                und, soweit übermittelt, den Gerätenamen (er kann deinen Namen
                enthalten, z. B. „MacBook von Max“), die App und ihre Version.
                Wir prüfen, ob der Schlüssel gültig ist und ob das Limit von 3
                Geräten erreicht ist, und speichern die Aktivierung mit Zeitpunkt in
                unserer Datenbank bei Supabase (Abschnitt 7). Dabei verarbeitet
                unser Hoster Vercel auch deine IP-Adresse (Abschnitt 2).
              </P>
              <P className="mt-3">
                Zweck ist die Bereitstellung deiner Lizenz und der Schutz vor
                Missbrauch. Rechtsgrundlage ist die Erfüllung des Vertrags (Art.
                6 Abs. 1 lit. b DSGVO) und unser berechtigtes Interesse, die
                vereinbarte Zahl von Geräten durchzusetzen (Art. 6 Abs. 1 lit. f
                DSGVO). Die Aktivierungsdaten speichern wir, solange deine Lizenz
                besteht, und löschen sie danach, soweit keine
                Aufbewahrungspflicht entgegensteht.
              </P>
            </Section>

            <Section title="9. Download über GitHub">
              <P>
                Den Kojalytics Launcher stellen wir über GitHub bereit (GitHub,
                Inc., USA). Wenn du auf einen Download-Button klickst, leiten wir
                dich zur Datei auf GitHub weiter, und dein Browser lädt sie direkt
                von dort. Dabei erhält GitHub deine
                IP-Adresse, Angaben zu Browser und Gerät sowie den Zeitpunkt des
                Downloads. Wie GitHub diese Daten verarbeitet, regelt die
                Datenschutzerklärung von GitHub. {USA_TRANSFER}
              </P>
              <P className="mt-3">
                Rechtsgrundlage ist unser berechtigtes Interesse an einer
                zuverlässigen Bereitstellung des Downloads (Art. 6 Abs. 1 lit. f
                DSGVO) und, wenn du die Apps gekauft hast, die Erfüllung des
                Vertrags (Art. 6 Abs. 1 lit. b DSGVO). Hast du in die
                Werbedienste eingewilligt, wird der Klick außerdem als „Lead“ an
                Google und Meta gemeldet (Abschnitte 4 und 5).
              </P>
            </Section>

            <Section title="10. Kündigungsformular">
              <P>
                Über{" "}
                <Link href="/kuendigen" className="text-accent-light hover:underline">
                  „Verträge hier kündigen“
                </Link>{" "}
                kannst du dein Abo kündigen. Dabei verarbeiten wir deinen Namen,
                deine E-Mail-Adresse, die Art der Kündigung (ordentlich oder
                außerordentlich) und, wenn du sie angibst, einen
                Kündigungsgrund sowie deinen Lizenzschlüssel oder eine
                Rechnungsnummer. Anhand der E-Mail-Adresse suchen wir dein Abo
                bei Stripe, kündigen es zum Ende des bezahlten Zeitraums und
                vermerken Art und Grund der Kündigung bei Stripe. Die
                Eingangsbestätigung senden wir dir per E-Mail über Resend
                (Abschnitt 7); eine Kopie geht an support@kojalytics.com.
              </P>
              <P className="mt-3">
                Rechtsgrundlage ist die Abwicklung des Vertrags (Art. 6 Abs. 1
                lit. b DSGVO) und unsere gesetzliche Pflicht, Kündigungen
                entgegenzunehmen und zu bestätigen (Art. 6 Abs. 1 lit. c DSGVO in
                Verbindung mit § 312k BGB). Wir bewahren die Kündigung als
                Nachweis auf, solange Ansprüche aus dem Vertrag geltend gemacht
                werden können (in der Regel drei Jahre ab dem Ende des Jahres der
                Kündigung), und als Geschäftsbrief bis zu sechs Jahre (§ 147 AO,
                § 257 HGB).
              </P>
            </Section>

            <Section title="11. Kontakt per E-Mail">
              <P>
                Unsere{" "}
                <Link href="/kontakt" className="text-accent-light hover:underline">
                  Kontaktseite
                </Link>{" "}
                sendet keine Daten an unseren Server. Sie öffnet nur dein
                eigenes E-Mail-Programm mit einer vorbereiteten Nachricht an
                support@kojalytics.com. Erst wenn du die E-Mail abschickst,
                erhalten wir deine E-Mail-Adresse, deinen Namen (soweit
                angegeben) und den Inhalt deiner Nachricht. E-Mails an Adressen
                unter @kojalytics.com empfangen wir über Resend (Abschnitt 7) und
                leiten sie an unser Postfach weiter.
              </P>
              <P className="mt-3">
                Wir nutzen die Daten nur, um deine Anfrage zu beantworten.
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, wenn es um einen
                Vertrag oder dessen Anbahnung geht, sonst unser berechtigtes
                Interesse an der Beantwortung von Anfragen (Art. 6 Abs. 1 lit. f
                DSGVO). Wir löschen die Anfrage, wenn sie erledigt ist, es sei
                denn, gesetzliche Aufbewahrungspflichten stehen entgegen (z. B.
                sechs Jahre für Geschäftsbriefe).
              </P>
            </Section>

            <Section title="12. Deine Rechte">
              <P className="mb-3">Du hast gegenüber uns das Recht auf:</P>
              <List>
                <li>Auskunft über deine gespeicherten Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Löschung deiner Daten (Art. 17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>
                  Widerruf einer Einwilligung mit Wirkung für die Zukunft (Art. 7
                  Abs. 3 DSGVO)
                </li>
              </List>
              <P className="mt-3">
                <B>Widerspruchsrecht (Art. 21 DSGVO):</B> Verarbeiten wir Daten
                auf Grundlage unseres berechtigten Interesses (Art. 6 Abs. 1 lit.
                f DSGVO), kannst du der Verarbeitung aus Gründen, die sich aus
                deiner besonderen Situation ergeben, jederzeit widersprechen.
              </P>
              <P className="mt-3">
                Schreib uns dafür einfach an <SupportMail />. Außerdem kannst du
                dich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77
                DSGVO). Für uns zuständig ist der Hamburgische Beauftragte für
                Datenschutz und Informationsfreiheit. Automatisierte
                Entscheidungen im Sinne von Art. 22 DSGVO treffen wir nicht.
              </P>
            </Section>

            <Section title="13. Änderungen dieser Datenschutzerklärung">
              <P>
                Wir passen diese Datenschutzerklärung an, wenn sich unsere
                Website, unsere Dienste oder die Rechtslage ändern. Es gilt die
                jeweils auf dieser Seite veröffentlichte Fassung.
              </P>
            </Section>
          </div>

          {/* Teil B */}
          <div id="ai-headshot" className="glass-card rounded-2xl p-10 space-y-10 mt-10 scroll-mt-28">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-3">
                Teil B: AI Headshot (iOS-App)
              </h2>
              <P>
                Dieser Teil gilt für die iOS-App AI Headshot, ein eigenes Angebot
                von Kojalytics.
              </P>
            </div>

            <div className="bg-accent/10 border border-accent/20 rounded-xl p-5">
              <p className="text-accent-light font-medium text-sm leading-relaxed">
                AI Headshot braucht kein Nutzerkonto, erstellt keine
                Nutzerprofile und verwendet keinerlei Tracking oder
                Analyse-Tools. Deine Fotos verarbeiten wir nur, um deine
                Portraits zu erstellen.
              </p>
            </div>

            <Section title="B1. Verantwortlicher">
              <P>
                Kojalytics
                <br />
                Farzad Khojazada, Einzelunternehmen
                <br />
                Am Diggen 40i, 21077 Hamburg, Deutschland
                <br />
                E-Mail: <SupportMail />
                <br />
                Website:{" "}
                <a
                  href="https://www.kojalytics.com"
                  className="text-accent-light hover:underline"
                >
                  www.kojalytics.com
                </a>
              </P>
            </Section>

            <Section title="B2. Welche Daten werden verarbeitet?">
              <P className="mb-3">
                AI Headshot verarbeitet ausschließlich die Daten, die für die
                Erstellung von KI-generierten Portraits notwendig sind:
              </P>
              <List>
                <li>
                  <B>Referenzfotos:</B> Die von dir ausgewählten Fotos (max. 5)
                  werden zur Erstellung der Portraits an unseren Server
                  übermittelt und anschließend an den{" "}
                  <B>Drittanbieter-KI-Dienst Google Gemini API</B> weitergeleitet
                  (siehe Abschnitte B4 und B6).
                </li>
                <li>
                  <B>Portrait-Einstellungen:</B> Deine gewählten Stil-Optionen
                  (z. B. Stil, Bildausschnitt, Hintergrund).
                </li>
                <li>
                  <B>Kaufdaten:</B> Transaktions-IDs für In-App-Käufe werden
                  lokal auf deinem Gerät gespeichert. Die Zahlungsabwicklung
                  erfolgt ausschließlich durch Apple.
                </li>
              </List>
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-5 mt-4">
                <p className="text-accent-light font-medium text-sm leading-relaxed">
                  Wichtig: Vor der ersten Übermittlung deiner Fotos an den
                  KI-Dienst bittet dich die App um deine ausdrückliche
                  Einwilligung. Ohne deine Zustimmung werden keine Fotos an
                  Drittanbieter übertragen.
                </p>
              </div>
            </Section>

            <Section title="B3. Was wird NICHT erfasst?">
              <List>
                <li>Keine Nutzerkonten oder Registrierung erforderlich</li>
                <li>Keine E-Mail-Adressen, Namen oder Telefonnummern</li>
                <li>Keine Standortdaten</li>
                <li>
                  Keine Analyse- oder Tracking-Tools in der App (kein Google
                  Analytics, Firebase etc.)
                </li>
                <li>Keine Werbung oder Werbenetzwerke in der App</li>
                <li>Keine Weitergabe von Daten an Dritte zu Marketingzwecken</li>
              </List>
            </Section>

            <Section title="B4. Wie werden deine Fotos verarbeitet?">
              <P className="mb-3">Deine Referenzfotos werden wie folgt verarbeitet:</P>
              <List>
                <li>
                  Die Fotos werden verschlüsselt (HTTPS) an unseren Server
                  (Supabase) übermittelt.
                </li>
                <li>
                  <B>Drittanbieter-KI-Dienst:</B> Zur Bildgenerierung werden
                  deine Referenzfotos an die <B>Google Gemini API</B> (ein
                  KI-Dienst der Google Ireland Limited) weitergeleitet.
                  <ul className="mt-2 ml-4 space-y-1 list-disc list-inside">
                    <li>
                      <B>Übermittelte Daten:</B> Deine Referenzfotos
                      (Gesichtsbilder) sowie Stil- und
                      Formatierungsanweisungen.
                    </li>
                    <li>
                      <B>Zweck der Übermittlung:</B> Ausschließlich zur
                      Generierung deiner KI-Portraits.
                    </li>
                    <li>
                      <B>Einwilligung:</B> Die Übermittlung erfolgt erst nach
                      deiner ausdrücklichen Einwilligung im Onboarding der App
                      (Rechtsgrundlage: Art. 6 Abs. 1 lit. a, Art. 9 Abs. 2 lit.
                      a DSGVO).
                    </li>
                    <li>
                      Google verarbeitet die Bilder gemäß der{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-light hover:underline"
                      >
                        Google-Datenschutzrichtlinie
                      </a>{" "}
                      und gewährleistet einen gleichwertigen Datenschutz.
                    </li>
                  </ul>
                </li>
                <li>
                  Nach Abschluss der Generierung werden die Referenzfotos sowohl
                  von unserem Server als auch bei Google gelöscht.
                </li>
                <li>
                  Die generierten Portraits werden über zeitlich begrenzte,
                  signierte URLs (1 Stunde Gültigkeit) bereitgestellt.
                </li>
              </List>
            </Section>

            <Section title="B5. Datenspeicherung">
              <p className="mb-3 font-medium text-foreground text-sm">
                Auf deinem Gerät (lokal):
              </p>
              <List className="space-y-2 mb-4">
                <li>Generierte Portraits und Vorschaubilder im App-Speicher</li>
                <li>
                  Kaufbelege und Einstellungen im verschlüsselten
                  iOS-Schlüsselbund (Keychain)
                </li>
                <li>
                  Tresor-Daten mit automatischem Ablauf (24 Stunden bis 30 Tage
                  je nach Paket)
                </li>
              </List>
              <p className="mb-3 font-medium text-foreground text-sm">
                Auf unserem Server:
              </p>
              <List>
                <li>Referenzfotos werden nach der Verarbeitung gelöscht</li>
                <li>
                  Generierte Portraits werden temporär gespeichert und sind nur
                  über zeitlich begrenzte URLs abrufbar
                </li>
                <li>
                  Auftrags-Metadaten (Status, Zeitstempel) werden gespeichert,
                  ohne Personenbezug
                </li>
              </List>
              <P className="mt-3">
                Die lokal gespeicherten Portraits, Tresor-Einträge und
                Einstellungen kannst du jederzeit in der App unter Einstellungen
                › „Alle meine Daten löschen“ entfernen.
              </P>
            </Section>

            <Section title="B6. Drittanbieter">
              <P className="mb-3">Die App nutzt folgende Drittanbieter-Dienste:</P>
              <List className="space-y-3">
                <li>
                  <B>Google Gemini API (Drittanbieter-KI-Dienst):</B> Zur
                  KI-basierten Bildgenerierung. Deine Referenzfotos
                  (Gesichtsbilder) werden an Google übermittelt, ausschließlich
                  zum Zweck der Portrait-Generierung und nur nach deiner
                  ausdrücklichen Einwilligung. Google verarbeitet die Daten gemäß
                  der{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-light hover:underline"
                  >
                    Google-Datenschutzrichtlinie
                  </a>{" "}
                  und gewährleistet einen gleichwertigen Datenschutz. Nach der
                  Verarbeitung werden die Fotos bei Google gelöscht.
                </li>
                <li>
                  <B>Supabase:</B> Backend-Infrastruktur für sichere
                  Datenverarbeitung und -speicherung. Server in der EU
                  (Frankfurt am Main).
                </li>
                <li>
                  <B>Apple StoreKit:</B> Für In-App-Käufe. Apple verarbeitet
                  Zahlungsdaten gemäß der{" "}
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
              </List>
            </Section>

            <Section title="B7. Datensicherheit">
              <List>
                <li>Alle Datenübertragungen erfolgen verschlüsselt über HTTPS</li>
                <li>Lokale Daten werden im iOS-Schlüsselbund verschlüsselt gespeichert</li>
                <li>
                  Zugriff auf generierte Portraits nur über zeitlich begrenzte,
                  signierte URLs
                </li>
                <li>Sicherheit durch eindeutige, nicht erratbare Auftrags-IDs</li>
              </List>
            </Section>

            <Section title="B8. Deine Rechte (DSGVO)">
              <P className="mb-3">
                Als Nutzer:in innerhalb der EU hast du insbesondere folgende
                Rechte:
              </P>
              <List>
                <li>
                  <B>Auskunft:</B> Du kannst erfragen, welche Daten über dich
                  gespeichert sind.
                </li>
                <li>
                  <B>Löschung:</B> Du kannst die Löschung deiner Daten
                  verlangen.
                </li>
                <li>
                  <B>Widerspruch:</B> Du kannst der Verarbeitung deiner Daten
                  widersprechen.
                </li>
                <li>
                  <B>Datenübertragbarkeit:</B> Du kannst die Herausgabe deiner
                  Daten in einem gängigen Format verlangen.
                </li>
                <li>
                  <B>Widerruf:</B> Du kannst deine Einwilligung jederzeit mit
                  Wirkung für die Zukunft widerrufen.
                </li>
              </List>
              <P className="mt-3">
                Da die App keine Nutzerkonten verwendet, werden keine
                personenbezogenen Daten dauerhaft gespeichert. Alle weiteren
                Rechte, auch das Beschwerderecht bei einer Aufsichtsbehörde,
                findest du in Teil A, Abschnitt 12. Bei Fragen oder zur Ausübung
                deiner Rechte erreichst du uns unter <SupportMail />.
              </P>
            </Section>

            <Section title="B9. Geräteberechtigungen">
              <List>
                <li>
                  <B>Fotobibliothek (Lesen):</B> Zum Auswählen von Referenzfotos
                  für die Portrait-Erstellung.
                </li>
                <li>
                  <B>Fotobibliothek (Schreiben):</B> Zum Speichern generierter
                  Portraits in deiner Fotobibliothek.
                </li>
              </List>
              <P className="mt-3">
                Es werden keine weiteren Berechtigungen benötigt (kein Kamera-,
                Mikrofon-, Standort- oder Kontaktzugriff).
              </P>
            </Section>

            <Section title="B10. Kinder">
              <P>
                AI Headshot richtet sich nicht an Kinder unter 16 Jahren. Wir
                erheben wissentlich keine Daten von Kindern.
              </P>
            </Section>

            <Section title="B11. Änderungen">
              <P>
                Wir behalten uns vor, diesen Teil der Datenschutzerklärung bei
                Bedarf zu aktualisieren. Die aktuelle Version ist stets unter
                dieser URL abrufbar.
              </P>
            </Section>

            <Section title="B12. Kontakt">
              <P>
                Bei Fragen zum Datenschutz erreichst du uns unter: <SupportMail />
              </P>
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
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      {children}
    </section>
  );
}

function P({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <p className={`text-muted leading-relaxed ${className}`}>{children}</p>;
}

function B({ children }: { children: React.ReactNode }) {
  return <strong className="text-foreground">{children}</strong>;
}

function List({ className = "space-y-2", children }: { className?: string; children: React.ReactNode }) {
  return <ul className={`text-muted list-disc list-inside leading-relaxed ${className}`}>{children}</ul>;
}

/** Label/value rows for the services that run with consent. */
function Facts({ items }: { items: [string, string][] }) {
  return (
    <dl className="space-y-3">
      {items.map(([label, text]) => (
        <div key={label}>
          <dt className="font-medium text-foreground text-sm">{label}</dt>
          <dd className="text-muted leading-relaxed">{text}</dd>
        </div>
      ))}
    </dl>
  );
}

function SupportMail() {
  return (
    <a href="mailto:support@kojalytics.com" className="text-accent-light hover:underline">
      support@kojalytics.com
    </a>
  );
}
