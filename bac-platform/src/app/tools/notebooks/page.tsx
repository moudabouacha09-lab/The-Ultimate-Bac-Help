import { AppShell } from "@/components/layout/app-shell";
import Link from "next/link";

interface NotebookInfo {
  subject: string;
  icon: string;
  url: string;
  color: string;
}

const notebooks: NotebookInfo[] = [
  { subject: "الرياضيات", icon: "∑", url: "https://notebooklm.google.com/notebook/3b69473d-e349-4858-aee5-ca7cc137251f", color: "blue" },
  { subject: "العلوم الطبيعية", icon: "🧬", url: "https://notebooklm.google.com/notebook/008762bf-ccb0-48fe-b01b-ce7f5ffd0595", color: "green" },
  { subject: "العلوم الفيزيائية", icon: "⚡", url: "https://notebooklm.google.com/notebook/280ee977-083d-40b1-8453-e60e8ad6cf2a", color: "cyan" },
  { subject: "الفلسفة", icon: "🧠", url: "https://notebooklm.google.com/notebook/091214d1-e9b6-4a28-8728-fc7c3d50894f", color: "purple" },
  { subject: "التاريخ", icon: "📜", url: "https://notebooklm.google.com/notebook/b7585059-485e-4490-b19a-4942df3e4712", color: "yellow" },
  { subject: "الجغرافيا", icon: "🌍", url: "https://notebooklm.google.com/notebook/6ddbb130-d46f-4ff2-a7a1-7063ab36a0c3", color: "orange" },
  { subject: "اللغة العربية", icon: "📖", url: "https://notebooklm.google.com/notebook/c9e69640-a482-4df6-9447-f447fb0395d5", color: "red" },
  { subject: "اللغة الإنجليزية", icon: "A", url: "https://notebooklm.google.com/notebook/021afa27-2d2f-423c-a8c1-98d4ce27033f", color: "indigo" },
  { subject: "العلوم الإسلامية", icon: "🕌", url: "https://notebooklm.google.com/notebook/0182dfb7-414c-40b5-bb0f-9a5342d83c39", color: "emerald" },
];

export default function NotebooksPage() {
  return (
    <AppShell>
      <div className="back-link-wrapper" style={{ margin: "1rem 0" }}>
        <Link className="back-link" href="/tools">← العودة للأدوات</Link>
      </div>

      <section className="subject-page-heading" style={{ marginBottom: "2rem" }}>
        <div>
          <p className="eyebrow">أدوات المراجعة</p>
          <h1>My Notebooks</h1>
          <p style={{ marginTop: "1rem", lineHeight: "1.8", color: "var(--text-muted)", fontSize: "1.05rem" }}>
            هذه المذكرات مبنية عبر تطبيق <strong>Google NotebookLM</strong> (أحد أفضل تطبيقات المراجعة). 
            ليست مجرد روبوتات محادثة (Chatbots)، بل هي قواعد بيانات تم بناؤها طوال العام بمصادر موثوقة دقيقة جمعها تلميذ البكالوريا، لتجيب عن أسئلتك حصرياً من تلك المصادر.
            <br />
            ترافق كل مذكرة وثائق تفاعلية (عروض تقديمية، رسوم بيانية، مقاطع صوتية) تم توليدها بالذكاء الاصطناعي لتسهيل فهمك واستيعابك.
          </p>
        </div>
        <span className="subject-hero-icon subject-icon-blue" aria-hidden="true">
          🤖
        </span>
      </section>

      <section className="apps-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {notebooks.map((nb) => (
          <article className="app-card" key={nb.subject} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className={`subject-icon subject-icon-${nb.color}`} style={{ width: '2.5rem', height: '2.5rem', fontSize: '1.25rem' }}>
                {nb.icon}
              </span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>{nb.subject}</h3>
                <span className="eyebrow" style={{ fontSize: '0.75rem' }}>مساعد ذكي</span>
              </div>
            </div>
            
            <a 
              href={nb.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="file-action file-action-preview"
              style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}
            >
              افتح المحادثة
            </a>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
