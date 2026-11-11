// Bot protection for the cancellation and withdrawal forms, without a visible hurdle: the Kündigungsbutton
// (§ 312k BGB) must stay free of CAPTCHAs. A bot entry gets the same answer as a real one but sends no e-mail.

/** Name of the hidden form field. People never see it; bots that fill every input fill it too. */
export const HONEYPOT = 'website';
/** People need longer than this to fill in the form. The form sends `fillMs`, the time since it appeared. */
export const MIN_FILL_MS = 3_000;

/** Why the submitted body looks like a bot, or null when it looks like a person. */
export function botReason(body: unknown): string | null {
  const fields = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  if (fields[HONEYPOT]) return 'honeypot';
  const fillMs = fields.fillMs;
  // Only our form sends fillMs: a request without it was not sent from the page.
  if (typeof fillMs !== 'number' || !Number.isFinite(fillMs)) return 'no fill time';
  if (fillMs < MIN_FILL_MS) return 'too fast';
  return null;
}

/** The client's IP address: the first entry of x-forwarded-for, which Vercel sets. Empty when missing. */
export function clientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '';
}

/**
 * Best effort against misuse (per server instance): returns a check that is true once a key was already seen
 * `max` times within the window. Every check counts as a hit.
 */
export function limiter(max: number, windowMs = 3_600_000) {
  const seen = new Map<string, number[]>();
  return function tooMany(key: string, now = Date.now()) {
    const hits = (seen.get(key) ?? []).filter((t) => now - t < windowMs);
    seen.set(key, [...hits, now]);
    // Bots use a new address each time: forget keys whose window has passed, so the map stays small.
    if (seen.size > 10_000) {
      for (const [k, times] of seen) if (now - times[times.length - 1] >= windowMs) seen.delete(k);
    }
    return hits.length >= max;
  };
}
