import { LAUNCHER_DOWNLOAD_URL, LAUNCHER_DOWNLOAD_URL_WINDOWS } from '@/lib/pricing';

/**
 * GET /download/mac and /download/windows → the Kojalytics Launcher, served from kojalytics.com.
 *
 * Our server fetches the latest release file from GitHub and streams it on, so visitors only ever see
 * kojalytics.com (no link to our GitHub) and their IP address does not reach GitHub. Streamed
 * responses are not bound by Vercel's 4.5 MB body limit; Range requests pass through, so browsers can
 * resume an interrupted download.
 */

export const dynamic = 'force-dynamic';
// A 20 MB file on a slow line: allow the full time a function may run.
export const maxDuration = 300;

const FILES: Record<string, { url: string; name: string; type: string }> = {
  mac: { url: LAUNCHER_DOWNLOAD_URL, name: 'Kojalytics-Launcher.dmg', type: 'application/x-apple-diskimage' },
  windows: { url: LAUNCHER_DOWNLOAD_URL_WINDOWS, name: 'Kojalytics-Launcher.msi', type: 'application/x-msi' },
};

const PASS_THROUGH = ['content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified'];

async function serve(request: Request, platform: string, method: 'GET' | 'HEAD') {
  const file = FILES[platform];
  if (!file) return new Response('Nicht gefunden', { status: 404 });

  const range = request.headers.get('range');
  const upstream = await fetch(file.url, {
    method,
    headers: range ? { range } : {},
    redirect: 'follow',
    cache: 'no-store',
  }).catch(() => null);

  if (!upstream || (!upstream.ok && upstream.status !== 416)) {
    console.error(`Download ${platform}: GitHub answered ${upstream?.status ?? 'nothing'}`);
    return new Response('Der Download ist gerade nicht erreichbar. Bitte versuche es in ein paar Minuten noch einmal.', {
      status: 502,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  const headers = new Headers({
    'Content-Type': file.type,
    'Content-Disposition': `attachment; filename="${file.name}"`,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  for (const name of PASS_THROUGH) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  return new Response(method === 'HEAD' ? null : upstream.body, { status: upstream.status, headers });
}

type Context = { params: Promise<{ platform: string }> };

export async function GET(request: Request, { params }: Context) {
  return serve(request, (await params).platform, 'GET');
}

export async function HEAD(request: Request, { params }: Context) {
  return serve(request, (await params).platform, 'HEAD');
}
