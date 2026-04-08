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
    const uid = formData.get('uid') as string;
    const isFinal = formData.get('final') === '1';

    if (!uid) {
      return NextResponse.json({ error: 'Missing uid' }, { status: 400 });
    }

    const files = formData.getAll('files') as File[];
    if (!files.length) {
      return NextResponse.json({ error: 'No files' }, { status: 400 });
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
      const channel = supabase.channel(`mobile-upload:${uid}`);
      await channel.subscribe();
      await channel.send({
        type: 'broadcast',
        event: 'files_ready',
        payload: {
          paths: pending.paths,
          thumbnails: pending.thumbnails,
          count: pending.paths.length,
        },
      });
      channel.unsubscribe();

      // Clean up
      pendingPaths.delete(uid);
    }

    return NextResponse.json({ success: true, count: pending.paths.length });
  } catch (err) {
    console.error('Mobile upload failed:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
