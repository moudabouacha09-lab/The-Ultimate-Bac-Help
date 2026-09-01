// src/app/progress/page.tsx
"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useProgress } from "@/hooks/use-progress";
import { LessonStatus } from "@/data/bac-progress-data";
import { CheckCircle2, Clock, Circle, Award } from "lucide-react";

export default function ProgressPage() {
  const {
    isHydrated,
    updateLessonStatus,
    progressState,
    subjects,
    overallFlatPercentage,
    bacReadinessIndex,
    totalCompletedLessons,
    totalLessonsCount
  } = useProgress();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("science");

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) ?? subjects[0];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-gutter py-xl flex flex-col gap-xl">
        {/* ── Header Section ── */}
        <header className="space-y-2 border-b border-primary/10 pb-6">
          <span className="font-body text-label-md text-secondary bg-secondary/10 px-3 py-1 rounded-full inline-block font-semibold">
            شعبة العلوم التجريبية 📊
          </span>
          <h1 className="font-headline text-display-lg text-primary font-bold">
            تقدمي في الدروس
          </h1>
          <p className="font-body text-body-lg text-on-surface-variant max-w-3xl">
            تابع مدى جاهزيتك لكل مادة وللامتحان الشامل خطوة بخطوة.
          </p>
          <p className="font-body text-body-md text-on-surface-variant/80 max-w-3xl leading-relaxed mt-2">
            تم بناء محرك التتبع ليعكس الواقع الفعلي للبكالوريا؛ فالدروس ليست متساوية في التأثير على معدلك النهائي. يُحسب مؤشر الجاهزية باستخدام المعدل المرجّح للمعاملات، مما يعني أن المواد ذات المعاملات العالية (كالعلوم والرياضيات والفيزياء) تدفع بشريط تقدمك للأعلى بنسبة أسرع.
          </p>
        </header>

        {/* ── Global Progress Dashboard Widget ── */}
        <section className="bg-surface-bright border border-primary/10 rounded-xl p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div>
              <span className="font-body text-caption font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full mb-2 inline-block">
                مؤشر الجاهزية المرجّح
              </span>
              <div className="font-headline text-display-lg text-primary font-bold flex items-baseline gap-2">
                <span>{isHydrated ? `${bacReadinessIndex}%` : "0%"}</span>
                <span className="font-body text-body-md text-on-surface-variant font-normal">جاهزية عامة</span>
              </div>
              <p className="font-body text-caption text-on-surface-variant mt-1">
                حُسب بناءً على معاملات شعبتك (مجموع المعاملات: 29)
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="bg-surface-container-low border border-primary/10 rounded-lg p-4 min-w-[140px] text-center">
                <span className="font-body text-caption text-on-surface-variant block mb-1">الدروس المكتملة</span>
                <strong className="font-headline text-headline-md text-primary font-bold">
                  {isHydrated ? `${totalCompletedLessons} / ${totalLessonsCount}` : "0 / 0"}
                </strong>
              </div>
              <div className="bg-surface-container-low border border-primary/10 rounded-lg p-4 min-w-[140px] text-center">
                <span className="font-body text-caption text-on-surface-variant block mb-1">النسبة الخام</span>
                <strong className="font-headline text-headline-md text-secondary font-bold">
                  {isHydrated ? `${overallFlatPercentage}%` : "0%"}
                </strong>
              </div>
            </div>
          </div>

          <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${isHydrated ? bacReadinessIndex : 0}%` }}
            />
          </div>
        </section>

        {/* ── Subject Tabs Navigation ── */}
        <nav className="flex flex-wrap gap-2" aria-label="اختر المادة لتتبع دراستها">
          {subjects.map((subj) => {
            const isActive = selectedSubjectId === subj.id;
            return (
              <button
                key={subj.id}
                type="button"
                className={`font-body text-label-md px-4 py-2 rounded-full font-medium cursor-pointer transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-primary text-on-primary font-bold shadow-sm"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
                onClick={() => setSelectedSubjectId(subj.id)}
              >
                <span className="material-symbols-outlined text-lg">{subj.icon}</span>
                <span>{subj.name}</span>
                <span className={`text-caption px-2 py-0.5 rounded-full ${isActive ? "bg-primary-container text-on-primary-container" : "bg-surface-bright text-on-surface-variant"}`}>
                  {subj.percentage}%
                </span>
              </button>
            );
          })}
        </nav>

        {/* ── Active Subject Detail & Checklist ── */}
        {activeSubject && (
          <section className="bg-surface-bright border border-primary/10 rounded-xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-primary/10 pb-4">
              <div>
                <h2 className="font-headline text-headline-md text-primary font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-2xl text-primary">{activeSubject.icon}</span>
                  <span>{activeSubject.name}</span>
                </h2>

                <p className="font-body text-body-md text-on-surface-variant mt-1">
                  المعامل: <strong className="text-primary">{activeSubject.coefficient}</strong> • إجمالي الدروس: {activeSubject.totalCount}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-body text-body-md text-on-surface-variant font-medium">نسبة المادة:</span>
                <span className="font-headline text-headline-md text-secondary font-bold bg-secondary/10 px-3 py-1 rounded-lg">
                  {activeSubject.percentage}%
                </span>
              </div>
            </div>

            <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-500"
                style={{ width: `${activeSubject.percentage}%` }}
              />
            </div>

            {/* ── 3-State Lessons List ── */}
            <div className="space-y-4">
              {activeSubject.lessons.map((lesson, idx) => {
                const currentStatus: LessonStatus = progressState[lesson.id] ?? "NOT_STARTED";
                const showCategory =
                  lesson.category &&
                  (idx === 0 || activeSubject.lessons[idx - 1]?.category !== lesson.category);

                return (
                  <div key={lesson.id}>
                    {showCategory && (
                      <h3 className="font-headline text-headline-md text-primary font-bold mt-6 mb-3 border-b border-primary/10 pb-2 flex items-center gap-2">
                        <span>{lesson.category}</span>
                      </h3>
                    )}

                    <div
                      className={`rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                        currentStatus === "COMPLETED"
                          ? "bg-surface-bright border-r-4 border-r-primary border-t border-b border-l border-primary/10 shadow-sm"
                          : currentStatus === "IN_PROGRESS"
                          ? "bg-surface-bright border-r-4 border-r-secondary border-t border-b border-l border-primary/10 shadow-sm"
                          : "bg-surface-container-low border border-primary/10 opacity-85 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            currentStatus === "COMPLETED"
                              ? "bg-primary/10 text-primary"
                              : currentStatus === "IN_PROGRESS"
                              ? "bg-secondary/10 text-secondary"
                              : "bg-surface-container text-outline"
                          }`}
                        >
                          {currentStatus === "COMPLETED" ? (
                            <CheckCircle2 size={22} />
                          ) : currentStatus === "IN_PROGRESS" ? (
                            <Clock size={22} />
                          ) : (
                            <Circle size={22} />
                          )}
                        </div>

                        <div>
                          <h4 className="font-body text-label-md font-bold text-on-surface">
                            {lesson.title}
                          </h4>
                          <span
                            className={`font-body text-caption font-semibold ${
                              currentStatus === "COMPLETED"
                                ? "text-primary"
                                : currentStatus === "IN_PROGRESS"
                                ? "text-secondary"
                                : "text-on-surface-variant/70"
                            }`}
                          >
                            {currentStatus === "COMPLETED"
                              ? "✓ تم الإنجاز ومكتمل"
                              : currentStatus === "IN_PROGRESS"
                              ? "⏳ قيد المراجعة والدراسة"
                              : "⚪ لم يبدأ بعد"}
                          </span>
                        </div>
                      </div>

                      {/* 3-State Status Interactive Chips */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => updateLessonStatus(lesson.id, "NOT_STARTED")}
                          className={`px-3 py-1.5 rounded-lg border text-caption font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                            currentStatus === "NOT_STARTED"
                              ? "bg-surface-container border-outline text-on-surface font-bold"
                              : "bg-transparent border-primary/10 text-on-surface-variant hover:bg-surface-container-low"
                          }`}
                        >
                          <Circle size={14} />
                          <span>لم يبدأ</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateLessonStatus(lesson.id, "IN_PROGRESS")}
                          className={`px-3 py-1.5 rounded-lg border text-caption font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                            currentStatus === "IN_PROGRESS"
                              ? "bg-secondary/15 border-secondary text-secondary font-bold shadow-sm"
                              : "bg-transparent border-primary/10 text-on-surface-variant hover:bg-surface-container-low"
                          }`}
                        >
                          <Clock size={14} />
                          <span>قيد المراجعة</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateLessonStatus(lesson.id, "COMPLETED")}
                          className={`px-3 py-1.5 rounded-lg border text-caption font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                            currentStatus === "COMPLETED"
                              ? "bg-primary/15 border-primary text-primary font-bold shadow-sm"
                              : "bg-transparent border-primary/10 text-on-surface-variant hover:bg-surface-container-low"
                          }`}
                        >
                          <CheckCircle2 size={14} />
                          <span>مكتمل</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}

