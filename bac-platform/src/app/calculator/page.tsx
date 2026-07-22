"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";

type SubjectField = { id: string; name: string; coefficient: number };
type Stream = "Scientific" | "Mathematical" | "Literature" | "Technical" | "Languages" | "Management";

const streamLabels: Record<Stream, string> = {
  Scientific: "علوم تجريبية",
  Mathematical: "رياضيات",
  Technical: "تقني رياضي",
  Literature: "آداب وفلسفة",
  Languages: "لغات أجنبية",
  Management: "تسيير واقتصاد"
};

const streamSubjects: Record<Stream, SubjectField[]> = {
  Scientific: [
    { id: "math", name: "الرياضيات", coefficient: 5 },
    { id: "science", name: "العلوم الطبيعية", coefficient: 6 },
    { id: "physics", name: "الفيزياء", coefficient: 5 },
    { id: "arabic", name: "اللغة العربية", coefficient: 3 },
    { id: "french", name: "اللغة الفرنسية", coefficient: 2 },
    { id: "english", name: "اللغة الإنجليزية", coefficient: 2 },
    { id: "philosophy", name: "الفلسفة", coefficient: 2 },
    { id: "history", name: "التاريخ والجغرافيا", coefficient: 2 },
    { id: "islamic", name: "العلوم الإسلامية", coefficient: 2 },
    { id: "sports", name: "التربية البدنية والرياضية", coefficient: 1 }
  ],
  Mathematical: [
    { id: "math", name: "الرياضيات", coefficient: 7 },
    { id: "physics", name: "الفيزياء", coefficient: 6 },
    { id: "science", name: "العلوم الطبيعية", coefficient: 2 },
    { id: "arabic", name: "اللغة العربية", coefficient: 3 },
    { id: "french", name: "اللغة الفرنسية", coefficient: 2 },
    { id: "english", name: "اللغة الإنجليزية", coefficient: 2 },
    { id: "philosophy", name: "الفلسفة", coefficient: 2 },
    { id: "history", name: "التاريخ والجغرافيا", coefficient: 2 },
    { id: "islamic", name: "العلوم الإسلامية", coefficient: 2 },
    { id: "sports", name: "التربية البدنية والرياضية", coefficient: 1 }
  ],
  Technical: [
    { id: "technology", name: "التكنولوجيا", coefficient: 7 },
    { id: "math", name: "الرياضيات", coefficient: 6 },
    { id: "physics", name: "العلوم الفيزيائية", coefficient: 6 },
    { id: "arabic", name: "اللغة العربية", coefficient: 3 },
    { id: "islamic", name: "العلوم الإسلامية", coefficient: 2 },
    { id: "history", name: "التاريخ والجغرافيا", coefficient: 2 },
    { id: "philosophy", name: "الفلسفة", coefficient: 2 },
    { id: "french", name: "اللغة الفرنسية", coefficient: 2 },
    { id: "english", name: "اللغة الإنجليزية", coefficient: 2 },
    { id: "sports", name: "التربية البدنية والرياضية", coefficient: 1 }
  ],
  Literature: [
    { id: "arabic", name: "اللغة العربية", coefficient: 6 },
    { id: "philosophy", name: "الفلسفة", coefficient: 6 },
    { id: "history", name: "التاريخ والجغرافيا", coefficient: 4 },
    { id: "french", name: "اللغة الفرنسية", coefficient: 3 },
    { id: "english", name: "اللغة الإنجليزية", coefficient: 3 },
    { id: "math", name: "الرياضيات", coefficient: 2 },
    { id: "islamic", name: "العلوم الإسلامية", coefficient: 2 },
    { id: "sports", name: "التربية البدنية والرياضية", coefficient: 1 }
  ],
  Languages: [
    { id: "arabic", name: "اللغة العربية", coefficient: 5 },
    { id: "french", name: "اللغة الفرنسية", coefficient: 5 },
    { id: "english", name: "اللغة الإنجليزية", coefficient: 5 },
    { id: "third_language", name: "لغة أجنبية ثالثة", coefficient: 4 },
    { id: "islamic", name: "العلوم الإسلامية", coefficient: 2 },
    { id: "history", name: "التاريخ والجغرافيا", coefficient: 2 },
    { id: "philosophy", name: "الفلسفة", coefficient: 2 },
    { id: "math", name: "الرياضيات", coefficient: 2 },
    { id: "sports", name: "التربية البدنية والرياضية", coefficient: 1 }
  ],
  Management: [
    { id: "accounting", name: "تسيير محاسبي", coefficient: 6 },
    { id: "math", name: "الرياضيات", coefficient: 5 },
    { id: "economics", name: "إقتصاد ومناجمنت", coefficient: 5 },
    { id: "history", name: "التاريخ والجغرافيا", coefficient: 4 },
    { id: "arabic", name: "اللغة العربية", coefficient: 3 },
    { id: "law", name: "قانون", coefficient: 2 },
    { id: "islamic", name: "العلوم الإسلامية", coefficient: 2 },
    { id: "philosophy", name: "الفلسفة", coefficient: 2 },
    { id: "french", name: "اللغة الفرنسية", coefficient: 2 },
    { id: "english", name: "اللغة الإنجليزية", coefficient: 2 },
    { id: "sports", name: "التربية البدنية والرياضية", coefficient: 1 }
  ]
};

