import type { FaqItem } from "@/components/software/Faq";
import { TRIAL_DAYS } from "@/lib/pricing";

export const SOFTWARE_FAQ: FaqItem[] = [
  {
    q: "Was bekomme ich für 2,99 € im Monat?",
    a: "Alle 13 Koja-Apps für den Mac: Bildbearbeitung, Fotobibliothek mit RAW-Entwicklung, Vektorgrafik, Layout, Interface-Design, Videoschnitt, Motion Graphics, Audio, Textverarbeitung, Tabellen, Präsentationen, PDF und CAD. Alle Updates sind inklusive, auf bis zu 3 Macs.",
  },
  {
    q: "Wie funktioniert der kostenlose Test?",
    a: `Du lädst den Kojalytics Launcher, installierst die Apps, die du brauchst, und nutzt alle ${TRIAL_DAYS} Tage kostenlos. Danach entscheidest du dich für 2,99 € im Monat oder 79 € einmalig. Wenn du nichts tust, zahlst du nichts.`,
  },
  {
    q: "Wie kündige ich?",
    a: "Mit einem Klick unter [Verträge hier kündigen](/kuendigen). Ohne Gebühr, ohne Anruf, ohne Kündigungsschreiben. Dein Abo läuft bis zum Ende des bereits bezahlten Monats, die Bestätigung kommt sofort per E-Mail.",
  },
  {
    q: "Ersetzen die Koja-Apps Adobe Creative Cloud oder Microsoft Office?",
    a: "Für viele alltägliche Aufgaben ja: Die Apps folgen den Arbeitsweisen, die du kennst, und öffnen gängige Dateien wie .docx, .xlsx und .pptx. Die Apps sind noch jung und haben nicht jede Profi-Funktion. Teste sie deshalb kostenlos mit deinen eigenen Dateien, bevor du zahlst.",
  },
  {
    q: "Auf welchen Computern laufen die Apps?",
    a: "Die Koja-Apps laufen auf macOS. Ein Abo oder eine Lizenz gilt für bis zu 3 Macs.",
  },
  {
    q: "Der Quellcode ist offen. Warum kostet es Geld?",
    a: "Die Koja-Apps basieren auf den quelloffenen Craft-Apps des ArtCraft-Teams. Du bezahlst uns für fertige, signierte Mac-Versionen, den Launcher, der sie installiert und aktualisiert, und Support von einem echten Studio aus Deutschland.",
  },
  {
    q: "Brauche ich ein Konto oder Internet?",
    a: "Kein Konto. Die Apps laufen direkt auf deinem Mac und funktionieren offline. Internet brauchst du nur für den Download und zum Aktivieren deiner Lizenz.",
  },
  {
    q: "Sind meine Daten sicher?",
    a: "Deine Dateien bleiben auf deinem Mac. Die Apps laden deine Arbeit nirgendwo hoch, und unsere Website setzt Tracking-Cookies nur mit deiner Einwilligung.",
  },
];
