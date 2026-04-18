import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PLANS, type PlanId } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('REPLACE')) {
      return NextResponse.json({ error: 'Stripe is not configured yet' }, { status: 503 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { plan, jobId, locale, userId } = await request.json();

    if (!plan || !PLANS[plan as PlanId]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const planData = PLANS[plan as PlanId];
    const origin = request.headers.get('origin') || 'https://kojalytics.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: planData.currency,
            product_data: {
              name: `AI Headshot — ${planData.portraits} Portraits (${plan === 'starter' ? 'Starter' : 'Premium'})`,
              description: `${planData.portraits} professionelle KI-generierte Bewerbungsfotos`,
              images: ['https://kojalytics.com/og-aiheadshot.jpg'],
            },
            unit_amount: planData.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/${locale || 'de'}/aiheadshot/app?payment=success&plan=${plan}&jobId=${jobId}`,
      cancel_url: `${origin}/${locale || 'de'}/aiheadshot/app?payment=cancelled`,
      metadata: {
        plan,
        jobId: jobId || '',
        userId: userId || '',
        portraits: String(planData.portraits),
      },
      locale: (locale === 'de' ? 'de' : locale === 'fr' ? 'fr' : locale === 'es' ? 'es' : locale === 'nl' ? 'nl' : locale === 'da' ? 'da' : locale === 'sv' ? 'sv' : 'en') as 'de' | 'en' | 'fr' | 'es' | 'nl' | 'da' | 'sv',
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
