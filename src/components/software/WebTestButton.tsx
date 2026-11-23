import { MousePointerClick } from "lucide-react";

/**
 * "Sofort im Browser testen": opens the Koja apps in the browser (/web, or one app with `app`), free and without an
 * account. Indigo like the Koja Office 2026 look, next to the green buy button.
 */
export default function WebTestButton({ app, className = "", label = "Sofort im Browser testen" }: { app?: string; className?: string; label?: string }) {
  return (
    <a
      href={app ? `/web/${app}` : "/web"}
      className={`inline-flex min-h-[48px] flex-col items-center justify-center gap-0.5 border border-[#5145e5] bg-[#5145e5] px-[22px] py-2 text-white transition-colors hover:border-[#4338ca] hover:bg-[#4338ca] ${className}`}
    >
      <span className="flex items-center gap-2.5 font-mono text-[12px] font-semibold uppercase leading-tight tracking-[0.14em]">
        <MousePointerClick size={18} strokeWidth={2.2} aria-hidden />
        {label}
      </span>
      <span className="text-[11.5px] leading-tight text-white/80">ohne Konto · ohne Download · kostenlos</span>
    </a>
  );
}
