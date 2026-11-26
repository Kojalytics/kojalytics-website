"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Lang } from "@/lib/i18n";

const T = {
  de: { copy: "Schlüssel kopieren", copied: "Kopiert", selected: "Markiert" },
  en: { copy: "Copy key", copied: "Copied", selected: "Selected" },
};

/**
 * Copies within the tap itself. execCommand on a read-only textarea first: iOS Safari and the Facebook/Instagram
 * in-app browsers allow it there, while their Clipboard API may refuse. Then the Clipboard API.
 */
function copyText(text: string): Promise<boolean> {
  const active = document.activeElement as HTMLElement | null;
  const area = document.createElement("textarea");
  area.value = text;
  area.readOnly = true; // no keyboard on phones
  area.style.cssText = "position:fixed;top:0;left:0;opacity:0;font-size:16px"; // 16px: iOS does not zoom in
  document.body.appendChild(area);
  area.select();
  area.setSelectionRange(0, text.length); // iOS ignores select() alone
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {}
  area.remove();
  active?.focus();
  if (ok) return Promise.resolve(true);
  return navigator.clipboard?.writeText(text).then(() => true, () => false) ?? Promise.resolve(false);
}

/** The license key on the thank-you page with a copy button; a tap on the key copies it too. */
export default function LicenseKey({ value, lang }: { value: string; lang: Lang }) {
  const t = T[lang];
  const keyRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [done, setDone] = useState<"copied" | "selected" | null>(null);

  async function copy() {
    let result: "copied" | "selected" = "copied";
    if (!(await copyText(value))) {
      // Nothing could be copied: select the key, so the phone's own "Copy" works.
      const range = document.createRange();
      range.selectNodeContents(keyRef.current!);
      getSelection()?.removeAllRanges();
      getSelection()?.addRange(range);
      result = "selected";
    }
    setDone(result);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(null), 3000);
  }

  return (
    <div className="flex flex-col sm:flex-row">
      <div
        ref={keyRef}
        onClick={copy}
        data-clarity-mask="true"
        className="flex-1 cursor-pointer select-all border border-border-strong bg-surface p-5 font-mono text-base tracking-wider wrap-anywhere sm:text-lg"
      >
        {value}
      </div>
      <button type="button" onClick={copy} aria-label={t.copy} className="btn-secondary -mt-px min-h-14 sm:-ml-px sm:mt-0">
        {/* Both labels share one cell, so the button keeps its width when the label changes. */}
        <span aria-hidden className="grid [&>*]:[grid-area:1/1]">
          <span className={`inline-flex items-center justify-center gap-2.5 whitespace-nowrap ${done ? "invisible" : ""}`}>
            <Copy size={16} />
            {t.copy}
          </span>
          <span className={`inline-flex items-center justify-center gap-2.5 whitespace-nowrap text-success ${done ? "" : "invisible"}`}>
            <Check size={16} strokeWidth={2.5} />
            {done === "selected" ? t.selected : t.copied}
          </span>
        </span>
      </button>
      <span className="sr-only" aria-live="polite">
        {done === "copied" ? t.copied : done === "selected" ? t.selected : ""}
      </span>
    </div>
  );
}
