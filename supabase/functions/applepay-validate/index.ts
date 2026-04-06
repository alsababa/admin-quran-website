// Supabase Edge Function: Apple Pay Merchant Validation
// Called by Moyasar SDK to validate Apple Pay merchant session

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { validation_url } = await req.json();

    if (!validation_url) {
      return new Response(
        JSON.stringify({ error: 'validation_url is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use Live key in production, test key otherwise
    const MOYASAR_SECRET_KEY = Deno.env.get('MOYASAR_LIVE_SECRET_KEY') 
      || Deno.env.get('MOYASAR_TEST_SECRET_KEY');

    if (!MOYASAR_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: 'Moyasar secret key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Forward to Moyasar Apple Pay initiation endpoint
    const credentials = btoa(`${MOYASAR_SECRET_KEY}:`);
    const moyasarResponse = await fetch('https://api.moyasar.com/v1/applepay/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify({ validation_url }),
    });

    const data = await moyasarResponse.json();

    if (!moyasarResponse.ok) {
      console.error('[ApplePay Validate] Moyasar error:', data);
      return new Response(
        JSON.stringify(data),
        { status: moyasarResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[ApplePay Validate] Internal error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
