"use client";

import { useState, useSyncExternalStore } from "react";
import { Download, Send } from "lucide-react";
import { DOWNLOAD_PATH, DOWNLOAD_PATH_WINDOWS, TRIAL_DAYS } from "@/lib/pricing";
import { track } from "@/lib/track";

type Platform = "mac" | "windows" | "other";

const subscribe = () => () => {};
const platformNow = (): Platform => {
  if (/Windows NT/.test(navigator.userAgent)) return "windows";
  // iPads also call themselves "Macintosh", but they have a touch screen.
  if (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints < 2) return "mac";
  return "other";
};

/**
 * On a Mac or a Windows PC: downloads the Kojalytics Launcher for that system. On phones and
 * tablets nothing can be installed, so the button sends the page link to the visitor's computer
 * instead (share sheet, clipboard or e-mail).
 * The server always renders the Mac download link, so crawlers and the first paint see a link.
 */
export default function DownloadButton({
  label = `Kostenlos laden · ${TRIAL_DAYS} Tage testen`,
  shareLabel = "Link für den Computer senden",
  source,
  className = "",
}: {
  label?: string;
  /** Label on devices that cannot install the apps. */
  shareLabel?: string;
  /** Where on the site the click happened, for the ad reports. */
  source: string;
  className?: string;
}) {
  const platform = useSyncExternalStore(subscribe, platformNow, (): Platform => "mac");
  const [copied, setCopied] = useState(false);
  const cls = `btn-primary sm:whitespace-nowrap ${className}`;

  if (platform !== "other") {
    return (
      <a
        href={platform === "windows" ? DOWNLOAD_PATH_WINDOWS : DOWNLOAD_PATH}
        onClick={() => track("Lead", { content_name: source })}
        className={cls}
      >
        <Download size={15} strokeWidth={2.2} aria-hidden />
        {label}
      </a>
    );
  }

  async function sendToComputer() {
    track("SendToMac", { content_name: source });
    const url = `${window.location.origin}/software`;
    const text = `Koja-Apps für Mac und Windows: laden und ${TRIAL_DAYS} Tage kostenlos testen.`;
    if (navigator.share) {
      await navigator.share({ title: "Koja-Apps für Mac und Windows", text, url }).catch(() => {});
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.location.href = `mailto:?subject=${encodeURIComponent("Koja-Apps für Mac und Windows")}&body=${encodeURIComponent(`${text}\n${url}`)}`;
    }
  }

  return (
    <button type="button" onClick={sendToComputer} className={cls}>
      <Send size={15} strokeWidth={2.2} aria-hidden />
      <span aria-live="polite">{copied ? "Link kopiert, öffne ihn am Computer" : shareLabel}</span>
    </button>
  );
}
