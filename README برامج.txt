This is gemini answer rely on it creating the new feature ...
[PROJECT]: The Ultimate BAC Help (منصة البكالوريا الجزائرية)
[ROLE]: Senior Full-Stack Engineer & Algerian Educational Strategist
[TASK]: Implement the "Lesson Progress Tracker" standalone module (`/progress`) for Scientific Stream.

[TECHNICAL REQUIREMENTS]:
1. Framework: Next.js 15 (App Router), TypeScript, Pure Vanilla CSS (NO Tailwind/Bootstrap).
2. UI/UX: Mobile-first responsive, HSL design tokens, Glassmorphism, 'Cairo' font, RTL orientation.
3. Persistence: Client-side LocalStorage persistence with Hydration-safe SSR handling.

[MATHEMATICAL PROGRESS ENGINE]:
1. Individual Subject Percentage (P_s):
   P_s = (Completed Lessons in Subject / Total Lessons in Subject) * 100

2. Overall BAC Weighted Readiness Index (R):
   R = Sum(P_s * Coefficient_s) / Sum(Coefficients)
   
   Coefficients (Scientific Stream):
   - Natural Sciences: 6
   - Physics: 5
   - Mathematics: 5
   - Arabic Language: 3
   - Islamic Studies: 2
   - French: 2
   - English: 2
   - Philosophy: 2
   - History: 1
   - Geography: 1
   (Total Coefficients Weight = 29)



---

## 📄 1. قاعدة البيانات والنموذج البرمجي (`src/data/bac-progress-data.ts`)

