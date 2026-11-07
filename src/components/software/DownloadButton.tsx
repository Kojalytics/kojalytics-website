"use client";

import { Download } from "lucide-react";
import { LAUNCHER_DOWNLOAD_URL, TRIAL_DAYS } from "@/lib/pricing";
import { track } from "@/lib/track";

export default function DownloadButton({
  label = `Kostenlos laden · ${TRIAL_DAYS} Tage testen`,
  source,
  className = "",
}: {
  label?: string;
  /** Where on the site the click happened, for the ad reports. */
  source: string;
  className?: string;
}) {
  return (
    <a href={LAUNCHER_DOWNLOAD_URL} onClick={() => track("Lead", { content_name: source })} className={`btn-primary text-base ${className}`}>
      <Download size={18} strokeWidth={2.4} aria-hidden />
      {label}
    </a>
  );
}
