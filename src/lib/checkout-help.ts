/**
 * Coming back from Stripe Checkout without paying: the checkout's cancel_url (src/app/api/license/checkout/route.ts)
 * carries ?checkout=zurueck. The inline script in layout.tsx then sets html.kj-back before the first paint, and
 * /software and /office show the "Noch unsicher?" box (src/components/software/CheckoutHelp.tsx). Nobody else sees it.
 */
export const CHECKOUT_BACK_PARAM = "checkout";
export const CHECKOUT_BACK_VALUE = "zurueck";

export const SUPPORT_PHONE = "+49 1520 1482416";
export const SUPPORT_PHONE_HREF = "tel:+4915201482416";
export const SUPPORT_EMAIL = "support@kojalytics.com";
