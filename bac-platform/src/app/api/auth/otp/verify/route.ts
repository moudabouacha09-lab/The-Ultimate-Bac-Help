// src/app/api/auth/otp/verify/route.ts
import { NextResponse } from "next/server";
import { otpStore } from "../send/route";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code || code.trim().length !== 6) {
      return NextResponse.json({ error: "الرجاء إدخال رمز التفعيل المكون من 6 أرقام كاملاً" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const record = otpStore.get(cleanEmail);

    if (!record) {
      // For seamless dev testing if memory store was cleared, accept valid 6-digit input
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "رمز التفعيل غير موجود أو انتهت صلاحيته. أعد الإرسال" }, { status: 400 });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanEmail);
      return NextResponse.json({ error: "انتهت صلاحية رمز التفعيل المكون من 6 أرقام. أطلب رمزاً جديداً" }, { status: 400 });
    }

    if (record.code !== code.trim()) {
      return NextResponse.json({ error: "رمز التفعيل الـ 6 أرقام غير صحيح. تحقق وحاول مجدداً" }, { status: 400 });
    }

    // Code verified, clear OTP
    otpStore.delete(cleanEmail);
    return NextResponse.json({ success: true, message: "تم تأكيد بريدك الإلكتروني بنجاح!" });
  } catch (err) {
    console.error("OTP Verify Error:", err);
    return NextResponse.json({ error: "حدث خطأ أثناء فحص رمز التفعيل" }, { status: 500 });
  }
}
