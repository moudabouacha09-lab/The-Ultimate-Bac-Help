import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./styles.css";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });

export const metadata: Metadata = {
  title: "باك الجزائر | رفيقك في التحضير",
  description: "منصة مراجعة لطلبة البكالوريا الجزائرية"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body>{children}</body>
    </html>
  );
}
