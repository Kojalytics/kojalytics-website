"use client";

import { useState, useSyncExternalStore } from "react";
import { Download, Send } from "lucide-react";
import { DOWNLOAD_PATH, TRIAL_DAYS } from "@/lib/pricing";
import { track } from "@/lib/track";

const subscribe = () => () => {};
// iPads also call themselves "Macintosh", but they have a touch screen.
const isMacNow = () => /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints < 2;

/**
 * On a Mac: downloads the Kojalytics Launcher. On phones, tablets and PCs a .dmg is useless, so the
 * button sends the page link to the visitor's Mac instead (share sheet, clipboard or e-mail).
 * The server always renders the download link, so crawlers and the first paint see it.
 */
export default function DownloadButton({
  label = `Kostenlos laden · ${TRIAL_DAYS} Tage testen`,
  shareLabel = "Link für den Mac senden",
  source,
  className = "",
}: {
  label?: string;
  /** Label on devices that cannot install Mac apps. */
  shareLabel?: string;
  /** Where on the site the click happened, for the ad reports. */
  source: string;
  className?: string;
}) {
  const isMac = useSyncExternalStore(subscribe, isMacNow, () => true);
  const [copied, setCopied] = useState(false);
  const cls = `btn-primary sm:whitespace-nowrap ${className}`;

  if (isMac) {
    return (
      <a href={DOWNLOAD_PATH} onClick={() => track("Lead", { content_name: source })} className={cls}>
        <Download size={15} strokeWidth={2.2} aria-hidden />
        {label}
      </a>
    );
  }

  async function sendToMac() {
    track("SendToMac", { content_name: source });
    const url = `${window.location.origin}/software`;
    const text = `Koja-Apps für den Mac: laden und ${TRIAL_DAYS} Tage kostenlos testen.`;
    if (navigator.share) {
      await navigator.share({ title: "Koja-Apps für den Mac", text, url }).catch(() => {});
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.location.href = `mailto:?subject=${encodeURIComponent("Koja-Apps für den Mac")}&body=${encodeURIComponent(`${text}\n${url}`)}`;
    }
  }

  return (
    <button type="button" onClick={sendToMac} className={cls}>
      <Send size={15} strokeWidth={2.2} aria-hidden />
      <span aria-live="polite">{copied ? "Link kopiert, öffne ihn am Mac" : shareLabel}</span>
    </button>
  );
}
