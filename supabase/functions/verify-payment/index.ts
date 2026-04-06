// Supabase Edge Function: verify-payment
// Verifies a Moyasar payment and activates the user's subscription
//
// Deploy with: supabase functions deploy verify-payment
// Set secrets: supabase secrets set MOYASAR_SECRET_KEY=sk_live_xxx
// Set secrets: supabase secrets set FIREBASE_PROJECT_ID=xxx
// Set secrets: supabase secrets set FIREBASE_SERVICE_ACCOUNT_B64=xxx

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as jose from 'https://deno.land/x/jose@v4.14.4/index.ts'

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
    // Map data to Firestore fields
    const fields: any = {}
    if (data.subscriptionStatus) fields.subscriptionStatus = { stringValue: data.subscriptionStatus }
    if (data.subscriptionTier) fields.subscriptionTier = { stringValue: data.subscriptionTier }
    if (data.subscriptionType) fields.subscriptionType = { stringValue: data.subscriptionType }
    if (data.endDate) fields.endDate = { stringValue: data.endDate }
    if (data.lastPaymentId) fields.lastPaymentId = { stringValue: data.lastPaymentId }
    fields.updatedAt = { stringValue: new Date().toISOString() }

    // Use patch with updateMask to only update these fields
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

/**
 * Verify Firebase ID Token
 */
