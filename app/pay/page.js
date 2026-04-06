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
    const [isOrg, setIsOrg] = useState(false);
    const [token, setToken] = useState('');
    const [uid, setUid] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [planId, setPlanId] = useState(DEFAULT_PLAN_ID);

    // Initial mount flag to ensure search params are only processed on client
    const [isMounted, setIsMounted] = useState(false);

    // Org specific state
    const [orgName, setOrgName] = useState('');
    const [userCount, setUserCount] = useState(10); // Default 10 for orgs

    const [status, setStatus] = useState('loading'); // loading | ready | error
    const [errorMsg, setErrorMsg] = useState('');

    /* Handle Search Params on Mount */
    useEffect(() => {
        try {
            setIsMounted(true);
            setIsOrg(searchParams.get('type') === 'org');
            
            const urlToken = searchParams.get('token') || '';
            setToken(urlToken);
            
            // If we have a token, we can extract UID from it for UI purposes (insecure yet, verified later)
            let urlUid = searchParams.get('uid') || '';
            if (!urlUid && urlToken) {
                try {
                    const payload = JSON.parse(atob(urlToken.split('.')[1]));
                    urlUid = payload.user_id || payload.sub || '';
                } catch (e) {
                    console.warn('Failed to parse token payload for UI:', e);
                }
            }
            
            setUid(urlUid || 'web-user');
            setEmail(searchParams.get('email') || '');
            setName(searchParams.get('name') || '');
            setPlanId(searchParams.get('plan') || DEFAULT_PLAN_ID);
        } catch (e) {
            console.error('[Diagnostic] Search params sync error:', e);
            setRuntimeError(e);
        }
    }, [searchParams]);

    /* Load Moyasar SDK with Retry Logic */
    const loadMoyasarSDK = useCallback((retries = 3) => {
        return new Promise((resolve, reject) => {
            const loadHandler = () => {
                if (typeof window !== 'undefined' && window.Moyasar) {
                    resolve();
                    return true;
                }
                return false;
            };

            if (loadHandler()) return;

            const attemptLoad = (remaining) => {
                try {
                    if (!document.querySelector(`link[href="${MOYASAR_CSS_URL}"]`)) {
                        const link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = MOYASAR_CSS_URL;
                        document.head.appendChild(link);
                    }

                    const script = document.createElement('script');
                    script.src = `${MOYASAR_JS_URL}?t=${Date.now()}`;
                    script.async = true;
                    
                    script.onload = () => {
                        if (loadHandler()) {
                            script.setAttribute('data-loaded', 'true');
                        } else {
                            handleError(remaining);
                        }
                    };

                    script.onerror = () => handleError(remaining);

                    const handleError = (rem) => {
                        if (script.parentNode) document.head.removeChild(script);
                        if (rem > 1) {
                            setTimeout(() => attemptLoad(rem - 1), 1500);
                        } else {
                            reject(new Error('فشل تحميل مكاتب الدفع من الخادم. يرجى التأكد من اتصال الإنترنت أو المحاولة لاحقاً.'));
                        }
                    };

                    document.head.appendChild(script);
                } catch (e) {
                    reject(e);
                }
            };

            attemptLoad(retries);
        });
    }, []);

    const calculatePrice = () => {
        try {
            if (!isOrg) return PLANS[planId] || PLANS[DEFAULT_PLAN_ID];
            
            const basePrice = 120;
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
                description: `توليد ${userCount} كود تفعيل خاص بـ ${orgName || 'الجهة'}`,
                features: [
                    `عدد ${userCount} رخصة استخدام`,
                    'لوحة تحكم إدارية',
                    'دعم فني مخصص للجهات',
                    'تقارير استخدام شهرية'
                ]
            };
        } catch (e) {
            console.error('[Diagnostic] calculatePrice error:', e);
            setRuntimeError(e);
            return PLANS[DEFAULT_PLAN_ID];
        }
    };

    const plan = calculatePrice();

    /* Initialize Moyasar Form */
    useEffect(() => {
        if (!isMounted) return;

        if (isOrg && !orgName && status !== 'ready' && status !== 'error') {
            setStatus('ready');
        }

        if (!uid && !isOrg && !token) {
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

                try {
                    const currentPath = window.location.href.split('?')[0].split('#')[0];
                    const payBase = currentPath.endsWith('/') ? currentPath : currentPath + '/';
                    const callbackUrl = `${payBase}callback/?token=${encodeURIComponent(token)}&uid=${encodeURIComponent(uid)}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&plan=${encodeURIComponent(planId)}&type=${isOrg ? 'org' : 'ind'}&userCount=${userCount}&orgName=${encodeURIComponent(orgName)}`;

                    const container = document.querySelector('.mysr-form');
                    if (container) container.innerHTML = '';

                    setTimeout(() => {
                        if (!window.Moyasar || !mounted) return;
                        
                        try {
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
                                    source: 'website',
                                    planId: planId,
                                    type: isOrg ? 'organization' : 'individual',
                                    userCount: isOrg ? userCount : 1,
                                    orgName: orgName,
                                },
                            });
                            setStatus('ready');
                        } catch (initErr) {
                            console.error('[Moyasar] Init error:', initErr);
                            setStatus('error');
                            setErrorMsg('حدث خطأ أثناء تشغيل نظام الدفع الإلكتروني');
                        }
                    }, 100);
                } catch (e) {
                    setRuntimeError(e);
                }
            })
            .catch((err) => {
                if (!mounted) return;
                console.error('[Moyasar] load error:', err);
                setStatus('error');
                setErrorMsg(err.message || 'فشل تحميل نموذج الدفع');
            });

        return () => { mounted = false; };
    }, [uid, token, email, name, planId, plan.priceHalalas, isOrg, orgName, userCount, loadMoyasarSDK, isMounted]);

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
                    style={{ padding: '12px 24px', background: '#14B8A6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Retry Loading
                </button>
            </div>
        );
    }

    if (!isMounted) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader2 size={32} style={{ color: '#14B8A6', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div dir="rtl" className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', 'Tajawal', sans-serif", background: 'linear-gradient(180deg, #F8FAFC 0%, #EEF2F7 100%)' }}>

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
                    border: isOrg ? '2px solid #14B8A6' : '1px solid #eee',
                    borderRadius: 24, padding: '28px 24px',
                    marginBottom: 28,
                    boxShadow: isOrg ? '0 8px 32px rgba(20,184,166,0.08)' : '0 4px 20px rgba(0,0,0,0.04)',
                    position: 'relative', overflow: 'hidden',
                }}>
                    {/* Toggle */}
                    <div style={{
                        display: 'flex', background: '#F8FAFC', padding: 4, borderRadius: 12, marginBottom: 24,
                        border: '1px solid #eee'
                    }}>
                        <button 
                            onClick={() => setIsOrg(false)}
                            style={{
                                flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 700,
                                background: !isOrg ? '#fff' : 'transparent',
                                color: !isOrg ? '#14B8A6' : '#999',
                                boxShadow: !isOrg ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                transition: 'all 0.2s'
                            }}
                        >أفراد</button>
                        <button 
                            onClick={() => setIsOrg(true)}
                            style={{
                                flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 700,
                                background: isOrg ? '#fff' : 'transparent',
                                color: isOrg ? '#14B8A6' : '#999',
                                boxShadow: isOrg ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                transition: 'all 0.2s'
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
                        background: isOrg ? 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)' : '#F1F5F9',
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
                                <CheckCircle2 size={16} style={{ color: '#14B8A6', flexShrink: 0 }} />
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
                            <span style={{ fontSize: 36, fontWeight: 900, color: '#14B8A6' }}>{plan.price.toLocaleString('en-US')}</span>
                            <span style={{ fontSize: 16, fontWeight: 700, color: '#14B8A6' }}>ر.س</span>
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

                    {/* Moyasar Container */}
                    <div dangerouslySetInnerHTML={{ __html: '<div class="mysr-form" dir="rtl"></div>' }} />
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
                <Loader2 size={32} style={{ color: '#14B8A6', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        }>
            <PayPageInner />
        </Suspense>
    );
}
