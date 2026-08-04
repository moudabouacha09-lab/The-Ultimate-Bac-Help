"use client";

import Link from "next/link";
import { subjects } from "@/lib/subjects";

interface MobileSubjectBarProps {
  activeSubject?: string;
}

export function MobileSubjectBar({ activeSubject }: MobileSubjectBarProps) {
  return (
    <nav className="mobile-subject-bar" aria-label="المواد الدراسية الجوال">
      <div className="mobile-subject-scroller">
        {subjects.map((subject) => {
          const isActive = subject.slug === activeSubject;
          return (
            <Link
              key={subject.slug}
              href={`/subject/${subject.slug}`}
              className={`mobile-subject-pill ${isActive ? "is-active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className={`subject-icon subject-icon-${subject.color}`} aria-hidden="true">
                {subject.icon}
              </span>
              <span className="mobile-subject-label">{subject.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
