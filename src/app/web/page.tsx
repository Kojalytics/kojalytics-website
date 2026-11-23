import type { Metadata } from "next";
import WebView from "@/views/WebView";
import { OG_BASE } from "@/lib/site";
import { alternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Koja-Apps im Browser testen – kostenlos, ohne Konto",
  description:
    "WordKoja, GridKoja, DeckKoja, PdfKoja und weitere Koja-Apps direkt im Browser ausprobieren. Kostenlos, ohne Konto, deine Dateien bleiben auf deinem Gerät.",
  alternates: alternates("de", "/web"),
  openGraph: { ...OG_BASE, title: "Koja-Apps im Browser testen", url: "/web" },
};

export default function WebAppsPage() {
  return <WebView lang="de" />;
}
