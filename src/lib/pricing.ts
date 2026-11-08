export const TRIAL_DAYS = 3;

export const PLANS = {
  monthly: { cents: 299, label: "2,99 €", per: "pro Monat", name: "Monatlich" },
  lifetime: { cents: 7900, label: "79 €", per: "einmalig", name: "Für immer" },
} as const;

export type Plan = keyof typeof PLANS;

// The release files on GitHub. Visitors and e-mails use the DOWNLOAD_PATH addresses, which redirect there (see next.config.ts).
export const LAUNCHER_DOWNLOAD_URL =
  "https://github.com/Kojalytics/craft-launcher/releases/latest/download/Kojalytics-Launcher.dmg";
export const DOWNLOAD_PATH = "/download/mac";
export const LAUNCHER_DOWNLOAD_URL_WINDOWS =
  "https://github.com/Kojalytics/craft-launcher/releases/latest/download/Kojalytics-Launcher.msi";
export const DOWNLOAD_PATH_WINDOWS = "/download/windows";