```typescript
export type LessonStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export type Lesson = {
  id: string;
  title: string;
  category?: string; // e.g. "البناء الفكري" / "البناء اللغوي"
};

export type ProgressSubject = {
  id: string;
  name: string;
  icon: string;
  coefficient: number;
  color: "blue" | "green" | "violet" | "orange";
  lessons: Lesson[];
};

export const SCIENTIFIC_STREAM_PROGRESS_DATA: ProgressSubject[] = [
  {
    id: "science",
    name: "العلوم الطبيعية",
    icon: "🧬",
    coefficient: 6,
    color: "green",
    lessons: [
      // المجال الأول
      { id: "sci-1", title: "الوحدة 1: آليات تركيب البروتين", category: "المجال الأول: التخصص الوظيفي للبروتين" },
      { id: "sci-2", title: "الوحدة 2: العلاقة بين بنية ووظيفة البروتين", category: "المجال الأول: التخصص الوظيفي للبروتين" },
      { id: "sci-3", title: "الوحدة 3: التحفيز الإنزيمي", category: "المجال الأول: التخصص الوظيفي للبروتين" },
      { id: "sci-4", title: "الوحدة 4: الدفاع عن الذات (المناعة)", category: "المجال الأول: التخصص الوظيفي للبروتين" },
      { id: "sci-5", title: "الوحدة 5: الاتصال العصبي", category: "المجال الأول: التخصص الوظيفي للبروتين" },
      // المجال الثاني
      { id: "sci-6", title: "الوحدة 1: التركيب الضوئي", category: "المجال الثاني: تحويل الطاقة" },
      { id: "sci-7", title: "الوحدة 2: تحويل الطاقة في الوسط الهوائي واللاهوائي", category: "المجال الثاني: تحويل الطاقة" },
      { id: "sci-8", title: "الوحدة 3: التحولات الطاقوية على المستوى الخلوي", category: "المجال الثاني: تحويل الطاقة" },
      // المجال الثالث
      { id: "sci-9", title: "الوحدة 1: بنية الكرة الأرضية", category: "المجال الثالث: التكتونية العامة" },
      { id: "sci-10", title: "الوحدة 2: اختفاء اللوح المحيطي والظواهر المرتبطة به", category: "المجال الثالث: التكتونية العامة" },
    ],
  },
  {
    id: "physics",
    name: "العلوم الفيزيائية",
    icon: "⚛",
    coefficient: 5,
    color: "blue",
    lessons: [
      { id: "phy-1", title: "الوحدة 1: المتابعة الزمنية لتحول كيميائي في وسط مائي" },
      { id: "phy-2", title: "الوحدة 2: تطور جملة ميكانيكية" },
      { id: "phy-3", title: "الوحدة 3: دراسة الظواهر الكهربائية (RC & RL)" },
      { id: "phy-4", title: "الوحدة 4: تطور جملة كيميائية نحو حالة التوازن (أحماض وأسس)" },
      { id: "phy-5", title: "الوحدة 5: التحولات النووية" },
      { id: "phy-6", title: "الوحدة 6: مراقبة تطور جملة كيميائية (الأسترة)" },
      { id: "phy-7", title: "الوحدة 7: التطورات المهتزة" },
      { id: "phy-8", title: "الوحدة 8: مفهوم الموجة" },
    ],
  },
  {
    id: "math",
    name: "الرياضيات",
    icon: "∑",
    coefficient: 5,
    color: "blue",
    lessons: [
      { id: "math-1", title: "الدوال العددية", category: "الدوال" },
      { id: "math-2", title: "الدالة الأسية", category: "الدوال" },
      { id: "math-3", title: "الدالة اللوغارتمية", category: "الدوال" },
      { id: "math-4", title: "الدوال العددية (النهايات)", category: "الدوال" },
      { id: "math-5", title: "التزايد المقارن ودراسة الدوال", category: "الدوال" },
      { id: "math-6", title: "المتتاليات العددية" },
      { id: "math-7", title: "الدوال الأصلية والحساب التكاملي" },
      { id: "math-8", title: "الاحتمالات" },
      { id: "math-9", title: "الأعداد المركبة", category: "الأعداد المركبة" },
      { id: "math-10", title: "التحويلات النقطية", category: "الأعداد المركبة" },
      { id: "math-11", title: "الهندسة في الفضاء" },
    ],
  },
  {
    id: "arabic",
    name: "اللغة العربية",
    icon: "أ",
    coefficient: 3,
    color: "green",
    lessons: [
      { id: "arb-1", title: "الشعر التعليمي", category: "البناء الفكري" },
      { id: "arb-2", title: "النثر العلمي المتأدب", category: "البناء الفكري" },
      { id: "arb-3", title: "الشعر المهجري (الرومانسي)", category: "البناء الفكري" },
      { id: "arb-4", title: "الشعر الاجتماعي", category: "البناء الفكري" },
      { id: "arb-5", title: "الشعر السياسي (القضية الفلسطينية والثورة الجزائرية)", category: "البناء الفكري" },
      { id: "arb-6", title: "فن المقال", category: "البناء الفكري" },
      { id: "arb-7", title: "المجاز العقلي والمرسل", category: "البناء اللغوي" },
      { id: "arb-8", title: "معاني وإعراب إذ، إذا، إذن، حينئذ", category: "البناء اللغوي" },
      { id: "arb-9", title: "الخبر وأنواعه", category: "البناء اللغوي" },
      { id: "arb-10", title: "الجمل التي لها محل من الإعراب", category: "البناء اللغوي" },
      { id: "arb-11", title: "الجمل التي لا محل لها من الإعراب", category: "البناء اللغوي" },
      { id: "arb-12", title: "بلاغة التشبيه", category: "البناء اللغوي" },
      { id: "arb-13", title: "أحكام الحال والتمييز والفرق بينهما", category: "البناء اللغوي" },
      { id: "arb-14", title: "أحكام البدل وعطف البيان", category: "البناء اللغوي" },
      { id: "arb-15", title: "بلاغة الاستعارة", category: "البناء اللغوي" },
      { id: "arb-16", title: "أحكام لو، لولا، لوما", category: "البناء اللغوي" },
      { id: "arb-17", title: "بلاغة الكناية", category: "البناء اللغوي" },
      { id: "arb-18", title: "إعراب المتعدي إلى أكثر من مفعول", category: "البناء اللغوي" },
    ],
  },
  {
    id: "history",
    name: "التاريخ",
    icon: "📜",
    coefficient: 1, // فصل التاريخ عن الجغرافيا للمتابعة
    color: "orange",
    lessons: [
      { id: "his-1", title: "بروز الصراع وتشكل العالم", category: "الوحدة 1: الحرب الباردة" },
      { id: "his-2", title: "مساعي الإنفرَاج الدولي", category: "الوحدة 1: الحرب الباردة" },
      { id: "his-3", title: "من الثنائية إلى الأحادية القطبية", category: "الوحدة 1: الحرب الباردة" },
      { id: "his-4", title: "العمل المسلح ورد فعل الاستعمار", category: "الوحدة 2: الثورة الجزائرية" },
      { id: "his-5", title: "إستعادة السيادة وبناء الدولة الجزائرية", category: "الوحدة 2: الثورة الجزائرية" },
      { id: "his-6", title: "العالم الثالث بين تراجع الاستعمار واستمرار التحرر", category: "الوحدة 3: العالم الثالث" },
      { id: "his-7", title: "فلسطين من تصفية الاستعمار واستمرارية التحرر", category: "الوحدة 3: العالم الثالث" },
    ],
  },
  {
    id: "geography",
    name: "الجغرافيا",
    icon: "🌍",
    coefficient: 1,
    color: "orange",
    lessons: [
      { id: "geo-1", title: "إشكالية التقدم والتخلف", category: "الوحدة 1: الاقتصاد العالمي" },
      { id: "geo-2", title: "المبادلات والتنقلات في العالم", category: "الوحدة 1: الاقتصاد العالمي" },
      { id: "geo-3", title: "مصادر القوة الأمريكية وتأثيرها العالمي", category: "الوحدة 2: القوى الكبرى" },
      { id: "geo-4", title: "ظاهرة التكتل وأثرها في قوة الاتحاد الأوروبي", category: "الوحدة 2: القوى الكبرى" },
      { id: "geo-5", title: "العلاقة بين السكان والتنمية في شرق وجنوب شرق آسيا", category: "الوحدة 2: القوى الكبرى" },
      { id: "geo-6", title: "الاقتصاد الجزائري في العالم", category: "الوحدة 3: دول الجنوب" },
      { id: "geo-7", title: "التنمية في البرازيل", category: "الوحدة 3: دول الجنوب" },
    ],
  },
  {
    id: "islamic",
    name: "العلوم الإسلامية",
    icon: "🕌",
    coefficient: 2,
    color: "green",
    lessons: [
      { id: "isl-1", title: "1. العقيدة الإسلامية وأثرها في حياة الفرد والمجتمع" },
      { id: "isl-2", title: "2. وسائل القرآن الكريم في تثبيت العقيدة الإسلامية" },
      { id: "isl-3", title: "3. الإسلام والرسالات السماوية" },
      { id: "isl-4", title: "4. العقل في القرآن الكريم" },
      { id: "isl-5", title: "5. مقاصد الشريعة الإسلامية" },
      { id: "isl-6", title: "6. منهج الإسلام في محاربة الانحراف والجريمة" },
      { id: "isl-7", title: "7. المساواة أمام أحكام الشريعة الإسلامية" },
      { id: "isl-8", title: "8. الصحة النفسية والصحة الجسمية في القرآن الكريم" },
      { id: "isl-9", title: "9. مصادر التشريع الإسلامي (الإجماع، القياس، المصلحة المرسلة)" },
      { id: "isl-10", title: "10. القيم في القرآن الكريم" },
      { id: "isl-11", title: "11. الوقف في الإسلام" },
      { id: "isl-12", title: "12. الميراث في الإسلام" },
      { id: "isl-13", title: "13. الربا وأحكامه" },
      { id: "isl-14", title: "14. المعاملات المالية الجائزة" },
      { id: "isl-15", title: "15. الحرية الشخصية وعلاقتها بحقوق الآخرين" },
      { id: "isl-16", title: "16. النسب والتبني والكفالة" },
      { id: "isl-17", title: "17. العلاقات الاجتماعية بين المسلمين وغير المسلمين" },
      { id: "isl-18", title: "18. خطبة الرسول ﷺ في حجة الوداع" },
    ],
  },
  {
    id: "french",
    name: "اللغة الفرنسية",
    icon: "Fr",
    coefficient: 2,
    color: "blue",
    lessons: [
      { id: "fr-1", title: "Séquence 01: Produire un texte pour informer d’un fait d’Histoire", category: "Projet 01: Texte d'Histoire" },
      { id: "fr-2", title: "Séquence 02: Produire un texte Historique avec témoignage / commentaire", category: "Projet 01: Texte d'Histoire" },
      { id: "fr-3", title: "Séquence 01: Plan Dialectique", category: "Projet 02: Le Débat d'idées" },
      { id: "fr-4", title: "Séquence 02: Plan Accumulatif", category: "Projet 02: Le Débat d'idées" },
      { id: "fr-5", title: "Séquence 01: Le texte exhortatif", category: "Projet 03: L'appel" },
    ],
  },
  {
    id: "english",
    name: "اللغة الإنجليزية",
    icon: "En",
    coefficient: 2,
    color: "blue",
    lessons: [
      { id: "eng-1", title: "First Unit: Ethics in Business" },
      { id: "eng-2", title: "Second Unit: Safety First" },
      { id: "eng-3", title: "Third Unit: Astronomy and Solar System" },
      { id: "eng-4", title: "Forth Unit: Feelings and Emotions" },
    ],
  },
  {
    id: "philosophy",
    name: "الفلسفة",
    icon: "🧠",
    coefficient: 2,
    color: "violet",
    lessons: [
      { id: "ph-1", title: "العلاقة بين العلم والفلسفة", category: "الإشكالية الأولى: السؤال بين المشكلة والإشكالية" },
      { id: "ph-2", title: "أهمية الفلسفة", category: "الإشكالية الأولى: السؤال بين المشكلة والإشكالية" },
      { id: "ph-3", title: "أصل الرياضيات", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-4", title: "نتائج الرياضيات", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-5", title: "الفرق بين الرياضيات الكلاسيكية والمعاصرة", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-6", title: "الحتمية واللاحتمية", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-7", title: "معيار العلم", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-8", title: "قيمة الفرضية", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-9", title: "المنهج التجريبي في المادة الحية", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-10", title: "الفرق بين الملاحظة العادية والعلمية", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-11", title: "المنهج التجريبي في علم النفس", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-12", title: "المنهج التجريبي في التاريخ", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-13", title: "المنهج التجريبي في العلوم الإنسانية", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-14", title: "معرفة الذات بين الأنا والغير", category: "الإشكالية الثالثة: العلاقات بين الناس" },
      { id: "ph-15", title: "العلاقة بين الأنا والغير", category: "الإشكالية الثالثة: العلاقات بين الناس" },
      { id: "ph-16", title: "الحرية والمسؤولية", category: "الإشكالية الثالثة: العلاقات بين الناس" },
      { id: "ph-17", title: "العنف والتسامح", category: "الإشكالية الثالثة: العلاقات بين الناس" },
      { id: "ph-18", title: "درس المنطق الصوري", category: "الإشكالية الرابعة: انطباق الفكر مع نفسه" },
      { id: "ph-19", title: "قيمة المنطق الصوري", category: "الإشكالية الرابعة: انطباق الفكر مع نفسه" },
    ],
  },
];

```

