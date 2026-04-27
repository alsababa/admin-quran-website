"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { generateCodesAdmin, deleteCodeAdmin, deleteBatchAdmin } from '@/app/actions/userActions';

export function useActivationCodes() {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Fetch All Codes ───────────────────────────────────────
    const fetchCodes = useCallback(async () => {
        setLoading(true);
        try {
            // NOTE: auth.users is NOT accessible from the client anon key.
            // We only fetch the codes. If you need organization details, 
            // you must use a public profiles table.
            // Try to fetch all columns including country_code
            const { data, error } = await supabase
                .from('activation_codes')
                .select('id, code, status, created_at, expires_at, org_id, batch_id, country_code') 
                .order('created_at', { ascending: false });
            
            // If it fails because country_code is actually missing, fallback to known columns
            if (error && (error.message.includes('country_code') || error.code === 'PGRST204')) {
                console.warn('[Supabase] country_code missing in production schema cache. Falling back...');
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('activation_codes')
                    .select('id, code, status, created_at, expires_at, org_id, batch_id')
                    .order('created_at', { ascending: false });
                
                if (fallbackError) throw fallbackError;
                setCodes(fallbackData || []);
            } else if (error) {
                throw error;
            } else {
                setCodes(data || []);
            }
        } catch (err) {
            console.error("Error fetching codes:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCodes();
    }, [fetchCodes]);

    // ── Generate Bulk Codes ───────────────────────────────────
    const generateBulkCodes = async ({ count, orgId, prefix = 'ANML', countryCode = '', expiresAt = null }) => {
        try {
            const batchId = crypto.randomUUID();
            const newCodes = [];

            for (let i = 0; i < count; i++) {
                const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
                const codeString = `${prefix}-${randomPart}`;
                
                newCodes.push({
                    code: codeString,
                    batch_id: batchId,
                    org_id: orgId,
                    country_code: countryCode, // New field
                    expires_at: expiresAt,
                    status: 'available'
                });
            }

            const result = await generateCodesAdmin(newCodes);
            if (!result.success) throw new Error(result.error);
            
            // Refresh list
            await fetchCodes();
            return { success: true, batchId, codes: result.data };
        } catch (err) {
            console.error("Error generating codes:", err);
            return { success: false, error: err.message };
        }
    };

    // ── Delete Individual Code ──────────────────────────────
    const deleteCode = async (id, codeString) => {
        try {
            const result = await deleteCodeAdmin(id, codeString);
            if (!result.success) throw new Error(result.error);
            
            // Refresh
            await fetchCodes();
            return { success: true };
        } catch (err) {
            console.error("Error deleting code:", err);
            return { success: false, error: err.message };
        }
    };

    // ── Delete Entire Batch ───────────────────────────────────
    const deleteBatch = async (batchId) => {
        try {
            const result = await deleteBatchAdmin(batchId);
            if (!result.success) throw new Error(result.error);
            setCodes(prev => prev.filter(c => c.batch_id !== batchId));
            return { success: true };
        } catch (err) {
            console.error("Error deleting batch:", err);
            return { success: false, error: err.message };
        }
    };

    return {
        codes,
        loading,
        error,
        refresh: fetchCodes,
        generateBulkCodes,
        deleteCode,
        deleteBatch
    };
}
