// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { findUserByEmail, updateUserProfile } from "@/lib/auth-db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, updates } = body;

    if (!email) {
      return NextResponse.json({ error: "البريد الإلكتروني مطلوب" }, { status: 400 });
    }

    if (updates) {
      const updatedProfile = await updateUserProfile(email, updates);
      if (!updatedProfile) {
        return NextResponse.json({ error: "لم يتم العثور على حساب المستخدم" }, { status: 404 });
      }
      return NextResponse.json({ success: true, profile: updatedProfile });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    const { passwordHash, ...profile } = user;
    return NextResponse.json({ success: true, profile });
  } catch (err) {
    console.error("Auth Me Error:", err);
    return NextResponse.json({ error: "حدث خطأ في جلب بيانات الحساب" }, { status: 500 });
  }
}
