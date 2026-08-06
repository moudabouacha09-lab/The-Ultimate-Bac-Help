// src/app/api/admin/survey/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: "كلمة المرور غير صحيحة" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const response = await fetch(`${supabaseUrl}/rest/v1/votes?select=*&order=created_at.desc`, {
      headers: {
        apikey: supabaseKey!,
        Authorization: `Bearer ${supabaseKey}`
      }
    });

    const data = await response.json();
    return NextResponse.json({ success: true, votes: data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "فشل جلب البيانات" }, { status: 500 });
  }
}
