"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { Shield, CreditCard, CheckCircle2, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';

/* ────────────────────────────────────────────────────────
 * Plan Definitions (must match mobile app plans)
 * ──────────────────────────────────────────────────────── */
const PLANS = {
    'annual-pro': {
        id: 'annual-pro',
        title: 'النسخة الاحترافية (Pro)',
        description: 'كل الميزات، محتوى تعليمي، واستخدام بدون إنترنت',
        price: 120,           // SAR
        priceHalalas: 12000,   // Moyasar expects halalas
        period: 'سنوياً',
        tier: 'premium',
        features: [
            'الوصول لكامل القرآن الكريم',
            'محتوى تعليمي متقدم',
            'تحميل المحتوى (Offline)',
            'دعم فني ذو أولوية',
        ],
    },
};

const DEFAULT_PLAN_ID = 'annual-pro';

/* ────────────────────────────────────────────────────────
 * Moyasar Config
 * ──────────────────────────────────────────────────────── */
const MOYASAR_PK = process.env.NEXT_PUBLIC_MOYASAR_LIVE_PUBLISHABLE_KEY
    || process.env.NEXT_PUBLIC_MOYASAR_TEST_PUBLISHABLE_KEY
    || '';

/* ────────────────────────────────────────────────────────
 * Inner component that uses useSearchParams (requires Suspense)
 * ──────────────────────────────────────────────────────── */
