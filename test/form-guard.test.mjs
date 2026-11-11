// npm test: the bot protection of the cancellation and withdrawal forms (/api/cancel, /api/withdraw).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HONEYPOT, MIN_FILL_MS, botReason, clientIp, limiter } from '../src/lib/form-guard.ts';

const person = { name: 'Erika Mustermann', email: 'erika@example.com', [HONEYPOT]: '', fillMs: 12_000 };

test('a person who took their time and left the hidden field empty passes', () => {
  assert.equal(botReason(person), null);
  assert.equal(botReason({ ...person, fillMs: MIN_FILL_MS }), null);
  assert.equal(botReason({ ...person, [HONEYPOT]: undefined }), null);
});

test('a filled hidden field marks a bot, however long the form took', () => {
  assert.equal(botReason({ ...person, [HONEYPOT]: 'kQwErTyZpLm' }), 'honeypot');
  assert.equal(botReason({ ...person, [HONEYPOT]: 'https://spam.example', fillMs: 600_000 }), 'honeypot');
});

test('a form sent in under MIN_FILL_MS marks a bot', () => {
  assert.equal(botReason({ ...person, fillMs: 0 }), 'too fast');
  assert.equal(botReason({ ...person, fillMs: MIN_FILL_MS - 1 }), 'too fast');
  assert.equal(botReason({ ...person, fillMs: -5_000 }), 'too fast');
});

test('a request without a fill time was not sent from the page and marks a bot', () => {
  const { fillMs, ...withoutTime } = person;
  assert.equal(botReason(withoutTime), 'no fill time');
  assert.equal(botReason({ ...person, fillMs: '9000' }), 'no fill time');
  assert.equal(botReason({ ...person, fillMs: null }), 'no fill time');
  assert.equal(botReason({ ...person, fillMs: Number.NaN }), 'no fill time');
  assert.equal(botReason({}), 'no fill time');
  assert.equal(botReason(null), 'no fill time');
  assert.equal(botReason('name=x'), 'no fill time');
});

test('clientIp takes the first entry of x-forwarded-for', () => {
  assert.equal(clientIp(new Headers({ 'x-forwarded-for': '203.0.113.7' })), '203.0.113.7');
  assert.equal(clientIp(new Headers({ 'x-forwarded-for': ' 203.0.113.7 , 10.0.0.1, 10.0.0.2' })), '203.0.113.7');
  assert.equal(clientIp(new Headers()), '');
});

test('limiter allows max hits per key within the window, then blocks', () => {
  const tooMany = limiter(5);
  const t = 1_800_000_000_000;
  for (let i = 0; i < 5; i++) assert.equal(tooMany('203.0.113.7', t + i), false, `hit ${i + 1}`);
  assert.equal(tooMany('203.0.113.7', t + 10), true);
  assert.equal(tooMany('203.0.113.7', t + 20), true);
  // Another key has its own count.
  assert.equal(tooMany('198.51.100.1', t + 30), false);
});

test('limiter forgets hits older than the window', () => {
  const tooMany = limiter(3, 60_000);
  const t = 1_800_000_000_000;
  for (let i = 0; i < 3; i++) tooMany('a@example.com', t);
  assert.equal(tooMany('a@example.com', t + 59_999), true);
  // All four hits at t and t + 59_999 count; one minute after the last one the address is free again.
  assert.equal(tooMany('a@example.com', t + 59_999 + 60_000), false);
});

test('limiter keeps working when many one-off keys pile up', () => {
  const tooMany = limiter(1, 1_000);
  const t = 1_800_000_000_000;
  for (let i = 0; i < 10_050; i++) tooMany(`bot${i}@example.com`, t);
  // The old keys are forgotten once their window passed; a fresh key and a repeated one still behave.
  assert.equal(tooMany('fresh@example.com', t + 5_000), false);
  assert.equal(tooMany('fresh@example.com', t + 5_001), true);
  assert.equal(tooMany('bot0@example.com', t + 5_002), false);
});
