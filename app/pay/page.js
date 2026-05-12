"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, Suspense, useMemo, useRef } from 'react';
import Script from 'next/script';
import { Shield, CreditCard, CheckCircle2, ArrowLeft, Loader2, AlertTriangle, Globe } from 'lucide-react';
import { getPriceByCountry } from '@/lib/pricing';
import { supabase } from '@/lib/supabase';

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
const isDev = process.env.NODE_ENV !== 'production';
const MOYASAR_PK = isDev
    ? (process.env.NEXT_PUBLIC_MOYASAR_TEST_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MOYASAR_LIVE_PUBLISHABLE_KEY || '')
    : (process.env.NEXT_PUBLIC_MOYASAR_LIVE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MOYASAR_TEST_PUBLISHABLE_KEY || '');

const MOYASAR_SDK_VERSION = '1.14.0';
const MOYASAR_JS_URL = `https://cdn.moyasar.com/mpf/${MOYASAR_SDK_VERSION}/moyasar.js`;
const MOYASAR_CSS_URL = `https://cdn.moyasar.com/mpf/${MOYASAR_SDK_VERSION}/moyasar.css`;

/* ────────────────────────────────────────────────────────
 * Inner component that uses useSearchParams (requires Suspense)
 * ──────────────────────────────────────────────────────── */
