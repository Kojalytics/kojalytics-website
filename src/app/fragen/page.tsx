import type { Metadata } from "next";
import FaqView from "@/views/FaqView";
import { alternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Häufige Fragen zu Koja Office: Preis, Lizenz, Geräte",
  description: "Antworten zu Koja Office: Was kostet es, wie viele Geräte, brauche ich ein Konto, welche Dateiformate, wie kündige ich, sind die Apps auf Deutsch?",
  alternates: alternates("de", "/fragen"),
};

export default function FaqPage() {
  return <FaqView lang="de" />;
}
