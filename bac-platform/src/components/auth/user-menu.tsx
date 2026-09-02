// src/components/auth/user-menu.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { branchLabels, levelLabels, AcademicLevel } from "@/lib/auth-types";
import { LogOut, ChevronDown, LogIn, Check, GraduationCap } from "lucide-react";

export function UserMenu() {
  const { user, openAuthModal, logout, updateProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return (
      <button
        onClick={() => openAuthModal("register")}
        className="flex items-center gap-2 bg-primary text-on-primary font-body text-label-md px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm cursor-pointer font-medium"
      >
        <LogIn size={16} />
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
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container border border-primary/10 rounded-lg text-on-surface font-body text-label-md cursor-pointer hover:bg-surface-container-high transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-primary text-on-primary grid place-items-center text-xs font-bold">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <span className="font-semibold">{user.username}</span>
        <span className="text-caption text-secondary font-medium px-2 py-0.5 rounded-full bg-secondary/10">
          {levelInfo.badge}
        </span>
        <ChevronDown size={14} className="opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+0.5rem)] left-0 z-[999] w-60 bg-surface-bright border border-primary/10 rounded-xl shadow-lg p-3 text-on-surface">
          <div className="pb-2 mb-2 border-b border-primary/10">
            <div className="text-label-md font-bold text-on-surface">{user.username}</div>
            <div className="text-caption text-on-surface-variant mt-0.5">{user.email}</div>
            <div className="text-caption text-primary mt-1 font-semibold">
              {branchName}
            </div>
          </div>

          {/* Quick Level Switcher */}
          <div className="mb-3">
            <div className="text-caption font-semibold text-on-surface-variant mb-1">
              تغيير المستوى الدراسي الحالي:
            </div>
            {(["intelligent", "mid", "poor"] as AcademicLevel[]).map((lvl) => {
              const info = levelLabels[lvl];
              const active = user.level === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => handleLevelChange(lvl)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border-none text-caption font-medium cursor-pointer mb-1 transition-colors ${
                    active
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                >
                  <span>{info.label}</span>
                  {active && <Check size={14} className="text-primary" />}
                </button>
              );
            })}
          </div>

          {/* Become Contributor Link for students */}
          {(!user.role || user.role === "student") && (
            <div className="mb-3 pt-2 border-t border-primary/10">
              <Link
                href="/contribute"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary text-caption font-semibold transition-colors"
              >
                <GraduationCap size={16} />
                <span>انضم إلى فريق المساهمين</span>
              </Link>
            </div>
          )}

          {/* Upload content link for teachers/admins */}
          {(user.role === "teacher" || user.role === "admin") && (
            <div className="mb-3 pt-2 border-t border-primary/10">
              <Link
                href="/contribute/upload-exam"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-secondary/5 hover:bg-secondary/10 text-secondary text-caption font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-base">upload_file</span>
                <span>رفع محتوى تعليمي</span>
              </Link>
            </div>
          )}


          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border-none bg-error/10 text-error text-caption font-bold cursor-pointer hover:bg-error/20 transition-colors"
          >
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}
    </div>
  );
}

