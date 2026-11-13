import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { clientIp, limiter } from '@/lib/form-guard';
import { LICENSE_PRODUCT } from '@/lib/license-sales';
import { sendMetaEvent } from '@/lib/meta';

// The thank-you page calls this after a purchase, and only when the visitor accepted tracking (see TrackPurchase).
// The order id is the payment intent (one-time) or subscription id (monthly); the session id is never sent.
const tooMany = limiter(20);

export async function POST(request: NextRequest) {
  if (!process.env.META_CAPI_TOKEN || !process.env.STRIPE_SECRET_KEY) return NextResponse.json({ sent: false });
  const ip = clientIp(request.headers);
  if (ip && tooMany(ip)) return NextResponse.json({ sent: false }, { status: 429 });

  const body = await request.json().catch(() => ({}));
  const orderId = typeof body?.orderId === 'string' ? body.orderId : '';
  if (!/^(pi|sub)_[A-Za-z0-9]+$/.test(orderId)) return NextResponse.json({ error: 'invalid order' }, { status: 400 });

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const subscription = orderId.startsWith('sub_');
    const { data } = await stripe.checkout.sessions.list(subscription ? { subscription: orderId, limit: 1 } : { payment_intent: orderId, limit: 1 });
    const session = data[0];
    if (!session || session.metadata?.product !== LICENSE_PRODUCT || (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required')) {
      return NextResponse.json({ error: 'unknown order' }, { status: 404 });
    }
    await sendMetaEvent({
      eventName: subscription ? 'Subscribe' : 'Purchase',
      eventId: orderId,
      value: (session.amount_total ?? 0) / 100,
      currency: (session.currency ?? 'eur').toUpperCase(),
      email: session.customer_details?.email ?? session.customer_email ?? null,
      ip,
      userAgent: request.headers.get('user-agent') ?? '',
      fbp: request.cookies.get('_fbp')?.value,
      fbc: request.cookies.get('_fbc')?.value,
      sourceUrl: request.headers.get('referer') ?? 'https://www.kojalytics.com/software/danke',
    });
    return NextResponse.json({ sent: true });
  } catch (e) {
    console.error('Meta purchase event failed', e);
    return NextResponse.json({ sent: false }, { status: 502 });
  }
}
