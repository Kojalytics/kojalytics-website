import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('Triggering process-portrait with:', JSON.stringify(body));
    console.log('SERVICE_KEY present:', !!SERVICE_KEY, 'length:', SERVICE_KEY?.length);
    console.log('SUPABASE_URL:', SUPABASE_URL);

    const url = `${SUPABASE_URL}/functions/v1/process-portrait`;
    console.log('Calling:', url);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    console.log('Response status:', res.status, 'body:', text);

    return NextResponse.json({
      workerStatus: res.status,
      workerResponse: text,
      serviceKeyPresent: !!SERVICE_KEY,
      serviceKeyLength: SERVICE_KEY?.length,
    });
  } catch (err) {
    console.error('test-worker failed:', err);
    return NextResponse.json({
      error: String(err),
      serviceKeyPresent: !!SERVICE_KEY,
    }, { status: 500 });
  }
}
