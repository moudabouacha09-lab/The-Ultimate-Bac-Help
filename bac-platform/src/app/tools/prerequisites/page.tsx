import { AppShell } from "@/components/layout/app-shell";
import Link from "next/link";

export default function PrerequisitesPage() {
  return (
    <AppShell>
      <div className="back-link-wrapper" style={{ margin: "1rem 0" }}>
        <Link className="back-link" href="/tools">← العودة للأدوات</Link>
      </div>

      <section className="subject-page-heading" style={{ marginBottom: "2rem" }}>
        <div>
          <p className="eyebrow">أدوات المراجعة</p>
          <h1>المكتسبات القبلية</h1>
          <p style={{ marginTop: "1rem", lineHeight: "1.8", color: "var(--text-muted)", fontSize: "1.05rem" }}>
            فيديوهات ضرورية للإحاطة بكل المعارف السابقة من السنوات الأولى والثانية ثانوي لبداية قوية في البكالوريا. 
            خصص وقتاً لمشاهدتها قبل الدخول المدرسي لتضمن انطلاقة صحيحة.
          </p>
        </div>
        <span className="subject-hero-icon subject-icon-orange" aria-hidden="true">
          🌱
        </span>
      </section>

      <div className="prerequisites-container" style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        
        {/* Mathematics */}
        <section className="prerequisite-section">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--blue-600)' }}>
            <span className="subject-icon subject-icon-blue" style={{ width: '2rem', height: '2rem', fontSize: '1rem' }}>∑</span>
            الرياضيات
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', flex: '1 1 300px' }}>
              <strong>الأستاذ نور الدين:</strong> فيديو 20 ساعة. يستحق تقسيمه على فترات والإحاطة بجميع المعارف السابقة، بل وبنسبة عالية من معارف البكالوريا.
            </p>
            <a href="https://youtu.be/pWJsnK4TGiY" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'var(--red-600)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
              الأفضل المشاهدة من اليوتيوب ↗
            </a>
          </div>
          <div className="video-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <iframe 
              src="https://www.youtube.com/embed/pWJsnK4TGiY" 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
        </section>

        {/* Science */}
        <section className="prerequisite-section">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--green-600)' }}>
            <span className="subject-icon subject-icon-green" style={{ width: '2rem', height: '2rem', fontSize: '1rem' }}>🧬</span>
            العلوم الطبيعية
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', flex: '1 1 300px' }}>
              <strong>الأستاذ شاوش:</strong> العلوم ليست جميع معارفها سابقة من السنة 2 و 1 ثانوي لأنه سيعاد التطرق لها مرة أخرى في البكالوريا، لكن للاحتياط هذا الفيديو سينعش الذاكرة.
            </p>
            <a href="https://youtu.be/EPv7qV4ryX8" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'var(--red-600)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
              الأفضل المشاهدة من اليوتيوب ↗
            </a>
          </div>
          <div className="video-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <iframe 
              src="https://www.youtube.com/embed/EPv7qV4ryX8" 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text)' }}>أهمية المنهجية</h3>
          <p style={{ marginBottom: '1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            المنهجية هي الأهم ويجب مراجعتها وتثبيتها جيداً قبل الدخول المدرسي. إليك فيديوهين لمساعدتك:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div>
              <div style={{ marginBottom: '0.5rem', textAlign: 'left' }}>
                <a href="https://youtu.be/X0yKn_MP-fM" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: 'var(--red-600)', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '6px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 500 }}>
                  شاهد في اليوتيوب ↗
                </a>
              </div>
              <div className="video-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <iframe 
                  src="https://www.youtube.com/embed/X0yKn_MP-fM" 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>
            </div>
            <div>
              <div style={{ marginBottom: '0.5rem', textAlign: 'left' }}>
                <a href="https://youtu.be/MG_EbEpMQoY" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: 'var(--red-600)', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '6px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 500 }}>
                  شاهد في اليوتيوب ↗
                </a>
              </div>
              <div className="video-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <iframe 
                  src="https://www.youtube.com/embed/MG_EbEpMQoY" 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Physics */}
        <section className="prerequisite-section">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--cyan-600)' }}>
            <span className="subject-icon subject-icon-cyan" style={{ width: '2rem', height: '2rem', fontSize: '1rem' }}>⚡</span>
            العلوم الفيزيائية
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', flex: '1 1 300px' }}>
              <strong>الأستاذ عبد اللطيف:</strong> يوفر 6 فيديوهات تأسيسية (ليست طويلة) للفيزياء. يرجى إكمالها كقاعدة صلبة قبل البداية.
            </p>
            <a href="https://www.youtube.com/playlist?list=PLlkvPioEFgAILdlft6aIzWjrjreH0RBY3" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'var(--red-600)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
              الأفضل المشاهدة من اليوتيوب ↗
            </a>
          </div>
          <div className="video-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <iframe 
              src="https://www.youtube.com/embed/videoseries?list=PLlkvPioEFgAILdlft6aIzWjrjreH0RBY3" 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
        </section>

        {/* Languages */}
        <section className="prerequisite-section">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--indigo-600)' }}>
            <span className="subject-icon subject-icon-indigo" style={{ width: '2rem', height: '2rem', fontSize: '1rem' }}>A</span>
            الفرنسية والإنجليزية
          </h2>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border)', borderLeft: '4px solid var(--indigo-600)' }}>
            <p style={{ margin: 0, color: 'var(--text)', lineHeight: '1.8' }}>
              <strong>وجب التحضير لهما جيدا...</strong> 
              <br/><br/>
              اللغات لا تحتاج فيديوهات مكتسبات قبلية، بل تحتاج إلى مراجعة الكلمات المفتاحية (Vocabulaire / Vocabulary) والتأسيس لكتابة وضعيات إدماجية والتدرب على الكتابة الصحيحة (Orthographe). 
              <br/><br/>
              إذا قمت بذلك، تكون قد بنيت الأساس المتين الذي ستكمل عليه عامك الدراسي في هاتين المادتين بكل أريحية.
            </p>
          </div>
        </section>

      </div>
    </AppShell>
  );
}
