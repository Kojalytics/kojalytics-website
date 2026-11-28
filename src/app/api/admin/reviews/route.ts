import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { clientIp, limiter } from '@/lib/form-guard';
import { ADMIN_PASSWORD_MIN, EMAIL, adminPassword, clean, configured, db, hasPurchase, isAdmin, type ReviewStatus } from '@/lib/reviews';

// The admin side of the reviews (/admin/bewertungen): list all, publish, hide, mark verified, delete, import.
// Every request carries the password from REVIEWS_ADMIN_PASSWORD in the header x-admin-password.

const wrongTries = limiter(10, 15 * 60_000);
const STATUSES: ReviewStatus[] = ['pending', 'published', 'hidden'];

function guard(request: NextRequest): NextResponse | null {
  const set = adminPassword();
  if (!set) return NextResponse.json({ error: 'REVIEWS_ADMIN_PASSWORD ist in Vercel nicht gesetzt.' }, { status: 503 });
  if (set.length < ADMIN_PASSWORD_MIN) {
    return NextResponse.json({ error: `Das Passwort in Vercel (REVIEWS_ADMIN_PASSWORD) ist kürzer als ${ADMIN_PASSWORD_MIN} Zeichen. Bitte dort ein längeres setzen und neu deployen.` }, { status: 503 });
  }
  if (!configured()) return NextResponse.json({ error: 'Die Datenbank ist nicht konfiguriert.' }, { status: 503 });
  if (isAdmin(request.headers.get('x-admin-password'))) return null;
  const ip = clientIp(request.headers) || 'unknown';
  if (wrongTries(ip)) return NextResponse.json({ error: 'Zu viele falsche Versuche. Bitte warte 15 Minuten.' }, { status: 429 });
  return NextResponse.json({ error: 'Falsches Passwort.' }, { status: 401 });
}

/** The home pages show the published reviews and their structured data: rebuild them after every change. */
const refresh = () => {
  revalidatePath('/');
  revalidatePath('/en');
};

/** A real calendar day as YYYY-MM-DD, from 2020 up to today (Berlin time, so "today" works late in the evening too). */
function validDate(v: unknown): v is string {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Berlin' });
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v && v >= '2020-01-01' && v <= today;
}

const fail = (err: unknown) => {
  console.error('Reviews admin failed:', err);
  return NextResponse.json({ error: 'Das hat nicht geklappt. Ist die Tabelle koja_reviews angelegt?' }, { status: 500 });
};

export async function GET(request: NextRequest) {
  const denied = guard(request);
  if (denied) return denied;
  const { data, error } = await db().from('koja_reviews').select('*').order('created_at', { ascending: false }).limit(1000);
  if (error) return fail(error);
  return NextResponse.json({ reviews: data }, { headers: { 'Cache-Control': 'no-store' } });
}

/** { id, status?, verified?, reviewed_on? (JJJJ-MM-TT) } */
export async function PATCH(request: NextRequest) {
  const denied = guard(request);
  if (denied) return denied;
  const body = await request.json().catch(() => ({}));
  const change: { status?: ReviewStatus; verified?: boolean; reviewed_on?: string } = {};
  if (STATUSES.includes(body?.status)) change.status = body.status;
  if (typeof body?.verified === 'boolean') change.verified = body.verified;
  if (body?.reviewed_on !== undefined) {
    if (!validDate(body.reviewed_on)) return NextResponse.json({ error: 'Ungültiges Datum (nicht in der Zukunft, ab 2020).' }, { status: 400 });
    change.reviewed_on = body.reviewed_on;
  }
  if (typeof body?.id !== 'string' || !Object.keys(change).length) return NextResponse.json({ error: 'Ungültige Änderung.' }, { status: 400 });
  const { data, error } = await db().from('koja_reviews').update(change).eq('id', body.id).select('*').single();
  if (error) return fail(error);
  refresh();
  return NextResponse.json({ review: data });
}

/** { id }: deletes for good. */
export async function DELETE(request: NextRequest) {
  const denied = guard(request);
  if (denied) return denied;
  const body = await request.json().catch(() => ({}));
  if (typeof body?.id !== 'string') return NextResponse.json({ error: 'Ungültige ID.' }, { status: 400 });
  const { error } = await db().from('koja_reviews').delete().eq('id', body.id);
  if (error) return fail(error);
  refresh();
  return NextResponse.json({ ok: true });
}

/**
 * Import: { rows: [{ name, rating, body, title?, email?, date?, lang?, source?, verified?, status? }] }.
 * Imported reviews keep where they come from (source); without a status they wait for the admin like new ones.
 */
export async function POST(request: NextRequest) {
  const denied = guard(request);
  if (denied) return denied;
  const body = await request.json().catch(() => ({}));
  const rows: unknown[] = Array.isArray(body?.rows) ? body.rows.slice(0, 500) : [];
  if (!rows.length) return NextResponse.json({ error: 'Keine Zeilen zum Importieren.' }, { status: 400 });

  const insert = [];
  const errors: string[] = [];
  for (const [i, raw] of rows.entries()) {
    const r = (raw ?? {}) as Record<string, unknown>;
    const rating = Number(r.rating);
    const name = clean(r.name, 60);
    const text = clean(r.body ?? r.text, 2000, true);
    const email = clean(r.email, 254).toLowerCase();
    const date = validDate(r.date) ? r.date : null;
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !name || !text) {
      errors.push(`Zeile ${i + 1}: Name, Sterne (1–5) und Text sind Pflicht.`);
      continue;
    }
    if (email && !EMAIL.test(email)) {
      errors.push(`Zeile ${i + 1}: E-Mail-Adresse ungültig.`);
      continue;
    }
    insert.push({
      name,
      rating,
      body: text,
      title: clean(r.title, 120) || null,
      email: email || null,
      lang: r.lang === 'en' ? 'en' : 'de',
      source: clean(r.source, 60) || 'Import',
      status: STATUSES.includes(r.status as ReviewStatus) ? (r.status as ReviewStatus) : 'pending',
      verified: r.verified === true || r.verified === 'true' || r.verified === 'ja',
      purchase_match: email ? await hasPurchase(email) : false,
      ...(date && { reviewed_on: date }),
    });
  }
  if (errors.length) return NextResponse.json({ error: errors.slice(0, 10).join('\n') }, { status: 400 });
  const { error } = await db().from('koja_reviews').insert(insert);
  if (error) return fail(error);
  refresh();
  return NextResponse.json({ imported: insert.length });
}
