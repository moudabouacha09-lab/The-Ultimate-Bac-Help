// src/app/tools/prerequisites/quiz/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { diagnosticData, type QuizQuestion } from "@/data/prerequisites-quiz-data";
import { MathText } from "@/components/ui/math-text";

export default function PrerequisitesQuizPage() {
  const [selectedSubject, setSelectedSubject] = useState<"math" | "physics" | "science">("math");
  const [mode, setMode] = useState<"quiz" | "exercise">("quiz");
  
  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const activeDiagnostic = diagnosticData[selectedSubject];
  const currentQuestion: QuizQuestion = activeDiagnostic.questions[currentIndex];

  const handleSubjectChange = (subject: "math" | "physics" | "science") => {
    setSelectedSubject(subject);
    resetQuiz();
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setIsCompleted(false);
    setShowSolution(false);
  };

  const handleAnswerSelect = (answer: number | boolean) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    setShowExplanation(true);

    if (answer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeDiagnostic.questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsCompleted(true);
    }
  };

  return (
    <AppShell>
      <div className="back-link-wrapper" style={{ margin: "1rem 0" }}>
        <Link className="back-link" href="/tools/prerequisites">
          ← العودة للمكتسبات القبلية
        </Link>
      </div>

      {/* Heading Section */}
      <section className="subject-page-heading" style={{ marginBottom: "1.5rem" }}>
        <div>
          <p className="eyebrow">تشخيص المكتسبات القبلية 🎯</p>
          <h1>اختبار المكتسبات - 3 ثانوي</h1>
          <p style={{ marginTop: "0.5rem", color: "var(--text-secondary)" }}>
            اختبر معارفك السابقة من 1 و 2 ثانوي في المواد العلمية الثلاث لتحديد نقاط قوتك وتدارك ثغراتك قبل بداية العام الدراسي.
          </p>
        </div>
        <span className={`subject-hero-icon subject-icon-${activeDiagnostic.color}`} aria-hidden="true">
          {activeDiagnostic.icon}
        </span>
      </section>

      {/* Navigation Controls: Subject Selector */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {(["math", "physics", "science"] as const).map((key) => {
          const item = diagnosticData[key];
          const isActive = selectedSubject === key;
          return (
            <button
              key={key}
              onClick={() => handleSubjectChange(key)}
              style={{
                minHeight: "48px",
                padding: "0.6rem 1.2rem",
                borderRadius: "0.65rem",
                border: "1px solid var(--border-color)",
                backgroundColor: isActive ? "var(--accent-color, #2563eb)" : "var(--card-bg)",
                color: isActive ? "#ffffff" : "var(--text-primary)",
                fontWeight: "800",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.2s ease"
              }}
            >
              <span>{item.icon}</span>
              <span>{item.subjectName}</span>
            </button>
          );
        })}
      </div>

      {/* Mode Switcher Tabs */}
      <div className="subject-tabs" style={{ marginBottom: "1.5rem" }}>
        <button
          className={`subject-tab ${mode === "quiz" ? "is-active" : ""}`}
          onClick={() => setMode("quiz")}
          type="button"
          style={{ minHeight: "48px" }}
        >
          ⏱ الاختبار التفاعلي (10 أسئلة)
        </button>
        <button
          className={`subject-tab ${mode === "exercise" ? "is-active" : ""}`}
          onClick={() => setMode("exercise")}
          type="button"
          style={{ minHeight: "48px" }}
        >
          📝 التمرين الشامل المحلول
        </button>
      </div>

      {/* MODE 1: INTERACTIVE QUIZ */}
      {mode === "quiz" && (
        <section className="quiz-container" style={{ maxWidth: "62rem" }}>
          {!isCompleted ? (
            <div className="calculator-card" style={{ padding: "1.5rem" }}>
              {/* Progress Bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "bold" }}>
                <span>السؤال {currentIndex + 1} من {activeDiagnostic.questions.length}</span>
                <span className="badge" style={{ padding: "0.25rem 0.75rem", borderRadius: "0.5rem", background: "var(--card-bg)", border: "1px solid var(--border-color)" }}>النتيجة الحالية: {score}</span>
              </div>
              <div style={{ width: "100%", height: "8px", backgroundColor: "var(--border-color)", borderRadius: "999px", overflow: "hidden", marginBottom: "1.5rem" }}>
                <div style={{ width: `${((currentIndex + 1) / activeDiagnostic.questions.length) * 100}%`, height: "100%", backgroundColor: "var(--accent-color, #2563eb)", transition: "width 0.3s ease" }} />
              </div>

              {/* Question Text */}
              <h2 style={{ fontSize: "1.15rem", color: "var(--text-primary)", marginBottom: "1.25rem", lineHeight: "1.6" }}>
                <MathText text={currentQuestion.questionText} />
              </h2>

              {/* MCQ Options */}
              {currentQuestion.type === "mcq" && currentQuestion.options && (
                <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  {currentQuestion.options.map((opt, idx) => {
                    let optionStyle: React.CSSProperties = {
                      backgroundColor: "var(--card-bg)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-primary)"
                    };

                    if (selectedAnswer !== null) {
                      if (idx === currentQuestion.correctAnswer) {
                        optionStyle = { backgroundColor: "rgba(34, 197, 94, 0.15)", borderColor: "#22c55e", color: "#15803d" };
                      } else if (selectedAnswer === idx) {
                        optionStyle = { backgroundColor: "rgba(239, 68, 68, 0.15)", borderColor: "#ef4444", color: "#b91c1c" };
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(idx)}
                        disabled={selectedAnswer !== null}
                        style={{
                          minHeight: "52px",
                          padding: "0.85rem 1.25rem",
                          borderRadius: "0.75rem",
                          border: "1px solid",
                          textAlign: "right",
                          fontSize: "0.95rem",
                          fontWeight: "700",
                          cursor: selectedAnswer === null ? "pointer" : "default",
                          ...optionStyle,
                          transition: "all 0.15s ease"
                        }}
                      >
                        <MathText text={opt} />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Boolean Options */}
              {currentQuestion.type === "boolean" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                  {[true, false].map((boolVal) => {
                    let boolStyle: React.CSSProperties = {
                      backgroundColor: "var(--card-bg)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-primary)"
                    };

                    if (selectedAnswer !== null) {
                      if (boolVal === currentQuestion.correctAnswer) {
                        boolStyle = { backgroundColor: "rgba(34, 197, 94, 0.15)", borderColor: "#22c55e", color: "#15803d" };
                      } else if (selectedAnswer === boolVal) {
                        boolStyle = { backgroundColor: "rgba(239, 68, 68, 0.15)", borderColor: "#ef4444", color: "#b91c1c" };
                      }
                    }

                    return (
                      <button
                        key={String(boolVal)}
                        onClick={() => handleAnswerSelect(boolVal)}
                        disabled={selectedAnswer !== null}
                        style={{
                          minHeight: "52px",
                          padding: "0.85rem",
                          borderRadius: "0.75rem",
                          border: "1px solid",
                          fontSize: "1.1rem",
                          fontWeight: "800",
                          cursor: selectedAnswer === null ? "pointer" : "default",
                          ...boolStyle,
                          transition: "all 0.15s ease"
                        }}
                      >
                        {boolVal ? "✅ صحيح" : "❌ خطأ"}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Explanation & Next Step */}
              {showExplanation && (
                <div style={{ padding: "1rem 1.25rem", backgroundColor: "rgba(37, 99, 235, 0.1)", border: "1px solid var(--accent-color, #2563eb)", borderRadius: "0.75rem", marginBottom: "1.5rem" }}>
                  <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "0.25rem" }}>💡 التوضيح العلمي:</strong>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    <MathText text={currentQuestion.explanation} />
                  </p>
                </div>
              )}

              {selectedAnswer !== null && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={handleNextQuestion}
                    style={{
                      minHeight: "48px",
                      padding: "0.65rem 1.5rem",
                      fontSize: "0.95rem",
                      fontWeight: "700",
                      borderRadius: "0.6rem",
                      backgroundColor: "var(--accent-color, #2563eb)",
                      color: "#ffffff",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    {currentIndex + 1 === activeDiagnostic.questions.length ? "عرض النتيجة النهائية 📊" : "السؤال التالي ←"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Diagnostic Report View */
            <div className="calculator-card" style={{ padding: "2rem", textAlign: "center" }}>
              <span style={{ fontSize: "3.5rem" }}>
                {score >= 8 ? "🏆" : score >= 5 ? "📈" : "💪"}
              </span>
              <h2 style={{ color: "var(--text-primary)", margin: "0.5rem 0" }}>تقرير التشخيص لـ {activeDiagnostic.subjectName}</h2>
              <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#22c55e" }}>
                تحصلت على {score} من {activeDiagnostic.questions.length} أسئلة صحيحة!
              </p>
              <p style={{ color: "var(--text-secondary)", maxWidth: "35rem", margin: "0.75rem auto 1.5rem", lineHeight: "1.7" }}>
                {score >= 8
                  ? "ممتاز جداً! لديك قاعدة صلبة ومتقنة للمكتسبات القبلية. أنت جاهز للانطلاق بثقة في البكالوريا."
                  : score >= 5
                  ? "نتيجة طيبة! تمتلك المفاهيم الأساسية ولكن تحتاج لإعادة تنشيط بعض الروابط والقوانين."
                  : "فرصة ممتازة للتدارك! يُنصح بمشاهدة مقاطع المكتسبات القبلية الموصى بها قبل بداية الدروس الرسمية."}
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={resetQuiz}
                  style={{
                    minHeight: "48px",
                    padding: "0.65rem 1.25rem",
                    fontWeight: "700",
                    borderRadius: "0.6rem",
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--card-bg)",
                    color: "var(--text-primary)",
                    cursor: "pointer"
                  }}
                >
                  إعادة الاختبار 🔄
                </button>
                <button
                  onClick={() => setMode("exercise")}
                  style={{
                    minHeight: "48px",
                    padding: "0.65rem 1.25rem",
                    fontWeight: "700",
                    borderRadius: "0.6rem",
                    border: "none",
                    backgroundColor: "var(--accent-color, #2563eb)",
                    color: "#ffffff",
                    cursor: "pointer"
                  }}
                >
                  الانتقال للتمرين الشامل 📝
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* MODE 2: COMPREHENSIVE EXERCISE */}
      {mode === "exercise" && (
        <section className="exercise-container" style={{ maxWidth: "62rem" }}>
          <article className="calculator-card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h2 style={{ color: "var(--text-primary)", marginBottom: "1rem", fontSize: "1.25rem" }}>
              {activeDiagnostic.exercise.title}
            </h2>
            <div style={{ whiteSpace: "pre-line", color: "var(--text-primary)", lineHeight: "1.8", fontSize: "0.98rem", marginBottom: "1.5rem" }}>
              <MathText text={activeDiagnostic.exercise.statement} />
            </div>

            {/* Statement Images */}
            {activeDiagnostic.exercise.statementImages && activeDiagnostic.exercise.statementImages.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                {activeDiagnostic.exercise.statementImages.map((imgSrc, idx) => (
                  <img
                    key={idx}
                    src={imgSrc}
                    alt={`وثيقة موضوع التمرين ${idx + 1}`}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "0.75rem",
                      border: "1px solid var(--border-color)",
                      boxShadow: "var(--shadow-sm)"
                    }}
                  />
                ))}
              </div>
            )}

            <button
              onClick={() => setShowSolution((prev) => !prev)}
              style={{
                minHeight: "48px",
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.65rem",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--card-bg)",
                color: "var(--text-primary)",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {showSolution ? "إخفاء الحل النموذجي 👁️" : "عرض الحل النموذجي المفصل 🔑"}
            </button>

            {showSolution && (
              <div style={{ marginTop: "1.5rem", padding: "1.25rem", backgroundColor: "rgba(34, 197, 94, 0.1)", border: "1px solid #22c55e", borderRadius: "0.85rem" }}>
                <h3 style={{ color: "#15803d", marginTop: 0, marginBottom: "0.75rem", fontSize: "1.1rem" }}>
                  🔑 الحل النموذجي والتنقيط البيداغوجي:
                </h3>
                <div style={{ whiteSpace: "pre-line", color: "var(--text-primary)", lineHeight: "1.8", fontSize: "0.95rem", marginBottom: activeDiagnostic.exercise.solutionImages ? "1rem" : 0 }}>
                  <MathText text={activeDiagnostic.exercise.solution} />
                </div>

                {/* Solution Images */}
                {activeDiagnostic.exercise.solutionImages && activeDiagnostic.exercise.solutionImages.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {activeDiagnostic.exercise.solutionImages.map((imgSrc, idx) => (
                      <img
                        key={idx}
                        src={imgSrc}
                        alt={`وثيقة حل التمرين ${idx + 1}`}
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "0.75rem",
                          border: "1px solid #22c55e",
                          boxShadow: "var(--shadow-sm)"
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </article>
        </section>
      )}
    </AppShell>
  );
}
