import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET(request: NextRequest) {
  const uid = request.nextUrl.searchParams.get('uid');
  if (!uid) {
    return NextResponse.json({ error: 'Missing uid' }, { status: 400 });
  }

  const { data: files } = await supabase.storage
    .from('reference-images')
    .list(uid, { limit: 20, sortBy: { column: 'created_at', order: 'asc' } });

  const paths = (files || [])
    .filter(f => f.name && !f.name.startsWith('.'))
    .map(f => `${uid}/${f.name}`);

  return NextResponse.json({ paths });
}
