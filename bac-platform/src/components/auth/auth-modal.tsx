// src/components/auth/auth-modal.tsx
"use client";

import React, { useState, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import { AcademicBranch, AcademicLevel, branchLabels, levelLabels } from "@/lib/auth-types";
import { GoogleAccountChooserModal } from "./google-chooser-modal";
import { X, Mail, Lock, User, Sparkles, LogIn, UserPlus, CheckCircle2, GraduationCap, KeyRound, RefreshCw, ArrowRight } from "lucide-react";

export function AuthModal() {
  const { isModalOpen, closeAuthModal, authMode, login, register } = useAuth();
  const [tab, setTab] = useState<"login" | "register">(authMode);

  // Form Step: 1 = Initial Info, 2 = 6-Digit OTP Verification
  const [step, setStep] = useState<1 | 2>(1);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState<AcademicBranch>("experimental-science");
  const [level, setLevel] = useState<AcademicLevel>("mid");

  // 6-digit OTP state
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  // Google Chooser Modal State
  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const digitRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  if (!isModalOpen) return null;

  const sendOTPCode = async (targetEmail: string) => {
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail })
      });
      const data = await res.json();
      if (data.success) {
        setOtpMessage(data.message || `تم إرسال رمز التحقق الـ 6 أرقام إلى ${targetEmail}`);
        if (data.devCode) setDevCode(data.devCode);
        return true;
      } else {
        setError(data.error || "فشل إرسال رمز التحقق");
        return false;
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالسيرفر لإرسال الرمز");
      return false;
    }
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (tab === "login") {
        const res = await login(email, password);
        if (!res.success) setError(res.error || "فشل تسجيل الدخول");
      } else {
        // Registration: Send 6-digit OTP code & advance to Step 2
        const sent = await sendOTPCode(email);
        if (sent) {
          setStep(2);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-focus next box
    if (value && index < 5) {
      digitRefs[index + 1].current?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      digitRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOTPAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const fullCode = otpDigits.join("");
    if (fullCode.length !== 6) {
      setError("الرجاء إدخال الرمز المكون من 6 أرقام كاملاً");
      return;
    }

    setIsSubmitting(true);
    try {
      // Verify OTP code
      const verifyRes = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode })
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        setError(verifyData.error || "رمز التفعيل الـ 6 أرقام غير صحيح");
        return;
      }

      // OTP Verified! Complete registration
      const regRes = await register({
        username: username || email.split("@")[0],
        email,
        password,
        branch,
        level
      });

      if (!regRes.success) {
        setError(regRes.error || "فشل إنشاء الحساب بعد التفعيل");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAccountSelected = async (googleUser: { name: string; email: string }) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await register({
        username: googleUser.name,
        email: googleUser.email,
        branch,
        level,
        isGoogle: true
      });
      if (!res.success) setError(res.error || "فشل تسجيل الدخول بـ Google");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Real Google Account Chooser Modal */}
      <GoogleAccountChooserModal
        isOpen={isGoogleChooserOpen}
        onClose={() => setIsGoogleChooserOpen(false)}
        onSelectAccount={handleGoogleAccountSelected}
      />

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
              {step === 2 ? <KeyRound size={26} color="#38bdf8" /> : <GraduationCap size={26} />}
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: "900", margin: "0 0 0.35rem 0" }}>
              {step === 2
                ? "تأكيد بريدك الإلكتروني 🔑"
                : tab === "register"
                ? "إنشاء حساب طالب جديد 🎓"
                : "مرحباً بعودتك! 👋"}
            </h2>
            <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", margin: 0 }}>
              {step === 2
                ? `أدخل رمز التحقق المكون من 6 أرقام المرسل إلى ${email}`
                : tab === "register"
                ? "سجل حسابك مجاناً لمتابعة تقدمك وتخصيص تجربة التعلم"
                : "سجل دخولك لمتابعة دروسك ومكتسباتك المنجزة"}
            </p>
          </div>

          {step === 1 && (
            <>
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

              {/* Real Google Login Button */}
              <button
                type="button"
                onClick={() => setIsGoogleChooserOpen(true)}
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  padding: "0.75rem",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md, 0.75rem)",
                  color: "var(--text-primary)",
                  fontWeight: "800",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  marginBottom: "1.25rem",
                  transition: "all 0.2s ease"
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>المتابعة باستخدام Google</span>
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.25rem",
                  color: "var(--text-muted)",
                  fontSize: "0.78rem"
                }}
              >
                <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }} />
                <span>أو عبر البريد الإلكتروني</span>
                <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }} />
              </div>
            </>
          )}

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

          {step === 1 ? (
            <form onSubmit={handleInitialSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                {tab === "register" ? (
                  <>
                    <Mail size={18} />
                    <span>إرسال رمز التفعيل الـ 6 أرقام</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>دخول المنصة</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: 6-Digit OTP Verification Screen */
            <form onSubmit={handleVerifyOTPAndRegister} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {otpMessage && (
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    backgroundColor: "rgba(56, 189, 248, 0.12)",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    borderRadius: "var(--radius-md, 0.5rem)",
                    color: "var(--accent-cyan)",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    textAlign: "center"
                  }}
                >
                  📩 {otpMessage}
                </div>
              )}

              {devCode && (
                <div
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "rgba(34, 197, 94, 0.15)",
                    border: "1px dashed #22c55e",
                    borderRadius: "0.5rem",
                    color: "#22c55e",
                    fontSize: "0.82rem",
                    fontWeight: "900",
                    textAlign: "center"
                  }}
                >
                  ✨ رمز التجربة السريع للتحقق: <strong style={{ letterSpacing: "3px", fontSize: "1.1rem" }}>{devCode}</strong>
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.86rem", fontWeight: "800", marginBottom: "0.75rem", textAlign: "center" }}>
                  أدخل رمز التفعيل المكون من 6 أرقام:
                </label>

                {/* 6 Individual Digit Inputs */}
                <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", direction: "ltr" }}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={digitRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                      style={{
                        width: "44px",
                        height: "50px",
                        borderRadius: "0.6rem",
                        border: digit ? "2px solid var(--accent-cyan)" : "1.5px solid var(--border-strong)",
                        backgroundColor: "rgba(0, 0, 0, 0.35)",
                        color: "#ffffff",
                        fontSize: "1.4rem",
                        fontWeight: "900",
                        textAlign: "center",
                        outline: "none"
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.82rem" }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontWeight: "700"
                  }}
                >
                  <ArrowRight size={14} />
                  <span>تعديل البريد</span>
                </button>

                <button
                  type="button"
                  onClick={() => sendOTPCode(email)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--blue-400)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontWeight: "800"
                  }}
                >
                  <RefreshCw size={14} />
                  <span>إعادة إرسال الرمز الـ 6 أرقام</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
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
                <CheckCircle2 size={18} />
                <span>تأكيد وإنشاء الحساب</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

