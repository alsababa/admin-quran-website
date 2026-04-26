
import { supabase } from './lib/supabase.js';
import { adminDb } from './lib/firebase-admin.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkSchema() {
    console.log("Checking Supabase activation_codes...");
    try {
        const { data, error } = await supabase.from('activation_codes').select('*').limit(1);
        if (error) {
            console.error("Supabase Error:", error);
        } else {
            console.log("Supabase sample code:", data[0]);
        }
    } catch (e) {
        console.error("Supabase request failed:", e);
    }

    console.log("\nChecking Firestore collections...");
    try {
        const collections = await adminDb.listCollections();
        console.log("Available collections:", collections.map(c => c.id));
        
        if (collections.find(c => c.id === 'activation_codes')) {
            console.log("activation_codes collection found in Firestore.");
            const snap = await adminDb.collection('activation_codes').limit(1).get();
            if (!snap.empty) {
                console.log("Firestore sample code:", snap.docs[0].data());
            }
        }
    } catch (e) {
        console.error("Firestore request failed:", e);
    }
}

checkSchema();
