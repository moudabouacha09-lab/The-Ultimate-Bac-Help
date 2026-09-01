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
          <span className="font-body text-label-md text-secondary bg-secondary/10 px-3 py-1 rounded-full inline-block font-semibold">
            المكتبة الرقمية 📚
          </span>
          <h1 className="font-headline text-display-lg text-primary font-bold">
            المواد الدراسية
          </h1>
          <p className="font-body text-body-lg text-on-surface-variant max-w-2xl">
            اختر المادة لتصفح الملخصات، التمارين، والمواضيع التجريبية للبكالوريا.
          </p>
        </header>

        {/* ── Subjects Grid ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="قائمة المواد">
          {subjects.map((subject, index) => (
            <FadeInSection key={subject.slug} delay={index * 80}>
              <Link
                className="group bg-surface-bright border border-primary/10 rounded-xl p-6 hover:border-primary/30 hover:shadow-md transition-all duration-300 relative overflow-hidden flex items-center justify-between gap-4"
                href={`/subject/${subject.slug}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">{subject.icon}</span>
                  </div>
                  <div>
                    <h2 className="font-headline text-headline-md text-primary font-bold group-hover:text-primary transition-colors">
                      {subject.name}
                    </h2>
                    <p className="font-body text-body-md text-on-surface-variant">
                      ملخصات، مواضيع وحلول وتجميعات
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary group-hover:-translate-x-1 transition-transform">
                  arrow_back
                </span>
              </Link>
            </FadeInSection>
          ))}
        </section>
      </div>
    </AppShell>
  );
}

