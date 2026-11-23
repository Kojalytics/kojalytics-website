"use client";

import { useId, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { Download, MousePointerClick, Send } from "lucide-react";
import { DOWNLOAD_PATH, DOWNLOAD_PATH_WINDOWS, TRIAL_DAYS } from "@/lib/pricing";
import { hasWebApp } from "@/lib/web-apps";
import { href } from "@/lib/i18n";
import { useLang } from "@/lib/use-lang";
import { track } from "@/lib/track";
import DownloadToast from "./DownloadToast";

const de = {
  label: `Kostenlos laden · ${TRIAL_DAYS} Tage testen`,
  webApps: "Apps im Browser testen",
  webNow: "Sofort im Browser testen",
  send: "Link für den Computer senden",
};
const en: typeof de = {
  label: `Download free · ${TRIAL_DAYS}-day trial`,
  webApps: "Try the apps in your browser",
  webNow: "Try it in your browser",
  send: "Send the link to your computer",
};

// Loaded on the first tap only: most visitors never open it.
const SendLinkDialog = dynamic(() => import("./SendLinkDialog"), { ssr: false });

type Platform = "mac" | "windows" | "other";

const subscribe = () => () => {};
const platformNow = (): Platform => {
  if (/Windows NT/.test(navigator.userAgent)) return "windows";
  // iPads also call themselves "Macintosh", but they have a touch screen.
  if (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints < 2) return "mac";
  return "other";
};

// One download toast at a time, shown by the button clicked last (a page has several download buttons).
let toast: { owner: string; n: number } | null = null;
const toastListeners = new Set<() => void>();
const setToast = (next: typeof toast) => {
  toast = next;
  toastListeners.forEach((listener) => listener());
};
const hideToast = () => setToast(null);
const subscribeToast = (listener: () => void) => {
  toastListeners.add(listener);
  return () => {
    toastListeners.delete(listener);
  };
};

/**
 * On a Mac or a Windows PC: downloads the Kojalytics Launcher for that system and shows a short hint on what to do
 * with the file. On phones and tablets nothing can be installed, so by default the button opens the apps in the
 * browser instead (/web, or the app's own browser version). `mobile="send"` keeps the dialog that emails the download
 * links to the computer (after a purchase); `mobile="none"` shows nothing there, for places that already have a
 * browser test button next to it.
 * The server always renders the Mac download link, so crawlers and the first paint see a link.
 */
export default function DownloadButton({
  label,
  webLabel,
  app,
  mobile = "web",
  source,
  className = "",
  variant = "primary",
}: {
  label?: string;
  /** Label of the browser test on phones and tablets. */
  webLabel?: string;
  /** The app whose browser version phones open (falls back to the /web overview). */
  app?: string;
  mobile?: "web" | "send" | "none";
  /** Where on the site the click happened, for the ad reports. */
  source: string;
  className?: string;
  /** "secondary": the outlined look, next to a buy button. */
  variant?: "primary" | "secondary";
}) {
  const lang = useLang();
  const t = lang === "de" ? de : en;
  const platform = useSyncExternalStore(subscribe, platformNow, (): Platform => "mac");
  const id = useId();
  const shownToast = useSyncExternalStore(subscribeToast, () => toast, () => null);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cls = `${variant === "secondary" ? "btn-secondary" : "btn-primary"} sm:whitespace-nowrap ${className}`;

  if (platform !== "other") {
    return (
      <>
        <a
          href={platform === "windows" ? DOWNLOAD_PATH_WINDOWS : DOWNLOAD_PATH}
          onClick={() => {
            track("Lead", { content_name: source });
            setToast({ owner: id, n: (toast?.n ?? 0) + 1 });
          }}
          className={cls}
        >
          <Download size={15} strokeWidth={2.2} aria-hidden />
          {label ?? t.label}
        </a>
        {shownToast?.owner === id && <DownloadToast key={shownToast.n} windows={platform === "windows"} onClose={hideToast} />}
      </>
    );
  }

  if (mobile === "none") return null;

  if (mobile === "web") {
    const web = !!app && hasWebApp(app);
    return (
      <a href={href(lang, web ? `/web/${app}` : "/web")} onClick={() => track("Lead", { content_name: `${source}-web` })} className={cls}>
        <MousePointerClick size={16} strokeWidth={2.2} aria-hidden />
        {webLabel ?? (app && !web ? t.webApps : t.webNow)}
      </a>
    );
  }

  return (
    <>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" className={cls}>
        <Send size={15} strokeWidth={2.2} aria-hidden />
        {t.send}
      </button>
      {open && (
        <SendLinkDialog
          source={source}
          onClose={() => {
            setOpen(false);
            triggerRef.current?.focus();
          }}
        />
      )}
    </>
  );
}
