// src/app/page.tsx
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { GraduationCap, Calculator, Target, Dna } from "lucide-react";
import { FadeInSection } from "@/components/effects/fade-in-section";
import { getNewsFeed } from "@/lib/news-service";
import { MinisterialCard } from "@/components/news/ministerial-card";
import { NewsFeed } from "@/components/news/news-feed";
import { CountdownCard } from "@/components/news/countdown-card";

const quickShortcuts = [
  { href: "/tools/orientation", icon: <GraduationCap size={22} />, title: "مستشار التوجيه 🎓", text: "احسب معدلك الموزون واكتشف المدارس المتاحة", tone: "blue" },
  { href: "/calculator", icon: <Calculator size={22} />, title: "حاسبة المعدل ⚖️", text: "حاسبة البكالوريا الرسمية وفق معاملات 2026", tone: "green" },
  { href: "/tools/prerequisites/quiz", icon: <Target size={22} />, title: "اختبار المكتسبات 🎯", text: "تشخيص 10 أسئلة وتمرين شامل في المواد العلمية", tone: "violet" },
  { href: "/subject/science", icon: <Dna size={22} />, title: "مكتبة العلوم 🧬", text: "ملخصات وتمارين وحدات البروتين والجيولوجيا", tone: "blue" }
];

export default async function HomePage() {
  const newsFeed = await getNewsFeed();
  const latestOfficialNews = newsFeed.find((item) => item.category === "official") || newsFeed[0];

  return (
    <AppShell>
      {/* Hero Header */}
      <section className="home-intro" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 0.85rem", backgroundColor: "rgba(34, 197, 94, 0.15)", borderRadius: "999px", color: "#22c55e", fontSize: "0.82rem", fontWeight: "800", marginBottom: "0.75rem" }}>
          <span>● مباشر</span>
          <span style={{ color: "var(--text-secondary)" }}>| آخر الأخبار والمستجدات الرسمية 🇩🇿</span>
        </div>
        <h1>تغطية حية ومستجدات البكالوريا 2026/2027</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginTop: "0.5rem" }}>
          متابعة فورية ومبسطة لقرارات وزارة التربية الوطنية، المنشور الوزاري، والتحديثات الدراسية المباشرة.
        </p>
      </section>

      {/* Countdown Card */}
      <CountdownCard />

      {/* Ministerial Hero Agent Card */}
      {latestOfficialNews && (
        <FadeInSection delay={50}>
          <MinisterialCard news={latestOfficialNews} />
        </FadeInSection>
      )}

      {/* Categorized News Feed */}
      <FadeInSection delay={120}>
        <div style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
            📰 التغذية الإخبارية والتحديثات اليومية
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
            اختر التبويب لمتابعة القرارات الوزارية، تحديثات المحتوى، والنصائح المنهجية.
          </p>
        </div>
        <NewsFeed items={newsFeed} />
      </FadeInSection>

      {/* Quick Access Shortcuts */}
      <section className="dashboard-section" aria-labelledby="quick-shortcuts-title" style={{ marginTop: "2.5rem" }}>
        <div className="dashboard-section-heading">
          <h2 id="quick-shortcuts-title">🚀 اختصارات فورية للخدمات</h2>
          <span>الأدوات الأكثر استخداماً</span>
        </div>
        <div className="quick-links-grid">
          {quickShortcuts.map((link, i) => (
            <FadeInSection key={link.href} delay={i * 60}>
              <Link className="quick-link-card" href={link.href}>
                <span className={`quick-link-icon quick-link-${link.tone}`} aria-hidden="true">{link.icon}</span>
                <span><strong>{link.title}</strong><small>{link.text}</small></span>
                <span className="quick-link-arrow" aria-hidden="true">←</span>
              </Link>
            </FadeInSection>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
