import type { FaqItem } from "@/components/software/Faq";
import { PLANS, TRIAL_DAYS } from "@/lib/pricing";

// Answers that hold for both offers: the /software page (monthly or one-time) and the Digistore24 partner page (one-time only).
const replaces: FaqItem = {
  q: "Ersetzen die Koja-Apps Adobe Creative Cloud oder Microsoft Office?",
  a: "Noch nicht vollständig. Die Koja-Apps sind frühe Versionen (Alpha, teils Pre-Alpha): Sie folgen den Arbeitsweisen, die du kennst, und öffnen gängige Dateien wie .docx, .xlsx, .pptx und .psd, aber manche Profi-Funktionen fehlen noch. Für viele alltägliche Aufgaben reichen sie schon. Teste sie kostenlos mit deinen eigenen Dateien, bevor du zahlst.",
};

const openSource: FaqItem = {
  q: "Der Quellcode ist offen. Warum kostet es Geld?",
  a: "Die Koja-Apps basieren auf quelloffener Software unter den Lizenzen Apache 2.0 und MIT. Du bezahlst uns für installierbare, signierte Versionen für Mac und Windows, den Launcher, der sie installiert und aktualisiert, und Support von einem echten Studio aus Deutschland.",
};

const account: FaqItem = {
  q: "Brauche ich ein Konto oder Internet?",
  a: "Kein Konto. Die Apps laufen direkt auf deinem Computer und funktionieren offline. Internet brauchst du nur für den Download und zum Aktivieren deiner Lizenz.",
};

const data: FaqItem = {
  q: "Sind meine Daten sicher?",
  a: "Deine Dateien bleiben auf deinem Computer. Die Apps laden deine Arbeit nirgendwo hoch, und unsere Website setzt Tracking-Cookies nur mit deiner Einwilligung.",
};

const german: FaqItem = {
  q: "Sind die Apps auf Deutsch?",
  a: "Noch nicht alle. WordKoja, PdfKoja, VectorKoja und LightKoja gibt es mit deutscher Oberfläche. Bei GridKoja, CADKoja und FigKoja ist sie erst teilweise übersetzt, bei EffectKoja sind die Effektparameter größtenteils englisch. PhotoKoja, DeckKoja und SoundKoja sind bisher nur englisch beschriftet. Prüf im kostenlosen Test, ob dich das stört.",
};

const APP_LIST =
  "Bildbearbeitung, Fotobibliothek mit RAW-Entwicklung, Vektorgrafik, Layout, Interface-Design, Videoschnitt, Motion Graphics, Audio, Textverarbeitung, Tabellen, Präsentationen, PDF und CAD";

export const SOFTWARE_FAQ: FaqItem[] = [
  {
    q: "Was bekomme ich für 2,99 € im Monat?",
    a: `Alle 13 Koja-Apps für Mac und Windows: ${APP_LIST}. Alle Updates sind inklusive, und du nutzt die Apps auf bis zu 3 Geräten, Mac und Windows-PC gemischt.`,
  },
  {
    q: "Wie funktioniert der kostenlose Test?",
    a: `Du lädst den Kojalytics Launcher, klickst dort unter Einstellungen › Lizenz auf „${TRIAL_DAYS} Tage kostenlos testen“ und installierst die Apps, die du brauchst. ${TRIAL_DAYS} Tage lang nutzt du alle Apps kostenlos, ohne Zahlungsdaten und ohne Konto. Danach entscheidest du dich für 2,99 € im Monat oder 79 € einmalig. Wenn du nichts tust, endet der Test einfach und du zahlst nichts.`,
  },
  {
    q: "Wie kündige ich?",
    a: "Jederzeit online unter [Verträge hier kündigen](/kuendigen), den Link findest du unten auf jeder Seite: Name und E-Mail-Adresse eingeben und auf „Jetzt kündigen“ klicken. Eine Gebühr fällt nicht an. Dein Abo läuft bis zum Ende des bereits bezahlten Monats, die Bestätigung bekommst du per E-Mail.",
  },
  replaces,
  {
    q: "Auf welchen Computern laufen die Apps?",
    a: "Auf dem Mac und unter Windows: Die Koja-Apps gibt es für macOS (Apple-Chip und Intel) und für Windows 10 und 11 (64-Bit), nicht für iPad, iPhone oder Android und nicht im Browser. Ein Abo oder eine Lizenz gilt für bis zu 3 Geräte, Mac und Windows-PC gemischt.",
  },
  openSource,
  account,
  data,
  german,
];

/** The Digistore24 partner page (/software/partner) sells only the one-time licence: no subscription in any answer. */
export const PARTNER_FAQ: FaqItem[] = [
  {
    q: `Was bekomme ich für ${PLANS.lifetime.label}?`,
    a: `Alle 13 Koja-Apps für Mac und Windows, ohne Ablaufdatum: ${APP_LIST}. Updates bekommst du über den Kojalytics Launcher, und du nutzt die Apps auf bis zu 3 Geräten, Mac und Windows-PC gemischt.`,
  },
  {
    q: "Ist das ein Abo?",
    a: `Nein. Du zahlst einmal ${PLANS.lifetime.label} und nutzt die Apps ohne Ablaufdatum. Es verlängert sich nichts, und du musst nichts kündigen.`,
  },
  {
    q: "Wie läuft die Bestellung ab?",
    a: "Du bestellst und bezahlst sicher über Digistore24, zum Beispiel per PayPal, Kreditkarte, SEPA-Lastschrift oder Klarna. Deinen Lizenzschlüssel bekommst du sofort per E-Mail. Im Kojalytics Launcher fügst du ihn unter Einstellungen › Lizenz ein und klickst auf „Aktivieren“.",
  },
  {
    q: "Wie funktioniert der kostenlose Test?",
    a: `Du lädst den Kojalytics Launcher, klickst dort unter Einstellungen › Lizenz auf „${TRIAL_DAYS} Tage kostenlos testen“ und installierst die Apps, die du brauchst. ${TRIAL_DAYS} Tage lang nutzt du alle Apps kostenlos, ohne Zahlungsdaten und ohne Konto. Überzeugen sie dich, kaufst du die Lizenz für ${PLANS.lifetime.label} einmalig. Wenn du nichts tust, endet der Test einfach und du zahlst nichts.`,
  },
  replaces,
  {
    q: "Auf welchen Computern laufen die Apps?",
    a: "Auf dem Mac und unter Windows: Die Koja-Apps gibt es für macOS (Apple-Chip und Intel) und für Windows 10 und 11 (64-Bit), nicht für iPad, iPhone oder Android und nicht im Browser. Eine Lizenz gilt für bis zu 3 Geräte, Mac und Windows-PC gemischt.",
  },
  openSource,
  account,
  data,
  german,
];
