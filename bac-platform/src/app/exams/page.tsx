// src/app/exams/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { FadeInSection } from "@/components/effects/fade-in-section";
import { ExamCard, type ExamCardData } from "@/components/exams/exam-card";
import { createClient } from "@/lib/supabase/client";
import { subjects } from "@/lib/subjects";
import { AlertCircle } from "lucide-react";


type ExamRow = ExamCardData;

const EXAM_TYPE_LABELS: Record<string, string> = {
  trimestre1: "الفصل الأول",
  trimestre2: "الفصل الثاني",
  trimestre3: "الفصل الثالث",
  series: "سلسلة تمارين",
};

export default function ExamsListPage() {
  const supabase = createClient();

  const [exams, setExams] = useState<ExamRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedUnit, setSelectedUnit] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function fetchApprovedExams() {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch approved exams
        const { data: examsData, error: examsError } = await supabase
          .from("exams")
          .select("*")
          .eq("status", "approved")
          .order("created_at", { ascending: false });

        if (examsError) {
          console.error("Error fetching exams:", examsError);
          setExams([]);
          return;
        }

        if (!examsData || examsData.length === 0) {
          setExams([]);
          return;
        }

        // 2. Fetch teacher profiles for author attribution
        const userIds = [...new Set(examsData.map((e) => e.created_by).filter(Boolean))];
        let profilesMap: Record<string, { full_name?: string; title?: string }> = {};

        if (userIds.length > 0) {
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, full_name, title")
            .in("id", userIds);

          if (profilesData) {
            profilesData.forEach((p) => {
              profilesMap[p.id] = { full_name: p.full_name, title: p.title };
            });
          }
        }

        // 3. Map attribution
        const enrichedExams: ExamRow[] = examsData.map((e) => {
          const prof = profilesMap[e.created_by];
          const teacherTitle = prof?.title || prof?.full_name || null;
          return {
            ...e,
            teacherTitle,
          };
        });

        setExams(enrichedExams);
      } catch (err: any) {
        console.error("Unexpected error fetching exams:", err);
        setError("تعذر تحميل بنك الاختبارات حالياً.");
      } finally {
        setLoading(false);
      }
    }

    fetchApprovedExams();
  }, []);

  // Collect all unique units present in the exams
  const availableUnits = useMemo(() => {
    const unitsSet = new Set<string>();
    exams.forEach((exam) => {
      if (exam.units && Array.isArray(exam.units)) {
        exam.units.forEach((u) => {
          if (u && u.trim()) unitsSet.add(u.trim());
        });
      }
    });
    return Array.from(unitsSet);
  }, [exams]);

  // Filtered exams
  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      if (selectedSubject !== "ALL" && exam.subject_slug !== selectedSubject) {
        return false;
      }
      if (selectedType !== "ALL" && exam.type !== selectedType) {
        return false;
      }
      if (selectedUnit !== "ALL") {
        if (!exam.units || !exam.units.includes(selectedUnit)) {
          return false;
        }
      }
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = exam.title?.toLowerCase().includes(q);
        const unitMatch = exam.units?.some((u) => u.toLowerCase().includes(q));
        const authorMatch = exam.teacherTitle?.toLowerCase().includes(q);
        if (!titleMatch && !unitMatch && !authorMatch) {
          return false;
        }
      }
      return true;
    });
  }, [exams, selectedSubject, selectedType, selectedUnit, searchQuery]);

  const clearFilters = () => {
    setSelectedSubject("ALL");
    setSelectedType("ALL");
    setSelectedUnit("ALL");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedSubject !== "ALL" ||
    selectedType !== "ALL" ||
    selectedUnit !== "ALL" ||
    searchQuery.trim() !== "";

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-gutter py-xl flex flex-col gap-xl">
        {/* ── Page Header ── */}
        <header className="space-y-3 border-b border-primary/10 pb-6">
          <span className="font-body text-label-md text-secondary bg-secondary/10 px-3.5 py-1 rounded-full inline-block font-semibold">
            بنك النماذج والتمارين 📚
          </span>
          <h1 className="font-headline text-display-lg text-primary font-bold">
            الاختبارات والسلاسل
          </h1>
          <p className="font-body text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
            تصفح بنك الاختبارات الفصلية، الفروض المحروسة، وسلاسل التمارين النموذجية مع الحلول المفصلة والمعتمدة من طرف نخبة الأساتذة.
          </p>
        </header>

        {/* ── Advanced Filters Section ── */}
        <section
          aria-label="تصفية الاختبارات"
          className="bg-surface-bright border border-primary/10 rounded-xl p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between border-b border-primary/10 pb-3">
            <h2 className="font-headline text-headline-md text-primary font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">tune</span>
              <span>تصفية متقدمة</span>
            </h2>
            <div className="font-body text-caption font-semibold text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
              النتائج المتاحة: <strong className="text-primary font-bold">{filteredExams.length}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Subject Filter */}
            <div className="space-y-1.5">
              <label className="block font-body text-label-md font-bold text-on-surface text-right">
                المادة:
              </label>
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-2.5 font-body text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors appearance-none pr-10"
                >
                  <option value="ALL">جميع المواد الدراسية</option>
                  {subjects.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-xl">
                  expand_more
                </span>
              </div>
            </div>

            {/* Type Filter */}
            <div className="space-y-1.5">
              <label className="block font-body text-label-md font-bold text-on-surface text-right">
                نوع المحتوى:
              </label>
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-2.5 font-body text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors appearance-none pr-10"
                >
                  <option value="ALL">جميع الأنواع</option>
                  <option value="trimestre1">الفصل الأول</option>
                  <option value="trimestre2">الفصل الثاني</option>
                  <option value="trimestre3">الفصل الثالث</option>
                  <option value="series">سلسلة تمارين</option>
                </select>
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-xl">
                  expand_more
                </span>
              </div>
            </div>

            {/* Unit Filter */}
            <div className="space-y-1.5">
              <label className="block font-body text-label-md font-bold text-on-surface text-right">
                الوحدة المغطاة:
              </label>
              <div className="relative">
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-2.5 font-body text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors appearance-none pr-10"
                >
                  <option value="ALL">جميع الوحدات</option>
                  {availableUnits.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-xl">
                  expand_more
                </span>
              </div>
            </div>

            {/* Search Input */}
            <div className="space-y-1.5">
              <label className="block font-body text-label-md font-bold text-on-surface text-right">
                بحث بالاسم أو الأستاذ:
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="اكتب للبحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg pr-10 pl-4 py-2.5 font-body text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 text-xl pointer-events-none">
                  search
                </span>
              </div>
            </div>
          </div>

          {/* Active Chips Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-primary/10">
              <span className="font-body text-caption font-semibold text-on-surface-variant">
                الفلاتر النشطة:
              </span>

              {selectedSubject !== "ALL" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-on-primary rounded-full font-body text-caption font-semibold shadow-sm">
                  <span>المادة: {subjects.find((s) => s.slug === selectedSubject)?.name || selectedSubject}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSubject("ALL")}
                    className="hover:opacity-70 cursor-pointer"
                    aria-label="إزالة فلتر المادة"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </span>
              )}

              {selectedType !== "ALL" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-on-primary rounded-full font-body text-caption font-semibold shadow-sm">
                  <span>النوع: {EXAM_TYPE_LABELS[selectedType] || selectedType}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedType("ALL")}
                    className="hover:opacity-70 cursor-pointer"
                    aria-label="إزالة فلتر النوع"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </span>
              )}

              {selectedUnit !== "ALL" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-on-primary rounded-full font-body text-caption font-semibold shadow-sm">
                  <span>الوحدة: {selectedUnit}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedUnit("ALL")}
                    className="hover:opacity-70 cursor-pointer"
                    aria-label="إزالة فلتر الوحدة"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </span>
              )}

              {searchQuery.trim() !== "" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-on-primary rounded-full font-body text-caption font-semibold shadow-sm">
                  <span>بحث: &ldquo;{searchQuery}&rdquo;</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="hover:opacity-70 cursor-pointer"
                    aria-label="إزالة فلتر البحث"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={clearFilters}
                className="font-body text-caption font-bold text-secondary underline hover:opacity-80 transition-opacity cursor-pointer mr-2"
              >
                مسح جميع الفلاتر
              </button>
            </div>
          )}
        </section>

        {/* ── Loading State ── */}
        {loading && (
          <div className="bg-surface-bright border border-primary/10 rounded-2xl p-12 text-center shadow-sm">
            <div className="inline-block w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
            <p className="font-body text-body-md text-on-surface-variant">
              جاري تحميل بنك الاختبارات والسلاسل المعتمدة...
            </p>
          </div>
        )}

        {/* ── Error State ── */}
        {!loading && error && (
          <div className="bg-error/10 border border-error/20 rounded-xl p-6 text-error text-center font-body text-body-md flex items-center justify-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && filteredExams.length === 0 && (
          <div className="bg-surface-bright border border-primary/10 rounded-2xl p-10 md:p-14 text-center shadow-sm space-y-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">assignment_late</span>
            </div>
            <div className="space-y-2">
              <h2 className="font-headline text-headline-md text-primary font-bold">
                لا توجد اختبارات معتمدة مطابقة
              </h2>
              <p className="font-body text-body-md text-on-surface-variant max-w-md mx-auto leading-relaxed">
                {hasActiveFilters
                  ? "لم يتم العثور على نماذج تطابق شروط الفلترة المحددة. جرب تغيير خيارات التصفية أو مسح الفلاتر."
                  : "يتم حالياً تدقيق واعتماد نماذج جديدة من طرف الهيئة التدريسية وستتوفر قريباً."}
              </p>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="bg-primary text-on-primary font-body text-label-md font-semibold px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm cursor-pointer inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">restart_alt</span>
                <span>إعادة ضبط الفلاتر</span>
              </button>
            )}
          </div>
        )}

        {/* ── Exams Bento Grid List ── */}
        {!loading && !error && filteredExams.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="قائمة الاختبارات">
            {filteredExams.map((exam, index) => {
              return (
                <FadeInSection key={exam.id} delay={index * 50}>
                  <ExamCard exam={exam} />
                </FadeInSection>
              );
            })}
          </section>
        )}
      </div>
    </AppShell>
  );
}
