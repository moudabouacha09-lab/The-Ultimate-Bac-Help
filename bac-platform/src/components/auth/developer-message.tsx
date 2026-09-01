// src/components/auth/developer-message.tsx
"use client";

import { useAuth } from "@/context/auth-context";

export function DeveloperMessage() {
  const { user, openAuthModal } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-gutter my-6">
      <aside
        className="bg-surface-container-low border border-primary/10 rounded-xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
        aria-label="رسالة من المطور"
      >
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-lg">
            ✦
          </div>
          <div>
            <strong className="font-headline text-label-md text-primary font-bold block mb-1">
              {user ? "شكراً لتسجيل الدخول" : "نرجو منكم تسجيل الدخول"}
            </strong>
            <p className="font-body text-body-md text-on-surface-variant leading-relaxed">
              {user
                ? "سنضيف قريباً ميزات فريدة ستفيد كل واحد منكم حسب مستواه في اختباراتنا لتحسين تجربتكم. بالتوفيق!"
                : "سنضيف قريباً ميزات فريدة ستفيد كل واحد منكم حسب مستواه في اختباراتنا لتحسين تجربتكم. سجّل الآن، وبالتوفيق!"}
            </p>
          </div>
        </div>

        {!user && (
          <button
            type="button"
            onClick={() => openAuthModal("register")}
            className="bg-primary text-on-primary font-body text-label-md px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shrink-0 shadow-sm font-medium cursor-pointer"
          >
            تسجيل الدخول
          </button>
        )}
      </aside>
    </div>
  );
}

