// Supabase Edge Function: moyasar-webhook
// Handles payment webhooks directly from Moyasar
// Deploy with: supabase functions deploy moyasar-webhook
// Set secret: supabase secrets set MOYASAR_WEBHOOK_SECRET=your_secret_here
// Set secrets: supabase secrets set FIREBASE_PROJECT_ID=xxx
// Set secrets: supabase secrets set FIREBASE_SERVICE_ACCOUNT_B64=xxx

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as jose from 'https://deno.land/x/jose@v4.14.4/index.ts'

// Plan definitions based on app/pay/page.js
const PLANS = {
  'annual-pro': { extensionDays: 365, tier: 'premium' },
  'premium_yearly': { extensionDays: 365, tier: 'premium' },
  'organization_bulk': { extensionDays: 365, tier: 'premium' },
}

/**
 * Get Google OAuth2 Access Token for Firebase
 */
async function getGoogleAuthToken(serviceAccountB64: string) {
  try {
    const jsonStr = atob(serviceAccountB64)
    const sa = JSON.parse(jsonStr)

    const now = Math.floor(Date.now() / 1000)
    const iat = now
    const exp = now + 3600

    const jwt = await new jose.SignJWT({
      iss: sa.client_email,
      sub: sa.client_email,
      aud: 'https://oauth2.googleapis.com/token',
      iat,
      exp,
      scope: 'https://www.googleapis.com/auth/datastore',
    })
      .setProtectedHeader({ alg: 'RS256' })
      .sign(await jose.importPKCS8(sa.private_key, 'RS256'))

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(`OAuth error: ${data.error_description || data.error}`)
    return data.access_token
  } catch (err) {
    console.error('[FirebaseAuth] Error getting token:', err.message)
    return null
  }
}

/**
 * Sync subscription status to Firestore
 */
async function syncToFirebase(userId: string, data: any) {
  const projectId = Deno.env.get('FIREBASE_PROJECT_ID')
  const saB64 = Deno.env.get('FIREBASE_SERVICE_ACCOUNT_B64')
  
  if (!projectId || !saB64) {
    console.warn('[FirebaseSync] Missing credentials, skipping sync.')
    return false
  }

  const token = await getGoogleAuthToken(saB64)
  if (!token) return false

  try {
    const fields: any = {}
    if (data.subscriptionStatus) fields.subscriptionStatus = { stringValue: data.subscriptionStatus }
    if (data.subscriptionTier) fields.subscriptionTier = { stringValue: data.subscriptionTier }
    if (data.subscriptionType) fields.subscriptionType = { stringValue: data.subscriptionType }
    if (data.endDate) fields.endDate = { stringValue: data.endDate }
    if (data.lastPaymentId) fields.lastPaymentId = { stringValue: data.lastPaymentId }
    fields.updatedAt = { stringValue: new Date().toISOString() }

    const updateMask = Object.keys(fields).map(f => `updateMask.fieldPaths=${f}`).join('&')
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}?${updateMask}`

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error(`[FirebaseSync] Firestore error (${res.status}): ${errText}`)
      return false
    }

    console.log(`[FirebaseSync] Successfully synced user ${userId}`)
    return true
  } catch (err) {
    console.error('[FirebaseSync] Error:', err.message)
    return false
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    // 1. Parse Payload
    const body = await req.json()
    console.log("Moyasar Webhook Received:", JSON.stringify(body))

    const paymentData = body.data || body;
    const paymentId = paymentData.id;
    if (!paymentId) {
       return new Response(JSON.stringify({ error: "No payment ID found" }), { status: 400 })
    }

    // 2. Initial Checks
    if (paymentData.status !== 'paid' && paymentData.status !== 'captured' && paymentData.status !== 'authorized') {
        console.log(`Payment status is ${paymentData.status}. Ignoring.`);
        return new Response(JSON.stringify({ message: "Ignored" }), { status: 200 })
    }

    // 3. Initialize Supabase Admin
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Check for idempotency
    const { data: existingPay } = await supabaseAdmin
      .from('payments')
      .select('id')
      .eq('payment_id', paymentId)
      .maybeSingle()

    if (existingPay) {
      console.log(`[Webhook] Payment ${paymentId} already processed. Skipping.`)
      return new Response(JSON.stringify({ success: true, message: 'Already processed' }), { status: 200 })
    }

    // 4. Extract Metadata
    const metadata = paymentData.metadata || {};
    const userId = metadata.userId || metadata.user_id;
    const email = metadata.email;
    const planId = metadata.planId || metadata.plan_id || 'annual-pro';
    const isOrganization = metadata.type === 'organization' || metadata.type === 'org';

    if (!userId && !isOrganization) {
        throw new Error("Missing required metadata: userId")
    }

    const now = new Date()
    let finalEndDate = null

    // 5. Update Database
    if (isOrganization) {
        const userCount = parseInt(metadata.userCount || '10')
        const orgName = metadata.orgName || 'جهة غير مسماة'
        const adminEmail = email

        console.log(`[Webhook] Activating Organization: ${orgName} with ${userCount} users`)

        await supabaseAdmin
            .from('organizations')
            .upsert({
                name: orgName,
                admin_email: adminEmail?.toLowerCase(),
                subscription_status: 'active',
                subscription_end_date: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                max_users: userCount,
                updated_at: now.toISOString()
            }, { onConflict: 'admin_email' })

    } else {
        const plan = PLANS[planId] || PLANS['annual-pro']
        const extensionMs = plan.extensionDays * 24 * 60 * 60 * 1000
        
        let newEndDate = new Date(now.getTime() + extensionMs)

        const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('subscription_end_date')
            .eq('id', userId)
            .maybeSingle()

        if (existingUser?.subscription_end_date) {
            const currentEnd = new Date(existingUser.subscription_end_date)
            if (currentEnd > now) {
                newEndDate = new Date(currentEnd.getTime() + extensionMs)
            }
        }

        finalEndDate = newEndDate.toISOString()
        console.log(`[Webhook] Activating Individual: ${userId} until ${finalEndDate}`)

        await supabaseAdmin.from('users').upsert({
            id: userId,
            email: email?.toLowerCase(),
            subscription_status: 'active',
            subscription_tier: plan.tier,
            subscription_type: 'individual',
            subscription_platform: 'moyasar_webhook',
            subscription_transaction_id: paymentId,
            subscription_end_date: finalEndDate,
            updated_at: now.toISOString()
        })

        // 6. Sync to Firebase
        await syncToFirebase(userId, {
            subscriptionStatus: 'active',
            subscriptionTier: plan.tier,
            subscriptionType: 'individual',
            endDate: finalEndDate,
            lastPaymentId: paymentId
        })
    }

    // 7. Record Payment in DB
    const { error: payError } = await supabaseAdmin.from('payments').insert({
        payment_id: paymentId,
        user_id: userId,
        email: email,
        plan_id: planId,
        amount: paymentData.amount,
        currency: paymentData.currency || 'SAR',
        status: paymentData.status,
        platform: 'moyasar_webhook',
        metadata: metadata,
        created_at: now.toISOString()
    })

    if (payError) console.error("Error recording payment:", payError.message)

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })

  } catch (err) {
    console.error('Webhook Error:', err.message)
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})
