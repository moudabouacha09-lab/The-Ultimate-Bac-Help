// src/components/exams/exam-card.tsx
"use client";

import React from "react";
import Link from "next/link";
import { subjects } from "@/lib/subjects";
import { Eye, Download, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export type ExamCardData = {
  id: string;
  created_at: string;
  created_by: string;
  title: string;
  subject_slug: string;
  type: "trimestre1" | "trimestre2" | "trimestre3" | "series";
  units: string[] | null;
  corrige_status: "upload" | "uploaded" | "included" | "unavailable";
  exam_file_path: string;
  corrige_file_path?: string | null;
  status: string;
  teacherTitle?: string | null;
};

const EXAM_TYPE_LABELS: Record<string, string> = {
  trimestre1: "الفصل الأول",
  trimestre2: "الفصل الثاني",
  trimestre3: "الفصل الثالث",
  series: "سلسلة تمارين",
};

export function ExamCard({ exam }: { exam: ExamCardData }) {
  const supabase = createClient();
  const subjectObj = subjects.find((s) => s.slug === exam.subject_slug);
  const subjectName = subjectObj?.name || exam.subject_slug;
  const subjectIcon = subjectObj?.icon || "description";
  const authorLabel = exam.teacherTitle
    ? `بواسطة: ${exam.teacherTitle}`
    : "بواسطة: أستاذ معتمد";

  const getStorageUrl = (path: string) => {
    if (!path) return "#";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const { data } = supabase.storage.from("exam-files").getPublicUrl(path);
    return data?.publicUrl || "#";
  };

  const examUrl = getStorageUrl(exam.exam_file_path);

  return (
    <article className="bg-surface-bright border border-primary/10 rounded-xl p-6 flex flex-col justify-between gap-4 hover:shadow-md hover:border-primary/30 transition-all duration-300 relative overflow-hidden group min-h-[240px]">
      {/* Top Type / Subject Badges */}
      <div className="flex justify-between items-start gap-2 relative z-10">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-primary/10 text-primary font-body text-caption font-bold px-2.5 py-1 rounded-md">
            {EXAM_TYPE_LABELS[exam.type] || exam.type}
          </span>
          <span className="bg-surface-container text-on-surface-variant font-body text-caption font-semibold px-2.5 py-1 rounded-md">
            {subjectName}
          </span>
        </div>

        {/* Corrigé Badge */}
        {(exam.corrige_status === "upload" || exam.corrige_status === "uploaded") && (
          <span className="bg-secondary/10 text-secondary border border-secondary/20 font-body text-caption font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>حل مفصل</span>
          </span>
        )}
        {exam.corrige_status === "included" && (
          <span className="bg-primary/10 text-primary border border-primary/20 font-body text-caption font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>حل مدمج</span>
          </span>
        )}
        {exam.corrige_status === "unavailable" && (
          <span className="bg-surface-container text-on-surface-variant/70 font-body text-caption font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <span>بدون تصحيح</span>
          </span>
        )}
      </div>

      {/* Card Body: Icon + Title + Author Attribution */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
            <span className="material-symbols-outlined text-2xl">{subjectIcon}</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-headline text-headline-md text-primary font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {exam.title}
            </h3>
            <p className="font-body text-body-md text-on-surface-variant font-medium">
              {authorLabel}
            </p>
          </div>
        </div>

        {/* Unit Tags */}
        {exam.units && exam.units.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {exam.units.map((unit) => (
              <span
                key={unit}
                className="bg-surface-container text-on-surface-variant font-body text-caption px-2 py-0.5 rounded"
              >
                {unit}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="flex items-center gap-2 pt-3 border-t border-primary/10 mt-auto relative z-10">
        <Link
          href={`/exams/${exam.id}`}
          className="flex-1 bg-primary text-on-primary font-body text-label-md font-semibold px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Eye size={16} />
          <span>خوض الاختبار والحل</span>
        </Link>

        <a
          href={examUrl}
          download
          className="px-3 py-2.5 border border-primary/20 text-primary font-body text-label-md font-semibold rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          title="تحميل ملف الموضوع PDF"
        >
          <Download size={16} />
        </a>
      </div>
    </article>
  );
}
