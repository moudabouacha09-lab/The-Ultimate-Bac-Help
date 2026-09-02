import { AppShell } from "@/components/layout/app-shell";
import { subjects } from "@/lib/subjects";
import Link from "next/link";
import { FadeInSection } from "@/components/effects/fade-in-section";

export default function SubjectsOverviewPage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-gutter py-xl flex flex-col gap-xl">
        {/* ── Page Header ── */}
        <header className="space-y-3 border-b border-primary/10 pb-6">
          <div className="flex items-center gap-2">
            <span className="font-body text-label-md text-secondary bg-secondary/10 px-3 py-1 rounded-full inline-block font-semibold">
              المكتبة الرقمية 📚
            </span>
          </div>
          <h1 className="font-headline text-display-lg text-primary font-bold">
            المواد الدراسية
          </h1>
          <p className="font-body text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            استكشف جميع المواد الدراسية، الملخصات المركزة، الفيديوهات، والامتحانات الرسمية لتحضير شهادة البكالوريا.
          </p>
        </header>

        {/* ── Subjects Bento Grid Directory ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="قائمة المواد الدراسية">
          {subjects.map((subject, index) => {
            const isEssential = ["math", "science", "physics"].includes(subject.slug);
            return (
              <FadeInSection key={subject.slug} delay={index * 60}>
                <Link
                  className="group bg-surface-bright border border-primary/10 rounded-xl p-6 flex flex-col hover:shadow-md hover:border-primary/30 transition-all duration-300 relative overflow-hidden min-h-[220px]"
                  href={`/subject/${subject.slug}`}
                >
                  {/* Decorative Glow */}
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />

                  {/* Header Icon + Category Badge */}
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-2xl">{subject.icon}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-surface-container rounded-md font-body text-caption font-semibold text-on-surface-variant">
                      {isEssential ? "مادة أساسية" : "مادة مرافقة"}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h2 className="font-headline text-headline-md text-primary font-bold mb-1.5 relative z-10 group-hover:text-primary transition-colors">
                    {subject.name}
                  </h2>
                  <p className="font-body text-body-md text-on-surface-variant mb-6 relative z-10 line-clamp-2 leading-relaxed">
                    ملخصات شاملة، دروس محلولة، ومواضيع بكالوريا سابقة مرتبة حسب الوحدات.
                  </p>

                  {/* Bottom Stats Footer */}
                  <div className="mt-auto grid grid-cols-3 gap-2 border-t border-primary/10 pt-4 relative z-10 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-body text-label-md font-bold text-primary">دروس</span>
                      <span className="font-body text-caption text-on-surface-variant">شاملة</span>
                    </div>
                    <div className="flex flex-col items-center border-r border-l border-primary/10">
                      <span className="font-body text-label-md font-bold text-primary">تمارين</span>
                      <span className="font-body text-caption text-on-surface-variant">محلولة</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-body text-label-md font-bold text-secondary">حوالات</span>
                      <span className="font-body text-caption text-on-surface-variant font-medium">بكالوريا</span>
                    </div>
                  </div>
                </Link>
              </FadeInSection>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}


