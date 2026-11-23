import type { FaqItem } from "@/components/software/Faq";
import { PLANS, TRIAL_DAYS } from "@/lib/pricing";
import type { Lang } from "@/lib/i18n";

// Answers that hold for both offers: the /software page (monthly or one-time) and the Digistore24 partner page (one-time only).
const replaces: FaqItem = {
  q: "Ersetzen die Koja-Apps Adobe Creative Cloud oder Microsoft Office?",
  a: "Für viele alltägliche Aufgaben ja. Die Koja-Apps folgen den Arbeitsweisen, die du kennst, und öffnen gängige Dateien wie .docx, .xlsx, .pptx und .psd. Nicht jede Profi-Funktion der großen Programme ist enthalten. Die Apps werden laufend weiterentwickelt, Updates und neue Funktionen bekommst du kostenlos. Teste sie kostenlos mit deinen eigenen Dateien, bevor du zahlst.",
};

const updates: FaqItem = {
  q: "Sind Updates und neue Funktionen inklusive?",
  a: "Ja. Die Koja-Apps werden laufend weiterentwickelt. Updates und neue Funktionen bekommst du automatisch und kostenlos über den Kojalytics Launcher. Kojalytics entwickelt, prüft und signiert die Apps und beantwortet deine Fragen per E-Mail, als echtes Studio aus Deutschland.",
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
  a: "Teilweise. WordKoja, PdfKoja, VectorKoja und LightKoja gibt es mit deutscher Oberfläche. Bei GridKoja, CADKoja und FigKoja ist sie teilweise übersetzt, bei EffectKoja sind die Effektparameter größtenteils englisch. PhotoKoja, DeckKoja und SoundKoja sind englisch beschriftet. Prüf im kostenlosen Test, ob dich das stört.",
};

const APP_LIST =
  "Bildbearbeitung, Fotobibliothek mit RAW-Entwicklung, Vektorgrafik, Layout, Interface-Design, Videoschnitt, Motion Graphics, Audio, Textverarbeitung, Tabellen, Präsentationen, PDF und CAD";

export const SOFTWARE_FAQ: FaqItem[] = [
  {
    q: "Was bekomme ich für 19,99 € im Monat?",
    a: `Alle 13 Koja-Apps für Mac und Windows: ${APP_LIST}. Alle Updates sind inklusive, und du nutzt die Apps auf bis zu 3 Geräten, Mac und Windows-PC gemischt.`,
  },
  {
    q: "Wie funktioniert der kostenlose Test?",
    a: `Du lädst den Kojalytics Launcher, klickst dort unter Einstellungen › Lizenz auf „${TRIAL_DAYS} Tage kostenlos testen“ und installierst die Apps, die du brauchst. ${TRIAL_DAYS} Tage lang nutzt du alle Apps kostenlos, ohne Zahlungsdaten und ohne Konto. Danach entscheidest du dich für 19,99 € im Monat oder 79 € einmalig. Wenn du nichts tust, endet der Test einfach und du zahlst nichts.`,
  },
  {
    q: "Wie kündige ich?",
    a: "Jederzeit online unter [Verträge hier kündigen](/kuendigen), den Link findest du unten auf jeder Seite: Name und E-Mail-Adresse eingeben und auf „Jetzt kündigen“ klicken. Eine Gebühr fällt nicht an. Dein Abo läuft bis zum Ende des bereits bezahlten Monats, die Bestätigung bekommst du per E-Mail.",
  },
  replaces,
  {
    q: "Auf welchen Computern laufen die Apps?",
    a: "Auf dem Mac und unter Windows: Die Koja-Apps gibt es für macOS (Apple-Chip und Intel) und für Windows 10 und 11 (64-Bit), nicht für iPad, iPhone oder Android. Zum Ausprobieren laufen 10 der Apps auch im Browser, ohne Installation. Ein Abo oder eine Lizenz gilt für bis zu 3 Geräte, Mac und Windows-PC gemischt.",
  },
  updates,
  account,
  data,
  german,
];