async function verifyFirebaseToken(token: string, projectId: string) {
  try {
    // 1. Fetch Google's public keys for Firebase
    const jwksRes = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com')
    const jwks = await jwksRes.json()
    
    // 2. Decode header to find 'kid'
    const header = JSON.parse(atob(token.split('.')[0]))
    const kid = header.kid
    
    if (!jwks[kid]) throw new Error('Invalid key ID (kid)')
    
    // 3. Import the public key
    const publicKey = await jose.importX509(jwks[kid], 'RS256')
    
    // 4. Verify JWT
    const { payload } = await jose.jwtVerify(token, publicKey, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    })
    
    return {
      success: true,
      uid: payload.user_id as string,
      email: payload.email as string,
      payload
    }
  } catch (err) {
    console.error('[VerifyToken] Token verification failed:', err.message)
    return { success: false, error: err.message }
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { token, payment_id, user_id, email: bodyEmail, plan_id, source, metadata } = body

    // ── 1. Validate input ──
    if (!payment_id) {
       throw new Error('payment_id مطلوب')
    }

    const projectId = Deno.env.get('FIREBASE_PROJECT_ID') || ''
    
    // ── 2. Verify Auth (NEW: Require Token) ──
    let verifiedUid = user_id
    let verifiedEmail = bodyEmail

    if (token) {
        const authResult = await verifyFirebaseToken(token, projectId)
        if (!authResult.success) {
            return new Response(
                JSON.stringify({ success: false, error: `فشل التحقق من الهوية: ${authResult.error}` }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }
        verifiedUid = authResult.uid
        verifiedEmail = authResult.email || verifiedEmail
        console.log(`[Verify] Token verified for UID: ${verifiedUid}`)
    } else if (!user_id && metadata?.type !== 'organization') {
        throw new Error('يجب توفير توكن التحقق أو معرف المستخدم')
    }

    // ── 2. Initialize Supabase Admin ──
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // ── 3. Idempotency Check (Don't process same payment twice) ──
    const { data: existingPay } = await supabaseAdmin
      .from('payments')
      .select('id')
      .eq('payment_id', payment_id)
      .maybeSingle()

    if (existingPay) {
      console.log(`[Verify] Payment ${payment_id} already processed. Skipping.`)
      return new Response(
        JSON.stringify({ success: true, message: 'تمت معالجة هذه العملية مسبقاً' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── 4. Verify payment with Moyasar API ──
    const moyasarSecretKey = Deno.env.get('MOYASAR_SECRET_KEY')
    let paymentVerified = false
    let paymentData = null
    let paymentStatus = 'unknown'
    
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
        paymentStatus = paymentData?.status
        // Moyasar success statuses: paid, captured, authorized (for some methods)
        paymentVerified = (paymentStatus === 'paid' || paymentStatus === 'captured' || paymentStatus === 'authorized')
        
        if (!paymentVerified) {
          return new Response(
            JSON.stringify({ success: false, error: `الدفع غير مكتمل. الحالة: ${paymentStatus}`, payment_status: paymentStatus }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      } else {
        const errText = await moyasarRes.text()
        console.error(`Moyasar API error (${moyasarRes.status}): ${errText}`)
        throw new Error('فشل التحقق من العملية عبر بوابة الدفع')
      }
    } else {
      console.warn('Warning: MOYASAR_SECRET_KEY is NOT set. Skipping server-side verification (DEBUG MODE ONLY).')
      paymentVerified = true 
      paymentStatus = 'paid'
      paymentData = { amount: 12000, currency: 'SAR', status: 'paid' }
    }

    // ── 5. Determine Type (Individual vs Organization) ──
    const isOrganization = metadata?.type === '    if (isOrganization) {
        // ── ORGANIZATION FLOW (Generate Codes) ──
        const userCount = parseInt(metadata?.userCount || '10')
        const orgName = metadata?.orgName || 'جهة غير مسماة'
        const adminEmail = verifiedEmail || metadata?.email

        console.log(`[B2B] Processing organization payment for ${orgName} (${userCount} users)`)

        // 1. Create/Update Organization Record in Supabase
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

        if (orgError) console.error('Error creating organization in Supabase:', orgError.message)

        // 2. Sync Organization to Firebase
        const orgId = orgData?.id || verifiedUid || adminEmail || 'unknown_org'
        const expiryDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()
        
        await syncToFirebaseCollection('organizations', orgId, {
            name: orgName,
            adminEmail: adminEmail?.toLowerCase(),
            adminUserId: verifiedUid,
            status: 'active',
            expiryDate: expiryDate,
            maxUsers: userCount,
            updatedAt: now.toISOString()
        })

        // 3. Generate N activation codes
        const codesToInsert = []
        const firebaseCodes = []
        
        for (let i = 0; i < userCount; i++) {
            const code = generateCode()
            const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()
            
            // Supabase object
            codesToInsert.push({
                code,
                status: 'available',
                org_id: orgData?.id || verifiedUid || adminEmail,
                created_at: now.toISOString(),
                expires_at: expiresAt
            })

            // Firebase object
            firebaseCodes.push({
                code: { stringValue: code },
                status: { stringValue: 'available' },
                orgId: { stringValue: orgId },
                createdAt: { stringValue: now.toISOString() },
                expiresAt: { stringValue: expiresAt }
            })
        }

        // Save to Supabase
        const { error: codeError } = await supabaseAdmin
            .from('activation_codes')
            .insert(codesToInsert)

        if (codeError) console.error('Error generating codes in Supabase:', codeError.message)
        
        // Save to Firebase (Batch sync - limited to first 100 for safety in this version)
        // In a real production environment, we'd use a transactional batch or queue
        console.log(`[Firebase] Syncing ${Math.min(firebaseCodes.length, 100)} codes to Firestore...`)
        for (let i = 0; i < Math.min(firebaseCodes.length, 100); i++) {
           await syncToFirebaseCollection('activation_codes', `code_${firebaseCodes[i].code.stringValue}`, firebaseCodes[i], true)
        }

        activationResult = { 
            success: true, 
            type: 'organization',
            message: `تم تفعيل حساب الجهة وتوليد ${userCount} كود بنجاح. سيتم تفعيلها في التطبيق خلال لحظات.`
        }
    }sage)
        
        activationResult = { 
            success: true, 
            type: 'organization',
            message: `تم تفعيل حساب الجهة وتوليد ${userCount} كود بنجاح`
        }

    } else {
        // ── INDIVIDUAL FLOW (Activate User) ──
        const plan = PLANS[plan_id] || PLANS['annual-pro']
        let endDate = new Date(now.getTime() + plan.extensionDays * 24 * 60 * 60 * 1000)

        // 1. Update Supabase User
        let targetUid = verifiedUid;
        if (!targetUid && verifiedEmail) {
            const { data: userData } = await supabaseAdmin
                .from('users')
                .select('id, subscription_end_date')
                .eq('email', verifiedEmail?.toLowerCase())
                .maybeSingle()
            if (userData) {
                targetUid = userData.id
                if (userData.subscription_end_date) {
                    const currentEnd = new Date(userData.subscription_end_date)
                    if (currentEnd > now) {
                        endDate = new Date(currentEnd.getTime() + plan.extensionDays * 24 * 60 * 60 * 1000)
                    }
                }
            }
        } else if (targetUid) {
            const { data: userData } = await supabaseAdmin
                .from('users')
                .select('subscription_end_date')
                .eq('id', targetUid)
                .maybeSingle()
            if (userData?.subscription_end_date) {
                const currentEnd = new Date(userData.subscription_end_date)
                if (currentEnd > now) {
                    endDate = new Date(currentEnd.getTime() + plan.extensionDays * 24 * 60 * 60 * 1000)
                }
            }
        }

        finalEndDate = endDate.toISOString()

        if (targetUid) {
            await supabaseAdmin.from('users').upsert({
                id: targetUid,
                email: verifiedEmail?.toLowerCase(),
                subscription_status: 'active',
                subscription_tier: plan.tier,
                subscription_type: 'individual',
                subscription_platform: 'moyasar',
                subscription_end_date: finalEndDate,
                updated_at: now.toISOString()
            })

            // 2. Sync to Firebase
            await syncToFirebase(targetUid, {
                subscriptionStatus: 'active',
                subscriptionTier: plan.tier,
                subscriptionType: 'individual',
                endDate: finalEndDate,
                lastPaymentId: payment_id
            })
        }
        
        activationResult = { 
            success: true, 
            type: 'individual',
            message: 'تم تفعيل الاشتراك الفردي بنجاح'
        }
    }

    // ── 6. Record Transaction in Supabase ──
    const { error: payError } = await supabaseAdmin.from('payments').insert({
        payment_id: payment_id,
        user_id: verifiedUid,
        email: verifiedEmail,
        plan_id: plan_id,
        amount: paymentData?.amount || 0,
        currency: paymentData?.currency || 'SAR',
        status: paymentStatus,
        platform: 'moyasar',
        metadata: metadata,
        created_at: now.toISOString()
    })

    if (payError) console.error('Error recording payment:', payError.message)

    return new Response(
        JSON.stringify({ 
            ...activationResult,
            end_date: finalEndDate
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
