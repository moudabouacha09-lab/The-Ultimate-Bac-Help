// src/components/survey/survey-modal.tsx
"use client";

import React, { useEffect, useState } from "react";

const BRANCHES = [
  "علوم تجريبية",
  "رياضيات",
  "تقني رياضي",
  "تسيير وإقتصاد",
  "آداب وفلسفة",
  "لغات أجنبية"
] as const;

export function SurveyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [branch, setBranch] = useState("");
  const [targetGrade, setTargetGrade] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // التحقق مما إذا كان الطالب قد أتم الاستطلاع سابقاً
    const isSurveyCompleted = localStorage.getItem("survey_completed");
    if (!isSurveyCompleted) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("survey_completed", "true");
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branch) return;

    setIsSubmitting(true);

    try {
      await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branch,
          targetGrade: targetGrade ? parseFloat(targetGrade) : null
        })
      });
    } catch (error) {
      console.error("خطأ في إرسال الاستطلاع:", error);
    } finally {
      setIsSubmitting(false);
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="survey-modal-overlay" role="dialog" aria-modal="true">
      <div className="survey-modal-box">
        <button
          className="survey-modal-close"
          onClick={handleClose}
          aria-label="إغلاق النافذة"
          type="button"
        >
          ✕
        </button>

        <div className="survey-modal-header">
          <span className="survey-badge">BAC 2026 🇩🇿</span>
          <h2>مرحباً بك في زيارتك الأولى! 👋</h2>
          <p>ساعدنا في تخصيص المحتوى المناسب لك باختيار شعبتك ومعدل طموحك.</p>
        </div>

        <form onSubmit={handleSubmit} className="survey-form">
          <div className="survey-form-group">
            <label htmlFor="survey-branch">
              الشعبة الدراسية <span style={{ color: "#c24747" }}>*</span>
            </label>
            <select
              id="survey-branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
            >
              <option value="" disabled>
                اختر شعبتك...
              </option>
              {BRANCHES.map((b) => (
                <option value={b} key={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="survey-form-group">
            <label htmlFor="survey-grade">
              معدل الطموح في البكالوريا (اختياري)
            </label>
            <input
              id="survey-grade"
              type="number"
              step="0.01"
              min="10"
              max="20"
              placeholder="مثال: 16.50"
              value={targetGrade}
              onChange={(e) => setTargetGrade(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="button button-primary survey-submit-btn"
            disabled={isSubmitting || !branch}
          >
            {isSubmitting ? "جاري الإرسال..." : "إرسال وتصفّح المنصة 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}
