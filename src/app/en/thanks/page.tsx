import type { Metadata } from "next";
import ThanksView from "@/views/ThanksView";
import { alternates } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Thank you for your purchase", robots: { index: false }, alternates: alternates("en", "/software/danke") };

export default function ThanksPageEn({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  return <ThanksView lang="en" searchParams={searchParams} />;
}
