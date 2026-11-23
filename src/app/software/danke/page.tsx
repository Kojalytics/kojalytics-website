import type { Metadata } from "next";
import ThanksView from "@/views/ThanksView";
import { alternates } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Danke für deinen Kauf", robots: { index: false }, alternates: alternates("de", "/software/danke") };

export default function ThanksPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  return <ThanksView lang="de" searchParams={searchParams} />;
}
