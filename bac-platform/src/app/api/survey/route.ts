// src/app/api/survey/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, branch, targetGrade } = await request.json();

    if (!username || !branch) {
      return NextResponse.json(
        { success: false, error: "اسم المستخدم والشعبة حقلان إجباريان" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: "المفاتيح غير مضافة في إعدادات البيئة" },
        { status: 500 }
      );
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        username,
        branch,
        target_grade: targetGrade ? parseFloat(targetGrade) : null
      })
    });

    if (!response.ok) {
      throw new Error(`Supabase Error: ${response.statusText}`);
    }

    return NextResponse.json({ success: true, message: "تم تسجيل إجابتك بنجاح 🚀" });
  } catch (error) {
    console.error("Survey Error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء حفظ التصويت" },
      { status: 500 }
    );
  }
}