---

## ⚡ 2. محرك النسب والتخزين المحلي (`src/hooks/use-progress.ts`)

```typescript
"use client";

import { useState, useEffect, useMemo } from "react";
import { SCIENTIFIC_STREAM_PROGRESS_DATA, LessonStatus, ProgressSubject } from "@/data/bac-progress-data";

export function useProgress() {
  const [progressState, setProgressState] = useState<Record<string, LessonStatus>>({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("bac_user_progress_map");
      if (stored) {
        setProgressState(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load progress from localStorage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const updateLessonStatus = (lessonId: string, nextStatus: LessonStatus) => {
    const updated = { ...progressState, [lessonId]: nextStatus };
    setProgressState(updated);
    try {
      window.localStorage.setItem("bac_user_progress_map", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save progress to localStorage", e);
    }
  };

  // Helper calculations
  const stats = useMemo(() => {
    let totalCompletedLessons = 0;
    let totalLessonsCount = 0;

    let totalWeightedPoints = 0;
    let totalCoefficients = 0;

    const subjectsCalculations = SCIENTIFIC_STREAM_PROGRESS_DATA.map((subject: ProgressSubject) => {
      const subjectTotal = subject.lessons.length;
      totalLessonsCount += subjectTotal;

      const completedInSubject = subject.lessons.filter(
        (l) => progressState[l.id] === "COMPLETED"
      ).length;

      const inProgressInSubject = subject.lessons.filter(
        (l) => progressState[l.id] === "IN_PROGRESS"
      ).length;

      totalCompletedLessons += completedInSubject;

      const subjectPercentage = subjectTotal > 0 ? Math.round((completedInSubject / subjectTotal) * 100) : 0;

      // BAC Weighted Readiness
      totalWeightedPoints += subjectPercentage * subject.coefficient;
      totalCoefficients += subject.coefficient;

      return {
        ...subject,
        completedCount: completedInSubject,
        inProgressCount: inProgressInSubject,
        totalCount: subjectTotal,
        percentage: subjectPercentage,
      };
    });

    const overallFlatPercentage = totalLessonsCount > 0 ? Math.round((totalCompletedLessons / totalLessonsCount) * 100) : 0;
    const bacReadinessIndex = totalCoefficients > 0 ? Math.round(totalWeightedPoints / totalCoefficients) : 0;

    return {
      subjects: subjectsCalculations,
      totalCompletedLessons,
      totalLessonsCount,
      overallFlatPercentage,
      bacReadinessIndex,
    };
  }, [progressState]);

  return {
    isHydrated,
    progressState,
    updateLessonStatus,
    ...stats,
  };
}

```

