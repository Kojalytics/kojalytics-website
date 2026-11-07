export const TRIAL_DAYS = 3;

export const PLANS = {
  monthly: { cents: 299, label: "2,99 €", per: "pro Monat", name: "Monatlich" },
  lifetime: { cents: 7900, label: "79 €", per: "einmalig", name: "Für immer" },
} as const;

export type Plan = keyof typeof PLANS;

// The release file on GitHub. Visitors and e-mails use DOWNLOAD_PATH, which redirects there (see next.config.ts).
export const LAUNCHER_DOWNLOAD_URL =
  "https://github.com/Kojalytics/craft-launcher/releases/latest/download/Kojalytics-Launcher.dmg";
export const DOWNLOAD_PATH = "/download/mac";
