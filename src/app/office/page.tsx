import type { Metadata } from "next";
import OfficeView from "@/views/OfficeView";
import { TRIAL_DAYS } from "@/lib/pricing";
import { alternates } from "@/lib/i18n";
import { OG_BASE } from "@/lib/site";

// Landing page for the Meta ads. The page itself: src/views/OfficeView.tsx (English at /en/office).

export const metadata: Metadata = {
  title: { absolute: "Koja Office 2026 – Office ohne Abo für Mac und Windows | Kojalytics" },
  description: `Word-, Excel-, PowerPoint- und PDF-Dateien öffnen und bearbeiten, ohne Abo. Für Mac und Windows, einmal zahlen. ${TRIAL_DAYS} Tage kostenlos testen.`,
  alternates: alternates("de", "/office"),
  robots: { index: false, follow: true },
  openGraph: {
    ...OG_BASE,
    title: "Koja Office 2026: Office ohne Abo. Einmal zahlen, behalten.",
    description: "Word-, Excel-, PowerPoint- und PDF-Dateien öffnen und bearbeiten. Für Mac und Windows.",
    url: "/office",
    images: [{ url: "/og/software.jpg", width: 1200, height: 630, alt: "Koja Office auf dem Mac" }],
  },
};

export default function OfficePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <OfficeView lang="de" searchParams={searchParams} />;
}
