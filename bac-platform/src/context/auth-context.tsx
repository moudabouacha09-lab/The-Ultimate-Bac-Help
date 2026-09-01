// src/context/auth-context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { UserProfile, AcademicBranch, AcademicLevel } from "@/lib/auth-types";
import { createClient } from "@/lib/supabase/client";

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
  }) => Promise<{ success: boolean; error?: string; needsEmailConfirmation?: boolean }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<UserProfile, "branch" | "level" | "username" | "targetGrade">>) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");

  const supabase = createClient();

  const fetchUserProfile = async (userId: string, userEmail?: string, userMetadata?: any, createdAt?: string) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (profile) {
        return {
          id: profile.id,
          username: profile.full_name || userMetadata?.full_name || userEmail?.split("@")[0] || "طالب",
          email: profile.email || userEmail || "",
          branch: (profile.branch as AcademicBranch) || userMetadata?.branch || "experimental-science",
          level: (profile.level as AcademicLevel) || userMetadata?.level || "mid",
          targetGrade: profile.target_grade,
          createdAt: profile.created_at || createdAt || new Date().toISOString()
        };
      }

      return {
        id: userId,
        username: userMetadata?.full_name || userEmail?.split("@")[0] || "طالب",
        email: userEmail || "",
        branch: (userMetadata?.branch as AcademicBranch) || "experimental-science",
        level: (userMetadata?.level as AcademicLevel) || "mid",
        targetGrade: userMetadata?.target_grade,
        createdAt: createdAt || new Date().toISOString()
      };
    } catch (err) {
      console.error("Error fetching user profile:", err);
      return {
        id: userId,
        username: userMetadata?.full_name || userEmail?.split("@")[0] || "طالب",
        email: userEmail || "",
        branch: (userMetadata?.branch as AcademicBranch) || "experimental-science",
        level: (userMetadata?.level as AcademicLevel) || "mid",
        createdAt: createdAt || new Date().toISOString()
      };
    }
  };

  // Sync Supabase Auth Session
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (authUser && isMounted) {
          const profile = await fetchUserProfile(
            authUser.id,
            authUser.email,
            authUser.user_metadata,
            authUser.created_at
          );
          if (isMounted) setUser(profile);
        } else if (isMounted) {
          setUser(null);
        }
      } catch (err) {
        console.error("Supabase auth initialization error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchUserProfile(
          session.user.id,
          session.user.email,
          session.user.user_metadata,
          session.user.created_at
        );
        if (isMounted) setUser(profile);
      } else {
        if (isMounted) setUser(null);
      }
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const openAuthModal = (mode: "login" | "register" = "register") => {
    setAuthMode(mode);
    setIsModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsModalOpen(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = await fetchUserProfile(
          data.user.id,
          data.user.email,
          data.user.user_metadata,
          data.user.created_at
        );
        setUser(profile);
      }

      setIsModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "حدث خطأ أثناء تسجيل الدخول" };
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    password?: string;
    branch?: AcademicBranch;
    level?: AcademicLevel;
  }) => {
    try {
      if (!data.password) {
        return { success: false, error: "كلمة المرور مطلوبة" };
      }

      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          data: {
            full_name: data.username.trim(),
            branch: data.branch || "experimental-science",
            level: data.level || "mid"
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Check if session was returned or email confirmation is required
      const needsEmailConfirmation = !signUpData.session;

      if (signUpData.user && signUpData.session) {
        const profile = await fetchUserProfile(
          signUpData.user.id,
          signUpData.user.email,
          signUpData.user.user_metadata,
          signUpData.user.created_at
        );
        setUser(profile);
      }

      return { success: true, needsEmailConfirmation };
    } catch (err: any) {
      return { success: false, error: err?.message || "حدث خطأ أثناء إنشاء الحساب" };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const updateProfile = async (updates: Partial<Pick<UserProfile, "branch" | "level" | "username" | "targetGrade">>) => {
    if (!user) return false;
    try {
      // 1. Update Supabase auth user metadata
      await supabase.auth.updateUser({
        data: {
          full_name: updates.username ?? user.username,
          branch: updates.branch ?? user.branch,
          level: updates.level ?? user.level,
          target_grade: updates.targetGrade ?? user.targetGrade
        }
      });

      // 2. Update profiles table if it exists
      await supabase
        .from("profiles")
        .update({
          full_name: updates.username ?? user.username,
          branch: updates.branch ?? user.branch,
          level: updates.level ?? user.level,
          target_grade: updates.targetGrade ?? user.targetGrade,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      setUser((prev) =>
        prev
          ? {
              ...prev,
              username: updates.username ?? prev.username,
              branch: updates.branch ?? prev.branch,
              level: updates.level ?? prev.level,
              targetGrade: updates.targetGrade ?? prev.targetGrade
            }
          : null
      );

      return true;
    } catch (err) {
      console.error("Update profile error:", err);
      return false;
    }
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
