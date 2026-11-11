# Koja Keys

A small Mac app for the owner: creates license keys for the Koja apps and deactivates single keys.
It writes the same rows as `scripts/license/new-key.mjs` and `revoke-key.mjs` (table `koja_licenses`),
so its keys work with `/api/license/activate` like the shop's.

- **New keys:** choose how many (1–500), devices per key (shop: 3), optional customer email and note.
  The keys are valid at once. Copy them, save them as a text file, or copy a ready message for the customer.
- **All keys:** shop and manual keys with status, devices in use and search (email, note, last group,
  or paste a whole key). The trial pool row is never listed.
- **Deactivate:** sets `revoked_at`. The key can no longer be activated on a new device. Devices that
  already have it keep working, because the apps check a key only once, when it is activated.
  "Wieder aktivieren" clears `revoked_at`.

The database stores only a hash of each key. The full keys made in this app are kept on this Mac
(`~/Library/Application Support/Koja Keys/keys.json`, readable only by the user), so the list can show them again.

## Build and install

```bash
bash tools/koja-keys/build.sh --install
```

Builds `/Applications/Koja Keys.app`, signed with the Developer ID found in the keychain (ad hoc without one).

## Database access

On first start the app asks for the Supabase URL and the service role key and keeps them in the login keychain.
On the Mac that has the website's `.env.local`, it can take them from there without showing them:

```bash
"/Applications/Koja Keys.app/Contents/MacOS/KojaKeys" --import-env /path/to/kojalytics-website/.env.local
```

## Tests

```bash
cd tools/koja-keys && swift test
```

The key format tests compare with values from `scripts/license/lib.mjs`. The live test creates a key, activates it
through kojalytics.com, deactivates it (activation must fail with 403), reactivates it and deletes it again.
It runs only with `KOJA_ENV_FILE=/path/to/.env.local swift test --filter LiveTests`.
