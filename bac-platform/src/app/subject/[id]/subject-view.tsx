"use client";

import { useState } from "react";
import type { FileItem, SubjectContent } from "@/data/bac-content";
import type { Subject } from "@/lib/subjects";

const formatIcons: Record<string, { icon: string; label: string }> = {
  pdf: { icon: "PDF", label: "PDF" },
  png: { icon: "🖼", label: "صورة" },
  jpg: { icon: "🖼", label: "صورة" },
  html: { icon: "🌐", label: "موقع تفاعلي" },
  m4a: { icon: "🎧", label: "صوتي" },
  docx: { icon: "W", label: "Word" },
  rar: { icon: "📦", label: "أرشيف" },
  zip: { icon: "📦", label: "أرشيف" },
};

function FileCard({ file }: { file: FileItem }) {
  const info = formatIcons[file.format] ?? { icon: "📄", label: file.format };
  const isPreview = file.type === "preview";

  const getFileUrl = (path: string) => {
    if (path.startsWith('http')) return path;
    return `https://moudabouacha09-lab.github.io/The-Ultimate-Bac-Help/${path.replace('/materials/', '')}`;
  };

  return (
    <article className="file-card">
      <span className={`file-icon file-icon-${file.format}`} aria-hidden="true">{info.icon}</span>
      <div className="file-card-body">
        <h3>{file.title}</h3>
        <span className="file-format-badge">{info.label}</span>
      </div>
      {isPreview ? (
        <a className="file-action file-action-preview" href={getFileUrl(file.path)} target="_blank" rel="noopener noreferrer">👁️ معاينة</a>
      ) : (
        <a className="file-action file-action-download" href={getFileUrl(file.path)} download>⬇️ تحميل</a>
      )}
    </article>
  );
}

export default function SubjectView({ subject, content }: { subject: Subject, content: SubjectContent }) {
  /* Extract unique groups. If no groups, treat as flat. */
  const groups = [...new Set(content.sections.map((s) => s.group).filter(Boolean))] as string[];
  const hasGroups = groups.length > 0;

  const [activeGroup, setActiveGroup] = useState(groups[0] ?? "");

  const visibleSections = hasGroups
    ? content.sections.filter((s) => s.group === activeGroup)
    : content.sections;

  return (
    <>
      <section className="subject-page-heading">
        <div>
          <p className="eyebrow">مادة دراسية</p>
          <h1>{subject.name}</h1>
          <p>حمّل الملفات، شاهد المواقع التفاعلية، واستعد للبكالوريا.</p>
        </div>
        <span className={`subject-hero-icon subject-icon-${subject.color}`} aria-hidden="true">
          {subject.icon}
        </span>
      </section>

      {/* Group tabs (only for subjects with groups) */}
      {hasGroups && (
        <nav className="subject-tabs" aria-label={`أقسام مادة ${subject.name}`}>
          {groups.map((group) => (
            <button
              className={`subject-tab ${activeGroup === group ? "is-active" : ""}`}
              key={group}
              onClick={() => setActiveGroup(group)}
              type="button"
            >
              {group}
            </button>
          ))}
        </nav>
      )}

      {/* Content sections */}
      <section className="subject-content" aria-live="polite">
        {visibleSections.map((section) => (
          <div className="content-section" key={section.title}>
            <div className="content-section-heading">
              <h2>{section.title}</h2>
              <span className="content-count">{section.files.length} ملفات</span>
            </div>
            <div className="file-grid">
              {section.files.map((file) => (
                <FileCard file={file} key={file.path} />
              ))}
            </div>
          </div>
        ))}

        {/* Exam collection (science only) */}
        {content.examCollection && (!hasGroups || activeGroup === groups[groups.length - 1]) && (
          <div className="exam-collection">
            <div className="content-section-heading">
              <h2>{content.examCollection.title}</h2>
            </div>
            <div className="exam-collection-card">
              <div className="exam-collection-info">
                <span className="file-icon file-icon-rar" aria-hidden="true">📦</span>
                <div>
                  <h3>تحميل كل الاختبارات التجريبية</h3>
                  <p>ملف أرشيف واحد يحتوي على اختبارات {content.examCollection.schools.length} ثانوية</p>
                </div>
                <a 
                  className="file-action file-action-download exam-collection-btn" 
                  href={content.examCollection.downloadPath.startsWith('http') ? content.examCollection.downloadPath : `https://moudabouacha09-lab.github.io/The-Ultimate-Bac-Help/${content.examCollection.downloadPath.replace('/materials/', '')}`} 
                  download
                >
                  تحميل الأرشيف
                </a>
              </div>
              <details className="school-list-details">
                <summary>عرض قائمة الثانويات ({content.examCollection.schools.length})</summary>
                <ul className="school-list">
                  {content.examCollection.schools.map((school) => (
                    <li key={school}>{school}</li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
