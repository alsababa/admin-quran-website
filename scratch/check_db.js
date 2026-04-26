
import { createClient } from '@supabase/supabase-js';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const firebaseKeyB64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;

async function runCheck() {
    console.log("=== Database Diagnostic Tool ===");

    // 1. Check Supabase
    if (supabaseUrl && supabaseServiceKey) {
        console.log("\n[Supabase] Checking connection...");
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        const { data: columns, error: colError } = await supabase.rpc('get_column_info', { table_name: 'activation_codes' });
        
        // Alternative if RPC doesn't exist
        const { data: sample, error: selectError } = await supabase.from('activation_codes').select('*').limit(1);
        
        if (selectError) {
            console.error("[Supabase] Error accessing activation_codes:", selectError.message);
            if (selectError.message.includes("does not exist")) {
                console.log(">> CRITICAL: Table 'activation_codes' is MISSING in Supabase.");
            }
        } else {
            console.log("[Supabase] Table exists. Sample record fields:", Object.keys(sample[0] || {}));
            const hasCountry = sample[0] && 'country_code' in sample[0];
            if (!hasCountry) {
                console.log(">> WARNING: 'country_code' column is MISSING in Supabase.");
            } else {
                console.log(">> SUCCESS: 'country_code' exists in Supabase.");
            }
        }
    }

    // 2. Check Firebase
    if (firebaseKeyB64) {
        console.log("\n[Firebase] Checking connection...");
        try {
            const serviceAccount = JSON.parse(Buffer.from(firebaseKeyB64, 'base64').toString());
            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });
            }
            const db = admin.firestore();
            const collections = await db.listCollections();
            const collectionIds = collections.map(c => c.id);
            console.log("[Firebase] Available collections:", collectionIds);
            
            if (collectionIds.includes('activation_codes')) {
                console.log(">> SUCCESS: 'activation_codes' collection exists in Firestore.");
                const snap = await db.collection('activation_codes').limit(1).get();
                if (!snap.empty) {
                    console.log("[Firebase] Sample document fields:", Object.keys(snap.docs[0].data()));
                }
            } else {
                console.log(">> NOTE: 'activation_codes' collection does not exist yet in Firestore (will be created on first generation).");
            }
        } catch (err) {
            console.error("[Firebase] Connection failed:", err.message);
        }
    }
}

runCheck().catch(console.error);
