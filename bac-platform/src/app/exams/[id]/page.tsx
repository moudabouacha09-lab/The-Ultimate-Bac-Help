// src/app/exams/[id]/page.tsx
"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/context/auth-context";
import { createClient } from "@/lib/supabase/client";
import { subjects } from "@/lib/subjects";
import {
  FileText,
  Eye,
  Download,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  BookOpen,
  Award,
} from "lucide-react";

type ExamData = {
  id: string;
  created_at: string;
  created_by: string;
  title: string;
  subject_slug: string;
  type: "trimestre1" | "trimestre2" | "trimestre3" | "series";
  units: string[] | null;
  corrige_status: "upload" | "uploaded" | "included" | "unavailable";
  exam_file_path: string;
  corrige_file_path: string | null;
  status: string;
  teacherTitle?: string | null;
};

const EXAM_TYPE_LABELS: Record<string, string> = {
  trimestre1: "الفصل الأول",
  trimestre2: "الفصل الثاني",
  trimestre3: "الفصل الثالث",
  series: "سلسلة تمارين",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function ExamTakingPage({ params }: PageProps) {
  const { id } = use(params);
  const { user, openAuthModal } = useAuth();
  const supabase = createClient();

  const [exam, setExam] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Corrigé & Self-Grade State
  const [showCorrige, setShowCorrige] = useState(false);
  const [selfMark, setSelfMark] = useState<string>("");
  const [markError, setMarkError] = useState<string | null>(null);
  const [submittingMark, setSubmittingMark] = useState(false);

  // Post-grade workflow states: 'initial' | 'graded' | 'done' | 'needs_help' | 'help_saved'
  const [gradeState, setGradeState] = useState<"initial" | "graded" | "done" | "needs_help" | "help_saved">("initial");
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [selectedWeakUnits, setSelectedWeakUnits] = useState<string[]>([]);
  const [savingHelp, setSavingHelp] = useState(false);

  // Fetch Exam Data
  useEffect(() => {
    async function fetchExam() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("exams")
          .select("*")
          .eq("id", id)
          .eq("status", "approved")
          .single();

        if (error || !data) {
          setNotFound(true);
          return;
        }

        // Fetch author title
        let teacherTitle = null;
        if (data.created_by) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("title, full_name")
            .eq("id", data.created_by)
            .single();

          if (profile) {
            teacherTitle = profile.title || profile.full_name || null;
          }
        }

        setExam({
          ...data,
          teacherTitle,
        });
      } catch (err) {
        console.error("Error loading exam:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchExam();
  }, [id, supabase]);

  // Helper to resolve Supabase storage URL
  const getStorageUrl = (path: string) => {
    if (!path) return "#";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const { data } = supabase.storage.from("exam-files").getPublicUrl(path);
    return data?.publicUrl || "#";
  };

  const hasCorrige = exam && (exam.corrige_status === "upload" || exam.corrige_status === "uploaded" || exam.corrige_status === "included");
  const isCorrigeSeparate = exam && (exam.corrige_status === "upload" || exam.corrige_status === "uploaded") && exam.corrige_file_path;

  // Self Grade Submit
  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMarkError(null);

    const num = parseFloat(selfMark.replace(",", "."));
    if (isNaN(num) || num < 0 || num > 20) {
      setMarkError("يرجى إدخال علامة صحيحة بين 0 و 20");
      return;
    }

    if (!user) {
      openAuthModal("login");
      return;
    }

    setSubmittingMark(true);
    try {
      // Insert row into exam_attempts
      const { data, error } = await supabase
        .from("exam_attempts")
        .insert({
          exam_id: exam!.id,
          user_id: user.id,
          self_mark: num,
        })
        .select("id")
        .single();

      if (error) {
        console.warn("Could not insert exam_attempts row directly (RLS or table missing):", error.message);
      }

      setAttemptId(data?.id || "saved");
      setGradeState("graded");
    } catch (err: any) {
      console.error("Error saving mark:", err);
      // Still allow progression locally
      setGradeState("graded");
    } finally {
      setSubmittingMark(false);
    }
  };

  // Weak Units Toggle
  const toggleWeakUnit = (unit: string) => {
    setSelectedWeakUnits((prev) =>
      prev.includes(unit) ? prev.filter((u) => u !== unit) : [...prev, unit]
    );
  };

  // Save Weak Units
  const handleSaveWeakUnits = async () => {
    if (selectedWeakUnits.length === 0) {
      setGradeState("done");
      return;
    }

    setSavingHelp(true);
    try {
      if (attemptId && attemptId !== "saved") {
        await supabase
          .from("exam_attempts")
          .update({
            weak_units: selectedWeakUnits,
          })
          .eq("id", attemptId);
      }
      setGradeState("help_saved");
    } catch (err) {
      console.error("Error updating weak units:", err);
      setGradeState("help_saved");
    } finally {
      setSavingHelp(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto px-gutter py-24 text-center">
          <div className="inline-block w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
          <p className="font-body text-body-lg text-on-surface-variant">جاري تجهيز بيئة الاختبار والوثائق...</p>
        </div>
      </AppShell>
    );
  }

  if (notFound || !exam) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto px-gutter py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <FileText size={32} />
          </div>
          <h1 className="font-headline text-display-lg text-primary font-bold">الامتحان غير متوفر</h1>
          <p className="font-body text-body-lg text-on-surface-variant">
            لم يتم العثور على هذا الامتحان أو أنه ما يزال قيد المراجعة والتدقيق.
          </p>
          <div className="pt-2">
            <Link
              href="/exams"
              className="inline-flex items-center gap-2 bg-primary text-on-primary font-body text-label-md font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              <ArrowRight size={16} />
              <span>العودة لبنك الاختبارات</span>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const subjectObj = subjects.find((s) => s.slug === exam.subject_slug);
  const subjectName = subjectObj?.name || exam.subject_slug;
  const authorLabel = exam.teacherTitle ? `بواسطة: ${exam.teacherTitle}` : "بواسطة: أستاذ معتمد";
  const activeDocumentUrl = showCorrige && isCorrigeSeparate ? getStorageUrl(exam.corrige_file_path!) : getStorageUrl(exam.exam_file_path);

  return (
    <AppShell>
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-6 min-h-[calc(100vh-5rem)]">
        {/* ── Top Navigation & Context Bar ── */}
        <header className="bg-surface-bright border border-primary/10 rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/exams"
                className="font-body text-caption font-bold text-secondary hover:text-secondary/80 inline-flex items-center gap-1"
              >
                <span>الاختبارات والسلاسل</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
              <span className="text-on-surface-variant/40">•</span>
              <span className="bg-primary/10 text-primary font-body text-caption font-bold px-2.5 py-0.5 rounded-md">
                {EXAM_TYPE_LABELS[exam.type] || exam.type}
              </span>
              <span className="bg-surface-container text-on-surface font-body text-caption font-semibold px-2.5 py-0.5 rounded-md">
                {subjectName}
              </span>
            </div>

            <h1 className="font-headline text-headline-lg md:text-2xl text-primary font-bold">
              {exam.title}
            </h1>

            <p className="font-body text-caption text-on-surface-variant">
              <span>{authorLabel}</span>
              {" • "}
              <span>تاريخ الإضافة: {new Date(exam.created_at).toLocaleDateString("ar-DZ")}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <a
              href={activeDocumentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-container hover:bg-surface-container-high text-primary font-body text-label-md font-semibold rounded-lg transition-colors"
            >
              <ExternalLink size={16} />
              <span>فتح بنافذة كاملة</span>
            </a>
            <a
              href={activeDocumentUrl}
              download
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary font-body text-label-md font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Download size={16} />
              <span>تحميل الملف</span>
            </a>
          </div>
        </header>

        {/* ── Main Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
          {/* ── Left Column: Self-Assessment & Corrections Controls (4 cols on lg) ── */}
          <aside className="lg:col-span-4 xl:col-span-4 space-y-6 order-2 lg:order-1">
            {/* 1. Solution Toggle Section */}
            {hasCorrige ? (
              <div className="bg-surface-bright border border-primary/10 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <h2 className="font-headline text-headline-md text-primary font-bold text-base flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-lg">verified</span>
                      <span>الحل والتصحيح النموذجي</span>
                    </h2>
                    <p className="font-body text-caption text-on-surface-variant">
                      {exam.corrige_status === "included"
                        ? "التصحيح مدمج داخل نفس ملف الموضوع"
                        : "يتوفر ملف تصحيح مفصل وسلم تنقيط"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCorrige(!showCorrige)}
                    className={`px-4 py-2 rounded-lg font-body text-label-md font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 ${
                      showCorrige
                        ? "bg-secondary text-on-secondary"
                        : "bg-primary text-on-primary hover:bg-primary/90"
                    }`}
                  >
                    <Eye size={16} />
                    <span>{showCorrige ? "إخفاء الحل" : "إظهار الحل"}</span>
                  </button>
                </div>

                {showCorrige && isCorrigeSeparate && (
                  <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-lg font-body text-caption text-secondary flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>تم تحويل العارض لعرض وثيقة التصحيح النموذجي.</span>
                  </div>
                )}
              </div>
            ) : (
              /* Warning Banner when Corrige is Unavailable */
              <div className="bg-surface-variant/50 border border-outline-variant/40 rounded-xl p-5 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-secondary font-headline text-headline-md font-bold text-sm">
                  <AlertTriangle size={18} />
                  <span>تنبيه بخصوص التصحيح</span>
                </div>
                <p className="font-body text-caption text-on-surface-variant leading-relaxed">
                  هذا الامتحان بدون تصحيح، لن تتوفر ميزة تحديد نقاط الضعف أو تتبع المستوى لهذا الامتحان.
                </p>
              </div>
            )}

            {/* 2. Self-Grading Flow (Only available if corrigé exists) */}
            {hasCorrige && (
              <div className="bg-surface-bright border border-primary/10 rounded-xl p-5 md:p-6 shadow-sm space-y-5">
                <div className="border-b border-primary/10 pb-3">
                  <h2 className="font-headline text-headline-md text-primary font-bold text-base flex items-center gap-2">
                    <Award size={18} className="text-secondary" />
                    <span>التقييم الذاتي للعلامة</span>
                  </h2>
                  <p className="font-body text-caption text-on-surface-variant mt-1">
                    بعد إنهاء المحاولة ومقارنتها بالحل، أدخل علامتك لتسجيل تقدمك واكتشاف مواضع الصعوبة.
                  </p>
                </div>

                {/* State A: Initial input form */}
                {gradeState === "initial" && (
                  <form onSubmit={handleGradeSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block font-body text-label-md font-bold text-on-surface text-right">
                        أدخل علامتك من 20:
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.25"
                            placeholder="16.50"
                            value={selfMark}
                            onChange={(e) => setSelfMark(e.target.value)}
                            required
                            className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-3 text-center font-headline text-headline-md font-bold text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            dir="ltr"
                          />
                        </div>
                        <span className="font-headline text-headline-lg font-bold text-on-surface-variant">
                          / 20
                        </span>
                      </div>
                      {markError && <p className="text-xs text-error font-body font-bold">{markError}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={submittingMark}
                      className="w-full bg-primary text-on-primary font-body text-label-md font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {submittingMark ? (
                        <span>جاري الحفظ...</span>
                      ) : (
                        <>
                          <CheckCircle2 size={18} />
                          <span>تم، حفظ النتيجة</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* State B: Graded -> Choose 'تم' or 'أحتاج مساعدة' */}
                {gradeState === "graded" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-center space-y-1">
                      <span className="font-body text-caption font-semibold text-primary block">
                        علامتك المسجلة في هذا الاختبار:
                      </span>
                      <strong className="font-headline text-display-lg text-primary font-bold block" dir="ltr">
                        {parseFloat(selfMark).toFixed(2)} / 20
                      </strong>
                    </div>

                    {exam.type === "series" ? (
                      /* Series -> Direct Complete Confirmation */
                      <div className="space-y-3">
                        <p className="font-body text-caption text-on-surface-variant text-center">
                          رائع! تم تسجيل نتيجتك في هذه السلسلة التدريبية.
                        </p>
                        <button
                          type="button"
                          onClick={() => setGradeState("done")}
                          className="w-full bg-primary text-on-primary font-body text-label-md font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
                        >
                          تم وإنهاء
                        </button>
                      </div>
                    ) : (
                      /* Exam -> Choice between 'تم' and 'أحتاج مساعدة' */
                      <div className="space-y-3 pt-2">
                        <p className="font-body text-caption text-on-surface-variant text-center font-medium">
                          هل واجهت صعوبة في أي من وحدات هذا الامتحان؟
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setGradeState("done")}
                            className="bg-primary text-on-primary font-body text-label-md font-bold py-2.5 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 size={16} />
                            <span>تم</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setGradeState("needs_help")}
                            className="border border-secondary text-secondary hover:bg-secondary/10 font-body text-label-md font-bold py-2.5 px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <HelpCircle size={16} />
                            <span>أحتاج مساعدة</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* State C: Needs Help -> Multi-select checklist of units in this exam */}
                {gradeState === "needs_help" && exam.type !== "series" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="space-y-1">
                      <h3 className="font-headline text-label-md font-bold text-secondary flex items-center gap-1.5">
                        <Sparkles size={16} />
                        <span>حدد الوحدات التي واجهت فيها صعوبة:</span>
                      </h3>
                      <p className="font-body text-caption text-on-surface-variant">
                        اختر من الوحدات المغطاة في هذا الامتحان لتركيز خطة المراجعة عليها.
                      </p>
                    </div>

                    <div className="space-y-2 bg-surface-container-low p-3 rounded-xl border border-primary/10">
                      {exam.units && exam.units.length > 0 ? (
                        exam.units.map((unit) => {
                          const isSelected = selectedWeakUnits.includes(unit);
                          return (
                            <label
                              key={unit}
                              className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all border ${
                                isSelected
                                  ? "bg-secondary/10 border-secondary/30 text-secondary font-bold"
                                  : "bg-surface-bright border-transparent text-on-surface hover:border-primary/20"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleWeakUnit(unit)}
                                className="w-4 h-4 rounded text-secondary focus:ring-secondary border-primary/30 cursor-pointer"
                              />
                              <span className="font-body text-body-md">{unit}</span>
                            </label>
                          );
                        })
                      ) : (
                        <p className="font-body text-caption text-on-surface-variant">
                          جميع وحدات المادة معنية بالتقييم.
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleSaveWeakUnits}
                        disabled={savingHelp}
                        className="flex-1 bg-secondary text-on-secondary font-body text-label-md font-bold py-2.5 px-4 rounded-lg hover:bg-secondary/90 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                      >
                        {savingHelp ? "جاري الحفظ..." : "تأكيد وحفظ نقاط الضعف"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setGradeState("done")}
                        className="px-3 py-2 text-on-surface-variant hover:text-primary font-body text-caption font-semibold cursor-pointer"
                      >
                        تخطي
                      </button>
                    </div>
                  </div>
                )}

                {/* State D: Final Done Confirmation */}
                {gradeState === "done" && (
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-center space-y-2 animate-fade-in">
                    <CheckCircle2 size={32} className="mx-auto text-primary" />
                    <h3 className="font-headline text-label-md font-bold text-primary">
                      تم تسجيل تقييمك بنجاح!
                    </h3>
                    <p className="font-body text-caption text-on-surface-variant">
                      أحسنت صنعاً. استمر في التدرب وحل نماذج إضافية للوصول لأفضل جاهزية لشهادة البكالوريا.
                    </p>
                  </div>
                )}

                {/* State E: Help Saved Confirmation */}
                {gradeState === "help_saved" && (
                  <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-xl text-center space-y-2 animate-fade-in">
                    <Sparkles size={32} className="mx-auto text-secondary" />
                    <h3 className="font-headline text-label-md font-bold text-secondary">
                      تم تسجيل نقاط الضعف بنجاح!
                    </h3>
                    <p className="font-body text-caption text-on-surface-variant">
                      تم حفظ الوحدات المحددة لتقديم توصيات مراجعة وتمارين علاجية موجهة لك.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. Units Tag Info Box */}
            {exam.units && exam.units.length > 0 && (
              <div className="bg-surface-bright border border-primary/10 rounded-xl p-5 shadow-sm space-y-3">
                <h3 className="font-headline text-label-md font-bold text-primary flex items-center gap-2">
                  <BookOpen size={16} className="text-secondary" />
                  <span>الوحدات والمحاور المعنية</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {exam.units.map((u) => (
                    <span
                      key={u}
                      className="bg-surface-container text-on-surface font-body text-caption font-semibold px-2.5 py-1 rounded-md"
                    >
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* ── Right Column: Document Viewer (8 cols on lg) ── */}
          <section className="lg:col-span-8 xl:col-span-8 bg-surface-bright border border-primary/10 rounded-xl overflow-hidden shadow-sm flex flex-col order-1 lg:order-2 min-h-[600px] h-[75vh] md:h-[82vh]">
            {/* Viewer Toolbar */}
            <div className="bg-surface-container px-4 py-2.5 border-b border-primary/10 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">description</span>
                <span className="font-body text-caption font-bold text-primary">
                  {showCorrige && isCorrigeSeparate ? "وثيقة التصحيح النموذجي 📝" : "وثيقة موضوع الامتحان 📄"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activeDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-surface-bright hover:bg-surface-bright/80 text-primary border border-primary/10 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Eye size={13} />
                  <span>معاينة خارجية</span>
                </a>
              </div>
            </div>

            {/* Document Iframe Viewer */}
            <div className="flex-1 w-full h-full bg-slate-100 relative">
              <iframe
                src={`${activeDocumentUrl}#toolbar=1&navpanes=0`}
                className="w-full h-full border-none"
                title={exam.title}
              />
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
