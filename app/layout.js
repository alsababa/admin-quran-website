import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin", "arabic"] });

export const metadata = {
    title: "أدمن قرآن لغة الإشارة",
    description: "لوحة تحكم إدارة محتوى قرآن لغة الإشارة",
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
