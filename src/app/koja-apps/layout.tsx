import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koja Apps – Office & Kreativ-Apps für den Mac | Kojalytics",
  description:
    "WordKoja, GridKoja, DeckKoja und weitere Koja-Apps: einmal kaufen, für immer nutzen. 39,95 € für bis zu 3 Geräte, ohne Abo.",
  openGraph: {
    title: "Koja Apps – einmal kaufen, für immer nutzen",
    description: "Textverarbeitung, Tabellen, Präsentationen und mehr. 39,95 €, ohne Abo.",
    url: "https://www.kojalytics.com/koja-apps",
    siteName: "Kojalytics",
    type: "website",
  },
};

export default function KojaAppsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
