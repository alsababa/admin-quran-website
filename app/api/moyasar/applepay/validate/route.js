import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { validation_url } = await req.json();

    if (!validation_url) {
      return NextResponse.json({ error: 'validation_url is required' }, { status: 400 });
    }

    const isDev = process.env.NODE_ENV !== 'production';
    const MOYASAR_SECRET_KEY = isDev 
      ? (process.env.MOYASAR_TEST_SECRET_KEY || process.env.MOYASAR_LIVE_SECRET_KEY)
      : (process.env.MOYASAR_LIVE_SECRET_KEY || process.env.MOYASAR_TEST_SECRET_KEY);

    if (!MOYASAR_SECRET_KEY) {
      return NextResponse.json({ error: 'Moyasar Secret Key is not configured' }, { status: 500 });
    }

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
