// src/app/tools/page.tsx
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Smartphone, Bot, Play, Sprout, Library, GraduationCap, Calculator, Target } from "lucide-react";

export default function ToolsPage() {
  const tools = [
    {
      href: "/calculator",
      title: "حاسبة معدل البكالوريا",
      desc: "احسب معدلك التقديري والموزون مع معاملات شعبتك رسمياً.",
      icon: <Calculator size={24} />,
      badge: "رسمي"
    },
    {
      href: "/tools/orientation",
      title: "المستشار الذكي للتوجيه الجامعي",
      desc: "احسب معدلك الموزون واكتشف المدارس والتخصصات المتاحة لك.",
      icon: <GraduationCap size={24} />,
      badge: "توجيه"
    },
    {
      href: "/tools/prerequisites/quiz",
      title: "اختبار المكتسبات القبلية",
      desc: "تشخيص تفاعلي لـ 10 أسئلة وتمرين شامل محلول في المواد العلمية.",
      icon: <Target size={24} />,
      badge: "تشخيص"
    },
    {
      href: "/tools/notebooks",
      title: "مذكرات الذكاء الاصطناعي (NotebookLM)",
      desc: "مذكرات تفاعلية ذكية مدعومة بمصادر البكالوريا الدقيقة.",
      icon: <Bot size={24} />,
      badge: "ذكاء اصطناعي"
    },
    {
      href: "/tools/teachers",
      title: "قائمة اليوتيوب الذهبية",
      desc: "أفضل القنوات والأساتذة المعتمدين للمراجعة في جميع المواد.",
      icon: <Play size={24} />,
      badge: "أساتذة"
    },
    {
      href: "/tools/apps",
      title: "التطبيقات الموصى بها",
      desc: "أفضل التطبيقات المجربة لإدارة الوقت والدراسة اليومية.",
      icon: <Smartphone size={24} />,
      badge: "تطبيقات"
    },
    {
      href: "/tools/books",
      title: "أفضل الكتب الخارجية",
      desc: "مراجع وكتب قيمة اعتمدت عليها للوصول إلى التفوق.",
      icon: <Library size={24} />,
      badge: "مراجع"
    },
    {
      href: "/tools/prerequisites",
      title: "المكتسبات القبلية (فيديوهات)",
      desc: "فيديوهات ونقاط منهجية ضرورية قبل البدء في البرنامج.",
      icon: <Sprout size={24} />,
      badge: "أساسيات"
    }
  ];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-gutter py-xl flex flex-col gap-xl">
        {/* ── Page Header ── */}
        <header className="space-y-3 border-b border-primary/10 pb-6">
          <span className="font-body text-label-md text-secondary bg-secondary/10 px-3 py-1 rounded-full inline-block font-semibold">
            أدوات الطالب 🛠️
          </span>
          <h1 className="font-headline text-display-lg text-primary font-bold">
            كل ما يساعدك على تنظيم تحضيرك
          </h1>
          <p className="font-body text-body-lg text-on-surface-variant max-w-2xl">
            مجموعة متكاملة من الأدوات لمساعدتك في التخطيط، التشخيص، ودعم مسيرتك التعليمية نحو النجاح في البكالوريا.
          </p>
        </header>

        {/* ── Tools Grid ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="دليل الأدوات">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-surface-bright border border-primary/10 rounded-xl p-6 hover:border-primary/30 hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {tool.icon}
                  </div>
                  <span className="text-caption font-body font-semibold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">
                    {tool.badge}
                  </span>
                </div>
                <h2 className="font-headline text-headline-md text-primary group-hover:text-primary transition-colors font-bold mb-2">
                  {tool.title}
                </h2>
                <p className="font-body text-body-md text-on-surface-variant leading-relaxed">
                  {tool.desc}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1 text-secondary font-body text-label-md font-semibold group-hover:-translate-x-1 transition-transform">
                <span>فتح الأداة</span>
                <span className="material-symbols-outlined text-sm">arrow_back</span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </AppShell>
  );
}

