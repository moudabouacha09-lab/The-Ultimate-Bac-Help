"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/context/auth-context";
import { subjects, type Subject } from "@/lib/subjects";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, BarChart3, BookOpen, CheckCircle2 } from "lucide-react";

type AttemptRow = {
  id: string;
  self_mark: number | null;
  weak_units: string[] | null;
  exams: {
    subject_slug: string;
    type: string;
  } | {
    subject_slug: string;
    type: string;
  }[] | null;
};

function getAttemptExam(attempt: AttemptRow) {
  return Array.isArray(attempt.exams) ? attempt.exams[0] ?? null : attempt.exams;
}

type SubjectAnalytics = {
  subject: Subject;
  averageMark: number;
  attemptCount: number;
  weakUnits: string[];
  priorityScore: number;
};

function formatMark(mark: number) {
  return mark.toFixed(2);
}

function PrioritySubjectCard({ item }: { item: SubjectAnalytics }) {
  return (
    <article className="bg-surface-container-lowest border border-primary/10 rounded-xl p-5 md:p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-primary/10 pb-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">{item.subject.icon}</span>
          </div>
          <div>
            <h3 className="font-headline text-headline-md text-primary font-bold">{item.subject.name}</h3>
            <p className="font-body text-caption text-on-surface-variant mt-1">
              المعامل: <strong className="text-primary">{item.subject.defaultCoefficient}</strong>
            </p>
          </div>
        </div>
        <div className="text-right sm:text-left">
          <strong className="font-headline text-2xl text-secondary font-bold" dir="ltr">
            {formatMark(item.averageMark)} / 20
          </strong>
          <p className="font-body text-caption text-on-surface-variant mt-1">
            {item.attemptCount} {item.attemptCount === 1 ? "محاولة" : "محاولات"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 font-body text-label-md font-bold text-primary">
          <BookOpen size={16} className="text-secondary" />
          <span>الوحدات التي تحتاج مراجعة</span>
        </div>
        {item.weakUnits.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {item.weakUnits.map((unit) => (
              <span
                key={unit}
                className="bg-surface-container-high text-on-surface font-body text-caption font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">bookmark_border</span>
                {unit}
              </span>
            ))}
          </div>
        ) : (
          <p className="font-body text-caption text-on-surface-variant">
            لم تُسجل وحدات صعبة لهذه المادة بعد.
          </p>
        )}
      </div>
    </article>
  );
}

