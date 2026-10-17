import { createHash, createPrivateKey, randomBytes, sign } from 'crypto';

// Crockford base32: no I, L, O or U, so keys survive being read aloud or retyped.
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const BODY_LENGTH = 20; // 4 groups of 5 = 100 random bits

/** `koja-abcde ...` → `ABCDE...` (20 chars), or null when it can't be a Koja key. */
export function normalizeKey(input: string): string | null {
  let s = input.toUpperCase().replace(/[\s-]/g, '');
  if (s.startsWith('KOJA')) s = s.slice(4);
  s = s.replace(/O/g, '0').replace(/[IL]/g, '1');
  if (s.length !== BODY_LENGTH) return null;
  for (const c of s) if (!ALPHABET.includes(c)) return null;
  return s;
}

export function formatKey(body: string): string {
  return 'KOJA-' + body.match(/.{5}/g)!.join('-');
}

export function generateKey(): string {
  const bytes = randomBytes(BODY_LENGTH);
  let body = '';
  for (const b of bytes) body += ALPHABET[b % 32];
  return formatKey(body);
}

export function hashKey(body: string): string {
  return createHash('sha256').update(body).digest('hex');
}

/**
 * The activation certificate the app stores and checks offline:
 * base64url(JSON payload) + "." + base64url(Ed25519 signature of the payload part).
 */
export function signCertificate(payload: Record<string, unknown>, privateKeyPem: string): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = sign(null, Buffer.from(body), createPrivateKey(privateKeyPem));
  return `${body}.${signature.toString('base64url')}`;
}
