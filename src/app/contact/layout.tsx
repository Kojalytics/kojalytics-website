import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact: Start Your App Project",
  description: "Tell Kojalytics about your app, web platform or AI project. A small software studio from Germany, answering personally.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", images: [DEFAULT_OG_IMAGE] },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
