import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Smartphone, Bot, Play, Sprout, Library, GraduationCap } from "lucide-react";
import { FadeInSection } from "@/components/effects/fade-in-section";

export default function ToolsPage() {
  return (
    <AppShell>
      <div className="tools-page-header">
        <span className="tools-context-tag">أدوات المراجعة</span>
        <h1 className="tools-main-title">كل ما يساعدك على تنظيم تحضيرك.</h1>
        <p className="tools-subtitle-desc">اختر أداة وابدأ بخطوة صغيرة نحو هدفك.</p>
      </div>

      <section className="tools-grid" aria-label="دليل الأدوات">
        <FadeInSection delay={0}>
          <Link className="tool-card" href="/calculator">
            <span className="tool-card-icon" aria-hidden="true">∑</span>
            <span className="tool-card-content">
              <strong>حاسبة معدل البكالوريا</strong>
              <small>احسب معدلك التقديري مع معاملات شعبتك.</small>
            </span>
            <span className="tool-card-arrow" aria-hidden="true">←</span>
          </Link>
        </FadeInSection>
        <FadeInSection delay={60}>
          <Link className="tool-card" href="/tools/orientation">
            <span className="tool-card-icon" aria-hidden="true" style={{ color: "var(--blue-600)" }}><GraduationCap size={24} /></span>
            <span className="tool-card-content">
              <strong>المستشار الذكي للتوجيه الجامعي</strong>
              <small>احسب معدلك الموزون واكتشف المدارس والتخصصات المتاحة.</small>
            </span>
            <span className="tool-card-arrow" aria-hidden="true">←</span>
          </Link>
        </FadeInSection>
        <FadeInSection delay={120}>
          <Link className="tool-card" href="/tools/apps">
            <span className="tool-card-icon" aria-hidden="true" style={{ color: "var(--purple-600)" }}><Smartphone size={24} /></span>
            <span className="tool-card-content">
              <strong>التطبيقات الموصى بها</strong>
              <small>أفضل التطبيقات المجربة لإدارة الوقت والدراسة.</small>
            </span>
            <span className="tool-card-arrow" aria-hidden="true">←</span>
          </Link>
        </FadeInSection>
        <FadeInSection delay={160}>
          <Link className="tool-card" href="/tools/notebooks">
            <span className="tool-card-icon" aria-hidden="true" style={{ color: "var(--blue-600)" }}><Bot size={24} /></span>
            <span className="tool-card-content">
              <strong>مذكرات الذكاء الاصطناعي (NotebookLM)</strong>
              <small>مذكرات تفاعلية ذكية مدعومة بمصادر البكالوريا الدقيقة.</small>
            </span>
            <span className="tool-card-arrow" aria-hidden="true">←</span>
          </Link>
        </FadeInSection>
        <FadeInSection delay={240}>
          <Link className="tool-card" href="/tools/teachers">
            <span className="tool-card-icon" aria-hidden="true" style={{ color: "var(--red-600)" }}><Play size={24} /></span>
            <span className="tool-card-content">
              <strong>قائمة اليوتيوب الذهبية</strong>
              <small>أفضل القنوات والأساتذة الذين تابعتهم للمراجعة.</small>
            </span>
            <span className="tool-card-arrow" aria-hidden="true">←</span>
          </Link>
        </FadeInSection>
        <FadeInSection delay={320}>
          <Link className="tool-card" href="/tools/prerequisites">
            <span className="tool-card-icon" aria-hidden="true" style={{ color: "var(--orange-700)" }}><Sprout size={24} /></span>
            <span className="tool-card-content">
              <strong>المكتسبات القبلية (فيديوهات)</strong>
              <small>فيديوهات ونصائح ضرورية قبل الدخول المدرسي.</small>
            </span>
            <span className="tool-card-arrow" aria-hidden="true">←</span>
          </Link>
        </FadeInSection>
        <FadeInSection delay={360}>
          <Link className="tool-card" href="/tools/prerequisites/quiz">
            <span className="tool-card-icon" aria-hidden="true" style={{ color: "#22c55e" }}>🎯</span>
            <span className="tool-card-content">
              <strong>اختبار المكتسبات القبلية</strong>
              <small>تشخيص تفاعلي لـ 10 أسئلة وتمرين شامل محلول في المواد العلمية.</small>
            </span>
            <span className="tool-card-arrow" aria-hidden="true">←</span>
          </Link>
        </FadeInSection>
        <FadeInSection delay={400}>
          <Link className="tool-card" href="/tools/books">
            <span className="tool-card-icon" aria-hidden="true" style={{ color: "var(--violet-700)" }}><Library size={24} /></span>
            <span className="tool-card-content">
              <strong>أفضل الكتب الخارجية</strong>
              <small>مراجع وكتب قيمة اعتمدت عليها للوصول إلى التفوق.</small>
            </span>
            <span className="tool-card-arrow" aria-hidden="true">←</span>
          </Link>
        </FadeInSection>
      </section>
    </AppShell>
  );
}
