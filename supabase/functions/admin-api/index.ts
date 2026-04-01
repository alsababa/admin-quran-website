// Supabase Edge Function: admin-api
// Handles administrative operations for the Quran Admin Dashboard
// Compatible with Static Export (no Server Actions needed)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
        const { data, error } = await supabaseAdmin
          .from('activation_codes')
          .insert(codes)
          .select()
        
        if (error) throw error
        result = { success: true, data, error: null }
        break
      }

      case 'delete-code': {
        const { id } = payload
        const { error } = await supabaseAdmin
          .from('activation_codes')
          .delete()
          .eq('id', id)
        
        if (error) throw error
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
