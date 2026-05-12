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
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap" rel="stylesheet" />
            </head>
            <body style={{ fontFamily: "'Tajawal', sans-serif", margin: 0, padding: 0 }}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
