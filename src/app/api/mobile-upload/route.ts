import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Allow up to 10MB per batch (3 compressed images ~1MB each)
export const maxDuration = 30; // seconds

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Store accumulated paths per uid (in-memory, per instance)
const pendingPaths = new Map<string, { paths: string[]; thumbnails: string[]; lastUpdate: number }>();

// Clean up old entries after 10 minutes
function cleanupOld() {
  const now = Date.now();
  for (const [uid, data] of pendingPaths.entries()) {
    if (now - data.lastUpdate > 600_000) pendingPaths.delete(uid);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const clientUid = formData.get('uid') as string | null;
    const uploadToken = formData.get('token') as string | null;
    const isFirst = formData.get('first') === '1';
    const isFinal = formData.get('final') === '1';

    // Resolve the real uid. Two accepted paths:
    // 1) Authenticated request: use user.id from the JWT, ignore the form uid.
    // 2) Unauthenticated mobile-QR: require a valid upload token minted by
    //    /api/mobile-upload/token — the token carries the user_id.
    let uid: string | null = null;
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (token) {
      const userClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: `Bearer ${token}` } } },
      );
      const { data: { user } } = await userClient.auth.getUser();
      if (user) uid = user.id;
    }

    if (!uid && uploadToken) {
      const { data: tokenRow } = await supabase
        .from('mobile_upload_tokens')
        .select('user_id, expires_at')
        .eq('token', uploadToken)
        .single();
      if (tokenRow && new Date(tokenRow.expires_at) > new Date()) {
        uid = tokenRow.user_id;
      }
    }

    if (!uid) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    // Sanity: reject a form uid that tries to override the authenticated one.
    if (clientUid && clientUid !== uid) {
      return NextResponse.json({ error: 'uid mismatch' }, { status: 403 });
    }

    const files = formData.getAll('files') as File[];
    if (!files.length) {
      return NextResponse.json({ error: 'No files' }, { status: 400 });
    }
    // Cap total request size by rejecting oversized file lists. Each single
    // file is also inherently limited by Next's max body size.
    if (files.length > 15) {
      return NextResponse.json({ error: 'Too many files' }, { status: 400 });
    }

    // On first batch: delete all old files for this user
    if (isFirst) {
      const { data: oldFiles } = await supabase.storage
        .from('reference-images')
        .list(uid, { limit: 100 });
      if (oldFiles?.length) {
        const oldPaths = oldFiles.map(f => `${uid}/${f.name}`);
        await supabase.storage.from('reference-images').remove(oldPaths);
      }
    }

    cleanupOld();

    // Get or create pending entry for this uid
    if (!pendingPaths.has(uid)) {
      pendingPaths.set(uid, { paths: [], thumbnails: [], lastUpdate: Date.now() });
    }
    const pending = pendingPaths.get(uid)!;
    pending.lastUpdate = Date.now();

    // Upload this batch
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${uid}/${Date.now()}-${i}.${ext}`;

      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadErr } = await supabase.storage
        .from('reference-images')
        .upload(path, buffer, { contentType: file.type, upsert: false });

      if (uploadErr) {
        console.error('Upload error:', uploadErr);
        continue;
      }
      pending.paths.push(path);

      const { data: signedData } = await supabase.storage
        .from('reference-images')
        .createSignedUrl(path, 3600);
      if (signedData?.signedUrl) {
        pending.thumbnails.push(signedData.signedUrl);
      }
    }

    // Only broadcast on the final batch
    if (isFinal) {
      // List ALL files from Storage for this user (in-memory state is unreliable on serverless)
      const { data: allFiles } = await supabase.storage
        .from('reference-images')
        .list(uid, { limit: 20, sortBy: { column: 'created_at', order: 'asc' } });

      const allPaths = (allFiles || [])
        .filter(f => f.name && !f.name.startsWith('.'))
        .map(f => `${uid}/${f.name}`);

      // Generate signed URLs for all files
      const allThumbnails: string[] = [];
      for (const path of allPaths) {
        const { data: signedData } = await supabase.storage
          .from('reference-images')
          .createSignedUrl(path, 3600);
        if (signedData?.signedUrl) allThumbnails.push(signedData.signedUrl);
      }

      const channel = supabase.channel(`mobile-upload:${uid}`);
      await channel.subscribe();
      await channel.send({
        type: 'broadcast',
        event: 'files_ready',
        payload: {
          paths: allPaths,
          thumbnails: allThumbnails,
          count: allPaths.length,
        },
      });
      channel.unsubscribe();

      // Clean up in-memory state
      pendingPaths.delete(uid);
    }

    return NextResponse.json({ success: true, count: pending.paths.length });
  } catch (err) {
    console.error('Mobile upload failed:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
