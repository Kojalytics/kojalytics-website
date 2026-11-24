// Google Ads tag: loaded after consent in Consent.tsx; purchases are reported in TrackPurchase.tsx.

export const GOOGLE_ADS_ID = 'AW-17685521393';

// "Kauf Koja Office" (created 24.11.2026): the purchase Google Ads search campaigns optimise for.
export const KOJA_PURCHASE_LABEL = 'juaKCM-x0r4dEPHHjvFB';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
