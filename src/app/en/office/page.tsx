import type { Metadata } from "next";
import OfficeView from "@/views/OfficeView";
import { TRIAL_DAYS } from "@/lib/pricing";
import { alternates, ogLocale } from "@/lib/i18n";
import { OG_BASE } from "@/lib/site";

// Landing page for the English Meta ads. The page itself: src/views/OfficeView.tsx (German at /office).

export const metadata: Metadata = {
  title: { absolute: "Koja Office 2026 – Office without a subscription for Mac and Windows | Kojalytics" },
  description: `Open and edit Word, Excel, PowerPoint and PDF files, no subscription. For Mac and Windows, pay once. Try it free for ${TRIAL_DAYS} days.`,
  alternates: alternates("en", "/office"),
  robots: { index: false, follow: true },
  openGraph: {
    ...OG_BASE,
    locale: ogLocale("en"),
    title: "Koja Office 2026: Office without a subscription. Pay once, keep using it.",
    description: "Open and edit Word, Excel, PowerPoint and PDF files. For Mac and Windows.",
    url: "/en/office",
    images: [{ url: "/og/software.jpg", width: 1200, height: 630, alt: "Koja Office on a Mac" }],
  },
};

export default function OfficePageEn({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <OfficeView lang="en" searchParams={searchParams} />;
}
