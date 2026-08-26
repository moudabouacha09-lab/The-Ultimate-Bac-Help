// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/lib/auth-db";
import { AcademicBranch, AcademicLevel } from "@/lib/auth-types";
import crypto from "crypto";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "_bac_salt_2026").digest("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, branch, level, isGoogle } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "البريد الإلكتروني غير صالح" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await findUserByEmail(cleanEmail);
    if (existing) {
      if (isGoogle) {
        // Return existing profile for Google sign in
        const { passwordHash, ...profile } = existing;
        return NextResponse.json({ success: true, profile });
      }
      return NextResponse.json({ error: "هذا البريد الإلكتروني مسجل بالفعل" }, { status: 409 });
    }

    if (!isGoogle && (!password || password.length < 6)) {
      return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 });
    }

    const effectiveUsername = username?.trim() || cleanEmail.split("@")[0];
    const passwordHash = isGoogle ? "google_oauth_protected" : hashPassword(password);
    const effectiveBranch: AcademicBranch = branch || "experimental-science";
    const effectiveLevel: AcademicLevel = level || "mid";

    const profile = await createUser({
      username: effectiveUsername,
      email: cleanEmail,
      passwordHash,
      branch: effectiveBranch,
      level: effectiveLevel
    });

    return NextResponse.json({ success: true, profile });
  } catch (err) {
    console.error("Register Error:", err);
    return NextResponse.json({ error: "حدث خطأ أثناء إنشاء الحساب" }, { status: 500 });
  }
}
