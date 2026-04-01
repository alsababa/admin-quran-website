"use client";

/**
 * Layout for /pay routes — No AuthProvider needed.
 * Users arrive from the mobile app with their data in URL params.
 */
export default function PayLayout({ children }) {
    return (
        <div className="min-h-screen" dir="rtl" style={{ background: '#F8FAFC' }}>
            {children}
        </div>
    );
}
