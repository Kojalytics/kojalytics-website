import { createCipheriv, createDecipheriv, createHash, createPrivateKey, createPublicKey, randomBytes, sign, verify } from 'crypto';

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

/** AES-256-GCM key for stored license keys, derived from the signing key (one secret to manage). */
function storageKey(signingKeyB64: string): Buffer {
  return createHash('sha256').update(`koja-license-storage:${signingKeyB64}`).digest();
}

/** `iv.tag.ciphertext`, all base64url. */
export function encryptKey(key: string, signingKeyB64: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', storageKey(signingKeyB64), iv);
  const data = Buffer.concat([cipher.update(key, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((b) => b.toString('base64url')).join('.');
}

export function decryptKey(stored: string, signingKeyB64: string): string {
  const [iv, tag, data] = stored.split('.').map((s) => Buffer.from(s, 'base64url'));
  const decipher = createDecipheriv('aes-256-gcm', storageKey(signingKeyB64), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
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

/** The payload of `certificate` if it was signed with `privateKeyPem`, otherwise null. */
export function verifyCertificate(certificate: string, privateKeyPem: string): Record<string, unknown> | null {
  const parts = certificate.trim().split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  try {
    const publicKey = createPublicKey(createPrivateKey(privateKeyPem));
    if (!verify(null, Buffer.from(parts[0]), publicKey, Buffer.from(parts[1], 'base64url'))) return null;
    const payload: unknown = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    return payload && typeof payload === 'object' && !Array.isArray(payload) ? (payload as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/**
 * How long a license certificate is valid. The launcher renews it once a day, so this is how long
 * a computer can stay offline; it is also the longest a deactivated key keeps working on a device.
 */
export const CERTIFICATE_DAYS = 30;

/** A license certificate for `device`, valid for CERTIFICATE_DAYS from `now` (Unix seconds). */
export function signLicenseCertificate(
  license: { id: string; key_hint: string },
  device: string,
  now: number,
  privateKeyPem: string,
): { certificate: string; expires: number } {
  const expires = now + CERTIFICATE_DAYS * 24 * 60 * 60;
  const payload = { v: 1, license: license.id, hint: license.key_hint, device, issued: now, expires };
  return { certificate: signCertificate(payload, privateKeyPem), expires };
}

/** What /api/license/refresh needs from the database. */
export type RefreshStore = {
  license(id: string): Promise<{ id: string; key_hint: string; revoked_at: string | null } | null>;
  /** Marks `device` as seen for the license; false when it isn't activated for it (any more). */
  seen(licenseId: string, device: string, version: string | null): Promise<boolean>;
};

export type RefreshAnswer = { status: 200; certificate: string; expires: number } | { status: 400 | 403; error: string };

export const REVOKED_ERROR = 'Dieser Lizenzschlüssel wurde deaktiviert. Eine neue Lizenz bekommst du auf kojalytics.com.';
export const DEVICE_REMOVED_ERROR = 'Dein Lizenzschlüssel ist auf diesem Computer nicht mehr aktiviert. Bitte aktiviere ihn neu.';

/**
 * Renews a license certificate the launcher already holds: a fresh one while its key is valid and
 * its device still activated, 403 once the key was deactivated (revoked_at) or the device removed.
 * Certificates from before `expires` existed are renewed the same way.
 */
export async function refreshCertificate(
  certificate: string,
  version: string | null,
  privateKeyPem: string,
  store: RefreshStore,
  now: number,
): Promise<RefreshAnswer> {
  const payload = verifyCertificate(certificate, privateKeyPem);
  const { license: id, device } = payload ?? {};
  // A trial certificate names its machine trial_device and has no license: it isn't renewed here.
  if (typeof id !== 'string' || typeof device !== 'string' || !/^[0-9a-f]{64}$/.test(device)) {
    return { status: 400, error: 'Invalid certificate.' };
  }
  const license = await store.license(id);
  if (!license || license.revoked_at) return { status: 403, error: REVOKED_ERROR };
  if (!(await store.seen(license.id, device, version))) return { status: 403, error: DEVICE_REMOVED_ERROR };
  return { status: 200, ...signLicenseCertificate(license, device, now, privateKeyPem) };
}