/** The Digistore24 partner page (/software/partner) sells only the one-time license: no subscription in any answer. */
export const PARTNER_FAQ: FaqItem[] = [
  {
    q: `Was bekomme ich für ${PLANS.lifetime.label}?`,
    a: `Alle 13 Koja-Apps für Mac und Windows: ${APP_LIST}. Updates bekommst du über den Kojalytics Launcher, und du nutzt die Apps auf bis zu 3 Geräten, Mac und Windows-PC gemischt.`,
  },
  {
    q: "Ist das ein Abo?",
    a: `Nein. Du zahlst einmal ${PLANS.lifetime.label}. Es verlängert sich nichts, und du musst nichts kündigen.`,
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
    a: "Auf dem Mac und unter Windows: Die Koja-Apps gibt es für macOS (Apple-Chip und Intel) und für Windows 10 und 11 (64-Bit), nicht für iPad, iPhone oder Android. Zum Ausprobieren laufen 10 der Apps auch im Browser, ohne Installation. Eine Lizenz gilt für bis zu 3 Geräte, Mac und Windows-PC gemischt.",
  },
  updates,
  account,
  data,
  german,
];

/** The English answers of the Koja Office pages (SOFTWARE_FAQ in English). */
const SOFTWARE_FAQ_EN: FaqItem[] = [
  {
    q: "What do I get for €19.99 a month?",
    a: "All 13 Koja apps for Mac and Windows: photo editing, a photo library with RAW development, vector graphics, layout, interface design, video editing, motion graphics, audio, word processing, spreadsheets, presentations, PDF and CAD. All updates are included, and you can use the apps on up to 3 devices, Mac and Windows PCs mixed.",
  },
  {
    q: "How does the free trial work?",
    a: `Download the Kojalytics Launcher, click “Try free for ${TRIAL_DAYS} days” under Settings › License and install the apps you need. For ${TRIAL_DAYS} days you use all apps for free, without payment details and without an account. Then you choose €19.99 a month or €79 once. If you do nothing, the trial simply ends and you pay nothing. You can also try 10 of the apps right in your browser first, without installing anything.`,
  },
  {
    q: "How do I cancel?",
    a: "Online, any time, at [Cancel contracts here](/en/cancel); the link is at the bottom of every page. Enter your name and email address and click “Cancel now”. There is no fee. Your subscription runs until the end of the month you have already paid for, and you get a confirmation by email.",
  },
  {
    q: "Do the Koja apps replace Adobe Creative Cloud or Microsoft Office?",
    a: "For many everyday tasks, yes. The Koja apps follow the ways of working you know and open common files such as .docx, .xlsx, .pptx and .psd. Not every professional feature of the big programs is included. The apps are under active development, and you get updates and new features for free. Try them for free with your own files before you pay.",
  },
  {
    q: "Which computers do the apps run on?",
    a: "On Mac and Windows: the Koja apps are available for macOS (Apple silicon and Intel) and for Windows 10 and 11 (64-bit), not for iPad, iPhone or Android. To try them, 10 of the apps also run in your browser, without installing. A subscription or license covers up to 3 devices, Mac and Windows PCs mixed.",
  },
  {
    q: "Are updates and new features included?",
    a: "Yes. The Koja apps are under active development. You get updates and new features automatically and for free through the Kojalytics Launcher. Kojalytics develops, tests and signs the apps and answers your questions by email, as a real studio from Germany.",
  },
  {
    q: "Do I need an account or the internet?",
    a: "No account. The apps run directly on your computer and work offline. You only need the internet to download them and to activate your license.",
  },
  {
    q: "Is my data safe?",
    a: "Your files stay on your computer. The apps don't upload your work anywhere, and our website only sets tracking cookies with your consent.",
  },
  {
    q: "Which language are the apps in?",
    a: "The apps are built in English, so their interface is English. Some also have translations, for example WordKoja, PdfKoja, VectorKoja and LightKoja in German. Check in the free trial whether everything is clear to you.",
  },
];

/** The FAQ of the Koja Office pages in a language. */
export const softwareFaq = (lang: Lang): FaqItem[] => (lang === "de" ? SOFTWARE_FAQ : SOFTWARE_FAQ_EN);
