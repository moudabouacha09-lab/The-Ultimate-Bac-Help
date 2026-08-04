// src/lib/news-service.ts
import fs from "node:fs/promises";
import path from "node:path";
import { type NewsItem } from "@/data/news-data";

const jsonFilePath = path.join(process.cwd(), "src", "data", "news-feed.json");

export async function getNewsFeed(): Promise<NewsItem[]> {
  try {
    const fileData = await fs.readFile(jsonFilePath, "utf-8");
    return JSON.parse(fileData) as NewsItem[];
  } catch {
    return [
      {
        id: "gov-2026-08-02-01",
        title: "صدور المنشور التنظيمي الخاص بالهيكلة الدراسية وحجم الساعات لبكالوريا 2026",
        summary: "أصدرت وزارة التربية الوطنية الترتيبات البيداغوجية الرسمية للمواد الأساسية والتوقيت المعتمد للدورة القادمة.",
        simpleExplanation: "💡 ملخص القرار للطالب: تم تثبيت الحجم الساعي والمعاملات لمواد العلوم والفيزياء والرياضيات كما هي، مع الإبقاء على المقرر دون تغييرات مفاجئة.",
        category: "official",
        badge: "urgent",
        date: "2026-08-02",
        headerImage: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
        officialSourceUrl: "https://www.education.gov.dz/",
        actionUrl: "/tools/prerequisites/quiz",
        actionLabel: "افحص مكتسباتك القبلية الآن 🎯",
        icon: "🏛️"
      }
    ];
  }
}

export async function saveNewsFeed(newsItems: NewsItem[]): Promise<void> {
  await fs.writeFile(jsonFilePath, JSON.stringify(newsItems, null, 2), "utf-8");
}
