import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin", "arabic"] });

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
            <body className={inter.className}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
