// Google Ads tracking — load via <GoogleTag /> in root layout, fire
// conversions via trackPurchase() from any client component.

export const GOOGLE_ADS_ID = 'AW-10821780615';

// Conversion label for the "Purchase - AIHeadshot" action.
// Generated in Google Ads → Conversions → Purchase → Tag-Snippet.
// Format: the part AFTER the slash in `send_to: 'AW-XXX/<LABEL>'`.
export const PURCHASE_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GADS_PURCHASE_LABEL ?? '';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export interface PurchaseEvent {
  value: number;       // EUR amount, e.g. 9.99
  currency: string;    // ISO code, e.g. 'EUR'
  transactionId: string; // unique per order — Stripe Checkout Session ID
}

export function trackPurchase(e: PurchaseEvent): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  if (!PURCHASE_CONVERSION_LABEL) {
    console.warn('[gtag] PURCHASE_CONVERSION_LABEL not set — conversion not fired');
    return;
  }
  window.gtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_ID}/${PURCHASE_CONVERSION_LABEL}`,
    value: e.value,
    currency: e.currency,
    transaction_id: e.transactionId,
  });
}
