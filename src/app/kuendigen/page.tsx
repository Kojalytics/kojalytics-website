import type { Metadata } from "next";
import CancelView from "@/views/CancelView";
import { alternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Verträge hier kündigen",
  description: "Kündige dein Koja-Apps-Abo online: Name und E-Mail eingeben, „Jetzt kündigen“ klicken. Ohne Login, ohne Gebühr, mit Eingangsbestätigung per E-Mail.",
  alternates: alternates("de", "/kuendigen"),
};

export default function CancelPage() {
  return <CancelView lang="de" />;
}
