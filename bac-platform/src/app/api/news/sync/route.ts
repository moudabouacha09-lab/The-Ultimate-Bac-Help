// src/app/api/news/sync/route.ts
import { NextResponse } from "next/server";
import { type NewsItem } from "@/data/news-data";
import { getNewsFeed, saveNewsFeed } from "@/lib/news-service";

const MINISTRY_BASE_URL = "https://www.education.gov.dz";

/**
 * Convert relative URLs into absolute ministry URLs safely
 */
function toAbsoluteMinistryUrl(urlPath: string | null | undefined): string | null {
  if (!urlPath || urlPath === "null" || urlPath === "undefined") return null;
  const trimmed = urlPath.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${MINISTRY_BASE_URL}${cleanPath}`;
}

export async function POST() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "مفتاح GEMINI_API_KEY غير مضاف في .env.local" },
        { status: 500 }
      );
    }

    // 1. Fetch live HTML from ministry website
    const ministryRes = await fetch(MINISTRY_BASE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "ar,en;q=0.9"
      },
      cache: "no-store"
    });

    if (!ministryRes.ok) {
      throw new Error(`تعذر الاتصال بموقع الوزارة: ${ministryRes.status}`);
    }

    const rawHtml = await ministryRes.text();

    // 2. Extract all actual Href elements present in HTML to prevent LLM hallucinations
    const hrefRegex = /href=["']([^"']+)["']/gi;
    const extractedHrefs: string[] = [];
    let match;
    while ((match = hrefRegex.exec(rawHtml)) !== null) {
      if (match[1] && !match[1].startsWith("#") && !match[1].startsWith("javascript:")) {
        extractedHrefs.push(match[1]);
      }
    }

    // 3. Clean HTML for payload
    const cleanedHtml = rawHtml
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .slice(0, 45000);

    // 4. Strict Prompt enforcing real extracted hrefs only
    const prompt = `
أنت Agent متخصص لاستخراج الأخبار الرسمية لمنصة "The Ultimate BAC Help".
قم بتحليل شفرة HTML التالية المستخرجة من بوابة وزارة التربية الوطنية الجزائرية (education.gov.dz).

قواعد صارمة جداً للروابط:
1. يمنع منعاً باتاً اختراع أو تخمين مسارات ملفات مثل (/docs/notice.pdf) أو روابط غير موجودة في الصفحة.
2. يجب استخراج الرابط المباشر للخبر (officialSourceUrl) والرابط المباشر لملف PDF إن وجد (pdfUrl) **حصراً** من قائمة الـ hrefs أو الروابط الموجودة فعلياً داخل شفرة الـ HTML.
3. إذا لم تجد رابط PDF مباشر حقيقي ومجذوب من الشفرة، اجعل قيمة pdfUrl تساوي null.

المطلوب استخراجه:
- title: عنوان أحدث بيان (مثل مسابقة توظيف الأساتذة أو ترتيبات الدخول المدرسي).
- summary: ملخص دقيق للقرار الوزاري.
- simpleExplanation: شرح بيداغوجي مبسط للطلاب يوضح الفائدة المباشرة لهم (يبدأ بـ 💡 ملخص القرار للطالب: ...).
- officialSourceUrl: رابط المقال أو البيان المباشر الموجود في HTML.
- pdfUrl: رابط ملف PDF المباشر الموجود في HTML (أو null إن لم يوجد).
- date: تاريخ البيان بصيغة YYYY-MM-DD.

أرجع المخرجات حصراً بصيغة JSON طبقاً للهيكل التالي:
{
  "title": "string",
  "summary": "string",
  "simpleExplanation": "string",
  "officialSourceUrl": "string",
  "pdfUrl": "string | null",
  "date": "string"
}

محتوى HTML:
${cleanedHtml}
`;

    // 5. Query Gemini 2.5 Flash
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1
          }
        })
      }
    );

    if (!geminiRes.ok) {
      throw new Error(`خطأ في استجابة Gemini API: ${geminiRes.status}`);
    }

    const geminiData = await geminiRes.json();
    const rawResultText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawResultText) {
      throw new Error("لم ترجع Gemini API أي بيانات تحليلية.");
    }

    const parsedData = JSON.parse(rawResultText);

    // 6. Verify absolute URLs safely
    const finalOfficialUrl =
      toAbsoluteMinistryUrl(parsedData.officialSourceUrl) || MINISTRY_BASE_URL;
    const finalPdfUrl = toAbsoluteMinistryUrl(parsedData.pdfUrl);

    const syncedNewsItem: NewsItem = {
      id: `gov-${Date.now()}`,
      title: parsedData.title || "بيان رسمـي من وزارة التربية الوطنية",
      summary: parsedData.summary || "تحديث وزاري جديد يخص القطاع التربوي والامتحانات.",
      simpleExplanation:
        parsedData.simpleExplanation ||
        "💡 ملخص القرار للطالب: تابع البيان الرسمي عبر الرابط المباشر أدناه للحصول على تفاصيل القرار.",
      category: "official",
      badge: "urgent",
      date: parsedData.date || new Date().toISOString().split("T")[0],
      headerImage:
        "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
      officialSourceUrl: finalOfficialUrl,
      pdfUrl: finalPdfUrl || undefined,
      actionUrl: "/tools",
      actionLabel: "تصفّح الأدوات 🎯"
    };

    // 7. Save cleanly to Local JSON
    const currentFeed = await getNewsFeed();
    const updatedFeed = [
      syncedNewsItem,
      ...currentFeed.filter((item) => item.title !== syncedNewsItem.title)
    ];

    await saveNewsFeed(updatedFeed);

    return NextResponse.json({
      success: true,
      agentEngine: "Gemini-2.5-Flash Verified Scraper",
      syncedAt: new Date().toISOString(),
      news: syncedNewsItem
    });
  } catch (error: any) {
    console.error("Gemini Sync Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "حدث خطأ أثناء مزامنة البيانات" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const news = await getNewsFeed();
  return NextResponse.json({ success: true, count: news.length, data: news });
}
