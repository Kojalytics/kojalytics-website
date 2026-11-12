import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, OG_BASE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Koja-Apps unter Windows installieren",
  description:
    "Schritt für Schritt: So installierst du den Kojalytics Launcher unter Windows 10 und 11, und warum Windows bei neuen Programmen einmal nachfragt.",
  alternates: { canonical: "/support/windows-installation" },
  openGraph: { ...OG_BASE, url: "/support/windows-installation", images: [DEFAULT_OG_IMAGE] },
};

export default function WindowsInstallationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
