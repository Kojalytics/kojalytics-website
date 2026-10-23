"use client";

import { openConsent } from "@/components/Consent";

export default function CookieSettingsButton() {
  return (
    <button onClick={openConsent} className="text-sm text-muted transition-colors hover:text-foreground">
      Cookie settings
    </button>
  );
}
