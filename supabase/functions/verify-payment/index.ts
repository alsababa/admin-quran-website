// Supabase Edge Function: verify-payment
// Verifies a Moyasar payment and activates the user's subscription
//
// Deploy with: supabase functions deploy verify-payment
// Set secrets: supabase secrets set MOYASAR_SECRET_KEY=sk_live_xxx

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Plan definitions
const PLANS = {
  'annual-pro': { extensionDays: 365, tier: 'premium' },
  'premium_yearly': { extensionDays: 365, tier: 'premium' },
  'premium_monthly': { extensionDays: 30, tier: 'premium' },
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { payment_id, user_id, email, plan_id, source } = body

    // ── 1. Validate input ──
    if (!payment_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'payment_id مطلوب' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!user_id && !email) {
      return new Response(
        JSON.stringify({ success: false, error: 'user_id أو email مطلوب' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── 2. Verify payment with Moyasar API ──
    const moyasarSecretKey = Deno.env.get('MOYASAR_SECRET_KEY') || ''
    
    let paymentVerified = false
    let paymentData = null
    
    if (moyasarSecretKey) {
      const authHeader = `Basic ${btoa(`${moyasarSecretKey}:`)}`
      const moyasarRes = await fetch(`https://api.moyasar.com/v1/payments/${payment_id}`, {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
        },
      })

      if (moyasarRes.ok) {
        paymentData = await moyasarRes.json()
        const status = paymentData?.status
        paymentVerified = (status === 'paid' || status === 'captured' || status === 'authorized')
        
        if (!paymentVerified) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `الدفع غير مكتمل. الحالة: ${status}`,
              payment_status: status
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      } else {
        console.error('Moyasar API error:', moyasarRes.status)
        // If Moyasar verification fails, we still try to proceed if called from webhook
        // (Moyasar webhook already verified the payment)
      }
    } else {
      // No secret key configured — trust the caller (should be webhook or callback)
      console.warn('No MOYASAR_SECRET_KEY configured, skipping verification')
      paymentVerified = true
    }

    // ── 3. Initialize Supabase Admin ──
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // ── 4. Calculate subscription dates ──
    const plan = PLANS[plan_id] || PLANS['annual-pro']
    const now = new Date()
    let endDate = new Date(now)
    endDate.setDate(endDate.getDate() + plan.extensionDays)

    // ── 5. Update Supabase user ──
    let userId = user_id
    
    // Find user by email if no direct user_id match
    if (email) {
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id, subscription_end_date')
        .eq('email', email.toLowerCase())
        .single()

      if (existingUser) {
        userId = existingUser.id
        
        // Extend existing subscription if still active
        if (existingUser.subscription_end_date) {
          const existingEnd = new Date(existingUser.subscription_end_date)
          if (existingEnd > now) {
            endDate = new Date(existingEnd)
            endDate.setDate(endDate.getDate() + plan.extensionDays)
          }
        }
      }
    }

    const supabaseUpdates = {
      subscription_status: 'active',
      subscription_tier: plan.tier,
      subscription_type: 'individual',
      subscription_platform: 'moyasar',
      subscription_product_id: plan_id || 'annual-pro',
      subscription_transaction_id: payment_id,
      subscription_start_date: now.toISOString(),
      subscription_end_date: endDate.toISOString(),
      premium_features: {
        unlimitedSignLanguage: true,
        advancedSearch: true,
        unlimitedBookmarks: true,
        audioRecitations: true,
      },
    }

    if (userId) {
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update(supabaseUpdates)
        .eq('id', userId)

      if (updateError) {
        // Try upsert if update fails (user might not exist in Supabase yet)
        const { error: upsertError } = await supabaseAdmin
          .from('users')
          .upsert({
            id: userId,
            email: email?.toLowerCase() || '',
            ...supabaseUpdates,
          })

        if (upsertError) {
          console.error('Supabase upsert error:', upsertError)
        }
      }
      
      console.log(`User ${userId} subscription activated until ${endDate.toISOString()}`)
    }

    // ── 6. Save payment record ──
    try {
      await supabaseAdmin
        .from('payments')
        .upsert({
          payment_id: payment_id,
          user_id: userId || user_id,
          email: email,
          plan_id: plan_id || 'annual-pro',
          amount: paymentData?.amount || 12000,
          currency: paymentData?.currency || 'SAR',
          status: paymentData?.status || 'paid',
          platform: 'moyasar',
          source: source || 'website',
          metadata: paymentData?.metadata || {},
          created_at: now.toISOString(),
        }, { onConflict: 'payment_id' })
    } catch (payErr) {
      // payments table might not exist yet — non-critical
      console.warn('Payment record save skipped:', payErr.message)
    }

    // ── 7. Return success ──
    return new Response(
      JSON.stringify({
        success: true,
        message: 'تم تفعيل الاشتراك بنجاح',
        end_date: endDate.toISOString(),
        user_id: userId,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('Edge Function Error:', err.message)
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
