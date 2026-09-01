"use client";

import { useAuth } from "@/context/auth-context";

export function DeveloperMessage() {
  const { user, openAuthModal } = useAuth();

  return (
    <aside className="developer-message" aria-label="رسالة من المطور">
      <span className="developer-message-mark" aria-hidden="true">✦</span>
      <div>
        <strong>{user ? "شكراً لتسجيل الدخول" : "نرجو منكم تسجيل الدخول"}</strong>
        <p>
          {user
            ? "سنضيف قريباً ميزات فريدة ستفيد كل واحد منكم حسب مستواه في اختباراتنا لتحسين تجربتكم. بالتوفيق!"
            : "سنضيف قريباً ميزات فريدة ستفيد كل واحد منكم حسب مستواه في اختباراتنا لتحسين تجربتكم. سجّل الآن، وبالتوفيق!"}
        </p>
      </div>
      {!user && <button type="button" onClick={() => openAuthModal("register")}>تسجيل الدخول</button>}
    </aside>
  );
}
