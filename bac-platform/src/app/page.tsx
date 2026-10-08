// src/app/page.tsx
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { CountdownCard } from "@/components/news/countdown-card";
import { subjects } from "@/lib/subjects";
import bacContent from "@/data/bac-content";
import { DeveloperMessage } from "@/components/auth/developer-message";
import { FadeInSection } from "@/components/effects/fade-in-section";

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
      <section className="relative bg-gradient-to-b from-surface-container-low via-surface-bright to-surface px-gutter py-14 md:py-20 border-b border-primary/5 overflow-hidden">
        {/* Decorative ambient background blur blobs */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-primary/[0.06] rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary/[0.05] rounded-full blur-3xl translate-y-1/3 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-tertiary/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10 flex flex-col items-center">
          {/* Subtle live badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary font-body text-label-md font-semibold mb-6 shadow-xs backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span>المنصة الرسمية والمجانية لتحضير بكالوريا 2027</span>
          </div>

          <h1 className="font-headline text-display-lg md:text-[56px] text-primary mb-4 md:mb-6 leading-tight tracking-tight max-w-4xl">
            استعد للبكالوريا بثقة وتميّز
          </h1>
          <p className="font-body text-body-lg text-on-surface-variant mb-8 max-w-2xl mx-auto leading-relaxed">
            منصتك الوطنية الشاملة للمراجعة، بنك الاختبارات والسلاسل المحلولة، وأدوات تنظيم التقدم لضمان أعلى المعدلات.
          </p>

          {/* Countdown Timer */}
          <CountdownCard />
        </div>
      </section>

      <DeveloperMessage />

      {/* ── Content Sections Wrapper ── */}
      <div className="max-w-7xl mx-auto px-gutter py-xl flex flex-col gap-xl">
        {/* ── 1. Stats Row ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-md" aria-label="إحصائيات المنصة">
          <FadeInSection delay={0}>
            <div className="bg-surface-bright border border-primary/10 rounded-2xl p-6 flex items-center gap-4 card-hover-lift shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[30px]">library_books</span>
              </div>
              <div>
                <p className="font-headline text-headline-md text-primary font-bold">+{totalFiles}</p>
                <p className="font-body text-label-md text-on-surface-variant">ملف دراسي وملخص منتقى بعناية</p>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={80}>
            <div className="bg-surface-bright border border-primary/10 rounded-2xl p-6 flex items-center gap-4 card-hover-lift shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[30px]">volunteer_activism</span>
              </div>
              <div>
                <p className="font-headline text-headline-md text-secondary font-bold">100%</p>
                <p className="font-body text-label-md text-on-surface-variant">مجاني بالكامل لجميع الطلاب</p>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={160}>
            <div className="bg-surface-bright border border-primary/10 rounded-2xl p-6 flex items-center gap-4 card-hover-lift shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-tertiary-container/20 text-tertiary flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[30px]">shield</span>
              </div>
              <div>
                <p className="font-headline text-headline-md text-tertiary font-bold">0</p>
                <p className="font-body text-label-md text-on-surface-variant">إعلانات مزعجة أو اشتراكات مدفوعة</p>
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* ── 2. Subjects Grid ── */}
        <section aria-labelledby="subjects-title">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 id="subjects-title" className="font-headline text-headline-md text-primary mb-1">
                المواد الدراسية
              </h2>
              <p className="font-body text-body-md text-on-surface-variant">اختر المادة للبدء في المراجعة المركزة</p>
            </div>
            <Link
              href="/subject"
              className="hidden md:inline-flex items-center gap-1.5 font-body text-label-md text-primary hover:text-secondary transition-colors font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/5"
            >
              <span>عرض كل المواد</span>
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {subjects.map((subj, idx) => {
              const iconName = subjectIcons[subj.slug] || "school";
              const fileCount = subjectFileCounts[subj.slug] || 0;

              return (
                <FadeInSection key={subj.slug} delay={idx * 40}>
                  <Link
                    href={`/subject/${subj.slug}`}
                    className="group bg-surface-bright border border-primary/10 rounded-2xl p-5 flex flex-col items-center text-center card-hover-lift shadow-xs relative overflow-hidden"
                  >
                    {/* Hover accent wash */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary group-hover:shadow-md transition-all duration-300">
                      <span className="material-symbols-outlined text-[28px]">{iconName}</span>
                    </div>
                    <span className="font-body text-label-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                      {subj.name}
                    </span>
                    <span className="font-body text-caption text-on-surface-variant mt-1">
                      {fileCount} ملف متاح
                    </span>
                  </Link>
                </FadeInSection>
              );
            })}
          </div>
        </section>

        {/* ── 3. Tools & Roadmap Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preparation Roadmap */}
          <section className="lg:col-span-2 bg-surface-bright border border-primary/10 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 w-36 h-36 bg-primary/[0.04] rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-secondary text-2xl">route</span>
              <h2 className="font-headline text-headline-md text-primary font-bold">
                خريطة طريق التحضير للبكالوريا
              </h2>
            </div>

            <div className="relative z-10 pr-6 border-r-2 border-primary/20 space-y-8">
              <div className="relative">
                <div className="absolute w-4 h-4 rounded-full bg-primary border-4 border-surface-bright -right-[31px] top-1 shadow-xs" />
                <h3 className="font-body text-label-md font-bold text-primary mb-1">
                  الفصل الأول: بناء الأساسيات واستيعاب المفاهيم
                </h3>
                <p className="font-body text-body-md text-on-surface-variant leading-relaxed">
                  فهم الدروس الأساسية وحل التمارين التأسيسية لترسيخ المفاهيم وسد أي ثغرات من المكتسبات القبلية.
                </p>
              </div>

              <div className="relative">
                <div className="absolute w-4 h-4 rounded-full bg-secondary border-4 border-surface-bright -right-[31px] top-1 shadow-xs" />
                <h3 className="font-body text-label-md font-bold text-secondary mb-1">
                  الفصل الثاني: التمرس والتعمق والمنهجية
                </h3>
                <p className="font-body text-body-md text-on-surface-variant leading-relaxed">
                  حل مواضيع مركبة وشاملة والتدرب على منهجية الإجابة النموذجية المعتمدة في التصحيح الوزاري.
                </p>
              </div>

              <div className="relative">
                <div className="absolute w-4 h-4 rounded-full bg-tertiary border-4 border-surface-bright -right-[31px] top-1 shadow-xs" />
                <h3 className="font-body text-label-md font-bold text-tertiary mb-1">
                  الفصل الثالث: المراجعة النهائية وحوليات البكالوريا
                </h3>
                <p className="font-body text-body-md text-on-surface-variant leading-relaxed">
                  حل حوليات البكالوريا الرسمية السابقة والتدرب على إدارة الوقت وإستراتيجية الامتحان الحقيقي.
                </p>
              </div>
            </div>
          </section>

          {/* Tools Assistant Card */}
          <section className="bg-surface-bright border border-primary/10 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">handyman</span>
                <h2 className="font-headline text-headline-md text-primary font-bold">أدوات مساعدة</h2>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/calculator"
                  className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-surface-container border border-transparent hover:border-primary/10 transition-all card-hover-lift"
                >
                  <div className="w-11 h-11 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">calculate</span>
                  </div>
                  <div>
                    <h3 className="font-body text-label-md font-bold text-on-surface">حاسبة المعدل التقديري</h3>
                    <p className="font-body text-caption text-on-surface-variant">احسب معدلك وفق معاملات شعبتك</p>
                  </div>
                </Link>

                <Link
                  href="/progress"
                  className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-surface-container border border-transparent hover:border-primary/10 transition-all card-hover-lift"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">trending_up</span>
                  </div>
                  <div>
                    <h3 className="font-body text-label-md font-bold text-on-surface">متابع التقدم والإنجاز</h3>
                    <p className="font-body text-caption text-on-surface-variant">تتبع الدروس المنجزة في كل وحدة</p>
                  </div>
                </Link>

                <Link
                  href="/tools/orientation"
                  className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-surface-container border border-transparent hover:border-primary/10 transition-all card-hover-lift"
                >
                  <div className="w-11 h-11 rounded-xl bg-tertiary-container/30 text-tertiary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">explore</span>
                  </div>
                  <div>
                    <h3 className="font-body text-label-md font-bold text-on-surface">مستكشف التوجيه الجامعي</h3>
                    <p className="font-body text-caption text-on-surface-variant">اكتشف التخصصات ومعدلات القبول</p>
                  </div>
                </Link>
              </div>
            </div>

            <Link
              href="/tools"
              className="mt-6 w-full py-3 bg-surface-container border border-primary/20 rounded-xl text-primary font-body text-label-md font-bold text-center hover:bg-primary hover:text-on-primary transition-all duration-200 block shadow-xs"
            >
              تصفح كل الأدوات المتاحة
            </Link>
          </section>
        </div>
      </div>
    </AppShell>
  );
}


