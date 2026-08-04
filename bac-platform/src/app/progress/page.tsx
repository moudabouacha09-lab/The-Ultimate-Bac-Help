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
      <div className="progress-fluid-layout-container">
        {/* Unified Right-Aligned Page Header Section */}
        <div className="progress-page-header">
          <span className="progress-context-tag">شعبة العلوم التجريبية</span>
          <h1 className="progress-main-title">تقدمي في الدروس</h1>
          <h2 className="progress-sub-headline">تابع مدى جاهزيتك لكل مادة وللامتحان الشامل خطوة بخطوة.</h2>
          <p className="progress-paragraph-text">
            تم بناء محرك التتبع ليعكس الواقع الفعلي للبكالوريا؛ فالدروس ليست متساوية في التأثير على معدلك النهائي. يُحسب مؤشر الجاهزية باستخدام المعدل المرجّح للمعاملات، مما يعني أن المواد ذات المعاملات العالية (كالعلوم والرياضيات والفيزياء) تدفع بشريط تقدمك للأعلى بنسبة أسرع وأكبر، لتساعدك على ترتيب أولوياتك وإدارة وقتك بذكاء.
          </p>
        </div>

      {/* Global Progress Dashboard Widget */}
      <section className="progress-dashboard-card">
        <div className="progress-dashboard-main">
          <div>
            <span className="eyebrow-badge">مؤشر الجاهزية المرجّح</span>
            <h2 className="progress-score">{isHydrated ? <bdi className="rtl-num">{bacReadinessIndex}%</bdi> : <bdi className="rtl-num">0%</bdi>}</h2>
            <p className="progress-subtext">حُسب بناءً على معاملات شعبتك (مجموع المعاملات: <bdi className="rtl-num">29</bdi>)</p>
          </div>
          <div className="progress-flat-stats">
            <div className="stat-pill">
              <span>الدروس المكتملة</span>
              <strong className="rtl-num">{isHydrated ? <bdi>{totalCompletedLessons} / {totalLessonsCount}</bdi> : <bdi>0 / 0</bdi>}</strong>
            </div>
            <div className="stat-pill">
              <span>النسبة العامة الخام</span>
              <strong className="rtl-num">{isHydrated ? <bdi>{overallFlatPercentage}%</bdi> : <bdi>0%</bdi>}</strong>
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
            <small style={{ marginInlineStart: "0.4rem", opacity: 0.8 }}>(<bdi className="rtl-num">{subj.percentage}%</bdi>)</small>
          </button>
        ))}
      </nav>

      {/* Active Subject Detail & Checklist */}
      {activeSubject && (
        <section className="subject-checklist-card">
          <div className="checklist-header">
            <div>
              <h2>{activeSubject.icon} {activeSubject.name}</h2>
              <p>المعامل: <strong><bdi className="rtl-num">{activeSubject.coefficient}</bdi></strong> • إجمالي الدروس: <bdi className="rtl-num">{activeSubject.totalCount}</bdi></p>
            </div>
            <div className="subject-progress-badge">
              <span>نسبة المادة</span>
              <strong className="rtl-num"><bdi>{activeSubject.percentage}%</bdi></strong>
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
      </div>
    </AppShell>
  );
}
