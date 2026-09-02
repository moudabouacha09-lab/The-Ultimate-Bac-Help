// src/lib/auth-types.ts

export type AcademicBranch = 
  | "experimental-science" // علوم تجريبية
  | "math"                 // رياضيات
  | "technical-math"       // تقني رياضي
  | "management-econ"      // تسيير واقتصاد
  | "arts-philosophy"      // آداب وفلسفة
  | "foreign-languages";   // لغات أجنبية

export type AcademicLevel = 
  | "intelligent" // ممتاز / متقدم
  | "mid"         // متوسط
  | "poor";       // مبتدئ / يحتاج دعم

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  branch: AcademicBranch;
  level: AcademicLevel;
  role?: "student" | "teacher" | "admin";
  targetGrade?: number;
  createdAt: string;
};

export const branchLabels: Record<AcademicBranch, string> = {
  "experimental-science": "علوم تجريبية 🧪",
  "math": "رياضيات 📐",
  "technical-math": "تقني رياضي ⚙️",
  "management-econ": "تسيير واقتصاد 📊",
  "arts-philosophy": "آداب وفلسفة 📜",
  "foreign-languages": "لغات أجنبية 🌐",
};

export const levelLabels: Record<AcademicLevel, { label: string; badge: string; color: string }> = {
  intelligent: { label: "ممتاز / متقدم", badge: "🌟 متقدم", color: "#38bdf8" },
  mid: { label: "متوسط / مواظب", badge: "⚖️ متوسط", color: "#34d399" },
  poor: { label: "مبتدئ / أساسيات", badge: "🎯 مبتدئ", color: "#a78bfa" },
};
