import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support",
  description: "Help with the Koja apps, AI Headshot and other Kojalytics products. Write to support@kojalytics.com.",
  alternates: { canonical: "/support" },
  openGraph: { url: "/support", images: [DEFAULT_OG_IMAGE] },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
