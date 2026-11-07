import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt: App-Projekt anfragen",
  description: "Erzähl Kojalytics von deiner App, Website oder deinem KI-Projekt. Ein kleines Software-Studio aus Deutschland, das persönlich antwortet.",
  alternates: { canonical: "/kontakt" },
  openGraph: { url: "/kontakt", images: [DEFAULT_OG_IMAGE] },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
