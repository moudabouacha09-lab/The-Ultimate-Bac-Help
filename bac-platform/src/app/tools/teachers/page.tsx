"use client";

import { AppShell } from "@/components/layout/app-shell";
import Link from "next/link";
import Image from "next/image";
import { Play, Hourglass, Zap, Dna, Globe, Brain } from "lucide-react";
import type { ReactNode } from "react";
import { FadeInSection } from "@/components/effects/fade-in-section";

interface Teacher {
  id: string;
  name: string;
  url: string;
  description: string;
}

interface Category {
  title: string;
  icon: ReactNode;
  color: string;
  teachers: Teacher[];
}

const categories: Category[] = [
  {
    title: "الرياضيات",
    icon: "∑",
    color: "blue",
    teachers: [
      { id: "Noureddine", name: "الأستاذ نور الدين", url: "https://www.youtube.com/@noureddine2013", description: "شرح مفصل ومبسط لجميع المحاور مع حل آلاف التمارين المتنوعة." },
      { id: "Abdelbasset", name: "الأستاذ عبد الباسط", url: "https://www.youtube.com/channel/UCnMzRcYSang1SXOZLH77ljw", description: "طرق عبقرية في الشرح ومراجعات شاملة للمقترحات." }
    ]
  },
  {
    title: "العلوم الفيزيائية",
    icon: <Zap size={20} />,
    color: "cyan",
    teachers: [
      { id: "Abdellah", name: "الأستاذ عبد الله", url: "https://www.youtube.com/@prof_Abdellah", description: "شرح القوانين الفيزيائية بطريقة مبسطة مع تمارين تطبيقية." },
      { id: "Abdelatif", name: "الأستاذ عبد اللطيف", url: "https://www.youtube.com/@abdelatif_phyDZ", description: "منهجية ممتازة في الحل والتعامل مع الأفكار الصعبة." }
    ]
  },
  {
    title: "العلوم الطبيعية",
    icon: <Dna size={20} />,
    color: "green",
    teachers: [
      { id: "Khira-Fliti", name: "الأستاذة خيرة فليتي", url: "https://www.youtube.com/@%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%A7%D8%B0%D8%A9%D8%AE%D9%8A%D8%B1%D8%A9%D9%81%D9%84%D9%8A%D8%AA%D9%8A%D9%81%D9%8A%D8%B9%D9%84%D9%88%D9%85%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D8%B9%D8%A9", description: "تركيز كبير على منهجية الإجابة واستغلال الوثائق بشكل مثالي." },
      { id: "Chaouch", name: "الأستاذ شاوش", url: "https://www.youtube.com/@Profchaouch", description: "شرح ممتع يربط الدروس ببعضها لتسهيل الفهم والحفظ." }
    ]
  },
  {
    title: "اللغات (عربية، إنجليزية، فرنسية)",
    icon: "A",
    color: "indigo",
    teachers: [
      { id: "Boubaker", name: "الأستاذ بوبكر مبروك (عربية)", url: "https://www.youtube.com/@mabrouk_boubaker", description: "تبسيط قواعد اللغة العربية والتدريب على البناء الفكري." },
      { id: "Haigoune", name: "الأستاذ حيقون أسامة (عربية)", url: "https://www.youtube.com/@prof_haigoune", description: "مراجعات شاملة ومنهجية واضحة للتعامل مع النصوص." },
      { id: "Cherifi", name: "الأستاذ شريفي (عربية)", url: "https://www.youtube.com/@%D8%A7%D9%84%D8%A3%D8%B3%D8%AA%D8%A7%D8%B0%D8%B4%D8%B1%D9%8A%D9%81%D9%8A", description: "ملخصات مركزة وتطبيقات عملية على مواضيع البكالوريا." },
      { id: "Amin-English", name: "الأستاذ أمين (إنجليزية)", url: "https://www.youtube.com/@aminenglish", description: "شرح قواعد الإنجليزية ببساطة مع التدريب على التعبير." },
      { id: "Mansouri", name: "الأستاذ منصوري (إنجل/فرنسية)", url: "https://www.youtube.com/@mr.mansouri-english.fran%C3%A7ais", description: "تغطية ممتازة لمادتي الإنجليزية والفرنسية مع التركيز على الأهم." },
      { id: "Prof-Elnajah", name: "Prof Elnadjah (فرنسية)", url: "https://www.youtube.com/@profelnajahh", description: "تعلم الفرنسية بطريقة سهلة خطوة بخطوة للتحضير للبكالوريا." }
    ]
  },
  {
    title: "التاريخ والجغرافيا",
    icon: <Globe size={20} />,
    color: "orange",
    teachers: [
      { id: "Bournan", name: "الأستاذ بورنان", url: "https://www.youtube.com/@%D8%A7%D9%84%D8%A3%D8%B3%D8%AA%D8%A7%D8%B0%D8%A8%D9%88%D8%B1%D9%86%D8%A7%D9%86", description: "طرق حفظ ذكية بالخرائط الذهنية وتسهيل المصطلحات والتواريخ." },
      { id: "Abdennour", name: "الأستاذ عبد النور خليفي", url: "https://www.youtube.com/@abdennourkhalifi", description: "شرح مفصل للدروس مع التركيز على فهم الأحداث التاريخية." }
    ]
  },
  {
    title: "العلوم الإسلامية والفلسفة",
    icon: <Brain size={20} />,
    color: "purple",
    teachers: [
      { id: "Boussaadi", name: "الأستاذة بوسعادي (إسلامية)", url: "https://www.youtube.com/@BOUSSAADI", description: "تبسيط الدروس وتحديد ما يجب حفظه بدقة مع الشواهد." },
      { id: "Chms", name: "الأستاذ شمس الدين (إسلامية)", url: "https://www.youtube.com/@dr_chms2540", description: "مراجعات شاملة ومنهجية للإجابة في امتحان الشريعة." },
      { id: "Saidani-Philo", name: "الأستاذ خليل سعيداني (فلسفة)", url: "https://www.youtube.com/@Saidani-Philo", description: "شرح المقالات الفلسفية بطريقة استيعابية بعيداً عن الحفظ الأعمى." },
      { id: "Adel-Magroud", name: "الأستاذ عادل مقرود (فلسفة)", url: "https://www.youtube.com/@%D8%A3%D8%B3%D8%AA%D8%A7%D8%B0%D8%A7%D9%84%D9%81%D9%84%D8%B3%D9%81%D8%A9%D8%B9%D8%A7%D8%AF%D9%84%D9%85%D9%82%D8%B1%D9%88%D8%AF", description: "منهجية دقيقة لكتابة المقالات وتحصيل أعلى العلامات." }
    ]
  },
  {
    title: "التنظيم والتحفيز (Time Management & Motivation)",
    icon: <Hourglass size={20} />,
    color: "yellow",
    teachers: [
      { id: "Prof-3lilou", name: "Prof 3lilou", url: "https://www.youtube.com/@prof_3lilo_10", description: "نصائح ذهبية في تنظيم الوقت، التغلب على الكسل، ورفع المعنويات بطريقة واقعية." },
      { id: "Wissal", name: "تلميذة سابقة وصال", url: "https://www.youtube.com/@WissalOulem", description: "تجربة حية لتلميذة سابقة تشارك أسرار تفوقها وكيفية تعاملها مع الضغوطات." },
      { id: "Bac-19", name: "باك ب19", url: "https://www.youtube.com/@Bacwith19", description: "قصص نجاح، استراتيجيات للمراجعة الذكية، وتحفيز مستمر للحصول على معدلات ممتازة." }
    ]
  }
];

