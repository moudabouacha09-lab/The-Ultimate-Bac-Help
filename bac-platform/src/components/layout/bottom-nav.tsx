"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { createClient } from "@/lib/supabase/client";

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    let active = true;
    if (!user) { setUnread(0); return () => { active = false; }; }
    supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("is_read", false)
      .then(({ count }) => { if (active) setUnread(count ?? 0); });
    return () => { active = false; };
  }, [user, pathname]);

  const navItems = [
    {
      label: "الرئيسية",
      href: "/",
      isActive: pathname === "/",
      icon: "home"
    },
    {
      label: "المواد",
      href: "/subject",
      isActive: pathname.startsWith("/subject"),
      icon: "dashboard"
    },
    {
      label: "الاختبارات",
      href: "/exams",
      isActive: pathname.startsWith("/exams"),
      icon: "quiz"
    },
    {
      label: "الأدوات",
      href: "/tools",
      isActive: pathname.startsWith("/tools"),
      icon: "construction"
    },

    {
      label: "تقدمي",
      href: "/progress",
      isActive: pathname.startsWith("/progress"),
      icon: "trending_up"
    },
    {
      label: "التحليلات",
      href: "/analytics",
      isActive: pathname.startsWith("/analytics"),
      icon: "analytics"
    },
    {
      label: "الأسئلة",
      href: "/questions",
      isActive: pathname.startsWith("/questions") || pathname.startsWith("/contribute/questions"),
      icon: "forum"
    },
    {
      label: "الإشعارات",
      href: "/notifications",
      isActive: pathname.startsWith("/notifications"),
      icon: "notifications"
    },
    ...(user && (user.role === "teacher" || user.role === "admin") ? [{
      label: "المساهمون",
      href: "/contribute/questions",
      isActive: pathname.startsWith("/contribute/questions"),
      icon: "school"
    }] : [])
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex overflow-x-auto scrollbar-none justify-start gap-1 items-center py-2 px-2 pb-safe bg-surface-bright/95 backdrop-blur-md z-50 rounded-t-2xl border-t border-primary/10 shadow-[0_-4px_20px_rgba(0,52,43,0.06)]">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex min-w-[60px] flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 active:scale-95 ${
            item.isActive
              ? "bg-primary/10 text-primary font-bold shadow-xs"
              : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
          }`}
          aria-current={item.isActive ? "page" : undefined}
        >
          <span className="relative material-symbols-outlined text-[22px]">
            {item.icon}
            {item.href === "/notifications" && unread > 0 && (
              <span
                className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-secondary ring-2 ring-surface-bright"
                aria-label="إشعارات غير مقروءة"
              />
            )}
          </span>
          <span className="text-[11px] font-medium mt-0.5 tracking-tight">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
