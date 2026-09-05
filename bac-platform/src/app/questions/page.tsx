"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/context/auth-context";
import { createClient } from "@/lib/supabase/client";
import { subjects } from "@/lib/subjects";
import { MessageCircleQuestion, Plus, X, CheckCircle2, Clock, ArrowRight } from "lucide-react";

type Answer = { id: string; answer_text: string; answered_by: string; created_at: string; profiles?: { title?: string | null; full_name?: string | null } | null };
type Question = { id: string; subject_slug: string; unit: string | null; question_text: string; created_at: string; answers: Answer[] };

const relativeTime = (date: string) => {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  return `منذ ${Math.floor(hours / 24)} يوم`;
};

export default function QuestionsPage() {
  const supabase = createClient();
  const { user, openAuthModal } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"all" | "answered" | "pending">("all");
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [unit, setUnit] = useState("");
  const [text, setText] = useState("");
  const [remaining, setRemaining] = useState(3);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    const [{ data: rows, error: questionsError }, { data: countRows }] = await Promise.all([
      supabase.from("questions").select("id, subject_slug, unit, question_text, created_at").order("created_at", { ascending: false }),
      supabase.from("questions").select("subject_slug"),
    ]);
    if (questionsError) {
      setMessage("تعذر تحميل الأسئلة حالياً. حاول تحديث الصفحة.");
      setLoading(false);
      return;
    }
    const list = ((rows as Omit<Question, "answers">[] | null) ?? []).map((q) => ({ ...q, answers: [] as Answer[] }));
    if (list.length) {
      const { data: answerRows } = await supabase.from("answers").select("id, question_id, answer_text, created_at, answered_by").in("question_id", list.map((q) => q.id)).order("created_at", { ascending: true });
      const teacherIds = [...new Set((answerRows ?? []).map((answer: Answer & { answered_by: string }) => answer.answered_by))];
      const { data: teacherProfiles } = teacherIds.length ? await supabase.from("profiles").select("id, title, full_name").in("id", teacherIds) : { data: [] };
      const profileById = new Map((teacherProfiles ?? []).map((profile: { id: string; title?: string | null; full_name?: string | null }) => [profile.id, profile]));
      const answersByQuestion = new Map<string, Answer[]>();
      (answerRows ?? []).forEach((answer: Answer & { question_id: string }) => {
        answersByQuestion.set(answer.question_id, [...(answersByQuestion.get(answer.question_id) ?? []), { ...answer, profiles: profileById.get(answer.answered_by) }]);
      });
      list.forEach((q) => { q.answers = answersByQuestion.get(q.id) ?? []; });
    }
    setQuestions(list);
    const nextCounts: Record<string, number> = {};
    (countRows ?? []).forEach((row: { subject_slug: string }) => { nextCounts[row.subject_slug] = (nextCounts[row.subject_slug] ?? 0) + 1; });
    setCounts(nextCounts);
    if (user) {
      const start = new Date(); start.setHours(0, 0, 0, 0);
      const { count } = await supabase.from("questions").select("id", { count: "exact", head: true }).eq("student_id", user.id).gte("created_at", start.toISOString());
      setRemaining(Math.max(0, 3 - (count ?? 0)));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const filtered = useMemo(() => questions.filter((q) => {
    const matchesSubject = subjectFilter === "ALL" || q.subject_slug === subjectFilter;
    const answered = q.answers?.length > 0;
    return matchesSubject && (statusFilter === "all" || (statusFilter === "answered" ? answered : !answered));
  }), [questions, subjectFilter, statusFilter]);

  const submitQuestion = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) { openAuthModal("login"); return; }
    if (!subject || !text.trim()) return;
    const { error } = await supabase.from("questions").insert({ student_id: user.id, subject_slug: subject, unit: unit.trim() || null, question_text: text.trim() });
    if (error) {
      setMessage(error.message.includes("daily_question_limit") ? "لقد استخدمت أسئلتك الثلاثة لهذا اليوم" : "تعذر إرسال السؤال حالياً.");
      return;
    }
    setShowModal(false); setSubject(""); setUnit(""); setText(""); setMessage(null); await load();
  };

  return <AppShell><div className="max-w-5xl mx-auto px-gutter py-xl">
    <Link href="/tools" className="back-link inline-flex items-center gap-2 mb-6"><ArrowRight size={16} /> العودة للأدوات</Link>
    <header className="text-center max-w-3xl mx-auto mb-8"><span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-label-md font-semibold"><MessageCircleQuestion size={16} /> أسئلة الطلاب</span><h1 className="font-headline text-display-lg text-primary font-bold mt-4 mb-3">اسأل، تعلّم، وتقدّم</h1><p className="text-body-lg text-on-surface-variant">أسئلة حقيقية من طلاب البكالوريا وإجابات موثوقة من الأساتذة المعتمدين.</p></header>
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6"><div className="flex gap-2 overflow-x-auto">{[{ slug: "ALL", name: "الكل" }, ...subjects].map((s) => <button key={s.slug} onClick={() => setSubjectFilter(s.slug)} className={`px-4 py-2 rounded-full text-label-md whitespace-nowrap ${subjectFilter === s.slug ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface border border-primary/10"}`}>{s.name}{s.slug !== "ALL" && <small className="mr-1 opacity-75">({counts[s.slug] ?? 0})</small>}</button>)}</div><button onClick={() => user ? setShowModal(true) : openAuthModal("login")} className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-4 py-2 rounded-lg font-semibold"><Plus size={17} /> اطرح سؤالاً</button></div>
    <div className="flex gap-2 mb-6"><button onClick={() => setStatusFilter("all")} className={`px-4 py-2 rounded-lg ${statusFilter === "all" ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface"}`}>كل الأسئلة</button><button onClick={() => setStatusFilter("answered")} className={`px-4 py-2 rounded-lg ${statusFilter === "answered" ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface"}`}>تمت الإجابة</button><button onClick={() => setStatusFilter("pending")} className={`px-4 py-2 rounded-lg ${statusFilter === "pending" ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface"}`}>بانتظار الإجابة</button></div>
    {loading ? <p className="text-center py-16 text-on-surface-variant">جاري تحميل الأسئلة...</p> : <div className="space-y-4">{filtered.map((q) => { const answer = q.answers?.[0]; const name = subjects.find((s) => s.slug === q.subject_slug)?.name ?? q.subject_slug; return <article id={`question-${q.id}`} key={q.id} className="bg-surface-bright border border-primary/10 rounded-2xl p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-2 mb-3"><div className="flex items-center gap-2"><span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-caption font-bold">{name}</span>{q.unit && <span className="bg-secondary/10 text-secondary rounded-full px-3 py-1 text-caption">#{q.unit.replace(/\s+/g, "_")}</span>}</div><span className="text-caption text-on-surface-variant">{relativeTime(q.created_at)}</span></div><p className="text-body-lg text-on-surface leading-relaxed">{q.question_text}</p>{answer && <div className="mt-4 border-t border-primary/10 pt-4 bg-primary/5 rounded-xl p-4"><div className="flex items-center gap-2 text-primary font-bold mb-2"><CheckCircle2 size={17} /> إجابة {answer.profiles?.title || answer.profiles?.full_name || "أستاذ معتمد"}</div><p className="text-body-md text-on-surface whitespace-pre-wrap">{answer.answer_text}</p></div>}{!answer && <div className="mt-3 flex items-center gap-2 text-secondary text-caption"><Clock size={15} /> بانتظار إجابة أستاذ معتمد</div>}</article>})}</div>}
    {!loading && filtered.length === 0 && <div className="bg-surface-container-low border border-primary/10 rounded-xl p-12 text-center text-on-surface-variant">لا توجد أسئلة مطابقة حالياً.</div>}
    {showModal && <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4"><form onSubmit={submitQuestion} className="w-full max-w-lg bg-surface-bright rounded-2xl p-6 shadow-xl"><div className="flex items-center justify-between mb-5"><h2 className="font-headline text-headline-md text-primary font-bold">اطرح سؤالاً</h2><button type="button" onClick={() => setShowModal(false)} aria-label="إغلاق"><X /></button></div><p className="text-caption text-on-surface-variant mb-4">المتبقي اليوم: {remaining} من 3 أسئلة</p><select required value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-surface-bright border border-primary/20 rounded-lg p-3 mb-3"><option value="">اختر المادة</option>{subjects.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}</select><input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="الوحدة (اختياري)" className="w-full bg-surface-bright border border-primary/20 rounded-lg p-3 mb-3" /><textarea required value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="اكتب سؤالك بوضوح..." className="w-full bg-surface-bright border border-primary/20 rounded-lg p-3 mb-4" />{message && <p className="text-error text-caption mb-3">{message}</p>}<button disabled={remaining === 0} className="w-full bg-primary text-on-primary rounded-lg py-3 font-bold disabled:opacity-50">إرسال السؤال</button></form></div>}
  </div></AppShell>;
}
