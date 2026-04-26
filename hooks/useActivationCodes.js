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
            const { data, error } = await supabase
                .from('activation_codes')
                .select('*') 
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCodes(data || []);
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

    // ── Delete Specific Code ──────────────────────────────────
    const deleteCode = async (id) => {
        try {
            const result = await deleteCodeAdmin(id);
            if (!result.success) throw new Error(result.error);
            setCodes(prev => prev.filter(c => c.id !== id));
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
