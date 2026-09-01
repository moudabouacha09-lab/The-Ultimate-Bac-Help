import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./styles.css";
import { AuthProvider } from "@/context/auth-context";

export const metadata: Metadata = {
  title: "منصة البكالوريا | رفيقك في التحضير",
  description: "منصة مراجعة لطلبة البكالوريا الجزائرية"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Design System Fonts: IBM Plex Sans Arabic (body) + Source Serif 4 (headings) */}
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap" rel="stylesheet" />
        {/* Material Symbols Outlined icons */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-background font-body min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
