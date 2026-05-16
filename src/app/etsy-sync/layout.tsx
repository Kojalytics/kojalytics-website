import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Etsy Sync — Sell on Etsy, Manage in Shopify | Kojalytics",
  description:
    "Sync your Shopify products to Etsy with one click. Orders flow back automatically. Ship, track, and manage everything from Shopify. Free 7-day trial.",
  keywords: [
    "shopify etsy integration",
    "etsy sync",
    "shopify etsy app",
    "sell on etsy from shopify",
    "etsy order sync",
    "shopify multichannel",
    "etsy product sync",
  ],
  openGraph: {
    title: "Etsy Sync — Sell on Etsy, Manage in Shopify",
    description:
      "Sync products to Etsy. Import orders to Shopify. Ship from one place.",
    url: "https://www.kojalytics.com/etsy-sync",
    siteName: "Kojalytics",
    type: "website",
  },
};

export default function EtsySyncLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
