"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";

type SubjectField = { id: string; name: string; coefficient: number };
type Stream = 
  | "Scientific" 
  | "Mathematical" 
  | "Engineering" 
  | "Literature" 
  | "Languages" 
  | "Management" 
  | "Artistic";

const streamLabels: Record<Stream, string> = {
  Scientific: "علوم تجريبية",
  Mathematical: "رياضيات",
  Engineering: "هندسة (تقني رياضي)",
  Literature: "آداب وفلسفة",
  Languages: "لغات أجنبية",
  Management: "تسيير واقتصاد",
  Artistic: "فنون"
};

// البيانات الدقيقة المستخرجة مباشرةً من الجداول الرسمية الصادرة عن وزارة التربية الوطنية (السنة الثالثة ثانوي - البكالوريا)
const streamSubjects: Record<Stream, SubjectField[]> = {
  Scientific: [
    { id: "science", name: "علوم الطبيعة والحياة", coefficient: 6 },
    { id: "math", name: "الرياضيات", coefficient: 5 },
    { id: "physics", name: "الفيزياء", coefficient: 4 },
    { id: "english", name: "اللغة الإنجليزية", coefficient: 3 },
    { id: "arabic", name: "اللغة العربية", coefficient: 2 },
    { id: "history", name: "تاريخ وجغرافيا (تاريخ)", coefficient: 2 },
    { id: "islamic", name: "العلوم الإسلامية", coefficient: 2 },
    { id: "sports", name: "تربية بدنية", coefficient: 1 }
  ],
  Mathematical: [
    { id: "math", name: "الرياضيات", coefficient: 8 },
    { id: "physics", name: "الفيزياء", coefficient: 6 },
    { id: "computer_science", name: "إعلام آلي", coefficient: 3 },
    { id: "english", name: "اللغة الإنجليزية", coefficient: 3 },
    { id: "science", name: "علوم الطبيعة والحياة", coefficient: 2 },
    { id: "history", name: "تاريخ وجغرافيا (تاريخ)", coefficient: 2 },
    { id: "islamic", name: "العلوم الإسلامية", coefficient: 2 },
    { id: "sports", name: "تربية بدنية", coefficient: 1 }
  ],
  Engineering: [
    { id: "technology", name: "تكنولوجيا", coefficient: 7 },
    { id: "math", name: "الرياضيات", coefficient: 5 },
    { id: "physics", name: "الفيزياء", coefficient: 4 },
    { id: "computer_science", name: "إعلام آلي", coefficient: 3 },
    { id: "english", name: "لغة إنجليزية", coefficient: 3 },
    { id: "history", name: "تاريخ وجغرافيا (تاريخ)", coefficient: 2 },
    { id: "islamic", name: "علوم إسلامية", coefficient: 2 },
    { id: "sports", name: "تربية بدنية", coefficient: 1 }
  ],
  Literature: [
    { id: "arabic", name: "لغة عربية", coefficient: 7 },
    { id: "philosophy", name: "فلسفة", coefficient: 6 },
    { id: "history_geo", name: "تاريخ وجغرافيا", coefficient: 4 },
    { id: "english", name: "لغة إنجليزية", coefficient: 3 },
    { id: "french", name: "لغة فرنسية", coefficient: 2 },
    { id: "islamic", name: "علوم إسلامية", coefficient: 2 },
    { id: "sports", name: "تربية بدنية", coefficient: 1 }
  ],
  Languages: [
    { id: "third_language", name: "لغة أجنبية ثالثة (إسبانية/ألمانية/إيطالية)", coefficient: 6 },
    { id: "english", name: "لغة إنجليزية", coefficient: 4 },
    { id: "french", name: "لغة فرنسية", coefficient: 4 },
    { id: "arabic", name: "لغة عربية", coefficient: 2 },
    { id: "history_geo", name: "تاريخ وجغرافيا", coefficient: 2 },
    { id: "islamic", name: "علوم إسلامية", coefficient: 2 },
    { id: "sports", name: "تربية بدنية", coefficient: 1 }
  ],
  Management: [
    { id: "accounting", name: "تسيير محاسبي ومالي", coefficient: 6 },
    { id: "economics", name: "اقتصاد ومناجمنت", coefficient: 4 },
    { id: "math", name: "رياضيات", coefficient: 3 },
    { id: "history_geo", name: "تاريخ وجغرافيا", coefficient: 3 },
    { id: "english", name: "لغة إنجليزية", coefficient: 3 },
    { id: "arabic", name: "لغة عربية", coefficient: 2 },
    { id: "law", name: "قانون", coefficient: 2 },
    { id: "islamic", name: "علوم إسلامية", coefficient: 2 },
    { id: "sports", name: "تربية بدنية", coefficient: 1 }
  ],
  Artistic: [
    { id: "art_1", name: "فنون 1 (التخصص الرئيسي)", coefficient: 6 },
    { id: "art_2", name: "فنون 2 (التخصص الفرعي)", coefficient: 5 },
    { id: "arabic", name: "لغة عربية", coefficient: 4 },
    { id: "english", name: "لغة إنجليزية", coefficient: 2 },
    { id: "french", name: "لغة فرنسية", coefficient: 2 },
    { id: "history_geo", name: "تاريخ وجغرافيا", coefficient: 2 },
    { id: "islamic", name: "علوم إسلامية", coefficient: 2 },
    { id: "sports", name: "تربية بدنية", coefficient: 1 }
  ]
};