export default function CalculatorPage() {
  const [stream, setStream] = useState<Stream>("Scientific");
  const [grades, setGrades] = useState<Record<string, string>>({});
  const subjects = streamSubjects[stream];

  const average = useMemo(() => {
    const totals = subjects.reduce((result, subject) => {
      const grade = Number(grades[subject.id]);
      if (!Number.isNaN(grade) && grades[subject.id] !== "") {
        result.points += Math.min(20, Math.max(0, grade)) * subject.coefficient;
        result.coefficients += subject.coefficient;
      }
      return result;
    }, { points: 0, coefficients: 0 });

    return totals.coefficients ? totals.points / totals.coefficients : 0;
  }, [grades, subjects]);

  function changeStream(nextStream: Stream) {
    setStream(nextStream);
    setGrades({});
  }

  return (
    <AppShell>
      <section className="calculator-heading">
        <div>
          <p className="eyebrow">خطّط لهدفك</p>
          <h1>حاسبة معدل البكالوريا</h1>
          <p>أدخل نقاطك لتحصل على معدل تقريبي من 20 في الوقت الحقيقي.</p>
        </div>
        <div className="calculator-result" aria-live="polite">
          <span>المعدل الحالي</span>
          <strong>{average.toFixed(2)}</strong>
          <small>/ 20</small>
        </div>
      </section>

      <section className="calculator-card">
        <label className="stream-select">
          <span>اختر الشعبة</span>
          <select value={stream} onChange={(event) => changeStream(event.target.value as Stream)}>
            {(Object.keys(streamLabels) as Stream[]).map((option) => (
              <option value={option} key={option}>{streamLabels[option]}</option>
            ))}
          </select>
        </label>

        <div className="calculator-form-heading">
          <div><h2>نقاط المواد</h2><p>المعاملات المعروضة حسب الشعبة المختارة.</p></div>
          <span>النقطة / 20</span>
        </div>

        <div className="grade-grid">
          {subjects.map((subject) => (
            <label className="grade-field subject-input-card" key={subject.id}>
              <span><strong>{subject.name}</strong><small>المعامل {subject.coefficient}</small></span>
              <input
                type="number"
                min="0"
                max="20"
                step="0.25"
                inputMode="decimal"
                placeholder="—"
                value={grades[subject.id] ?? ""}
                onChange={(event) => setGrades((current) => ({ ...current, [subject.id]: event.target.value }))}
                aria-label={`نقطة ${subject.name}`}
              />
            </label>
          ))}
        </div>

        <p className="calculator-note">هذه النتيجة تقريبية للمراجعة والتخطيط، وقد تختلف عن المعدل الرسمي حسب طريقة احتساب المواد.</p>
      </section>
    </AppShell>
  );
}
