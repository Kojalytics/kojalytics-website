import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, OG_BASE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt: Beratung, Lizenzen und Projekte anfragen",
  description: "Frag Kojalytics nach Beratung, Software-Lizenzen oder deinem App-, Website- oder KI-Projekt. Du bekommst eine persönliche Antwort.",
  alternates: { canonical: "/kontakt" },
  openGraph: { ...OG_BASE, url: "/kontakt", images: [DEFAULT_OG_IMAGE] },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
