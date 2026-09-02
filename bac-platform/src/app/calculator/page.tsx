// src/app/calculator/page.tsx
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
  Artistic: "فنون",
};

// البيانات الدقيقة المستخرجة مباشرةً من الجداول الرسمية الصادرة عن وزارة التربية الوطنية
const streamSubjects: Record<Stream, SubjectField[]> = {
  Scientific: [
    { id: "science", name: "علوم الطبيعة والحياة", coefficient: 6 },
    { id: "math", name: "الرياضيات", coefficient: 5 },
    { id: "physics", name: "الفيزياء", coefficient: 4 },
    { id: "english", name: "اللغة الإنجليزية", coefficient: 3 },
    { id: "arabic", name: "اللغة العربية", coefficient: 2 },
    { id: "history", name: "التاريخ والجغرافيا", coefficient: 2 },
    { id: "islamic", name: "العلوم الإسلامية", coefficient: 2 },
    { id: "sports", name: "تربية بدنية", coefficient: 1 },
  ],
  Mathematical: [
    { id: "math", name: "الرياضيات", coefficient: 8 },
    { id: "physics", name: "الفيزياء", coefficient: 6 },
    { id: "computer_science", name: "إعلام آلي", coefficient: 3 },
    { id: "english", name: "اللغة الإنجليزية", coefficient: 3 },
    { id: "science", name: "علوم الطبيعة والحياة", coefficient: 2 },
    { id: "history", name: "التاريخ والجغرافيا", coefficient: 2 },
    { id: "islamic", name: "العلوم الإسلامية", coefficient: 2 },
    { id: "sports", name: "تربية بدنية", coefficient: 1 },
  ],
  Engineering: [
    { id: "technology", name: "تكنولوجيا", coefficient: 7 },
    { id: "math", name: "الرياضيات", coefficient: 5 },
    { id: "physics", name: "الفيزياء", coefficient: 4 },
    { id: "computer_science", name: "إعلام آلي", coefficient: 3 },
    { id: "english", name: "اللغة الإنجليزية", coefficient: 3 },
    { id: "history", name: "التاريخ والجغرافيا", coefficient: 2 },
    { id: "islamic", name: "العلوم الإسلامية", coefficient: 2 },
    { id: "sports", name: "تربية بدنية", coefficient: 1 },
  ],
  Literature: [
    { id: "arabic", name: "اللغة العربية", coefficient: 7 },
    { id: "philosophy", name: "الفلسفة", coefficient: 6 },
    { id: "history_geo", name: "التاريخ والجغرافيا", coefficient: 4 },
    { id: "english", name: "اللغة الإنجليزية", coefficient: 3 },
    { id: "french", name: "اللغة الفرنسية", coefficient: 2 },
    { id: "islamic", name: "العلوم الإسلامية", coefficient: 2 },
    { id: "sports", name: "تربية بدنية", coefficient: 1 },
  ],
  Languages: [
    { id: "third_language", name: "لغة أجنبية ثالثة (إسبانية/ألمانية/إيطالية)", coefficient: 6 },
    { id: "english", name: "اللغة الإنجليزية", coefficient: 4 },
    { id: "french", name: "اللغة الفرنسية", coefficient: 4 },
    { id: "arabic", name: "اللغة العربية", coefficient: 2 },
    { id: "history_geo", name: "التاريخ والجغرافيا", coefficient: 2 },
    { id: "islamic", name: "العلوم الإسلامية", coefficient: 2 },
    { id: "sports", name: "تربية بدنية", coefficient: 1 },
  ],
  Management: [
    { id: "accounting", name: "تسيير محاسبي ومالي", coefficient: 6 },
    { id: "economics", name: "اقتصاد ومناجمنت", coefficient: 4 },
    { id: "math", name: "الرياضيات", coefficient: 3 },
    { id: "history_geo", name: "التاريخ والجغرافيا", coefficient: 3 },
    { id: "english", name: "اللغة الإنجليزية", coefficient: 3 },
    { id: "arabic", name: "اللغة العربية", coefficient: 2 },
    { id: "law", name: "قانون", coefficient: 2 },
    { id: "islamic", name: "العلوم الإسلامية", coefficient: 2 },
    { id: "sports", name: "تربية بدنية", coefficient: 1 },
  ],
  Artistic: [
    { id: "art_1", name: "فنون 1 (التخصص الرئيسي)", coefficient: 6 },
    { id: "art_2", name: "فنون 2 (التخصص الفرعي)", coefficient: 5 },
    { id: "arabic", name: "اللغة العربية", coefficient: 4 },
    { id: "english", name: "اللغة الإنجليزية", coefficient: 2 },
    { id: "french", name: "اللغة الفرنسية", coefficient: 2 },
    { id: "history_geo", name: "التاريخ والجغرافيا", coefficient: 2 },
    { id: "islamic", name: "العلوم الإسلامية", coefficient: 2 },
    { id: "sports", name: "تربية بدنية", coefficient: 1 },
  ],
};

