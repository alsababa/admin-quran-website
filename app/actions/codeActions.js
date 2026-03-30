"use server";
import { supabaseAdmin as supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

/**
 * جلب جميع الأكواد مع بيانات المنظمة المرتبطة بها (من سكيما auth).
 */
export async function fetchCodesAction() {
    if (!supabase) throw new Error("Supabase Admin client not available.");

    const { data, error } = await supabase
        .from('activation_codes')
        .select('*, organization:auth.users(id, email, full_name)')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

/**
 * دالة توليد مجموعة من أكواد التفعيل في Supabase.
 */
export async function generateCodesAction({ count, orgId, prefix = 'ANML', expiresAt = null }) {
    if (!supabase) throw new Error("Supabase Admin client not available.");

    const batchId = crypto.randomUUID();
    const newCodes = [];

    for (let i = 0; i < count; i++) {
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
    
    revalidatePath('/dashboard/codes');
    return { success: true, batchId, codes: data };
}

/**
 * حذف كود تفعيل معين.
 */
export async function deleteCodeAction(id) {
    if (!supabase) throw new Error("Supabase Admin client not available.");

    const { error } = await supabase
        .from('activation_codes')
        .delete()
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/dashboard/codes');
    return { success: true };
}

/**
 * حذف مجموعة أكواد تفعيل بالكامل.
 */
export async function deleteBatchAction(batchId) {
    if (!supabase) throw new Error("Supabase Admin client not available.");

    const { error } = await supabase
        .from('activation_codes')
        .delete()
        .eq('batch_id', batchId);

    if (error) throw error;
    revalidatePath('/dashboard/codes');
    return { success: true };
}
