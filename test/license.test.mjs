// npm test: the license certificates and their renewal (/api/license/refresh), without a database.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import {
  CERTIFICATE_DAYS,
  DEVICE_REMOVED_ERROR,
  REVOKED_ERROR,
  refreshCertificate,
  signCertificate,
  signLicenseCertificate,
  verifyCertificate,
} from '../src/lib/license.ts';

const pem = (k) => k.export({ type: 'pkcs8', format: 'pem' });
const KEY = pem(generateKeyPairSync('ed25519').privateKey);
const OTHER_KEY = pem(generateKeyPairSync('ed25519').privateKey);
const DEVICE = 'a'.repeat(64);
const ID = '3f0c1d2e-0000-4000-8000-000000000001';
const NOW = 1_800_000_000;
const DAY = 24 * 60 * 60;

/** A database with one license, activated on DEVICE. */
function store({ revoked = false, activated = true } = {}) {
  const calls = [];
  return {
    calls,
    async license(id) {
      return id === ID ? { id: ID, key_hint: 'STVWX', revoked_at: revoked ? '2026-11-11T12:00:00Z' : null } : null;
    },
    async seen(licenseId, device, version) {
      calls.push({ licenseId, device, version });
      return activated && licenseId === ID && device === DEVICE;
    },
  };
}

test('a license certificate carries its end, CERTIFICATE_DAYS after it was issued', () => {
  const { certificate, expires } = signLicenseCertificate({ id: ID, key_hint: 'STVWX' }, DEVICE, NOW, KEY);
  assert.equal(expires, NOW + CERTIFICATE_DAYS * DAY);
  assert.deepEqual(verifyCertificate(certificate, KEY), { v: 1, license: ID, hint: 'STVWX', device: DEVICE, issued: NOW, expires });
});

test('only certificates signed with our key are read', () => {
  const { certificate } = signLicenseCertificate({ id: ID, key_hint: 'STVWX' }, DEVICE, NOW, KEY);
  assert.equal(verifyCertificate(certificate, OTHER_KEY), null);
  const [body, sig] = certificate.split('.');
  const forged = Buffer.from(JSON.stringify({ license: ID, device: 'b'.repeat(64) })).toString('base64url');
  assert.equal(verifyCertificate(`${forged}.${sig}`, KEY), null);
  assert.equal(verifyCertificate(`${body}.${sig}.x`, KEY), null);
  assert.equal(verifyCertificate('garbage', KEY), null);
  assert.equal(verifyCertificate('', KEY), null);
});

test('a valid key on an activated device gets a fresh certificate', async () => {
  const db = store();
  const old = signLicenseCertificate({ id: ID, key_hint: 'STVWX' }, DEVICE, NOW - 5 * DAY, KEY).certificate;
  const answer = await refreshCertificate(old, '0.4.6', KEY, db, NOW);
  assert.equal(answer.status, 200);
  assert.equal(answer.expires, NOW + CERTIFICATE_DAYS * DAY);
  assert.deepEqual(verifyCertificate(answer.certificate, KEY), { v: 1, license: ID, hint: 'STVWX', device: DEVICE, issued: NOW, expires: answer.expires });
  assert.deepEqual(db.calls, [{ licenseId: ID, device: DEVICE, version: '0.4.6' }]);
});

test('a certificate from before expires existed is renewed too', async () => {
  const legacy = signCertificate({ v: 1, license: ID, hint: 'STVWX', device: DEVICE, issued: NOW - 30 * DAY }, KEY);
  const answer = await refreshCertificate(legacy, null, KEY, store(), NOW);
  assert.equal(answer.status, 200);
  assert.equal(verifyCertificate(answer.certificate, KEY).expires, NOW + CERTIFICATE_DAYS * DAY);
});

test('a deactivated key, an unknown license or a removed device gets 403', async () => {
  const cert = signLicenseCertificate({ id: ID, key_hint: 'STVWX' }, DEVICE, NOW, KEY).certificate;
  assert.deepEqual(await refreshCertificate(cert, null, KEY, store({ revoked: true }), NOW), { status: 403, error: REVOKED_ERROR });
  const unknown = signLicenseCertificate({ id: '3f0c1d2e-0000-4000-8000-000000000002', key_hint: 'ABCDE' }, DEVICE, NOW, KEY).certificate;
  assert.deepEqual(await refreshCertificate(unknown, null, KEY, store(), NOW), { status: 403, error: REVOKED_ERROR });
  assert.deepEqual(await refreshCertificate(cert, null, KEY, store({ activated: false }), NOW), { status: 403, error: DEVICE_REMOVED_ERROR });
});

test('forged certificates and trial certificates are refused without asking the database', async () => {
  const db = store();
  db.license = () => assert.fail('the database was asked');
  const foreign = signLicenseCertificate({ id: ID, key_hint: 'STVWX' }, DEVICE, NOW, OTHER_KEY).certificate;
  assert.equal((await refreshCertificate(foreign, null, KEY, db, NOW)).status, 400);
  const trial = signCertificate({ v: 1, trial: true, trial_device: DEVICE, starts: NOW, expires: NOW + 3 * DAY, issued: NOW }, KEY);
  assert.equal((await refreshCertificate(trial, null, KEY, db, NOW)).status, 400);
  const badDevice = signCertificate({ v: 1, license: ID, hint: 'STVWX', device: 'not-a-hash', issued: NOW }, KEY);
  assert.equal((await refreshCertificate(badDevice, null, KEY, db, NOW)).status, 400);
});
