"use client";

import { openConsent } from "@/components/Consent";
import { useLang } from "@/lib/use-lang";

export default function CookieSettingsButton() {
  const lang = useLang();
  return (
    <button onClick={openConsent} className="text-sm text-muted transition-colors hover:text-foreground">
      {lang === "en" ? "Cookie settings" : "Cookie-Einstellungen"}
    </button>
  );
}
