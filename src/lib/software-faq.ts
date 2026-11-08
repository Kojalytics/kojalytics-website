import type { FaqItem } from "@/components/software/Faq";
import { TRIAL_DAYS } from "@/lib/pricing";

export const SOFTWARE_FAQ: FaqItem[] = [
  {
    q: "Was bekomme ich für 2,99 € im Monat?",
    a: "Alle 13 Koja-Apps für Mac und Windows: Bildbearbeitung, Fotobibliothek mit RAW-Entwicklung, Vektorgrafik, Layout, Interface-Design, Videoschnitt, Motion Graphics, Audio, Textverarbeitung, Tabellen, Präsentationen, PDF und CAD. Alle Updates sind inklusive, und du nutzt die Apps auf bis zu 3 Geräten, Mac und Windows-PC gemischt.",
  },
  {
    q: "Wie funktioniert der kostenlose Test?",
    a: `Du lädst den Kojalytics Launcher, installierst die Apps, die du brauchst, und nutzt sie ${TRIAL_DAYS} Tage lang kostenlos, ohne Zahlungsdaten. Danach entscheidest du dich für 2,99 € im Monat oder 79 € einmalig. Wenn du nichts tust, endet der Test einfach und du zahlst nichts.`,
  },
  {
    q: "Wie kündige ich?",
    a: "Jederzeit online unter [Verträge hier kündigen](/kuendigen), den Link findest du unten auf jeder Seite: Name und E-Mail-Adresse eingeben und auf „Jetzt kündigen“ klicken. Eine Gebühr fällt nicht an. Dein Abo läuft bis zum Ende des bereits bezahlten Monats, die Bestätigung bekommst du per E-Mail.",
  },
  {
    q: "Ersetzen die Koja-Apps Adobe Creative Cloud oder Microsoft Office?",
    a: "Noch nicht vollständig. Die Koja-Apps sind frühe Versionen (Alpha, teils Pre-Alpha): Sie folgen den Arbeitsweisen, die du kennst, und öffnen gängige Dateien wie .docx, .xlsx, .pptx und .psd, aber manche Profi-Funktionen fehlen noch. Für viele alltägliche Aufgaben reichen sie schon. Teste sie kostenlos mit deinen eigenen Dateien, bevor du zahlst.",
  },
  {
    q: "Auf welchen Computern laufen die Apps?",
    a: "Auf dem Mac und unter Windows: Die Koja-Apps gibt es für macOS (Apple-Chip und Intel) und für Windows 10 und 11 (64-Bit), nicht für iPad, iPhone oder Android und nicht im Browser. Ein Abo oder eine Lizenz gilt für bis zu 3 Geräte, Mac und Windows-PC gemischt.",
  },
  {
    q: "Der Quellcode ist offen. Warum kostet es Geld?",
    a: "Die Koja-Apps basieren auf quelloffener Software des ArtCraft-Teams. Du bezahlst uns für installierbare, signierte Versionen für Mac und Windows, den Launcher, der sie installiert und aktualisiert, und Support von einem echten Studio aus Deutschland.",
  },
  {
    q: "Brauche ich ein Konto oder Internet?",
    a: "Kein Konto. Die Apps laufen direkt auf deinem Computer und funktionieren offline. Internet brauchst du nur für den Download und zum Aktivieren deiner Lizenz.",
  },
  {
    q: "Sind meine Daten sicher?",
    a: "Deine Dateien bleiben auf deinem Computer. Die Apps laden deine Arbeit nirgendwo hoch, und unsere Website setzt Tracking-Cookies nur mit deiner Einwilligung.",
  },
  {
    q: "Sind die Apps auf Deutsch?",
    a: "Noch nicht alle. WordKoja, PdfKoja, VectorKoja und LightKoja gibt es mit deutscher Oberfläche. Bei GridKoja, CADKoja und FigKoja ist sie erst teilweise übersetzt, bei EffectKoja sind die Effektparameter größtenteils englisch. PhotoKoja, DeckKoja und SoundKoja sind bisher nur englisch beschriftet. Prüf im kostenlosen Test, ob dich das stört.",
  },
];