function PayPageInner() {
    const searchParams = useSearchParams();

    const uid = searchParams.get('uid') || '';
    const email = searchParams.get('email') || '';
    const name = searchParams.get('name') || '';
    const planId = searchParams.get('plan') || DEFAULT_PLAN_ID;

    const plan = PLANS[planId] || PLANS[DEFAULT_PLAN_ID];

    const [status, setStatus] = useState('loading'); // loading | ready | error
    const [errorMsg, setErrorMsg] = useState('');

    /* Load Moyasar SDK */
    const loadMoyasarSDK = useCallback(() => {
        return new Promise((resolve, reject) => {
            // CSS
            if (!document.querySelector('link[href*="moyasar"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.css';
                document.head.appendChild(link);
            }
            // JS
            if (window.Moyasar) return resolve();
            const existing = document.querySelector('script[src*="moyasar"]');
            if (existing) {
                existing.addEventListener('load', () => resolve());
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('فشل تحميل نموذج الدفع'));
            document.head.appendChild(script);
        });
    }, []);

    /* Initialize Moyasar Form */
    useEffect(() => {
        if (!uid) {
            setStatus('error');
            setErrorMsg('بيانات المستخدم غير موجودة. يرجى المحاولة من التطبيق.');
            return;
        }
        if (!MOYASAR_PK) {
            setStatus('error');
            setErrorMsg('مفتاح الدفع غير مضبوط. يرجى التواصل مع الدعم.');
            return;
        }

        let mounted = true;

        loadMoyasarSDK()
            .then(() => {
                if (!mounted) return;

                // Build callback URL — back to this same site with payment result
                const origin = window.location.origin;
                const callbackUrl = `${origin}/pay/callback/?uid=${encodeURIComponent(uid)}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&plan=${encodeURIComponent(planId)}`;

                // Clear previous form if any
                const container = document.getElementById('moyasar-form');
                if (container) container.innerHTML = '';

                window.Moyasar.init({
                    element: '#moyasar-form',
                    amount: plan.priceHalalas,
                    currency: 'SAR',
                    description: `مصحف أنامل - ${plan.title}`,
                    publishable_api_key: MOYASAR_PK,
                    callback_url: callbackUrl,
                    methods: ['creditcard', 'stcpay', 'applepay'],
                    apple_pay: {
                        country: 'SA',
                        label: 'مصحف أنامل للصم',
                        validate_merchant_url: 'https://api.moyasar.com/v1/applepay/initiate',
                    },
                    metadata: {
                        userId: uid,
                        email: email,
                        source: 'firebase',
                        planId: planId,
                    },
                    on_initiating: function () {
                        console.log('[Moyasar] Payment initiating...');
                    },
                    fixed_width: false,
                });

                setStatus('ready');
            })
            .catch((err) => {
                if (!mounted) return;
                setStatus('error');
                setErrorMsg(err.message || 'فشل تحميل نموذج الدفع');
            });

        return () => { mounted = false; };
    }, [uid, email, name, planId, plan, loadMoyasarSDK]);

    return (
        <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', 'Tajawal', sans-serif", background: 'linear-gradient(180deg, #F8FAFC 0%, #EEF2F7 100%)' }}>

            {/* ── Navbar ── */}
            <nav style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                padding: '0 24px', height: 72,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 42, height: 42, borderRadius: 12,
                        background: '#fff', border: '1px solid #f0f0f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}>
                        <img src="/logo/logo.png" alt="مصحف أنامل" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 900, fontSize: 16, color: '#111' }}>مصحف أنامل</div>
                        <div style={{ fontSize: 9, fontWeight: 800, color: '#14B8A6', letterSpacing: '0.15em', textTransform: 'uppercase' }}>الدفع الآمن</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#14B8A6', fontSize: 12, fontWeight: 700 }}>
                    <Shield size={16} />
                    <span>دفع مشفّر وآمن</span>
                </div>
            </nav>

            {/* ── Main Content ── */}
            <main style={{
                flex: 1, maxWidth: 560, width: '100%',
                margin: '0 auto', padding: '32px 20px 60px',
            }}>

                {/* Plan Summary Card */}
                <div style={{
                    background: '#fff',
                    border: '2px solid #14B8A6',
                    borderRadius: 24, padding: '28px 24px',
                    marginBottom: 28,
                    boxShadow: '0 8px 32px rgba(20,184,166,0.08)',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute', top: -30, left: -30,
                        width: 120, height: 120,
                        background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)',
                        borderRadius: '50%', pointerEvents: 'none',
                    }} />

                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                        color: '#fff', fontSize: 10, fontWeight: 900,
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        padding: '5px 14px', borderRadius: 20,
                        marginBottom: 16,
                    }}>
                        <CreditCard size={12} />
                        ملخص الطلب
                    </div>

                    <h2 style={{ fontSize: 22, fontWeight: 900, color: '#111', marginBottom: 6 }}>{plan.title}</h2>
                    <p style={{ fontSize: 14, color: '#777', fontWeight: 500, marginBottom: 20, lineHeight: 1.6 }}>{plan.description}</p>

                    {/* Features */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                        {plan.features.map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <CheckCircle2 size={16} style={{ color: '#14B8A6', flexShrink: 0 }} />
                                <span style={{ fontSize: 13, color: '#444', fontWeight: 600 }}>{f}</span>
                            </div>
                        ))}
                    </div>

                    {/* Price */}
                    <div style={{
                        borderTop: '1px solid #f0f0f0', paddingTop: 16,
                        display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 6,
                    }}>
                        <span style={{ fontSize: 36, fontWeight: 900, color: '#14B8A6' }}>{plan.price}</span>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#14B8A6' }}>ر.س</span>
                        <span style={{ fontSize: 14, color: '#999', fontWeight: 600 }}>/ {plan.period}</span>
                    </div>

                    {/* User Info */}
                    {(name || email) && (
                        <div style={{
                            marginTop: 16, padding: '12px 16px',
                            background: '#F8FAFC', borderRadius: 12,
                            fontSize: 12, color: '#666', fontWeight: 600,
                            display: 'flex', flexDirection: 'column', gap: 4,
                        }}>
                            {name && <span>👤 {name}</span>}
                            {email && <span>📧 {email}</span>}
                        </div>
                    )}
                </div>

                {/* Payment Form Container */}
                <div style={{
                    background: '#fff', borderRadius: 24, padding: '28px 24px',
                    border: '1px solid #eee',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    marginBottom: 24,
                    position: 'relative',
                }}>
                    <h3 style={{ fontSize: 16, fontWeight: 900, color: '#111', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CreditCard size={18} style={{ color: '#14B8A6' }} />
                        طريقة الدفع
                    </h3>

                    {status === 'loading' && (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Loader2 size={32} style={{ color: '#14B8A6', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                            <p style={{ color: '#999', fontWeight: 600, fontSize: 14 }}>جاري تحميل نموذج الدفع...</p>
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>
                    )}

                    {status === 'error' && (
                        <div style={{
                            textAlign: 'center', padding: '40px 20px',
                            background: '#FFF5F5', borderRadius: 16,
                        }}>
                            <AlertTriangle size={40} style={{ color: '#E53E3E', margin: '0 auto 16px' }} />
                            <p style={{ color: '#E53E3E', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>خطأ</p>
                            <p style={{ color: '#666', fontSize: 13, fontWeight: 500 }}>{errorMsg}</p>
                        </div>
                    )}

                    {/* Moyasar will inject the payment form here */}
                    <div id="moyasar-form" />
                </div>

                {/* Security badges */}
                <div style={{
                    display: 'flex', justifyContent: 'center', gap: 24,
                    flexWrap: 'wrap', marginBottom: 20,
                }}>
                    {['🔒 SSL مشفّر', '🛡️ PCI DSS', '💳 ميسر Moyasar'].map((badge, i) => (
                        <span key={i} style={{
                            fontSize: 11, fontWeight: 700, color: '#aaa',
                            background: '#fff', border: '1px solid #eee',
                            padding: '6px 14px', borderRadius: 20,
                        }}>{badge}</span>
                    ))}
                </div>

                {/* Back to app link */}
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <a href="quransl://home" style={{
                        fontSize: 13, fontWeight: 700, color: '#999',
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        textDecoration: 'none',
                    }}>
                        <ArrowLeft size={14} />
                        العودة للتطبيق
                    </a>
                </div>
            </main>

            {/* ── Footer ── */}
            <footer style={{
                textAlign: 'center', padding: '20px 16px',
                borderTop: '1px solid #eee',
                background: '#fff',
            }}>
                <p style={{ fontSize: 11, color: '#bbb', fontWeight: 600 }}>
                    © 2026 مصحف أنامل للصم — شركة السبابة الرقمية. جميع الحقوق محفوظة.
                </p>
            </footer>
        </div>
    );
}

/* ────────────────────────────────────────────────────────
 * Exported Page (wrapped in Suspense for useSearchParams)
 * ──────────────────────────────────────────────────────── */
export default function PayPage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader2 size={32} style={{ color: '#14B8A6', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        }>
            <PayPageInner />
        </Suspense>
    );
}
