// src/components/layout/app-shell.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { subjects } from "@/lib/subjects";
import { BottomNav } from "@/components/layout/bottom-nav";
import { UserMenu } from "@/components/auth/user-menu";
import { AuthModal } from "@/components/auth/auth-modal";
import { SurveyModal } from "@/components/survey/survey-modal";
import { Bell } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { createClient } from "@/lib/supabase/client";

type AppShellProps = {
  children: ReactNode;
  activeSubject?: string;
};

/* Map subject slugs to Material Symbols icon names */
const subjectIcons: Record<string, string> = {
  math: "functions",
  science: "biotech",
  physics: "maps",
  arabic: "menu_book",
  philosophy: "psychology",
  "history-geography": "public",
  "islamic-studies": "mosque",
  english: "language",
  french: "translate",
};

export function AppShell({ children, activeSubject }: AppShellProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    let active = true;
    const loadUnread = async () => {
      if (!user) { setUnreadNotifications(0); return; }
      const { count } = await supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("is_read", false);
      if (active) setUnreadNotifications(count ?? 0);
    };
    loadUnread();
    return () => { active = false; };
  }, [user, pathname]);

  const navLinks = [
    { href: "/", label: "الرئيسية", active: pathname === "/" },
    { href: "/subject", label: "المواد", active: pathname.startsWith("/subject") },
    { href: "/exams", label: "الاختبارات والسلاسل", active: pathname.startsWith("/exams") },
    { href: "/tools", label: "الأدوات", active: pathname.startsWith("/tools") },
    { href: "/progress", label: "تقدمي", active: pathname.startsWith("/progress") },
    { href: "/analytics", label: "التحليلات", active: pathname.startsWith("/analytics") },
    { href: "/team", label: "فريق العمل", active: pathname.startsWith("/team") },
    { href: "/questions", label: "الأسئلة", active: pathname.startsWith("/questions") },
    { href: "/notifications", label: "الإشعارات", active: pathname.startsWith("/notifications"), icon: <Bell size={16} aria-hidden="true" /> },
    ...(user && (user.role === "teacher" || user.role === "admin") ? [{ href: "/contribute/questions", label: "أسئلة المساهمين", active: pathname.startsWith("/contribute/questions") }] : []),
  ];


  return (
    <div className="flex flex-col min-h-screen">
      <a className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-primary focus:text-on-primary focus:p-3" href="#main-content">
        تخطي إلى المحتوى
      </a>

      {/* Auth Modal overlay */}
      <AuthModal />

      {/* ── Top Navbar ── */}
      <header className="fixed top-0 w-full border-b border-primary/10 bg-surface-bright flex flex-row-reverse justify-between items-center px-gutter h-16 z-50">
        {/* Brand (right side in RTL) */}
        <Link href="/" className="flex items-center gap-md font-headline text-headline-lg font-bold text-primary" aria-label="منصة البكالوريا - الصفحة الرئيسية">
          <span>منصة البكالوريا</span>
        </Link>

        {/* Center Nav Links — desktop only */}
        <nav className="hidden md:flex gap-lg" aria-label="التنقل الرئيسي">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                link.active
                  ? "text-primary font-bold border-b-2 border-primary pb-1 font-body text-label-md"
                  : "text-on-surface-variant hover:text-primary transition-colors font-body text-label-md"
              }
            >
              {link.icon && <span className="relative inline-flex align-middle ml-1">{link.icon}{link.href === "/notifications" && unreadNotifications > 0 && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-surface-bright" aria-label={`${unreadNotifications} إشعارات غير مقروءة`} />}</span>}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Left actions */}
        <div className="flex items-center gap-md">
          {/* Desktop login button area */}
          <div className="hidden md:block">
            <UserMenu />
          </div>
          {/* Mobile profile icon */}
          <div className="md:hidden">
            <UserMenu />
          </div>
        </div>
      </header>

      {/* ── Layout: Main + Sidebar ── */}
      <div className="flex w-full pt-16">
        {/* Main content */}
        <main className="flex-1 pb-20 md:pb-0 md:pl-0 md:pr-sidebar-width w-full" id="main-content">
          {children}
        </main>

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden md:flex flex-col fixed right-0 top-0 h-full w-[280px] pt-16 z-40 border-l border-primary/10 bg-surface-container overflow-y-auto">
          {/* Sidebar header */}
          <div className="p-6 pb-2 border-b border-primary/5">
            <h2 className="font-headline text-headline-md font-semibold text-primary">المواد الدراسية</h2>
            <p className="text-caption text-on-surface-variant mt-1">تحضير البكالوريا 2027</p>
          </div>

          {/* Subject nav links */}
          <nav className="flex-1 py-4 flex flex-col gap-1">
            {subjects.map((subject) => {
              const isActive = subject.slug === activeSubject;
              return (
                <Link
                  key={subject.slug}
                  href={`/subject/${subject.slug}`}
                  className={`flex flex-row-reverse items-center gap-md px-4 py-3 transition-all font-body text-label-md ${
                    isActive
                      ? "bg-primary/10 text-primary font-bold border-r-2 border-primary"
                      : "text-on-surface-variant hover:bg-primary/5"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="material-symbols-outlined text-[20px]">{subject.icon}</span>
                  <span className="flex-1 text-right">{subject.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <BottomNav />

      {/* Survey Modal */}
      <SurveyModal />
    </div>
  );
}
