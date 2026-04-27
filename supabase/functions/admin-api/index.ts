// Supabase Edge Function: admin-api
// Handles administrative operations for the Quran Admin Dashboard
// Compatible with Static Export (no Server Actions needed)

import { createClient } from 'npm:@supabase/supabase-js@2'
import { initializeApp, cert, getApp, getApps } from 'npm:firebase-admin@12/app'
import { getFirestore } from 'npm:firebase-admin@12/firestore'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// ── Firebase Initialization Helper ───────────────────────────
function getFirebaseDb() {
  try {
    if (getApps().length === 0) {
      const serviceAccountStr = Deno.env.get('FIREBASE_SERVICE_ACCOUNT_B64');
      if (!serviceAccountStr) throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_B64 secret');
      
      const serviceAccount = JSON.parse(atob(serviceAccountStr));
      initializeApp({
        credential: cert(serviceAccount)
      });
    }
    return getFirestore();
  } catch (err) {
    console.error('[Firebase Init Error]', err.message);
    return null;
  }
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, payload } = await req.json()

    // 1. Initialize Supabase Admin
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    console.log(`[AdminAPI] Action: ${action}`)

    let result = { success: false, data: null, error: null }

    switch (action) {
      case 'generate-codes': {
        const { codes } = payload
        
        console.log('[AdminAPI] SUPABASE_URL:', supabaseUrl)

        // Normalize keys + whitelist only real DB columns
        const normalizedCodes = (codes || []).map((item: any) => ({
          code: item.code,
          country_code: item.country_code ?? item.countryCode ?? '+966',
          duration_years: item.duration_years ?? item.durationYears ?? 1,
          status: item.status ?? 'available',
          org_id: item.org_id ?? item.orgId ?? null,
          batch_id: item.batch_id ?? item.batchId ?? null,
          expires_at: item.expires_at ?? item.expiresAt ?? null,
          used_at: item.used_at ?? item.usedAt ?? null,
          used_by: item.used_by ?? item.usedBy ?? null,
        }))

        // A. Insert into Supabase
        let { data, error } = await supabaseAdmin
          .from('activation_codes')
          .insert(normalizedCodes)
          .select()
        
        // If it fails with "column not found" / "schema cache" error, try without the new columns
        if (error && (error.message.includes('column') || error.code === 'PGRST204')) {
          console.warn('[AdminAPI] Some columns missing in schema, retrying with minimum fields...');
          const safeCodes = normalizedCodes.map(({ country_code, duration_years, ...rest }: any) => rest);
          const retry = await supabaseAdmin
            .from('activation_codes')
            .insert(safeCodes)
            .select()
          
          data = retry.data;
          error = retry.error;
        }

        if (error) throw error;

        // B. Sync to Firebase Firestore
        const firestore = getFirebaseDb();
        if (firestore) {
          const batch = firestore.batch();
          codes.forEach((item: any) => {
            const docRef = firestore.collection('activation_codes').doc(item.code);
            batch.set(docRef, {
              ...item,
              platform: 'web-admin',
              syncedAt: new Date().toISOString()
            });
          });
          await batch.commit();
          console.log(`[AdminAPI] Successfully synced ${codes.length} codes to Firestore`);
        } else {
          console.warn('[AdminAPI] Firebase Sync skipped: Firestore not initialized');
        }

        result = { success: true, data, error: null }
        break
      }

      case 'delete-code': {
        const { id, codeString } = payload
        const { error } = await supabaseAdmin
          .from('activation_codes')
          .delete()
          .eq('id', id)
        
        if (error) throw error

        // Optional: Sync delete to Firebase
        if (codeString) {
            const firestore = getFirebaseDb();
            if (firestore) {
                await firestore.collection('activation_codes').doc(codeString).delete();
            }
        }

        result = { success: true, data: null, error: null }
        break
      }

      case 'delete-batch': {
        const { batchId } = payload
        const { error } = await supabaseAdmin
          .from('activation_codes')
          .delete()
          .eq('batch_id', batchId)
        
        if (error) throw error
        
        // Note: Batch deletion in Firebase requires querying by batch_id
        const firestore = getFirebaseDb();
        if (firestore) {
            const snapshot = await firestore.collection('activation_codes').where('batch_id', '==', batchId).get();
            const batch = firestore.batch();
            snapshot.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
        }

        result = { success: true, data: null, error: null }
        break
      }

      case 'update-user': {
        const { userId, updates } = payload
        const { data, error } = await supabaseAdmin
          .from('users')
          .update(updates)
          .eq('id', userId)
          .select()
        
        if (error) throw error
        result = { success: true, data, error: null }
        break
      }

      case 'delete-user': {
        const { userId } = payload
        const { error } = await supabaseAdmin
          .from('users')
          .delete()
          .eq('id', userId)
        
        if (error) throw error
        result = { success: true, data: null, error: null }
        break
      }

      default:
        throw new Error(`Unsupported action: ${action}`)
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('[AdminAPI] Error:', err.message)
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
