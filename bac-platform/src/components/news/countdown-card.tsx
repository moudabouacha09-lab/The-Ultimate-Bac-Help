// src/components/news/countdown-card.tsx
"use client";

import { useEffect, useState } from "react";

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
    <div className="bg-surface-container-highest/50 backdrop-blur-sm border border-primary/10 rounded-xl p-6 md:p-8 inline-block shadow-sm">
      <p className="font-body text-label-md text-primary font-medium mb-4">الوقت المتبقي لامتحان البكالوريا (دورة جوان 2027)</p>
      <div className="flex gap-4 md:gap-8 justify-center text-center rtl:flex-row-reverse" aria-live="polite">
        <div className="flex flex-col">
          <span className="font-headline text-headline-lg text-primary font-bold bg-surface-bright border border-primary/10 rounded-lg w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-sm">
            {values.days}
          </span>
          <span className="font-body text-caption text-on-surface-variant mt-2">يوم</span>
        </div>
        <div className="text-headline-lg text-primary/50 font-bold self-center -mt-6">:</div>
        <div className="flex flex-col">
          <span className="font-headline text-headline-lg text-primary font-bold bg-surface-bright border border-primary/10 rounded-lg w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-sm">
            {String(values.hours).padStart(2, "0")}
          </span>
          <span className="font-body text-caption text-on-surface-variant mt-2">ساعة</span>
        </div>
        <div className="text-headline-lg text-primary/50 font-bold self-center -mt-6">:</div>
        <div className="flex flex-col">
          <span className="font-headline text-headline-lg text-primary font-bold bg-surface-bright border border-primary/10 rounded-lg w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-sm">
            {String(values.minutes).padStart(2, "0")}
          </span>
          <span className="font-body text-caption text-on-surface-variant mt-2">دقيقة</span>
        </div>
      </div>
    </div>
  );
}

