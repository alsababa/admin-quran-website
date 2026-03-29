import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin", "arabic"] });

export const metadata = {
    title: 'قرآن الإشارة — تعلم القرآن بلغة الإشارة',
    description: 'المنصة الرسمية الأولى لتمكين الصم وضعاف السمع من تلاوة وتعلم القرآن الكريم عبر لغة الإشارة العربية.',
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
