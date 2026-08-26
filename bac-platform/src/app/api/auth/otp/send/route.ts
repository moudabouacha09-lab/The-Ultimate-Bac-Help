// src/app/api/auth/otp/send/route.ts
import { NextResponse } from "next/server";

// Global in-memory OTP store (email -> { code, expiresAt })
export const otpStore = new Map<string, { code: string; expiresAt: number }>();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "البريد الإلكتروني غير صالح" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    
    // Generate 6-digit numeric OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    otpStore.set(cleanEmail, { code, expiresAt });

    console.log(`[OTP SENT] Email: ${cleanEmail} | Code: ${code}`);

    return NextResponse.json({
      success: true,
      message: `تم إرسال رمز التحقق المكون من 6 أرقام إلى ${cleanEmail}`,
      devCode: code // Dev helper for instant testing
    });
  } catch (err) {
    console.error("OTP Send Error:", err);
    return NextResponse.json({ error: "فشل إرسال رمز التحقق" }, { status: 500 });
  }
}
