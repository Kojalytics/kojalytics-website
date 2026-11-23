"use client";

import { MousePointerClick } from "lucide-react";
import { href } from "@/lib/i18n";
import { useLang } from "@/lib/use-lang";

const de = { label: "Sofort im Browser testen", note: "ohne Konto · ohne Download · kostenlos" };
const en: typeof de = { label: "Try it in your browser", note: "no account · no download · free" };

/**
 * "Sofort im Browser testen": opens the Koja apps in the browser (/web, or one app with `app`), free and without an
 * account. Indigo like the Koja Office 2026 look, next to the green buy button. On English pages it says "Try it in
 * your browser" and opens /en/web or /web/<slug>?lang=en.
 */
export default function WebTestButton({ app, className = "", label }: { app?: string; className?: string; label?: string }) {
  const lang = useLang();
  const t = lang === "de" ? de : en;
  return (
    <a
      href={href(lang, app ? `/web/${app}` : "/web")}
      className={`inline-flex min-h-[48px] flex-col items-center justify-center gap-0.5 border border-[#5145e5] bg-[#5145e5] px-[22px] py-2 text-white transition-colors hover:border-[#4338ca] hover:bg-[#4338ca] ${className}`}
    >
      <span className="flex items-center gap-2.5 font-mono text-[12px] font-semibold uppercase leading-tight tracking-[0.14em]">
        <MousePointerClick size={18} strokeWidth={2.2} aria-hidden />
        {label ?? t.label}
      </span>
      <span className="text-[11.5px] leading-tight text-white/80">{t.note}</span>
    </a>
  );
}
