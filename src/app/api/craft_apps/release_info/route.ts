import { NextResponse } from 'next/server';

/**
 * GET → the release feed of the Kojalytics Launcher (read by craft-launcher/crates/core/src/feed.rs).
 *
 * The launcher asks here first and only goes to GitHub for apps this feed doesn't vouch for, so
 * customers don't run into GitHub's limit of 60 requests an hour. We ask GitHub instead, each time
 * the CDN's copy of this answer runs out: every 5 minutes with GITHUB_TOKEN (read-only, public
 * repos), every 30 minutes without.
 */

// Built per request, never at build time (a GitHub hiccup can't fail a deploy). Only the CDN keeps
// our answer: Next's fetch cache stopped refreshing it (2026-11-10 it still served 2026-11-09 18:22),
// so a new release never reached the launcher.
export const dynamic = 'force-dynamic';

const TOKEN = process.env.GITHUB_TOKEN?.trim();
// Without a token: 14 repos every 30 minutes stay below the 60 an hour.
const CDN_SECONDS = TOKEN ? 300 : 1800;

// Ids and repos as in the launcher's catalog (crates/core/src/catalog.rs), plus the launcher itself.
const APPS = [
  { id: 'photocraft', name: 'PhotoKoja', repo: 'Kojalytics/photocraft' },
  { id: 'vectorcraft', name: 'VectorKoja', repo: 'Kojalytics/vectorcraft' },
  { id: 'filmcraft', name: 'FilmKoja', repo: 'Kojalytics/filmcraft' },
  { id: 'lightcraft', name: 'LightKoja', repo: 'Kojalytics/lightcraft' },
  { id: 'pdfcraft', name: 'PdfKoja', repo: 'Kojalytics/pdfcraft' },
  { id: 'effectcraft', name: 'EffectKoja', repo: 'Kojalytics/effectcraft' },
  { id: 'designcraft', name: 'DesignKoja', repo: 'Kojalytics/designcraft' },
  { id: 'wordcraft', name: 'WordKoja', repo: 'Kojalytics/wordcraft' },
  { id: 'deckcraft', name: 'DeckKoja', repo: 'Kojalytics/deckcraft' },
  { id: 'gridcraft', name: 'GridKoja', repo: 'Kojalytics/gridcraft' },
  { id: 'cadcraft', name: 'CADKoja', repo: 'Kojalytics/cadcraft' },
  { id: 'soundcraft', name: 'SoundKoja', repo: 'Kojalytics/soundcraft' },
  { id: 'figcraft', name: 'FigKoja', repo: 'Kojalytics/figcraft' },
  { id: 'artcraft-launcher', name: 'Kojalytics Launcher', repo: 'Kojalytics/craft-launcher' },
];

type GitHubRelease = {
  tag_name: string;
  name: string | null;
  published_at: string | null;
  html_url: string;
  prerelease: boolean;
  body: string | null;
  assets: { name: string; size: number; browser_download_url: string; digest?: string | null }[];
};

/** `2026-11-08T10:40:12Z`: the format the launcher parses, and sortable as text. */
function rfc3339(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

async function appEntry(app: (typeof APPS)[number]) {
  const entry = { name: app.name, repo: app.repo };
  try {
    // The latest stable release, as the launcher itself asks for it.
    const res = await fetch(`https://api.github.com/repos/${app.repo}/releases/latest`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
      cache: 'no-store',
    });
    // GitHub's own timestamp: how old the data really is. After a day without a fresh answer the
    // launcher stops trusting the entry and asks GitHub itself.
    const fetchedAt = rfc3339(new Date(res.headers.get('date') ?? Date.now()));
    if (res.status === 404) {
      return { ...entry, latest_release: null, app_last_fetched: fetchedAt };
    }
    if (!res.ok) throw new Error(`GitHub answered HTTP ${res.status}`);
    const r: GitHubRelease = await res.json();
    return {
      ...entry,
      latest_release: {
        tag: r.tag_name,
        name: r.name ?? '',
        published_at: r.published_at,
        html_url: r.html_url,
        prerelease: r.prerelease,
        notes_markdown: r.body ?? '',
        assets: r.assets.map((a) => ({
          name: a.name,
          size_bytes: a.size,
          download_url: a.browser_download_url,
          // Without GitHub's checksum the launcher checks the download against SHA256SUMS.txt.
          sha256: a.digest?.startsWith('sha256:') ? a.digest.slice('sha256:'.length) : null,
        })),
      },
      app_last_fetched: fetchedAt,
    };
  } catch (error) {
    console.error(`release_info: ${app.repo}:`, error);
    // Never fetched: the launcher asks GitHub about this app.
    return { ...entry, latest_release: null, app_last_fetched: null };
  }
}

export async function GET() {
  const entries = await Promise.all(APPS.map(appEntry));
  const fetched = entries.flatMap((e) => (e.app_last_fetched ? [e.app_last_fetched] : [])).sort();
  return NextResponse.json(
    {
      success: true,
      release_info: {
        apps: Object.fromEntries(APPS.map((app, i) => [app.id, entries[i]])),
        // When the least recently fetched app was fetched.
        last_fetched: fetched[0] ?? null,
      },
      app_renames: [],
      repo_renames: [],
      important_notices: { announcements: [], alerts: [] },
    },
    { headers: { 'Cache-Control': `public, max-age=0, s-maxage=${CDN_SECONDS}, stale-while-revalidate=86400` } },
  );
}