export default function CalculatorPage() {
  const [stream, setStream] = useState<Stream>("Scientific");
  const [grades, setGrades] = useState<Record<string, string>>({});
  const subjects = streamSubjects[stream] ?? streamSubjects.Scientific;

  const totalStreamCoefficients = useMemo(() => {
    return subjects.reduce((sum, subject) => sum + subject.coefficient, 0);
  }, [subjects]);

  const { average } = useMemo(() => {
    let points = 0;
    let coefficients = 0;

    subjects.forEach((subject) => {
      const val = grades[subject.id]?.replace(",", ".");
      if (val !== undefined && val !== "" && !Number.isNaN(Number(val))) {
        const grade = Math.min(20, Math.max(0, Number(val)));
        points += grade * subject.coefficient;
        coefficients += subject.coefficient;
      }
    });

    return {
      average: coefficients > 0 ? points / coefficients : 0,
    };
  }, [grades, subjects]);

  function changeStream(nextStream: Stream) {
    setStream(nextStream);
    setGrades({});
  }

  function clearGrades() {
    setGrades({});
  }

  return (
    <AppShell>
      <section className="calculator-heading">
        <div>
          <p className="eyebrow">مُحيّن ووفق التنظيم الوزاري الصادر في 29 جويلية 2026 🎯</p>
          <h1>حاسبة معدل البكالوريا الرسمية</h1>
          <p>أدخل نقاطك لتحصل على معدلك الدقيق والمُحيّن وفق المعاملات والشعب الجديدة.</p>
        </div>
        <div className="calculator-result" aria-live="polite">
          <span>المعدل الحالي</span>
          <strong>{average.toFixed(2)}</strong>
          <small>مجموع المعاملات: {totalStreamCoefficients}</small>
        </div>
      </section>

      <section className="calculator-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
          <label className="stream-select" style={{ flex: 1, minWidth: "200px" }}>
            <span>اختر الشعبة الرسمية</span>
            <select value={stream} onChange={(event) => changeStream(event.target.value as Stream)}>
              {(Object.keys(streamLabels) as Stream[]).map((option) => (
                <option value={option} key={option}>{streamLabels[option]}</option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={clearGrades}
            className="btn-clear-grades"
            title="إعادة ضبط ومسح جميع النقاط"
          >
            <span>🗑️ مسح النقاط</span>
          </button>
        </div>

        <div className="calculator-form-heading">
          <div>
            <h2>مواد شعبة: {streamLabels[stream]}</h2>
            <p style={{ color: "var(--text-secondary)" }}>المعاملات مطابقة للجريدة الرسمية (مجموع المعاملات: {totalStreamCoefficients}).</p>
          </div>
          <span>النقطة / 20</span>
        </div>

        <div className="grade-grid">
          {subjects.map((subject) => (
            <label className="subject-input-card" key={subject.id}>
              <div className="subject-input-info">
                <strong>{subject.name}</strong>
                <span className="coefficient-badge">معامل {subject.coefficient}</span>
              </div>
              <input
                className="grade-input"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={grades[subject.id] ?? ""}
                onChange={(event) => {
                  const normalized = event.target.value.replace(",", ".");
                  setGrades((current) => ({ ...current, [subject.id]: normalized }));
                }}
                aria-label={`نقطة ${subject.name}`}
              />
            </label>
          ))}
        </div>

        <p className="calculator-note">
          ✨ البيانات مُحدثة رسمياً بناءً على الجداول الخاصة بالسنة الثالثة ثانوي (البكالوريا) الصادرة عن وزارة التربية الوطنية يوم 29 جويلية 2026.
        </p>
      </section>
    </AppShell>
  );
}
