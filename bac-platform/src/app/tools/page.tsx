import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";

export default function ToolsPage() {
  return (
    <AppShell>
      <section className="tools-heading">
        <p className="eyebrow">أدوات المراجعة</p>
        <h1>كل ما يساعدك على تنظيم تحضيرك.</h1>
        <p>اختر أداة وابدأ بخطوة صغيرة نحو هدفك.</p>
      </section>

      <section className="tools-grid" aria-label="دليل الأدوات">
        <Link className="tool-card" href="/calculator">
          <span className="tool-card-icon" aria-hidden="true">∑</span>
          <span className="tool-card-content">
            <strong>حاسبة معدل البكالوريا</strong>
            <small>احسب معدلك التقديري مع معاملات شعبتك.</small>
          </span>
          <span className="tool-card-arrow" aria-hidden="true">←</span>
        </Link>
      </section>
    </AppShell>
  );
}
