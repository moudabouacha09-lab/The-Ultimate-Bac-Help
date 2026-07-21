import { AppShell } from "@/components/layout/app-shell";
import Link from "next/link";
import Image from "next/image";

export default function BooksPage() {
  const subjects = [
    {
      title: "الرياضيات",
      icon: "∑",
      color: "blue",
      books: [
        { title: "سلسلة الدوال", author: "الأستاذ نور الدين", image: "/books/math-functions.webp", desc: "المرجع الأساسي لضمان العلامة الكاملة في الدوال." },
        { title: "سلسلة المتتاليات", author: "الأستاذ نور الدين", image: "/books/math-sequences.jpg", desc: "تغطية شاملة لكل أفكار المتتاليات وتطبيقاتها." },
        { title: "سلسلة الاحتمالات", author: "الأستاذ نور الدين", image: "/books/math-prob.webp", desc: "شرح مبسط وتدريب مكثف لفهم الاحتمالات." },
        { title: "الأعداد المركبة", author: "الأستاذ نور الدين", image: "/books/math-complex.jpg", desc: "تدريب مكثف على تمارين وأفكار الأعداد المركبة." },
        { title: "الأعداد والحساب", author: "الأستاذ نور الدين", image: "/books/math-arithmetic.jpg", desc: "كتاب خاص بشعبتي الرياضيات والتقني رياضي." },
      ]
    },
    {
      title: "الفيزياء",
      icon: "⚡",
      color: "cyan",
      books: [
        { title: "تأشيرة النجاح - الجزء الأول", author: "الأستاذ شنايط", image: "/books/physics-visa-1.webp", desc: "كتاب غني بالتمارين والأفكار للوحدات الأولى." },
        { title: "تأشيرة النجاح - الجزء الثاني", author: "الأستاذ شنايط", image: "/books/physics-visa-2.webp", desc: "تدريب مكثف على الظواهر الكهربائية والميكانيكية." },
        { title: "تأشيرة النجاح - الجزء الثالث", author: "الأستاذ شنايط", image: "/books/physics-visa-3.jpg", desc: "مراجعة نهائية وشاملة لجميع وحدات الفيزياء." },
      ]
    },
    {
      title: "العلوم الطبيعية",
      icon: "🧬",
      color: "green",
      books: [
        { title: "الجوهرة - الجزء الأول", author: "الأستاذة خيرة فليتي", image: "/books/science-jawhara-1.webp", desc: "مرجع متكامل للوحدات الأولى في العلوم الطبيعية." },
        { title: "الجوهرة - الجزء الثاني", author: "الأستاذة خيرة فليتي", image: "/books/science-jawhara-2.webp", desc: "تغطية شاملة ومبسطة للوحدات المتبقية في العلوم." },
        { title: "سلسلة العلوم الطبيعية", author: "الأستاذ محجوب عمار", image: "/books/science-mahjoub.jpg", desc: "مرجع ممتاز للتدرب على المنهجية الصحيحة وبناء الإجابة." },
      ]
    },
    {
      title: "اللغة العربية",
      icon: "أ",
      color: "orange",
      books: [
        { title: "الجوهرة في اللغة العربية", author: "الأستاذ بوبكر", image: "/books/arabic-jawhara.webp", desc: "دليلك الشامل لضمان نقطة ممتازة في الأدب والبناء اللغوي." },
      ]
    },
    {
      title: "العلوم الإسلامية",
      icon: "🕋",
      color: "green",
      books: [
        { title: "السلسلة الأرجوانية", author: "الأستاذة بوسعادي", image: "/books/islamic-purple.jpg", desc: "ملخصات دقيقة وحفظ سهل لجميع الدروس المقررة." },
        { title: "السلسلة الخضراء", author: "الأستاذة بوسعادي", image: "/books/islamic-green.jpg", desc: "تدريب على جميع أسئلة الفهم والمباشرة وطرق الإجابة." },
      ]
    },
    {
      title: "التاريخ والجغرافيا",
      icon: "🌍",
      color: "violet",
      books: [
        { title: "السلسلة الأرجوانية", author: "الأستاذ بورنان", image: "/books/history-bournan.jpg", desc: "من أفضل المراجع لحفظ وفهم الاجتماعيات ببساطة." },
      ]
    },
    {
      title: "الفلسفة",
      icon: "🤔",
      color: "blue",
      books: [
        { title: "كتاب المتفوقة", author: "خولة", image: "/books/philosophy-motafawiqa.jpg", desc: "مقالات جاهزة ومنهجية واضحة للتفوق في مادة الفلسفة." },
      ]
    }
  ];

  return (
    <AppShell>
      <div className="back-link-wrapper" style={{ margin: "1rem 0" }}>
        <Link className="back-link" href="/tools">← العودة للأدوات</Link>
      </div>

      <section className="subject-page-heading" style={{ marginBottom: "2rem" }}>
        <div>
          <p className="eyebrow">أدوات المراجعة</p>
          <h1>أفضل الكتب الخارجية</h1>
          <p style={{ marginTop: "1rem", lineHeight: "1.8", color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "60rem" }}>
            مجموعة من أفضل وأشهر الكتب والمراجع الخارجية التي اعتمدتُ عليها شخصياً للمراجعة في مختلف المواد.
          </p>
        </div>
        <span className="subject-hero-icon subject-icon-violet" aria-hidden="true">
          📚
        </span>
      </section>

      {/* Disclaimer Alert */}
      <div style={{ backgroundColor: '#fff3e0', border: '1px solid #ffe0b2', borderRight: '4px solid #ff9800', padding: '1.5rem', borderRadius: '12px', marginBottom: '3rem' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#e65100', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>⚠️</span> ملاحظة هامة جداً
        </h3>
        <p style={{ margin: 0, color: '#e65100', lineHeight: '1.8', fontSize: '0.95rem' }}>
          نجاح التلميذ لا يقتصر على هذه الكتب أو على غيرها... حضورها مفيد ومهم لكنه ليس بقدر أهمية حرص التلميذ على المثابرة في تنظيم وقته ومعلوماته وعدم إهمال مواظبته على الذهاب للثانوية لأخذ العلم الصحيح من معلميه. لأن هذه الكتب تعتبر أدوات <strong>مكملة وليست أساسية</strong>.
          <br /><br />
          الاستغلال الأمثل لهذه الكتب هو الذي سيسهل للتلميذ الطريق للإحاطة بجميع المعلومات الضرورية حتى يتحصل على العلامة الكاملة أو على الأقل علامة ممتازة. 
          <br /><br />
          وتبقى هذه الكتب اقتراحات تلميذ، والعديد من الكتب الأخرى قد تكون أفضل من هذه... الأمر يعتمد في النهاية على التلميذ وتفضيلاته وطريقة فهمه ومستواه.
        </p>
      </div>

      <div className="books-container" style={{ display: "flex", flexDirection: "column", gap: "3.5rem", maxWidth: "62rem" }}>
        
        {subjects.map((subject) => (
          <section key={subject.title} className="subject-books">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', marginBottom: '1.5rem', color: `var(--${subject.color}-800)` }}>
              <span className={`subject-icon subject-icon-${subject.color}`} style={{ width: '2rem', height: '2rem', fontSize: '1rem' }}>
                {subject.icon}
              </span>
              {subject.title}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {subject.books.map((book, index) => (
                <div key={index} style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', transition: 'transform 0.2s, box-shadow 0.2s' }} className="book-card">
                  <div style={{ position: 'relative', width: '100%', height: '350px', backgroundColor: '#f8f9fa' }}>
                    <Image 
                      src={book.image} 
                      alt={book.title} 
                      fill 
                      style={{ objectFit: 'cover', objectPosition: 'center top' }}
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ margin: '0 0 0.25rem', color: 'var(--blue-900)', fontSize: '1.1rem' }}>{book.title}</h3>
                    <p style={{ margin: '0 0 0.75rem', color: 'var(--ink-500)', fontSize: '0.85rem', fontWeight: 'bold' }}>{book.author}</p>
                    <p style={{ margin: 0, color: 'var(--ink-700)', fontSize: '0.9rem', lineHeight: '1.6' }}>{book.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .book-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 25px rgba(18, 50, 74, 0.1);
          border-color: #a8d2e2;
        }
      `}} />
    </AppShell>
  );
}