---

## 🎨 3. واجهة التحكم والمناسيج التفاعلية (`src/app/progress/page.tsx`)

```tsx
"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useProgress } from "@/hooks/use-progress";
import { LessonStatus } from "@/data/bac-progress-data";

export default function ProgressPage() {
  const { isHydrated, updateLessonStatus, progressState, subjects, overallFlatPercentage, bacReadinessIndex, totalCompletedLessons, totalLessonsCount } = useProgress();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("science");

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) ?? subjects[0];

  return (
    <AppShell>
      {/* Heading Header */}
      <section className="subject-page-heading" style={{ marginBottom: "1.5rem" }}>
        <div>
          <p className="eyebrow">شعبة العلوم التجريبية</p>
          <h1>تقدمي في الدروس</h1>
          <p>تابع مدى جاهزيتك لكل مادة وللامتحان الشامل خطوة بخطوة.</p>
        </div>
        <span className="subject-hero-icon subject-icon-green" aria-hidden="true">
          📈
        </span>
      </section>

      {/* Global Progress Dashboard Widget */}
      <section className="progress-dashboard-card">
        <div className="progress-dashboard-main">
          <div>
            <span className="eyebrow-badge">مؤشر الجاهزية المرجّح</span>
            <h2 className="progress-score">{isHydrated ? `${bacReadinessIndex}%` : "0%"}</h2>
            <p className="progress-subtext">حُسب بناءً على معاملات شعبتك (مجموع المعاملات: 29)</p>
          </div>
          <div className="progress-flat-stats">
            <div className="stat-pill">
              <span>الدروس المكتملة</span>
              <strong>{isHydrated ? `${totalCompletedLessons} / ${totalLessonsCount}` : "0/0"}</strong>
            </div>
            <div className="stat-pill">
              <span>النسبة العامة الخام</span>
              <strong>{isHydrated ? `${overallFlatPercentage}%` : "0%"}</strong>
            </div>
          </div>
        </div>
        <div className="progress-bar-track-large">
          <div
            className="progress-bar-fill-large"
            style={{ width: `${isHydrated ? bacReadinessIndex : 0}%` }}
          />
        </div>
      </section>

      {/* Subject Tabs Navigation */}
      <nav className="subject-tabs" aria-label="اختر المادة لتتبع دراستها" style={{ marginBlock: "1.5rem" }}>
        {subjects.map((subj) => (
          <button
            key={subj.id}
            type="button"
            className={`subject-tab ${selectedSubjectId === subj.id ? "is-active" : ""}`}
            onClick={() => setSelectedSubjectId(subj.id)}
          >
            <span>{subj.icon} {subj.name}</span>
            <small style={{ marginInlineStart: "0.4rem", opacity: 0.8 }}>({subj.percentage}%)</small>
          </button>
        ))}
      </nav>

      {/* Active Subject Detail & Checklist */}
      {activeSubject && (
        <section className="subject-checklist-card">
          <div className="checklist-header">
            <div>
              <h2>{activeSubject.icon} {activeSubject.name}</h2>
              <p>المعامل: <strong>{activeSubject.coefficient}</strong> • إجمالي الدروس: {activeSubject.totalCount}</p>
            </div>
            <div className="subject-progress-badge">
              <span>نسبة المادة</span>
              <strong>{activeSubject.percentage}%</strong>
            </div>
          </div>

          <div className="progress-bar-track" style={{ marginBottom: "1.5rem" }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${activeSubject.percentage}%` }}
            />
          </div>

          {/* Lessons List */}
          <div className="lessons-list">
            {activeSubject.lessons.map((lesson, idx) => {
              const currentStatus: LessonStatus = progressState[lesson.id] ?? "NOT_STARTED";
              const showCategory = lesson.category && (idx === 0 || activeSubject.lessons[idx - 1]?.category !== lesson.category);

              return (
                <div key={lesson.id}>
                  {showCategory && <h3 className="lesson-category-title">{lesson.category}</h3>}
                  <div className={`lesson-row status-border-${currentStatus.toLowerCase()}`}>
                    <span className="lesson-title">{lesson.title}</span>
                    <div className="status-actions">
                      <button
                        type="button"
                        className={`status-chip ${currentStatus === "NOT_STARTED" ? "active-not-started" : ""}`}
                        onClick={() => updateLessonStatus(lesson.id, "NOT_STARTED")}
                      >
                        ⚪ لم يبدأ
                      </button>
                      <button
                        type="button"
                        className={`status-chip ${currentStatus === "IN_PROGRESS" ? "active-in-progress" : ""}`}
                        onClick={() => updateLessonStatus(lesson.id, "IN_PROGRESS")}
                      >
                        🟡 قيد المراجعة
                      </button>
                      <button
                        type="button"
                        className={`status-chip ${currentStatus === "COMPLETED" ? "active-completed" : ""}`}
                        onClick={() => updateLessonStatus(lesson.id, "COMPLETED")}
                      >
                        ✅ تم الإنجاز
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </AppShell>
  );
}

```

---

## 🎨 4. التنسيقات الإضافية لملف `src/app/styles.css`

قم بدمج الكود التالي في نهاية `src/app/styles.css` لتفعيل ألوان وتخطيط بطاقات التقدم بشكل يتجاوب 100% مع الجوال:

```css
/* Progress Dashboard Card */
.progress-dashboard-card {
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--blue-900), var(--blue-800));
  color: #ffffff;
  border-radius: 1rem;
  box-shadow: var(--shadow);
}

