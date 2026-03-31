import { NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin (Required for server-side updates)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);
    
    // Optional: Verify Webhook Signature if secret exists
    const signature = req.headers.get('moyasar-signature');
    if (process.env.MOYASAR_WEBHOOK_SECRET && !signature) {
        return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    console.log("Moyasar Webhook Received:", JSON.stringify(payload, null, 2));

    // 1. Verify Payment Status
    if (payload.status !== 'paid' && payload.status !== 'captured') {
        return NextResponse.json({ message: "Payment not paid, skipping update." }, { status: 200 });
    }

    // 2. Extract Metadata
    const { userId, source } = payload.metadata || {};

    if (!userId || !source) {
        throw new Error("Missing metadata (userId/source)");
    }

    // 3. Initialize Admin App (Safe inside handler)
    const adminApp = getAdminApp();
    const adminDb = adminApp.firestore();

    const extensionDays = 365; // Yearly plan (1 Year)
    let newEndDate = new Date();

    // 4. Update Database based on Source
    if (source === 'firebase') {
        // Use Firebase Admin SDK (adminDb) to bypass client-side security rules
        const userRef = adminDb.collection('users').doc(userId);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
            throw new Error(`Firebase user ${userId} not found`);
        }

        const userData = userSnap.data();
        let currentEnd = new Date();
        
        // Handle existing endDate
        if (userData.endDate) {
            const dateVal = userData.endDate.toDate ? userData.endDate.toDate() : new Date(userData.endDate);
            if (dateVal > currentEnd) currentEnd = dateVal;
        }

        newEndDate = new Date(currentEnd);
        newEndDate.setDate(newEndDate.getDate() + extensionDays);

        await userRef.update({
            subscriptionStatus: 'active',
            subscriptionTier: 'premium',
            endDate: newEndDate.toISOString(),
            lastPaymentId: payload.id,
            platform: 'moyasar',
            updatedAt: new Date().toISOString()
        });
        console.log(`Firebase user ${userId} activated via Admin SDK until ${newEndDate.toISOString()}`);

    } else if (source === 'supabase') {
        const { data: user, error: fetchError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (fetchError || !user) throw new Error(`Supabase user ${userId} not found`);

        let currentEnd = new Date();
        if (user.end_date) {
            const dateVal = new Date(user.end_date);
            if (dateVal > currentEnd) currentEnd = dateVal;
        }

        newEndDate = new Date(currentEnd);
        newEndDate.setDate(newEndDate.getDate() + extensionDays);

        const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({
                subscription_status: 'active',
                subscription_tier: 'premium',
                end_date: newEndDate.toISOString(),
                platform: 'moyasar'
            })
            .eq('id', userId);

        if (updateError) throw updateError;
        console.log(`Supabase user ${userId} activated until ${newEndDate.toISOString()}`);
    }

    return NextResponse.json({ 
        success: true, 
        message: "User subscription activated successfully",
        newEndDate: newEndDate.toISOString()
    });

  } catch (err) {
    console.error("Webhook Error Handled:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
