import { AppShell } from "@/components/layout/app-shell";
import Link from "next/link";
import { Timer, Brain, Library, TrendingUp, Bot, Camera, BookOpen } from "lucide-react";
import type { ReactNode } from "react";
import { FadeInSection } from "@/components/effects/fade-in-section";

interface AppInfo {
  name: string;
  icon: ReactNode;
  description: string;
  url: string;
  color: string;
}

const apps: AppInfo[] = [
  {
    name: "YPT (Yeolpumta)",
    icon: <Timer size={24} />,
    description: "أفضل تطبيق لإدارة الوقت وتتبع ساعات الدراسة. يقدّم إحصائيات دقيقة يومية وأسبوعية وشهرية وسنوية لكل مادة، مما يساعدك على معرفة نقاط ضعفك وتنظيم مراجعتك للبكالوريا بذكاء.",
    url: "https://play.google.com/store/apps/details?id=com.pallo.passiontimerscoped",
    color: "orange"
  },
  {
    name: "Quizlet",
    icon: <Brain size={24} />,
    description: "من أفضل تطبيقات الحفظ بالمراجعة المتكررة. لا تحتاج إلى إنشاء بطاقات بنفسك؛ يكفي البحث عن مجموعات جاهزة (حتى من طلاب جزائريين) والتدرب عليها في أي وقت لاسترجاع المعلومات بسرعة.",
    url: "https://play.google.com/store/apps/details?id=com.quizlet.quizletandroid",
    color: "blue"
  },
  {
    name: "بكالوريا شعبة العلوم التجريبية",
    icon: <Library size={24} />,
    description: "يضم جميع مواضيع البكالوريا السابقة مع الحلول النموذجية في مكان واحد، مما يجعله مرجعًا ممتازًا للتدريب، تقييم مستواك، والتعرف على نمط الأسئلة المتكرر.",
    url: "https://play.google.com/store/search?q=%D8%A8%D9%83%D8%A7%D9%84%D9%88%D8%B1%D9%8A%D8%A7+%D8%A7%D9%84%D8%AC%D8%B2%D8%A7%D8%A6%D8%B1&c=apps",
    color: "green"
  },
  {
    name: "Desmos",
    icon: <TrendingUp size={24} />,
    description: "آلة حاسبة بيانية قوية تعمل حتى بدون اتصال بالإنترنت. ترسم الدوال والمنحنيات بدقة عالية، وتساعدك على التحقق من صحة التمثيل البياني قبل الاطلاع على الحل.",
    url: "https://play.google.com/store/apps/details?id=com.desmos.calculator",
    color: "emerald"
  },
  {
    name: "NotebookLM",
    icon: <Bot size={24} />,
    description: "مدرس خصوصي مدعوم بالذكاء الاصطناعي. يمكنك رفع عشرات المصادر مجانًا ثم طرح أي سؤال، وسيجيب اعتمادًا على تلك المصادر فقط دون اختلاق معلومات، مما يجعله مثاليًا لمراجعة جميع المواد.",
    url: "https://notebooklm.google.com/",
    color: "purple"
  },
  {
    name: "CamScanner",
    icon: <Camera size={24} />,
    description: "ضروري لتحويل الصور إلى ملفات PDF عالية الجودة. استخدمه لحفظ الاختبارات، الملخصات والتمارين وتنظيمها للرجوع إليها لاحقًا.",
    url: "https://play.google.com/store/apps/details?id=com.intsig.camscanner",
    color: "teal"
  },
  {
    name: "Tarteel",
    icon: <BookOpen size={24} />,
    description: "وسط ضغط الدراسة، يبقى القرآن مصدرًا للطمأنينة. يتميز هذا التطبيق بتلاوات متقنة، وتصحيح التلاوة، والمساعدة على الحفظ، إلى جانب العديد من الخصائص التفاعلية التي تستحق التجربة.",
    url: "https://play.google.com/store/apps/details?id=com.mmm.tarteel",
    color: "emerald"
  }
];

export default function AppsPage() {
  return (
    <AppShell>
      {/* MAIN VIEW WRAPPER FOR /TOOLS/APPS */}
      <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto", padding: "24px", boxSizing: "border-box", direction: "rtl" }}>

        {/* Page Header Layout */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px", marginBottom: "32px", borderBottom: "1px solid var(--border)", paddingBottom: "24px" }}>
          <div className="back-link-wrapper">
            <Link className="back-link" href="/tools">← العودة للأدوات</Link>
          </div>
          <span style={{ color: "var(--accent-cyan-dark)", background: "var(--blue-50)", padding: "4px 12px", borderRadius: "999px", fontSize: "0.85rem", fontWeight: 700 }}>أدوات المراجعة</span>
          <h1 style={{ color: "var(--text-primary)", fontSize: "2.25rem", fontWeight: 800, margin: "4px 0", lineHeight: 1.45 }}>أفضل التطبيقات للدراسة</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: 0, lineHeight: 1.6 }}>مجموعة من التطبيقات المجربة شخصياً والتي ستصنع الفارق في تحضيرك للبكالوريا.</p>
        </div>

        {/* APP ENTRIES CONTAINER BLOCK */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
          {apps.map((app, index) => (
            <FadeInSection key={app.name} delay={index * 80}>
              <div className="apps-route-glass-card">
                {/* Left Action Column */}
                <div className="apps-action-side">
                  <a href={app.url} target="_blank" rel="noopener noreferrer" className="apps-premium-download-btn">
                    <span>تنزيل التطبيق</span>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                  </a>
                </div>

                {/* Right Metadata Column */}
                <div className="apps-content-side">
                  <div className="apps-meta-header-row">
                    <span className="apps-numeric-badge">المرتبة #{index + 1}</span>
                    <div className="apps-title-branding-group">
                      <h3 className="apps-glow-heading">{app.name}</h3>
                      <span style={{ fontSize: "1.25rem", display: "grid", placeItems: "center" }}>{app.icon}</span>
                    </div>
                  </div>
                  <p className="apps-clean-body-text">{app.description}</p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
