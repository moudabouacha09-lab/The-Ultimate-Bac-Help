import Link from "next/link";
import type { ReactNode } from "react";
import { subjects } from "@/lib/subjects";

type AppShellProps = {
  children: ReactNode;
  activeSubject?: string;
};

export function AppShell({ children, activeSubject }: AppShellProps) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">تخطي إلى المحتوى</a>

      <header className="navbar">
        <Link className="brand" href="/" aria-label="باك الجزائر - الصفحة الرئيسية">
          <span className="brand-mark">ب</span>
          <span>
            <strong>باك الجزائر</strong>
            <small>رفيقك في التحضير</small>
          </span>
        </Link>

        <nav className="top-nav" aria-label="التنقل الرئيسي">
          <Link href="/tools">أدوات المراجعة</Link>
          <Link href="/calculator">حاسبة المعدل</Link>
        </nav>
      </header>

      <aside className="sidebar" aria-label="المواد الدراسية">
        <div className="sidebar-heading">
          <span>المواد الدراسية</span>
          <span className="badge">BAC</span>
        </div>
        <nav className="subject-list">
          {subjects.map((subject) => {
            const isActive = subject.slug === activeSubject;
            return (
              <Link
                className={`subject-link ${isActive ? "is-active" : ""}`}
                href={`/subject/${subject.slug}`}
                key={subject.slug}
                aria-current={isActive ? "page" : undefined}
              >
                <span className={`subject-icon subject-icon-${subject.color}`} aria-hidden="true">
                  {subject.icon}
                </span>
                <span>{subject.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-card">
          <span aria-hidden="true">✦</span>
          <p>ابدأ بمراجعة قصيرة اليوم.</p>
          <Link href="/subject/physics">ابدأ المراجعة</Link>
        </div>
      </aside>

      <main className="main-content" id="main-content">{children}</main>
    </div>
  );
}
