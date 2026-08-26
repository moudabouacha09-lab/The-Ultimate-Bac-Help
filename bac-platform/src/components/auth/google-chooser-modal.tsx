// src/components/auth/google-chooser-modal.tsx
"use client";

import React, { useState } from "react";
import { X, User, PlusCircle, ArrowLeft, Check, ShieldCheck } from "lucide-react";

type GoogleAccount = {
  name: string;
  email: string;
  avatar?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: { name: string; email: string }) => void;
};

const DEFAULT_GOOGLE_ACCOUNTS: GoogleAccount[] = [
  {
    name: "جمال الدين",
    email: "djameleddine19881@gmail.com"
  },
  {
    name: "معاذ بوعشة",
    email: "moudabouacha09@gmail.com"
  }
];

export function GoogleAccountChooserModal({ isOpen, onClose, onSelectAccount }: Props) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelect = (acc: GoogleAccount) => {
    onSelectAccount({ name: acc.name, email: acc.email });
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes("@")) {
      setError("الرجاء إدخال عنوان بريد Google Gmail حقيقي صالح");
      return;
    }
    const realName = customName.trim() || customEmail.split("@")[0];
    onSelectAccount({ name: realName, email: customEmail.trim().toLowerCase() });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)"
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          backgroundColor: "#202124",
          border: "1px solid #3c4043",
          borderRadius: "1.25rem",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.7)",
          padding: "2rem 1.75rem",
          color: "#e8eaed",
          fontFamily: "'Cairo', sans-serif, system-ui",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            left: "1.25rem",
            background: "none",
            border: "none",
            color: "#9aa0a6",
            cursor: "pointer"
          }}
        >
          <X size={20} />
        </button>

        {/* Google Header Logo */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <svg width="24" height="24" viewBox="0 0 24 24">
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
            <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#e8eaed" }}>تسجيل الدخول باستخدام Google</span>
          </div>

          <h3 style={{ fontSize: "1.35rem", fontWeight: "900", margin: "0.5rem 0 0.25rem 0" }}>
            اختيار حساب
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#9aa0a6", margin: 0 }}>
            للمتابعة إلى تطبيق <strong style={{ color: "#8ab4f8" }}>باك الجزائر</strong>
          </p>
        </div>

        {!showCustomInput ? (
          <>
            {/* List of Detected Google Accounts */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {DEFAULT_GOOGLE_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelect(acc)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.85rem 1rem",
                    backgroundColor: "#292a2d",
                    border: "1px solid #3c4043",
                    borderRadius: "0.75rem",
                    color: "#e8eaed",
                    cursor: "pointer",
                    textAlign: "right",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "#8ab4f8",
                      color: "#202124",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "1.1rem",
                      fontWeight: "900",
                      flexShrink: 0
                    }}
                  >
                    {acc.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: "800", color: "#e8eaed" }}>{acc.name}</div>
                    <div style={{ fontSize: "0.82rem", color: "#9aa0a6", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {acc.email}
                    </div>
                  </div>
                </button>
              ))}

              {/* Use another Google Account */}
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.85rem 1rem",
                  backgroundColor: "transparent",
                  border: "1px dashed #5f6368",
                  borderRadius: "0.75rem",
                  color: "#8ab4f8",
                  cursor: "pointer",
                  textAlign: "right",
                  fontWeight: "800",
                  fontSize: "0.88rem",
                  marginTop: "0.25rem"
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(138, 180, 248, 0.15)",
                    display: "grid",
                    placeItems: "center"
                  }}
                >
                  <PlusCircle size={20} color="#8ab4f8" />
                </div>
                <span>استخدام حساب Google آخر...</span>
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleCustomSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", color: "#9aa0a6", marginBottom: "0.35rem" }}>
                اسم صاحب حساب Google
              </label>
              <input
                type="text"
                required
                placeholder="مثال: جمال الدين"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  backgroundColor: "#292a2d",
                  border: "1px solid #5f6368",
                  borderRadius: "0.5rem",
                  color: "#e8eaed",
                  fontSize: "0.9rem",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", color: "#9aa0a6", marginBottom: "0.35rem" }}>
                عنوان بريد Google الإلكتروني (Gmail)
              </label>
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  backgroundColor: "#292a2d",
                  border: "1px solid #5f6368",
                  borderRadius: "0.5rem",
                  color: "#e8eaed",
                  fontSize: "0.9rem",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {error && (
              <div style={{ color: "#f28b82", fontSize: "0.82rem", fontWeight: "700" }}>⚠️ {error}</div>
            )}

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setShowCustomInput(false)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  backgroundColor: "transparent",
                  border: "1px solid #5f6368",
                  borderRadius: "0.5rem",
                  color: "#e8eaed",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                رجوع
              </button>
              <button
                type="submit"
                style={{
                  flex: 2,
                  padding: "0.75rem",
                  backgroundColor: "#8ab4f8",
                  border: "none",
                  borderRadius: "0.5rem",
                  color: "#202124",
                  fontWeight: "900",
                  fontSize: "0.9rem",
                  cursor: "pointer"
                }}
              >
                متابعة والتسجيل
              </button>
            </div>
          </form>
        )}

        <div style={{ fontSize: "0.75rem", color: "#9aa0a6", marginTop: "1.5rem", textAlign: "center", lineHeight: 1.5 }}>
          قبل استخدام هذا التطبيق، يمكنك مراجعه سياسة الخصوصية وبنود الخدمة في منصة باك الجزائر.
        </div>
      </div>
    </div>
  );
}
