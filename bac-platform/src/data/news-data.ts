// src/data/news-data.ts

export type NewsCategory = "official" | "content" | "tips" | "tools";
export type NewsBadgeType = "urgent" | "new" | "featured" | "normal";

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  simpleExplanation?: string;
  contentDetails?: string;
  category: NewsCategory;
  badge: NewsBadgeType;
  date: string;
  headerImage?: string;
  officialSourceUrl?: string;
  pdfUrl?: string;
  actionUrl?: string;
  actionLabel?: string;
  icon?: string;
}

export const categoryLabels: Record<NewsCategory | "all", { label: string; icon: string }> = {
  all: { label: "الكل", icon: "🌐" },
  official: { label: "قرارات وزارية", icon: "🏛️" },
  content: { label: "تحديثات المحتوى", icon: "📚" },
  tips: { label: "نصائح ومنهجية", icon: "💡" },
  tools: { label: "اختبارات وأدوات", icon: "🎯" },
};

export const badgeLabels: Record<NewsBadgeType, { label: string; bg: string; color: string }> = {
  urgent: { label: "🚨 عاجل", bg: "rgba(239, 68, 68, 0.15)", color: "#ef4444" },
  new: { label: "✨ جديد", bg: "rgba(34, 197, 94, 0.15)", color: "#22c55e" },
  featured: { label: "⭐️ مميز", bg: "rgba(234, 179, 8, 0.15)", color: "#eab308" },
  normal: { label: "📌 تحديث", bg: "rgba(37, 99, 235, 0.15)", color: "#2563eb" },
};
