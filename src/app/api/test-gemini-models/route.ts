import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  // Get the GEMINI_API_KEY from Supabase secrets by reading it through a quick edge function test
  // Instead, let's check what error the portraits got
  const { data: portraits } = await supabase
    .from('generation_portraits')
    .select('job_id, index, status, error_message')
    .eq('job_id', '4f566dce-7c2d-419e-a1c3-700551eebb58');

  return NextResponse.json({ portraits });
}
