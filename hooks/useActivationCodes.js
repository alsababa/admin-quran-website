"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export function useActivationCodes() {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Fetch All Codes ───────────────────────────────────────
    const fetchCodes = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('activation_codes')
                .select('*, organization:auth.users(id, email, full_name)') // Simplified join
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
    const generateBulkCodes = async ({ count, orgId, prefix = 'ANML', expiresAt = null }) => {
        try {
            const batchId = crypto.randomUUID();
            const newCodes = [];

            for (let i = 0; i < count; i++) {
                // Generate a random 8-character alphanumeric code
                const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
                const codeString = `${prefix}-${randomPart}`;
                
                newCodes.push({
                    code: codeString,
                    batch_id: batchId,
                    org_id: orgId,
                    expires_at: expiresAt,
                    status: 'available'
                });
            }

            const { data, error } = await supabase
                .from('activation_codes')
                .insert(newCodes)
                .select();

            if (error) throw error;
            
            // Refresh list
            await fetchCodes();
            return { success: true, batchId, codes: data };
        } catch (err) {
            console.error("Error generating codes:", err);
            return { success: false, error: err.message };
        }
    };

    // ── Delete Specific Code ──────────────────────────────────
    const deleteCode = async (id) => {
        try {
            const { error } = await supabase
                .from('activation_codes')
                .delete()
                .eq('id', id);

            if (error) throw error;
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
            const { error } = await supabase
                .from('activation_codes')
                .delete()
                .eq('batch_id', batchId);

            if (error) throw error;
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
