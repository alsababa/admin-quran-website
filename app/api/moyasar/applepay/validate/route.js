import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { validation_url } = await req.json();

    if (!validation_url) {
      return NextResponse.json({ error: 'validation_url is required' }, { status: 400 });
    }

    const MOYASAR_SECRET_KEY = process.env.MOYASAR_SECRET_KEY || process.env.NEXT_PUBLIC_MOYASAR_TEST_PUBLISHABLE_KEY; 
    // IMPORTANT: In production, this MUST be the Secret Key, not the Publishable Key.
    // Moyasar validation requires the Secret Key.

    const response = await fetch('https://api.moyasar.com/v1/applepay/initiation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(MOYASAR_SECRET_KEY + ':').toString('base64')}`,
      },
      body: JSON.stringify({
        validation_url: validation_url,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[ApplePay Validation] Moyasar Error:', data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[ApplePay Validation] Internal Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
