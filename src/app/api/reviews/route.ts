import { NextRequest, NextResponse } from 'next/server';
import { botReason, clientIp, limiter } from '@/lib/form-guard';
import { sendEmail } from '@/lib/license-sales';
import { EMAIL, clean, configured, db, hasPurchase, publishedSummary } from '@/lib/reviews';

// Published reviews for the home page, and new reviews from its form (they wait for the admin, /admin/bewertungen).

const msg = {
  de: {
    missing: 'Bitte gib Sterne, deinen Namen, deine E-Mail-Adresse und einen Text ein.',
    consent: 'Bitte bestätige, dass wir deine Bewertung mit deinem Namen veröffentlichen dürfen.',
    tooMany: 'Von deinem Anschluss kamen gerade zu viele Bewertungen. Bitte versuche es später erneut.',
    twice: 'Mit dieser E-Mail-Adresse wurde bereits eine Bewertung abgegeben. Danke!',
    unavailable: 'Bewertungen sind gerade nicht verfügbar. Bitte versuche es später erneut.',
  },
  en: {
    missing: 'Please add stars, your name, your email address and a text.',
    consent: 'Please confirm that we may publish your review with your name.',
    tooMany: 'Too many reviews have just come from your connection. Please try again later.',
    twice: 'A review has already been submitted with this email address. Thank you!',
    unavailable: 'Reviews are not available right now. Please try again later.',
  },
};

const tooManyIp = limiter(5);

export async function GET() {
  if (!configured()) return NextResponse.json({ count: 0, average: 0, stars: [0, 0, 0, 0, 0], reviews: [] });
  try {
    const summary = await publishedSummary();
    // Shared caches keep the list 10 seconds, so a review published in the admin shows up almost at once.
    return NextResponse.json(summary, { headers: { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=20' } });
  } catch (err) {
    console.error('Reviews list failed:', err);
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const lang = body?.lang === 'en' ? 'en' : 'de';
  const t = msg[lang];
  // A bot gets the same answer as a person, but nothing is stored.
  if (botReason(body)) return NextResponse.json({ ok: true });
  if (!configured()) return NextResponse.json({ error: t.unavailable }, { status: 503 });

  const rating = Number(body?.rating);
  const name = clean(body?.name, 60);
  const email = clean(body?.email, 254).toLowerCase();
  const title = clean(body?.title, 120);
  const text = clean(body?.body, 2000, true);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !name || !EMAIL.test(email) || text.length < 3) {
    return NextResponse.json({ error: t.missing }, { status: 400 });
  }
  if (body?.consent !== true) return NextResponse.json({ error: t.consent }, { status: 400 });

  const ip = clientIp(request.headers);
  if (ip && tooManyIp(ip)) return NextResponse.json({ error: t.tooMany }, { status: 429 });

  try {
    const client = db();
    const { data: earlier } = await client.from('koja_reviews').select('id').ilike('email', email.replace(/[\\%_]/g, (c) => `\\${c}`)).limit(1);
    if (earlier?.length) return NextResponse.json({ error: t.twice }, { status: 409 });

    const purchase = await hasPurchase(email);
    const { error } = await client.from('koja_reviews').insert({ name, email, rating, title: title || null, body: text, lang, purchase_match: purchase });
    if (error) throw error;

    // Tell support that a review waits; a failed e-mail does not fail the review.
    await sendEmail(
      'support@kojalytics.com',
      `Neue Bewertung (${rating}/5) wartet auf Freigabe`,
      [
        `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}  ${name} (${lang.toUpperCase()})`,
        purchase ? 'E-Mail passt zu einem Kauf auf kojalytics.com.' : 'E-Mail passt zu keinem Kauf auf kojalytics.com.',
        '',
        title ? `${title}\n` : '',
        text,
        '',
        'Freigeben, ausblenden oder verifizieren: https://www.kojalytics.com/admin/bewertungen',
      ].join('\n'),
    ).catch((err) => console.error('Review notification failed:', err));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Review submit failed:', err);
    return NextResponse.json({ error: t.unavailable }, { status: 503 });
  }
}
