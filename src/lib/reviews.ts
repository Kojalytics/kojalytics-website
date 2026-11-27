import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual, createHash } from 'node:crypto';
import type { Lang } from '@/lib/i18n';

/**
 * Customer reviews of Koja Office (table koja_reviews, supabase/migrations/20261127200000_koja_reviews.sql).
 * New reviews from the site wait for the admin (/admin/bewertungen) before they are shown. "Verifizierter Kauf" is set
 * by the admin; `purchase_match` tells them whether the e-mail belongs to a licence bought on kojalytics.com.
 */
export type ReviewStatus = 'pending' | 'published' | 'hidden';

export type ReviewRow = {
  id: string;
  created_at: string;
  reviewed_on: string;
  name: string;
  email: string | null;
  rating: number;
  title: string | null;
  body: string;
  lang: Lang;
  status: ReviewStatus;
  verified: boolean;
  purchase_match: boolean;
  source: string;
};

/** What the public API returns: no e-mail, no status. */
export type PublicReview = Pick<ReviewRow, 'id' | 'reviewed_on' | 'name' | 'rating' | 'title' | 'body' | 'lang' | 'verified' | 'source'>;

export type ReviewSummary = { count: number; average: number; stars: [number, number, number, number, number]; reviews: PublicReview[] };

export const PUBLIC_COLUMNS = 'id, reviewed_on, name, rating, title, body, lang, verified, source';

export const db = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

export const configured = () => !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Trims, collapses runs of spaces and removes control characters; keeps line breaks in the review text. */
export function clean(value: unknown, max: number, multiline = false): string {
  if (typeof value !== 'string') return '';
  let s = value.replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, '');
  s = multiline ? s.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n') : s.replace(/\s+/g, ' ');
  return s.trim().slice(0, max);
}

/** Whether the address belongs to a licence bought on kojalytics.com (not the trial pool, not revoked). */
export async function hasPurchase(email: string): Promise<boolean> {
  try {
    const { data } = await db()
      .from('koja_licenses')
      .select('id, note, revoked_at')
      .ilike('email', email.replace(/[\\%_]/g, (c) => `\\${c}`));
    return (data ?? []).some((l) => l.note !== 'koja-trial-pool' && !l.revoked_at);
  } catch {
    return false;
  }
}

/** All published reviews with the average and the count per star (index 0 = 1 star). */
export async function publishedSummary(): Promise<ReviewSummary> {
  const { data, error } = await db().from('koja_reviews').select(PUBLIC_COLUMNS).eq('status', 'published').order('reviewed_on', { ascending: false }).order('id').limit(500);
  if (error) throw error;
  const reviews = (data ?? []) as PublicReview[];
  const stars: ReviewSummary['stars'] = [0, 0, 0, 0, 0];
  for (const r of reviews) stars[r.rating - 1]++;
  const average = reviews.length ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10 : 0;
  return { count: reviews.length, average, stars, reviews };
}

/**
 * The admin password (Vercel env REVIEWS_ADMIN_PASSWORD), compared in constant time. Without the variable the admin
 * API is off.
 */
export function isAdmin(given: string | null): boolean {
  const want = process.env.REVIEWS_ADMIN_PASSWORD;
  if (!want || want.length < 12 || !given) return false;
  const a = createHash('sha256').update(given).digest();
  const b = createHash('sha256').update(want).digest();
  return timingSafeEqual(a, b);
}
