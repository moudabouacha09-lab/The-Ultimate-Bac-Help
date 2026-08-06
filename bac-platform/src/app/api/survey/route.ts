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

    const webhookUrl =
      process.env.GOOGLE_SHEET_WEBHOOK_URL ||
      "https://script.google.com/macros/s/AKfycbwDx_MU4haGyQ7QEv5tQbU6LOgsm2mnEvKhQIKKIKfDqaWv8bG4dQEgLPf6RPMazokP/exec";

    const payload = {
      username,
      branch,
      targetGrade: targetGrade ? parseFloat(targetGrade) : "غير محدد",
      timestamp: new Date().toLocaleString("ar-DZ", { timeZone: "Africa/Algiers" })
    };

    // Forward to Google Apps Script Webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8" // Apps Script accepts text/plain to avoid CORS preflight issues
      },
      body: JSON.stringify(payload),
      redirect: "follow"
    });

    console.log("Survey synced to Google Sheet:", payload);

    return NextResponse.json({ success: true, message: "تم تسجيل إجابتك بنجاح 🚀" });
  } catch (error) {
    console.error("Survey Error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء حفظ التصويت" },
      { status: 500 }
    );
  }
}
