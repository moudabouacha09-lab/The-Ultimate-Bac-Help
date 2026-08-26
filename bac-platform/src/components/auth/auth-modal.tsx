// src/components/auth/auth-modal.tsx
"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { AcademicBranch, AcademicLevel, branchLabels, levelLabels } from "@/lib/auth-types";
import { X, Mail, Lock, User, LogIn, UserPlus, CheckCircle2, GraduationCap, ArrowRight } from "lucide-react";

export function AuthModal() {
  const { isModalOpen, closeAuthModal, authMode, login, register } = useAuth();
  const [tab, setTab] = useState<"login" | "register">(authMode);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState<AcademicBranch>("experimental-science");
  const [level, setLevel] = useState<AcademicLevel>("mid");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (tab === "login") {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || "فشل تسجيل الدخول");
        }
      } else {
        const res = await register({
          username: username.trim() || email.split("@")[0],
          email: email.trim(),
          password,
          branch,
          level
        });

        if (!res.success) {
          setError(res.error || "فشل إنشاء الحساب");
        } else if (res.needsEmailConfirmation) {
          setNeedsConfirmation(true);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "rgba(10, 16, 26, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)"
      }}
      onClick={closeAuthModal}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "var(--ocean-900, #141c26)",
          border: "1.5px solid var(--border-strong, rgba(255, 255, 255, 0.18))",
          borderRadius: "var(--radius-xl, 1.25rem)",
          boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.6)",
          padding: "1.75rem",
          color: "var(--text-primary)",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          style={{
            position: "absolute",
            top: "1.25rem",
            left: "1.25rem",
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: "0.25rem",
            borderRadius: "50%"
          }}
          aria-label="إغلاق"
        >
          <X size={20} />
        </button>

        {needsConfirmation ? (
          /* Step 8: Email Confirmation State */
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "rgba(52, 211, 153, 0.15)",
                color: "#34d399",
                marginBottom: "1rem"
              }}
            >
              <Mail size={32} />
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: "900", margin: "0 0 0.5rem 0" }}>
              تحقق من بريدك الإلكتروني! 📩
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              تم إرسال رابط تأكيد الحساب إلى:
              <br />
              <strong style={{ color: "var(--accent-cyan)", fontSize: "0.95rem" }}>{email}</strong>
              <br />
              يرجى فتح صندوق البريد والنقر على رابط التأكيد لتفعيل حسابك، ثم تسجيل الدخول.
            </p>
            <button
              type="button"
              onClick={() => {
                setNeedsConfirmation(false);
                setTab("login");
                setError(null);
              }}
              style={{
                width: "100%",
                padding: "0.85rem",
                borderRadius: "var(--radius-md, 0.75rem)",
                border: "none",
                backgroundColor: "var(--blue-600)",
                color: "#ffffff",
                fontWeight: "900",
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}
            >
              <LogIn size={18} />
              <span>الانتقال لتسجيل الدخول</span>
            </button>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(37, 99, 235, 0.15)",
                  color: "var(--blue-400)",
                  marginBottom: "0.75rem"
                }}
              >
                <GraduationCap size={26} />
              </div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: "900", margin: "0 0 0.35rem 0" }}>
                {tab === "register" ? "إنشاء حساب طالب جديد 🎓" : "مرحباً بعودتك! 👋"}
              </h2>
              <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", margin: 0 }}>
                {tab === "register"
                  ? "سجل حسابك مجاناً لمتابعة تقدمك وتخصيص تجربة التعلم"
                  : "سجل دخولك لمتابعة دروسك ومكتسباتك المنجزة"}
              </p>
            </div>

            {/* Tab Switcher */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.4rem",
                padding: "0.3rem",
                backgroundColor: "rgba(0, 0, 0, 0.25)",
                borderRadius: "var(--radius-md, 0.75rem)",
                marginBottom: "1.25rem"
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setError(null);
                }}
                style={{
                  padding: "0.6rem",
                  borderRadius: "var(--radius-sm, 0.5rem)",
                  border: "none",
                  backgroundColor: tab === "register" ? "var(--blue-600)" : "transparent",
                  color: tab === "register" ? "#ffffff" : "var(--text-secondary)",
                  fontWeight: "800",
                  fontSize: "0.86rem",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                إنشاء حساب جديد
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setError(null);
                }}
                style={{
                  padding: "0.6rem",
                  borderRadius: "var(--radius-sm, 0.5rem)",
                  border: "none",
                  backgroundColor: tab === "login" ? "var(--blue-600)" : "transparent",
                  color: tab === "login" ? "#ffffff" : "var(--text-secondary)",
                  fontWeight: "800",
                  fontSize: "0.86rem",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                تسجيل الدخول
              </button>
            </div>

            {error && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor: "rgba(248, 113, 113, 0.15)",
                  border: "1px solid rgba(248, 113, 113, 0.3)",
                  borderRadius: "var(--radius-md, 0.5rem)",
                  color: "#f87171",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                  fontWeight: "700"
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {tab === "register" && (
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "800", marginBottom: "0.35rem" }}>
                    اسم الطالب / اللقب
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      required
                      placeholder="مثال: أمين بن علي"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.7rem 0.9rem 0.7rem 2.5rem",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md, 0.5rem)",
                        color: "var(--text-primary)",
                        fontSize: "0.9rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <User size={18} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "800", marginBottom: "0.35rem" }}>
                  البريد الإلكتروني
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.9rem 0.7rem 2.5rem",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md, 0.5rem)",
                      color: "var(--text-primary)",
                      fontSize: "0.9rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <Mail size={18} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "800", marginBottom: "0.35rem" }}>
                  كلمة المرور
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.9rem 0.7rem 2.5rem",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md, 0.5rem)",
                      color: "var(--text-primary)",
                      fontSize: "0.9rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <Lock size={18} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                </div>
              </div>

              {tab === "register" && (
                <>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "800", marginBottom: "0.35rem" }}>
                      الشعبة الدراسية 📚
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value as AcademicBranch)}
                      style={{
                        width: "100%",
                        padding: "0.7rem 0.9rem",
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md, 0.5rem)",
                        color: "var(--text-primary)",
                        fontSize: "0.88rem",
                        cursor: "pointer",
                        boxSizing: "border-box"
                      }}
                    >
                      {Object.entries(branchLabels).map(([key, label]) => (
                        <option key={key} value={key} style={{ backgroundColor: "#1c2736", color: "#ffffff" }}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "800", marginBottom: "0.35rem" }}>
                      المستوى الحالي المعين ذاتياً 🎯
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                      {(["intelligent", "mid", "poor"] as AcademicLevel[]).map((lvl) => {
                        const info = levelLabels[lvl];
                        const isSelected = level === lvl;
                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setLevel(lvl)}
                            style={{
                              padding: "0.6rem 0.3rem",
                              borderRadius: "var(--radius-sm, 0.5rem)",
                              border: isSelected ? `1.5px solid ${info.color}` : "1px solid var(--border)",
                              backgroundColor: isSelected ? "rgba(56, 189, 248, 0.12)" : "rgba(0, 0, 0, 0.2)",
                              color: isSelected ? info.color : "var(--text-secondary)",
                              fontSize: "0.78rem",
                              fontWeight: "800",
                              cursor: "pointer",
                              textAlign: "center"
                            }}
                          >
                            {info.badge}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.85rem",
                  borderRadius: "var(--radius-md, 0.75rem)",
                  border: "none",
                  backgroundColor: "var(--blue-600)",
                  color: "#ffffff",
                  fontWeight: "900",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: "0 4px 15px rgba(37, 99, 235, 0.3)"
                }}
              >
                {isSubmitting ? (
                  <span>جاري التحميل...</span>
                ) : tab === "register" ? (
                  <>
                    <UserPlus size={18} />
                    <span>إنشاء الحساب</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>تسجيل الدخول</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}


