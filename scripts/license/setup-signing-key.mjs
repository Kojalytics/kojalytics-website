// One-time setup: creates the Ed25519 key pair that signs activation certificates.
// The private key goes into .env.local (never commit it; also add it to Vercel).
// The public key is printed: it is built into the apps to check certificates.
//
//   node scripts/license/setup-signing-key.mjs
import { appendFileSync } from 'fs';
import { createPublicKey, generateKeyPairSync } from 'crypto';
import { ENV_FILE, readEnv } from './lib.mjs';

const env = readEnv();
let privatePem;
if (env.LICENSE_SIGNING_PRIVATE_KEY) {
  privatePem = Buffer.from(env.LICENSE_SIGNING_PRIVATE_KEY, 'base64').toString('utf8');
  console.log('A signing key already exists in .env.local; showing its public key.');
} else {
  const { privateKey } = generateKeyPairSync('ed25519');
  privatePem = privateKey.export({ type: 'pkcs8', format: 'pem' });
  appendFileSync(
    ENV_FILE,
    `\n# Signs Koja app license certificates. Keep secret; also set it in Vercel.\nLICENSE_SIGNING_PRIVATE_KEY=${Buffer.from(privatePem).toString('base64')}\n`,
  );
  console.log('Created a new signing key and saved it to .env.local (LICENSE_SIGNING_PRIVATE_KEY).');
}
// The last 32 bytes of the SPKI DER encoding are the raw Ed25519 public key.
const raw = createPublicKey(privatePem).export({ type: 'spki', format: 'der' }).subarray(-32);
console.log(`Public key (for the apps): ${raw.toString('hex')}`);
