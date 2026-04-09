import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  // Get GEMINI_API_KEY from Supabase vault
  const { data: secrets } = await supabase.rpc('get_secret', { secret_name: 'GEMINI_API_KEY' }).single();

  // Fallback: try to get it from edge function env by calling a simple function
  // Instead, let's use the key stored in Vercel env if available
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return NextResponse.json({ error: 'No GEMINI_API_KEY in Vercel env. Check Supabase secrets.' });
  }

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
  const data = await res.json();

  const imageModels = (data.models || [])
    .filter((m: any) => {
      const name = (m.name || '').toLowerCase();
      const methods = m.supportedGenerationMethods || [];
      return (name.includes('flash') || name.includes('image') || name.includes('imagen'))
        && methods.includes('generateContent');
    })
    .map((m: any) => ({ name: m.name, displayName: m.displayName, methods: m.supportedGenerationMethods }));

  return NextResponse.json({ totalModels: data.models?.length, imageModels });
}
