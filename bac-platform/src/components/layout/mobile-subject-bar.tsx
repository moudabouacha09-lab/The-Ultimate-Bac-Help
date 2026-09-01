"use client";

import Link from "next/link";
import { useState, type UIEvent } from "react";
import { subjects } from "@/lib/subjects";

interface MobileSubjectBarProps {
  activeSubject?: string;
}

export function MobileSubjectBar({ activeSubject }: MobileSubjectBarProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const maxScroll = target.scrollWidth - target.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      return;
    }
    // Cross-browser RTL handling: Math.abs handles negative scrollLeft (Chrome/Firefox) and positive (Safari)
    const currentScroll = Math.abs(target.scrollLeft);
    const progress = Math.min(100, Math.max(0, (currentScroll / maxScroll) * 100));
    setScrollProgress(progress);
  };

  return (
    <nav className="mobile-subject-bar" aria-label="المواد الدراسية الجوال">
      <div className="mobile-subject-scroller" onScroll={handleScroll}>
        {subjects.map((subject) => {
          const isActive = subject.slug === activeSubject;
          return (
            <Link
              key={subject.slug}
              href={`/subject/${subject.slug}`}
              className={`mobile-subject-pill ${isActive ? "is-active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="material-symbols-outlined text-base" aria-hidden="true">
                {subject.icon}
              </span>
              <span className="mobile-subject-label">{subject.name}</span>
            </Link>
          );
        })}
      </div>
      <div className="mobile-subject-progress-track">
        <div
          className="mobile-subject-progress-fill"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </nav>
  );
}

