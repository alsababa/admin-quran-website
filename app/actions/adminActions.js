"use server";
import { supabaseAdmin as supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

/**
 * دالة حذف مستخدم من Supabase من جهة الخادم باستخدام صلاحيات الأدمن.
 */
export async function deleteUserAction(rawId) {
    if (!supabase) throw new Error("Supabase Admin client not available.");
    
    const { error } = await supabase.from('users').delete().eq('id', rawId);
    if (error) throw error;
    
    revalidatePath('/dashboard/users');
    return { success: true };
}

/**
 * دالة ترقية مستخدم لمميز في Supabase من جهة الخادم باستخدام صلاحيات الأدمن.
 */
export async function upgradeUserAction(rawId, accountType = 'individual') {
    if (!supabase) throw new Error("Supabase Admin client not available.");

    const { error } = await supabase
        .from('users')
        .update({ 
            subscription_status: 'active', 
            subscription_tier: 'premium',
            account_type: accountType,
            platform: 'manual'
        })
        .eq('id', rawId);
    
    if (error) throw error;

    revalidatePath('/dashboard/users');
    return { success: true };
}

/**
 * دالة تعديل اسم وعنوان البريد لمستخدم في Supabase.
 */
export async function updateUserAction(rawId, updates) {
    if (!supabase) throw new Error("Supabase Admin client not available.");

    const sbUpdates = {};
    if (updates.displayName !== undefined) sbUpdates.full_name = updates.displayName;
    if (updates.email !== undefined) sbUpdates.email = updates.email;

    const { error } = await supabase.from('users').update(sbUpdates).eq('id', rawId);
    if (error) throw error;

    revalidatePath('/dashboard/users');
    return { success: true };
}

/**
 * دالة تغيير نوع الحساب لجهة أو فرد في Supabase من جهة الخادم.
 */
export async function changeAccountTypeAction(rawId, accountType) {
    if (!supabase) throw new Error("Supabase Admin client not available.");

    const { error } = await supabase
        .from('users')
        .update({ account_type: accountType })
        .eq('id', rawId);
    
    if (error) throw error;

    revalidatePath('/dashboard/users');
    return { success: true };
}
