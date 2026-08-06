// src/app/admin/survey/page.tsx
"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";

interface Vote {
  id: number;
  username: string;
  branch: string;
  target_grade: number | null;
  created_at: string;
}

export default function AdminSurveyPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setVotes(Array.isArray(data.votes) ? data.votes : []);
      } else {
        setError(data.error || "خطأ في تسجيل الدخول");
      }
    } catch {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  // حساب الإحصائيات
  const totalVotes = votes.length;
  const validGrades = votes.filter((v) => v.target_grade !== null);
  const avgGrade = validGrades.length
    ? (validGrades.reduce((acc, curr) => acc + (curr.target_grade || 0), 0) / validGrades.length).toFixed(2)
    : "—";

  return (
    <AppShell>
      <section className="subject-page-heading" style={{ marginBottom: "2rem" }}>
        <div>
          <p className="eyebrow">إدارة المنصة</p>
          <h1>لوحة تحكم الاستطلاع 📊</h1>
          <p>استعراض نتائج تصويت وإحصائيات زوار الموقع.</p>
        </div>
      </section>

      {!isAuthenticated ? (
        <form onSubmit={handleLogin} className="calculator-card" style={{ maxWidth: "24rem", margin: "2rem auto" }}>
          <div className="survey-form-group">
            <label htmlFor="admin-pass">كلمة مرور المسؤول</label>
            <input
              id="admin-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور..."
              required
            />
          </div>
          {error && <p style={{ color: "#c24747", fontSize: "0.82rem", margin: "0.5rem 0 0" }}>{error}</p>}
          <button type="submit" className="button button-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={isLoading}>
            {isLoading ? "جاري التحقق..." : "دخول اللوحة"}
          </button>
        </form>
      ) : (
        <div style={{ display: "grid", gap: "2rem" }}>
          {/* كروت الإحصائيات */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))", gap: "1rem" }}>
            <div className="tool-card">
              <span className="tool-card-icon">👥</span>
              <div className="tool-card-content">
                <strong>إجمالي المشاركين</strong>
                <small style={{ fontSize: "1.2rem", color: "var(--blue-900)", fontWeight: "bold" }}>{totalVotes}</small>
              </div>
            </div>
            <div className="tool-card">
              <span className="tool-card-icon">🎯</span>
              <div className="tool-card-content">
                <strong>متوسط الطموح العام</strong>
                <small style={{ fontSize: "1.2rem", color: "var(--green-800)", fontWeight: "bold" }}>{avgGrade} / 20</small>
              </div>
            </div>
          </div>

          {/* جدول الإجابات */}
          <div className="calculator-card" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--line)", color: "var(--blue-900)" }}>
                  <th style={{ padding: "0.75rem" }}>المعرف</th>
                  <th style={{ padding: "0.75rem" }}>الشعبة</th>
                  <th style={{ padding: "0.75rem" }}>معدل الطموح</th>
                  <th style={{ padding: "0.75rem" }}>التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {votes.map((v) => (
                  <tr key={v.id} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: "0.75rem", fontFamily: "monospace", color: "var(--blue-700)" }}>{v.username}</td>
                    <td style={{ padding: "0.75rem", fontWeight: "bold" }}>{v.branch}</td>
                    <td style={{ padding: "0.75rem" }}>{v.target_grade ? `${v.target_grade} / 20` : "—"}</td>
                    <td style={{ padding: "0.75rem", color: "var(--ink-500)" }}>{new Date(v.created_at).toLocaleString("ar-DZ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  );
}
