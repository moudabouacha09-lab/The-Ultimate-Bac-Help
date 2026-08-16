// src/app/page.tsx
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { 
  GraduationCap, 
  Calculator, 
  Target, 
  Layers, 
  Sparkles, 
  Tv, 
  BookOpen, 
  Smartphone,
  ArrowLeft,
  BookMarked,
  CheckCircle2
} from "lucide-react";
import { FadeInSection } from "@/components/effects/fade-in-section";
import { CountdownCard } from "@/components/news/countdown-card";
import { subjects } from "@/lib/subjects";
import bacContent from "@/data/bac-content";

const subjectMeta: Record<string, { desc: string; accent: string; bg: string; color: string }> = {
  math: { 
    desc: "ملخصات، احتمالات، أعداد مركبة، وتكاملات", 
    accent: "#3b82f6", 
    bg: "rgba(59, 130, 246, 0.12)", 
    color: "#60a5fa" 
  },
  science: { 
    desc: "الوحدات الـ 8 كاملة مع تجميعة الاختبارات", 
    accent: "#10b981", 
    bg: "rgba(16, 185, 129, 0.12)", 
    color: "#34d399" 
  },
  physics: { 
    desc: "ملخصات الوحدات والأسئلة النظرية الشاملة", 
    accent: "#06b6d4", 
    bg: "rgba(6, 182, 212, 0.12)", 
    color: "#22d3ee" 
  },
  "history-geography": { 
    desc: "دروس، مصطلحات، تواريخ، وخرائط تفاعلية", 
    accent: "#f59e0b", 
    bg: "rgba(245, 158, 11, 0.12)", 
    color: "#fbbf24" 
  },
  philosophy: { 
    desc: "مقالات نموذجية مفصلة، ملخصات، وتسجيلات صوتية", 
    accent: "#8b5cf6", 
    bg: "rgba(139, 92, 246, 0.12)", 
    color: "#a78bfa" 
  },
  arabic: { 
    desc: "ملخصات البناء اللغوي ومؤشرات الأنماط ومخططات", 
    accent: "#22c55e", 
    bg: "rgba(34, 197, 94, 0.12)", 
    color: "#4ade80" 
  },
  "islamic-studies": { 
    desc: "ملخصات الشريعة، الفروقات، والأسئلة غير المباشرة", 
    accent: "#10b981", 
    bg: "rgba(16, 185, 129, 0.12)", 
    color: "#34d399" 
  },
  french: { 
    desc: "مواقع تفاعلية، مرشد التعبير الكتابي والمواضيع", 
    accent: "#3b82f6", 
    bg: "rgba(59, 130, 246, 0.12)", 
    color: "#60a5fa" 
  },
  english: { 
    desc: "ملخصات القواعد، مقالات جاهزة، ومراجعة نهائية", 
    accent: "#6366f1", 
    bg: "rgba(99, 102, 241, 0.12)", 
    color: "#818cf8" 
  },
};

