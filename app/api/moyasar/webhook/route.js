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
    const { userId, source, planId } = payload.metadata || {};

    if (!userId || !source) {
        throw new Error("Missing metadata (userId/source)");
    }

    // 3. Initialize Admin App (Safe inside handler)
    const adminApp = getAdminApp();
    const adminDb = adminApp.firestore();

    // Determine extension days based on planId
    let extensionDays = 365; // Default to Yearly
    if (planId === 'premium_monthly') extensionDays = 30;
    
    let newEndDate = new Date();

    // 4. Update Database with Dual-Sync Logic
    let userEmail = payload.metadata?.email;
    
    if (source === 'firebase') {
        const userRef = adminDb.collection('users').doc(userId);
        const userSnap = await userRef.get();

        if (userSnap.exists) {
            const userData = userSnap.data();
            userEmail = userData.email || userEmail;
            
            let currentEnd = new Date();
            if (userData.endDate) {
                const dateVal = userData.endDate.toDate ? userData.endDate.toDate() : new Date(userData.endDate);
                if (dateVal > currentEnd) currentEnd = dateVal;
            }

            newEndDate = new Date(currentEnd);
            newEndDate.setDate(newEndDate.getDate() + extensionDays);

            const firebaseUpdates = {
                subscriptionStatus: 'active',
                subscriptionTier: 'premium',
                subscriptionType: userData.subscriptionType || 'individual',
                isOrgAdmin: userData.isOrgAdmin || false,
                planId: planId || 'premium_yearly',
                endDate: newEndDate.toISOString(),
                lastPaymentId: payload.id,
                platform: 'moyasar',
                updatedAt: new Date().toISOString()
            };

            await userRef.update(firebaseUpdates);
            console.log(`Firebase user ${userId} activated via Webhook until ${newEndDate.toISOString()}`);

            // SMART SYNC: Check if this email exists in Supabase and update it too
            if (userData.email) {
                try {
                    const { data: sbMatch } = await supabaseAdmin
                        .from('users')
                        .select('id')
                        .eq('email', userData.email.toLowerCase())
                        .single();

                    if (sbMatch) {
                        await supabaseAdmin
                            .from('users')
                            .update({
                                subscription_status: 'active',
                                subscription_tier: 'premium',
                                subscription_type: firebaseUpdates.subscriptionType,
                                is_org_admin: firebaseUpdates.isOrgAdmin,
                                plan_id: firebaseUpdates.planId,
                                end_date: firebaseUpdates.endDate,
                                platform: 'moyasar_sync'
                            })
                            .eq('id', sbMatch.id);
                        console.log(`Smart Sync: Supabase user ${sbMatch.id} also activated via Email match.`);
                    }
                } catch (syncErr) {
                    console.warn("Smart Sync (FB->SB) skip or fail:", syncErr.message);
                }
            }

            // Dual-Sync: Update Supabase if counterpart exists
            if (userEmail) {
                const { data: sbCounterpart } = await supabaseAdmin.from('users').select('id').eq('email', userEmail).single();
                if (sbCounterpart) {
                    await supabaseAdmin.from('users').update({
                        subscription_status: 'active',
                        subscription_tier: 'premium',
                        subscription_type: firebaseUpdates.subscriptionType,
                        is_org_admin: firebaseUpdates.isOrgAdmin,
                        plan_id: firebaseUpdates.planId,
                        end_date: firebaseUpdates.endDate,
                        platform: 'moyasar'
                    }).eq('id', sbCounterpart.id);
                    console.log(`Dual-Sync: Automatically updated Supabase counterpart for ${userEmail}`);
                }
            }
        }
    } else if (source === 'supabase') {
        const { data: user, error: fetchError } = await supabaseAdmin.from('users').select('*').eq('id', userId).single();

        if (user && !fetchError) {
            userEmail = user.email || userEmail;
            
            let currentEnd = new Date();
            if (user.end_date) {
                const dateVal = new Date(user.end_date);
                if (dateVal > currentEnd) currentEnd = dateVal;
            }

            newEndDate = new Date(currentEnd);
            newEndDate.setDate(newEndDate.getDate() + extensionDays);

            const supabaseUpdates = {
                subscription_status: 'active',
                subscription_tier: 'premium',
                subscription_type: user.subscription_type || 'individual',
                is_org_admin: user.is_org_admin || false,
                plan_id: planId || 'premium_yearly',
                end_date: newEndDate.toISOString(),
                platform: 'moyasar'
            };

            const { error: updateError } = await supabaseAdmin.from('users').update(supabaseUpdates).eq('id', userId);
            if (updateError) throw updateError;
            console.log(`Supabase user ${userId} activated until ${newEndDate.toISOString()}`);

            // SMART SYNC: Check if this email exists in Firebase and update it too
            if (user.email) {
                try {
                    const fbSnapshot = await adminDb.collection('users')
                        .where('email', '==', user.email.toLowerCase())
                        .limit(1)
                        .get();

                    if (!fbSnapshot.empty) {
                        const fbUser = fbSnapshot.docs[0];
                        await fbUser.ref.update({
                            subscriptionStatus: 'active',
                            subscriptionTier: 'premium',
                            subscriptionType: user.subscription_type || 'individual',
                            isOrgAdmin: user.is_org_admin || false,
                            endDate: newEndDate.toISOString(),
                            platform: 'moyasar_sync',
                            updatedAt: new Date().toISOString()
                        });
                        console.log(`Smart Sync: Firebase user ${fbUser.id} also activated via Email match.`);
                    }
                } catch (syncErr) {
                    console.warn("Smart Sync (SB->FB) skip or fail:", syncErr.message);
                }
            }

            // Dual-Sync: Update Firebase if counterpart exists
            if (userEmail) {
                const firebaseUsers = await adminDb.collection('users').where('email', '==', userEmail).limit(1).get();
                if (!firebaseUsers.empty) {
                    const fbUser = firebaseUsers.docs[0];
                    await fbUser.ref.update({
                        subscriptionStatus: 'active',
                        subscriptionTier: 'premium',
                        subscriptionType: supabaseUpdates.subscription_type,
                        isOrgAdmin: supabaseUpdates.is_org_admin,
                        planId: supabaseUpdates.plan_id,
                        endDate: supabaseUpdates.end_date,
                        platform: 'moyasar',
                        updatedAt: new Date().toISOString()
                    });
                    console.log(`Dual-Sync: Automatically updated Firebase counterpart for ${userEmail}`);
                }
            }
        }
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
