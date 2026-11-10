// Conversion events for ads. Nothing is sent unless the visitor accepted tracking:
// the Meta Pixel and Google tag only exist on window after consent (see Consent.tsx).

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// SendToMac is our own event: a phone or tablet visitor sends the page to their computer (no download possible there).
type Event = "ViewContent" | "Lead" | "InitiateCheckout" | "Subscribe" | "Purchase" | "SendToMac";

// Google's recommended event names for the same moments.
const GOOGLE_NAMES: Record<Event, string> = {
  ViewContent: "view_item",
  Lead: "generate_lead",
  InitiateCheckout: "begin_checkout",
  Subscribe: "purchase",
  Purchase: "purchase",
  SendToMac: "share",
};

export function track(
  event: Event,
  params: { value?: number; currency?: string; content_name?: string; transaction_id?: string } = {},
  options: { eventID?: string } = {},
) {
  if (typeof window === "undefined") return;
  window.fbq?.(event === "SendToMac" ? "trackCustom" : "track", event, params, options);
  window.gtag?.("event", GOOGLE_NAMES[event], params);
}
