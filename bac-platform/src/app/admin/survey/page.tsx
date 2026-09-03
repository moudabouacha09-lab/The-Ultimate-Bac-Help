// src/app/admin/survey/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/context/auth-context";
import { createClient } from "@/lib/supabase/client";
import { ShieldAlert, BarChart2, ArrowRight, RefreshCw } from "lucide-react";

interface Vote {
  id: number;
  username: string;
  branch: string;
  target_grade: number | null;
  created_at: string;
}

export default function AdminSurveyPage() {
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVotes = useCallback(async () => {
    if (!user || user.role !== "admin") return;
    setLoading(true);
    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("votes")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setVotes(data || []);
    } catch (err: any) {
      console.error("Error loading survey votes:", err);
      setError("تعذر تحميل بيانات الاستطلاع.");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      loadVotes();
    }
  }, [authLoading, user, loadVotes]);

  if (authLoading) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-block w-8 h-8 border-3 border-slate-400 border-t-slate-800 rounded-full animate-spin mb-4" />
          <p className="text-slate-600 font-mono text-sm">جاري التحقق من الصلاحيات...</p>
        </div>
      </AppShell>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <AppShell>
        <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">صلاحيات المسؤول مطلوبة</h1>
          <p className="text-slate-600 text-sm">
            هذه الصفحة مخصصة للمسؤولين فقط.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-slate-800 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-slate-700 transition-colors"
            >
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  // Statistics Calculation
  const totalVotes = votes.length;
  const validGrades = votes.filter((v) => v.target_grade !== null);
  const avgGrade = validGrades.length
    ? (validGrades.reduce((acc, curr) => acc + (curr.target_grade || 0), 0) / validGrades.length).toFixed(2)
    : "—";

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6 font-sans text-slate-800 text-right">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/admin"
                className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 font-semibold"
              >
                <span>لوحة التحكم الرئيسية</span>
                <ArrowRight size={12} />
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 size={24} className="text-slate-700" />
              <span>إحصائيات استطلاع آراء الطلاب</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              استعراض نتائج التصويت ومعدلات الطموح وتوزيع الشعب لزوار المنصة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadVotes}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>تحديث البيانات</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-semibold block">إجمالي المشاركين في الاستطلاع</span>
            <strong className="text-2xl font-bold text-slate-900 block font-mono">{totalVotes}</strong>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-semibold block">متوسط معدل الطموح العام</span>
            <strong className="text-2xl font-bold text-emerald-700 block font-mono" dir="ltr">
              {avgGrade} / 20
            </strong>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-semibold block">المشاركات التي حددت معدل</span>
            <strong className="text-2xl font-bold text-blue-700 block font-mono">{validGrades.length}</strong>
          </div>
        </div>

        {/* Votes Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-sm">سجل إجابات الطلاب المفصل</h2>
            <span className="text-xs text-slate-500">عدد السجلات: {votes.length}</span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500 font-mono text-sm">
              جاري تحميل سجلات الاستطلاع...
            </div>
          ) : votes.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              لا توجد إجابات مسجلة بعد.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 text-xs border-b border-slate-200">
                    <th className="p-3.5 font-bold">اسم المستخدم / المعرف</th>
                    <th className="p-3.5 font-bold">الشعبة الدراسية</th>
                    <th className="p-3.5 font-bold">معدل الطموح</th>
                    <th className="p-3.5 font-bold">تاريخ المشاركة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {votes.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-mono text-slate-800 text-xs font-semibold">{v.username}</td>
                      <td className="p-3.5 font-semibold text-slate-800">{v.branch}</td>
                      <td className="p-3.5 font-mono text-xs font-bold text-emerald-700" dir="ltr">
                        {v.target_grade ? `${v.target_grade} / 20` : "—"}
                      </td>
                      <td className="p-3.5 text-xs text-slate-500">
                        {new Date(v.created_at).toLocaleString("ar-DZ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

