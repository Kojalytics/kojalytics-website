"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";

/**
 * Shown for 12 seconds after a click on a download button: what to do with the file. Hovering or focusing it
 * holds it open. Rendered into <body>, because the header's backdrop blur would trap a fixed element inside it.
 */
export default function DownloadToast({ windows, onClose }: { windows: boolean; onClose: () => void }) {
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (held) return;
    const timer = setTimeout(onClose, 12_000);
    return () => clearTimeout(timer);
  }, [held, onClose]);

  return createPortal(
    <div
      role="status"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      className="kj-download-toast fixed inset-x-3 bottom-3 z-[55] flex items-start gap-3 border border-foreground bg-white py-3.5 pl-4 pr-2 text-[14px] leading-snug sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[25rem]"
    >
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="font-semibold text-foreground">Download läuft.</p>
        <p className="mt-1 text-muted">
          {windows
            ? "Falls Windows warnt: auf „Weitere Informationen“ und dann „Trotzdem ausführen“ klicken."
            : "Öffne die heruntergeladene Datei und folge den Schritten."}
        </p>
        {windows && (
          <Link href="/support/windows-installation" className="link-hud mt-2.5">
            Anleitung
            <ArrowUpRight size={14} aria-hidden />
          </Link>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Hinweis schließen"
        className="grid h-9 w-9 shrink-0 place-items-center text-muted transition-colors hover:text-foreground"
      >
        <X size={16} aria-hidden />
      </button>
    </div>,
    document.body,
  );
}
