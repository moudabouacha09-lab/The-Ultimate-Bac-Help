// src/app/api/assistant/chat/route.ts
import { NextResponse } from "next/server";

const SYSTEM_INSTRUCTION = `
أنت "المساعد الذكي لمنصة باك الجزائر" (The Ultimate BAC Help) 🇩🇿.
مهمتك مساعدة طالب البكالوريا الجزائري وإرشاده في كل ما يتعلق بالمنصة وبالدراسة.

معلومات المنصة التي يجب أن توجه الطلاب إليها عند الحاجة:
1. **حاسبة المعدل (/calculator)**: حساب المعدل التقديري لكل الشعب بناءً على المعاملات الرسمية.
2. **مستشار التوجيه الجامعي (/tools/orientation)**: حساب المعدل الموزون واكتشاف التخصصات والمدارس العليا المتاحة وفق المنشور الوزاري رقم 01.
3. **اختبار المكتسبات القبلية (/tools/prerequisites/quiz)**: تشخيص المكتسبات لـ 10 أسئلة وتمرين شامل محلول بالصور في المواد العلمية.
4. **قائمة اليوتيوب الذهبية (/tools/teachers)**: أفضل أساتذة اليوتيوب في كل المواد (الأستاذ نور الدين، عبد اللطيف، خيرة فليتي، بورنان، إلخ).
5. **أفضل الكتب الخارجية (/tools/books)**: سلاسل وتأشيرة النجاح والجوهرة ومراجعات ممتازة.
6. **المكتسبات القبلية (/tools/prerequisites)**: فيديوهات وتأسيس من السنوات السابقة قبل الدخول المدرسي.
7. **مذكرات الذكاء الاصطناعي My Notebooks (/tools/notebooks)**: قواعد بيانات دقيقة مبنية بـ NotebookLM لكل مادة.
8. **التطبيقات الموصى بها (/tools/apps)**: تطبيق YPT، Quizlet، Desmos، إلخ.
9. **المواد الدراسية (/subject)**: ملخصات وتجميعات تمارين واختبارات تجريبية لكل مادة.

أسلوبك في الرد:
- لغة عربية فصحى بسيطة ومشجعة ومحفزة.
- إجابات مركزة، واضحة، ومختصرة لتناسب شاشات الجوال.
- اختم إجاباتك أحياناً بعبارة مشجعة مثل: "أتمنى لك كل التوفيق! 🚀" أو "واصل اجتهادك!".
`;

const CANDIDATE_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-flash-latest",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash"
];

const DAILY_LIMIT = 8;
const ipRateLimitMap = new Map<string, { count: number; date: string }>();

function checkAndIncrementRateLimit(clientIp: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  const record = ipRateLimitMap.get(clientIp);

  if (!record || record.date !== today) {
    ipRateLimitMap.set(clientIp, { count: 1, date: today });
    return false;
  }

  if (record.count >= DAILY_LIMIT) {
    return true; // Rate limited
  }

  record.count += 1;
  return false;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { reply: "مرحباً بك! يرجى إضافة مفتاح GEMINI_API_KEY في ملف البيئة .env.local لتفعيل المساعد الذكي." },
        { status: 200 }
      );
    }

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (checkAndIncrementRateLimit(clientIp)) {
      return NextResponse.json({
        reply: "⚠️ لقد استوفيت الحد الأقصى اليومي المخصص للمساعد الذكي (8 أسئلة يومياً للحفاظ على الخدمة للجميع). يمكنك استكمال مراجعتك عبر حاسبة المعدل ومستشار التوجيه والأدوات المتاحة!",
        rateLimited: true
      });
    }

    const body = await request.json().catch(() => ({}));
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ reply: "يرجى كتابة سؤالك وسأجيبك فوراً! 🚀" }, { status: 200 });
    }

    // Filter messages so contents starts with a 'user' role message
    const firstUserIndex = messages.findIndex((m: { role: string }) => m.role === "user");
    const validMessages = firstUserIndex !== -1 ? messages.slice(firstUserIndex) : messages;

    const formattedContents = validMessages.map((m: { role: string; text: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    let replyText: string | null = null;
    let lastError: string | null = null;

    // Try candidate models
    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }]
              },
              contents: formattedContents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
          if (replyText) break;
        } else {
          const errorErr = await response.text();
          lastError = `Model ${modelName} returned ${response.status}: ${errorErr}`;
          console.warn(lastError);
        }
      } catch (err: any) {
        lastError = err?.message || String(err);
        console.warn(`Error trying ${modelName}:`, lastError);
      }
    }

    if (!replyText) {
      replyText = "أهلاً بك! يمكنك استخدام حاسبة المعدل (/calculator) ومستشار التوجيه (/tools/orientation) واختبار المكتسبات القبلية (/tools/prerequisites/quiz) للانطلاق بثقة في مراجعتك. أتمنى لك كل التوفيق! 🚀";
    }

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error("Assistant Chat Exception:", error);
    return NextResponse.json({
      reply: "مرحباً بك! تصفح قسم الأدوات والمواد الدراسية للوصول فوراً للملخصات والتمارين. بالتوفيق! 🚀"
    });
  }
}
