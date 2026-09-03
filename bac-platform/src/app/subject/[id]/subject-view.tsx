// src/app/subject/[id]/subject-view.tsx
"use client";

import { useState, useEffect } from "react";
import type { SubjectContent } from "@/data/bac-content";
import type { Subject } from "@/lib/subjects";
import { Eye, Download, Package } from "lucide-react";
import type { ReactNode } from "react";
import { FadeInSection } from "@/components/effects/fade-in-section";
import { createClient } from "@/lib/supabase/client";

export type DisplayFileItem = {
  title: string;
  path: string;
  type: "download" | "preview";
  format: string;
  author: string;
  isTeacherContent?: boolean;
};

const formatIcons: Record<string, { icon: ReactNode; label: string }> = {
  pdf: { icon: "PDF", label: "PDF" },
  png: { icon: "🖼", label: "صورة" },
  jpg: { icon: "🖼", label: "صورة" },
  jpeg: { icon: "🖼", label: "صورة" },
  html: { icon: "🌐", label: "موقع تفاعلي" },
  m4a: { icon: "🎧", label: "صوتي" },
  docx: { icon: "W", label: "Word" },
  rar: { icon: <Package size={18} />, label: "أرشيف" },
  zip: { icon: <Package size={18} />, label: "أرشيف" },
};

function FileCard({ file }: { file: DisplayFileItem }) {
  const info = formatIcons[file.format] ?? { icon: "PDF", label: file.format.toUpperCase() };
  const isPreview = file.type === "preview";

  const getFileUrl = (filePath: string, isDownload: boolean = false) => {
    if (!filePath) return "#";
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) return filePath;

    const cleanPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
    const segments = cleanPath.split("/").map((seg) => encodeURIComponent(seg));
    const encodedPath = segments.join("/");
    const query = isDownload ? "?download=1" : "";
    return `${encodedPath}${query}`;
  };

  return (
    <article className="group bg-surface-bright border border-primary/10 rounded-xl p-6 flex flex-col justify-between hover:border-primary/30 hover:shadow-md transition-all duration-300 relative overflow-hidden min-h-[190px]">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors" />

      <div>
        {/* Top Badges */}
        <div className="flex justify-between items-start mb-3">
          <span className="bg-surface-container px-2.5 py-1 rounded text-primary font-body text-caption font-semibold">
            {info.label}
          </span>
          <span className="material-symbols-outlined text-primary/40 text-xl" aria-hidden="true">
            {file.isTeacherContent ? "school" : "description"}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-headline text-headline-md text-primary mb-2 font-bold group-hover:text-primary transition-colors leading-snug">
          {file.title}
        </h3>

        {/* Description */}
        <p className="font-body text-body-md text-on-surface-variant mb-3 line-clamp-2">
          ملف مخصص لتحضير شهادة البكالوريا - منهجية دقيقة وتمارين تطبيقية.
        </p>

        {/* Author Attribution Line */}
        <div className="flex items-center gap-1.5 font-body text-caption font-semibold text-on-surface-variant mb-5">
          <span className="material-symbols-outlined text-[15px] text-primary/70">
            {file.isTeacherContent ? "school" : "verified"}
          </span>
          <span>{file.author}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-primary/10 mt-auto">
        <a
          className="flex-1 bg-primary text-on-primary font-body text-label-md font-semibold px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          href={getFileUrl(file.path, false)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Eye size={16} />
          <span>معاينة</span>
        </a>
        {!isPreview && (
          <a
            className="px-4 py-2.5 border border-primary text-primary font-body text-label-md font-semibold rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            href={getFileUrl(file.path, true)}
            download
            title="تحميل الملف"
          >
            <Download size={16} />
            <span className="hidden sm:inline">تحميل</span>
          </a>
        )}
      </div>
    </article>
  );
}

