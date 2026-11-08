"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/** Reports a page view of a product page once, for ad optimisation. */
export default function TrackView({ name }: { name: string }) {
  useEffect(() => {
    // Tags load a moment after consent; give them time before reporting.
    const t = setTimeout(() => track("ViewContent", { content_name: name }), 1500);
    return () => clearTimeout(t);
  }, [name]);
  return null;
}
