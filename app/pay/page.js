"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, Suspense, useMemo, useRef } from 'react';
import Script from 'next/script';
import { Shield, CreditCard, CheckCircle2, ArrowLeft, Loader2, AlertTriangle, Globe, Mail, Lock, User as UserIcon, LogIn } from 'lucide-react';
import { getPriceByCountry, REGIONAL_PRICES } from '@/lib/pricing';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

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
    const { user: authUser, loading: authLoading, login, signUp } = useAuth();
    const router = useRouter();

    const [uid, setUid] = useState(() => searchParams.get('uid') || '');
    const [email, setEmail] = useState(() => searchParams.get('email') || '');
    const [name, setName] = useState(() => searchParams.get('name') || '');
    
    // Auth Form State
    const [authMode, setAuthMode] = useState('login'); // login | signup
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [isAuthProcessing, setIsAuthProcessing] = useState(false);

    // Initial effect to sync with search params and auth user
    useEffect(() => {
        if (!authLoading && authUser) {
            setUid(authUser.uid);
            setEmail(authUser.email || '');
            setName(authUser.displayName || '');
            
            // Sync token if available
            authUser.getIdToken().then(t => setToken(t));

            // Still check search params for context (plan, etc)
            const urlPlan = searchParams.get('plan');
            if (urlPlan) setPlanId(urlPlan);
            
            const urlType = searchParams.get('type');
            if (urlType === 'org') setIsOrg(true);
        } else if (!authLoading && !authUser) {
            // If not logged in, we might still want to know which plan they were looking at
            const urlPlan = searchParams.get('plan');
            if (urlPlan) setPlanId(urlPlan);
            const urlType = searchParams.get('type');
            if (urlType === 'org') setIsOrg(true);
        }
    }, [authUser, authLoading, searchParams]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setAuthError('');
        setIsAuthProcessing(true);
        try {
            if (authMode === 'login') {
                await login(authEmail, authPassword);
            } else {
                await signUp(authEmail, authPassword);
            }
        } catch (err) {
            console.error('Auth Error:', err);
            setAuthError('فشل التحقق من البيانات. يرجى التأكد من البريد وكلمة المرور.');
        } finally {
            setIsAuthProcessing(false);
        }
    };

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
    const [isSelectingCountry, setIsSelectingCountry] = useState(false);


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
                    
                    // Prioritize Database country code if it exists, otherwise use URL parameter
                    if (data.country_code) {
                        console.log('[Pricing] Using DB country code:', data.country_code);
                        setCountryCode(data.country_code);
                    } else {
                        const urlCountry = searchParams.get('country') || searchParams.get('country_code');
                        if (urlCountry) {
                            console.log('[Pricing] Using URL country code:', urlCountry);
                            setCountryCode(urlCountry);
                        }
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
        
        // Wait for authentication to be complete
        if (authLoading) return;
        if (!authUser) return; // UI handles the login form

        // Validation checks
        if (isOrg && !orgName) {
            setStatus('ready');
            return;
        }

        if (!uid) {
            setStatus('error');
            setErrorMsg('بيانات المستخدم غير مكتملة.');
            return;
        }

        if (!MOYASAR_PK) {
            setStatus('error');
            setErrorMsg('مفتاح الدفع غير مضبوط.');
            return;
        }

        // Delay to ensure DOM is ready (especially with animations)
        const timer = setTimeout(() => {
            try {
                // Ensure the container exists
                const container = document.querySelector('.mysr-form');
                if (!container) {
                    console.warn('[Moyasar] Form container not found yet, retrying...');
                    return; 
                }

                const currentPath = window.location.href.split('?')[0].split('#')[0];
                const payBase = currentPath.endsWith('/') ? currentPath : currentPath + '/';
                const callbackUrl = `${payBase}callback/?token=${encodeURIComponent(token)}&uid=${encodeURIComponent(uid)}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&plan=${encodeURIComponent(planId)}&type=${isOrg ? 'org' : 'ind'}&userCount=${userCount}&orgName=${encodeURIComponent(orgName)}`;

                console.log('[Moyasar] Initializing form for:', uid);
                
                container.innerHTML = '';

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
                setErrorMsg(`حدث خطأ أثناء تشغيل نظام الدفع الإلكتروني: ${initErr.message}`);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [isMounted, isSdkLoaded, authUser, authLoading, uid, token, isOrg, orgName, plan.priceHalalas, planId, countryCode, userCount, email, name]);

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
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                                <span>🌍 الدولة: {countryCode}</span>
                                <button 
                                    onClick={() => setIsSelectingCountry(true)}
                                    style={{ background: 'none', border: 'none', color: '#5AA564', fontSize: 11, fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                                >تغيير</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Country Selector Modal */}
                <AnimatePresence>
                    {isSelectingCountry && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{
                                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                                zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: 20
                            }}
                            onClick={() => setIsSelectingCountry(false)}
                        >
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                style={{
                                    background: '#fff', borderRadius: 24, width: '100%', maxWidth: 400,
                                    padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                                    maxHeight: '80vh', overflowY: 'auto'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 16, textAlign: 'center' }}>اختر الدولة</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {Object.keys(REGIONAL_PRICES).map((code) => (
                                        <button 
                                            key={code}
                                            onClick={() => {
                                                setCountryCode(code);
                                                setIsSelectingCountry(false);
                                            }}
                                            style={{
                                                padding: '12px 16px', borderRadius: 12, border: '1px solid #eee',
                                                background: countryCode === code ? '#F0FDF4' : '#fff',
                                                borderColor: countryCode === code ? '#5AA564' : '#eee',
                                                textAlign: 'right', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                                                display: 'flex', justifyContent: 'space-between'
                                            }}
                                        >
                                            <span>{code === 'Global' ? 'دولي' : code}</span>
                                            {countryCode === code && <CheckCircle2 size={16} style={{ color: '#5AA564' }} />}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>


                {/* Payment Form Container / Auth Guard */}
                <div style={{
                    background: '#fff', borderRadius: 32, padding: '32px',
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
                    marginBottom: 24,
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <AnimatePresence mode="wait">
                        {authLoading ? (
                            <motion.div 
                                key="auth-loading"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                style={{ textAlign: 'center', padding: '40px 0' }}
                            >
                                <Loader2 size={32} style={{ color: '#5AA564', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                                <p style={{ color: '#999', fontWeight: 600, fontSize: 14 }}>جاري التحقق من الهوية...</p>
                            </motion.div>
                        ) : !authUser ? (
                            <motion.div 
                                key="auth-form"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            >
                                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                    <div style={{
                                        width: 56, height: 56, borderRadius: 18,
                                        background: '#5AA56410', color: '#5AA564',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 16px',
                                    }}>
                                        <LogIn size={28} />
                                    </div>
                                    <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 8 }}>تسجيل الدخول للمتابعة</h3>
                                    <p style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>يجب تسجيل الدخول لربط الاشتراك بحسابك في التطبيق</p>
                                </div>

                                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {authError && (
                                        <div style={{
                                            padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FEE2E2',
                                            borderRadius: 12, color: '#DC2626', fontSize: 12, fontWeight: 700,
                                            display: 'flex', alignItems: 'center', gap: 8
                                        }}>
                                            <AlertTriangle size={16} />
                                            {authError}
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <label style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', paddingRight: 4 }}>البريد الإلكتروني</label>
                                        <div style={{ position: 'relative' }}>
                                            <Mail size={18} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                            <input 
                                                type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)}
                                                placeholder="example@mail.com"
                                                style={{
                                                    width: '100%', height: 52, borderRadius: 14, border: '1px solid #E2E8F0',
                                                    padding: '0 48px 0 16px', fontSize: 14, fontWeight: 600, outline: 'none',
                                                    background: '#F8FAFC', transition: 'all 0.2s'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#5AA564'}
                                                onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <label style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', paddingRight: 4 }}>كلمة المرور</label>
                                        <div style={{ position: 'relative' }}>
                                            <Lock size={18} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                            <input 
                                                type="password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)}
                                                placeholder="••••••••"
                                                style={{
                                                    width: '100%', height: 52, borderRadius: 14, border: '1px solid #E2E8F0',
                                                    padding: '0 48px 0 16px', fontSize: 14, fontWeight: 600, outline: 'none',
                                                    background: '#F8FAFC', transition: 'all 0.2s'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#5AA564'}
                                                onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" disabled={isAuthProcessing}
                                        style={{
                                            width: '100%', height: 56, borderRadius: 16,
                                            background: 'linear-gradient(135deg, #5AA564 0%, #4A8F53 100%)',
                                            color: '#fff', fontWeight: 900, fontSize: 16, border: 'none',
                                            cursor: 'pointer', boxShadow: '0 10px 25px rgba(90,165,100,0.2)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                            marginTop: 8, transition: 'all 0.2s'
                                        }}
                                    >
                                        {isAuthProcessing ? <Loader2 className="animate-spin" size={20} /> : (
                                            <>
                                                <span>{authMode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</span>
                                                <ArrowLeft size={20} />
                                            </>
                                        )}
                                    </button>

                                    <div style={{ textAlign: 'center', marginTop: 8 }}>
                                        <button 
                                            type="button"
                                            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                            style={{ background: 'none', border: 'none', color: '#5AA564', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
                                        >
                                            {authMode === 'login' ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="payment-form"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            >
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

                                {/* Moyasar Container */}
                                <div 
                                    ref={formRef}
                                    className="mysr-form" 
                                    dir="rtl" 
                                    style={{ minHeight: 200 }}
                                ></div>
                            </motion.div>
                        )}
                    </AnimatePresence>

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
