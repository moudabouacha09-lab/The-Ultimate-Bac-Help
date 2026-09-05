"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/context/auth-context";
import { createClient } from "@/lib/supabase/client";
import { Bell, CheckCheck, MessageCircle, Megaphone } from "lucide-react";

type Notification = { id: string; title: string; body: string | null; question_id: string | null; is_read: boolean; created_at: string; type: "new_question" | "question_answered" | string };
const ago = (value: string) => { const m = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 60000)); return m < 60 ? `منذ ${m} دقيقة` : m < 1440 ? `منذ ${Math.floor(m / 60)} ساعة` : `منذ ${Math.floor(m / 1440)} يوم`; };

export default function NotificationsPage() {
  const { user, loading, openAuthModal } = useAuth();
  const supabase = createClient();
  const [items, setItems] = useState<Notification[]>([]);
  const load = async () => { if (!user) return; const { data } = await supabase.from("notifications").select("id, title, body, question_id, is_read, created_at, type").eq("user_id", user.id).in("type", ["new_question", "question_answered", "announcement"]).order("created_at", { ascending: false }); setItems((data as Notification[] | null) ?? []); };
  useEffect(() => { load(); }, [user]);
  const markRead = async (id: string) => { if (!user) return; await supabase.from("notifications").update({ is_read: true }).eq("id", id).eq("user_id", user.id); setItems((all) => all.map((n) => n.id === id ? { ...n, is_read: true } : n)); };
  const markAll = async () => { if (!user) return; await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false); setItems((all) => all.map((n) => ({ ...n, is_read: true }))); };
  if (loading) return <AppShell><div className="p-12 text-center">جاري التحميل...</div></AppShell>;
  if (!user) return <AppShell><div className="max-w-xl mx-auto p-12 text-center bg-surface-bright rounded-2xl">سجّل الدخول لرؤية إشعاراتك.<button onClick={() => openAuthModal("login")} className="block mx-auto mt-5 bg-primary text-on-primary px-5 py-2 rounded-lg">تسجيل الدخول</button></div></AppShell>;
  return <AppShell><div className="max-w-3xl mx-auto px-gutter py-xl" dir="rtl"><div className="flex items-center justify-between mb-8"><div><span className="text-primary font-semibold">مركز التنبيهات</span><h1 className="font-headline text-display-md text-primary font-bold mt-2">الإشعارات</h1></div><button onClick={markAll} className="inline-flex items-center gap-2 text-primary border border-primary/20 rounded-lg px-4 py-2"><CheckCheck size={17} /> تحديد الكل كمقروء</button></div>{items.length ? <div className="space-y-3">{items.map((n) => { const isAnnouncement = n.type === "announcement"; const href = isAnnouncement ? undefined : n.type === "new_question" ? "/contribute/questions" : n.question_id ? `/questions#question-${n.question_id}` : "/questions"; const content = <div className={`relative block rounded-xl border p-5 pr-7 transition hover:border-primary/40 ${n.is_read ? "bg-surface-bright border-primary/10" : "bg-primary/5 border-primary/20 font-semibold"}`}><span className={`absolute right-0 top-0 h-full w-1 rounded-r-xl ${n.is_read ? "bg-transparent" : "bg-secondary"}`} /><div className="flex gap-3"><span className={isAnnouncement ? "text-secondary" : "text-primary"}>{isAnnouncement ? <Megaphone size={21} /> : <MessageCircle size={21} />}</span><div><h2 className="text-body-lg text-on-surface">{n.title}</h2>{n.body && <p className="text-body-md text-on-surface-variant mt-1">{n.body}</p>}<time className="text-caption text-on-surface-variant block mt-3">{ago(n.created_at)}</time></div>{!n.is_read && <span className="mr-auto mt-1 h-2.5 w-2.5 rounded-full bg-secondary" aria-label="غير مقروء" />}</div></div>; return href ? <Link key={n.id} href={href} onClick={() => !n.is_read && markRead(n.id)}>{content}</Link> : <button key={n.id} type="button" onClick={() => !n.is_read && markRead(n.id)} className="block w-full text-right">{content}</button>; })}</div> : <div className="bg-surface-container-low rounded-2xl p-14 text-center"><Bell size={38} className="mx-auto text-primary/50 mb-4" /><h2 className="font-headline text-headline-md text-primary font-bold">لا توجد إشعارات</h2><p className="text-on-surface-variant mt-2">ستظهر هنا تنبيهات إجابات الأساتذة عن أسئلتك.</p></div>}</div></AppShell>;
}
