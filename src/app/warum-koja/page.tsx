import type { Metadata } from "next";
import WhyView from "@/views/WhyView";
import { OG_BASE } from "@/lib/site";
import { alternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Warum Koja Office: einmal zahlen, offline, echter Support",
  description:
    "Warum Leute von Abo-Software zu Koja Office wechseln: einmal zahlen statt Abo, echte Desktop-Apps ohne Konto und Cloud, Support von Kojalytics aus Hamburg.",
  alternates: alternates("de", "/warum-koja"),
  openGraph: { ...OG_BASE, title: "Warum Koja Office", url: "/warum-koja", images: [{ url: "/og/software.jpg", width: 1200, height: 630, alt: "Die Koja-Apps auf dem Mac" }] },
};

export default function WhyPage() {
  return <WhyView lang="de" />;
}
