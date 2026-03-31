"use server";
import { supabaseAdmin } from '@/lib/supabase';

/**
 * تحديث بيانات مستخدم في Supabase باستخدام صلاحيات المشرف
 */
export async function updateUserAdmin(userId, updates) {
    if (!supabaseAdmin) {
        throw new Error("Supabase Admin client is not available (Missing Service Role Key?)");
    }

    const { data, error } = await supabaseAdmin
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select();

    if (error) {
        console.error("Server Action Error (updateUserAdmin):", error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

/**
 * حذف مستخدم في Supabase باستخدام صلاحيات المشرف
 */
export async function deleteUserAdmin(userId) {
    if (!supabaseAdmin) {
        throw new Error("Supabase Admin client is not available");
    }

    const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', userId);

    if (error) {
        console.error("Server Action Error (deleteUserAdmin):", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

/**
 * توليد أكواد تفعيل جديدة باستخدام صلاحيات المشرف
 */
export async function generateCodesAdmin(newCodes) {
    if (!supabaseAdmin) {
        throw new Error("Supabase Admin client is not available");
    }

    const { data, error } = await supabaseAdmin
        .from('activation_codes')
        .insert(newCodes)
        .select();

    if (error) {
        console.error("Server Action Error (generateCodesAdmin):", error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

/**
 * حذف كود تفعيل محدد باستخدام صلاحيات المشرف
 */
export async function deleteCodeAdmin(codeId) {
    if (!supabaseAdmin) {
        throw new Error("Supabase Admin client is not available");
    }

    const { error } = await supabaseAdmin
        .from('activation_codes')
        .delete()
        .eq('id', codeId);

    if (error) {
        console.error("Server Action Error (deleteCodeAdmin):", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

/**
 * حذف مجموعة كاملة من الأكواد (Batch) باستخدام صلاحيات المشرف
 */
export async function deleteBatchAdmin(batchId) {
    if (!supabaseAdmin) {
        throw new Error("Supabase Admin client is not available");
    }

    const { error } = await supabaseAdmin
        .from('activation_codes')
        .delete()
        .eq('batch_id', batchId);

    if (error) {
        console.error("Server Action Error (deleteBatchAdmin):", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}


