export const TRIAL_DAYS = 3;

export const PLANS = {
  monthly: { cents: 299, label: "€2.99", per: "/ month", name: "Monthly" },
  lifetime: { cents: 7900, label: "€79", per: "once", name: "Lifetime" },
} as const;

export type Plan = keyof typeof PLANS;

export const LAUNCHER_DOWNLOAD_URL =
  "https://github.com/Kojalytics/craft-launcher/releases/latest/download/Kojalytics-Launcher.dmg";
