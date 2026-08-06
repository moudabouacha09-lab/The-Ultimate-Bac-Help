import Link from "next/link";
import type { ReactNode } from "react";
import { subjects } from "@/lib/subjects";
import { BottomNav } from "@/components/layout/bottom-nav";
import { MobileSubjectBar } from "@/components/layout/mobile-subject-bar";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Sparkles } from "lucide-react";
import { FloatingAssistant } from "@/components/assistant/floating-assistant";
import { SurveyModal } from "@/components/survey/survey-modal";

type AppShellProps = {
  children: ReactNode;
  activeSubject?: string;
};

export function AppShell({ children, activeSubject }: AppShellProps) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">تخطي إلى المحتوى</a>

      {/* Desktop transparent header */}
      <header className="navbar">
        <Link className="brand" href="/" aria-label="باك الجزائر - الصفحة الرئيسية">
          <span className="brand-mark">ب</span>
          <span>
            <strong>باك الجزائر</strong>
            <small>رفيقك في التحضير</small>
          </span>
        </Link>

        <nav className="top-nav" aria-label="التنقل الرئيسي">
          <Link href="/progress">تقدمي في الدروس</Link>
          <Link href="/tools">أدوات المراجعة</Link>
          <Link href="/calculator">حاسبة المعدل</Link>
        </nav>

        <ThemeToggle />
      </header>

      {/* Mobile-only smart header with horizontal subjects navigation bar */}
      <div className="mobile-header-wrapper">
        <div className="mobile-brand-bar">
          <Link className="brand" href="/">
            <span className="brand-mark">ب</span>
            <strong>باك الجزائر</strong>
          </Link>
          <div className="mobile-brand-actions">
            <span className="mobile-motivation-badge">🎯 دفعة 2026/2027</span>
            <ThemeToggle />
          </div>
        </div>
        <MobileSubjectBar activeSubject={activeSubject} />
      </div>

      {/* Desktop sidebar */}
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
          <span aria-hidden="true" style={{ display: 'grid', placeItems: 'center' }}><Sparkles size={24} /></span>
          <p>ابدأ بمراجعة قصيرة اليوم.</p>
          <Link href="/tools">ابدأ المراجعة</Link>
        </div>
      </aside>

      <main className="main-content" id="main-content">{children}</main>

      {/* Enhanced mobile bottom nav */}
      <BottomNav />

      {/* 🤖 Floating AI Assistant (Disabled temporarily until further notice) */}
      {/* <FloatingAssistant /> */}

      {/* 🚀 Survey Modal for first-time visitors */}
      <SurveyModal />
    </div>
  );
}
