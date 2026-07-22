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
          <p style={{ marginTop: '0.8rem', fontSize: '0.85rem', lineHeight: '1.6', opacity: 0.9 }}>
            تم بناء محرك التتبع ليعكس الواقع الفعلي للبكالوريا؛ فالدروس ليست متساوية في التأثير على معدلك النهائي. يُحسب مؤشر الجاهزية باستخدام المعدل المرجّح للمعاملات، مما يعني أن المواد ذات المعاملات العالية (كالعلوم والرياضيات والفيزياء) تدفع بشريط تقدمك للأعلى بنسبة أسرع وأكبر، لتساعدك على ترتيب أولوياتك وإدارة وقتك بذكاء.
          </p>
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
