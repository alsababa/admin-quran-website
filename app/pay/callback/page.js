"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';
import { CheckCircle2, XCircle, Loader2, ArrowLeft, Smartphone, RefreshCw } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { supabase } from '@/lib/supabase';

/* ────────────────────────────────────────────────────────
 * Plan Definitions (must match /pay/page.js)
 * ──────────────────────────────────────────────────────── */
const PLANS = {
    'annual-pro': {
        id: 'annual-pro',
        title: 'النسخة الاحترافية (Pro)',
        price: 120,
        period: 'سنوياً',
        tier: 'premium',
        extensionDays: 365,
    },
};

/* ────────────────────────────────────────────────────────
 * Supabase Edge Function URL for payment verification
 * ──────────────────────────────────────────────────────── */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const VERIFY_PAYMENT_URL = `${SUPABASE_URL}/functions/v1/verify-payment`;

/* ────────────────────────────────────────────────────────
 * Inner Callback Component (uses useSearchParams)
 * ──────────────────────────────────────────────────────── */
function CallbackInner() {
    const searchParams = useSearchParams();
    const hasProcessed = useRef(false);

    // Moyasar redirect params
    const paymentId = searchParams.get('id') || '';
    const paymentStatus = searchParams.get('status') || '';
    const paymentMessage = searchParams.get('message') || '';

    // Original params we passed through
    const uid = searchParams.get('uid') || '';
    const email = searchParams.get('email') || '';
    const name = searchParams.get('name') || '';
    const planId = searchParams.get('plan') || 'annual-pro';

    const plan = PLANS[planId] || PLANS['annual-pro'];

    const [status, setStatus] = useState('processing'); // processing | success | failed | error
    const [message, setMessage] = useState('جاري التحقق من عملية الدفع...');

    useEffect(() => {
        if (hasProcessed.current) return;
        hasProcessed.current = true;

        processPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function processPayment() {
        try {
            // 1. Check if payment was successful from Moyasar redirect
            const isPaid = paymentStatus === 'paid' || paymentStatus === 'authorized' || paymentStatus === 'captured';

            if (!isPaid) {
                setStatus('failed');
                setMessage(paymentMessage || 'فشلت عملية الدفع. يرجى المحاولة مرة أخرى.');
                return;
            }

            if ((!uid && searchParams.get('type') !== 'org') || !paymentId) {
                setStatus('error');
                setMessage('بيانات غير مكتملة. يرجى المحاولة من التطبيق.');
                return;
            }

            setMessage('تم الدفع بنجاح! جاري تفعيل الاشتراك وتوليد البيانات...');

            // 2. Try to verify via Supabase Edge Function (most secure)
            let edgeFunctionSuccess = false;
            let resultData = null;
            try {
                const response = await fetch(VERIFY_PAYMENT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        payment_id: paymentId,
                        user_id: uid,
                        email: email,
                        plan_id: planId,
                        source: 'website',
                        metadata: {
                            type: searchParams.get('type') === 'org' ? 'organization' : 'individual',
                            userCount: searchParams.get('userCount'),
                            orgName: searchParams.get('orgName')
                        }
                    }),
                });
                resultData = await response.json();
                if (resultData.success) {
                    edgeFunctionSuccess = true;
                    console.log('[Callback] Edge Function verified payment successfully');
                } else {
                    console.warn('[Callback] Edge Function returned error:', resultData.error);
                }
            } catch (edgeErr) {
                console.warn('[Callback] Edge Function unavailable, falling back to client-side:', edgeErr.message);
            }

            // 3. Fallback: Update databases client-side if Edge Function failed (ONLY for Individuals)
            if (!edgeFunctionSuccess && searchParams.get('type') !== 'org') {
                await activateSubscriptionClientSide(uid, email, planId, paymentId, paymentStatus);
            }

            setStatus('success');
            if (searchParams.get('type') === 'org') {
                setMessage(`تم تفعيل حساب الجهة بنجاح! تم توليد ${searchParams.get('userCount')} كود تفعيل لمنظمتك.`);
            } else {
                setMessage('تم تفعيل اشتراكك في النسخة المميزة بنجاح! 🎉');
            }

        } catch (err) {
            console.error('[Callback] Error processing payment:', err);
            setStatus('error');
            setMessage('حدث خطأ أثناء التفعيل. لا تقلق، سيتم تفعيل حسابك تلقائياً خلال دقائق.');
        }
    }

    /**
     * Fallback: Activate subscription directly from client-side
     * This updates both Firebase Firestore and Supabase
     */
    async function activateSubscriptionClientSide(userId, userEmail, userPlanId, pId, pStatus) {
        const plan = PLANS[userPlanId] || PLANS['annual-pro'];
        const now = new Date();
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() + (plan.extensionDays || 365));

        // Update Firebase Firestore
        try {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            const firebaseData = {
                subscriptionStatus: 'active',
                subscriptionTier: 'premium',
                subscriptionType: 'individual',
                planId: userPlanId,
                endDate: endDate.toISOString(),
                lastPaymentId: pId,
                platform: 'moyasar',
                updatedAt: now.toISOString(),
                premiumFeatures: {
                    unlimitedSignLanguage: true,
                    advancedSearch: true,
                    unlimitedBookmarks: true,
                    audioRecitations: true,
                },
            };

            if (userSnap.exists()) {
                // Check if existing endDate is later, extend from there
                const existing = userSnap.data();
                if (existing.endDate) {
                    const existingEnd = new Date(existing.endDate);
                    if (existingEnd > now) {
                        const newEnd = new Date(existingEnd);
                        newEnd.setDate(newEnd.getDate() + (plan.extensionDays || 365));
                        firebaseData.endDate = newEnd.toISOString();
                    }
                }
                await updateDoc(userRef, firebaseData);
            } else {
                await setDoc(userRef, {
                    ...firebaseData,
                    email: userEmail,
                    createdAt: now.toISOString(),
                });
            }
            console.log('[Callback] Firebase updated successfully for user:', userId);
        } catch (fbErr) {
            console.error('[Callback] Firebase update error:', fbErr);
        }

        // Update Supabase
        try {
            // Try to find user by email
            const { data: existingUser } = await supabase
                .from('users')
                .select('id, subscription_end_date')
                .eq('email', userEmail?.toLowerCase())
                .single();

            const supabaseData = {
                subscription_status: 'active',
                subscription_tier: 'premium',
                subscription_type: 'individual',
                subscription_platform: 'moyasar',
                subscription_product_id: userPlanId,
                subscription_transaction_id: pId,
                subscription_start_date: now.toISOString(),
                subscription_end_date: endDate.toISOString(),
                premium_features: {
                    unlimitedSignLanguage: true,
                    advancedSearch: true,
                    unlimitedBookmarks: true,
                    audioRecitations: true,
                },
            };

            if (existingUser) {
                // Extend if existing end date is later
                if (existingUser.subscription_end_date) {
                    const existingEnd = new Date(existingUser.subscription_end_date);
                    if (existingEnd > now) {
                        const newEnd = new Date(existingEnd);
                        newEnd.setDate(newEnd.getDate() + (plan.extensionDays || 365));
                        supabaseData.subscription_end_date = newEnd.toISOString();
                    }
                }
                await supabase
                    .from('users')
                    .update(supabaseData)
                    .eq('id', existingUser.id);
            } else if (userEmail) {
                await supabase
                    .from('users')
                    .upsert({
                        id: userId,
                        email: userEmail.toLowerCase(),
                        ...supabaseData,
                    });
            }
            console.log('[Callback] Supabase updated successfully');
        } catch (sbErr) {
            console.error('[Callback] Supabase update error:', sbErr);
        }

        // Save payment record to Supabase payments table
        try {
            await supabase.from('payments').insert({
                payment_id: pId,
                user_id: userId,
                email: userEmail,
                plan_id: userPlanId,
                amount: plan.price * 100,
                currency: 'SAR',
                status: pStatus,
                platform: 'moyasar',
                created_at: now.toISOString(),
            });
        } catch (payErr) {
            // Table might not exist yet, non-critical
            console.warn('[Callback] Payment record save skipped:', payErr.message);
        }
    }

    /* Deep link back to the app */
    const deepLink = `quransl://payment-callback?status=${paymentStatus}&payment_id=${paymentId}&plan=${planId}`;

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex', flexDirection: 'column',
            fontFamily: "'Inter', 'Tajawal', sans-serif",
            background: 'linear-gradient(180deg, #F8FAFC 0%, #EEF2F7 100%)',
        }}>
            {/* Navbar */}
            <nav style={{
                background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                padding: '0 24px', height: 72,
                display: 'flex', alignItems: 'center', gap: 12,
            }}>
                <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: '#fff', border: '1px solid #f0f0f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <img src="/logo/logo.png" alt="مصحف أنامل" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                </div>
                <div>
                    <div style={{ fontWeight: 900, fontSize: 16, color: '#111' }}>مصحف أنامل</div>
                    <div style={{ fontSize: 9, fontWeight: 800, color: '#14B8A6', letterSpacing: '0.15em' }}>نتيجة الدفع</div>
                </div>
            </nav>

            {/* Main Content */}
            <main style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '32px 20px',
            }}>
                <div style={{
                    maxWidth: 480, width: '100%',
                    background: '#fff', borderRadius: 32,
                    padding: '48px 32px', textAlign: 'center',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.06)',
                    border: '1px solid #eee',
                }}>

                    {/* Processing */}
                    {status === 'processing' && (
                        <>
                            <div style={{
                                width: 80, height: 80, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 24px',
                                boxShadow: '0 8px 24px rgba(20,184,166,0.3)',
                            }}>
                                <Loader2 size={36} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
                            </div>
                            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#111', marginBottom: 12 }}>جاري المعالجة</h2>
                            <p style={{ fontSize: 14, color: '#777', fontWeight: 600, lineHeight: 1.7 }}>{message}</p>
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </>
                    )}

                    {/* Success */}
                    {status === 'success' && (
                        <>
                            <div style={{
                                width: 88, height: 88, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 24px',
                                boxShadow: '0 12px 32px rgba(20,184,166,0.3)',
                                animation: 'popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}>
                                <CheckCircle2 size={44} color="#fff" />
                            </div>
                            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#111', marginBottom: 8 }}>تم بنجاح! 🎉</h2>
                            <p style={{ fontSize: 15, color: '#555', fontWeight: 600, marginBottom: 12, lineHeight: 1.7 }}>{message}</p>

                            <div style={{
                                background: '#F0FDF4', border: '1px solid #BBF7D0',
                                borderRadius: 16, padding: '16px 20px',
                                marginBottom: 20, textAlign: 'right',
                            }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#166534', marginBottom: 4 }}>تفاصيل الاشتراك:</div>
                                <div style={{ fontSize: 12, color: '#15803D', fontWeight: 600 }}>
                                    الباقة: {plan.title}<br />
                                    المدة: {plan.period}<br />
                                    رقم العملية: {paymentId?.substring(0, 16)}...
                                </div>
                            </div>

                            {/* 3D Sign Language Viewer Celebration */}
                            <div style={{
                                width: '100%',
                                height: 260,
                                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                borderRadius: 24,
                                overflow: 'hidden',
                                marginBottom: 28,
                                border: '1px solid #e2e8f0',
                                position: 'relative',
                                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)'
                            }}>
                                <iframe 
                                    src="/3viewer/index.html" 
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        border: 'none',
                                    }}
                                    onLoad={(e) => {
                                        // Wait specialized logic to trigger "FatehaAnim" or "Success" animation
                                        setTimeout(() => {
                                            try {
                                                const iframe = e.target;
                                                iframe.contentWindow.postMessage({ type: 'playAnimation', name: 'fatehaAnim' }, '*');
                                                // Inject JS to trigger animation since we have access to local file
                                                iframe.contentWindow.eval(`
                                                    if (window.playDeAnimation) {
                                                        playDeAnimation("fatehaAnim", "", 3/24, true);
                                                    }
                                                `);
                                            } catch (err) {
                                                console.warn('Could not trigger 3D animation:', err);
                                            }
                                        }, 1500);
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: 12,
                                    right: 12,
                                    background: 'rgba(255,255,255,0.8)',
                                    backdropFilter: 'blur(4px)',
                                    padding: '4px 10px',
                                    borderRadius: 20,
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: '#64748b',
                                    border: '1px solid #fff'
                                }}>
                                    ترجمة لغة الإشارة (تم بنجاح)
                                </div>
                            </div>

                            {/* Return to App Button */}
                            <a href={deepLink} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                width: '100%', height: 56, borderRadius: 16,
                                background: 'linear-gradient(135deg, #111 0%, #333 100%)',
                                color: '#fff', fontWeight: 900, fontSize: 15,
                                textDecoration: 'none',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                transition: 'all 0.2s',
                                marginBottom: 12,
                            }}>
                                <Smartphone size={18} />
                                العودة للتطبيق
                            </a>

                            <p style={{ fontSize: 11, color: '#bbb', fontWeight: 600 }}>
                                سيتم تحديث حسابك تلقائياً عند فتح التطبيق
                            </p>

                            <style>{`
                                @keyframes popIn {
                                    0% { transform: scale(0.5); opacity: 0; }
                                    100% { transform: scale(1); opacity: 1; }
                                }
                            `}</style>
                        </>
                    )}

                    {/* Failed */}
                    {status === 'failed' && (
                        <>
                            <div style={{
                                width: 88, height: 88, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 24px',
                                boxShadow: '0 12px 32px rgba(239,68,68,0.3)',
                            }}>
                                <XCircle size={44} color="#fff" />
                            </div>
                            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#111', marginBottom: 12 }}>فشل الدفع</h2>
                            <p style={{ fontSize: 14, color: '#777', fontWeight: 600, marginBottom: 28, lineHeight: 1.7 }}>{message}</p>

                            <a href={`/pay/?uid=${uid}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&plan=${planId}`}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    width: '100%', height: 52, borderRadius: 16,
                                    background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                                    color: '#fff', fontWeight: 800, fontSize: 14,
                                    textDecoration: 'none', marginBottom: 12,
                                }}>
                                <RefreshCw size={16} />
                                إعادة المحاولة
                            </a>

                            <a href="quransl://home" style={{
                                fontSize: 13, fontWeight: 700, color: '#999',
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                textDecoration: 'none',
                            }}>
                                <ArrowLeft size={14} />
                                العودة للتطبيق
                            </a>
                        </>
                    )}

                    {/* Error */}
                    {status === 'error' && (
                        <>
                            <div style={{
                                width: 88, height: 88, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 24px',
                                boxShadow: '0 12px 32px rgba(245,158,11,0.3)',
                            }}>
                                <Loader2 size={44} color="#fff" />
                            </div>
                            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#111', marginBottom: 12 }}>تنبيه</h2>
                            <p style={{ fontSize: 14, color: '#777', fontWeight: 600, marginBottom: 28, lineHeight: 1.7 }}>{message}</p>
                            <a href="quransl://home" style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                width: '100%', height: 52, borderRadius: 16,
                                background: '#111', color: '#fff', fontWeight: 800, fontSize: 14,
                                textDecoration: 'none',
                            }}>
                                <Smartphone size={16} />
                                العودة للتطبيق
                            </a>
                        </>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer style={{
                textAlign: 'center', padding: '20px 16px',
                borderTop: '1px solid #eee', background: '#fff',
            }}>
                <p style={{ fontSize: 11, color: '#bbb', fontWeight: 600 }}>
                    © 2026 مصحف أنامل للصم — شركة السبابة الرقمية. جميع الحقوق محفوظة.
                </p>
            </footer>
        </div>
    );
}

/* ────────────────────────────────────────────────────────
 * Exported Page
 * ──────────────────────────────────────────────────────── */
export default function CallbackPage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader2 size={32} style={{ color: '#14B8A6', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        }>
            <CallbackInner />
        </Suspense>
    );
}