export default function SubjectView({ subject, content }: { subject: Subject; content: SubjectContent }) {
  const supabase = createClient();
  const [teacherFiles, setTeacherFiles] = useState<DisplayFileItem[]>([]);

  useEffect(() => {
    async function fetchTeacherLessons() {
      try {
        const { data: lessonsData, error: lessonsError } = await supabase
          .from("lessons")
          .select("id, title, subject_slug, units, file_path, created_at, created_by")
          .eq("subject_slug", subject.slug)
          .eq("status", "approved")
          .order("created_at", { ascending: false });

        if (lessonsError || !lessonsData || lessonsData.length === 0) {
          setTeacherFiles([]);
          return;
        }

        const userIds = [...new Set(lessonsData.map((l) => l.created_by).filter(Boolean))];
        let profilesMap: Record<string, { title?: string; full_name?: string }> = {};

        if (userIds.length > 0) {
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, full_name, title")
            .in("id", userIds);

          if (profilesData) {
            profilesData.forEach((p) => {
              profilesMap[p.id] = { full_name: p.full_name, title: p.title };
            });
          }
        }

        const mappedTeacherFiles: DisplayFileItem[] = lessonsData.map((lesson) => {
          const prof = profilesMap[lesson.created_by];
          const authorName = prof?.title || prof?.full_name || null;
          const author = authorName ? `بواسطة: ${authorName}` : "بواسطة: أستاذ معتمد";

          const ext = lesson.file_path.split(".").pop()?.toLowerCase() || "pdf";
          let publicUrl = lesson.file_path;
          if (!publicUrl.startsWith("http")) {
            const { data } = supabase.storage.from("lesson-files").getPublicUrl(lesson.file_path);
            publicUrl = data?.publicUrl || lesson.file_path;
          }

          return {
            title: lesson.title,
            path: publicUrl,
            type: "download",
            format: ext,
            author,
            isTeacherContent: true,
          };
        });

        setTeacherFiles(mappedTeacherFiles);
      } catch (err) {
        console.error("Error fetching teacher lessons:", err);
      }
    }

    fetchTeacherLessons();
  }, [subject.slug]);

  const groups = [...new Set(content.sections.map((s) => s.group).filter(Boolean))] as string[];
  const hasGroups = groups.length > 0;

  const [activeGroup, setActiveGroup] = useState(groups[0] ?? "");

  const visibleSections = hasGroups
    ? content.sections.filter((s) => s.group === activeGroup)
    : content.sections;

  return (
    <div className="max-w-7xl mx-auto px-gutter py-xl flex flex-col gap-xl">
      {/* ── Header Section ── */}
      <header className="relative overflow-hidden bg-surface-bright border border-primary/10 rounded-xl p-6 md:p-8 shadow-sm">
        <span className="font-body text-label-md text-secondary bg-secondary/10 px-3 py-1 rounded-full inline-block font-semibold mb-3">
          ملفات {subject.name} 📚
        </span>

        <div className="flex items-center gap-4 mb-3 relative z-10">
          <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">{subject.icon}</span>
          </div>
          <h1 className="font-headline text-display-lg text-primary font-bold">
            {subject.name}
          </h1>
        </div>

        <p className="font-body text-body-lg text-on-surface-variant max-w-2xl relative z-10 leading-relaxed">
          موارد شاملة، ملخصات مركزة، وحوليات بكالوريا سابقة مرتبة حسب الوحدات لمساعدتك في التفوق في مادة {subject.name}.
        </p>

        {/* Decorative background icon */}
        <span className="material-symbols-outlined text-primary/5 text-[140px] absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none select-none">
          {subject.icon}
        </span>
      </header>

      {/* ── Unit Tabs ── */}
      {hasGroups && (
        <section aria-label={`أقسام مادة ${subject.name}`}>
          <h2 className="font-headline text-headline-md text-primary font-bold mb-4">الوحدات الدراسية</h2>
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
            {groups.map((group) => {
              const isActive = activeGroup === group;
              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => setActiveGroup(group)}
                  className={`whitespace-nowrap px-6 py-2 rounded-full font-body text-label-md cursor-pointer transition-all ${
                    isActive
                      ? "bg-primary text-on-primary font-bold shadow-sm"
                      : "bg-primary/10 text-primary border border-primary/10 hover:bg-primary/20 font-medium"
                  }`}
                >
                  {group}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Content Sections (Grid of Bento Resource Cards) ── */}
      <section className="space-y-10" aria-live="polite">
        {visibleSections.map((section) => (
          <div key={section.title} className="space-y-4">
            <div className="flex items-center justify-between border-b border-primary/10 pb-3">
              <h2 className="font-headline text-headline-md text-primary font-bold">
                {section.title}
              </h2>
              <span className="font-body text-caption font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                {section.files.length} ملفات
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.files.map((file, index) => {
                const displayItem: DisplayFileItem = {
                  ...file,
                  author: "من إعداد: إدارة المنصة",
                  isTeacherContent: false,
                };
                return (
                  <FadeInSection key={file.path} delay={index * 60}>
                    <FileCard file={displayItem} />
                  </FadeInSection>
                );
              })}
            </div>
          </div>
        ))}

        {/* Teacher Contributions Section */}
        {teacherFiles.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-primary/10">
            <div className="flex items-center justify-between border-b border-primary/10 pb-3">
              <h2 className="font-headline text-headline-md text-primary font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">school</span>
                <span>مساهمات ودروس الأساتذة المعتمدين</span>
              </h2>
              <span className="font-body text-caption font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                {teacherFiles.length} ملفات
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teacherFiles.map((file, index) => (
                <FadeInSection key={file.path} delay={index * 60}>
                  <FileCard file={file} />
                </FadeInSection>
              ))}
            </div>
          </div>
        )}

        {/* Exam collection (science only) */}
        {content.examCollection && (!hasGroups || activeGroup === groups[groups.length - 1]) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-primary/10 pb-3">
              <h2 className="font-headline text-headline-md text-primary font-bold">
                {content.examCollection.title}
              </h2>
              <span className="font-body text-caption font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                أرشيف شامل
              </span>
            </div>

            <FadeInSection delay={0}>
              <div className="bg-surface-bright border border-primary/10 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="font-headline text-headline-md text-primary font-bold mb-1">
                      تحميل جميع الاختبارات التجريبية
                    </h3>
                    <p className="font-body text-body-md text-on-surface-variant">
                      ملف أرشيف واحد يحتوي على اختبارات {content.examCollection.schools.length} ثانوية نموذجية عبر الوطن.
                    </p>
                    <p className="font-body text-caption font-semibold text-on-surface-variant mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-primary/70">verified</span>
                      <span>من إعداد: إدارة المنصة</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    className="bg-primary text-on-primary font-body text-label-md font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    href={
                      content.examCollection.downloadPath.startsWith("http")
                        ? content.examCollection.downloadPath
                        : `https://moudabouacha09-lab.github.io/The-Ultimate-Bac-Help/${content.examCollection.downloadPath.replace("/materials/", "")}`
                    }
                    download
                  >
                    <Download size={18} />
                    <span>تحميل الأرشيف</span>
                  </a>
                </div>
              </div>
            </FadeInSection>
          </div>
        )}
      </section>
    </div>
  );
}



