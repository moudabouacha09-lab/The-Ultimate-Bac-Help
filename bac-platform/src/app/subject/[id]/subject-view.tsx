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
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) return filePath;

    if (typeof window !== "undefined" && window.location && window.location.hostname.includes("github.io")) {
      const relativePath = filePath.replace(/^\/materials\//, "");
      const encodedRelativePath = relativePath.split("/").map(encodeURIComponent).join("/");
      return `https://raw.githubusercontent.com/moudabouacha09-lab/The-Ultimate-Bac-Help/main/${encodedRelativePath}`;
    }

    const cleanPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
    const segments = cleanPath.split("/").map((seg) => encodeURIComponent(seg));
    const encodedPath = segments.join("/");
    const query = isDownload ? "?download=1" : "";
    return `${encodedPath}${query}`;
  };

  return (
    <article className="file-card">
      {/* Right Side: Content Block */}
      <div className="card-content">
        <div className="title-row">
          <span className="file-badge-icon" aria-hidden="true">{info.icon}</span>
          <h3 className="file-title" title={file.title}>{file.title}</h3>
        </div>
        <p className="file-type">{info.label}</p>
      </div>

      {/* Left Side: Actions Block (Always stays locked on the left) */}
      <div className="card-actions-wrapper">
        {!isPreview && (
          <a className="btn btn-download" href={getFileUrl(file.path, true)} download>
            <Download size={20} className="btn-icon" />
            <span>تحميل</span>
          </a>
        )}
        <a className="btn btn-preview" href={getFileUrl(file.path, false)} target="_blank" rel="noopener noreferrer">
          <Eye size={20} className="btn-icon" />
          <span>معاينة</span>
        </a>
      </div>
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
    <div className="main-content-grid">
      {/* 1. Target the component wrapper housing your page header text elements */}
      <div className="subject-page-header-container">
        <span className="subject-global-tag">مادة دراسية</span>
        
        <div className="subject-global-identity-row">
          <h1 className="subject-global-main-title">{subject.name}</h1>
          <span className="subject-global-badge">{subject.icon}</span>
        </div>
        
        <p className="subject-global-description">
          حمّل الملفات، شاهد المواقع التفاعلية، واستعد للبكالوريا.
        </p>
      </div>

      {/* 2. Target the filter pill element wrapper row directly underneath */}
      {hasGroups && (
        <div className="subject-filters-row" aria-label={`أقسام مادة ${subject.name}`}>
          <div className="segmented-control-track">
            {groups.map((group) => (
              <button
                className={`segmented-tab-btn ${activeGroup === group ? "is-active" : ""}`}
                key={group}
                onClick={() => setActiveGroup(group)}
                type="button"
              >
                {group}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content sections */}
      <section className="subject-content-container" aria-live="polite">
        {visibleSections.map((section) => (
          <div className="section-block" key={section.title}>
            <div className="section-grid-header">
              <span className="file-count">{section.files.length} ملفات</span>
              <h2 className="unit-title">{section.title}</h2>
            </div>
            <div className="file-grid">
              {section.files.map((file, index) => (
                <FadeInSection key={file.path} delay={index * 80}>
                  <FileCard file={file} />
                </FadeInSection>
              ))}
            </div>
          </div>
        ))}

        {/* Exam collection (science only) */}
        {content.examCollection && (!hasGroups || activeGroup === groups[groups.length - 1]) && (
          <div className="section-block">
            <div className="section-grid-header">
              <span className="file-count">أرشيف</span>
              <h2 className="unit-title">{content.examCollection.title}</h2>
            </div>

            <FadeInSection delay={0}>
              <div className="file-card compilation-card">
                {/* Left Actions Block */}
                <div className="card-actions-wrapper compilation-actions">
                  <a 
                    className="btn btn-download" 
                    href={content.examCollection.downloadPath.startsWith('http') ? content.examCollection.downloadPath : `https://moudabouacha09-lab.github.io/The-Ultimate-Bac-Help/${content.examCollection.downloadPath.replace('/materials/', '')}`} 
                    download
                  >
                    <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>تحميل الأرشيف</span>
                  </a>
  
                  <details className="school-list-details">
                    <summary className="secondary-action-link">
                      <span>عرض قائمة الثانويات ({content.examCollection.schools.length})</span>
                      <span className="arrow-indicator">←</span>
                    </summary>
                    <ul className="school-list">
                      {content.examCollection.schools.map((school) => (
                        <li key={school}>{school}</li>
                      ))}
                    </ul>
                  </details>
                </div>
  
                {/* Right Content Block */}
                <div className="card-content">
                  <div className="title-row">
                    <span className="file-badge-icon" aria-hidden="true">📦</span>
                    <h3 className="file-title">تحميل كل الاختبارات التجريبية</h3>
                  </div>
                  <p className="file-type">ملف أرشيف واحد يحتوي على اختبارات {content.examCollection.schools.length} ثانوية</p>
                </div>
              </div>
            </FadeInSection>
          </div>
        )}
      </section>
    </div>
  );
}