function getSubjectIcon(name: string): string {
  if (name.includes("رياضيات")) return "functions";
  if (name.includes("علوم الطبيعة") || name.includes("علوم طبيعية")) return "biotech";
  if (name.includes("فيزياء")) return "maps";
  if (name.includes("عربية")) return "menu_book";
  if (name.includes("إنجليزية") || name.includes("إسبانية") || name.includes("لغة أجنبية")) return "language";
  if (name.includes("فرنسية")) return "translate";
  if (name.includes("فلسفة")) return "psychology";
  if (name.includes("تاريخ") || name.includes("جغرافيا")) return "public";
  if (name.includes("إسلامية")) return "mosque";
  if (name.includes("بدنية") || name.includes("رياضة")) return "fitness_center";
  if (name.includes("تكنولوجيا") || name.includes("إعلام")) return "terminal";
  if (name.includes("محاسبي") || name.includes("اقتصاد") || name.includes("قانون")) return "analytics";
  return "calculate";
}

function getAppreciationLabel(average: number): string {
  if (average >= 16) return "ممتاز 🎉";
  if (average >= 14) return "جيد جداً 🌟";
  if (average >= 12) return "جيد 👏";
  if (average >= 10) return "مقبول 👍";
  if (average > 0) return "دون المعدل ⚠️";
  return "في انتظار إدخال النقاط";
}

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
      <div className="max-w-7xl mx-auto px-gutter py-xl flex flex-col gap-xl">
        {/* ── Page Header ── */}
        <header className="space-y-2 border-b border-primary/10 pb-6">
          <span className="font-body text-label-md text-secondary bg-secondary/10 px-3 py-1 rounded-full inline-block font-semibold">
            مُحيّن ووفق التنظيم الوزاري الصادر في 29 جويلية 2026 🎯
          </span>
          <h1 className="font-headline text-display-lg text-primary font-bold">
            حساب معدل البكالوريا
          </h1>
          <p className="font-body text-body-lg text-on-surface-variant max-w-2xl">
            قم بإدخال نقاطك المتوقعة لحساب المعدل العام بدقة بناءً على شعبتك والمعاملات الرسمية.
          </p>
        </header>

        {/* ── Main Bento Grid Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Settings & Result Summary (Sticky on Desktop) */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
            {/* Stream Selector Card */}
            <section className="bg-surface-bright rounded-xl p-6 border border-primary/10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-secondary" />
              <h2 className="font-headline text-headline-md text-primary mb-4 flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-secondary">category</span>
                <span>اختر الشعبة</span>
              </h2>

              <div className="flex flex-col gap-2">
                {(Object.keys(streamLabels) as Stream[]).map((st) => {
                  const isSelected = stream === st;
                  return (
                    <label
                      key={st}
                      onClick={() => changeStream(st)}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary/20 bg-primary/5 font-semibold text-primary shadow-sm"
                          : "border-transparent text-on-surface-variant hover:bg-surface-container-low"
                      }`}
                    >
                      <input
                        type="radio"
                        name="stream"
                        checked={isSelected}
                        onChange={() => changeStream(st)}
                        className="form-radio text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="font-body text-label-md">{streamLabels[st]}</span>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Final Score Result Card */}
            <section className="bg-primary text-on-primary rounded-xl p-6 relative overflow-hidden shadow-lg shadow-primary/20 flex flex-col items-center text-center">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent" />
              <div className="relative z-10 flex flex-col items-center text-center w-full">
                <h3 className="font-body text-caption font-semibold text-primary-fixed-dim uppercase tracking-wider mb-1">
                  المعدل المتوقع
                </h3>
                <div className="font-headline text-display-lg font-bold my-3 flex items-baseline gap-1" dir="ltr">
                  <span className="text-5xl font-bold">{average.toFixed(2)}</span>
                  <span className="text-2xl text-primary-fixed-dim font-normal">/20</span>
                </div>

                <div className="w-full bg-primary-container rounded-full h-2.5 mb-4 overflow-hidden">
                  <div
                    className="bg-secondary h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(100, Math.max(0, (average / 20) * 100))}%` }}
                  />
                </div>

                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-secondary text-on-secondary font-body text-label-md font-semibold mt-1">
                  <span className="material-symbols-outlined text-base">stars</span>
                  <span>{getAppreciationLabel(average)}</span>
                </div>
              </div>
            </section>

            {/* Reset Button */}
            <button
              type="button"
              onClick={clearGrades}
              className="w-full py-3 rounded-lg border border-primary/20 text-primary font-body text-label-md font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">restart_alt</span>
              <span>إعادة ضبط النقاط</span>
            </button>
          </div>

          {/* Right Column: Subjects Input Grid */}
          <div className="lg:col-span-8">
            <section className="bg-surface-bright rounded-xl p-4 md:p-6 border border-primary/10 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-primary/10 pb-4">
                <div>
                  <h2 className="font-headline text-headline-md text-primary font-bold">
                    النقاط والمُعاملات
                  </h2>
                  <span className="font-body text-caption text-on-surface-variant">
                    شعبة {streamLabels[stream]}
                  </span>
                </div>
                <div className="font-body text-caption font-semibold text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
                  مجموع المعاملات: <strong className="text-primary font-bold">{totalStreamCoefficients}</strong>
                </div>
              </div>

              {/* Subjects Input Rows List */}
              <div className="flex flex-col gap-3">
                {subjects.map((subject) => {
                  const isEssential = subject.coefficient >= 5;
                  const val = grades[subject.id] ?? "";
                  return (
                    <div
                      key={subject.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface-container-lowest border border-primary/10 hover:border-primary/30 transition-colors gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-xl">
                            {getSubjectIcon(subject.name)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-body text-label-md font-bold text-on-surface">
                            {subject.name}
                          </h3>
                          {isEssential && (
                            <span className="font-body text-caption text-secondary font-semibold">
                              مادة أساسية
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 justify-between sm:justify-end">
                        <div className="flex flex-col items-center">
                          <span className="font-body text-caption text-on-surface-variant mb-1">
                            المعامل
                          </span>
                          <div
                            className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center font-bold text-primary font-body text-body-md"
                            dir="ltr"
                          >
                            {subject.coefficient}
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <label className="font-body text-caption text-on-surface-variant mb-1 text-right">
                            النقطة (من 20)
                          </label>
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder="00.00"
                            value={val}
                            onChange={(e) => {
                              const normalized = e.target.value.replace(",", ".");
                              setGrades((prev) => ({ ...prev, [subject.id]: normalized }));
                            }}
                            aria-label={`نقطة ${subject.name}`}
                            className="w-24 px-3 py-2 bg-surface-bright border border-primary/20 rounded-lg text-center font-body text-body-md font-bold text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-center"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

