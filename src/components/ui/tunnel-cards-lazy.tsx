"use client";

import dynamic from "next/dynamic";
import type { TunnelItem } from "./tunnel-cards";

// framer-motion and the card images load after the first paint; the headline does not wait for them.
const TunnelCards = dynamic(() => import("./tunnel-cards"), { ssr: false });

export default function TunnelCardsLazy({ items }: { items: TunnelItem[] }) {
  return <TunnelCards items={items} />;
}
