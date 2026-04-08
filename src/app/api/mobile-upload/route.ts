import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const uid = formData.get('uid') as string;

    if (!uid) {
      return NextResponse.json({ error: 'Missing uid' }, { status: 400 });
    }

    const files = formData.getAll('files') as File[];
    if (!files.length) {
      return NextResponse.json({ error: 'No files' }, { status: 400 });
    }

    const uploadedPaths: string[] = [];
    const thumbnailUrls: string[] = [];

    // Upload directly to reference-images bucket (same as desktop upload)
    for (let i = 0; i < Math.min(files.length, 10); i++) {
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
      uploadedPaths.push(path);

      // Generate a signed URL for thumbnail preview on desktop
      const { data: signedData } = await supabase.storage
        .from('reference-images')
        .createSignedUrl(path, 3600); // 1 hour
      if (signedData?.signedUrl) {
        thumbnailUrls.push(signedData.signedUrl);
      }
    }

    // Broadcast to desktop via Realtime — send paths AND thumbnail URLs
    const channel = supabase.channel(`mobile-upload:${uid}`);
    await channel.subscribe();
    await channel.send({
      type: 'broadcast',
      event: 'files_ready',
      payload: {
        paths: uploadedPaths,
        thumbnails: thumbnailUrls,
        count: uploadedPaths.length,
      },
    });
    channel.unsubscribe();

    return NextResponse.json({ success: true, count: uploadedPaths.length });
  } catch (err) {
    console.error('Mobile upload failed:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