export default function AnalyticsPage() {
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      openAuthModal("login");
      router.replace("/");
    }
  }, [authLoading, user, openAuthModal, router]);

  useEffect(() => {
    if (authLoading || !user) return;

    let cancelled = false;
    const userId = user.id;

    async function fetchAttempts() {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from("exam_attempts")
        .select(`
          id,
          self_mark,
          weak_units,
          exams!inner(subject_slug, type)
        `)
        .eq("user_id", userId);

      if (cancelled) return;

      if (queryError) {
        console.error("Error loading analytics attempts:", queryError);
        setAttempts([]);
        setError("تعذر تحميل تحليلاتك حالياً.");
      } else {
        setAttempts((data as AttemptRow[]) ?? []);
      }
      setLoading(false);
    }

    fetchAttempts();
    return () => {
      cancelled = true;
    };
  }, [authLoading, supabase, user]);

  const knownSubjectAnalytics = useMemo(() => {
    const grouped = new Map<string, AttemptRow[]>();

    attempts.forEach((attempt) => {
      const slug = getAttemptExam(attempt)?.subject_slug;
      if (!slug) return;
      const subjectAttempts = grouped.get(slug) ?? [];
      subjectAttempts.push(attempt);
      grouped.set(slug, subjectAttempts);
    });

    return subjects.map((subject) => {
      const subjectAttempts = grouped.get(subject.slug) ?? [];
      const marks = subjectAttempts
        .map((attempt) => attempt.self_mark)
        .filter((mark): mark is number => typeof mark === "number" && Number.isFinite(mark));
      const averageMark = marks.length > 0 ? marks.reduce((sum, mark) => sum + mark, 0) / marks.length : 0;
      const units = new Set<string>();

      subjectAttempts.forEach((attempt) => {
        if (!Array.isArray(attempt.weak_units)) return;
        attempt.weak_units.forEach((unit) => {
          if (typeof unit === "string" && unit.trim()) units.add(unit.trim());
        });
      });

      return {
        subject,
        averageMark,
        attemptCount: subjectAttempts.length,
        weakUnits: Array.from(units),
        priorityScore: subject.defaultCoefficient * (20 - averageMark),
      } satisfies SubjectAnalytics;
    });
  }, [attempts]);

  const overallAverage = useMemo(() => {
    const marks = attempts
      .map((attempt) => attempt.self_mark)
      .filter((mark): mark is number => typeof mark === "number" && Number.isFinite(mark));
    return marks.length > 0 ? marks.reduce((sum, mark) => sum + mark, 0) / marks.length : null;
  }, [attempts]);

  const highestAttempt = useMemo(() => {
    return attempts
      .filter((attempt): attempt is AttemptRow & { self_mark: number } => (
        typeof attempt.self_mark === "number" && Number.isFinite(attempt.self_mark)
      ))
      .sort((a, b) => b.self_mark - a.self_mark)[0] ?? null;
  }, [attempts]);

  const weakUnitCount = useMemo(() => {
    const units = new Set<string>();
    attempts.forEach((attempt) => {
      if (!Array.isArray(attempt.weak_units)) return;
      attempt.weak_units.forEach((unit) => {
        if (typeof unit === "string" && unit.trim()) units.add(unit.trim());
      });
    });
    return units.size;
  }, [attempts]);

  const prioritySubjects = useMemo(
    () => knownSubjectAnalytics
      .filter((item) => item.attemptCount >= 3)
      .sort((a, b) => b.priorityScore - a.priorityScore),
    [knownSubjectAnalytics]
  );

  const lowDataSubjects = useMemo(
    () => knownSubjectAnalytics.filter((item) => item.attemptCount < 3),
    [knownSubjectAnalytics]
  );

  if (authLoading || (!user && typeof window !== "undefined")) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto px-gutter py-24 text-center">
          <div className="inline-block w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
          <p className="font-body text-body-lg text-on-surface-variant">جاري التحقق من الجلسة...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-gutter py-xl flex flex-col gap-xl">
        <header className="space-y-2 border-b border-primary/10 pb-6">
          <span className="font-body text-label-md text-secondary bg-secondary/10 px-3.5 py-1 rounded-full inline-block font-semibold">
            تحليلات الأداء الأكاديمي 📊
          </span>
          <h1 className="font-headline text-display-lg text-primary font-bold">لوحة التحليلات</h1>
          <p className="font-body text-body-lg text-on-surface-variant max-w-3xl">
            راجع نتائج اختباراتك الذاتية وحدد المواد والوحدات التي تستحق اهتمامك الآن.
          </p>
        </header>

        {loading ? (
          <section className="bg-surface-container-lowest border border-primary/10 rounded-xl p-12 text-center shadow-sm">
            <div className="inline-block w-9 h-9 border-3 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
            <p className="font-body text-body-md text-on-surface-variant">جاري تحميل نتائجك الفعلية...</p>
          </section>
        ) : error ? (
          <section className="bg-secondary/10 border border-secondary/20 rounded-xl p-8 text-center shadow-sm">
            <p className="font-body text-body-md text-secondary font-semibold">{error}</p>
          </section>
        ) : (
          <>
            {overallAverage === null ? (
              <section className="bg-surface-container-lowest border border-primary/10 rounded-xl p-8 md:p-12 shadow-sm text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mx-auto">
              <BarChart3 size={30} />
            </div>
            <div className="space-y-2">
              <h2 className="font-headline text-headline-md text-primary font-bold">ابدأ أول اختبار ذاتي</h2>
              <p className="font-body text-body-md text-on-surface-variant max-w-md mx-auto leading-relaxed">
                سجّل علامتك بعد أول اختبار حتى نعرض لك تحليلاً مبنياً على تقدمك الحقيقي.
              </p>
            </div>
            <Link
              href="/exams"
              className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-body text-label-md font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              <span>تصفح الاختبارات</span>
              <ArrowLeft size={16} />
            </Link>
              </section>
            ) : (
              <section className="bg-surface-container-lowest rounded-xl border border-primary/10 p-5 md:p-6 shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[22px]">analytics</span>
                    <h2 className="font-body text-label-md text-on-surface-variant font-semibold">المعدل العام للاختبارات المقيمة ذاتياً</h2>
                  </div>
                  <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-lg font-body text-caption">بياناتك الحالية</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <strong className="font-headline text-display-lg text-primary font-bold" dir="ltr">{formatMark(overallAverage)}</strong>
                  <span className="font-headline text-headline-md text-on-surface-variant font-medium">/ 20</span>
                </div>

                <p className="font-body text-body-md text-on-surface-variant">
                  محسوب من العلامات التي سجلتها في {attempts.length} اختباراً ذاتياً.
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-body text-caption font-semibold self-start">
                  <CheckCircle2 size={17} />
                  <span>تحليل مبني على نتائجك الفعلية</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2 p-3 bg-surface-container-low rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body text-caption text-on-surface-variant">الحصيلة المقيمة</span>
                      <strong className="font-body text-label-md font-bold text-on-surface">{attempts.length}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body text-caption text-on-surface-variant">أعلى نقطة مسجلة</span>
                      <strong className="font-body text-label-md font-bold text-on-surface" dir="ltr">
                        {highestAttempt ? `${formatMark(highestAttempt.self_mark)} / 20` : "—"}
                      </strong>
                      {getAttemptExam(highestAttempt)?.subject_slug && (
                        <span className="font-body text-caption text-on-surface-variant">
                          {subjects.find((subject) => subject.slug === getAttemptExam(highestAttempt)?.subject_slug)?.name ?? getAttemptExam(highestAttempt)?.subject_slug}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[18px]">rule</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body text-caption text-on-surface-variant">محاور الدعم</span>
                      <strong className="font-body text-label-md font-bold text-on-surface">{weakUnitCount}</strong>
                    </div>
                  </div>
                </div>
              </div>
              </section>
            )}

            <section className="space-y-5" aria-labelledby="priority-heading">
              <div className="flex items-center justify-between gap-4 border-b border-primary/10 pb-4">
                <div>
                  <h2 id="priority-heading" className="font-headline text-headline-lg text-primary font-bold">المواد التي تحتاج اهتماماً أكبر</h2>
                  <p className="font-body text-body-md text-on-surface-variant mt-1">ترتيب مبني على نتائج ثلاث محاولات أو أكثر لكل مادة.</p>
                </div>
              </div>

              {prioritySubjects.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {prioritySubjects.map((item) => <PrioritySubjectCard key={item.subject.slug} item={item} />)}
                </div>
              ) : null}

              {lowDataSubjects.length > 0 && (
                <div className="bg-surface-container-low rounded-xl p-5 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="w-11 h-11 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center shrink-0">
                      <BarChart3 size={23} />
                    </div>
                    <div className="space-y-3 flex-1">
                      <div>
                        <h3 className="font-headline text-headline-md text-primary font-bold">بيانات غير كافية حالياً</h3>
                        <p className="font-body text-body-md text-on-surface-variant mt-1 leading-relaxed">
                          أكمل ثلاث محاولات أو أكثر في المادة حتى نتمكن من ترتيبها وقراءة نقاط الضعف فيها بدقة أكبر.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {lowDataSubjects.map((item) => (
                          <span key={item.subject.slug} className="bg-surface-container text-on-surface font-body text-caption font-semibold px-2.5 py-1 rounded-lg">
                            {item.subject.name} ({item.attemptCount})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
