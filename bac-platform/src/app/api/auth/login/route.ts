// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/auth-db";
import crypto from "crypto";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "_bac_salt_2026").digest("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "الرجاء إدخال البريد الإلكتروني وكلمة المرور" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(cleanEmail);

    if (!user) {
      return NextResponse.json({ error: "عذراً، الحساب غير موجود. تحقق من البريد الإلكتروني" }, { status: 404 });
    }

    const hashed = hashPassword(password);
    if (user.passwordHash !== hashed && user.passwordHash !== "google_oauth_protected") {
      return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
    }

    const { passwordHash, ...profile } = user;
    return NextResponse.json({ success: true, profile });
  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json({ error: "حدث خطأ أثناء تسجيل الدخول" }, { status: 500 });
  }
}
