// src/components/auth/user-menu.tsx
"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { branchLabels, levelLabels, AcademicLevel } from "@/lib/auth-types";
import { User, LogOut, ChevronDown, Sparkles, LogIn, Check } from "lucide-react";

export function UserMenu() {
  const { user, openAuthModal, logout, updateProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return (
      <button
        onClick={() => openAuthModal("register")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.45rem 0.9rem",
          backgroundColor: "rgba(37, 99, 235, 0.15)",
          border: "1px solid rgba(59, 130, 246, 0.35)",
          borderRadius: "999px",
          color: "var(--accent-cyan, #38bdf8)",
          fontSize: "0.82rem",
          fontWeight: "800",
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          transition: "all 0.2s ease"
        }}
      >
        <LogIn size={15} />
        <span>تسجيل الدخول</span>
      </button>
    );
  }

  const levelInfo = levelLabels[user.level] || levelLabels["mid"];
  const branchName = branchLabels[user.branch] || user.branch;

  const handleLevelChange = async (newLevel: AcademicLevel) => {
    await updateProfile({ level: newLevel });
    setIsOpen(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.6rem",
          padding: "0.4rem 0.85rem",
          backgroundColor: "var(--surface-glass, rgba(20, 28, 38, 0.65))",
          border: "1px solid var(--border-strong, rgba(255, 255, 255, 0.18))",
          borderRadius: "999px",
          color: "var(--text-primary)",
          fontSize: "0.84rem",
          fontWeight: "800",
          cursor: "pointer",
          backdropFilter: "blur(12px)"
        }}
      >
        <div
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            backgroundColor: "var(--blue-600)",
            color: "#ffffff",
            display: "grid",
            placeItems: "center",
            fontSize: "0.75rem",
            fontWeight: "900"
          }}
        >
          {user.username.charAt(0).toUpperCase()}
        </div>
        <span>{user.username}</span>
        <span
          style={{
            fontSize: "0.72rem",
            padding: "0.1rem 0.45rem",
            borderRadius: "999px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            color: levelInfo.color
          }}
        >
          {levelInfo.badge}
        </span>
        <ChevronDown size={14} style={{ opacity: 0.7 }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 0.5rem)",
            left: 0,
            zIndex: 999,
            width: "240px",
            backgroundColor: "var(--ocean-900, #141c26)",
            border: "1.5px solid var(--border-strong, rgba(255, 255, 255, 0.18))",
            borderRadius: "var(--radius-lg, 1rem)",
            boxShadow: "0 16px 36px rgba(0, 0, 0, 0.5)",
            padding: "0.75rem",
            backdropFilter: "blur(16px)"
          }}
        >
          <div style={{ paddingBottom: "0.5rem", marginBottom: "0.5rem", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: "0.88rem", fontWeight: "900", color: "var(--text-primary)" }}>{user.username}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>{user.email}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", marginTop: "0.35rem", fontWeight: "700" }}>
              {branchName}
            </div>
          </div>

          {/* Quick Level Switcher */}
          <div style={{ marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: "800", color: "var(--text-muted)", marginBottom: "0.35rem" }}>
              تغيير المستوى الدراسي الحالي:
            </div>
            {(["intelligent", "mid", "poor"] as AcademicLevel[]).map((lvl) => {
              const info = levelLabels[lvl];
              const active = user.level === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => handleLevelChange(lvl)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.4rem 0.6rem",
                    borderRadius: "var(--radius-sm, 0.5rem)",
                    border: "none",
                    backgroundColor: active ? "rgba(37, 99, 235, 0.18)" : "transparent",
                    color: active ? info.color : "var(--text-secondary)",
                    fontSize: "0.78rem",
                    fontWeight: "800",
                    cursor: "pointer",
                    marginBottom: "0.2rem"
                  }}
                >
                  <span>{info.label}</span>
                  {active && <Check size={14} color={info.color} />}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 0.6rem",
              borderRadius: "var(--radius-sm, 0.5rem)",
              border: "none",
              backgroundColor: "rgba(248, 113, 113, 0.12)",
              color: "#f87171",
              fontSize: "0.82rem",
              fontWeight: "800",
              cursor: "pointer"
            }}
          >
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}
    </div>
  );
}
