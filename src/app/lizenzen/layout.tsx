import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Software-Lizenzen mit Beratung",
  description:
    "Office-Pakete, Betriebssysteme und Business-Software für Unternehmen und Privatpersonen. Sag uns, was du brauchst, wir empfehlen die passenden Lizenzen.",
  alternates: { canonical: "/lizenzen" },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: "Software-Lizenzen mit Beratung | Kojalytics",
    description: "Die richtigen Software-Lizenzen für dein Unternehmen, mit persönlicher Beratung von der Anfrage bis zur Einrichtung.",
    url: "/lizenzen",
  },
};

export default function LicensingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
