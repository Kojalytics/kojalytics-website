import type { Metadata } from "next";
import WindowsInstallationView from "@/views/WindowsInstallationView";
import { alternates, ogLocale } from "@/lib/i18n";
import { DEFAULT_OG_IMAGE, OG_BASE } from "@/lib/site";

const title = "Installing the Koja apps on Windows";
const description =
  "Step by step: how to install the Kojalytics Launcher on Windows 10 and 11, and why Windows asks for confirmation once for new programs.";

export const metadata: Metadata = {
  title,
  description,
  alternates: alternates("en", "/support/windows-installation"),
  openGraph: {
    ...OG_BASE,
    locale: ogLocale("en"),
    title,
    description,
    url: "/en/support/windows-installation",
    images: [{ ...DEFAULT_OG_IMAGE, alt: "Koja Office on a Mac" }],
  },
};

export default function WindowsInstallationPageEn() {
  return <WindowsInstallationView lang="en" />;
}
