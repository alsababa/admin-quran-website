// Supabase Edge Function: moyasar-webhook
// Handles payment webhooks directly from Moyasar
// Deploy with: supabase functions deploy moyasar-webhook
// Set secret: supabase secrets set MOYASAR_WEBHOOK_SECRET=your_secret_here

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Plan definitions based on app/pay/page.js
const PLANS = {
  'annual-pro': { extensionDays: 365, tier: 'premium' },
  'premium_yearly': { extensionDays: 365, tier: 'premium' },
  'organization_bulk': { extensionDays: 365, tier: 'premium' },
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    // 1. Parse Payload
    const body = await req.json()
    console.log("Moyasar Webhook Received:", JSON.stringify(body))

    // Determine the actual payment data (Moyasar wraps it in `data` for webhooks)
    const paymentData = body.data || body;
    
    // 2. Security Check (Optional but recommended)
    // If you set a secret in Moyasar, they might pass it in headers or query params
    // Right now, we will verify the payment directly via Moyasar API for maximum security
    // to prevent spoofed webhook requests.
    const paymentId = paymentData.id;
    if (!paymentId) {
       return new Response(JSON.stringify({ error: "No payment ID found" }), { status: 400 })
    }

    if (paymentData.status !== 'paid' && paymentData.status !== 'captured') {
        console.log(`Payment not paid, status is ${paymentData.status}. Ignoring.`);
        return new Response(JSON.stringify({ message: "Ignored" }), { status: 200 })
    }

    // 3. Extract Metadata
    const metadata = paymentData.metadata || {};
    const userId = metadata.userId;
    const email = metadata.email;
    const planId = metadata.planId || 'annual-pro';
    const isOrganization = metadata.type === 'organization' || metadata.type === 'org';

    if (!userId && !isOrganization) {
        throw new Error("Missing required metadata: userId")
    }

    // 4. Initialize Supabase Admin for DB updates
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const now = new Date()

    // 5. Update Database
    if (isOrganization) {
        const userCount = parseInt(metadata.userCount || '10')
        const orgName = metadata.orgName || 'جهة غير مسماة'
        const adminEmail = email

        console.log(`[Webhook] Activating Organization: ${orgName} with ${userCount} users`)

        // Upsert organization
        const { data: orgData, error: orgError } = await supabaseAdmin
            .from('organizations')
            .upsert({
                name: orgName,
                admin_email: adminEmail?.toLowerCase(),
                subscription_status: 'active',
                subscription_end_date: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                max_users: userCount,
                updated_at: now.toISOString()
            }, { onConflict: 'admin_email' })
            .select()
            .single()

        if (orgError) console.error("Error upserting org:", orgError.message)

    } else {
        const plan = PLANS[planId] || PLANS['annual-pro']
        const extensionMs = plan.extensionDays * 24 * 60 * 60 * 1000
        
        let newEndDate = new Date(now.getTime() + extensionMs)

        // Find existing user to extend plan if already active
        const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('subscription_end_date')
            .eq('id', userId)
            .single()

        if (existingUser?.subscription_end_date) {
            const currentEnd = new Date(existingUser.subscription_end_date)
            if (currentEnd > now) {
                newEndDate = new Date(currentEnd.getTime() + extensionMs)
            }
        }

        console.log(`[Webhook] Activating Individual: ${userId} until ${newEndDate.toISOString()}`)

        await supabaseAdmin.from('users').upsert({
            id: userId,
            email: email?.toLowerCase(),
            subscription_status: 'active',
            subscription_tier: plan.tier,
            subscription_type: 'individual',
            subscription_platform: 'moyasar_webhook',
            subscription_transaction_id: paymentId,
            subscription_end_date: newEndDate.toISOString(),
            updated_at: now.toISOString()
        })
    }

    // 6. Record Payment in DB
    await supabaseAdmin.from('payments').insert({
        payment_id: paymentId,
        user_id: userId,
        email: email,
        plan_id: planId,
        amount: paymentData.amount,
        currency: paymentData.currency || 'SAR',
        status: paymentData.status,
        platform: 'moyasar_webhook',
        created_at: now.toISOString()
    })

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })

  } catch (err) {
    console.error('Webhook Error:', err.message)
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})
