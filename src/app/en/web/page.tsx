import type { Metadata } from "next";
import WebView from "@/views/WebView";
import { OG_BASE } from "@/lib/site";
import { alternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Try the Koja apps in your browser – free, no account",
  description:
    "Try WordKoja, GridKoja, DeckKoja, PdfKoja and more Koja apps right in your browser. Free, no account, your files stay on your device.",
  alternates: alternates("en", "/web"),
  openGraph: { ...OG_BASE, locale: "en_US", title: "Try the Koja apps in your browser", url: "/en/web" },
};

export default function WebAppsPageEn() {
  return <WebView lang="en" />;
}
