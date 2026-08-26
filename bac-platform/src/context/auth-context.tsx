// src/context/auth-context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { UserProfile, AcademicBranch, AcademicLevel } from "@/lib/auth-types";

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  isModalOpen: boolean;
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  authMode: "login" | "register";
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    username: string;
    email: string;
    password?: string;
    branch?: AcademicBranch;
    level?: AcademicLevel;
    isGoogle?: boolean;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<UserProfile, "branch" | "level" | "username" | "targetGrade">>) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "bac_user_session_v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setUser(parsed);
          // Refresh profile in background
          fetch("/api/auth/me", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: parsed.email })
          })
            .then((r) => r.json())
            .then((data) => {
              if (data.success && data.profile) {
                setUser(data.profile);
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.profile));
              }
            })
            .catch(() => {});
        }
      }
    } catch (e) {
      console.error("Session restore error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSession = (profile: UserProfile | null) => {
    setUser(profile);
    if (profile) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const openAuthModal = (mode: "login" | "register" = "register") => {
    setAuthMode(mode);
    setIsModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsModalOpen(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.profile) {
        saveSession(data.profile);
        setIsModalOpen(false);
        return { success: true };
      }
      return { success: false, error: data.error || "فشل تسجيل الدخول" };
    } catch (err) {
      return { success: false, error: "حدث خطأ في الاتصال بالخادم" };
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    password?: string;
    branch?: AcademicBranch;
    level?: AcademicLevel;
    isGoogle?: boolean;
  }) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success && resData.profile) {
        saveSession(resData.profile);
        setIsModalOpen(false);
        return { success: true };
      }
      return { success: false, error: resData.error || "فشل إنشاء الحساب" };
    } catch (err) {
      return { success: false, error: "حدث خطأ في الاتصال بالخادم" };
    }
  };

  const logout = () => {
    saveSession(null);
  };

  const updateProfile = async (updates: Partial<Pick<UserProfile, "branch" | "level" | "username" | "targetGrade">>) => {
    if (!user) return false;
    try {
      const res = await fetch("/api/auth/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, updates })
      });
      const data = await res.json();
      if (data.success && data.profile) {
        saveSession(data.profile);
        return true;
      }
    } catch (err) {
      console.error("Update profile error:", err);
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isModalOpen,
        openAuthModal,
        closeAuthModal,
        authMode,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
