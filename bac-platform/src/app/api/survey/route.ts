// src/app/api/survey/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { branch, targetGrade } = body;

    if (!branch) {
      return NextResponse.json(
        { success: false, error: "الشعبة الدراسية إجبارية" },
        { status: 400 }
      );
    }

    // هنا يمكنك إضافة منطق الحفظ في قاعدة البيانات
    console.log("استطلاع جديد:", { branch, targetGrade, timestamp: new Date() });

    return NextResponse.json({
      success: true,
      message: "تم تسجيل إجابتك بنجاح! شكر لك 🚀"
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء حفظ الإجابة" },
      { status: 500 }
    );
  }
}
