// src/app/page.tsx
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { CountdownCard } from "@/components/news/countdown-card";
import { subjects } from "@/lib/subjects";
import bacContent from "@/data/bac-content";
import { DeveloperMessage } from "@/components/auth/developer-message";

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

export default function HomePage() {
  // Compute total file count across all subjects
  let totalFiles = 0;
  const subjectFileCounts: Record<string, number> = {};

  Object.entries(bacContent).forEach(([slug, content]) => {
    let count = 0;
    content.sections.forEach((sec) => {
      count += sec.files.length;
    });
    subjectFileCounts[slug] = count;
    totalFiles += count;
  });

  return (
    <AppShell>
      {/* ── Hero Section ── */}
      <section className="relative bg-surface-container-low px-gutter py-12 md:py-xl border-b border-primary/5 overflow-hidden">
        {/* Decorative background blur blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <h1 className="font-headline text-display-lg text-primary mb-4 md:mb-6">
            استعد للبكالوريا بثقة
          </h1>
          <p className="font-body text-body-lg text-on-surface-variant mb-8 max-w-2xl mx-auto">
            منصتك الشاملة للمراجعة، امتحانات سابقة، وأدوات تنظيم الوقت لضمان نجاحك.
          </p>

          {/* Countdown Timer */}
          <CountdownCard />
        </div>
      </section>

      <DeveloperMessage />

      {/* ── Content Sections Wrapper ── */}
      <div className="max-w-7xl mx-auto px-gutter py-xl flex flex-col gap-xl">
        {/* ── 1. Stats Row ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
          <div className="bg-surface-bright border border-primary/10 rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">library_books</span>
            </div>
            <div>
              <p className="font-headline text-headline-md text-primary font-bold">+{totalFiles}</p>
              <p className="font-body text-label-md text-on-surface-variant">ملف دراسي وملخص منتقى</p>
            </div>
          </div>

          <div className="bg-surface-bright border border-primary/10 rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">volunteer_activism</span>
            </div>
            <div>
              <p className="font-headline text-headline-md text-secondary font-bold">100%</p>
              <p className="font-body text-label-md text-on-surface-variant">مجاني بالكامل لكل الطلاب</p>
            </div>
          </div>

          <div className="bg-surface-bright border border-primary/10 rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">shield</span>
            </div>
            <div>
              <p className="font-headline text-headline-md text-tertiary font-bold">0</p>
              <p className="font-body text-label-md text-on-surface-variant">إعلانات مزعجة أو اشتراكات</p>
            </div>
          </div>
        </section>

        {/* ── 2. Subjects Grid ── */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="font-headline text-headline-md text-primary mb-1">المواد الدراسية</h2>
              <p className="font-body text-body-md text-on-surface-variant">اختر المادة للبدء في المراجعة</p>
            </div>
            <Link
              href="/subject"
              className="hidden md:flex items-center gap-1 font-body text-label-md text-primary hover:underline"
            >
              <span>عرض الكل</span>
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {subjects.map((subj) => {
              const iconName = subjectIcons[subj.slug] || "school";
              const fileCount = subjectFileCounts[subj.slug] || 0;

              return (
                <Link
                  key={subj.slug}
                  href={`/subject/${subj.slug}`}
                  className="group bg-surface-bright border border-primary/10 rounded-xl p-4 flex flex-col items-center text-center hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm hover:shadow-md"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/5 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[28px]">{iconName}</span>
                  </div>
                  <span className="font-body text-label-md font-medium text-on-surface group-hover:text-primary transition-colors">
                    {subj.name}
                  </span>
                  <span className="font-body text-caption text-on-surface-variant mt-1">
                    {fileCount} ملف
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── 3. Tools & Roadmap Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preparation Roadmap */}
          <section className="lg:col-span-2 bg-surface-container-low border border-primary/10 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
            <h2 className="font-headline text-headline-md text-primary mb-6 relative z-10">
              خريطة طريق التحضير
            </h2>
            <div className="relative z-10 pr-6 border-r-2 border-primary/20 space-y-8">
              <div className="relative">
                <div className="absolute w-4 h-4 rounded-full bg-primary border-4 border-surface-container-low -right-[31px] top-1" />
                <h3 className="font-body text-label-md font-bold text-on-surface mb-1">
                  الفصل الأول: بناء الأساسيات
                </h3>
                <p className="font-body text-body-md text-on-surface-variant">
                  فهم الدروس الأساسية وحل التمارين البسيطة لترسيخ المفاهيم وسد الثغرات.
                </p>
              </div>

              <div className="relative">
                <div className="absolute w-4 h-4 rounded-full bg-secondary border-4 border-surface-container-low -right-[31px] top-1" />
                <h3 className="font-body text-label-md font-bold text-on-surface mb-1">
                  الفصل الثاني: التمرس والتعمق
                </h3>
                <p className="font-body text-body-md text-on-surface-variant">
                  حل مواضيع مركبة والتدرب على منهجية الإجابة النموذجية في المواد الأساسية.
                </p>
              </div>

              <div className="relative">
                <div className="absolute w-4 h-4 rounded-full bg-surface-variant border-2 border-primary/20 -right-[31px] top-1" />
                <h3 className="font-body text-label-md font-bold text-on-surface-variant mb-1">
                  الفصل الثالث: المراجعة النهائية
                </h3>
                <p className="font-body text-body-md text-on-surface-variant/70">
                  حل حوليات البكالوريا السابقة والتدرب على إدارة الوقت وإستراتيجية الامتحان.
                </p>
              </div>
            </div>
          </section>

          {/* Tools Assistant Card */}
          <section className="bg-surface-bright border border-primary/10 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="font-headline text-headline-md text-primary mb-4">أدوات مساعدة</h2>
              <div className="flex flex-col gap-3">
                <Link
                  href="/calculator"
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-container-low border border-transparent hover:border-primary/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-md bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">calculate</span>
                  </div>
                  <div>
                    <h3 className="font-body text-label-md font-bold text-on-surface">حساب المعدل</h3>
                    <p className="font-body text-caption text-on-surface-variant">احسب معدلك المتوقع بسهولة</p>
                  </div>
                </Link>

                <Link
                  href="/progress"
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-container-low border border-transparent hover:border-primary/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">trending_up</span>
                  </div>
                  <div>
                    <h3 className="font-body text-label-md font-bold text-on-surface">متابع التقدم</h3>
                    <p className="font-body text-caption text-on-surface-variant">سجل إنجازك في كل مادة</p>
                  </div>
                </Link>

                <Link
                  href="/tools/prerequisites/quiz"
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-container-low border border-transparent hover:border-primary/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-md bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">quiz</span>
                  </div>
                  <div>
                    <h3 className="font-body text-label-md font-bold text-on-surface">اختبر نفسك</h3>
                    <p className="font-body text-caption text-on-surface-variant">اختبارات قصيرة لتقييم مستواك</p>
                  </div>
                </Link>
              </div>
            </div>

            <Link
              href="/tools"
              className="mt-6 w-full py-2.5 bg-surface-container border border-primary/20 rounded-lg text-primary font-body text-label-md font-semibold text-center hover:bg-primary/5 transition-colors block"
            >
              تصفح كل الأدوات
            </Link>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

