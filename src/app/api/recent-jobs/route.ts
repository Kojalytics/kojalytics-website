import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  const { data: jobs } = await supabase
    .from('generation_jobs')
    .select('id, status, total_portraits, completed_count, image_size, created_at, error_message')
    .order('created_at', { ascending: false })
    .limit(5);

  return NextResponse.json({ jobs });
}
