import { loadStripe } from '@stripe/stripe-js';

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
export const stripePromise = stripeKey && !stripeKey.includes('REPLACE')
  ? loadStripe(stripeKey)
  : null;

export const PLANS = {
  starter: {
    portraits: 12,
    price: 999, // cents
    priceFormatted: '9,99',
    currency: 'eur',
    styles: 1,
    features: ['12 KI-Portraits', '6 Styles', 'HD Download', 'Fertig in 5 Min'],
  },
  premium: {
    portraits: 24,
    price: 2099, // cents
    priceFormatted: '20,99',
    currency: 'eur',
    styles: 2,
    features: ['24 KI-Portraits', '12 Styles', 'Ultra-HD Download', 'Priorität', 'Hintergrund-Anpassung', '30 Tage Speicher'],
  },
} as const;

export type PlanId = keyof typeof PLANS;
