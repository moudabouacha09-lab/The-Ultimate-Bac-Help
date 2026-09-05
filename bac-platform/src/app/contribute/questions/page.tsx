"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/context/auth-context";
import { createClient } from "@/lib/supabase/client";
import { subjects } from "@/lib/subjects";
import { CheckCircle2, Clock, Send } from "lucide-react";

type Answer = { id: string; answer_text: string; answered_by: string; created_at: string };
type Question = { id: string; subject_slug: string; unit: string | null; question_text: string; created_at: string; answers: Answer[] };

const ago = (value: string) => {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  return `منذ ${Math.floor(hours / 24)} يوم`;
};

export default function TeacherQuestionsPage() {
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const supabase = createClient();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [profileSubjects, setProfileSubjects] = useState<string[]>([]);
  const [tab, setTab] = useState<"pending" | "mine">("pending");
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    if (!user || !["teacher", "admin"].includes(user.role ?? "")) return;
    const [{ data }, { data: profile }] = await Promise.all([
      supabase.from("questions").select("id, subject_slug, unit, question_text, created_at, answers(id, answer_text, answered_by, created_at)").order("created_at", { ascending: false }),
      supabase.from("profiles").select("subjects").eq("id", user.id).maybeSingle(),
    ]);
    setQuestions((data as Question[] | null) ?? []);
    setProfileSubjects(profile?.subjects ?? []);
  };

  useEffect(() => { load(); }, [user]);

  const allowedSlugs = useMemo(() => new Set(profileSubjects.flatMap((value) => {
    const found = subjects.find((s) => s.slug === value || s.name === value);
    return found ? [found.slug] : [value];
  })), [profileSubjects]);

  const visible = useMemo(() => questions.filter((q) => {
    const permitted = user?.role === "admin" || allowedSlugs.has(q.subject_slug);
    const subjectMatch = subjectFilter === "ALL" || q.subject_slug === subjectFilter;
    const answeredByMe = q.answers?.some((a) => a.answered_by === user?.id);
    return permitted && subjectMatch && (tab === "pending" ? !q.answers?.length : answeredByMe);
  }), [questions, allowedSlugs, subjectFilter, tab, user]);

  const answer = async (questionId: string) => {
    const text = drafts[questionId]?.trim();
    if (!user || !text) return;
    const { error } = await supabase.from("answers").insert({ question_id: questionId, answered_by: user.id, answer_text: text });
    if (error) { setMessage("تعذر إرسال الإجابة حالياً."); return; }
    setDrafts((current) => ({ ...current, [questionId]: "" }));
    setMessage("تم إرسال إجابتك بنجاح.");
    await load();
  };

  if (authLoading) return <AppShell><div className="p-12 text-center">جاري التحقق من الحساب...</div></AppShell>;
  if (!user) return <AppShell><div className="max-w-xl mx-auto p-12 text-center bg-surface-bright rounded-2xl">يجب تسجيل الدخول للوصول إلى أسئلة المساهمين.<button onClick={() => openAuthModal("login")} className="block mx-auto mt-5 bg-primary text-on-primary px-5 py-2 rounded-lg">تسجيل الدخول</button></div></AppShell>;
  if (!["teacher", "admin"].includes(user.role ?? "")) return <AppShell><div className="p-12 text-center">هذه الصفحة مخصصة للأساتذة والمشرفين.</div></AppShell>;

  return <AppShell><div className="max-w-5xl mx-auto px-gutter py-xl" dir="rtl">
    <header className="mb-8"><span className="text-primary font-semibold">مركز المساهمين</span><h1 className="font-headline text-display-md text-primary font-bold mt-2">أسئلة الطلاب</h1><p className="text-on-surface-variant mt-2">أجب عن الأسئلة المرتبطة بالمواد التي تدرّسها.</p></header>
    <div className="flex flex-wrap gap-3 mb-5"><button onClick={() => setTab("pending")} className={`px-5 py-2 rounded-full ${tab === "pending" ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface"}`}><Clock size={16} className="inline ml-2" />بانتظار الإجابة</button><button onClick={() => setTab("mine")} className={`px-5 py-2 rounded-full ${tab === "mine" ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface"}`}><CheckCircle2 size={16} className="inline ml-2" />تمت الإجابة من طرفك</button>{user.role === "admin" && <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="mr-auto bg-surface-bright border border-primary/20 rounded-lg px-3"><option value="ALL">كل المواد</option>{subjects.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}</select>}</div>
    {message && <p className="mb-4 text-primary">{message}</p>}
    <div className="space-y-4">{visible.map((q) => { const name = subjects.find((s) => s.slug === q.subject_slug)?.name ?? q.subject_slug; return <article key={q.id} className="bg-surface-bright border border-primary/10 rounded-2xl p-5"><div className="flex justify-between gap-3 mb-3"><div className="flex gap-2"><span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-caption font-bold">{name}</span>{q.unit && <span className="rounded-full bg-secondary/10 text-secondary px-3 py-1 text-caption">#{q.unit}</span>}</div><time className="text-caption text-on-surface-variant">{ago(q.created_at)}</time></div><p className="text-body-lg leading-relaxed text-on-surface whitespace-pre-wrap">{q.question_text}</p>{tab === "pending" && <div className="mt-4 flex gap-2"><textarea value={drafts[q.id] ?? ""} onChange={(e) => setDrafts((current) => ({ ...current, [q.id]: e.target.value }))} rows={3} placeholder="اكتب إجابة واضحة ومفيدة..." className="flex-1 bg-surface-bright border border-primary/20 rounded-lg p-3" /><button onClick={() => answer(q.id)} className="self-end bg-primary text-on-primary rounded-lg px-4 py-3 font-bold"><Send size={17} className="inline ml-1" />إرسال الإجابة</button></div>}</article>; })}</div>
    {!visible.length && <div className="bg-surface-container-low rounded-2xl p-12 text-center text-on-surface-variant">لا توجد أسئلة في هذا القسم.</div>}
  </div></AppShell>;
}
