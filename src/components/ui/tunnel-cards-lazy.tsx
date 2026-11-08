"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { TunnelItem } from "./tunnel-cards";

// framer-motion and the card images load only after the page has finished loading, so the
// headline, the buttons and the first screenshots never compete with them.
const TunnelCards = dynamic(() => import("./tunnel-cards"), { ssr: false });

export default function TunnelCardsLazy({ items }: { items: TunnelItem[] }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const go = () => setReady(true);
    if (document.readyState === "complete") {
      const t = setTimeout(go, 0);
      return () => clearTimeout(t);
    }
    window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, []);
  return ready ? <TunnelCards items={items} /> : null;
}
