import { AppShell } from "@/components/layout/app-shell";
import Link from "next/link";

interface AppInfo {
  name: string;
  icon: string;
  description: string;
  url: string;
  color: string;
}

const apps: AppInfo[] = [
  {
    name: "YPT (Yeolpumta)",
    icon: "⏱",
    description: "أفضل تطبيق لإدارة الوقت وتتبع ساعات الدراسة. يقدّم إحصائيات دقيقة يومية وأسبوعية وشهرية وسنوية لكل مادة، مما يساعدك على معرفة نقاط ضعفك وتنظيم مراجعتك للبكالوريا بذكاء.",
    url: "https://play.google.com/store/apps/details?id=com.pallo.passiontimerscoped",
    color: "orange"
  },
  {
    name: "Quizlet",
    icon: "🧠",
    description: "من أفضل تطبيقات الحفظ بالمراجعة المتكررة. لا تحتاج إلى إنشاء بطاقات بنفسك؛ يكفي البحث عن مجموعات جاهزة (حتى من طلاب جزائريين) والتدرب عليها في أي وقت لاسترجاع المعلومات بسرعة.",
    url: "https://play.google.com/store/apps/details?id=com.quizlet.quizletandroid",
    color: "blue"
  },
  {
    name: "بكالوريا شعبة العلوم التجريبية",
    icon: "📚",
    description: "يضم جميع مواضيع البكالوريا السابقة مع الحلول النموذجية في مكان واحد، مما يجعله مرجعًا ممتازًا للتدريب، تقييم مستواك، والتعرف على نمط الأسئلة المتكرر.",
    url: "https://play.google.com/store/search?q=%D8%A8%D9%83%D8%A7%D9%84%D9%88%D8%B1%D9%8A%D8%A7+%D8%A7%D9%84%D8%AC%D8%B2%D8%A7%D8%A6%D8%B1&c=apps",
    color: "green"
  },
  {
    name: "Desmos",
    icon: "📈",
    description: "آلة حاسبة بيانية قوية تعمل حتى بدون اتصال بالإنترنت. ترسم الدوال والمنحنيات بدقة عالية، وتساعدك على التحقق من صحة التمثيل البياني قبل الاطلاع على الحل.",
    url: "https://play.google.com/store/apps/details?id=com.desmos.calculator",
    color: "emerald"
  },
  {
    name: "NotebookLM",
    icon: "🤖",
    description: "مدرس خصوصي مدعوم بالذكاء الاصطناعي. يمكنك رفع عشرات المصادر مجانًا ثم طرح أي سؤال، وسيجيب اعتمادًا على تلك المصادر فقط دون اختلاق معلومات، مما يجعله مثاليًا لمراجعة جميع المواد.",
    url: "https://notebooklm.google.com/",
    color: "purple"
  },
  {
    name: "CamScanner",
    icon: "📸",
    description: "ضروري لتحويل الصور إلى ملفات PDF عالية الجودة. استخدمه لحفظ الاختبارات، الملخصات والتمارين وتنظيمها للرجوع إليها لاحقًا.",
    url: "https://play.google.com/store/apps/details?id=com.intsig.camscanner",
    color: "teal"
  },
  {
    name: "Tarteel",
    icon: "📖",
    description: "وسط ضغط الدراسة، يبقى القرآن مصدرًا للطمأنينة. يتميز هذا التطبيق بتلاوات متقنة، وتصحيح التلاوة، والمساعدة على الحفظ، إلى جانب العديد من الخصائص التفاعلية التي تستحق التجربة.",
    url: "https://play.google.com/store/apps/details?id=com.mmm.tarteel",
    color: "emerald"
  }
];

export default function AppsPage() {
  return (
    <AppShell>
      <div className="back-link-wrapper" style={{ margin: "1rem 0" }}>
        <Link className="back-link" href="/tools">← العودة للأدوات</Link>
      </div>

      <section className="subject-page-heading" style={{ marginBottom: "2rem" }}>
        <div>
          <p className="eyebrow">أدوات المراجعة</p>
          <h1>أفضل التطبيقات للدراسة</h1>
          <p>مجموعة من التطبيقات المجربة شخصياً والتي ستصنع الفارق في تحضيرك للبكالوريا.</p>
        </div>
        <span className="subject-hero-icon subject-icon-purple" aria-hidden="true">
          📱
        </span>
      </section>

      <section className="apps-list">
        {apps.map((app, index) => (
          <article className="app-card" key={app.name} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            marginBottom: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <div className="app-card-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className={`subject-icon subject-icon-${app.color}`} style={{ width: '3rem', height: '3rem', fontSize: '1.5rem' }}>
                {app.icon}
              </span>
              <div>
                <span className="eyebrow" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>المرتبة #{index + 1}</span>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text)' }}>{app.name}</h3>
              </div>
            </div>
            
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
              {app.description}
            </p>

            <div className="app-card-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <a 
                href={app.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="file-action file-action-download"
                style={{ textDecoration: 'none' }}
              >
                تنزيل التطبيق
              </a>
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
