import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, OG_BASE } from "@/lib/site";
import { alternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Hilfe & Support",
  description: "Hilfe zu den Koja-Apps und AI Headshot: Lizenz aktivieren, Abo kündigen, Datenschutz. Schreib an support@kojalytics.com.",
  alternates: alternates("de", "/support"),
  openGraph: { ...OG_BASE, url: "/support", images: [DEFAULT_OG_IMAGE] },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
