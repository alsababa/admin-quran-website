import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
    title: 'مصحف أنامل للصم — Anaml Quran for the Deaf',
    description: 'المنصة الرسمية الأولى لتمكين الصم وضعاف السمع من تلاوة وتدبر القرآن الكريم عبر لغة الإشارة من خلال تطبيق مصحف أنامل.',
    icons: {
        icon: '/logo/logo.png',
        apple: '/logo/logo.png',
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="ar" dir="rtl">
            <body style={{ fontFamily: 'sans-serif' }}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
