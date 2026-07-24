"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";

// تاريخ البكالوريا المتوقع
const nextExamDate = new Date("2027-06-07T08:00:00+01:00");

type Countdown = { days: number; hours: number; minutes: number };

function getCountdown(): Countdown {
  const remaining = Math.max(0, nextExamDate.getTime() - Date.now());
  const totalMinutes = Math.floor(remaining / 60000);
  return {
    days: Math.floor(totalMinutes / (60 * 24)),
    hours: Math.floor((totalMinutes % (60 * 24)) / 60),
    minutes: totalMinutes % 60
  };
}

function CountdownCard() {
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    setCountdown(getCountdown());
    const timer = window.setInterval(() => setCountdown(getCountdown()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const values = countdown ?? { days: 0, hours: 0, minutes: 0 };

  return (
    <section className="countdown-card" aria-label="العد التنازلي للبكالوريا">
      <div>
        <p className="eyebrow countdown-eyebrow">🚀 Plus Ultra · الاستعداد يصنع الفرق</p>
        <h2>الوقت المتبقي للبكالوريا</h2>
        <p className="countdown-date">الدورة القادمة المتوقعة · جوان 2027</p>
      </div>
      <div className="countdown-values" aria-live="polite">
        <div><strong>{values.days}</strong><span>يوم</span></div>
        <b>:</b>
        <div><strong>{String(values.hours).padStart(2, "0")}</strong><span>ساعة</span></div>
        <b>:</b>
        <div><strong>{String(values.minutes).padStart(2, "0")}</strong><span>دقيقة</span></div>
      </div>
    </section>
  );
}

const quickLinks = [
  { href: "/subject/science", icon: "🧬", title: "العلوم الطبيعية", text: "دروس وتمارين وملخصات مجالات البروتين والجيولوجيا", tone: "blue" },
  { href: "/subject/math", icon: "∑", title: "الرياضيات", text: "سلاسل الأستاذ نور الدين والاحتمالات والدوال", tone: "green" },
  { href: "/subject/physics", icon: "⚛", title: "الفيزياء", text: "تأشيرة النجاح، الأسئلة النظرية والمواضيع", tone: "violet" }
] as const;

const updates = [
  "تم تحديث تجميعة بكالوريات العلوم التجريبية 2026 (أكثر من 35 ثانوية)",
  "إضافة مذكرات الذكاء الاصطناعي التفاعلية Google NotebookLM لجميع المواد",
  "تعديل وتحديث حاسبة المعدل وفق المعاملات الرسمية لجميع الشعب"
];

export default function HomePage() {
  return (
    <AppShell>
      <section className="home-intro">
        <p className="eyebrow">مرحباً بك في منصة البكالوريا الجزائرية</p>
        <h1>خطوتك التالية نحو المرتبة الأولى.</h1>
        <p>نظّم مراجعتك، احسب معدلك، واستعن بأفضل المراجع المصممة خصيصاً لتفوقك.</p>
      </section>

      <CountdownCard />

      <section className="dashboard-section" aria-labelledby="quick-links-title">
        <div className="dashboard-section-heading">
          <h2 id="quick-links-title">انطلاقة سريعة</h2>
          <span>المواد الأكثر مراجعة</span>
        </div>
        <div className="quick-links-grid">
          {quickLinks.map((link) => (
            <Link className="quick-link-card" href={link.href} key={link.href}>
              <span className={`quick-link-icon quick-link-${link.tone}`} aria-hidden="true">{link.icon}</span>
              <span><strong>{link.title}</strong><small>{link.text}</small></span>
              <span className="quick-link-arrow" aria-hidden="true">←</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="updates-widget" aria-labelledby="updates-title">
        <div className="dashboard-section-heading">
          <h2 id="updates-title">آخر الإضافات والتحديثات</h2>
          <span className="updates-live">تحديث مستمر</span>
        </div>
        <ul>
          {updates.map((update) => <li key={update}><span aria-hidden="true">✦</span>{update}</li>)}
        </ul>
      </section>
    </AppShell>
  );
}
