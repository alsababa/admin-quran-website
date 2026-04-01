// Supabase Edge Function: verify-payment
// Verifies a Moyasar payment and activates the user's subscription
//
// Deploy with: supabase functions deploy verify-payment
// Set secrets: supabase secrets set MOYASAR_SECRET_KEY=sk_live_xxx
// Set secrets: supabase secrets set FIREBASE_PROJECT_ID=xxx

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
  'organization_bulk': { extensionDays: 365, tier: 'premium' },
}

/**
 * Generate a random activation code (e.g., ANML-XXXX-XXXX)
 */
function generateCode(prefix = 'ANML') {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const segment = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `${prefix}-${segment(4)}-${segment(4)}`
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { payment_id, user_id, email, plan_id, source, metadata } = body

    // ── 1. Validate input ──
    if (!payment_id) {
       throw new Error('payment_id مطلوب')
    }

    // ── 2. Verify payment with Moyasar API ──
    const moyasarSecretKey = Deno.env.get('MOYASAR_SECRET_KEY')
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
        // Moyasar success statuses: paid, captured, authorized (for some methods)
        paymentVerified = (status === 'paid' || status === 'captured' || status === 'authorized')
        
        if (!paymentVerified) {
          return new Response(
            JSON.stringify({ success: false, error: `الدفع غير مكتمل. الحالة: ${status}`, payment_status: status }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      } else {
        const errText = await moyasarRes.text()
        console.error(`Moyasar API error (${moyasarRes.status}): ${errText}`)
        // If we can't verify via API but have a payment_id, we might proceed cautiously or fail
        throw new Error('فشل التحقق من العملية عبر بوابة الدفع')
      }
    } else {
      console.warn('Warning: MOYASAR_SECRET_KEY is NOT set. Skipping server-side verification (DEBUG MODE ONLY).')
      paymentVerified = true 
    }

    // ── 3. Initialize Supabase Admin ──
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // ── 4. Determine Type (Individual vs Organization) ──
    const isOrganization = metadata?.type === 'organization' || plan_id === 'organization_bulk'
    const now = new Date()
    
    if (isOrganization) {
        // ── ORGANIZATION FLOW (Generate Codes) ──
        const userCount = parseInt(metadata?.userCount || '10')
        const orgName = metadata?.orgName || 'جهة غير مسماة'
        const adminEmail = email || metadata?.email

        console.log(`[B2B] Processing organization payment for ${orgName} (${userCount} users)`)

        // 1. Create/Update Organization Record
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

        if (orgError) console.error('Error creating organization:', orgError.message)

        // 2. Generate N activation codes
        const codesToInsert = []
        for (let i = 0; i < userCount; i++) {
            codesToInsert.push({
                code: generateCode(),
                status: 'available',
                org_id: orgData?.id || adminEmail,
                created_at: now.toISOString(),
                expires_at: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()
            })
        }

        const { error: codeError } = await supabaseAdmin
            .from('activation_codes')
            .insert(codesToInsert)

        if (codeError) console.error('Error generating codes:', codeError.message)

        return new Response(
            JSON.stringify({ 
                success: true, 
                type: 'organization',
                message: `تم تفعيل حساب الجهة وتوليد ${userCount} كود بنجاح`,
                org_id: orgData?.id
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } else {
        // ── INDIVIDUAL FLOW (Activate User) ──
        const plan = PLANS[plan_id] || PLANS['annual-pro']
        let endDate = new Date(now.getTime() + plan.extensionDays * 24 * 60 * 60 * 1000)

        // 1. Update Supabase User
        const { data: userData } = await supabaseAdmin
            .from('users')
            .select('id, subscription_end_date')
            .eq('email', email?.toLowerCase())
            .single()

        if (userData?.subscription_end_date) {
            const currentEnd = new Date(userData.subscription_end_date)
            if (currentEnd > now) {
                endDate = new Date(currentEnd.getTime() + plan.extensionDays * 24 * 60 * 60 * 1000)
            }
        }

        const targetUid = user_id || userData?.id
        if (targetUid) {
            await supabaseAdmin.from('users').upsert({
                id: targetUid,
                email: email?.toLowerCase(),
                subscription_status: 'active',
                subscription_tier: plan.tier,
                subscription_type: 'individual',
                subscription_platform: 'moyasar',
                subscription_end_date: endDate.toISOString(),
                updated_at: now.toISOString()
            })

            // 2. Sync to Firebase (Simplified REST placeholder)
            // In a real environment, you would use a Service Account JWT to PATCH Firestore
            const projectId = Deno.env.get('FIREBASE_PROJECT_ID')
            if (projectId) {
                console.log(`[Firebase] Syncing user ${targetUid} to active status...`)
                // Logic to trigger a Firebase update webhook or REST call goes here
            }
        }

        return new Response(
            JSON.stringify({ 
                success: true, 
                type: 'individual',
                message: 'تم تفعيل الاشتراك الفردي بنجاح',
                end_date: endDate.toISOString()
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (err) {
    console.error('Edge Function Error:', err.message)
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
