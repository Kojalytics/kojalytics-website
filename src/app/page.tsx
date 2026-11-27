import type { Metadata } from "next";
import HomeView from "@/views/HomeView";
import { OG_BASE } from "@/lib/site";
import { alternates } from "@/lib/i18n";

// Rebuilt at least hourly and right after the admin changes a review (src/app/api/admin/reviews).
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: "Koja Office 2026: 13 Apps für Mac & Windows ohne Abo | Kojalytics" },
  description:
    "Koja Office: Bildbearbeitung, Video, Layout, Audio, Office, PDF und CAD für Mac und Windows. Offline, ohne Konto. Einmal 79 € statt Abo, oder 19,99 € im Monat. 3 Tage kostenlos testen.",
  alternates: alternates("de", "/"),
  openGraph: {
    ...OG_BASE,
    title: "Koja Office: 13 Apps für Mac und Windows. Einmal 79 €, kein Abo.",
    description: "Foto, Video, Design, Audio, Office, PDF und CAD. Offline, ohne Konto, jederzeit online kündbar. 3 Tage kostenlos testen.",
    url: "/",
    images: [{ url: "/og/software.jpg", width: 1200, height: 630, alt: "Die Koja-Apps auf dem Mac" }],
  },
};

export default function HomePage() {
  return <HomeView lang="de" />;
}
