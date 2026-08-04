import { AppShell } from "@/components/layout/app-shell";
import { subjects } from "@/lib/subjects";
import Link from "next/link";
import { Library } from "lucide-react";
import { FadeInSection } from "@/components/effects/fade-in-section";

export default function SubjectsOverviewPage() {
  return (
    <AppShell>
      <section className="subject-page-heading" style={{ marginBottom: "2rem" }}>
        <div>
          <p className="eyebrow">المكتبة الرقمية</p>
          <h1>المواد الدراسية</h1>
          <p style={{ marginTop: "0.5rem", color: "var(--ink-700)" }}>
            اختر المادة لتصفح الملخصات، التمارين، والمواضيع التجريبية للبكالوريا.
          </p>
        </div>
        <span className="subject-hero-icon subject-icon-blue" aria-hidden="true" style={{ display: 'grid', placeItems: 'center' }}>
          <Library size={32} />
        </span>
      </section>

      <section className="subjects-grid-page" aria-label="قائمة المواد">
        <div className="subjects-grid">
          {subjects.map((subject, index) => (
            <FadeInSection key={subject.slug} delay={index * 80}>
              <Link
                className={`subject-card-item subject-card-${subject.color}`}
                href={`/subject/${subject.slug}`}
              >
                <div className={`subject-card-icon subject-icon-${subject.color}`} aria-hidden="true">
                  {subject.icon}
                </div>
                <div className="subject-card-info">
                  <h2>{subject.name}</h2>
                  <p>ملخصات، مواضيع وحلول وتجميعات</p>
                </div>
                <span className="subject-card-arrow" aria-hidden="true">←</span>
              </Link>
            </FadeInSection>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
