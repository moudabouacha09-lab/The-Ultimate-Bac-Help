"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

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
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center py-2 px-4 pb-safe bg-surface-bright z-50 rounded-t-xl border-t border-primary/10 shadow-sm">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 active:scale-95 ${
            item.isActive
              ? "text-secondary font-bold"
              : "text-on-surface-variant hover:text-primary"
          }`}
          aria-current={item.isActive ? "page" : undefined}
        >
          <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
          <span className="text-[11px] font-medium mt-0.5">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