function PayPageInner() {
    const searchParams = useSearchParams();

    // Runtime Error Catching for Diagnostics
    const [runtimeError, setRuntimeError] = useState(null);

    // Use state for search-dependent values to avoid hydration mismatch
    const [isOrg, setIsOrg] = useState(() => searchParams.get('type') === 'org');
    const [token, setToken] = useState(() => searchParams.get('token') || '');
    const [uid, setUid] = useState(() => {
        const urlUid = searchParams.get('uid');
        if (urlUid) return urlUid;
        const urlToken = searchParams.get('token');
        if (urlToken) {
            try {
                // Try to extract UID from token payload if UID not provided directly
                const base64Payload = urlToken.split('.')[1];
                const decodedPayload = typeof window !== 'undefined' 
                    ? atob(base64Payload) 
                    : Buffer.from(base64Payload, 'base64').toString();
                const payload = JSON.parse(decodedPayload);
                return payload.user_id || payload.sub || 'web-user';
            } catch (e) {
                return 'web-user';
            }
        }
        return 'web-user';
    });
    const [email, setEmail] = useState(() => searchParams.get('email') || '');
    const [name, setName] = useState(() => searchParams.get('name') || '');
    const [planId, setPlanId] = useState(() => searchParams.get('plan') || DEFAULT_PLAN_ID);

    // Initial mount flag to ensure browser-only APIs are handled correctly
    const [isMounted, setIsMounted] = useState(false);
    const [isSdkLoaded, setIsSdkLoaded] = useState(false);
    const formRef = useRef(null);

    // Org specific state
    const [orgName, setOrgName] = useState(() => searchParams.get('orgName') || '');
    const [userCount, setUserCount] = useState(() => {
        const count = parseInt(searchParams.get('userCount'));
        return isNaN(count) ? 10 : count;
    });
    const [countryCode, setCountryCode] = useState(() => {
        return searchParams.get('country') || searchParams.get('country_code') || '+966';
    });

    const [status, setStatus] = useState('loading'); // loading | ready | error
    const [errorMsg, setErrorMsg] = useState('');

    /* Sync logic for Search Params */
    useEffect(() => {
        setIsMounted(true);
        console.log('[PayPage] Mounted and synchronized with search params');
    }, []);

    /* Fetch User Data from Database (Truth Source) */
    useEffect(() => {
        if (!uid || uid === 'web-user' || isOrg) return;

        async function fetchUserProfile() {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('full_name, email, country_code')
                    .eq('id', uid)
                    .single();

                if (data && !error) {
                    console.log('[Database] User profile found:', data);
                    
                    // Prioritize URL parameter if it exists, otherwise use DB
                    const urlCountry = searchParams.get('country') || searchParams.get('country_code');
                    if (urlCountry) {
                        console.log('[Pricing] Using URL country code:', urlCountry);
                        setCountryCode(urlCountry);
                    } else if (data.country_code) {
                        console.log('[Pricing] Using DB country code:', data.country_code);
                        setCountryCode(data.country_code);
                    }

                    if (data.full_name && !name) setName(data.full_name);
                    if (data.email && !email) setEmail(data.email);
                }
            } catch (err) {
                console.warn('[Database] Failed to fetch user profile:', err);
            }
        }

        fetchUserProfile();
    }, [uid, isOrg]);

    /* Load Moyasar SDK CSS */
    useEffect(() => {
        if (!isMounted) return;
        if (!document.querySelector(`link[href="${MOYASAR_CSS_URL}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = MOYASAR_CSS_URL;
            document.head.appendChild(link);
        }
    }, [isMounted]);

    // Memoize the plan details to avoid unnecessary re-renders and ensure it reacts to state
    const plan = useMemo(() => {
        try {
            const basePrice = getPriceByCountry(countryCode);
            console.log(`[Pricing] Calculating price for ${countryCode}: ${basePrice} SAR`);
            
            if (!isOrg) {
                const selectedPlan = PLANS[planId] || PLANS[DEFAULT_PLAN_ID];
                return {
                    ...selectedPlan,
                    price: basePrice,
                    priceHalalas: Math.round(basePrice * 100)
                };
            }

            let discount = 0;
            if (userCount >= 1000) discount = 0.15;
            else if (userCount >= 50) discount = 0.10;

            const perUser = basePrice * (1 - discount);
            const total = perUser * userCount;

            return {
                title: `باقة الجهات (${userCount} مستخدم)`,
                price: total,
                priceHalalas: Math.round(total * 100),
                perUser: perUser,
                discountPercent: Math.round(discount * 100),
                description: `توليد ${userCount} كود تفعيل خاصة بـ ${orgName || 'الجهة'} (دولة: ${countryCode})`,
                features: [
                    `عدد ${userCount} رخصة استخدام`,
                    'لوحة تحكم إدارية',
                    'دعم فني مخصص للجهات',
                    'تقارير استخدام شهرية'
                ]
            };
        } catch (e) {
            console.error('[Diagnostic] plan memo error:', e);
            return PLANS[DEFAULT_PLAN_ID];
        }
    }, [countryCode, planId, isOrg, orgName, userCount]);

    /* Initialize Moyasar Form */
    useEffect(() => {
        if (!isMounted || !isSdkLoaded || !window.Moyasar) return;

        // Validation checks
        if (isOrg && !orgName) {
            setStatus('ready'); // Waiting for org name
            return;
        }

        if (!token && !uid) {
            setStatus('error');
            setErrorMsg('بيانات المستخدم غير مكتملة. يرجى المحاولة من التطبيق.');
            return;
        }

        if (!MOYASAR_PK) {
            setStatus('error');
            setErrorMsg('مفتاح الدفع غير مضبوط.');
            return;
        }

        try {
            const currentPath = window.location.href.split('?')[0].split('#')[0];
            const payBase = currentPath.endsWith('/') ? currentPath : currentPath + '/';
            const callbackUrl = `${payBase}callback/?token=${encodeURIComponent(token)}&uid=${encodeURIComponent(uid)}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&plan=${encodeURIComponent(planId)}&type=${isOrg ? 'org' : 'ind'}&userCount=${userCount}&orgName=${encodeURIComponent(orgName)}`;

            console.log('[Moyasar] Initializing form for:', uid);
            
            // Clean container
            if (formRef.current) {
                formRef.current.innerHTML = '';
            }

            window.Moyasar.init({
                element: '.mysr-form',
                amount: plan.priceHalalas,
                currency: 'SAR',
                description: isOrg ? `اشتراك جهة: ${orgName}` : `مصحف أنامل - ${plan.title}`,
                publishable_api_key: MOYASAR_PK,
                callback_url: callbackUrl,
                language: 'ar',
                methods: ['creditcard', 'stcpay', 'applepay'],
                apple_pay: {
                    label: 'مصحف أنامل',
                    validate_merchant_url: 'https://efwffwyslgidrzumarqf.supabase.co/functions/v1/applepay-merchant-validation',
                    country: 'SA',
                },
                metadata: {
                    token: token,
                    userId: uid,
                    email: email,
                    planId: planId,
                    type: isOrg ? 'organization' : 'individual',
                    userCount: isOrg ? userCount : 1,
                    orgName: orgName,
                    countryCode: countryCode,
                    order_id: `quran_admin_${Date.now()}_${uid.substring(0, 5)}`,
                    platform: 'admin_dashboard'
                },
            });
            
            setStatus('ready');
        } catch (initErr) {
            console.error('[Moyasar] Init error:', initErr);
            setStatus('error');
            setErrorMsg('حدث خطأ أثناء تشغيل نظام الدفع الإلكتروني');
        }
    }, [isMounted, isSdkLoaded, uid, token, isOrg, orgName, plan.priceHalalas, planId, countryCode, userCount, email, name]);

    if (runtimeError) {
        return (
            <div style={{ padding: 40, background: '#fff', color: '#000', direction: 'ltr', textAlign: 'left', minHeight: '100vh' }}>
                <h1 style={{ color: 'red', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Production Runtime Exception</h1>
                <p style={{ marginBottom: 10 }}>This error is captured by the diagnostic layer.</p>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                    <p style={{ fontWeight: 'bold', color: '#E53E3E' }}>{runtimeError.name}: {runtimeError.message}</p>
                    <pre style={{ fontSize: 12, lineHeight: 1.5, marginTop: 10, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                        {runtimeError.stack}
                    </pre>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    style={{ padding: '12px 24px', background: '#5AA564', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Retry Loading
                </button>
            </div>
        );
    }

    // We no longer return a full-screen spinner if !isMounted
    // This allows the layout to render immediately (SSR)
    // The payment form itself will show a local spinner while loading on the client

    return (
        <div dir="rtl" className="min-h-screen flex flex-col" style={{ fontFamily: "'Tajawal', sans-serif", background: 'linear-gradient(180deg, #FDFDFD 0%, #F1F5F9 100%)' }}>

            {/* ── Navbar ── */}
            <nav style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(0,0,0,0.04)',
                padding: '0 24px', height: 80,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: '#fff', border: '1px solid #f0f0f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    }}>
                        <img src="/logo/logo.png" alt="مصحف أنامل" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 900, fontSize: 18, color: '#0F172A', letterSpacing: '-0.02em' }}>مصحف أنامل</div>
                        <div style={{ fontSize: 10, fontWeight: 800, color: '#5AA564', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8 }}>بوابة الدفع الآمنة</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#5AA564', background: '#5AA56410', padding: '6px 12px', borderRadius: 100, fontSize: 12, fontWeight: 800 }}>
                    <Shield size={16} />
                    <span>تشفير SSL آمن</span>
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
                    border: '1px solid rgba(0,0,0,0.05)',
                    borderRadius: 32, padding: '32px',
                    marginBottom: 28,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
                    position: 'relative', overflow: 'hidden',
                }}>
                    {/* Glass gradient background */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #5AA564 0%, #86EFAC 100%)' }} />

                    {/* Toggle */}
                    <div style={{
                        display: 'flex', background: '#F1F5F9', padding: 5, borderRadius: 16, marginBottom: 32,
                        border: '1px solid #E2E8F0'
                    }}>
                        <button
                            onClick={() => setIsOrg(false)}
                            style={{
                                flex: 1, padding: '10px 0', borderRadius: 12, fontSize: 14, fontWeight: 800,
                                background: !isOrg ? '#fff' : 'transparent',
                                color: !isOrg ? '#0F172A' : '#64748B',
                                boxShadow: !isOrg ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >أفراد</button>
                        <button
                            onClick={() => setIsOrg(true)}
                            style={{
                                flex: 1, padding: '10px 0', borderRadius: 12, fontSize: 14, fontWeight: 800,
                                background: isOrg ? '#fff' : 'transparent',
                                color: isOrg ? '#0F172A' : '#64748B',
                                boxShadow: isOrg ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >جهات / منظمات</button>
                    </div>

                    {isOrg && (
                        <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 900, color: '#999', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>اسم المنشأة / الجهة</label>
                                <input
                                    type="text"
                                    value={orgName}
                                    placeholder="مثال: جمعية البر الخيرية"
                                    onChange={(e) => setOrgName(e.target.value)}
                                    style={{
                                        width: '100%', height: 48, borderRadius: 12, border: '1px solid #eee',
                                        padding: '0 16px', fontSize: 14, fontWeight: 600, outline: 'none',
                                        background: '#FDFDFD'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 900, color: '#999', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>عدد المستخدمين (الرخص)</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <button
                                        onClick={() => setUserCount(Math.max(1, userCount - 5))}
                                        style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid #eee', background: '#fff', fontSize: 20 }}>-</button>
                                    <div style={{ flex: 1, height: 42, background: '#F8FAFC', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18 }}>{userCount}</div>
                                    <button
                                        onClick={() => setUserCount(userCount + 5)}
                                        style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid #eee', background: '#fff', fontSize: 20 }}>+</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: isOrg ? 'linear-gradient(135deg, #5AA564 0%, #4A8F53 100%)' : '#F1F5F9',
                        color: isOrg ? '#fff' : '#64748B', fontSize: 10, fontWeight: 900,
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        padding: '5px 14px', borderRadius: 20,
                        marginBottom: 16,
                    }}>
                        <CreditCard size={12} />
                        {isOrg ? 'باقة الجهات' : 'باقة الأفراد'}
                    </div>

                    <h2 style={{ fontSize: 22, fontWeight: 900, color: '#111', marginBottom: 6 }}>{plan.title}</h2>
                    <p style={{ fontSize: 14, color: '#777', fontWeight: 500, marginBottom: 20, lineHeight: 1.6 }}>{plan.description}</p>

                    {/* Features */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                        {plan.features.map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <CheckCircle2 size={16} style={{ color: '#5AA564', flexShrink: 0 }} />
                                <span style={{ fontSize: 13, color: '#444', fontWeight: 600 }}>{f}</span>
                            </div>
                        ))}
                    </div>

                    {/* Price */}
                    <div style={{
                        borderTop: '1px solid #f0f0f0', paddingTop: 16,
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4,
                    }}>
                        {plan.discountPercent > 0 && (
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#DC2626', background: '#FEF2F2', padding: '2px 8px', borderRadius: 6 }}>تم تطبيق خصم {plan.discountPercent}%</div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                            <span style={{ fontSize: 36, fontWeight: 900, color: '#5AA564' }}>{plan.price.toLocaleString('en-US')}</span>
                            <span style={{ fontSize: 16, fontWeight: 700, color: '#5AA564' }}>ر.س</span>
                            <span style={{ fontSize: 14, color: '#999', fontWeight: 600 }}>{isOrg ? `/ لكل ${userCount > 1 ? `${userCount} مستخدم` : 'مستخدم'}` : '/ مستخدم واحد'}</span>
                        </div>
                    </div>

                    {/* User Info / Context */}
                    {(name || email || (isOrg && orgName)) && (
                        <div style={{
                            marginTop: 16, padding: '12px 16px',
                            background: '#F8FAFC', borderRadius: 12,
                            fontSize: 12, color: '#666', fontWeight: 600,
                            display: 'flex', flexDirection: 'column', gap: 4,
                        }}>
                            {isOrg && orgName && <span>🏢 الجهة: {orgName}</span>}
                            {!isOrg && name && <span>👤 المستفيد: {name}</span>}
                            {email && <span>📧 البريد: {email}</span>}
                        </div>
                    )}
                </div>

                {/* Payment Form Container */}
                <div style={{
                    background: '#fff', borderRadius: 32, padding: '32px',
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
                    marginBottom: 24,
                    position: 'relative',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <CreditCard size={20} style={{ color: '#5AA564' }} />
                            تفاصيل الدفع
                        </h3>
                        <div style={{ display: 'flex', gap: 4 }}>
                            {['visa', 'mastercard', 'mada'].map(brand => (
                                <div key={brand} style={{ height: 20, width: 32, background: '#f8fafc', borderRadius: 4, border: '1px solid #eee' }} />
                            ))}
                        </div>
                    </div>

                    {status === 'loading' && (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Loader2 size={32} style={{ color: '#5AA564', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
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

                    {/* Moyasar Container - Stable version */}
                    <div 
                        ref={formRef}
                        className="mysr-form" 
                        dir="rtl" 
                        style={{ minHeight: 200 }}
                    ></div>

                    {/* SDK Loader */}
                    <Script 
                        src={MOYASAR_JS_URL}
                        strategy="afterInteractive"
                        onLoad={() => {
                            console.log('[Moyasar] Script loaded via next/script');
                            setIsSdkLoaded(true);
                        }}
                        onError={(e) => {
                            console.error('[Moyasar] Script failed to load', e);
                            setStatus('error');
                            setErrorMsg('فشل تحميل مكاتب الدفع. يرجى التأكد من اتصال الإنترنت.');
                        }}
                    />
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

export default function PayPage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader2 size={32} style={{ color: '#5AA564', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        }>
            <PayPageInner />
        </Suspense>
    );
}
