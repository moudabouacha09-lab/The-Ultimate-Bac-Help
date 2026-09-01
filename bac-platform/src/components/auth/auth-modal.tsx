// src/components/auth/auth-modal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { AcademicBranch, AcademicLevel, branchLabels, levelLabels } from "@/lib/auth-types";
import { X, Mail, Lock, User, LogIn, UserPlus, CheckCircle2, GraduationCap, Eye, EyeOff } from "lucide-react";

export function AuthModal() {
  const { isModalOpen, closeAuthModal, authMode, login, register } = useAuth();
  const [tab, setTab] = useState<"login" | "register">(authMode);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [branch, setBranch] = useState<AcademicBranch>("experimental-science");
  const [level, setLevel] = useState<AcademicLevel>("mid");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    if (!isModalOpen) {
      setRegistrationSuccess(false);
      setNeedsConfirmation(false);
      setError(null);
    }
  }, [isModalOpen]);

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
        } else {
          setRegistrationSuccess(true);
          if (res.needsEmailConfirmation) setNeedsConfirmation(true);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"
      onClick={closeAuthModal}
    >
      <div
        className="w-full max-w-md bg-surface-bright border border-primary/10 rounded-xl shadow-xl p-6 md:p-8 text-on-surface maxHeight-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 left-4 p-1.5 text-on-surface-variant hover:text-primary rounded-full transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X size={20} />
        </button>

        {needsConfirmation ? (
          /* Step 8: Email Confirmation State */
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <Mail size={32} />
            </div>
            <h2 className="font-headline text-headline-md text-primary font-bold mb-2">
              تحقق من بريدك الإلكتروني! 📩
            </h2>
            <p className="font-body text-body-md text-on-surface-variant leading-relaxed mb-6">
              تم إرسال رابط تأكيد الحساب إلى:
              <br />
              <strong className="text-primary font-bold">{email}</strong>
              <br />
              يرجى فتح صندوق البريد والنقر على رابط التأكيد لتفعيل حسابك، ثم تسجيل الدخول.
            </p>

            <button
              type="button"
              onClick={() => {
                setNeedsConfirmation(false);
                setRegistrationSuccess(false);
                setTab("login");
                setError(null);
              }}
              className="w-full bg-primary text-on-primary font-body text-label-md rounded-lg py-3 hover:bg-primary/90 transition-colors shadow-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn size={18} />
              <span>الانتقال لتسجيل الدخول</span>
            </button>
          </div>
        ) : registrationSuccess ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="font-headline text-headline-md text-primary font-bold mb-2">
              تم إنشاء حسابك بنجاح 🎉
            </h2>
            <p className="font-body text-body-md text-on-surface-variant mb-6">
              مرحباً بك في منصة البكالوريا! يمكنك الآن متابعة دروسك وحفظ نتائجك.
            </p>
            <button
              type="button"
              onClick={closeAuthModal}
              className="w-full bg-primary text-on-primary font-body text-label-md rounded-lg py-3 hover:bg-primary/90 transition-colors shadow-sm font-medium cursor-pointer"
            >
              متابعة المراجعة
            </button>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                <GraduationCap size={26} />
              </div>
              <h2 className="font-headline text-headline-md text-primary font-bold mb-1">
                {tab === "register" ? "إنشاء حساب جديد 🎓" : "مرحباً بعودتك 👋"}
              </h2>
              <p className="font-body text-body-md text-on-surface-variant">
                {tab === "register"
                  ? "انضم إلينا وابدأ رحلة التفوق الأكاديمي"
                  : "سجل دخولك لمتابعة دروسك ومكتسباتك"}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-surface-container rounded-lg mb-6">
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setError(null);
                  setRegistrationSuccess(false);
                  setNeedsConfirmation(false);
                }}
                className={`py-2 rounded-md font-body text-label-md transition-all cursor-pointer ${
                  tab === "register"
                    ? "bg-surface-bright text-primary font-bold shadow-sm"
                    : "text-on-surface-variant hover:text-primary font-medium"
                }`}
              >
                إنشاء حساب جديد
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setError(null);
                  setRegistrationSuccess(false);
                  setNeedsConfirmation(false);
                }}
                className={`py-2 rounded-md font-body text-label-md transition-all cursor-pointer ${
                  tab === "login"
                    ? "bg-surface-bright text-primary font-bold shadow-sm"
                    : "text-on-surface-variant hover:text-primary font-medium"
                }`}
              >
                تسجيل الدخول
              </button>
            </div>

            {error && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-caption font-semibold mb-4 text-center">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {tab === "register" && (
                <div>
                  <label className="block font-body text-label-md text-on-surface mb-1 text-right font-medium">
                    الاسم الكامل
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="مثال: أمين بن علي"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-3 py-2.5 pr-10 text-on-surface font-body text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                    <User size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-body text-label-md text-on-surface mb-1 text-right font-medium">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-3 py-2.5 pr-10 text-on-surface font-body text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                  <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                </div>
              </div>

              <div>
                <label className="block font-body text-label-md text-on-surface mb-1 text-right font-medium">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-3 py-2.5 pr-10 pl-10 text-on-surface font-body text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                  <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {tab === "register" && (
                <>
                  <div>
                    <label className="block font-body text-label-md text-on-surface mb-1 text-right font-medium">
                      الشعبة الدراسية 📚
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value as AcademicBranch)}
                      className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-3 py-2.5 text-on-surface font-body text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
                    >
                      {Object.entries(branchLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-body text-label-md text-on-surface mb-1 text-right font-medium">
                      المستوى الحالي المعين ذاتياً 🎯
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["intelligent", "mid", "poor"] as AcademicLevel[]).map((lvl) => {
                        const info = levelLabels[lvl];
                        const isSelected = level === lvl;
                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setLevel(lvl)}
                            className={`p-2 rounded-lg border text-caption font-semibold text-center cursor-pointer transition-colors ${
                              isSelected
                                ? "border-primary bg-primary/10 text-primary font-bold"
                                : "border-primary/20 bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                            }`}
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
                className="w-full bg-primary text-on-primary font-body text-label-md rounded-lg py-3 mt-2 hover:bg-primary/90 transition-colors shadow-sm font-medium flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

