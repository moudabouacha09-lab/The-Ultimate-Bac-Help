// src/components/news/countdown-card.tsx
"use client";

import { useEffect, useState } from "react";
import { Rocket } from "lucide-react";

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

export function CountdownCard() {
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    setCountdown(getCountdown());
    const timer = window.setInterval(() => setCountdown(getCountdown()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const values = countdown ?? { days: 0, hours: 0, minutes: 0 };

  return (
    <section className="countdown-card" aria-label="العد التنازلي للبكالوريا">
      <div className="countdown-info">
        <span className="badge-pulse">
          <span className="pulse-dot" aria-hidden="true" />
          <Rocket size={14} />
          دورة جوان 2027
        </span>
        <h2>الاستعداد اليومي يصنع الفارق</h2>
        <p className="countdown-date">الوقت المتبقي لانطلاق الامتحان الوطني</p>
      </div>

      <div className="countdown-values" aria-live="polite">
        <div className="countdown-unit">
          <strong>{values.days}</strong>
          <span>يوم</span>
        </div>
        <b className="countdown-separator">:</b>
        <div className="countdown-unit">
          <strong>{String(values.hours).padStart(2, "0")}</strong>
          <span>ساعة</span>
        </div>
        <b className="countdown-separator">:</b>
        <div className="countdown-unit">
          <strong>{String(values.minutes).padStart(2, "0")}</strong>
          <span>دقيقة</span>
        </div>
      </div>
    </section>
  );
}