.progress-dashboard-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.eyebrow-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  color: #9ee6ce;
}

.progress-score {
  margin: 0.2rem 0;
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  line-height: 1;
  letter-spacing: -0.02em;
}

.progress-subtext {
  margin: 0;
  font-size: 0.78rem;
  color: #c9e4ef;
}

.progress-flat-stats {
  display: flex;
  gap: 1rem;
}

.stat-pill {
  display: flex;
  flex-direction: column;
  padding: 0.6rem 1rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.75rem;
}

.stat-pill span {
  font-size: 0.68rem;
  color: #b9d8e5;
}

.stat-pill strong {
  font-size: 1.1rem;
  color: #fff;
}

.progress-bar-track-large {
  width: 100%;
  height: 0.75rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  overflow: hidden;
  margin-top: 1.25rem;
}

.progress-bar-fill-large {
  height: 100%;
  background: linear-gradient(90deg, #1f8d68, #2d93c8);
  border-radius: 999px;
  transition: width 0.4s ease;
}

/* Checklist Details Card */
.subject-checklist-card {
  padding: 1.25rem;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 1rem;
  box-shadow: 0 4px 18px rgba(18, 50, 74, 0.04);
}

.checklist-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.checklist-header h2 {
  margin: 0;
  color: var(--blue-900);
  font-size: 1.3rem;
}

.checklist-header p {
  margin: 0.2rem 0 0;
  color: var(--ink-500);
  font-size: 0.78rem;
}

.subject-progress-badge {
  text-align: center;
  padding: 0.4rem 0.8rem;
  background: var(--blue-100);
  border-radius: 0.6rem;
  color: var(--blue-800);
}

.subject-progress-badge span {
  display: block;
  font-size: 0.65rem;
}

.subject-progress-badge strong {
  font-size: 1.2rem;
  line-height: 1;
}

.lesson-category-title {
  margin: 1.2rem 0 0.5rem;
  padding-bottom: 0.25rem;
  border-bottom: 2px solid var(--line);
  color: var(--blue-700);
  font-size: 0.9rem;
  font-weight: 800;
}

.lesson-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0.9rem;
  margin-bottom: 0.45rem;
  background: var(--canvas);
  border: 1px solid var(--line);
  border-radius: 0.65rem;
  transition: all 0.15s ease;
}

.lesson-title {
  color: var(--ink-900);
  font-size: 0.88rem;
  font-weight: 700;
}

.status-actions {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.status-chip {
  padding: 0.25rem 0.55rem;
  border: 1px solid var(--line);
  border-radius: 0.45rem;
  background: var(--surface);
  color: var(--ink-500);
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.status-chip:hover {
  border-color: var(--blue-500);
}

.active-not-started {
  background: #eef2f5;
  color: var(--ink-900);
  border-color: #cbd5e1;
}

.active-in-progress {
  background: #fff8e1;
  color: #b78103;
  border-color: #ffe082;
  font-weight: 800;
}

.active-completed {
  background: var(--green-100);
  color: var(--green-800);
  border-color: #a3e7c8;
  font-weight: 800;
}

@media (max-width: 600px) {
  .lesson-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .status-actions {
    width: 100%;
    justify-content: space-between;
  }
  .status-chip {
    flex: 1;
    text-align: center;
  }
}

```