const smartTools = [
  {
    href: "/tools/orientation",
    icon: <GraduationCap size={24} color="#38bdf8" />,
    badge: "معدلات 2024-2026",
    badgeBg: "rgba(56, 189, 248, 0.15)",
    badgeColor: "#38bdf8",
    title: "مستشار التوجيه الجامعي 🎓",
    desc: "احسب معدلك الموزون وتعرف على تخصصات الطب، الهندسة، والمدارس العليا المتاحة لك بدقة."
  },
  {
    href: "/calculator",
    icon: <Calculator size={24} color="#34d399" />,
    badge: "تعديل المعاملات 2026",
    badgeBg: "rgba(52, 211, 153, 0.15)",
    badgeColor: "#34d399",
    title: "حاسبة معدل البكالوريا ⚖️",
    desc: "محاكاة رسمية وسريعة لحساب معدل البكالوريا لجميع الشعب العلمية والأدبية مع حفظ النقاط."
  },
  {
    href: "/tools/prerequisites/quiz",
    icon: <Target size={24} color="#a78bfa" />,
    badge: "تشخيص وتمرين شامل",
    badgeBg: "rgba(167, 139, 250, 0.15)",
    badgeColor: "#a78bfa",
    title: "بنك المكتسبات القبلية 🎯",
    desc: "اختبر أساسياتك في الرياضيات، الفيزياء، والعلوم مع تصحيح فوري وحلول نموذجية دقيقة بـ KaTeX."
  },
  {
    href: "/progress",
    icon: <Layers size={24} color="#fbbf24" />,
    badge: "تتبع الإنجاز",
    badgeBg: "rgba(251, 191, 36, 0.15)",
    badgeColor: "#fbbf24",
    title: "متابع التقدم والمراجعة 📊",
    desc: "سجل الدروس المنجزة في كل مادة وتابع نسبة جاهزيتك لامتحان شهادة البكالوريا خطوة بخطوة."
  },
  {
    href: "/tools/notebooks",
    icon: <Sparkles size={24} color="#818cf8" />,
    badge: "ذكاء اصطناعي",
    badgeBg: "rgba(129, 140, 248, 0.15)",
    badgeColor: "#818cf8",
    title: "مذكرات NotebookLM 🧠",
    desc: "مذكرات دراسية تفاعلية مجهزة بالذكاء الاصطناعي للمراجعة السريعة وتلخيص الأفكار."
  },
  {
    href: "/tools/teachers",
    icon: <Tv size={24} color="#f87171" />,
    badge: "قنوات موثوقة",
    badgeBg: "rgba(248, 113, 113, 0.15)",
    badgeColor: "#f87171",
    title: "دليل أفضل الأساتذة 👨‍🏫",
    desc: "قائمة منتقاة لأفضل قنوات اليوتيوب التعليمية الجزائرية المصنفة حسب المواد والشعب."
  },
  {
    href: "/tools/books",
    icon: <BookOpen size={24} color="#fb923c" />,
    badge: "مراجع خارجية",
    badgeBg: "rgba(251, 146, 60, 0.15)",
    badgeColor: "#fb923c",
    title: "دليل الكتب والمراجع 📚",
    desc: "استعرض أفضل سلاسل وكتب المراجعة الخارجية المعتمدة للتحضير المكثف للبكالوريا."
  },
  {
    href: "/tools/apps",
    icon: <Smartphone size={24} color="#2dd4bf" />,
    badge: "تطبيقات مساعدة",
    badgeBg: "rgba(45, 212, 191, 0.15)",
    badgeColor: "#2dd4bf",
    title: "تطبيقات ومواقع للدراسة 📱",
    desc: "أفضل التطبيقات الهادفة لتنظيم الوقت، حل المسائل، والتدريب على الامتحانات."
  }
];

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
      {/* Hero Header */}
      <section className="home-intro" style={{ marginBottom: "1.25rem" }}>
        <div className="home-hero-badge">
          <span>✨ المنصة الأكاديمية الأولى</span>
          <span style={{ opacity: 0.6 }}>|</span>
          <span>كل ما يحتاجه طالب البكالوريا 2026/2027 🇩🇿</span>
        </div>
        <h1>The Ultimate BAC Help</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginTop: "0.5rem", maxWidth: "720px" }}>
          بوابتك المرجعية الشاملة للتحضير للبكالوريا: ملفات منتقاة، حلول نموذجية، حاسبة رسمية، ومستشار التوجيه الجامعي في مكان واحد.
        </p>
      </section>

      {/* Live Metrics Grid */}
      <div className="home-stats-grid">
        <div className="home-stat-card">
          <div className="home-stat-number">+{totalFiles}</div>
          <div className="home-stat-label">ملف دراسي وملخص</div>
        </div>
        <div className="home-stat-card">
          <div className="home-stat-number">{subjects.length}</div>
          <div className="home-stat-label">مواد علمية وأدبية</div>
        </div>
        <div className="home-stat-card">
          <div className="home-stat-number">{smartTools.length}</div>
          <div className="home-stat-label">أدوات ذكية تفاعلية</div>
        </div>
        <div className="home-stat-card">
          <div className="home-stat-number">100%</div>
          <div className="home-stat-label">مجاني وبدون إعلانات</div>
        </div>
      </div>

      {/* Countdown Card */}
      <CountdownCard />

      {/* Subjects Fast Access Section */}
      <section style={{ marginTop: "2.5rem" }}>
        <div className="home-section-header">
          <div>
            <h2>
              <BookMarked size={24} color="var(--blue-400)" />
              <span>المواد الدراسية والمكتبة الرقمية</span>
            </h2>
            <p>اختر المادة لتصفح الملخصات، التمارين الشاملة، والدروس المرقمة</p>
          </div>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 700 }}>
            {subjects.length} مواد متاحة
          </span>
        </div>

        <div className="home-subjects-grid">
          {subjects.map((subj, idx) => {
            const meta = subjectMeta[subj.slug] || {
              desc: "ملفات ودروس المادة",
              accent: "#3b82f6",
              bg: "rgba(59, 130, 246, 0.12)",
              color: "#60a5fa"
            };
            const fileCount = subjectFileCounts[subj.slug] || 0;

            return (
              <FadeInSection key={subj.slug} delay={idx * 40}>
                <Link
                  href={`/subject/${subj.slug}`}
                  className="home-subject-card"
                  style={{ "--card-accent": meta.accent } as React.CSSProperties}
                >
                  <div
                    className="home-subject-icon"
                    style={{
                      "--icon-bg": meta.bg,
                      "--icon-color": meta.color
                    } as React.CSSProperties}
                  >
                    {subj.icon}
                  </div>
                  <div className="home-subject-info">
                    <h3 className="home-subject-title">{subj.name}</h3>
                    <div className="home-subject-meta">
                      <span>{fileCount} ملفات دراسية</span>
                      <span style={{ margin: "0 0.35rem", opacity: 0.5 }}>•</span>
                      <span style={{ opacity: 0.85 }}>{meta.desc.split("،")[0]}</span>
                    </div>
                  </div>
                  <div className="home-subject-arrow" aria-hidden="true">
                    <ArrowLeft size={18} />
                  </div>
                </Link>
              </FadeInSection>
            );
          })}
        </div>
      </section>

      {/* Smart Tools Hub Section */}
      <section style={{ marginTop: "3rem" }}>
        <div className="home-section-header">
          <div>
            <h2>
              <Sparkles size={24} color="var(--accent-cyan)" />
              <span>الأدوات الذكية وخدمات المترشح</span>
            </h2>
            <p>أدوات تقنية متقدمة لمساعدتك في التوجيه، حساب المعدل، وتقييم مستواك</p>
          </div>
          <Link href="/tools" style={{ fontSize: "0.86rem", fontWeight: 800, color: "var(--blue-400)", textDecoration: "none" }}>
            عرض جميع الأدوات ←
          </Link>
        </div>

        <div className="home-tools-grid">
          {smartTools.map((tool, idx) => (
            <FadeInSection key={tool.href} delay={idx * 50}>
              <Link href={tool.href} className="home-tool-card">
                <div>
                  <div className="home-tool-top">
                    <div className="home-tool-icon-wrapper">
                      {tool.icon}
                    </div>
                    <div className="home-tool-info">
                      <span
                        className="home-tool-badge"
                        style={{ backgroundColor: tool.badgeBg, color: tool.badgeColor }}
                      >
                        {tool.badge}
                      </span>
                      <h3 className="home-tool-title">{tool.title}</h3>
                    </div>
                  </div>
                  <p className="home-tool-desc">{tool.desc}</p>
                </div>

                <div className="home-tool-action">
                  <span>فتح الأداة</span>
                  <ArrowLeft size={16} />
                </div>
              </Link>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* Academic Success Roadmap Banner */}
      <FadeInSection delay={100}>
        <div className="home-roadmap-card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <CheckCircle2 size={24} color="#60a5fa" />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-primary)", margin: 0 }}>
              خارطة طريق التفوق في شهادة البكالوريا 🚀
            </h3>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.4rem", marginInlineStart: "2rem" }}>
            اتبع هذه المحطات الأربع المنظمة لضمان أعلى جاهزية معرفية ومنهجية يوم الامتحان:
          </p>

          <div className="home-roadmap-grid">
            <div className="home-roadmap-step">
              <div className="home-roadmap-step-num">1</div>
              <div>
                <div className="home-roadmap-step-title">تشخيص المكتسبات</div>
                <p className="home-roadmap-step-text">اختبر أساسياتك في الرياضيات والفيزياء وسد الثغرات مبكراً.</p>
              </div>
            </div>

            <div className="home-roadmap-step">
              <div className="home-roadmap-step-num">2</div>
              <div>
                <div className="home-roadmap-step-title">استيعاب الدروس</div>
                <p className="home-roadmap-step-text">راجع ملخصات المواد وحل تمارين الوحدات أولاً بأول.</p>
              </div>
            </div>

            <div className="home-roadmap-step">
              <div className="home-roadmap-step-num">3</div>
              <div>
                <div className="home-roadmap-step-title">حل البكالوريات</div>
                <p className="home-roadmap-step-text">تدرّب على مواضيع السنوات السابقة والاختبارات التجريبية.</p>
              </div>
            </div>

            <div className="home-roadmap-step">
              <div className="home-roadmap-step-num">4</div>
              <div>
                <div className="home-roadmap-step-title">تحديد الهدف</div>
                <p className="home-roadmap-step-text">احسب معدلك الموزون واستكشف متطلبات التخصص الذي تطمح إليه.</p>
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>
    </AppShell>
  );
}
