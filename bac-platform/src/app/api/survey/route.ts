// src/app/api/survey/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, branch, targetGrade } = body;

    // التحقق الصارم من الحقول الإجبارية
    if (!username || !branch) {
      return NextResponse.json(
        { success: false, error: "اسم المستخدم والشعبة حقلان إجباريان" },
        { status: 400 }
      );
    }

    const voteRecord = {
      username,
      branch,
      targetGrade: targetGrade ? parseFloat(targetGrade) : null,
      timestamp: new Date().toISOString()
    };

    console.log("تسجيل تصويت جديد في المنظومة:", voteRecord);

    return NextResponse.json({
      success: true,
      message: "تم تسجيل إجابتك بنجاح! شكراً لك 🚀",
      data: voteRecord
    });
  } catch (error) {
    console.error("Survey Submission Error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء تسجيل التصويت" },
      { status: 500 }
    );
  }
}
