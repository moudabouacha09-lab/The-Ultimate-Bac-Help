// src/app/contribute/upload-exam/page.tsx
"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/context/auth-context";
import { createClient } from "@/lib/supabase/client";
import { subjects } from "@/lib/subjects";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Lock,
  ArrowRight,
} from "lucide-react";

type CorrigeStatus = "upload" | "included" | "unavailable";
type ExamType = "trimestre1" | "trimestre2" | "trimestre3" | "series";

const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  trimestre1: "فصل 1",
  trimestre2: "فصل 2",
  trimestre3: "فصل 3",
  series: "سلسلة",
};

type UploadState = "idle" | "submitting" | "success";

export default function UploadExamPage() {
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const supabase = createClient();

  // Gate: only teacher or admin
  const isAuthorized = !authLoading && user && (user.role === "teacher" || user.role === "admin");

  // Form state
  const [subjectSlug, setSubjectSlug] = useState("");
  const [examType, setExamType] = useState<ExamType>("trimestre1");
  const [units, setUnits] = useState<string[]>([]);
  const [unitInput, setUnitInput] = useState("");
  const [corrigeStatus, setCorrigeStatus] = useState<CorrigeStatus>("unavailable");

  const [examFile, setExamFile] = useState<File | null>(null);
  const [corrigeFile, setCorrigeFile] = useState<File | null>(null);

  const [isDraggingExam, setIsDraggingExam] = useState(false);
  const [isDraggingCorrige, setIsDraggingCorrige] = useState(false);

  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const examFileRef = useRef<HTMLInputElement>(null);
  const corrigeFileRef = useRef<HTMLInputElement>(null);

  // Reset corrigé file when switching away from "upload"
  useEffect(() => {
    if (corrigeStatus !== "upload") {
      setCorrigeFile(null);
    }
  }, [corrigeStatus]);

  // ── Tag Helpers ──────────────────────────────────────────────────────────
  const addUnit = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !units.includes(trimmed)) {
      setUnits((prev) => [...prev, trimmed]);
    }
    setUnitInput("");
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

  const handleExamFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingExam(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) { setSubmitError(err); return; }
    setExamFile(file);
    setSubmitError(null);
  };

  const handleCorrigeFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingCorrige(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) { setSubmitError(err); return; }
    setCorrigeFile(file);
    setSubmitError(null);
  };

  const handleExamFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) { setSubmitError(err); return; }
    setExamFile(file);
    setSubmitError(null);
  };

  const handleCorrigeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) { setSubmitError(err); return; }
    setCorrigeFile(file);
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

    if (!user) { openAuthModal("login"); return; }
    if (!subjectSlug) { setSubmitError("يرجى اختيار المادة"); return; }
    if (!examFile) { setSubmitError("يرجى رفع ملف الامتحان الرئيسي"); return; }
    if (corrigeStatus === "upload" && !corrigeFile) {
      setSubmitError("يرجى رفع ملف التصحيح أو اختر خياراً آخر");
      return;
    }

    setUploadState("submitting");
    try {
      // 1. Upload exam file
      const examPath = await uploadFile(examFile, "exam-files", user.id);

      // 2. Upload corrigé file if separate
      let corrigePath: string | null = null;
      if (corrigeStatus === "upload" && corrigeFile) {
        corrigePath = await uploadFile(corrigeFile, "exam-files", `${user.id}/corrige`);
      }

      // 3. Derive subject name for title
      const subject = subjects.find((s) => s.slug === subjectSlug);
      const title = `${subject?.name ?? subjectSlug} — ${EXAM_TYPE_LABELS[examType]}`;

      // 4. Insert row into exams table
      const { error: insertError } = await supabase.from("exams").insert({
        created_by: user.id,
        title,
        subject_slug: subjectSlug,
        type: examType,
        units: units.length > 0 ? units : null,
        corrige_status: corrigeStatus,
        exam_file_path: examPath,
        corrige_file_path: corrigePath,
      });

      if (insertError) throw new Error(`فشل حفظ البيانات: ${insertError.message}`);

      setUploadState("success");
    } catch (err: any) {
      setSubmitError(err.message || "حدث خطأ أثناء الرفع. يرجى المحاولة مرة أخرى.");
      setUploadState("idle");
    }
  };

  const resetForm = () => {
    setSubjectSlug("");
    setExamType("trimestre1");
    setUnits([]);
    setUnitInput("");
    setCorrigeStatus("unavailable");
    setExamFile(null);
    setCorrigeFile(null);
    setSubmitError(null);
    setUploadState("idle");
  };

  // ── Render states ────────────────────────────────────────────────────────
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
                تم نشر المحتوى بنجاح!
              </h1>
              <p className="font-body text-body-lg text-on-surface-variant max-w-lg mx-auto leading-relaxed">
                شكراً على مساهمتك. تم حفظ الملف وسيكون متاحاً للطلاب بعد مراجعته.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={resetForm}
                className="bg-primary text-on-primary font-body text-label-md font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
              >
                رفع محتوى آخر
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
                إضافة محتوى جديد
              </h1>
              <p className="font-body text-body-lg text-on-surface-variant max-w-2xl">
                قم برفع الامتحانات، السلاسل، أو الوثائق التعليمية لمساعدة الطلاب في التحضير للبكالوريا.
              </p>
            </header>

            {/* Error Banner */}
            {submitError && (
              <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error font-body text-caption font-semibold flex items-center gap-3">
                <AlertCircle size={20} className="shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-primary/10 rounded-xl p-6 md:p-8 shadow-sm space-y-8">

              {/* ── Section 1: Subject + Type Grid ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* المادة */}
                <div>
                  <label className="block font-body text-label-md font-bold text-on-surface mb-2 text-right">
                    المادة <span className="text-secondary">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={subjectSlug}
                      onChange={(e) => setSubjectSlug(e.target.value)}
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

                {/* النوع */}
                <div>
                  <label className="block font-body text-label-md font-bold text-on-surface mb-2 text-right">
                    نوع المحتوى <span className="text-secondary">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(Object.keys(EXAM_TYPE_LABELS) as ExamType[]).map((type) => {
                      const isActive = examType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setExamType(type)}
                          className={`px-5 py-2.5 rounded-full font-body text-label-md font-medium cursor-pointer transition-all ${
                            isActive
                              ? "bg-primary text-on-primary font-bold shadow-sm"
                              : "bg-surface-container text-on-surface-variant border border-primary/10 hover:bg-surface-container-high"
                          }`}
                        >
                          {EXAM_TYPE_LABELS[type]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* الوحدات — full width */}
                <div className="md:col-span-2">
                  <label className="block font-body text-label-md font-bold text-on-surface mb-2 text-right">
                    الوحدات المغطاة{" "}
                    <span className="text-on-surface-variant text-caption font-normal">(اختياري — اضغط Enter لإضافة وحدة)</span>
                  </label>
                  <div
                    className="bg-surface-bright border border-primary/20 rounded-lg p-3 min-h-[52px] flex flex-wrap gap-2 items-center focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors cursor-text"
                    onClick={() => document.getElementById("unit-input")?.focus()}
                  >
                    {units.map((unit) => (
                      <span
                        key={unit}
                        className="bg-primary/10 text-primary font-body text-label-md px-3 py-1 rounded-full flex items-center gap-1.5"
                      >
                        {unit}
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
                      id="unit-input"
                      type="text"
                      value={unitInput}
                      onChange={(e) => setUnitInput(e.target.value)}
                      onKeyDown={handleUnitKeyDown}
                      onBlur={() => { if (unitInput.trim()) addUnit(unitInput); }}
                      placeholder={units.length === 0 ? "مثال: الدوال العددية، النهايات..." : "أضف وحدة..."}
                      className="flex-1 bg-transparent border-none outline-none font-body text-body-md text-on-surface placeholder:text-on-surface-variant/50 min-w-[150px] py-0.5"
                    />
                  </div>
                </div>
              </div>

              {/* ── Section 2: Corrigé Options ── */}
              <div className="border-t border-primary/10 pt-6 space-y-4">
                <h3 className="font-headline text-headline-md text-primary font-bold">
                  الحل / التصحيح
                </h3>

                <div className="flex flex-col sm:flex-row gap-4">
                  {(
                    [
                      { value: "upload", label: "رفع ملف منفصل" },
                      { value: "included", label: "مدمج مع الامتحان" },
                      { value: "unavailable", label: "غير متوفر" },
                    ] as { value: CorrigeStatus; label: string }[]
                  ).map(({ value, label }) => {
                    const isActive = corrigeStatus === value;
                    return (
                      <label
                        key={value}
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl border cursor-pointer transition-all ${
                          isActive
                            ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                            : "border-primary/15 bg-surface-container-lowest hover:bg-surface-container-low"
                        }`}
                      >
                        <input
                          type="radio"
                          name="corrige"
                          value={value}
                          checked={isActive}
                          onChange={() => setCorrigeStatus(value)}
                          className="h-4 w-4 text-primary focus:ring-primary cursor-pointer"
                        />
                        <span className={`font-body text-label-md font-medium ${isActive ? "text-primary font-bold" : "text-on-surface"}`}>
                          {label}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Warning banner for "غير متوفر" */}
                {corrigeStatus === "unavailable" && (
                  <div className="bg-secondary/10 border-r-4 border-secondary p-4 flex items-start gap-3 rounded-lg">
                    <AlertTriangle size={20} className="text-secondary shrink-0 mt-0.5" />
                    <p className="font-body text-body-md text-on-surface leading-relaxed">
                      هذا الامتحان بدون تصحيح، لن تتوفر ميزة تحديد نقاط الضعف أو تتبع المستوى لهذا الامتحان.
                    </p>
                  </div>
                )}

                {/* Corrigé file upload (only when "رفع ملف منفصل") */}
                {corrigeStatus === "upload" && (
                  <div>
                    <label className="block font-body text-label-md font-bold text-on-surface mb-2 text-right">
                      ملف التصحيح <span className="text-secondary">*</span>
                    </label>
                    <FileDropZone
                      file={corrigeFile}
                      isDragging={isDraggingCorrige}
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingCorrige(true); }}
                      onDragLeave={() => setIsDraggingCorrige(false)}
                      onDrop={handleCorrigeFileDrop}
                      onClick={() => corrigeFileRef.current?.click()}
                      onRemove={() => setCorrigeFile(null)}
                      inputRef={corrigeFileRef}
                      onChange={handleCorrigeFileChange}
                      label="ملف التصحيح (PDF)"
                    />
                  </div>
                )}
              </div>

              {/* ── Section 3: Main Exam File Upload ── */}
              <div className="border-t border-primary/10 pt-6">
                <label className="block font-body text-label-md font-bold text-on-surface mb-2 text-right">
                  الملف الرئيسي (الامتحان) <span className="text-secondary">*</span>
                </label>
                <FileDropZone
                  file={examFile}
                  isDragging={isDraggingExam}
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingExam(true); }}
                  onDragLeave={() => setIsDraggingExam(false)}
                  onDrop={handleExamFileDrop}
                  onClick={() => examFileRef.current?.click()}
                  onRemove={() => setExamFile(null)}
                  inputRef={examFileRef}
                  onChange={handleExamFileChange}
                  label="ملف الامتحان (PDF)"
                />
                <p className="font-body text-caption text-on-surface-variant flex items-center gap-1.5 pt-2">
                  <Lock size={13} className="text-primary shrink-0" />
                  <span>الملف محفوظ بشكل آمن ولا يُنشر إلا بعد المراجعة</span>
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
                    <span>نشر المحتوى</span>
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

// ── FileDropZone Sub-component ───────────────────────────────────────────────
type FileDropZoneProps = {
  file: File | null;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
  onRemove: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
};

function FileDropZone({
  file, isDragging, onDragOver, onDragLeave, onDrop, onClick, onRemove, inputRef, onChange, label,
}: FileDropZoneProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl px-6 py-10 cursor-pointer transition-all ${
        isDragging
          ? "border-primary bg-primary/10"
          : file
          ? "border-primary/40 bg-primary/5"
          : "border-primary/25 bg-surface-bright hover:bg-primary/5 hover:border-primary/40"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={onChange}
        className="sr-only"
        aria-label={label}
      />

      {file ? (
        <div className="flex items-center gap-3 w-full justify-between px-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FileText size={22} />
            </div>
            <div className="text-right">
              <p className="font-body text-label-md font-bold text-primary truncate max-w-xs md:max-w-md">
                {file.name}
              </p>
              <p className="font-body text-caption text-on-surface-variant">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1.5 rounded-full hover:bg-error/10 text-error transition-colors shrink-0"
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
            <span className="font-semibold text-primary underline">انقر لاختيار ملف</span>
            {" "}أو اسحب وأفلت هنا
          </div>
          <p className="font-body text-caption text-on-surface-variant/70">
            PDF, JPG, PNG — حتى 10 ميغابايت
          </p>
        </div>
      )}
    </div>
  );
}
