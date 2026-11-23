import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, OG_BASE } from "@/lib/site";
import { alternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Kontakt: Fragen zu Koja Office",
  description: "Fragen zu Koja Office vor dem Kauf, zur Installation oder zur Lizenz? Schreib uns, du bekommst eine persönliche Antwort.",
  alternates: alternates("de", "/kontakt"),
  openGraph: { ...OG_BASE, url: "/kontakt", images: [DEFAULT_OG_IMAGE] },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
