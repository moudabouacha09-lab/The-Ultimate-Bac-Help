// src/app/contribute/upload-lesson/page.tsx
"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/context/auth-context";
import { createClient } from "@/lib/supabase/client";
import { subjects } from "@/lib/subjects";
import { SCIENTIFIC_STREAM_PROGRESS_DATA } from "@/data/bac-progress-data";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowRight,
} from "lucide-react";

// Build unit suggestions from the same curriculum used by /progress.
const SUBJECT_UNIT_OPTIONS: Record<string, string[]> = Object.fromEntries(
  SCIENTIFIC_STREAM_PROGRESS_DATA.map((subject) => {
    const units = subject.lessons.map((lesson) =>
      lesson.title
        .replace(/^الوحدة\s*\d+\s*:\s*/i, "")
        .replace(/^(?:First|Second|Third|Fourth|Forth)\s+Unit\s*:\s*/i, "")
        .replace(/^\d+\.\s*/, "")
        .trim()
    );

    return [subject.id, [...new Set(units)]];
  })
);

const formatUnitTag = (unit: string) => `#${unit.trim().replace(/\s+/g, "_")}`;

type UploadState = "idle" | "submitting" | "success";

export default function UploadLessonPage() {
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const supabase = createClient();

  // Gate: only teacher or admin
  const isAuthorized = !authLoading && user && (user.role === "teacher" || user.role === "admin");

  // Form state
  const [title, setTitle] = useState("");
  const [subjectSlug, setSubjectSlug] = useState("");
  const [units, setUnits] = useState<string[]>([]);
  const [unitInput, setUnitInput] = useState("");
  const [isUnitMenuOpen, setIsUnitMenuOpen] = useState(false);

  const [lessonFile, setLessonFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const lessonFileRef = useRef<HTMLInputElement>(null);

  // ── Tag Helpers ──────────────────────────────────────────────────────────
  const addUnit = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !units.includes(trimmed)) {
      setUnits((prev) => [...prev, trimmed]);
    }
    setUnitInput("");
  };

  const handleSubjectChange = (value: string) => {
    setSubjectSlug(value);
    setUnits([]);
    setUnitInput("");
    setIsUnitMenuOpen(false);
  };

  const removeUnit = (unit: string) => {
    setUnits((prev) => prev.filter((u) => u !== unit));
  };

  const handleUnitKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "،" || e.key === ",") {
      e.preventDefault();
      addUnit(unitInput);
    } else if (e.key === "Backspace" && unitInput === "" && units.length > 0) {
      setUnits((prev) => prev.slice(0, -1));
    }
  };

  // ── File Helpers ─────────────────────────────────────────────────────────
  const validateFile = (file: File): string | null => {
    if (file.size > 10 * 1024 * 1024) return "حجم الملف يجب ألا يتجاوز 10 ميغابايت";
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.type)) return "يُسمح فقط بملفات PDF أو JPG أو PNG";
    return null;
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) {
      setSubmitError(err);
      return;
    }
    setLessonFile(file);
    setSubmitError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) {
      setSubmitError(err);
      return;
    }
    setLessonFile(file);
    setSubmitError(null);
  };

  // ── Upload Helper ────────────────────────────────────────────────────────
  const uploadFile = async (file: File, bucket: string, folder: string): Promise<string> => {
    const ext = file.name.split(".").pop() || "pdf";
    const cleanBase = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
    const path = `${folder}/${Date.now()}_${cleanBase}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw new Error(`فشل رفع الملف: ${error.message}`);
    return path;
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!user) {
      openAuthModal("login");
      return;
    }
    if (!title.trim()) {
      setSubmitError("يرجى إدخال عنوان الدرس أو الملخص");
      return;
    }
    if (!subjectSlug) {
      setSubmitError("يرجى اختيار المادة");
      return;
    }
    if (!lessonFile) {
      setSubmitError("يرجى رفع ملف الدرس");
      return;
    }

    setUploadState("submitting");
    try {
      // 1. Upload lesson file
      const lessonPath = await uploadFile(lessonFile, "lesson-files", user.id);

      // 2. Insert row into lessons table
      const { error: insertError } = await supabase.from("lessons").insert({
        created_by: user.id,
        title: title.trim(),
        subject_slug: subjectSlug,
        units: units.length > 0 ? units : null,
        file_path: lessonPath,
        status: "pending",
      });

      if (insertError) throw new Error(`فشل حفظ البيانات: ${insertError.message}`);

      setUploadState("success");
    } catch (err: any) {
      setSubmitError(err.message || "حدث خطأ أثناء الرفع. يرجى المحاولة مرة أخرى.");
      setUploadState("idle");
    }
  };

  const resetForm = () => {
    setTitle("");
    setSubjectSlug("");
    setUnits([]);
    setUnitInput("");
    setLessonFile(null);
    setSubmitError(null);
    setUploadState("idle");
  };

  const subjectUnitSuggestions = subjectSlug ? SUBJECT_UNIT_OPTIONS[subjectSlug] ?? [] : [];
  const normalizedQuery = unitInput.trim().toLowerCase();
  const availableSuggestions = subjectUnitSuggestions.filter((option) => {
    if (units.includes(option)) return false;
    if (!normalizedQuery) return true;
    return (
      option.toLowerCase().includes(normalizedQuery) ||
      formatUnitTag(option).toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-gutter py-xl flex flex-col items-center">
        {/* ── Loading ── */}
        {authLoading ? (
          <div className="w-full max-w-2xl bg-surface-bright border border-primary/10 rounded-2xl p-12 text-center shadow-sm">
            <div className="inline-block w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
            <p className="font-body text-body-md text-on-surface-variant">جاري التحقق من الصلاحيات...</p>
          </div>
        ) : !user ? (
          /* ── Not logged in ── */
          <div className="w-full max-w-2xl bg-surface-bright border border-primary/10 rounded-2xl p-8 md:p-12 text-center shadow-sm space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Lock size={32} />
            </div>
            <div className="space-y-2">
              <h1 className="font-headline text-display-lg text-primary font-bold">تسجيل الدخول مطلوب</h1>
              <p className="font-body text-body-lg text-on-surface-variant max-w-lg mx-auto">
                هذه الصفحة مخصصة للأساتذة والمشرفين المعتمدين. يرجى تسجيل الدخول أولاً.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => openAuthModal("login")}
                className="bg-primary text-on-primary font-body text-label-md font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
              >
                تسجيل الدخول
              </button>
            </div>
          </div>
        ) : !isAuthorized ? (
          /* ── Wrong role ── */
          <div className="w-full max-w-2xl bg-surface-bright border border-primary/10 rounded-2xl p-8 md:p-12 text-center shadow-sm space-y-6">
            <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto">
              <AlertCircle size={32} />
            </div>
            <div className="space-y-2">
              <h1 className="font-headline text-display-lg text-primary font-bold">صلاحيات غير كافية</h1>
              <p className="font-body text-body-lg text-on-surface-variant max-w-lg mx-auto">
                هذه الصفحة مخصصة للأساتذة والمشرفين فقط. يمكنك التقدم بطلب انضمام من صفحة المساهمين.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/contribute"
                className="inline-flex items-center gap-2 bg-primary text-on-primary font-body text-label-md font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              >
                <span>طلب الانضمام</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-surface-container text-on-surface font-body text-label-md font-semibold px-6 py-3 rounded-lg hover:bg-surface-container-high transition-colors"
              >
                العودة للرئيسية
              </Link>
            </div>
          </div>
        ) : uploadState === "success" ? (
          /* ── Success ── */
          <div className="w-full max-w-2xl bg-surface-bright border border-primary/10 rounded-2xl p-8 md:p-12 text-center shadow-sm space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <CheckCircle2 size={44} />
            </div>
            <div className="space-y-3">
              <span className="font-body text-caption font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
                تم الرفع بنجاح ✓
              </span>
              <h1 className="font-headline text-display-lg text-primary font-bold">
                تم استلام الدرس بنجاح!
              </h1>
              <p className="font-body text-body-lg text-on-surface-variant max-w-lg mx-auto leading-relaxed">
                شكراً لمساهمتك القيمة. تم حفظ الملف وسيظهر في صفحة المادة بعد تدقيقه واعتماده.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={resetForm}
                className="bg-primary text-on-primary font-body text-label-md font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
              >
                رفع درس آخر
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-surface-container text-on-surface font-body text-label-md font-semibold px-6 py-3 rounded-lg hover:bg-surface-container-high transition-colors"
              >
                العودة للرئيسية
              </Link>
            </div>
          </div>
        ) : (
          /* ── Main Form ── */
          <div className="w-full">
            {/* Page Header */}
            <header className="mb-8">
              <span className="font-body text-label-md text-secondary bg-secondary/10 px-3 py-1 rounded-full inline-block font-semibold mb-3">
                لوحة تحكم الأستاذ 🎓
              </span>
              <h1 className="font-headline text-display-lg text-primary font-bold mb-2">
                إضافة درس أو ملخص جديد
              </h1>
              <p className="font-body text-body-lg text-on-surface-variant max-w-2xl">
                قم برفع الملخصات والدروس المركزة لإثراء مكتبة المواد الدراسية لمساعدة طلاب البكالوريا.
              </p>
            </header>

            {/* Error Banner */}
            {submitError && (
              <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error font-body text-caption font-semibold flex items-center gap-3">
                <AlertCircle size={20} className="shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-primary/10 rounded-xl p-6 md:p-8 shadow-sm space-y-6">
              {/* 1. Title Input */}
              <div>
                <label className="block font-body text-label-md font-bold text-on-surface mb-2 text-right">
                  عنوان الدرس أو الملخص <span className="text-secondary">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ملخص شامل في المتتاليات العددية مع أفكار البكالوريا"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface-bright border border-primary/20 rounded-lg px-4 py-3 text-on-surface font-body text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              {/* 2. Subject Selection */}
              <div>
                <label className="block font-body text-label-md font-bold text-on-surface mb-2 text-right">
                  المادة الدراسية <span className="text-secondary">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={subjectSlug}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    className="w-full appearance-none bg-surface-bright border border-primary/20 rounded-lg px-4 py-3 text-on-surface font-body text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer pr-10"
                  >
                    <option value="">اختر المادة...</option>
                    {subjects.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-xl">
                    expand_more
                  </span>
                </div>
              </div>

              {/* 3. Units / Topics Tags */}
              <div className="space-y-2">
                <label className="block font-body text-label-md font-bold text-on-surface mb-2 text-right">
                  الوحدة / المواضيع المغطاة{" "}
                  <span className="text-on-surface-variant text-caption font-normal">
                    (اختياري — اكتب واضغط Enter لإضافة وسوم مثل #المتتاليات)
                  </span>
                </label>
                <div className="relative">
                  <div
                    className="bg-surface-bright border border-primary/20 rounded-lg p-3 min-h-[52px] flex flex-wrap gap-2 items-center focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors cursor-text"
                    onClick={() => document.getElementById("lesson-unit-input")?.focus()}
                  >
                    {units.map((unit) => (
                      <span
                        key={unit}
                        className="bg-primary/10 text-primary font-body text-label-md px-3 py-1 rounded-full flex items-center gap-1.5"
                      >
                        {formatUnitTag(unit)}
                        <button
                          type="button"
                          onClick={() => removeUnit(unit)}
                          className="hover:text-error transition-colors cursor-pointer"
                          aria-label={`حذف ${unit}`}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                    <input
                      id="lesson-unit-input"
                      type="text"
                      value={unitInput}
                      onChange={(e) => {
                        setUnitInput(e.target.value);
                        if (!isUnitMenuOpen) setIsUnitMenuOpen(true);
                      }}
                      onFocus={() => setIsUnitMenuOpen(true)}
                      onKeyDown={handleUnitKeyDown}
                      onBlur={() => {
                        setTimeout(() => {
                          if (unitInput.trim()) addUnit(unitInput);
                          setIsUnitMenuOpen(false);
                        }, 180);
                      }}
                      placeholder={
                        units.length === 0
                          ? subjectSlug
                            ? "اكتب وسماً أو اختر من وحدات المادة أدناه..."
                            : "اختر مادة أولاً لاقتراح الوحدات الرسمية..."
                          : "أضف وحدة أخرى..."
                      }
                      className="flex-1 bg-transparent border-none outline-none font-body text-body-md text-on-surface placeholder:text-on-surface-variant/50 min-w-[170px] py-0.5"
                    />
                  </div>

                  {/* Suggestion dropdown */}
                  {isUnitMenuOpen && availableSuggestions.length > 0 && (
                    <div className="absolute top-[calc(100%+0.35rem)] left-0 right-0 z-20 bg-surface-bright border border-primary/15 rounded-xl shadow-lg p-2 max-h-56 overflow-y-auto space-y-1">
                      <div className="px-3 py-1 text-caption font-semibold text-on-surface-variant border-b border-primary/10">
                        وحدات مقترحة لمادة {subjects.find((s) => s.slug === subjectSlug)?.name}:
                      </div>
                      {availableSuggestions.map((unit) => (
                        <button
                          key={unit}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            addUnit(unit);
                          }}
                          className="w-full text-right px-3 py-2 rounded-lg hover:bg-primary/10 text-on-surface hover:text-primary font-body text-label-md flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span>{unit}</span>
                          <span className="text-caption text-primary/70">{formatUnitTag(unit)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Single File Upload */}
              <div className="border-t border-primary/10 pt-6">
                <label className="block font-body text-label-md font-bold text-on-surface mb-2 text-right">
                  ملف الدرس أو الملخص (PDF أو صورة) <span className="text-secondary">*</span>
                </label>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() => lessonFileRef.current?.click()}
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl px-6 py-10 cursor-pointer transition-all ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : lessonFile
                      ? "border-primary/40 bg-primary/5"
                      : "border-primary/25 bg-surface-bright hover:bg-primary/5 hover:border-primary/40"
                  }`}
                >
                  <input
                    ref={lessonFileRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="sr-only"
                    aria-label="ملف الدرس"
                  />

                  {lessonFile ? (
                    <div className="flex items-center gap-3 w-full justify-between px-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <FileText size={22} />
                        </div>
                        <div className="text-right">
                          <p className="font-body text-label-md font-bold text-primary truncate max-w-xs md:max-w-md">
                            {lessonFile.name}
                          </p>
                          <p className="font-body text-caption text-on-surface-variant">
                            {(lessonFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLessonFile(null);
                        }}
                        className="p-1.5 rounded-full hover:bg-error/10 text-error transition-colors shrink-0 cursor-pointer"
                        title="إزالة الملف"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 text-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <UploadCloud size={26} />
                      </div>
                      <div className="font-body text-body-md text-on-surface-variant">
                        <span className="font-semibold text-primary underline">انقر لاختيار ملف</span> أو اسحب وأفلت هنا
                      </div>
                      <p className="font-body text-caption text-on-surface-variant/70">
                        PDF, JPG, PNG — حتى 10 ميغابايت
                      </p>
                    </div>
                  )}
                </div>

                <p className="font-body text-caption text-on-surface-variant flex items-center gap-1.5 pt-2">
                  <Lock size={13} className="text-primary shrink-0" />
                  <span>يتم تدقيق الملف من قبل المشرفين قبل نشره في مكتبة المادة</span>
                </p>
              </div>

              {/* ── Actions ── */}
              <div className="flex justify-end gap-4 pt-2 border-t border-primary/10">
                <Link
                  href="/"
                  className="px-6 py-3 rounded-lg border border-primary/20 text-on-surface-variant font-body text-label-md font-semibold text-center hover:bg-surface-container transition-colors"
                >
                  إلغاء
                </Link>
                <button
                  type="submit"
                  disabled={uploadState === "submitting"}
                  className="px-8 py-3 rounded-lg bg-primary text-on-primary font-body text-label-md font-semibold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer min-w-[140px]"
                >
                  {uploadState === "submitting" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                      <span>جاري الرفع...</span>
                    </>
                  ) : (
                    <span>نشر الدرس</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}
