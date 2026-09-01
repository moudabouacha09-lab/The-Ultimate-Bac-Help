// src/app/subject/[id]/subject-view.tsx
"use client";

import { useState } from "react";
import type { FileItem, SubjectContent } from "@/data/bac-content";
import type { Subject } from "@/lib/subjects";
import { Eye, Download, Package } from "lucide-react";
import type { ReactNode } from "react";
import { FadeInSection } from "@/components/effects/fade-in-section";

const formatIcons: Record<string, { icon: ReactNode; label: string }> = {
  pdf: { icon: "PDF", label: "PDF" },
  png: { icon: "🖼", label: "صورة" },
  jpg: { icon: "🖼", label: "صورة" },
  html: { icon: "🌐", label: "موقع تفاعلي" },
  m4a: { icon: "🎧", label: "صوتي" },
  docx: { icon: "W", label: "Word" },
  rar: { icon: <Package size={20} />, label: "أرشيف" },
  zip: { icon: <Package size={20} />, label: "أرشيف" },
};

function FileCard({ file }: { file: FileItem }) {
  const info = formatIcons[file.format] ?? { icon: "PDF", label: file.format };
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
    <article className="group bg-surface-bright border border-primary/10 rounded-xl p-4 md:p-6 hover:border-primary/30 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row justify-between md:items-center gap-4">
      {/* Content Block */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-caption">
          {info.icon}
        </div>
        <div>
          <h3 className="font-body text-label-md font-bold text-on-surface group-hover:text-primary transition-colors">
            {file.title}
          </h3>
          <span className="font-body text-caption text-on-surface-variant">
            {info.label}
          </span>
        </div>
      </div>

      {/* Actions Block */}
      <div className="flex items-center gap-2 self-end md:self-center">
        {!isPreview && (
          <a
            className="bg-primary text-on-primary font-body text-caption font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5 cursor-pointer"
            href={getFileUrl(file.path, true)}
            download
          >
            <Download size={16} />
            <span>تحميل</span>
          </a>
        )}
        <a
          className="bg-surface-container text-on-surface-variant hover:bg-surface-container-high font-body text-caption font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          href={getFileUrl(file.path, false)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Eye size={16} />
          <span>معاينة</span>
        </a>
      </div>
    </article>
  );
}

export default function SubjectView({ subject, content }: { subject: Subject; content: SubjectContent }) {
  const groups = [...new Set(content.sections.map((s) => s.group).filter(Boolean))] as string[];
  const hasGroups = groups.length > 0;

  const [activeGroup, setActiveGroup] = useState(groups[0] ?? "");

  const visibleSections = hasGroups
    ? content.sections.filter((s) => s.group === activeGroup)
    : content.sections;

  return (
    <div className="max-w-7xl mx-auto px-gutter py-xl flex flex-col gap-xl">
      {/* ── Page Header ── */}
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

        <p className="font-body text-body-lg text-on-surface-variant max-w-2xl relative z-10">
          حمّل الملخصات، المواضيع التجريبية، والتمارين الشاملة المحلولة لاستباق برنامج البكالوريا.
        </p>

        {/* Decorative background icon */}
        <span className="material-symbols-outlined text-primary/5 text-[140px] absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none select-none">
          {subject.icon}
        </span>
      </header>

      {/* ── Filter Segmented Tabs ── */}
      {hasGroups && (
        <nav className="flex flex-wrap gap-2" aria-label={`أقسام مادة ${subject.name}`}>
          {groups.map((group) => {
            const isActive = activeGroup === group;
            return (
              <button
                key={group}
                type="button"
                onClick={() => setActiveGroup(group)}
                className={`font-body text-label-md px-4 py-2 rounded-full font-medium cursor-pointer transition-all ${
                  isActive
                    ? "bg-primary text-on-primary font-bold shadow-sm"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {group}
              </button>
            );
          })}
        </nav>
      )}

      {/* ── Content Sections ── */}
      <section className="space-y-8" aria-live="polite">
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

            <div className="grid grid-cols-1 gap-3">
              {section.files.map((file, index) => (
                <FadeInSection key={file.path} delay={index * 60}>
                  <FileCard file={file} />
                </FadeInSection>
              ))}
            </div>
          </div>
        ))}

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

