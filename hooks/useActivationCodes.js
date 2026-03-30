"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { 
    fetchCodesAction, 
    generateCodesAction, 
    deleteCodeAction, 
    deleteBatchAction 
} from '@/app/actions/codeActions';

export function useActivationCodes() {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Fetch All Codes ───────────────────────────────────────
    const fetchCodes = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchCodesAction();
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
            const result = await generateCodesAction({ count, orgId, prefix, expiresAt });
            
            // Refresh list
            await fetchCodes();
            return result;
        } catch (err) {
            console.error("Error generating codes:", err);
            return { success: false, error: err.message };
        }
    };

    // ── Delete Specific Code ──────────────────────────────────
    const deleteCode = async (id) => {
        try {
            await deleteCodeAction(id);
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
            await deleteBatchAction(batchId);
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
