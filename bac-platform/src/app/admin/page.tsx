// src/app/admin/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/context/auth-context";
import { createClient } from "@/lib/supabase/client";
import { subjects } from "@/lib/subjects";
import {
  ShieldAlert,
  UserCheck,
  FileText,
  BookOpen,
  CheckCircle2,
  XCircle,
  Eye,
  ExternalLink,
  Clock,
  RefreshCw,
  AlertCircle,
  BarChart2,
  Search,
  Filter,
  Megaphone,
} from "lucide-react";

type ContributorApplication = {
  id: string;
  created_at: string;
  user_id: string;
  full_name: string;
  role_requested: "teacher" | "inspector";
  subjects: string[];
  institution: string;
  wilaya: string | null;
  years_experience: number | null;
  proof_file_path: string | null;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  profiles?: {
    email?: string;
    full_name?: string;
  };
};

type PendingExam = {
  id: string;
  created_at: string;
  created_by: string;
  title: string;
  subject_slug: string;
  type: string;
  units: string[] | null;
  corrige_status: string;
  exam_file_path: string;
  corrige_file_path: string | null;
  status: "pending" | "approved" | "rejected";
  authorName?: string;
};

type PendingLesson = {
  id: string;
  created_at: string;
  created_by: string;
  title: string;
  subject_slug: string;
  units: string[] | null;
  file_path: string;
  status: "pending" | "approved" | "rejected";
  authorName?: string;
};

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<"applications" | "exams" | "lessons" | "announcement">("applications");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Data lists
  const [applications, setApplications] = useState<ContributorApplication[]>([]);
  const [exams, setExams] = useState<PendingExam[]>([]);
  const [lessons, setLessons] = useState<PendingLesson[]>([]);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementBody, setAnnouncementBody] = useState("");
  const [announcementSending, setAnnouncementSending] = useState(false);

  // Approval Modal State for Applications
  const [selectedApp, setSelectedApp] = useState<ContributorApplication | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Load all admin pending items
  const loadAdminData = useCallback(async () => {
    if (!user || user.role !== "admin") return;
    setLoading(true);
    setFeedback(null);

    try {
      // 1. Fetch pending applications
      const { data: appsData, error: appsError } = await supabase
        .from("contributor_applications")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (appsError) console.error("Error loading applications:", appsError);
      setApplications(appsData || []);

      // 2. Fetch pending exams
      const { data: examsData, error: examsError } = await supabase
        .from("exams")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (examsError) console.error("Error loading exams:", examsError);

      // 3. Fetch pending lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (lessonsError) console.error("Error loading lessons:", lessonsError);

      // Fetch profiles for author names
      const allUserIds = [
        ...new Set([
          ...(examsData?.map((e) => e.created_by) || []),
          ...(lessonsData?.map((l) => l.created_by) || []),
        ]),
      ].filter(Boolean);

      let profilesMap: Record<string, string> = {};
      if (allUserIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, title")
          .in("id", allUserIds);

        if (profiles) {
          profiles.forEach((p) => {
            profilesMap[p.id] = p.title || p.full_name || "مستخدم";
          });
        }
      }

      setExams(
        (examsData || []).map((e) => ({
          ...e,
          authorName: profilesMap[e.created_by] || "أستاذ معتمد",
        }))
      );

      setLessons(
        (lessonsData || []).map((l) => ({
          ...l,
          authorName: profilesMap[l.created_by] || "أستاذ معتمد",
        }))
      );
    } catch (err: any) {
      console.error("Unexpected error in loadAdminData:", err);
      setFeedback({ type: "error", message: "حدث خطأ أثناء تحميل البيانات" });
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      loadAdminData();
    }
  }, [authLoading, user, loadAdminData]);

  // Open Proof File Signed URL
  const handleOpenProof = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("contributor-proofs")
        .createSignedUrl(path, 3600);

      if (error || !data?.signedUrl) {
        alert("فشل إنشاء رابط آمن لمعاينة الملف");
        return;
      }
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء فتح الملف");
    }
  };

  // Open Storage File (Exam or Lesson)
  const handleOpenFile = async (bucket: string, path: string) => {
    try {
      if (path.startsWith("http")) {
        window.open(path, "_blank", "noopener,noreferrer");
        return;
      }
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 3600);

      if (error || !data?.signedUrl) {
        // Fallback to getPublicUrl
        const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(path);
        if (pubData?.publicUrl) {
          window.open(pubData.publicUrl, "_blank", "noopener,noreferrer");
          return;
        }
        alert("تعذر فتح الملف");
        return;
      }
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء فتح الملف");
    }
  };

  // Approve Contributor Application modal trigger
  const handleInitiateApproveApp = (app: ContributorApplication) => {
    setSelectedApp(app);
    const roleLabel = app.role_requested === "inspector" ? "مفتش تربية وطنية" : "أستاذ";
    const subjectsLabel = app.subjects?.length ? app.subjects.join("، ") : "التعليم الثانوي";
    setEditingTitle(`${roleLabel} - ${subjectsLabel}`);
  };

  // Confirm Application Approval (Atomic update: application + profile)
  const handleConfirmApproveApp = async () => {
    if (!selectedApp) return;
    setActionLoading(selectedApp.id);
    setFeedback(null);

    try {
      const finalTitle = editingTitle.trim() || "أستاذ معتمد";

      // 1. Update contributor_applications
      const { error: appError } = await supabase
        .from("contributor_applications")
        .update({ status: "approved" })
        .eq("id", selectedApp.id);

      if (appError) throw new Error(`فشل تحديث حالة الطلب: ${appError.message}`);

      // 2. Update user profile role and title
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          role: "teacher",
          title: finalTitle,
        })
        .eq("id", selectedApp.user_id);

      if (profileError) throw new Error(`فشل تحديث ملف الأستاذ: ${profileError.message}`);

      setFeedback({
        type: "success",
        message: `تمت الموافقة بنجاح على طلب ${selectedApp.full_name} وتعيين الصفة (${finalTitle}).`,
      });

      setSelectedApp(null);
      setApplications((prev) => prev.filter((a) => a.id !== selectedApp.id));
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "حدث خطأ أثناء الموافقة" });
    } finally {
      setActionLoading(null);
    }
  };

  // Reject Application
  const handleRejectApp = async (appId: string) => {
    if (!confirm("هل أنت متأكد من رفض هذا الطلب؟")) return;
    setActionLoading(appId);
    setFeedback(null);

    try {
      const { error } = await supabase
        .from("contributor_applications")
        .update({ status: "rejected" })
        .eq("id", appId);

      if (error) throw error;

      setFeedback({ type: "success", message: "تم رفض الطلب." });
      setApplications((prev) => prev.filter((a) => a.id !== appId));
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "فشل رفض الطلب" });
    } finally {
      setActionLoading(null);
    }
  };

  // Exam Actions
  const handleApproveExam = async (examId: string) => {
    setActionLoading(examId);
    setFeedback(null);
    try {
      const { error } = await supabase
        .from("exams")
        .update({ status: "approved" })
        .eq("id", examId);

      if (error) throw error;

      setFeedback({ type: "success", message: "تمت الموافقة على نشر الامتحان بنجاح." });
      setExams((prev) => prev.filter((e) => e.id !== examId));
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "فشل اعتماد الامتحان" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectExam = async (examId: string) => {
    if (!confirm("هل تريد بالتأكيد رفض هذا الامتحان؟")) return;
    setActionLoading(examId);
    setFeedback(null);
    try {
      const { error } = await supabase
        .from("exams")
        .update({ status: "rejected" })
        .eq("id", examId);

      if (error) throw error;

      setFeedback({ type: "success", message: "تم رفض الامتحان." });
      setExams((prev) => prev.filter((e) => e.id !== examId));
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "فشل رفض الامتحان" });
    } finally {
      setActionLoading(null);
    }
  };

  // Lesson Actions
  const handleApproveLesson = async (lessonId: string) => {
    setActionLoading(lessonId);
    setFeedback(null);
    try {
      const { error } = await supabase
        .from("lessons")
        .update({ status: "approved" })
        .eq("id", lessonId);

      if (error) throw error;

      setFeedback({ type: "success", message: "تمت الموافقة على نشر الدرس في مكتبة المواد بنجاح." });
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "فشل اعتماد الدرس" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectLesson = async (lessonId: string) => {
    if (!confirm("هل تريد بالتأكيد رفض هذا الدرس؟")) return;
    setActionLoading(lessonId);
    setFeedback(null);
    try {
      const { error } = await supabase
        .from("lessons")
        .update({ status: "rejected" })
        .eq("id", lessonId);

      if (error) throw error;

      setFeedback({ type: "success", message: "تم رفض الدرس." });
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "فشل رفض الدرس" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendAnnouncement = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!announcementTitle.trim() || !announcementBody.trim()) return;
    setAnnouncementSending(true);
    setFeedback(null);
    const { error } = await supabase.rpc("send_announcement", {
      p_title: announcementTitle.trim(),
      p_body: announcementBody.trim(),
    });
    if (error) {
      setFeedback({ type: "error", message: error.message || "تعذر إرسال الإعلان" });
    } else {
      setFeedback({ type: "success", message: "تم إرسال الإعلان إلى جميع المستخدمين" });
      setAnnouncementTitle("");
      setAnnouncementBody("");
    }
    setAnnouncementSending(false);
  };

  // Gate Check
  if (authLoading) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-block w-8 h-8 border-3 border-slate-400 border-t-slate-800 rounded-full animate-spin mb-4" />
          <p className="text-slate-600 font-mono text-sm">جاري التحقق من صلاحيات المسؤول...</p>
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
            هذه اللوحة مخصصة لإدارة المنصة والمشرفين فقط.
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

  return (
    <AppShell>
      {/* ── Neutral Admin UI Container ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6 font-sans text-slate-800 text-right">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-slate-800 text-white text-xs font-mono px-2 py-0.5 rounded font-bold">
                ADMIN PANEL
              </span>
              <h1 className="text-2xl font-bold text-slate-900">لوحة التحكم والمراجعة</h1>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              مراجعة وتدقيق طلبات انضمام الأساتذة، الاختبارات، والدروس المرفوعة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/survey"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <BarChart2 size={15} />
              <span>إحصائيات الاستطلاع</span>
            </Link>
            <button
              onClick={loadAdminData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>تحديث البيانات</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 border ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Navigation Tabs with Count Badges */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("applications")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "applications"
                ? "bg-slate-800 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <UserCheck size={16} />
            <span>طلبات الانضمام</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "applications"
                  ? "bg-slate-700 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {applications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("exams")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "exams"
                ? "bg-slate-800 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FileText size={16} />
            <span>الاختبارات والسلاسل قيد المراجعة</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "exams"
                  ? "bg-slate-700 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {exams.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("lessons")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "lessons"
                ? "bg-slate-800 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <BookOpen size={16} />
            <span>الدروس قيد المراجعة</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "lessons"
                  ? "bg-slate-700 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {lessons.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("announcement")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "announcement" ? "bg-slate-800 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Megaphone size={16} />
            <span>إرسال إعلان</span>
          </button>
        </div>

        {/* ── Content Sections ── */}

        {/* 1. APPLICATIONS TAB */}
        {activeTab === "applications" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>طلبات المساهمين الجدد المعلقة: {applications.length}</span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-500 font-mono text-sm">
                جاري تحميل الطلبات...
              </div>
            ) : applications.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center text-slate-500">
                <UserCheck size={36} className="mx-auto text-slate-400 mb-2" />
                <p className="font-semibold text-slate-700">لا توجد طلبات انضمام معلقة حالياً</p>
                <p className="text-xs text-slate-500 mt-1">
                  جميع الطلبات المقدمة تمت مراجعتها ومعالجتها.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">{app.full_name}</h3>
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                              app.role_requested === "inspector"
                                ? "bg-purple-100 text-purple-800 border border-purple-200"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                            }`}
                          >
                            {app.role_requested === "inspector" ? "مفتش تربية وطنية" : "أستاذ"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                          <span>المؤسسة: <strong>{app.institution}</strong></span>
                          {app.wilaya && <span>• الولاية: <strong>{app.wilaya}</strong></span>}
                          {app.years_experience && <span>• الخبرة: <strong>{app.years_experience} سنوات</strong></span>}
                          <span>• تاريخ التقديم: {new Date(app.created_at).toLocaleDateString("ar-DZ")}</span>
                        </p>
                      </div>

                      {/* Proof File button */}
                      {app.proof_file_path && (
                        <button
                          onClick={() => handleOpenProof(app.proof_file_path!)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition-colors shrink-0 cursor-pointer"
                        >
                          <Eye size={14} />
                          <span>معاينة وثيقة الإثبات</span>
                          <ExternalLink size={12} className="opacity-70" />
                        </button>
                      )}
                    </div>

                    {/* Subjects and Message */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-500 font-semibold">المواد:</span>
                        {app.subjects?.map((sub) => (
                          <span
                            key={sub}
                            className="bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded font-medium"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>

                      {app.message && (
                        <div className="bg-slate-50 p-3 rounded text-xs text-slate-700 border border-slate-100">
                          <strong className="block text-slate-900 mb-0.5">رسالة المتقدم:</strong>
                          <p>{app.message}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleRejectApp(app.id)}
                        disabled={actionLoading === app.id}
                        className="px-4 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded border border-red-200 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        رفض الطلب
                      </button>
                      <button
                        onClick={() => handleInitiateApproveApp(app)}
                        disabled={actionLoading === app.id}
                        className="px-4 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                      >
                        قبول وتعيين الصفة
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. EXAMS TAB */}
        {activeTab === "exams" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>الاختبارات المعلقة: {exams.length}</span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-500 font-mono text-sm">
                جاري تحميل الامتحانات...
              </div>
            ) : exams.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center text-slate-500">
                <FileText size={36} className="mx-auto text-slate-400 mb-2" />
                <p className="font-semibold text-slate-700">لا توجد اختبارات قيد المراجعة</p>
                <p className="text-xs text-slate-500 mt-1">جميع الاختبارات المرفوعة معتمدة ومنشورة.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {exams.map((exam) => {
                  const subjectName = subjects.find((s) => s.slug === exam.subject_slug)?.name || exam.subject_slug;
                  return (
                    <div
                      key={exam.id}
                      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold text-slate-900">{exam.title}</h3>
                            <span className="bg-blue-50 text-blue-800 text-xs px-2.5 py-0.5 rounded font-bold border border-blue-200">
                              {subjectName}
                            </span>
                            <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">
                              {exam.type}
                            </span>
                            <span className="bg-emerald-50 text-emerald-800 text-xs px-2 py-0.5 rounded border border-emerald-200">
                              التصحيح: {exam.corrige_status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            <span>بواسطة: <strong>{exam.authorName}</strong></span>
                            {" • "}
                            <span>التاريخ: {new Date(exam.created_at).toLocaleDateString("ar-DZ")}</span>
                          </p>
                        </div>

                        {/* File preview buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleOpenFile("exam-files", exam.exam_file_path)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Eye size={14} />
                            <span>معاينة الامتحان</span>
                          </button>

                          {exam.corrige_file_path && (
                            <button
                              onClick={() => handleOpenFile("exam-files", exam.corrige_file_path!)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded text-xs font-semibold transition-colors cursor-pointer border border-emerald-200"
                            >
                              <Eye size={14} />
                              <span>معاينة التصحيح</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Units */}
                      {exam.units && exam.units.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs text-slate-500">الوحدات:</span>
                          {exam.units.map((u) => (
                            <span key={u} className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">
                              {u}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleRejectExam(exam.id)}
                          disabled={actionLoading === exam.id}
                          className="px-4 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded border border-red-200 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          رفض
                        </button>
                        <button
                          onClick={() => handleApproveExam(exam.id)}
                          disabled={actionLoading === exam.id}
                          className="px-4 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                        >
                          اعتماد ونشر للطلاب
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. LESSONS TAB */}
        {activeTab === "lessons" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>الدروس المعلقة: {lessons.length}</span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-500 font-mono text-sm">
                جاري تحميل الدروس...
              </div>
            ) : lessons.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center text-slate-500">
                <BookOpen size={36} className="mx-auto text-slate-400 mb-2" />
                <p className="font-semibold text-slate-700">لا توجد دروس قيد المراجعة</p>
                <p className="text-xs text-slate-500 mt-1">جميع الدروس المرفوعة معتمدة ومنشورة.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {lessons.map((lesson) => {
                  const subjectName = subjects.find((s) => s.slug === lesson.subject_slug)?.name || lesson.subject_slug;
                  return (
                    <div
                      key={lesson.id}
                      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold text-slate-900">{lesson.title}</h3>
                            <span className="bg-blue-50 text-blue-800 text-xs px-2.5 py-0.5 rounded font-bold border border-blue-200">
                              {subjectName}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            <span>بواسطة: <strong>{lesson.authorName}</strong></span>
                            {" • "}
                            <span>التاريخ: {new Date(lesson.created_at).toLocaleDateString("ar-DZ")}</span>
                          </p>
                        </div>

                        {/* File preview button */}
                        <button
                          onClick={() => handleOpenFile("lesson-files", lesson.file_path)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition-colors shrink-0 cursor-pointer"
                        >
                          <Eye size={14} />
                          <span>معاينة ملف الدرس</span>
                          <ExternalLink size={12} className="opacity-70" />
                        </button>
                      </div>

                      {/* Units */}
                      {lesson.units && lesson.units.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs text-slate-500">الوحدات:</span>
                          {lesson.units.map((u) => (
                            <span key={u} className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">
                              {u}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleRejectLesson(lesson.id)}
                          disabled={actionLoading === lesson.id}
                          className="px-4 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded border border-red-200 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          رفض
                        </button>
                        <button
                          onClick={() => handleApproveLesson(lesson.id)}
                          disabled={actionLoading === lesson.id}
                          className="px-4 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                        >
                          اعتماد ونشر في صفحة المادة
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "announcement" && (
          <form onSubmit={handleSendAnnouncement} className="max-w-2xl bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center"><Megaphone size={20} /></div>
              <div><h2 className="text-lg font-bold text-slate-900">إرسال إعلان للمنصة</h2><p className="text-xs text-slate-500 mt-1">سيصل الإعلان إلى جميع المستخدمين المسجلين.</p></div>
            </div>
            <div><label htmlFor="announcement-title" className="block text-sm font-semibold text-slate-700 mb-2">عنوان الإعلان</label><input id="announcement-title" required value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900" placeholder="مثال: تحديث مهم للمنصة" /></div>
            <div><label htmlFor="announcement-body" className="block text-sm font-semibold text-slate-700 mb-2">نص الإعلان</label><textarea id="announcement-body" required rows={6} value={announcementBody} onChange={(e) => setAnnouncementBody(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 resize-y" placeholder="اكتب تفاصيل الإعلان هنا..." /></div>
            <button type="submit" disabled={announcementSending} className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-semibold disabled:opacity-50"><Megaphone size={17} />{announcementSending ? "جاري الإرسال..." : "إرسال للجميع"}</button>
          </form>
        )}
      </div>

      {/* ── Modal: Confirm Application Approval & Title ── */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl text-right border border-slate-200 animate-fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">اعتماد طلب المساهم</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                الموافقة على ترقية حساب <strong>{selectedApp.full_name}</strong> إلى أستاذ معتمد.
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الصفة واللقب الأكاديمي المعتمد في المنصة:
                </label>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  placeholder="مثال: أستاذ التعليم الثانوي - الرياضيات"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-800"
                />
                <p className="text-xs text-slate-400 mt-1">
                  ستظهر هذه الصفة كنسبة للمؤلف (بواسطة: ...) على جميع الدروس والاختبارات المرفوعة من حسابه.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-600 border border-slate-100">
                <p>
                  <strong>الصفة المطلوبة:</strong>{" "}
                  {selectedApp.role_requested === "inspector" ? "مفتش تربية وطنية" : "أستاذ"}
                </p>
                <p>
                  <strong>المواد:</strong> {selectedApp.subjects?.join("، ")}
                </p>
                <p>
                  <strong>المؤسسة:</strong> {selectedApp.institution}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmApproveApp}
                disabled={actionLoading === selectedApp.id}
                className="px-5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {actionLoading === selectedApp.id ? "جاري الاعتماد..." : "تأكيد الموافقة وتعيين الصفة"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
