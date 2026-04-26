// userActions.js - Unified Administration Logic
// Refactored to call Supabase Edge Functions (Compatible with Static Export)

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ADMIN_API_URL = `${SUPABASE_URL}/functions/v1/admin-api`;

/**
 * Helper to call the admin-api edge function
 */
async function callAdminApi(action, payload) {
    try {
        const response = await fetch(ADMIN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ action, payload }),
        });

        const result = await response.json();
        return result;
    } catch (err) {
        console.error(`[AdminAPI] Call Failed (${action}):`, err);
        return { success: false, error: err.message };
    }
}

/**
 * تحديث بيانات مستخدم في Supabase باستخدام صلاحيات المشرف
 */
export async function updateUserAdmin(userId, updates) {
    return await callAdminApi('update-user', { userId, updates });
}

/**
 * الحصول على إحصائيات لوحة التحكم باستخدام صلاحيات المشرف
 */
export async function getDashboardStatsAdmin() {
    return await callAdminApi('get-stats', {});
}

/**
 * حذف مستخدم في Supabase باستخدام صلاحيات المشرف
 */
export async function deleteUserAdmin(userId) {
    return await callAdminApi('delete-user', { userId });
}

/**
 * توليد أكواد تفعيل جديدة باستخدام صلاحيات المشرف
 */
export async function generateCodesAdmin(newCodes) {
    return await callAdminApi('generate-codes', { codes: newCodes });
}

/**
 * حذف كود تفعيل محدد باستخدام صلاحيات المشرف
 */
export async function deleteCodeAdmin(codeId, codeString) {
    return await callAdminApi('delete-code', { id: codeId, codeString });
}

/**
 * حذف مجموعة كاملة من الأكواد (Batch) باستخدام صلاحيات المشرف
 */
export async function deleteBatchAdmin(batchId) {
    return await callAdminApi('delete-batch', { batchId });
}