export default function TeachersPage() {
  return (
    <AppShell>
      <div className="back-link-wrapper" style={{ margin: "1rem 0" }}>
        <Link className="back-link" href="/tools">← العودة للأدوات</Link>
      </div>

      <section className="subject-page-heading" style={{ marginBottom: "2rem" }}>
        <div>
          <p className="eyebrow">أدوات المراجعة</p>
          <h1>قائمة اليوتيوب الذهبية</h1>
          <p style={{ marginTop: "1rem", lineHeight: "1.8", color: "var(--text-muted)", fontSize: "1.05rem" }}>
            لا تضيّع وقتك في البحث! هذه القائمة تضم أفضل أساتذة اليوتيوب الذين تابعتهم شخصياً طوال العام. 
            أساتذة متمكنون، شروحاتهم وافية، ومنهجيتهم دقيقة لضمان تفوقك في البكالوريا.
          </p>
        </div>
        <span className="subject-hero-icon subject-icon-red" aria-hidden="true">
          <Play size={32} />
        </span>
      </section>

      <div className="teachers-categories" style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        {categories.map((category) => (
          <section key={category.title} className="teacher-category">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', marginBottom: '1.5rem', color: `var(--${category.color}-600)` }}>
              <span className={`subject-icon subject-icon-${category.color}`} style={{ width: '2rem', height: '2rem', fontSize: '1rem' }}>
                {category.icon}
              </span>
              {category.title}
            </h2>
            
            <div className="teachers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {category.teachers.map((teacher, index) => (
                <FadeInSection key={teacher.id} delay={index * 80}>
                  <article className="teacher-card" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: '1.5rem',
                    backgroundColor: 'var(--card-bg)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.2s',
                    height: '100%'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {teacher.id === "motivation-placeholder" ? (
                      <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}><Hourglass size={24} /></div>
                    ) : (
                      <img 
                        src={`/avatars/${teacher.id}.jpg`} 
                        alt={teacher.name} 
                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
                        onError={(e) => { e.currentTarget.src = 'https://www.youtube.com/img/desktop/yt_1200.png' }}
                      />
                    )}
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>{teacher.name}</h3>
                      <a href={teacher.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', color: 'var(--red-600)', textDecoration: 'none', display: 'inline-block', marginTop: '0.25rem' }}>
                        زيارة القناة ▶
                      </a>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
                    {teacher.description}
                  </p>
                </article>
                </FadeInSection>
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
