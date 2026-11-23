"use client";

import { usePathname } from "next/navigation";
import { langOf, type Lang } from "@/lib/i18n";

/** The language of the current page, from its path (English pages live under /en). For client components. */
export function useLang(): Lang {
  return langOf(usePathname() ?? "/");
}
